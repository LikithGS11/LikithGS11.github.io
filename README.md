# Likith G S — Portfolio (self-hosted)

A plain HTML/CSS/JS personal site. No framework, no build step, no dependencies.

```
index.html            all content (edit text here)
styles.css            design (colors, type, spacing, motion)
script.js             theme toggle, mobile menu, smooth scrolling, scroll reveals,
                      header border + scroll progress + active nav link, copy-email button
favicon.svg           browser-tab icon
```

Design approach: type-led and quiet. One accent colour (burnt orange), section titles in a narrow left column on desktop, and experience, projects, skills and education as simple lists rather than card grids. Fonts are Instrument Sans plus IBM Plex Mono for dates and tags, from Google Fonts. Motion is limited to a short fade-up as content appears, quick-in/slow-out hover transitions, and the project list stepping back the other rows while you hover one. No images are required.

## 1. Preview locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` directly also works.)

## 2. Host it on your own domain

Pick one. All are free for a static site like this.

### Option A — Cloudflare Pages / Netlify (easiest, drag-and-drop)
1. Netlify: app.netlify.com → **Add new site → Deploy manually** → drag this folder in.
   Cloudflare: dash.cloudflare.com → **Workers & Pages → Create → Pages → Upload assets**.
2. In the project's **Domains / Custom domains** settings, add `yourdomain.com` and follow the DNS records it shows you (usually a CNAME for `www` and an A/ALIAS for the root).

### Option B — GitHub Pages
```bash
git init && git add . && git commit -m "portfolio"
git branch -M main
git remote add origin https://github.com/LikithGS11/<repo-name>.git
git push -u origin main
```
Then on GitHub: **Settings → Pages → Source: Deploy from branch → main / root**.
For a custom domain: **Settings → Pages → Custom domain** → enter your domain, then at your registrar add:
- `www` → CNAME → `likithgs11.github.io`
- root (`@`) → A records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

Tick **Enforce HTTPS** once the certificate is issued.

## Editing

- **Text / jobs / projects:** edit `index.html` directly. Each job is an `<li class="entry">` and each project an `<article class="project">`; copy one to add another. The project's link goes on its name (`.project-link`) and automatically covers the whole row.
- **Project links:** they all point to the GitHub profile for now. Swap each `href` for the repo URL when you have it.
- **Photo (optional):** put a square photo next to `index.html` and add `<img class="hero-photo" src="photo.jpg" alt="Likith G S" width="96" height="96" />` above the `<h1>` (there's a comment marking the spot).
- **CV link:** the **Download CV** button points to your Google Drive file. Change the `href` to swap it.
- **Colors:** theme tokens are at the top of `styles.css` (`:root` = light, `html.dark` = dark). Every text colour passes WCAG AA on its background in both themes; recheck if you change them.

## Notes

- Dark mode is the default; the choice is saved in `localStorage` under the same `theme` key the Figma site used.
- Respects the OS "reduce motion" setting (no fade-ins or hover transitions for those users).
- Hover effects on project rows only apply on devices with a mouse or trackpad.
- If `script.js` fails to load, a small inline script in `<head>` shows all content after 4 seconds.
- Favicon is `favicon.svg`. For a link preview image on LinkedIn/WhatsApp, add an `og:image` tag pointing to a 1200×630 image (and `og:url` / `canonical` once you have a domain).
- Content is in the HTML itself, so it is indexable by search engines and readable without JavaScript.
