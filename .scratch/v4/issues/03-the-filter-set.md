# 03 — The filter set and what it means

Status: blocked
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
[#06](06-ship-the-cards-tab.md) implements without re-deciding anything.
