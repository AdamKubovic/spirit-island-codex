# deck-dashboard — static in-game deck dashboard

A read-only Dashboard tab: what's in each draw deck (minor/major powers, fear, events) for
the current game's expansion set, with element composition and exact draw odds. No live
tracking — every figure is a full-deck, nothing-drawn fact, labelled as such.

Start here: `PRD.md` (the spec, ready-for-agent), then `MAP.md` (the wayfinder map that
charted the effort — its Notes record what was settled with the owner and why).

`issues/` holds two kinds of file. `grep '^Status:' issues/*.md` is the authoritative view.

- **01–05 — wayfinder tickets** (labelled `wayfinder:<type>` in the file): open decision
  threads deliberately deferred out of the spec — innate-threshold sourcing and scope
  (01, 05), the fear/event good/bad valence taxonomy and its view prototype (02, 04),
  chart-form refinement (03). These are planning tickets; work them via `/wayfinder` with
  the map.
- **06–12 — implementation tickets** (sliced from `PRD.md` via `/to-tickets`): tracer-bullet
  vertical slices. **06 (walking skeleton) blocks everything else**; after it lands, 07–12
  are all independently takeable. Work them with `/implement`, flipping `Status:` to `done`
  as they merge.
- **14–20 — implementation tickets for `PRD-2.md`** (the follow-up spec: valence views +
  element-gap odds), sliced via `/to-tickets` 2026-07-21. Frontier opens three-wide: 14
  (gap-odds block), 15 (innate transcription), 17 (valence rubric + draft) are independent.
  16 needs 14+15; **18 is the `ready-for-human` ratification gate** (needs 17); the views 19
  then 20 sit behind 18 — they must never ship on stub ratings. (13 is a parked brainstorm,
  not part of this pipeline.)

The repo's data rule applies as usual, but note this feature adds **no new datasets** —
the one judgment dataset in sight (fear/event valence) is exactly what ticket 02 exists to
grill before any classification happens.
