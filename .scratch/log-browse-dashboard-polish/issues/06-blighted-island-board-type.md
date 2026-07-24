Status: done

# Blighted Island board type

## Parent

`.scratch/log-browse-dashboard-polish/PRD.md`

## What to build

Games logged on the Blighted Island board variant currently can't be distinguished from
classic/thematic games — "Blight remaining" is a bare number with no board context. Add
`'blighted-island'` as a new `boardType` value alongside the existing `'classic' |
'thematic-base' | 'thematic-rebalanced'`. This is an additional enum member, not a new field —
"Blight remaining" itself is unchanged. Add the option to the Log form's board type `<select>`
and to the `LogEntry` type in `src/domain/backup.ts`.

## Acceptance criteria

- [x] `boardType` on `LogEntry` accepts `'blighted-island'` as a valid value.
- [x] The Log form's board type select offers a "Blighted Island" option alongside the existing
      three.
- [x] Entries logged with `boardType: 'blighted-island'` save, list, and display correctly in the
      History table (board type is visible somewhere in the row, consistent with how existing
      board types are shown, if they're shown today).
- [x] `blightRemaining` behavior is unchanged — still a bare optional number, unaffected by this
      change.
- [x] Domain tests cover round-tripping an entry with `boardType: 'blighted-island'`.

## Blocked by

None — can start immediately.

## Comments

`'blighted-island'` added to `LogEntry.boardType` (backup.ts) and the shared `BoardType` union
(difficulty.ts), which forced a `BOARD_MODIFIER` entry: it is `0` with a comment recording that
no sourced community-chart modifier exists for Blighted Island — contributing nothing beats
fabricating a figure (pinned in difficulty.test.ts). The glossary difficulty entry's modifier
parenthetical now lists "Blighted Island +0" so the help text stays complete. The form's board
control is a chip group, not a `<select>` (the ticket's word; existing UI), so a fourth
"Blighted Island" chip was added alongside the existing three. History rows previously showed
no board type at all; per user story 10 the row now shows the board label as a meta line in the
Outcome cell for any non-classic board (classic stays silent as the default). Round-trip test
added in gameLog.test.ts (logEntry.test.ts owns no entry-construction helper — gameLog
append/list is the round-trip seam). Verified via Playwright: chip present, stored entry has
boardType blighted-island, history shows "Blight remaining 5 · Blighted Island".
