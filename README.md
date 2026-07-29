# Jennifer Diffley — UX Writing Portfolio

A hand-coded static portfolio site. No frameworks, no build step for the main page, no
dependencies, no subscriptions. The case studies are encrypted with AES-256-GCM and
decrypted in the browser with a password.

**New to GitHub?** Start with **[GITHUB-SETUP.md](GITHUB-SETUP.md)** — it walks through
creating an account and publishing the site, step by step.

---

## Contents

| Path | What it is | Published? |
|---|---|---|
| `index.html` | The whole main site — one page, anchor navigation | ✅ |
| `404.html` | Not-found page | ✅ |
| `main.css` | Design system: type scale, palette, layout, dark mode | ✅ |
| `main.js` | Theme toggle, mobile nav, scroll reveals, stat counters, contact form | ✅ |
| `case-study.css` | Password gate + long-form reading layout | ✅ |
| `case-study.js` | In-browser AES decryption and image lightbox | ✅ |
| `case-studies/*.html` | Generated. Contains **ciphertext only** | ✅ |
| `assets/` | Headshot and résumé PDF | ✅ |
| `assets/resume-data.js` | Generated. Base64 résumé, used only as a download fallback | ✅ |
| `tools/build.mjs` | The encryption build script | ✅ |
| `tools/template.html` | Page shell the build script fills in | ✅ |
| `tools/.password` | The case study password | ❌ gitignored |
| `src/case-studies/*.html` | **Readable** case study markup — the real source | ❌ gitignored |
| `src/mocks/*.jpg` | Unreleased Amazon design mocks | ❌ gitignored |
| `src/*.png` | Original full-resolution mock exports | ❌ gitignored |

> ### The one rule
> **Never commit `src/` or `tools/.password`.**
>
> `src/` holds the only readable copy of the case studies and the only standalone copy of
> the design mocks. If it were published, the encryption would be pointless — anyone could
> read the content or fetch the images by URL. `.gitignore` blocks both, so this is handled
> as long as `.gitignore` stays in place.

---

## How the password protection works

Most "password protected" static sites just hide a `<div>` with JavaScript — the content is
still sitting in the page source for anyone who looks. This isn't that.

**At build time** (`tools/build.mjs`):

1. Reads the readable case study markup from `src/case-studies/<slug>.html`
2. Replaces each `{{IMG:name}}` token with the matching image from `src/mocks/name.jpg`,
   inlined as a base64 data URI — so the images are *inside* the encrypted bundle
3. Derives a 256-bit key from the password with PBKDF2-SHA256, 250,000 iterations, random
   16-byte salt
4. Encrypts everything with AES-256-GCM using a random 12-byte IV
5. Writes `case-studies/<slug>.html` from the template, with the ciphertext embedded as JSON

**In the browser** (`case-study.js`) the same derivation runs on the visitor's password. If
it's wrong, the GCM authentication tag fails and nothing renders — there is no content to
reveal. A correct password decrypts the markup and injects it into the page.

Practical consequences:

- Viewing source on a case study page shows base64 ciphertext.
- The design mocks have no URL of their own. They cannot be fetched, hotlinked, or found by
  image search.
- The password is never transmitted or stored server-side.
- Once unlocked, the password is kept in `sessionStorage` so moving between the three case
  studies doesn't re-prompt. It clears when the tab closes.
- Requires a secure context: works on `https://` and on `http://localhost`. Chrome and
  Firefox also treat `file://` as secure, but Safari does not — so for local testing, use a
  local server (below) rather than double-clicking the file.

---

## Current password

```
diffley-ux-2026
```

Stored in `tools/.password`. **Change this before sharing the site** — see below.

---

## Changing the password

```bash
cd <project folder>
echo 'the-new-password' > tools/.password
node tools/build.mjs
```

