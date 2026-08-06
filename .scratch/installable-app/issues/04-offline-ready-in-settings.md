# 04 — "Offline ready" in Settings

**What to build:** The owner can open Settings and see whether the offline cache has finished
downloading, so they know before leaving the house whether the app is genuinely ready for a table
with no signal.

Two states only: ready, and not yet. Driven by the ready flag the PWA plugin already computes — no
new state to maintain.

Explicitly **not** a progress indicator. "142 / 331 files" means reaching into Workbox install
internals for a number that gets looked at twice in the app's lifetime. Equally, showing nothing was
rejected: the precache is silent, so without this line there is no way to tell "78 MB cached" from
"30 MB cached and stalled" until it fails at a table.

The indicator must be honest about the in-progress state — a partial cache must never read as ready.

**One known risk, part of this ticket:** the ready flag comes from a virtual module provided by the
plugin. If it does not resolve under the test runner, importing it into the Settings component will
break the app smoke render. The fallback is to register the service worker at the app entry point
and pass the flag down as a prop, keeping Settings a pure component — which is closer to this repo's
existing architecture regardless. Whichever route is taken, the smoke test stays green.

No test is added for the line itself: one boolean rendering one of two strings. The constraint that
protects the UI here is the existing smoke render, not a new test.

**Blocked by:** 02 (the flag comes from the service worker registration).

**Status:** ready-for-agent

- [ ] Settings shows a single line reporting offline-cache readiness
- [ ] It reads "not yet" while precaching is still in progress and only flips once complete
- [ ] No progress bar, file count, or percentage
- [ ] The app smoke test still passes; if the virtual module does not resolve under the test runner,
      registration moves to the entry point and the flag is passed down as a prop
- [ ] `npm test` and `npm run build` pass
