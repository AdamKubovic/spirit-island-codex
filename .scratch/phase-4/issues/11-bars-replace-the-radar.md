# 11 — Bars replace the radar

Status: done
Parent: [Phase 4 PRD](../PRD.md) · cluster 1 (honest fixes)

## Blocked by

None — can start immediately.

## What to build

The spirit detail's OCFDU block becomes the labelled-bars profile that won the
[#03 prototype](03-the-radar-chart-fix-or-replace.md) (decision screenshot:
`../screenshots-03/winner-B-labelled-bars.png` — this is a settled decision, no new variant
round): five rows — full-word axis label (Offense, Control, Fear, Defense, Utility), a thin
accent bar against a track **scaled to max 5**, the value figure at the right — followed by an
Elements chip row (sourced data the detail never showed). The ratings-estimate note stays.

The radar component is deleted outright, which also removes the recommender result rows' 80px
thumbnail — dropped with no replacement (owner's call: the full profile is one click away).

## Acceptance criteria

- [x] Every spirit's detail shows the five labelled bars with value figures; a 5-rated axis
      reaches the full track
- [x] Elements render as chips in the profile block; the estimate note behaviour is unchanged
- [x] The radar component no longer exists anywhere in the codebase
- [x] Recommender result rows carry no profile thumbnail
- [x] Browser-verified (production build, 375px + desktop) per repo convention

## Comments

**Resolved (2026-07-13).** `OcfduBars.tsx` renders the winner-B design (full-word labels, thin
accent bars on a rounded track, value figures, ELEMENTS chip row); `OcfduRadar.tsx` deleted;
`SpiritDetail` swaps radar for bars and passes `spirit.elements`; Recommender result rows lose
the thumbnail and `.deck-row-body` its now-empty second grid column. The estimate-note JSX is
untouched. Smoke tests pin the five labels, element chips, and full-track fill; verified in
Playwright against the production build at 375px and 1280px (screenshots in
`../screenshots-11/`, including a geometric fill-width check). 326/326, tsc clean.

**⚠️ Owner note — a gap the ticket didn't anticipate:** #03's resolution said ratings top out
at 5, but the dataset holds a **6** on one axis for three spirits (`ember-eyed-behemoth`
offense, `relentless-gaze-of-the-sun` offense, `wounded-waters-bleeding` control). Shipped
behaviour: the track stays scaled to max 5; a 6 clamps at the full track and the value figure
shows the true 6 (no data touched, no rescaling of everyone else). A smoke test pins this. If
you'd rather rescale the track to 6, or audit whether those 6s are faithful transcriptions,
say so — one-line change either way.

Code review (two-axis): no hard violations; applied its judgement calls — `Element[]` over
`string[]`, by-id spirit lookup in tests, a clamped-6 test, and a standalone chip class
instead of overriding most of `.spirit-tile-tag-chip`.
