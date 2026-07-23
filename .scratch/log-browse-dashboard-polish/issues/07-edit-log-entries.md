Status: ready-for-agent

# Edit log entries

## Parent

`.scratch/log-browse-dashboard-polish/PRD.md`

## What to build

The Log's History table currently only supports delete (with a 10s undo) — there's no way to
correct a mis-entered field on a past game without deleting and manually re-entering it. Add an
"Edit" button to each History row, next to the existing "Delete" button. Clicking it populates all
Log form fields (including the now-optional Adversary field and the Blighted Island board type,
from tickets 1 and 6) from that entry and switches the form into "edit mode" (e.g. tracked via an
`editingId` piece of local state). Submitting while in edit mode calls a new `update(id, patch)`
method on `createGameLog()` (`src/domain/gameLog.ts`) instead of `append(entry)`, preserving the
entry's original id. The form must offer a way to cancel out of edit mode back to "create" mode
without submitting. Edit mode reuses the exact same field components and `canSubmit` validation as
creation — no parallel edit-only form.

## Acceptance criteria

- [ ] `createGameLog()` exposes an `update(id, patch)` method alongside the existing
      `append`/`list`/`remove`/`timesPlayed`/`replaceAll`.
- [ ] `update()` correctly modifies the stored entry's fields while preserving its `id`, and is a
      no-op or clearly-handled case if the id doesn't exist.
- [ ] Each History row has an "Edit" button alongside "Delete".
- [ ] Clicking Edit populates every Log form field (spirits, outcome, adversary, board type,
      scenario, notes, blight remaining, etc.) from that entry's data.
- [ ] The form visibly indicates it's in edit mode (vs. create mode).
- [ ] A Cancel control exits edit mode without modifying the entry and returns the form to a blank
      create state.
- [ ] Submitting in edit mode updates the existing entry in place (verified in History: same
      position/id, updated field values) rather than appending a new entry.
- [ ] Edit-mode submission is gated by the same `canSubmit` validation as entry creation.
- [ ] `src/domain/__tests__/gameLog.test.ts` covers `update()`: successful update, id preservation,
      and the not-found case.

## Blocked by

- Optional Adversary field
- Blighted Island board type
