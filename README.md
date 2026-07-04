# Quick Skins

Quick Skins is a free, installable web app for disc golf skins games:

https://skins.spiris.app/

https://skins.spiris.app/guide.html

Drop in a UDisc CSV export after a round and it calculates who won each
hole, how pushes carried, payout totals, and the fewest payments needed to
settle up.

The short version:

- No account or sign-up.
- No backend database for scorecards.
- No analytics, ad tags, or tracker scripts in the app source.
- Scorecard parsing and payout math run in the browser.
- Imported round data is stored only in the user's browser unless they choose
  to share or copy results.
- The visible "Clear stored data" control removes the app's saved round state
  and shared-file cache.

## How It Works

1. Export a finished UDisc scorecard as a CSV.
2. Open or paste that CSV into Quick Skins.
3. Remove any players who were not in the skins game.
4. Quick Skins calculates skins, carries, pushes, buy-ins, payouts, and the
   smallest set of settlement payments.

## Privacy

See [PRIVACY.md](PRIVACY.md) for the app's data-handling notes.

## Run Locally

Opening `index.html` directly.

## Project Structure

- `index.html` - the main calculator app.
- `guide.html` - install and usage guide.
- `sw.js` - service worker for offline use and Android share-target support.
- `manifest.webmanifest` - PWA install metadata.
- `netlify.toml` - Netlify publish settings and security/cache headers.
- `robots.txt`, `sitemap.xml`, `llms.txt` - public discovery metadata.
- `assets/` - icons, screenshots, and guide videos.

