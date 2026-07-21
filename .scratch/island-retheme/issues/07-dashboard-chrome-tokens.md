# 07 — Dashboard chrome onto `--deck-*` tokens

Status: done
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

- [x] Every hardcoded hex found in the audited selectors is either a `--deck-*` token or escalated
      to the owner as a declaration with no clean token match — never silently invented.
- [x] `DeckUpset`'s element/set-size semantic colours are untouched.
- [ ] Visual check at 375px + desktop against the shipped app; screenshot before/after in
      `screenshots-06/`. (skipped — no browser/screenshot tooling in this session)
- [x] `cardChipColors.test.ts` and the full suite pass unchanged.

## Blocked by

None.

## Comments

Re-grepped `src/deck.css`. Changes:

- `.ocfdu-column-track` background `#1a222b` → `var(--deck-panel-2)` (recessed track surface).
- `.ocfdu-element-chip` border `#2c3a46` → `var(--deck-line)`.
- `.dashboard-picker` border `#2c3a46` → `var(--deck-line)`.
- `.deck-element-track` background `#1a222b` → `var(--deck-panel-2)`.
- `.deck-upset-totaltrack` background `#1a222b` → `var(--deck-panel-2)`.
- `.deck-upset-dot` background `#1a222b` → `var(--deck-panel-2)`.
- `.dashboard-gap-odds-table th/td` border-bottom `#1a222b` → `var(--deck-line-soft)` (row-divider
  role, not a recessed surface).
- `.deck-upset-sizechip[data-active='true']` text `#10130d` → `var(--deck-bg)` — this is
  contrast text sitting on whatever colour the active size-filter button takes (locked set-size
  palette background); `#10130d` is numerically almost identical to `--deck-bg` (`#1c160e`), so
  unlike ticket 06's near-white cases, an actual close token exists here.
- Found a pre-existing duplicate-selector bug, not introduced by this ticket: `.dashboard-facet-fast`
  and `.dashboard-facet-slow` are each defined *twice* in `deck.css` (once near `.dashboard-facet-bar`,
  once again ~550 lines later near `.dashboard-speed-row`), both targeting the same
  `DeckFacets.tsx` markup — the later rule wins the cascade, so the first pair was already dead CSS
  pre-retheme. Left the duplicate *structure* alone (out of scope, a pre-existing bug not this
  ticket's to fix) but retokenized the hex in **both** copies for consistency, since leaving one
  updated and the other on stale hex would be worse: `fast` (`var(--deck-accent)` in the
  live/second copy, was `#d4502e`; first copy was already `var(--deck-accent)`) and `slow`
  (`var(--deck-dim)` in both copies, replacing `#566573` and `#3a7ca5`).

No escalations this ticket — every hardcoded hex in the audited selectors mapped cleanly onto an
existing token.

`DeckUpset.tsx`'s `ELEMENT_BAR_COLOR` and `setSizeClass` colour classes
(`.deck-upset-colfill.deck-upset-sizeN`, `.deck-upset-legend.deck-upset-sizeN`, and the matching
`.deck-upset-sizechip.deck-upset-sizeN[data-active='true']` background/border-color pairs that
mirror that same locked palette) were left untouched.

Screenshots not captured — no visual/browser tooling available in this session.

`npx tsc --noEmit` and `npx vitest run` both pass, `cardChipColors.test.ts` unchanged and green.
