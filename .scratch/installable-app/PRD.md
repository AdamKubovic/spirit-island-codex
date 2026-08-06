# PRD — The app installs to a phone and works offline

Status: ready-for-agent
Date: 2026-07-28

## Problem Statement

The knowledge base is a website. It works well on a phone, but only *as* a website: it lives behind
a browser tab, wears Chrome's address bar, is reached by typing a URL or hunting a bookmark, and
dies the moment there is no signal.

The owner uses it at the table, mid-game, to look up a spirit panel or a power card. Table
conditions are the worst case for a website: someone else's wifi, a basement, a phone with two
bars. The one moment the app is most needed is the moment it is least likely to load.

Secondarily, it does not *feel* like a thing you own. It has no icon on the home screen and no
entry in the task switcher. Every session starts with the browser.

## Solution

Ship the existing site as an **installable Progressive Web App**.

Nothing moves. The site stays on GitHub Pages at the same URL, and the laptop keeps using it
exactly as before. What changes is that Chrome on Android is now told this site is an app: it gains
a web app manifest, an icon, and a service worker that caches every asset the app has.

The owner opens the site once on the phone, taps Chrome's **Install app**, and from then on:

- it has its own icon on the home screen, named `SI Archive`
- it launches full-screen with no browser chrome, in the app's own dark palette
- it appears in the Android task switcher as its own app
- it works with the network entirely off — every spirit panel, power card, adversary and scenario
  image is already on the device
- it updates itself silently whenever the site is redeployed

It is not a native package. There is no APK, no cable, no app store, no developer account. This is
deliberate and is recorded in an ADR, because a native wrapper is a real option that was weighed
and deferred, not one that was never considered.

## User Stories

1. As the owner, I want the app on my phone's home screen with its own icon, so that I can open it
   without going through the browser.
2. As the owner, I want the icon labelled `SI Archive` rather than `Spirit Island`, so that it is
   not confusable with the official Spirit Island digital game app already on my phone.
3. As the owner, I want the app to launch full-screen with no address bar, so that the small phone
   screen is entirely given over to the content.
4. As the owner, I want the app's launch screen and system chrome to use the island-retheme dark
   palette, so that opening it does not flash white before the app paints.
5. As the owner, I want the app to appear as its own entry in the Android task switcher, so that I
   can flip back to it mid-game without losing my place among browser tabs.
6. As the owner, I want every spirit panel image available with the network off, so that I can read
   a panel at a table with no signal.
7. As the owner, I want every power card and other-card image available offline, so that mid-game
   card lookups do not depend on connectivity.
8. As the owner, I want adversary, scenario, element and aspect imagery available offline, so that
   difficulty setup at the table works the same as at home.
9. As the owner, I want the app's fonts cached, so that offline text renders in the intended
   typeface rather than a system fallback.
10. As the owner, I want *all* assets cached up front rather than as I browse, so that the image I
    need offline is not limited to the ones I happened to open while online.
11. As the owner, I want to see in Settings whether the offline cache has finished downloading, so
    that I know before I leave the house whether the app is genuinely ready.
12. As the owner, I want that indicator to be honest about the in-progress state, so that a partial
    cache is never reported as ready.
13. As the owner, I want the app to update itself when I redeploy the site, so that I never have to
    reinstall or clear storage to get a fix I just shipped.
14. As the owner, I want updates to re-download only what changed, so that a one-line CSS fix does
    not cost another 78 MB.
15. As the owner, I want a re-exported image to actually replace the cached one, so that fixing a
    bad asset is not defeated by a stale cache holding the old file under the same name.
16. As the owner, I want my existing saved data — game log, tier lists, collection, questionnaire
    answers — to still be there after installing, so that installing is not a reset.
17. As the owner, I want the data I save inside the installed app to be the same data I see if I
    open the site in Chrome on the same phone, so that there are not two divergent copies.
18. As the owner, I want every route to work on a cold offline launch, so that reopening the app on
    a deep link does not produce a blank page.
