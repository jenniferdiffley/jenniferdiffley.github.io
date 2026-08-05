#!/usr/bin/env node
/* ==========================================================================
   build.mjs — encrypt the case studies into publishable pages
   --------------------------------------------------------------------------
   Reads plaintext case study markup from src/case-studies/, inlines the mock
   images from src/mocks/ as data URIs, encrypts the whole thing with
   AES-256-GCM, and writes the result into case-studies/<slug>.html.

   Nothing in src/ is ever published — see .gitignore.

   Usage:
     node tools/build.mjs                     # password from tools/.password
     PORTFOLIO_PASSWORD=secret node tools/build.mjs
   ========================================================================== */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { webcrypto as crypto } from 'node:crypto';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

const PBKDF2_ITERATIONS = 250000;

/* --------------------------------------------------------------------------
   Case study manifest — order drives the prev/next navigation
   -------------------------------------------------------------------------- */
const CASE_STUDIES = [
  { slug: 'pubtech',             number: '01', title: 'PubTech' },
  { slug: 'brand-agent',         number: '02', title: 'Brand Agent' },
  { slug: 'sponsored-services',  number: '03', title: 'Sponsored Services' },
];

/* --------------------------------------------------------------------------
   Password
   -------------------------------------------------------------------------- */
async function getPassword() {
  if (process.env.PORTFOLIO_PASSWORD) return process.env.PORTFOLIO_PASSWORD.trim();

  const file = join(HERE, '.password');
  if (existsSync(file)) {
    const value = (await readFile(file, 'utf8')).trim();
    if (value) return value;
  }

  console.error(`
✗ No password found.

  Create tools/.password containing the password, for example:

      echo 'your-password-here' > tools/.password

  …or pass it inline:

      PORTFOLIO_PASSWORD='your-password-here' node tools/build.mjs

  tools/.password is gitignored and never published.
`);
  process.exit(1);
}

/* --------------------------------------------------------------------------
   Inline mock images as data URIs
   -------------------------------------------------------------------------- */
const imageCache = new Map();

async function inlineImages(html, slug) {
  const tokens = [...html.matchAll(/\{\{IMG:([a-z0-9-]+)\}\}/gi)];
  let out = html;

  for (const [token, name] of tokens) {
    if (!imageCache.has(name)) {
      const path = join(ROOT, 'src', 'mocks', `${name}.jpg`);
      if (!existsSync(path)) {
        throw new Error(`${slug}: missing image src/mocks/${name}.jpg`);
      }
      const buf = await readFile(path);
      imageCache.set(name, `data:image/jpeg;base64,${buf.toString('base64')}`);
    }
    out = out.split(token).join(imageCache.get(name));
  }

  return out;
}

/* --------------------------------------------------------------------------
   Encrypt
   -------------------------------------------------------------------------- */
async function encrypt(plaintext, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext)
  );

  const b64 = (bytes) => Buffer.from(bytes).toString('base64');

  return {
    v: 1,
    alg: 'AES-GCM',
    kdf: 'PBKDF2-SHA256',
    iterations: PBKDF2_ITERATIONS,
    salt: b64(salt),
    iv: b64(iv),
    ct: b64(new Uint8Array(ct)),
  };
}

/* --------------------------------------------------------------------------
   Prev / next navigation
   -------------------------------------------------------------------------- */
