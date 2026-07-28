# 01 — ADR 0015: the app ships as a PWA, not a native package

**What to build:** A future agent reading this repo can see that shipping an installable PWA rather
than a native Android package was a weighed decision, understand why the alternatives were set
aside, and know what would justify revisiting them — instead of proposing a Capacitor rewrite from
scratch.

Docs only; no code changes.

The ADR should record:

- The decision: the knowledge base ships as an installable PWA served from the existing GitHub
  Pages deployment, with a full-precache service worker for offline use at the table.
- **Capacitor** (assets bundled inside an APK) — rejected. Moves the app to a new origin, orphaning
  the existing saved data, and replaces silent auto-update with manual rebuild-and-sideload.
- **Bubblewrap / TWA** (the same PWA wrapped in a signed APK) — deferred, not rejected. Reuses all
  of this work as a later bolt-on. Revisit trigger: the installed PWA still feels like a bookmark
  after real use.
- **Manifest only, no offline** — rejected. Offline at the table is the motivation; a home-screen
  icon that fails without signal solves only the cosmetic half.
- The consequences that follow and constrain later work: Android/Chrome is the only target device
  (iOS storage quota and eviction are not designed around); all assets are precached eagerly rather
  than on demand; updates are silent and automatic.

Follow the house style of the existing ADRs — a Context section that explains what forced the
decision, the options as they were actually put to the owner, and the consequences. Number it 0015.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `docs/adr/0015-*.md` exists, numbered 0015, marked accepted, dated
- [ ] Records the PWA decision, the three alternatives, and why each was rejected or deferred
- [ ] States the TWA revisit trigger explicitly, so it reads as deferred rather than forbidden
- [ ] States the consequences: Android-only target, eager full precache, silent auto-update
- [ ] Matches the structure and tone of the surrounding ADRs
- [ ] References `.scratch/installable-app/PRD.md` for provenance
