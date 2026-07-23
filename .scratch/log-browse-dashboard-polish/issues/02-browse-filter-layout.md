Status: done

# Browse filter layout parity with Archive

## Parent

`.scratch/log-browse-dashboard-polish/PRD.md`

## What to build

Browse's search box and filter selects currently share one flat wrapping row, so filters get
squeezed by the growing search field on narrower viewports. Restructure `Browser.tsx` to match
Archive's existing layout: search sits alone in its own row, and the filter selects (Expansion,
Complexity, Tag, Strong in, Sort by) sit together in a single row below it. Reuse Archive's
existing `.card-filters` / `.card-filters-row` CSS classes (already defined in `src/deck.css` and
used by `CardFilters.tsx`) rather than duplicating parallel rules under `.filters`. No further
sub-grouping or collapsed "more" section — that's Archive-specific and out of scope here. Clean
up any now-fully-superseded `.filters` CSS rules.

## Acceptance criteria

- [x] On Browse, the search input renders in its own row above the filter selects.
- [x] The five filter selects render together in one wrapping row below the search row.
- [x] The markup reuses Archive's `.card-filters` / `.card-filters-row` classes rather than
      introducing new parallel CSS.
- [x] Browse's filter behavior (filtering, sorting) is unchanged — this is a layout-only change.
- [x] Verified visually at both a wide and a narrow viewport width that filters no longer get
      squeezed by the search box.
- [x] Now-unused `.filters`-specific CSS rules (if any are fully superseded) are removed.

## Blocked by

None — can start immediately.

## Comments

Browser's filter markup now wraps in `.card-filters` with two `.card-filters-row` rows: search
alone in row 1, the five selects in row 2 with the existing `card-filters-row filters` companion
pattern (same as CardsTab's sort/group row), so the select/label styling still comes from
`.filters`. The `.filters` CSS rules were NOT removed — they remain in use by CardFilters.tsx,
CardsTab.tsx and OtherCardFilters.tsx as that companion class; only Browse's bare
`className="filters"` usage went away. No new CSS added. Verified via Playwright at 1280px and
700px: search renders above the selects row at both widths, the five selects share one wrapping
row, and name search still narrows the grid (37 -> 1).
