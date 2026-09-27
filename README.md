# RSV Lab — Website

Static site for RSV Lab (Kamol Das, Dept. of Microbiology, University of Chittagong).

## Run locally

No build step required — pure HTML/CSS/JS.

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Logo & favicon files

The site references three image files that are **not included** — add your own
alongside `index.html`:

| File | Used for | Referenced in |
|---|---|---|
| `rsvlab-logo.png` | Browser tab favicon + header logo (next to the wordmark) | `index.html` `<link rel="icon">`, `content.js` `logo` field |
| `apple-touch-icon.png` | Home-screen icon on iOS/iPadOS (180×180px recommended) | `index.html` `<link rel="apple-touch-icon">` |
| `rsvlab-logo.png` (og:image) | Social share preview image | `index.html` `<meta property="og:image">` |

To turn off the header logo image (text-only wordmark), set `logo: ""` in
`content.js`.

## Edit content

Everything on the page is driven by `content.js`. Edit that file only for
day-to-day changes (text, links, cards, colours). `styles.css` is the
universal theme (edit only to rebrand), `render.js` is the engine that
builds the page from `content.js` (should rarely need edits), and
`index.html` is a thin shell of empty containers.

## Deploy (Cloudflare Pages)

- Build command: none
- Output directory: `/`
- Auto-deploys on push to `main`

`_headers` and `_redirects` are Cloudflare Pages config files and are
picked up automatically.

## File structure

```
rsv-lab/
├── index.html      thin shell: sections are empty containers
├── styles.css       universal CSS theme
├── content.js       ALL editable content
├── render.js        engine that fills HTML from content.js
├── 404.html         not-found page
├── _headers         Cloudflare Pages response headers
├── _redirects       Cloudflare Pages redirect rules
├── robots.txt
├── sitemap.xml
└── .gitignore
```
