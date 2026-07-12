# 03 — The filter set and what it means

Status: done
Type: wayfinder:grilling (HITL)
Parent: [v4 map](../MAP.md)

## Blocked by

- [01 — Where card data comes from](01-where-card-data-comes-from.md)

## Question

Given the fields #01 proves are sourceable: exactly which controls does the Cards tab offer, and
what does each one *mean* when combined with the others?

## Settled going in

The owner chose **dropdowns and multi-selects, no free-text search** — "more stable and robust than
just the text." He named: elements, cost, quick/slow, minor/major, expansion. Scope is powers +
fear/event/blight; adversaries, scenarios, aspects and panels are out.

## What has to be decided

- **Element multi-select semantics.** Pick Fire and Sun: does that mean cards with Fire **or** Sun
  (a wide net), or cards with Fire **and** Sun (a narrow one)? These give wildly different result
  counts and only one of them is what a player means. Not a coin-flip — grill it.
- **Card type: a filter, or a tab?** Fear/event/blight have almost no fields in common with powers
  (no elements, no cost, no speed). A single filter bar that greys half its controls out is a
  different product from a segmented "Powers | Fear | Events | Blight" switch that swaps the
  controls entirely.
- **Cost.** Exact values, or a range (≤ 3)? Uniques and minors cluster low, majors high.
- **What the tab shows before you filter anything.** All 471, or nothing until a filter is chosen?
- **Sort.** By name, cost, element? Is it a control or a fixed order?
- Anything #01 found that is sourceable and worth filtering on but the owner didn't think to name
  (range, target land type, "has a Push", …).

## What this ticket produces

A short filter spec in this ticket's `## Comments` — control by control, with its semantics — that
[#12](12-the-power-filters.md) and [#13](13-fear-event-and-blight.md) implement without re-deciding
anything.

## Comments

Owner's decisions (2026-07-12):

- **Elements: AND, not OR.** Selecting Fire + Sun shows only cards that carry *both* — Fire alone or
  Sun alone doesn't qualify. A card may have elements beyond the selected set (a 3- or 4-element
  card that includes Fire and Sun still matches); the selection is a floor, not an exact-match. The
  owner named this explicitly as "at least" the selected elements.
- **AND applies across every control, not just elements.** Selecting Fire+Sun *and* cost ≤2 *and*
  Fast narrows on all three simultaneously — filters compose by intersection, never by union. This
  generalizes the element rule rather than being a separate decision: one filter set, one card must
  satisfy all of it.
- **Card type is a segmented switch, not a filter control.** Powers | Fear | Events | Blight. Each
  segment shows only the controls that apply to its cards — elements/cost/speed appear only under
  Powers, since #01 already established fear/event/blight carry none of those fields. No greyed-out
  dead controls.
  - Within Powers, minor/major/unique stays a control (all three share the same fields per #01), not
    a further segmented split.
- **Cost is a range/threshold**, not an exact-value multi-select — "cost ≤ N." Matches how a player
  actually reasons about what they can afford; minors/uniques cluster low, majors high, so a ceiling
  is more useful than picking discrete values.
- **Unfiltered default**: the tab shows everything in the active segment before any filter is
  touched — exactly what #11 already ships for Powers (all 332, unfiltered). No empty-until-filtered
  state.
- **Sort stays fixed, alphabetical by name** — no sort control. Same as #11 already ships. Revisit
  only if filtering later makes a fixed order feel wrong in practice.
- **Nothing further named beyond the owner's original list** (elements, cost, quick/slow,
  minor/major, expansion, card type). Range, target, "has a Push" etc. — sourceable per #01 but not
  requested — stay out of scope; add only if asked for.
