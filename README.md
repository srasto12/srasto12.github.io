# Sahil Rastogi Portfolio

A personal portfolio site built as a single static page with no framework or build step.

## Files

- `index.html` contains the page structure and content.
- `styles.css` contains the visual design and responsive layout.
- `script.js` contains the mobile navigation, sticky header, scroll-progress bar, project switcher, scroll reveal, and contact-form mailto handler.
- `assets/` contains the profile image, hackathon photos, and resume PDF.

## Run locally

Because this is a static site, you can open `index.html` directly in a browser.

For a local server from PowerShell:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Resume

The Resume section and hero button link to `assets/Sahil-Rastogi-Resume.pdf`. Replace that file
with the latest export (keep the same filename) whenever the resume changes.

## Deploy

The live site is a static deployment of this repository's root. Any static host that serves
`index.html` from the repo root works; no build command is required.
