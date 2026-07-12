# 12 — The power filters

Status: done
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

## Comments

`src/domain/powerCardFilter.ts`: `filterPowerCards(cards, filter)`, a pure function, the only new
seam. `PowerCardFilterState` has `elements` (AND — a floor, per #03), `maxCost` (≤ ceiling),
`speed` (exact), `kinds` (OR among themselves — a card is only ever one kind, so multi-select here
means "either," never an always-empty intersection — the one place the "AND across controls" rule
doesn't apply *within* a single control), `expansion` (exact). Every field composes with every
other by AND. `CardsTab` holds `filter` state and calls `filterPowerCards` in a `useMemo`; it does
no filtering itself.

`powerCardFilter.test.ts` (11 cases): every control alone, two elements together pinned as AND
(not OR — an explicit test asserting "Fire Only" and "Sun Only" are excluded when both are
selected, so a plausible-but-wrong OR implementation would fail loudly), a selected element set as
a floor (extra elements don't disqualify), controls combined narrowing together, a filter matching
nothing, and a filter value no card in the set has.

UI (`CardFilters.tsx`): element toggles are icon buttons (reusing `public/elements/*.webp` from
#04/#11) labelled "must have all selected" so the AND semantics are visible, not just tested —
#12's own acceptance criterion. Kind is a 3-button toggle group (OR). Cost/speed/expansion are
`<select>`s reusing the existing `.filters` CSS class from `Browser.tsx` rather than duplicating
it. One "Clear filters" button, disabled when already empty.

Verified against a production build in real Chromium at 375px and 1440×900: selecting Fire narrows
332→128, adding Sun narrows 128→38 (confirms AND live, not just in the unit tests), cost≤2 narrows
further to 26, Clear resets to 332/332, zero horizontal overflow at either width.

`tsc -b`, the full suite (262/262, up from 251), and `vite build` all clean.

**Card type stays a single segment (Powers) for now** — #03 chose a segmented switch overall, but
building the other three segments (Fear | Events | Blight) is #13's job, once fear/event/blight
have a dataset. Adding empty tabs ahead of that data would be scaffolding for later, which later
can scaffold for itself.