function buildNav(index) {
  const prev = CASE_STUDIES[index - 1];
  const next = CASE_STUDIES[index + 1];

  const arrowLeft = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>`;
  const arrowRight = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

  const left = prev
    ? `<a class="cs-nav-link cs-nav-link--prev" href="${prev.slug}.html">${arrowLeft} ${prev.title}</a>`
    : `<a class="cs-nav-link cs-nav-link--prev" href="../index.html#work">${arrowLeft} All case studies</a>`;

  const right = next
    ? `<a class="cs-nav-link cs-nav-link--next" href="${next.slug}.html">${next.title} ${arrowRight}</a>`
    : `<a class="cs-nav-link cs-nav-link--next" href="../index.html#contact">Get in touch ${arrowRight}</a>`;

  return `${left}\n      <span class="cs-nav-meta">Case study ${CASE_STUDIES[index].number} of ${String(CASE_STUDIES.length).padStart(2, '0')}</span>\n      ${right}`;
}

/* --------------------------------------------------------------------------
   Résumé download fallback
   Emits a base64 copy of the PDF so the "Download résumé" button can force a
   real download even where fetch() is unavailable (notably file://). main.js
   only loads this file if fetch fails, so it costs nothing normally.
   -------------------------------------------------------------------------- */
const RESUME = 'Jennifer-Diffley-Resume-2026.pdf';

async function buildResumeFallback() {
  const pdfPath = join(ROOT, 'assets', RESUME);
  if (!existsSync(pdfPath)) {
    console.log(`  · skipped resume-data.js (assets/${RESUME} not found)`);
    return;
  }

  const b64 = (await readFile(pdfPath)).toString('base64');
  const out = `/* Generated by tools/build.mjs — do not edit by hand.
   Base64 copy of assets/${RESUME}, used by main.js to force a
   download when fetch() isn't available (e.g. when the site is opened
   over file://). Regenerate by running: node tools/build.mjs */
window.__JD_RESUME__ = {
  filename: ${JSON.stringify(RESUME)},
  type: "application/pdf",
  b64: "${b64}"
};
`;

  const outPath = join(ROOT, 'assets', 'resume-data.js');
  await writeFile(outPath, out, 'utf8');
  console.log(`  ✓ assets/resume-data.js   ${(Buffer.byteLength(out) / 1024).toFixed(0)} KB fallback`);
}

/* --------------------------------------------------------------------------
   Main
   -------------------------------------------------------------------------- */
async function main() {
  const password = await getPassword();
  const template = await readFile(join(HERE, 'template.html'), 'utf8');
  const outDir = join(ROOT, 'case-studies');
  await mkdir(outDir, { recursive: true });

  console.log(`\nEncrypting ${CASE_STUDIES.length} case studies (AES-256-GCM, PBKDF2 ×${PBKDF2_ITERATIONS.toLocaleString()})\n`);

  for (let i = 0; i < CASE_STUDIES.length; i++) {
    const cs = CASE_STUDIES[i];
    const srcPath = join(ROOT, 'src', 'case-studies', `${cs.slug}.html`);

    if (!existsSync(srcPath)) {
      throw new Error(`missing source src/case-studies/${cs.slug}.html`);
    }

    let body = await readFile(srcPath, 'utf8');
    const plainBytes = Buffer.byteLength(body, 'utf8');
    body = await inlineImages(body, cs.slug);

    const payload = await encrypt(body, password);

    // Guard: the ciphertext must not accidentally contain source markup.
    if (payload.ct.includes('cs-block')) {
      throw new Error(`${cs.slug}: payload looks unencrypted — aborting`);
    }

    const page = template
      .replaceAll('{{TITLE}}', cs.title)
      .replaceAll('{{NUMBER}}', cs.number)
      .replaceAll('{{NAV}}', buildNav(i))
      .replaceAll('{{PAYLOAD}}', JSON.stringify(payload));

    const outPath = join(outDir, `${cs.slug}.html`);
    await writeFile(outPath, page, 'utf8');

    const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
    console.log(
      `  ✓ ${cs.slug.padEnd(20)} ${kb(plainBytes).padStart(8)} markup ` +
      `→ ${kb(Buffer.byteLength(page, 'utf8')).padStart(9)} encrypted page`
    );
  }

  console.log(`
Done. Published pages contain ciphertext only.`);

  await buildResumeFallback();

  console.log(`
  Password: ${'•'.repeat(password.length)}  (${password.length} characters)

Test locally over http — Safari treats file:// as an insecure origin, so the
case study decryption won't run there:

  python3 -m http.server 8000
  open http://localhost:8000
`);
}

main().catch((err) => {
  console.error(`\n✗ Build failed: ${err.message}\n`);
  process.exit(1);
});
