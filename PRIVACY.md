# Privacy

Quick Skins is designed to keep disc golf scorecard data on the player's
device.

## What The App Processes

Quick Skins reads UDisc CSV exports that a user opens, shares, drops, pastes,
or selects in the browser. The app uses that data to calculate skins results,
buy-ins, payouts, and settlement suggestions.

## Where Scorecard Data Goes

The calculation happens in the browser. Quick Skins does not upload scorecard
CSV contents to an app server, database, analytics service, or third-party API.

The hosted site is served by Netlify, so normal web requests for public app
files are handled by the hosting platform. Quick Skins itself does not add
tracking scripts or send imported scorecard data to a backend.

## Local Browser Storage

Quick Skins uses browser storage so the app can keep working smoothly:

- `localStorage` key `quickSkins.v1` keeps the current round state on the
  user's device.
- Cache API entry `quick-skins-shared` temporarily holds a CSV shared into the
  installed Android app through the Web Share Target flow.
- The service worker caches static app files for offline use.

The in-app "Clear stored data" button removes the saved round state and shared
CSV cache. Users can also clear site data from their browser settings.

## Payments

Quick Skins may show normal links to Venmo and Cash App for convenience. Those
links are not referral links, and payment activity happens in those services,
not inside Quick Skins.

## Accounts And Tracking

Quick Skins has no user accounts, no sign-in flow, no ad network scripts, and
no product analytics script in this repository.
