# 02 — The app installs to a phone and works fully offline

**What to build:** The owner opens the deployed site in Chrome on their Android phone, taps
**Install app**, and gets a full-screen app with no browser chrome and its own task-switcher entry.
After leaving it on wifi for a few minutes, the app works with the network entirely off — every
spirit panel, power card, adversary, scenario and aspect image is on the device, including ones
never viewed while online. When the site is redeployed, the app updates itself silently on the next
launch, transferring only what changed.

This is the whole tracer bullet: manifest, service worker, precaching, update strategy, and the
build-time guard that proves the cache is complete.

Key decisions from the PRD, all of which have a reason behind them — read the spec before
deviating:

- **Everything is precached eagerly.** Lazy runtime caching is explicitly rejected: offline, the
  image needed is precisely the one not yet opened.
- **Workbox's default maximum file size must be raised.** The largest panel is ~968 KB, well over
  the default. Left alone, the biggest and most important images are silently dropped and the build
  stays green — which is why the guard below is part of this ticket rather than beside it.
- **Auto-update, no prompt.** The audience is one person who is also the deployer.
- **Public assets are unhashed.** Vite content-hashes emitted JS and CSS, but files in the public
  directory keep their filenames forever. The generated precache manifest's per-entry content
  revision is what makes a re-exported image actually replace the cached one.
- **The service worker is disabled in dev.** A service worker caching a dev server costs an
  afternoon.
- **Short name is `SI Archive`**, not `Spirit Island` — deliberately distinct on the home screen
  from the official Spirit Island digital game app, which the owner also has installed. Do not
  "correct" this. Full name stays `Spirit Island Knowledge Base`.
- **Theme and background colour** use the island-retheme dark background token, so launching does
  not flash white.
- **Start URL is the site root.** Per ADR 0014 the app uses hash routing, so every route is
  reachable from the single cached root document and no SPA-fallback rewrite is needed.
- **Display standalone; orientation unconstrained** — panels get read both ways.

The guard is a Node script following the existing `scripts/*.mjs` convention. It reads the
generated service worker after the build and asserts that every static asset on disk appears in the
precache manifest — matched by **count, not sampled**, since sampling is exactly what would miss a
size-limit drop — with an explicit assertion covering the largest panels. On failure it names the
missing files, so diagnosis does not mean reading a generated bundle. It runs as part of the build:
a check that must be remembered is a check that does not run.

Icons and the Settings indicator are deliberately not part of this ticket (03 and 04). Chrome will
fall back to the favicon in the meantime; the app still installs.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `vite-plugin-pwa` added as a devDependency and configured; no new runtime dependency
- [ ] Manifest ships with name `Spirit Island Knowledge Base`, short name `SI Archive`, standalone
      display, the dark theme/background colour, and the site root as start URL
- [ ] Service worker registers with auto-update; no update prompt or version-skew UI
- [ ] Every static asset — app shell, JSON datasets, fonts, and all image directories — is in the
      generated precache manifest, including the ~968 KB panels
- [ ] The service worker is disabled in dev mode
- [ ] A precache guard script exists, compares the manifest against the files on disk by count, and
      names the missing files on failure
- [ ] The guard runs automatically as part of the build and fails the build when assets are missing
- [ ] Deliberately breaking the guard (e.g. lowering the size limit) makes the build fail — verified
      once, not left to faith
- [ ] `npm run build` and `npm test` both pass; the app smoke test still renders
- [ ] The site still works as a plain website, uninstalled, on desktop
