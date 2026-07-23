Status: ready-for-agent

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

- [ ] On Browse, the search input renders in its own row above the filter selects.
- [ ] The five filter selects render together in one wrapping row below the search row.
- [ ] The markup reuses Archive's `.card-filters` / `.card-filters-row` classes rather than
      introducing new parallel CSS.
- [ ] Browse's filter behavior (filtering, sorting) is unchanged — this is a layout-only change.
- [ ] Verified visually at both a wide and a narrow viewport width that filters no longer get
      squeezed by the search box.
- [ ] Now-unused `.filters`-specific CSS rules (if any are fully superseded) are removed.

## Blocked by

None — can start immediately.
