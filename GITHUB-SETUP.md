# Getting your portfolio online

A step-by-step guide, written for someone who has never used GitHub. No coding required —
GitHub is just acting as free, fast, reliable web hosting here.

Total time: about 20 minutes.

---

## What you're setting up

Your site is a set of files. GitHub stores them and serves them to the internet for free,
over HTTPS, with no monthly fee and no subscription. This is called **GitHub Pages**.

There is one important detail specific to your site: **the case studies are encrypted**.
Some files on your computer must never be uploaded, because uploading them would defeat the
password protection. Step 4 handles this automatically — just follow it exactly.

---

## Step 1 — Create your GitHub account

1. Go to **[github.com/signup](https://github.com/signup)**
2. Enter your email (`jenniferdiffley@gmail.com` is fine)
3. Create a password and solve the puzzle
4. **Choose your username carefully.** It becomes part of your website address.

   | Username | Your site will be |
   |---|---|
   | `jenniferdiffley` | `https://jenniferdiffley.github.io` |
   | `jdiffley` | `https://jdiffley.github.io` |

   Lowercase, no spaces. `jenniferdiffley` is the cleanest option if it's available.

5. Verify your email address when GitHub sends the code.

You can skip every "personalize your experience" question. Choose the **Free** plan.

---

## Step 2 — Create the repository

A "repository" (or "repo") is just a folder for your project.

1. Once logged in, click the **+** in the top-right → **New repository**
2. **Repository name** — this matters. Type exactly:

   ```
   <your-username>.github.io
   ```

   So if your username is `jenniferdiffley`, the repository name is
   `jenniferdiffley.github.io`. This exact naming is what tells GitHub to publish it as
   your main website.

3. Set it to **Public**.
   *(The case studies stay protected — they're encrypted, so a public repository only
   exposes scrambled text. See the note at the bottom.)*
4. Leave "Add a README file" **unchecked**.
5. Click **Create repository**.

---

## Step 3 — Install GitHub Desktop

This is the app that moves files from your computer to GitHub. It avoids the command line
entirely.

1. Download from **[desktop.github.com](https://desktop.github.com)**
2. Install and open it
3. Click **Sign in to GitHub.com** and log in with the account from Step 1
4. When it asks to configure Git, accept the defaults

---

## Step 4 — Add your site files

1. In GitHub Desktop: **File → Clone repository**
2. Select your `<your-username>.github.io` repository → **Clone**.
   Note the folder it saves to (usually `Documents/GitHub/<your-username>.github.io`)
3. Open that folder in Finder
4. From the delivered project folder, copy **everything except the `src` folder** into it:

   ```
   ✅ COPY THESE                    ❌ DO NOT COPY
   ─────────────────────            ─────────────────────
   index.html                       src/          ← never upload this
   404.html
   main.css
   main.js
   case-study.css
   case-study.js
   robots.txt
   sitemap.xml
   .gitignore       ← important
   assets/
   case-studies/
   tools/
   ```

   > **Why not `src`?** That folder holds the readable, unencrypted case studies and the
   > original design images. The `.gitignore` file also blocks it automatically as a
   > safety net — which is why copying `.gitignore` matters.

5. Back in GitHub Desktop you'll see the files listed on the left.
6. In the bottom-left box, type a short message like `Add portfolio site`
7. Click **Commit to main**
8. Click **Push origin** at the top

---

## Step 5 — Turn on GitHub Pages

1. On github.com, open your repository
2. Click **Settings** (top of the page)
3. In the left sidebar, click **Pages**
4. Under "Build and deployment":
   - **Source:** Deploy from a branch
   - **Branch:** `main`, folder `/ (root)`
5. Click **Save**

Wait 1–3 minutes, then reload the page. GitHub will show a green banner with your live
address:

```
https://<your-username>.github.io
```

That's your portfolio. Send it to anyone.

---

## Step 6 — Test it

Open your site and check:

- [ ] The homepage loads with your name, photo, and sections
- [ ] The dark mode button (top right) works
- [ ] Clicking a case study shows the **password screen**
- [ ] Entering your password unlocks the case study and the images appear
- [ ] Entering a *wrong* password shows an error and reveals nothing
- [ ] It looks right on your phone

---

## Using a custom domain (optional)

You mentioned you already have a hosting provider. If you own a domain like
`jenniferdiffley.com`, you can point it at this site instead of the `github.io` address.

1. **In your domain provider's DNS settings**, add these records:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `<your-username>.github.io` |

2. **In GitHub** → Settings → Pages → Custom domain: enter `jenniferdiffley.com` → Save
3. Wait for the check to pass, then tick **Enforce HTTPS**

DNS changes can take a few hours to take effect. Once it works, update the two URLs marked
in `index.html` (`<link rel="canonical">` and the `og:url` tag) to your real domain.

---

## Making changes later

Any time you edit a file:

1. Open GitHub Desktop
2. Type a short description of what changed
3. **Commit to main** → **Push origin**

Your live site updates within about a minute.

To change your case study password or edit the case studies themselves, see
`README.md` — that one does involve one terminal command, and I'm happy to walk you
through it or do it for you.

---

## A note on the password protection

Your case studies are protected with **AES-256 encryption**, not just a hidden password
field. Concretely:

- The published files contain scrambled text only. There is no copy of the readable
  content anywhere online.
- "View Source" on a case study page shows ciphertext.
- The images are encrypted inside the same bundle, so nobody can guess an image URL and
  download the mocks directly.
- The password is never stored on the site. It's used to derive the decryption key in the
  visitor's browser.

This is why your public repository is safe, **as long as the `src` folder is never
uploaded.** That folder is the only place the readable version lives, and `.gitignore`
is configured to block it.