19. As the owner, I want the app to keep working as a plain website on my laptop, so that installing
    on the phone costs nothing on desktop.
20. As the owner, I want the site to remain usable by anyone who visits the URL without installing,
    so that the PWA is an addition rather than a gate.
21. As a developer working on this repo, I want the service worker disabled in dev mode, so that a
    stale cache never serves me yesterday's code while I am editing.
22. As a developer working on this repo, I want the build to fail if any asset is silently dropped
    from the precache manifest, so that an incomplete offline cache is caught at build time rather
    than at a table.
23. As a developer working on this repo, I want that check to run automatically as part of the
    build, so that it cannot be forgotten.
24. As a developer working on this repo, I want the check to report exactly which files are missing
    when it fails, so that diagnosing it does not require reading the generated service worker.
25. As a developer working on this repo, I want the existing test suite to keep passing, so that
    adding the PWA does not break the app smoke render.
26. As a future agent reading this repo, I want the decision to ship a PWA rather than a native
    package recorded as an ADR, so that I do not casually propose a Capacitor rewrite.
27. As a future agent reading this repo, I want the rejected alternatives and their revisit triggers
    written down, so that I know a TWA is deferred rather than forbidden.
28. As the owner, I want the icon to read clearly at launcher size, so that I can find it at a
    glance among other apps.
29. As the owner, I want the icon to survive Android's adaptive-icon masking, so that it is not
    cropped into an unreadable fragment or shrunk inside a white circle.
30. As the owner, I want the icon to use the app's own green accent rather than the legacy purple
    favicon colour, so that it matches the app it opens.
31. As the owner, I want the offline install to be a one-time cost, so that after the first
    download the app opens instantly every time.
32. As the owner, I want installing to require no cable, no sideloading, and no developer tooling,
    so that I can do it myself from the phone in under a minute.

## Implementation Decisions

### Packaging: PWA, not a native wrapper

The app ships as an installable PWA served from the existing GitHub Pages deployment. Three
alternatives were weighed and rejected for now:

- **Capacitor** (assets bundled inside an APK) — rejected. It orphans the existing `localStorage`
  data by moving the app to a new origin, and it discards silent auto-update in favour of manual
  APK rebuild-and-sideload for every change.
- **Bubblewrap / TWA** (the same PWA wrapped in a signed APK) — deferred, not rejected. It reuses
  100% of this work as a later bolt-on. Revisit trigger: the installed PWA still feels like a
  bookmark after real use.
- **Doing nothing beyond a manifest** (installable but online-only) — rejected. Offline at the
  table is the actual motivation; a home-screen icon that fails without signal solves the cosmetic
  half of the problem and none of the real half.

The target device is Android/Chrome (Oppo Find X9 Pro). Storage quota and cache eviction, the two
things that would make a 78 MB offline cache untenable on iOS, are not constraints there. iOS is
not a target and is not designed for.

### Caching: precache everything, eagerly

All static assets are precached at service worker install: the app shell, the JSON datasets, the
fonts, and the full image library (~78 MB across panels, cards, scenarios, adversaries, aspects,
spirits and elements — roughly 330 files, largest ~968 KB).

Lazy runtime caching was rejected. Under it, the only images available offline are the ones already
viewed online — and at the table the panel needed is precisely the one not yet opened. A hybrid
(precache the small assets, runtime-cache the 50 MB of panels) was rejected for the same reason:
panels are the primary reference artifact, so excluding them cuts exactly the wrong thing.

The consequence is a slow first install, and an install that restarts if the network drops midway.
Accepted. Mitigation if it proves flaky in practice: an explicit "Download for offline" action that
warms the cache on demand. Not built now.

### Tooling: `vite-plugin-pwa`

The service worker and manifest are generated by `vite-plugin-pwa` (Workbox) as a build-time
devDependency. Nothing additional ships to the device that a hand-rolled service worker would not.

