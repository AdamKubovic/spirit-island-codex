# 13 — Fear, event and blight

Status: done
Type: wayfinder:task (AFK)
Parent: [v4 map](../MAP.md) · Spec: [PRD.md](../PRD.md)

## What to build

The remaining 139 cards — 65 event, 50 fear, 24 blight — brought into the tab, taking it to all 471.

These cards **have no elements, no cost and no speed**, so they cannot use the power filters. They
get the controls their own fields can support, in whatever shape #03 chose: a segmented
`Powers | Fear | Events | Blight` switch that swaps the control set, or one filter bar that adapts.
Whichever it is, a control is never shown for a field the selected card type does not have.

## Acceptance criteria

- [ ] The dataset covers all 471 cards; the derivation script produces the new ones too
- [ ] `cardCanon.test.ts` pins the added counts — 65 event, 50 fear, 24 blight — alongside the powers
- [ ] Every one of the 471 resolves to an image that exists
- [ ] The tab browses all 471, with the type-appropriate controls from #03
- [ ] No control is ever offered for a field the selected card type lacks
- [ ] The filter function's tests cover the new card types, including the case that gated this
      ticket: a filter on a field that type does not have
- [ ] Verified in a real browser at 375px and desktop width

## Blocked by

- [12 — The power filters](12-the-power-filters.md)

## Comments

`scripts/extract-other-cards.mjs` mirrors #11's script for the remaining 139 cards: same
sandboxed-vm fetch of `cards.js`, mapping each source class to a kind (`FearCard`→fear,
`BlightCard`→blight, the five event-shaped classes — `ChoiceEventCard`, `StageEventCard`,
`TerrorLevelEventCard`, `HealthyBlightedLandEventCard`, `AdversaryEvent` — all →event, matching
the manifest's own single `event` bucket for all 65). Output: `src/data/other-cards.json`.
Re-running printed `50 fear / 65 event / 24 blight` — exact match to #01. `OtherCard` in
`types.ts` carries only `name`/`expansion`/`kind`/`image` — no elements/cost/speed fields exist
to be absent, since #01 found these types don't carry them at all.

`cardCanon.test.ts` gained a second describe block: the 50/65/24/139 counts, global name
uniqueness within the 139, asset-existence for all 139, and a **join-completeness check across
all 471** (power + other cards' names are globally unique and total exactly 471) — the strongest
evidence the #01 join holds for the whole catalogue, not just each half separately.

Filtering: rather than stretch `PowerCardFilterState` to cover fields these cards don't have,
`OtherCardFilterState` (`src/domain/otherCardFilter.ts`) only has `kinds` and `expansion` —
the type system is what enforces "no control for a field the type lacks," not a runtime branch.
`otherCardFilter.test.ts` covers kinds (OR), expansion, combined-by-AND, matching nothing, and
documents (with a commented-out line that would fail `tsc -b`) that an elements/cost/speed filter
on this type is a compile error, not a possible runtime state — the AC's "field the type doesn't
have" case, enforced structurally instead of tested as a branch.

UI: `CardsTab` gained a `Powers | Fear | Events | Blight` segmented switch (#03's call). Switching
segments swaps the filter panel (`CardFilters` vs `OtherCardFilters`) and resets the other-card
filter. `CardGrid` was generalised to take `{name, image}` instead of `PowerCard[]` specifically,
so both segments share it without a second grid component; `OtherCardRows` is a new, smaller rows
component (no elements/cost/speed columns) since duplicating `CardRows` minus three columns isn't
"reuse," it's copy-paste with dead code.

Verified against a production build in real Chromium at 375px and 1440×900: all four segments show
correct counts (50/65/24/332, summing to 471), the element-multi-select control is present only in
the Powers segment, zero horizontal overflow anywhere, Fear's rows view renders cleanly.

`tsc -b`, the full suite (271/271, up from 262), and `vite build` all clean.

**The Cards tab now covers all 471 cards** — the destination MAP.md set out (#01 through #14) is
complete.
