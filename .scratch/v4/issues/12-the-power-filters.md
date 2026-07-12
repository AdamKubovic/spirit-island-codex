# 12 — The power filters

Status: blocked
Type: wayfinder:task (AFK)
Parent: [v4 map](../MAP.md) · Spec: [PRD.md](../PRD.md)

## What to build

The reason the tab exists: *"majors, Fire, cost ≤ 3, Branch & Claw"* answered as one query instead of
four passes. Dropdown and multi-select controls over the 332 power cards, with a live match count.

**No free-text search** — the owner's call, because a closed vocabulary can only ask questions the
data can answer. Every control's options are derived from the dataset's actual values, so no control
can offer a filter the data cannot honour.

Filtering is a **pure function** in the domain layer taking the dataset and a filter state and
returning the matches — the one new seam this feature adds. The component holds filter state and
renders; it contains no filtering logic. This is how `recommend()` and `configurations` are already
built, and it is what makes the tab testable without React.

The control set and its semantics are **not decided here** — they are #03's spec, implemented
verbatim. In particular, whether selecting Fire and Sun means *Fire or Sun* or *Fire and Sun* is
#03's call, and this ticket encodes it once, in the filter function.

## Acceptance criteria

- [ ] Every control in #03's spec exists, with the options and semantics #03 chose, and no others
- [ ] The chosen element multi-select semantics are **legible in the UI**, not buried — a player who
      gets an unexpected result count can see why
- [ ] Controls combine: applying several narrows the set rather than replacing the query
- [ ] A match count is shown
- [ ] Filters clear in one action
- [ ] The filter function is tested directly, through its public signature, with no React: each
      control alone; controls combined; a filter matching nothing; a filter on a field a card type
      does not have. The element semantics are pinned **explicitly** — it is the one place a
      plausible-but-wrong implementation would pass a lazy test
- [ ] Verified in a real browser at 375px and desktop width

## Blocked by

- [11 — Power cards, end to end, unfiltered](11-power-cards-end-to-end.md)
- [03 — The filter set and what it means](03-the-filter-set.md)
