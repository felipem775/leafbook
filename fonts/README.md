# Local Fonts Directory

This directory contains locally-hosted Google Fonts to make LeafBook completely **offline-first**.

## Setup

Run once to download all required fonts:

```bash
npm run fonts:download
```

This will download:
- **Inter** (weights: 400, 500, 600, 700, 900)
- **JetBrains Mono** (weights: 400, 500, 600)  
- **Outfit** (weights: 400, 600, 700, 800)

## Why Local Fonts?

- ✅ **No internet required** — app works offline
- ✅ **Faster startup** — fonts load from disk
- ✅ **Privacy** — no external requests to Google
- ✅ **Reliable** — no CDN latency or failures

## Usage

After running `npm run fonts:download`, the fonts are automatically served locally via `/fonts.css` (declared in `index.html`).

No additional configuration needed — the app will use local fonts automatically.

## Troubleshooting

If fonts don't load:

1. Ensure fonts were downloaded:
   ```bash
   npm run fonts:download
   ```

2. Check network tab in DevTools — should request `/fonts.css`, not Google CDN

3. Clear browser cache:
   ```bash
   npm run clean
   ```

## Details

- CSS: `public/fonts.css` — declares `@font-face` rules pointing here
- Files: `*.woff2` — modern format, smallest file size
- Format: WOFF2 is supported in all modern browsers and Tauri
