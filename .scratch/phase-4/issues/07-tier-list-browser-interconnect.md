# 07 — Tier list ↔ browser interconnect

Status: needs-triage
Type: wayfinder:prototype (HITL)
Parent: [phase-4 map](../MAP.md)

## Blocked by

- [#06 multi-tier-list architecture](06-multi-tier-list-architecture.md) — "Browse shows the
  spirit's tier" is unanswerable until #06 says which list that is.

## Question

Both directions of the interconnect:

1. **Tier list → detail.** Clicking a spirit in the tier list shows the same detail view as
   Browse, ideally without leaving the tier list. Modal? Shared component rendered in place?
2. **Browse → tier.** Browse's detail view shows the spirit's tier and its aspects' tiers, in the
   matching tier colours.

Facts: the detail view is `SpiritDetail.tsx` (Browse's); tier colours already live in
`tierColors.ts`; tier board tiles are 116px and already carry corner markers and dimming from v5 —
whatever click affordance is added competes with that. Which list supplies "the tier" comes from
[#06](06-multi-tier-list-architecture.md).

Prototype it: a rough modal (or in-place render) over the real tier board, and a Browse detail
with a real tier chip row, screenshots per round, owner reacts. The decision to lock: the reuse
pattern (modal vs navigation vs inline), and exactly what tier info Browse's detail shows.

Note from [#02](02-the-settings-tab.md)'s resolution: the tier board is also gaining an
**edit-my-board mode** (Customise tiers dissolves into it). Whatever click-to-detail affordance
this prototype picks must coexist with edit interactions on the same tiles.

Note [#03](03-the-radar-chart-fix-or-replace.md) may be reshaping `SpiritDetail`'s contents in
parallel — the two tickets decide different things (this one: how the view is reached and what
tier info it gains; #03: one panel inside it), but the spec assembly reconciles their combined
layout.

## Comments
