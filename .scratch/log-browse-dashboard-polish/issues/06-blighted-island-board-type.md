Status: ready-for-agent

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

- [ ] `boardType` on `LogEntry` accepts `'blighted-island'` as a valid value.
- [ ] The Log form's board type select offers a "Blighted Island" option alongside the existing
      three.
- [ ] Entries logged with `boardType: 'blighted-island'` save, list, and display correctly in the
      History table (board type is visible somewhere in the row, consistent with how existing
      board types are shown, if they're shown today).
- [ ] `blightRemaining` behavior is unchanged — still a bare optional number, unaffected by this
      change.
- [ ] Domain tests cover round-tripping an entry with `boardType: 'blighted-island'`.

## Blocked by

None — can start immediately.