Then commit and push the regenerated `case-studies/*.html`. Requires
[Node.js](https://nodejs.org) 18 or newer (`node --version` to check).

You can also pass it inline without saving it to a file:

```bash
PORTFOLIO_PASSWORD='the-new-password' node tools/build.mjs
```

### Want a different password per case study?

Currently all three share one password. To split them, give each entry in the
`CASE_STUDIES` array in `tools/build.mjs` its own `password` field and pass it to
`encrypt()` instead of the shared one.

---

## Editing a case study

1. Edit `src/case-studies/<slug>.html` — plain HTML using the classes in `case-study.css`
   (`cs-block`, `cs-prose`, `cs-steps`, `cs-results`, `cs-figure`, `cs-callout`)
2. Run `node tools/build.mjs`
3. Commit and push

To add a new image: drop a JPEG into `src/mocks/`, then reference it in the markup as
`<img src="{{IMG:filename-without-extension}}" alt="...">`.

To add a whole new case study: create `src/case-studies/<slug>.html`, add an entry to
`CASE_STUDIES` in `tools/build.mjs`, rebuild, then add a card to the case study list in
`index.html`.

---

## Editing the main site

`index.html` is a single readable file with commented section markers. Edit it directly —
no build step. Sections in order: nav, hero, about, stats, case studies, copywriting,
experience + education, skills, recommendations, contact, footer.

---

## Replacing the résumé

Drop the new PDF in at `assets/Jennifer-Diffley-Resume-2025.pdf` (keep the filename, or
update the two `href`s in `index.html`), then run `node tools/build.mjs` to regenerate
`assets/resume-data.js`.

That generated file is a base64 copy of the PDF. The "Download résumé" buttons force a
real download by building a Blob rather than trusting the `download` attribute — Safari
ignored that attribute for years, and any browser set to open PDFs inline will preview the
file instead. `main.js` gets the bytes via `fetch()` normally, and only falls back to
`resume-data.js` if fetch is unavailable, which is what happens when the site is opened
over `file://`. So it costs nothing on a real page load, but the button behaves the same
everywhere.

If you forget to rebuild, the download still works over http(s) — only the `file://` case
would serve a stale résumé.

---

## Local testing

```bash
cd <project folder>
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Use a server rather than opening the file directly so
the case study decryption works in every browser.

---

## Two things to finish configuring

Both are marked with comments in `index.html`.

### 1. Google Analytics

Find the `GOOGLE ANALYTICS 4` block in `<head>`, replace `G-XXXXXXXXXX` with the
Measurement ID from [analytics.google.com](https://analytics.google.com) (Admin → Data
Streams), and remove the `<!--` / `-->` around it.

### 2. Contact form

The form currently falls back to opening the visitor's email client with the message
pre-filled — which works, but keeps the visitor in their mail app.

To have submissions arrive by email instead:

1. Sign up free at [formspree.io](https://formspree.io)
2. Create a form and copy the endpoint (e.g. `https://formspree.io/f/abcdwxyz`)
3. Paste it into `data-endpoint=""` on the `<form id="contactForm">` element

The free tier covers 50 submissions per month.

---

## Design notes

- **Type** — Fraunces (display serif, variable) and Newsreader (reading serif) from Google
  Fonts. System sans for small UI labels, so only two webfonts load.
- **Palette** — warm paper `#fbfaf7`, deep pine `#1b4d45`, bronze `#a98363`. Bronze echoes
  the accent in Jennifer's résumé. Full dark palette defined under
  `html[data-theme="dark"]`.
- **Dark mode** — follows the OS by default, overridable by the toggle, persisted to
  `localStorage`. Applied before first paint so there's no flash of the wrong theme.
- **Accessibility** — skip link, visible focus rings, `prefers-reduced-motion` honoured
  (animations and counters disabled), labelled form fields, `aria-live` status messages,
  semantic landmarks, alt text on every image.
- **Performance** — no frameworks; the main page is ~40 KB of HTML/CSS/JS plus the
  headshot. Case study pages are larger (760 KB–1.1 MB) because the encrypted image bundle
  ships inside the page. That's the cost of the mocks having no fetchable URL.
- **SEO** — meta description, Open Graph tags, JSON-LD `Person` schema, sitemap. Case study
  pages are `noindex` since they're gated.

---

## Browser support

Current Safari, Chrome, Firefox, and Edge. The decryption uses the Web Crypto API
(`crypto.subtle`), available in all of them. If a visitor's browser lacks it, the gate
shows an explanatory message rather than failing silently.
