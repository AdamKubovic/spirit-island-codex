Status: done

# Alphabetical sort for Powers

## Parent

`.scratch/log-browse-dashboard-polish/PRD.md`

## What to build

The Powers tab's "Sort by" control gets alphabetical sorting, mirroring the existing
cost-asc/cost-desc pairing. `PowerSort` (`src/domain/powerCardArrange.ts`) gains `'name-asc'` and
`'name-desc'` values, each sorting by the power card's display name. `sortPowerCards()` gets
matching cases. The Powers "Sort by" `<select>` in `CardsTab.tsx` gets two new options, worded
consistently with the existing cost options (e.g. "Name (A → Z)" / "Name (Z → A)").

## Acceptance criteria

- [x] `PowerSort` type includes `'name-asc'` and `'name-desc'`.
- [x] `sortPowerCards()` sorts correctly by name ascending and descending for both new values.
- [x] The Powers "Sort by" select offers both new options alongside the existing Deck
      order/Cost options.
- [x] Selecting either new sort option reorders the visible power cards accordingly.
- [x] `src/domain/__tests__/powerCardArrange.test.ts` covers both new sort values, following the
      existing cost-asc/cost-desc test shape in that file.

## Blocked by

None — can start immediately.

## Comments

`PowerSort` gained `'name-asc' | 'name-desc'`; `sortPowerCards()` sorts with
`localeCompare` (stable copy preserved, same as the cost sorts). CardsTab's Sort select offers
"Name (A → Z)" / "Name (Z → A)" after the cost options. Tests follow the existing cost-asc/
cost-desc shape. Verified via Playwright: name-asc leads with "A Circuitous and Wending
Journey", name-desc with "Wrap in Wings of Sunlight".