This is a case where the dependency is smaller than the code it replaces. A hand-rolled equivalent
would require: a build step enumerating and hashing every file under the public asset directory, a
precache install routine, cache versioning, old-cache cleanup, and a fetch handler.

The hashing is not optional, and is the decisive reason. Vite content-hashes emitted JS and CSS,
but files in the public directory are copied through **unhashed** — an image keeps its filename
forever. A naive cache-first service worker would therefore serve a stale image indefinitely after
a re-export. Workbox's precache manifest carries a content revision per entry, which resolves this
for free.

Workbox's default maximum precached file size is below the largest panel image and must be raised,
or the largest and most important assets are silently excluded. This is the failure the build check
exists to catch.

### Updates: silent auto-update

The service worker registers with auto-update: a new version is fetched in the background and
applied on the next launch. Because entries are content-revisioned, an update transfers only what
changed, not the full 78 MB.

An update prompt ("new version available — reload?") was rejected. The audience is one person who
is also the deployer; the prompt exists to inform them of something they just did themselves.
Never-update was rejected outright — it would make every fix require manually clearing storage.

The tradeoff accepted: the app may occasionally open one launch behind the deployed site.

### Manifest

- Full name: `Spirit Island Knowledge Base`
- Short name: `SI Archive` — chosen to be visually distinct on a home screen from the official
  Spirit Island digital game app, which the owner also has installed. This is deliberate and should
  not be "corrected" to `Spirit Island`. It collides mildly with the app's internal Archive tab;
  that collision was judged the lesser problem.
- Display: standalone, so the app launches without browser chrome.
- Theme and background colour: the island-retheme dark background token (`--deck-bg`), so the
  launch screen and system bars match the app rather than flashing white.
- Start URL: the site root. Per ADR 0014 the app uses hash routing, so every route is reachable
  from the single cached root document and no SPA-fallback rewrite is required. This is why deep
  offline launches work without additional configuration.
- Orientation: unconstrained. Panels are read in both orientations.

### Icon

Two committed PNG assets (192 and 512), generated once from the existing favicon glyph:

- recoloured from the legacy purple to the app's green accent token (`--deck-accent`), which is the
  current palette; the purple predates the island retheme
- composited on the dark background token rather than left transparent
- padded into the adaptive-icon safe zone and declared maskable, so Android's mask does not crop it
  or shrink it inside a white circle

Generation is a one-off script following the existing `scripts/*.mjs` convention, using Playwright,
which is already a devDependency. No new tooling. The outputs are committed, so the script is
documentation of provenance rather than part of the build.

### Offline-ready indicator

The Settings panel gains a single line reporting whether the offline cache has finished populating,
driven by the ready flag the plugin already computes. Two states only: ready, and not yet.

A progress indicator ("142 / 331 files") was rejected — it requires reaching into Workbox install
internals for a number that gets looked at twice in the app's lifetime. Showing nothing at all was
also rejected: the precache is silent, so without an indicator there is no way to distinguish "78 MB
cached" from "30 MB cached and stalled" until the failure happens at a table.

The registration flag comes from a virtual module provided by the plugin. If that module does not
resolve under the test runner, the fallback is to register the service worker at the app entry point
and pass the flag down as a prop, keeping the Settings component pure. That is closer to the repo's
existing architecture regardless.

### Development mode

The service worker is disabled in dev. A service worker caching a dev server is the most common way
this class of feature costs an afternoon.

### Data and sync

Out of scope, and confirmed as such. Installed PWAs on Chrome Android share a storage origin with
the browser, so data already saved on the phone carries into the installed app with no migration,
and the two never diverge. Laptop-to-phone transfer, if ever wanted, is served by the existing
backup export/import. Sync proper is a separate effort with a real design (a backend, auth, conflict
resolution) and contradicts the stated "nothing prepared for multiple users".

## Testing Decisions

