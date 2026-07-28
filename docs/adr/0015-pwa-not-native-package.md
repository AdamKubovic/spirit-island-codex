# 0015 — The app ships as an installable PWA, not a native package

Status: accepted
Date: 2026-07-28

## Context

The knowledge base is used at the table, mid-game, on a phone — the worst-case network
environment: someone else's wifi, a basement, two bars of signal. As a plain website it lives
behind a browser tab and dies the moment there is no signal. See
`.scratch/installable-app/PRD.md` for the full problem statement and user stories.

Three packaging options were put to the owner:

1. **Capacitor** — bundle the built assets inside a native APK shell.
2. **Bubblewrap / TWA** — wrap the existing PWA in a signed APK.
3. **Installable PWA** — a web app manifest plus a full-precache service worker, served from the
   existing GitHub Pages deployment, with no native wrapper at all.

## Decision

**Ship an installable PWA.** The site stays on GitHub Pages at the same URL; a manifest, an icon,
and a Workbox-generated service worker (`vite-plugin-pwa`) make Chrome on Android treat it as an
installable app with full offline support.

- **Capacitor — rejected.** It moves the app to a new origin, which orphans the `localStorage` data
  already on the owner's phone (tier lists, game log, collection, questionnaire answers). It also
  replaces the existing silent auto-update with a manual rebuild-and-sideload cycle for every
  change — a real cost for a repo that deploys often.
- **Bubblewrap / TWA — deferred, not rejected.** A TWA is the same PWA wrapped in a signed APK; it
  reuses everything built here as a later bolt-on and orphans no data. **Revisit trigger: the
  installed PWA still feels like a bookmark after real use.** Nothing here forecloses it.
- **Manifest only, no offline caching — rejected.** Offline at the table is the actual motivation.
  A home-screen icon that fails without signal solves the cosmetic half of the problem and none of
  the real half.

## Consequences

- **Android/Chrome is the only target device.** The owner's phone (Oppo Find X9 Pro) is what this
  is designed for. iOS's tighter storage quota and cache eviction are not designed around, and iOS
  is out of scope.
- **All static assets are precached eagerly at install**, not fetched lazily as the app is browsed
  — roughly 78 MB across panels, cards, scenarios, adversaries, aspects, spirits and elements. The
  tradeoff is a slow first install that restarts if the network drops mid-download; accepted,
  because lazy caching means the panel needed at the table is exactly the one not yet cached.
- **Updates are silent and automatic**, with no update-available prompt: the service worker
  registers with auto-update and applies a new version on next launch, transferring only the
  content-revisioned files that changed. The audience is one person who is also the deployer.
- No APK, no store listing, no signing keystore, no `assetlinks.json` exists or is planned unless
  the TWA trigger above fires.

## References

- `.scratch/installable-app/PRD.md` — full problem statement, user stories, and the caching and
  tooling decisions this ADR summarises.
