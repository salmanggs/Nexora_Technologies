# Nexora Technologies — Website

Static website. Plain HTML, CSS and JavaScript — **no build step, no npm, no framework**.
Upload the folder to any host and it works.

Build. Automate. Grow.

---

## 1. Files

```
index.html                    Home
about.html                    About Us
services.html                 Services (6 detailed sections)
solutions.html                Solutions by industry
portfolio.html                Ahwal e Shahkot, Facebook bots, Apna Shehar
blog.html                     Blog listing
post-ahwal-e-shahkot.html     Blog post
post-facebook-automation.html Blog post
post-website-worth-it.html    Blog post
contact.html                  Contact + enquiry form
quote.html                    Project brief / quote form
privacy.html                  Privacy policy
terms.html                    Terms of service
404.html                      Not-found page

assets/css/style.css          All styling (one file)
assets/js/main.js             All behaviour (one file)
assets/img/logo.svg           The N mark
assets/img/favicon.svg        Browser tab icon
assets/img/og.jpg             Share preview (WhatsApp / Facebook), 1200x630
assets/img/ahwal-e-shahkot-app.jpg   ← YOU NEED TO ADD THIS (see below)

.htaccess                     Apache config: https, caching, 404, security headers
robots.txt                    Search engine rules
sitemap.xml                   Page list for Google
```

---

## 2. ⚠️ Add the app screenshot

The Ahwal e Shahkot case study on `portfolio.html` shows the app inside a phone
frame. Save your screenshot here, with this exact name:

```
assets/img/ahwal-e-shahkot-app.jpg
```

A tall portrait screenshot (the app's home screen) is ideal — roughly 9:18.5,
like a normal phone screen grab. It is displayed at about 190px wide, so
anything from 700px wide upwards looks sharp.

**Until you add it**, the phone frame falls back to a neutral wireframe
placeholder — nothing looks broken, you just do not see the real app. To use a
`.png` instead, change the `src` on line ~90 of `portfolio.html`.

---

## 3. Change your contact details in ONE place

Open `assets/js/main.js`. The first block is:

```js
var CFG = {
  phone:     '03425844921',
  phoneIntl: '923425844921',        // for wa.me / tel: links
  email:     'salmanmalhig@gmail.com',
  ...
};
```

Edit those three lines and **every** phone number, email and WhatsApp
button on the whole site updates automatically. Anything marked
`data-cfg="phone"`, `data-cfg="email"` or `data-cfg="wa"` is filled in from here.

> The values are also hard-coded in the HTML as a fallback (so the page still shows
> something if JavaScript is off). If you change your number permanently, do a
> find-and-replace across the `.html` files too — search for `03425844921`,
> `923425844921` and `salmanmalhig@gmail.com`.

**Zuhaib's details** (Sales & Marketing) are separate — they appear on
`contact.html` and in the team card on `about.html`. Search for `03007276731`,
`923007276731` and `zuhaibzaibee8@gmail.com` to change them.

---

## 4. Making the contact forms email you

Right now, **both forms send through WhatsApp**. When someone submits, WhatsApp
opens with the whole enquiry pre-written and they just press Send. This works
with zero setup and zero cost, and it is the fastest option for most Pakistani
clients.

If you would rather receive enquiries **by email**:

1. Go to [web3forms.com](https://web3forms.com) and enter your email. It is free.
2. You will receive an **access key** (a long string).
3. In `assets/js/main.js`, paste it:

```js
formEndpoint: 'your-access-key-here',
formProvider: 'web3forms'
```

That is it. Submissions now arrive in your inbox. If the email service is ever
down, the form automatically falls back to WhatsApp, so no enquiry is ever lost.

**Formspree** works too — set `formProvider: 'formspree'` and put your full
Formspree URL in `formEndpoint`.

---

## 5. Putting it online

### Vercel (recommended — free, fastest)
1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Framework preset: **Other**. Build command: **leave empty**. Output directory: **leave empty** (root).
4. Deploy. You get a URL like `nexora-technologies.vercel.app` with https already on.

`vercel.json` is included — it sets caching and security headers, and Vercel
uses `404.html` automatically.

> Even faster with no GitHub: install the CLI (`npm i -g vercel`), then run
> `vercel` inside this folder.

### Render
**New → Static Site** → connect the repo. Build command: **empty**.
Publish directory: **`.`** (a single dot, meaning the root).

### cPanel / Hostinger / any shared hosting
1. Zip the whole folder.
2. In cPanel open **File Manager** → `public_html`.
3. Upload the zip and Extract.
4. `.htaccess` handles https, caching and the 404 page automatically.

### Netlify
Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Live in seconds.

---

### ⚠️ Once you know your real address — do this

Right now the site has **no hard-coded domain anywhere**, on purpose: pointing at
`nexora.tech` before you own it would give you broken WhatsApp/Facebook share
previews and confuse Google. The share image uses a relative path, which works
on any host.

The moment you have a real address — your Vercel URL, your Render URL, or a
domain you bought — run this once from inside the folder (Git Bash or WSL),
replacing the URL with yours:

```bash
SITE="https://nexora-technologies.vercel.app"; sed -i "s|https://example.com|$SITE|g" sitemap.xml robots.txt && sed -i "s|content=\"assets/img/og.jpg\"|content=\"$SITE/assets/img/og.jpg\"|" *.html && echo "Updated to $SITE"
```

That fixes the sitemap, robots.txt and the share image in one go.

Then:
- Submit `sitemap.xml` in [Google Search Console](https://search.google.com/search-console).
- Paste your URL into [Facebook's debugger](https://developers.facebook.com/tools/debug/)
  and press **Scrape Again**, so WhatsApp and Facebook pick up the new preview image.

---

## 6. Editing content

Everything is normal HTML — open a file in any editor and change the text.

**Common edits:**

| What | Where |
|---|---|
| Headline on the homepage | `index.html`, look for `<h1` |
| Services listed | `index.html` (cards) and `services.html` (full detail) |
| Add a project | `portfolio.html` — copy an entire `<article class="work" ...>` block |
| Add a blog post | Copy `post-website-worth-it.html`, rename it, edit; then add a card in `blog.html` |
| Stats (10+, 30+, 99%) | Search for `data-count` in `index.html` and `about.html` |
| Team members | `about.html`, the `member` blocks |
| Footer links | Bottom of every `.html` file |

**Important:** the header and footer are repeated in every page (this is what makes
the site work with no build step). If you change a nav link, change it in **all**
the `.html` files — a find-and-replace across the folder does it in one go.

### Colours
All colours are defined once at the top of `assets/css/style.css`:

```css
--cyan:   #22d3ee;
--blue:   #2f7dff;
--violet: #a855f7;
--bg:     #05070e;
```

Change these and the entire site follows — buttons, gradients, icons, everything.

---

## 7. Notes

- **Fonts** are Sora (headings) and Inter (body), loaded from Google Fonts.
  If you need the site to work with no internet at all, download them and
  swap the `<link>` in each file's `<head>`.
- **Accessibility:** skip link, keyboard focus rings, ARIA on the menu and
  accordion, and `prefers-reduced-motion` is respected.
- **Extensionless URLs** (`/services` instead of `/services.html`) are possible on
  Apache, but internal links deliberately keep `.html` so the same files work
  unchanged on Netlify, Vercel and GitHub Pages.
- **Privacy policy and terms** are plain-language drafts describing how you
  actually work. They are not legal advice — have a lawyer review them if your
  business has specific regulatory obligations.

---

## 8. Local preview

Double-clicking `index.html` mostly works, but a local server is more accurate:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.