A good test here asserts external behaviour — what ends up in the shipped artifact — not the shape
of the configuration that produced it. A test asserting the plugin config equals the plugin config
is tautological and was explicitly rejected.

The repo's existing position, stated in the app smoke test, is that the UI is deliberately not
unit-tested because it is glue over the domain seams. This feature adds no domain module. Its logic
lives almost entirely in a generated build artifact. So there is **one seam**: the generated service
worker.

### The seam: the generated precache manifest

A check script reads the service worker produced by the build and asserts that every static asset
present on disk appears in the precache manifest — matched by count, not sampled — with an explicit
assertion covering the largest panel images.

This targets the one failure mode nothing else catches: Workbox silently dropping files that exceed
its size limit. The build stays green, the app installs, and the missing images are discovered at a
table with no signal. Sampling would not catch it; only a full count would.

On failure the script names the missing files, so diagnosis does not require reading a generated
service worker bundle.

The check runs as part of the build rather than as a separate command. A check that must be
remembered is a check that does not run.

Prior art: the `scripts/*.mjs` family (the dataset extraction scripts) established build-adjacent
Node scripts operating on real files, and ADR 0010 established build-time derivation as a pattern
in this repo.

### Existing tests

The app smoke test must continue to pass. It renders the app server-side, and the risk is that
importing the offline-ready flag's virtual module into the Settings component breaks that render.
Whichever registration approach is taken must keep that test green — that constraint, rather than a
new test, is what protects the UI here.

No test is added for the offline-ready line itself: it is one boolean rendering one of two strings.

### What cannot be tested here

Real offline behaviour on a real device. Desktop emulation of an installed PWA is not the same as an
installed PWA. Final verification is manual and belongs to the owner: install, allow the cache to
populate, enable airplane mode, open a spirit panel that was never viewed while online.

## Out of Scope

- **Any native package.** No APK, no Capacitor, no Bubblewrap/TWA, no store listing, no signing
  keystore, no `assetlinks.json`. Revisit trigger: the installed PWA still feels like a bookmark
  after real use.
- **iOS support.** Not a target device; its storage quota and eviction behaviour are not designed
  around.
- **Laptop-to-phone sync.** Separate effort. The existing backup export/import covers one-off
  transfer. Revisit trigger: the phone becomes where games are actually logged.
- **Multi-user anything.** No accounts, no backend, no per-user storage.
- **A download progress indicator.** Revisit trigger: the install proves flaky enough that partial
  caches happen in practice.
- **An explicit "Download for offline" action.** Same revisit trigger as above.
- **An update prompt or any version-skew UI.**
- **Push notifications, background sync, share targets, shortcuts, or any other PWA capability**
  beyond installability and offline. None is needed; each would be speculative.
- **Selective or configurable caching.** All assets, always.
- **Changing where or how the site is hosted.** GitHub Pages and the existing deploy script stand.

## Further Notes

The asset inventory that drove the caching decision, as of this writing:

| directory   | files | size    |
| ----------- | ----- | ------- |
| panels      | 74    | 50 MB   |
| cards       | 154   | 18 MB   |
| scenarios   | 16    | 4.9 MB  |
| adversaries | 8     | 2.2 MB  |
| aspects     | 31    | 1.3 MB  |
| spirits     | 37    | 828 KB  |
| elements    | 10    | 76 KB   |
| fonts       | —     | 204 KB  |

The panels directory is both the largest and the least skippable: those are the images read during
play. Any future proposal to trim the cache should start somewhere else.

An ADR (`docs/adr/0015-*`) accompanies this work, recording the packaging decision and its rejected
alternatives. It exists because the alternatives are live — a TWA remains a legitimate future step
— and because ADR 0004 (standing prohibitions) is the mechanism this repo uses to stop a future
agent from re-litigating a settled decision from scratch.

The deploy path is unchanged: `npm run deploy`, which dispatches the Pages workflow. Installing on
the phone is a Chrome menu action against the deployed URL, not a file transfer.
