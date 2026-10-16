# Wilson Lee — Portfolio

Minimal, floating-canvas portfolio for Engineering projects and Photography.

## Structure

- [`index.html`](index.html) — Main document layout (top pill switcher, profile trigger, floating clusters, and profile modal dialog).
- [`styles.css`](styles.css) — Theme variables (Engineering Blue vs. Photography Black), ambient floating color orbs, off-kilter card transforms, and modal animations.
- [`app.js`](app.js) — Section switcher, card/text rendering, and dialog controls.
- [`portfolio-data.js`](portfolio-data.js) — **All content lives here.** Edit this file to add your photos, project titles, and descriptions.

## Adding Your Photos & Content

1. Drop your images into:
   - `assets/images/engineering/` (for Engineering projects)
   - `assets/images/photography/` (for Photography)
   - `assets/images/profile/` (for your profile photo)
2. Open [`portfolio-data.js`](portfolio-data.js) and update:
   - `profile`: Your portrait path (`photoUrl`), bio (`description`), and contact links.
   - `engineering.topCards` / `engineering.bottomCards`: Update `img`, `title`, `caption`, and optional `angle` (in degrees).
   - `engineering.floatingTexts`: Update `text` and `subtext` for the floating middle callouts.
   - `photography.topCards` / `photography.bottomCards` / `photography.floatingTexts`: Same structure for your photography work.

## Running Locally

Serve the folder with any static server, for example:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.
