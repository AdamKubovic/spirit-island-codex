# 06 — Card/other-card row chrome onto `--deck-*` tokens

Status: ready-for-agent
Parent: [PRD-2.md](../PRD-2.md)

## What to build

Replace the hardcoded hex declarations in `src/deck.css` for `.card-row-pill`, `.card-row-cost`,
`.card-row-spirit`, `.expansion-chip`, `.subtype-chip`, `.subtype-chip-empty` (the row chrome
`CardRows.tsx`/`OtherCardRows.tsx`/`AdversaryRows.tsx` render into) with the semantically-nearest
`--deck-*` token. Re-grep `src/deck.css` for `#[0-9a-fA-F]{3,6}` near these selectors before
starting — PRD-2's cited line numbers are a snapshot and will have shifted.

Do not touch `tagColors.ts`'s chip *palettes* (`EXPANSION_COLOR`, `SUBTYPE_COLOR`, etc.) — those
are the already-decided semantic colours the chips render; only the surrounding chrome (padding
backgrounds, borders, muted text) is in scope here.

## Acceptance criteria

- [ ] Every hardcoded hex found in the audited selectors is either a `--deck-*` token or escalated
      to the owner as a declaration with no clean token match — never silently invented.
- [ ] Visual check at 375px + desktop against the shipped (no-query-param) app; screenshot
      before/after in `screenshots-06/`.
- [ ] `cardChipColors.test.ts` and the full suite pass unchanged.

## Blocked by

None — the direction is already decided ([PRD.md](../PRD.md)).

## Comments
