Status: done

# Name search — Browse

## Parent

.scratch/gallery-nav-and-search/PRD.md

## What to build

Add a text search field to Browse's filter bar, alongside the existing expansion/complexity/tag/
strong-in dropdowns and the hard-filter checkbox. The field filters the grid to spirits/aspects
whose name matches the typed text (case-insensitive substring), and combines with the existing
filters — narrowing further, not replacing them.

## Acceptance criteria

- [ ] A text input is present in Browse's filter bar.
- [ ] Typing a substring of a spirit or aspect name narrows the visible grid to matching items
      only, case-insensitively.
- [ ] The search field combines correctly with at least one existing filter (e.g. a name plus an
      expansion pick narrows to the intersection of both).
- [ ] Search matches on name only — not summary, notes, or any other field.
- [ ] Clearing the search field restores the previously-filtered (non-search) result set.

## Blocked by

None — can start immediately.

## Comments

Implemented and tests added in `src/components/__tests__/appSmoke.test.tsx`.
