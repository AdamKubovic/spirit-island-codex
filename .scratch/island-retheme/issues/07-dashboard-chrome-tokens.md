# 07 — Dashboard chrome onto `--deck-*` tokens

Status: ready-for-agent
Parent: [PRD-2.md](../PRD-2.md)

## What to build

Replace the hardcoded hex declarations in `src/deck.css` for `.dashboard-picker`,
`.dashboard-facet-bar`, `.dashboard-facet-slow`, `.dashboard-gap-odds-table td`,
`.deck-element-track`, `DeckUpset`'s non-semantic track/background rules, and `OcfduBars`'
`.ocfdu-column-track`/`.ocfdu-element-chip` with the semantically-nearest `--deck-*` token.
Re-grep before starting — PRD-2's line numbers are a snapshot.

**Do not touch** `DeckUpset.tsx`'s element-icon colours (`ELEMENT_BAR_COLOR`) or its set-size
palette (`setSizeClass`'s colour classes) — those are locked semantic judgment values
(deck-dashboard #03), not shell chrome. Only the surrounding tracks/backgrounds/borders are in
scope.

## Acceptance criteria

- [ ] Every hardcoded hex found in the audited selectors is either a `--deck-*` token or escalated
      to the owner as a declaration with no clean token match — never silently invented.
- [ ] `DeckUpset`'s element/set-size semantic colours are untouched.
- [ ] Visual check at 375px + desktop against the shipped app; screenshot before/after in
      `screenshots-06/`.
- [ ] `cardChipColors.test.ts` and the full suite pass unchanged.

## Blocked by

None.

## Comments
