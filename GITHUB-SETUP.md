# Publishing the site

## Current state

| Thing | Value |
|---|---|
| GitHub account | `jenniferdiffley` |
| Repository | `jenniferdiffley/jenniferdiffley.github.io` |
| Live address | `https://jenniferdiffley.github.io` |
| Formspree endpoint | `https://formspree.io/f/xpqvnkqy` (wired up) |
| Custom domain | Not configured — optional, see the end of this file |

The delivered site is the GitHub Pages address above. A custom domain is a separate,
optional step that depends on Jennifer's registrar rather than on the site.

---

## Step 1 — Jennifer imports the site into her account

Entirely in the browser — no local tooling needed on her side.

1. Go to <https://github.com/new/import>
2. **Your old repository's clone URL:** the source repo's `.git` URL
3. **Owner:** `jenniferdiffley`
4. **Repository name:** `jenniferdiffley.github.io` — this exact spelling is what makes
   Pages serve the site from the domain root rather than a `/subfolder/`. It also means
   `404.html`, which uses root-absolute paths, renders correctly.
5. Leave it **Public** and click **Begin import**

Naming it anything else still works, but the site would live at
`jenniferdiffley.github.io/<name>/` and the 404 page would render unstyled.

---

## Step 2 — She grants push access for revisions

So that revision notes can be applied directly rather than re-importing:

1. <https://github.com/jenniferdiffley/jenniferdiffley.github.io/settings/access>
2. **Add people** → the collaborator's GitHub username → send invite
3. The collaborator accepts via the emailed link

Note that collaborators get **Write**, not **Admin**. Enabling Pages and setting a custom
domain both require Admin, so those two actions stay with Jennifer.

---

## Step 3 — She enables GitHub Pages

Repo → **Settings** → **Pages**:

- **Source:** Deploy from a branch
- **Branch:** `main`, folder `/ (root)`
- **Save**

Two or three minutes later the site is live at <https://jenniferdiffley.github.io>.

---

## Step 4 — Verify

- [ ] Site loads over HTTPS with a valid certificate
- [ ] Dark mode toggles and survives a reload
- [ ] **Download résumé** downloads the PDF rather than previewing it
- [ ] A case study shows the gate; the correct password unlocks it and the mocks appear
- [ ] A wrong password shows an error and reveals nothing
- [ ] View Source on a case study shows only ciphertext
- [ ] `https://jenniferdiffley.github.io/assets/mocks/` returns 404 — the mocks must have
      no fetchable URL of their own
- [ ] The lightbox opens when a mock is clicked
- [ ] Contact form submits and the message arrives via Formspree
- [ ] A made-up URL such as `/nope` shows the styled 404 page
- [ ] Layout holds on a phone

---

## Making changes

```bash
git add -A && git commit -m "Describe the change" && git push
```

Pages redeploys in about a minute. To change the case study password or edit a case study,
see `README.md` — those steps require `node tools/build.mjs`, because the case studies are
encrypted at build time.

---

## Optional — using a custom domain

**Not part of the build, and not configured.** The site is delivered and complete at the
GitHub Pages address. This section exists so the steps are on record if Jennifer wants to
point `jenniferdiffley.com` at it; the work happens at her registrar, which nobody else
can access on her behalf.

**1. At her domain registrar**, replace any existing `A` records for `@`:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `jenniferdiffley.github.io.` |

**2. In GitHub** → Settings → Pages → **Custom domain** → enter `jenniferdiffley.com` →
Save. GitHub writes a `CNAME` file into the repo automatically.

**3.** Once the DNS check passes, tick **Enforce HTTPS**. The certificate can take up to an
hour to issue, and the checkbox stays greyed out until it does.

**4.** Verify:

```bash
dig +short jenniferdiffley.com
curl -sI https://jenniferdiffley.com | head -1
```

DNS propagation is usually minutes but can take several hours.

**5.** Afterwards, five references should be updated from the github.io address to the
custom domain, or search engines and link previews will keep pointing at the old one:

- `index.html` — `<link rel="canonical">`
- `index.html` — `og:url` and `og:image`
- `index.html` — `"url"` in the JSON-LD block
- `robots.txt` — the `Sitemap:` line
- `sitemap.xml` — the `<loc>` value

These are marked with a comment in `index.html`. It's a two-minute edit.
