# 05 — Log entry absorbs the form↔entry mapping

**What to build:** The log entry domain module gains the form↔entry mapping in both directions. Submitting the form runs
through `formToEntry` (empty fields become `undefined`, terror level clamped, strings trimmed and dropped when empty),
and entering edit mode runs through `entryToForm` (entry → form state). The adversary-level clamping policy (min/max per
adversary) moves into the module with them. The form uses the shared configuration-id helper instead of re-splitting a
configuration id by hand. The duration helper stays in the module and finally gains its unit test. The Log tab's
behavior is unchanged.

**Blocked by:** None — can start immediately.

**Status:** done

- [ ] `formToEntry` and `entryToForm` live in the domain module and are covered by unit tests.
- [ ] The adversary-level clamping policy is in the module, tested.
- [ ] The form uses the shared configuration-id helper; the hand-rolled re-split is deleted.
- [ ] The duration helper has its long-promised unit test (same-evening, past-midnight, missing input).
- [ ] The Log form still submits, edits, and cancels an edit identically.

## Comments

Implemented 2026-08-06. `logEntry.ts` now owns `formToEntry` (empty → undefined, trimmed, clamped),
`entryToForm`, and the adversary-level clamping policy (`clampAdversaryLevel`). GameLog submits and
edits through them, and `spiritForConfig` uses the shared `fromConfigId` instead of re-splitting a
configId. `formatDuration` finally gained its unit test (same-evening, past-midnight, missing
input). The Log tab's submit/edit/cancel behaviour is unchanged, pinned by the existing smoke
tests.
