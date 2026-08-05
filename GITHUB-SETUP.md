# Getting your portfolio live

A step-by-step guide, written for someone who has never used GitHub. Everything on your side
happens in your web browser — there's nothing to install and no code to touch.

**Your site is uploaded and ready. One step is left, and it has to be you:** publishing is an
owner-only setting, and the access you gave Joon deliberately doesn't reach repository
settings. It's five clicks — [Step 3](#step-3--turn-the-website-on) below, about two minutes.

Steps 1 and 2 are already done. They're kept here as a record of how the site was set up.

---

## Where your site will live

Your website is a set of files. GitHub stores them and serves them to the internet — free,
with no monthly fee and nothing to maintain.

Once Step 3 is done, your portfolio will be live at:

**https://jenniferdiffley.github.io**

That is your finished site: a real, permanent, professional address you can put on a résumé
or send to a recruiter today. Nothing about it is temporary or half-built.

You also own **jenniferdiffley.com**, and you can point that at this site later if you'd
like. That part is optional and separate — instructions are at the end of this page.

---

## Before you start

You'll need:

- To be logged in to GitHub as **jenniferdiffley**
- The case study password. Joon is sending that in a separate message — it deliberately
  isn't written down here, because this page is public.

---

## Step 1 — Your repository ✅ done

You created it with exactly the right name:

```
jenniferdiffley.github.io
```

That spelling — your username, followed by `.github.io` — is what gives you the clean
address `jenniferdiffley.github.io`. Any other name would have produced something longer,
like `jenniferdiffley.github.io/portfolio/`.

It's also set to **public**, which matters: on a free GitHub account, websites can only be
published from public repositories. Your case studies stay protected either way — they're
encrypted, so a public folder contains nothing but scrambled text.

---

## Step 2 — Joon's access, and the upload ✅ done

You invited **`joonyoung82`** as a collaborator, and the finished site is now in your
repository — you'll see the files listed when you open it.

His access level is **write**, which lets him add and update the site files, including
applying your revision notes directly. It does *not* include repository settings. That's
the reason the next step has to be you rather than him.

You remain the owner throughout, and you can remove his access with a single click once
you're happy with everything.

---

## Step 3 — Turn the website on

This is the only step left. It tells GitHub to start serving the files that are already
sitting in your repository.

> **Before you start, this is normal:** visiting **https://jenniferdiffley.github.io** right
> now shows a GitHub page reading *"404 — There isn't a GitHub Pages site here."* Your files
> are uploaded; GitHub simply hasn't been told to publish them yet. This step is what tells
> it.

1. Open your repository:
   **https://github.com/jenniferdiffley/jenniferdiffley.github.io**
2. Click **Settings** — in the row of tabs across the top, at the right-hand end
3. In the left-hand sidebar, click **Pages**
4. Under **Build and deployment**, set:
   - **Source** to **Deploy from a branch**
   - **Branch** to `main`, with the folder beside it set to `/ (root)`
5. Click **Save**

Wait two or three minutes, then reload that page. A green banner will appear with your live
address. Your portfolio is now on the internet.

> If the sidebar has no **Pages** entry and the page says *"You don't have access to
> repository options,"* you're signed in as someone other than **jenniferdiffley** — sign
> out and back in as yourself.

> If you see "page not found" straight after saving, that's normal on the very first
> publish. Wait five minutes and reload with **Cmd + Shift + R** (**Ctrl + Shift + R** on
> Windows).

---

## Step 4 — Check it over

Please work through this list and tell Joon about anything that looks off, however small.
Wording, spacing, a photo you'd rather swap — all fair game. That's what the revisions are
for.

- [ ] The homepage loads, with your name, photo, and every section
- [ ] The sun/moon button at the top right switches to dark mode, and it stays switched
      after you reload
- [ ] **Résumé** downloads the PDF rather than opening it in a tab, and the file that lands
      is `Jennifer-Diffley-Resume-2026.pdf`
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

**"404 — There isn't a GitHub Pages site here"**
Step 3 hasn't been done yet, or hasn't finished. This is GitHub saying "no website is
switched on at this address" — not "your files are missing." Go back to Step 3.

**"Page not found" straight after finishing Step 3**
The first publish takes a few minutes. Wait five, then reload with **Cmd + Shift + R**.

**The site loads but looks like plain text on a white page**
The repository name has to stay exactly `jenniferdiffley.github.io`. If it's ever renamed,
the styling stops loading. You can correct it under **Settings → General → Repository
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
site need updating to match — they're listed near the end of `README.md`.

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
