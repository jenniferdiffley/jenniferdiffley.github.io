# Jennifer Diffley — UX Writing Portfolio

A hand-coded static portfolio site. No frameworks, no build step for the main page, no
dependencies, no subscriptions. The case studies are encrypted with AES-256-GCM and
decrypted in the browser with a password.

**Publishing?** See **[GITHUB-SETUP.md](GITHUB-SETUP.md)** — repo, DNS, and the launch
checklist.

Live at **https://jenniferdiffley.com** (repo: `jenniferdiffley/jenniferdiffley.github.io`).

A custom domain is optional and not configured — see the end of GITHUB-SETUP.md.

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
| `src/img/` | Original full-resolution headshot | ❌ gitignored |

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

## The case study password

**Deliberately not recorded in this repository.** This repo is public and GitHub renders
this file on the front page, so a password written here would be visible to everyone —
which would defeat the encryption completely.

It lives in `tools/.password`, which is gitignored, and is shared with Jennifer privately.
To read the one currently in use:

```bash
cat tools/.password
```

> `pw.txt` in the project root is also gitignored, and is **not** read by the build. Only
> `tools/.password` (or the `PORTFOLIO_PASSWORD` env var) determines the password.

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

Drop the new PDF in at `assets/Jennifer-Diffley-Robertson-Resume-2026.pdf` (keep the filename, or
update the two `href`s in `index.html` and `RESUME` in `tools/build.mjs`), then run
`node tools/build.mjs` to regenerate `assets/resume-data.js`.

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

## Remaining configuration

Only Google Analytics is outstanding; the marker is in `index.html`.

### 1. Google Analytics

Find the `GOOGLE ANALYTICS 4` block in `<head>`, replace `G-XXXXXXXXXX` with the
Measurement ID from [analytics.google.com](https://analytics.google.com) (Admin → Data
Streams), and remove the `<!--` / `-->` around it.

### 2. Contact form — done

Wired to Jennifer's Formspree endpoint (`https://formspree.io/f/xpqvnkqy`) via
`data-endpoint` on `<form id="contactForm">`. Submissions go to her inbox; the free tier
covers 50 per month. If `fetch` ever fails, the form falls back to opening the visitor's
mail client with the message pre-filled, so it can't silently swallow an enquiry.

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

## Deploying to the client's repository

The live site lives on Jennifer's account. She renames the repo and grants collaborator
access (see [GITHUB-SETUP.md](GITHUB-SETUP.md)); the push happens from here.

Add her repo as a **second** remote rather than replacing `origin`, so this copy of the work
survives after the engagement ends:

```bash
git remote add client https://github.com/jenniferdiffley/jenniferdiffley.github.io.git
git push client main
```

Before pushing, confirm nothing sensitive is tracked:

```bash
git ls-files | grep -E '^src/|password|pw\.txt'   # must print nothing
```

Her repository was confirmed empty (no initial commit, no `README`), so a plain push
succeeds. If it is ever rejected with `non-fast-forward` or `fetch first`, something has
been committed there since; nothing in it would be worth keeping, so overwrite with
`git push --force client main`.

Then tell her to enable Pages. Subsequent updates are just `git push client main`.

Her repo must be named `jenniferdiffley.github.io` exactly, or Pages serves the site from
`/jenniferdiffley/` and `404.html` — which uses root-absolute paths — renders unstyled.

---

## Custom domain

`jenniferdiffley.com` is connected and is the site's canonical address. GitHub still serves
the same repo, so `jenniferdiffley.github.io` redirects here.

All six references were updated when the domain went live:

| File | What changed |
|---|---|
| `index.html` | `<link rel="canonical">` |
| `index.html` | `og:url` and `og:image` |
| `index.html` | `"url"` in the JSON-LD block |
| `robots.txt` | the `Sitemap:` line |
| `sitemap.xml` | the `<loc>` value |

GitHub creates the `CNAME` file itself when the domain is entered in Settings → Pages, so it
lives on the client remote rather than here — pull before pushing, or the domain config can be
clobbered.

---

## Browser support

Current Safari, Chrome, Firefox, and Edge. The decryption uses the Web Crypto API
(`crypto.subtle`), available in all of them. If a visitor's browser lacks it, the gate
shows an explanatory message rather than failing silently.
