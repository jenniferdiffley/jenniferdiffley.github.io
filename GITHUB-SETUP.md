# Publishing the site

Jennifer's accounts are already set up, so most of the original guesswork is gone.
Current state:

| Thing | Value |
|---|---|
| GitHub account | `jenniferdiffley` |
| Repository | `https://github.com/jenniferdiffley/jenniferdiffley` |
| Custom domain | `jenniferdiffley.com` (she owns it) |
| Live address | `https://jenniferdiffley.com` |
| Formspree endpoint | `https://formspree.io/f/xpqvnkqy` (wired up) |

---

## Step 1 — Jennifer grants push access

The repository is on her account, so she has to let you in. Ask her to:

1. Open <https://github.com/jenniferdiffley/jenniferdiffley/settings/access>
2. Click **Add people**
3. Enter the collaborator's GitHub username and send the invite
4. The collaborator accepts via the emailed link

This is much less error-prone than walking a non-technical client through GitHub Desktop
and a manual file copy — and it avoids the risk of her accidentally uploading `src/`.

---

## Step 2 — Push

From the project folder:

```bash
git remote add origin https://github.com/jenniferdiffley/jenniferdiffley.git
git push -u origin main
```

If the remote already exists, update it instead:

```bash
git remote set-url origin https://github.com/jenniferdiffley/jenniferdiffley.git
```

> **Before pushing, confirm what's tracked:**
> ```bash
> git ls-files | grep -E '^src/|password|pw\.txt'   # must print nothing
> ```
> `src/` holds the readable case studies and the unreleased Amazon mocks. If those go up,
> the encryption is pointless.

---

## Step 3 — Enable GitHub Pages

On github.com → the repo → **Settings** → **Pages**:

- **Source:** Deploy from a branch
- **Branch:** `main`, folder `/ (root)`
- **Save**

The `CNAME` file in the repo root already contains `jenniferdiffley.com`, so Pages will
pick the custom domain up automatically once DNS resolves.

---

## Step 4 — Point the domain at GitHub

Jennifer needs to add these records wherever `jenniferdiffley.com` is managed (her
registrar or host). Existing A records for `@` should be replaced, not added to.

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `jenniferdiffley.github.io.` |

Then in **Settings → Pages → Custom domain**, confirm `jenniferdiffley.com` is present and
the DNS check passes. Once it does, tick **Enforce HTTPS** (the certificate can take up to
an hour to issue — the checkbox stays greyed out until then).

DNS propagation is usually minutes but can take several hours. Verify with:

```bash
dig +short jenniferdiffley.com
curl -sI https://jenniferdiffley.com | head -1
```

> **Note on the repo name.** The repo is `jenniferdiffley`, not
> `jenniferdiffley.github.io`, which makes it a *project* page. That's fine — with a custom
> domain the site is still served at the domain root, so every path works. The only side
> effect is that the bare fallback URL is
> `jenniferdiffley.github.io/jenniferdiffley/`, where `404.html` renders unstyled because
> it uses root-absolute paths. Harmless, since `jenniferdiffley.com` is the address she'll
> actually share. Renaming the repo to `jenniferdiffley.github.io` would tidy that up if
> you'd rather.

---

## Step 5 — Test the live site

- [ ] `https://jenniferdiffley.com` loads over HTTPS with a valid certificate
- [ ] `http://` and `www.` both redirect to the canonical HTTPS address
- [ ] Dark mode toggle works and survives a reload
- [ ] **Download résumé** downloads the PDF rather than previewing it
- [ ] A case study shows the password gate; the correct password unlocks it and the mocks appear
- [ ] A wrong password shows an error and reveals nothing
- [ ] View Source on a case study shows only ciphertext
- [ ] `https://jenniferdiffley.com/assets/mocks/` returns 404 (the mocks must have no URL)
- [ ] Contact form submits and the message arrives in her inbox via Formspree
- [ ] A made-up URL like `/nope` shows the styled 404 page
- [ ] Layout holds up on a phone

---

## Making changes later

Edit, commit, push — Pages redeploys in about a minute:

```bash
git add -A && git commit -m "Describe the change" && git push
```

To change the case study password or edit a case study, see `README.md`. Those steps
require `node tools/build.mjs`, because the case studies are encrypted at build time.
