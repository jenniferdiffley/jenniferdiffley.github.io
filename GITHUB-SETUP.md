# Getting your portfolio live

A step-by-step guide, written for someone who has never used GitHub. Everything happens in
your web browser — there's nothing to install and no code to touch.

Four steps, about ten minutes, most of it waiting.

---

## Where your site will live

Your website is a set of files. GitHub stores them and serves them to the internet — free,
with no monthly fee and nothing to maintain.

Once you've done the four steps below, your portfolio will be live at:

**https://jenniferdiffley.github.io**

That is your finished site: a real, permanent, professional address you can put on a résumé
or send to a recruiter today. Nothing about it is temporary or half-built.

You also own **jenniferdiffley.com**, and you can point that at this site later if you'd
like. That part is optional and separate — the instructions are at the end of this page.

---

## Before you start

You'll need:

- To be logged in to GitHub as **jenniferdiffley**
- The case study password. Joon is sending that in a separate message — it deliberately
  isn't written down here, because this page is public.

---

## Step 1 — Copy the site into your account

GitHub can copy the whole website into your account for you. No downloading, no unzipping,
no dragging files around.

1. Go to **https://github.com/new/import**

2. In the box labelled **Your old repository's clone URL**, paste exactly this:

   ```
   https://github.com/joonyoung82/jennifer-diffley-portfolio.git
   ```

3. Set **Owner** to `jenniferdiffley`

4. Set **Repository name** to exactly:

   ```
   jenniferdiffley.github.io
   ```

   This spelling matters. It's what gives you the clean web address, rather than one with an
   extra folder name stuck on the end.

5. Leave it set to **Public**.

   Your case studies stay protected either way — they're encrypted, so a public folder
   contains nothing but scrambled text. There's more on this at the bottom of the page.

6. Click **Begin import**

It takes a minute or two and shows you progress as it goes. When it finishes, all the
website files are in your own account, under your own name.

> The repository you created earlier, called just `jenniferdiffley`, isn't needed. Leave it
> alone for now — we can tidy it up whenever.

---

## Step 2 — Add Joon so he can make your revisions

Your package includes revisions. This lets him apply your notes directly, instead of sending
you files to copy around.

1. Go to **https://github.com/jenniferdiffley/jenniferdiffley.github.io/settings/access**
2. Click **Add people**
3. Type **`joonyoung82`** and send the invitation

You remain the owner the whole time, and you can remove his access with one click once
you're happy with everything.

---

## Step 3 — Turn the website on

The files are stored now, but not yet published. This publishes them.

1. Open your repository:
   **https://github.com/jenniferdiffley/jenniferdiffley.github.io**
2. Click **Settings** — in the row of tabs across the top, at the right-hand end
3. In the left-hand sidebar, click **Pages**
4. Under **Build and deployment**, check that:
   - **Source** is set to **Deploy from a branch**
   - **Branch** is set to `main`, with the folder beside it set to `/ (root)`
5. Click **Save** if you changed anything

Wait two or three minutes, then reload that page. A green banner will appear with your live
address. Your portfolio is now on the internet.

> If you see "page not found" at first, that's normal on the very first publish. Wait five
> minutes and reload with **Cmd + Shift + R** (**Ctrl + Shift + R** on Windows).

---

## Step 4 — Check it over

Please work through this list and tell Joon about anything that looks off, however small.
Wording, spacing, a photo you'd rather swap — all fair game. That's what the revisions are
for.

- [ ] The homepage loads, with your name, photo, and every section
- [ ] The sun/moon button at the top right switches to dark mode, and it stays switched
      after you reload
- [ ] **Résumé** downloads the PDF rather than opening it in a tab
- [ ] Clicking a case study brings up a password screen
- [ ] The correct password unlocks it and the design images appear
- [ ] A wrong password shows an error and reveals nothing
- [ ] Clicking an image inside a case study enlarges it
- [ ] In the Copywriting section, the Younique catalogue opens, and the Nuro, Medium and
      1Password links all work
- [ ] Sending yourself a message through the contact form arrives in your inbox
- [ ] Everything looks right on your phone

It's worth opening the case studies in a browser you've never used them in — that way you
see exactly what a recruiter sees.

---

## If something looks wrong

**"Page not found" at your new address**
The first publish takes a few minutes. Wait five, then reload with **Cmd + Shift + R**.

**The site loads but looks like plain text on a white page**
The repository name is probably slightly off. It needs to be exactly
`jenniferdiffley.github.io`. You can correct it under **Settings → General → Repository
name**.

**A case study says JavaScript is needed**
The case studies are decrypted inside your browser, so JavaScript has to be switched on. It
is by default in every normal browser.

**The password won't work**
Check for a stray space copied at the beginning or end. It's also case-sensitive.

**Anything else**
Send Joon a screenshot and the address you were on. Nothing you can click will break
anything permanently — every version is saved, and anything can be undone.

---

## Optional — pointing jenniferdiffley.com at your site

Your site is complete and live at the GitHub address above. This part is optional and sits
outside the original build: the website itself is the deliverable, whereas a custom domain
is configured at your domain registrar, which only you can log into. The steps are short,
so they're here in case you want them.

**1.** Wherever `jenniferdiffley.com` is managed, add the records below. Replace any
existing A records for `@` rather than adding alongside them.

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `jenniferdiffley.github.io.` |

**2.** Back in GitHub: **Settings → Pages → Custom domain**, type `jenniferdiffley.com`,
and click **Save**.

**3.** Once GitHub's check passes, tick **Enforce HTTPS**. The security certificate can take
up to an hour to issue, so that box stays greyed out until it's ready.

Domain changes usually take a few minutes but can take several hours to spread across the
internet.

If you'd rather not do this yourself, message Joon and it can be arranged as a small
add-on. Either way, let him know once it's working, because a few web addresses inside the
site need updating to match — they're listed for reference at the bottom of `README.md`.

---

## A note on the password

Your case studies aren't merely hidden behind a prompt — they're genuinely encrypted with
the same class of encryption used for banking.

In practice that means:

- The published files contain scrambled text only. Viewing the page source shows nothing
  readable.
- The design images are encrypted *inside* those files, so nobody can guess an image
  address and download your Amazon mockups directly.
- The password is never stored on the site or sent anywhere. It's used to unscramble the
  content inside your visitor's own browser.

Two practical things: share the password by email or message rather than posting it
anywhere public, and if you ever want it changed, just ask — it takes a couple of minutes.

---

## Making changes later

Send changes to Joon and he'll make them. If you'd like to edit your own text down the
line, he can show you — it's genuinely just a few clicks.

One thing to avoid: don't delete the folder called `tools`, or anything inside `assets`.
The case studies are rebuilt from those.

Technical notes about how the site is built, how to change the password, and how to edit a
case study are in **[README.md](README.md)**.
