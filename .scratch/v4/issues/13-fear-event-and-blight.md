# 13 — Fear, event and blight

Status: blocked
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
