Status: done

# Prefactor: canon test accepts any known subject

## Parent

`.scratch/card-tier-lists/PRD.md`

## What to build

The tier-list canon tripwire currently hard-asserts that **every** shipped list declares
`subject: 'configurations'`. That assertion made sense while configurations lists were the only
ones that existed, and its own comment says to extend it — "extend, never drop, when a card list
ships". As written it fails the instant a `minor-powers` or `major-powers` list is registered.

Defuse it before any card list exists, so the two shipping tickets land against a green suite
rather than discovering a red CI run they did not cause.

This is a pure prefactor: no data changes, no new lists, no behaviour change. Make the change
easy, then make the easy change.

Also widen two doc comments on the `TierList` type. `uncertain` and `unresolved` are both
documented in terms of "configIds", but ADR 0002 made tier keys subject-namespaced and the card
subjects key by power-card name. Both fields are about to be used by card lists for the first
time, so the prose should describe keys rather than configIds. Comment-only — the types themselves
are correct and must not change.

## Acceptance criteria

- [ ] The canon test asserts each shipped list declares a subject present in `TIER_LIST_SUBJECTS`,
      rather than asserting the specific value `configurations`
- [ ] A list declaring an unknown subject still fails the test, with a message naming the list and
      the bad subject
- [ ] The existing per-list loop that resolves tier keys against the subject's namespace is
      unchanged — it is already correct for all three subjects
- [ ] The existing assertions that the `minor-powers` and `major-powers` namespaces contain 101 and
      78 entries are unchanged
- [ ] `uncertain` and `unresolved` doc comments describe keys rather than configIds
- [ ] No change to any type, field, or shipped data file
- [ ] Full test suite green

## Blocked by

- None — can start immediately
