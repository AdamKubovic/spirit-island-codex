# 07 — Tier list ↔ browser interconnect

Status: done
Type: wayfinder:prototype (HITL) — resolved by grilling at the owner's direction; no prototype
round was needed, every decision reuses an existing idiom
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

**Resolution (2026-07-13, grilled with the owner — four decisions):**

Facts that shaped it: tier-board tiles are inert today (no click handler at all);
`SpiritDetail` is already a modal, opened by Browse; the detail already shows a plain-text tier
line (base spirit only); `tierColor(position)` exists, keyed by position in each list's own
vocabulary per ADR 0001.

1. **Mechanism: tier tiles open the same `SpiritDetail` modal Browse uses.** Same component,
   over the board — the ticket's "without leaving the tier list", satisfied without a router
   (which [#04](04-the-archives-structure.md) ruled out this phase) and with zero new idioms.
2. **Aspect tiles open the base spirit's modal scrolled to the Aspects section, with the
   clicked aspect's row highlighted** — one scroll call and one CSS class; the clicked thing is
   never buried.
3. **Tier display: chip in head + chip per aspect row.** The head's text line becomes a coloured
   tier chip for the base configuration; each aspect row gets its own small tier chip. Colours
   via `tierColor` from the **active configurations-list**
   ([#06](06-multi-tier-list-architecture.md)'s lookup rule). An unrated configuration gets an
   outlined "unrated" chip — absence stays honest, never defaulted.
4. **Boundaries:** edit mode ([#02](02-the-settings-tab.md)) gates the click — view mode click
   opens the modal, edit mode clicks/drags only edit (this resolves the coexistence note #02
   left on this ticket). **Card-subject tiles stay inert** this phase — no card detail view
   exists, and v5 explicitly ruled rules-text detail views out of scope.
