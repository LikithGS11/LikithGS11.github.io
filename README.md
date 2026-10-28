# Likith G S — Portfolio (self-hosted)

A plain HTML/CSS/JS rebuild of `gslikith.figma.site`. No framework, no build step, no dependencies.

```
index.html            all content (edit text here)
styles.css            design (colors, sizes, animations)
script.js             loader, typing effect, theme toggle, mobile menu, scroll reveals
assets/               background images (run the download script once)
download-assets.ps1   Windows: fetch the 3 background images from your Figma site
download-assets.sh    macOS/Linux/WSL: same thing
```

## 1. Get the background images (once)

The three faint background images live on your Figma site. Pull them into `assets/`:

- **Windows (PowerShell):** `powershell -ExecutionPolicy Bypass -File .\download-assets.ps1`
- **macOS / Linux / WSL:** `bash download-assets.sh`

Do this **before** you unpublish the Figma site. Without them the page still works; the dark sections are just plain black.

## 2. Preview locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` directly also works.)

## 3. Host it on your own domain

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

- **Text / projects / jobs:** edit `index.html` directly. Each card is a self-contained block; copy one to add another.
- **Loader length:** `LOADER_MS` at the top of `script.js` (`2000` by default; the original was `4500`; `0` turns it off). It plays once per browser session, so reloads and return visits skip it.
- **Typing speed:** `TYPE_MS` in `script.js`. The typed text is the text inside `#typed` in `index.html`.
- **CV link:** the **Download CV** button points to your Google Drive file. Change the `href` to swap it.
- **Colors:** theme tokens are at the top of `styles.css` (`:root` = light, `html.dark` = dark).

## Notes

- Dark mode is the default; the choice is saved in `localStorage` under the same `theme` key the Figma site used.
- Respects the OS "reduce motion" setting (skips the loader and entrance animations for those users).
- If `script.js` fails to load, a small inline script in `<head>` removes the loader and shows all content after 8 seconds.
- Favicon is `favicon.svg`. For a link preview image on LinkedIn/WhatsApp, add an `og:image` tag pointing to a 1200×630 image (and `og:url` / `canonical` once you have a domain).
- Content is in the HTML itself, so it is indexable by search engines and readable without JavaScript.
