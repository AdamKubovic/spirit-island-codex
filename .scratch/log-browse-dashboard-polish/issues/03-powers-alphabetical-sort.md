Status: ready-for-agent

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

- [ ] `PowerSort` type includes `'name-asc'` and `'name-desc'`.
- [ ] `sortPowerCards()` sorts correctly by name ascending and descending for both new values.
- [ ] The Powers "Sort by" select offers both new options alongside the existing Deck
      order/Cost options.
- [ ] Selecting either new sort option reorders the visible power cards accordingly.
- [ ] `src/domain/__tests__/powerCardArrange.test.ts` covers both new sort values, following the
      existing cost-asc/cost-desc test shape in that file.

## Blocked by

None — can start immediately.
