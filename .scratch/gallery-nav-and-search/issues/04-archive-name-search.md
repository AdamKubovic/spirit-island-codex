Status: done

# Name search — Archive (both sub-tabs)

## Parent

.scratch/gallery-nav-and-search/PRD.md

## What to build

Add a text search field to both of Archive's filter panels — the power-card filters and the
fear/event/blight filters — matching the same pattern as Browse's name search. Each field filters
its own card set by case-insensitive name substring match, combined with that panel's existing
filters. The two panels remain independent; no shared search component is introduced.

## Acceptance criteria

- [ ] A text input is present in the power-card filter panel, narrowing that card list by name
      substring, case-insensitively.
- [ ] A text input is present in the fear/event/blight filter panel, narrowing that card list by
      name substring, case-insensitively.
- [ ] Each search field combines correctly with at least one existing filter in its own panel.
- [ ] Search matches on card name only.
- [ ] Clearing either search field restores that panel's previously-filtered result set.

## Blocked by

None — can start immediately.

## Comments

Implemented and tests added in `src/components/__tests__/appSmoke.test.tsx`.
