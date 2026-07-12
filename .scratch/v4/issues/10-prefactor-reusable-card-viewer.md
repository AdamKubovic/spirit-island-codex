# 10 — Prefactor: a reusable card viewer

Status: ready-for-agent
Type: wayfinder:task (AFK)
Parent: [v4 map](../MAP.md) · Spec: [PRD.md](../PRD.md)

## What to build

Nothing new, from the user's perspective — that is the point. The click-to-enlarge card viewer built
for v3 #11 lives inside the spirit detail view, which is the only place that can use it. The Cards
tab needs exactly the same behaviour, so lift the viewer out to stand on its own rather than
building a second one that drifts.

Make the change easy, then make the easy change.

## Acceptance criteria

- [ ] The card viewer is a standalone component, usable by any surface, taking a card image and
      whatever caption it needs
- [ ] The spirit detail view uses it and behaves **identically** — cards enlarge, dismiss, and do not
      overflow at 375px, exactly as v3 verified
- [ ] No behaviour change is visible anywhere in the app; the existing test suite passes untouched
- [ ] Verified by opening the spirit detail modal in a real browser, not just by reading the diff —
      this is the component v3 shipped invisible once already

## Blocked by

- None — can start immediately.
