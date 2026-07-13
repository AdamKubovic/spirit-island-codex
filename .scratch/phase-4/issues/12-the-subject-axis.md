# 12 — The subject axis

Status: done
Parent: [Phase 4 PRD](../PRD.md) · cluster 2 (tier data layer)

## Blocked by

None — can start immediately.

## What to build

The domain expand that makes the tier-UX cluster easy, per the
[architecture resolution](06-multi-tier-list-architecture.md) — no UI change in this ticket:

- Every tier list declares a required **subject** — `configurations`, `minor-powers`,
  `major-powers` — defining the id namespace of its tier keys. The three shipped lists migrate
  to `subject: configurations`.
- The tier store tracks **one active list per subject**, and a durable **default list**
  preference (seeded to the credited cited list) that boot activates. Settings UI for the pick
  arrives in [#18](18-attribution-and-the-default-list.md); list-creation UI in
  [#16](16-card-subject-lists-end-to-end.md) — this ticket ships the domain seams they call.
- ADR 0001's rules extend unchanged along the axis: cited = immutable + citation required;
  personal = editable, any subject. No `game` field.
- **ADR 0002 (the tier-list subject axis)** is written, per the map's standing note.

## Acceptance criteria

- [x] The canon test pins `subject` on every shipped list and resolves card-list tier keys
      against the power-card dataset (the tripwire for any future card list)
- [x] Active-list-per-subject and default-list rules are unit-tested with injected storage
      (model: the existing tier-store tests)
- [x] Backup round-trips unchanged, or the schema version is bumped with a migration — verified,
      not assumed
- [x] ADR 0002 committed; CONTEXT.md vocabulary (subject, active list, default list) matches
- [x] All existing tests green; zero visible UI change

## Comments

**Resolved (2026-07-13).** `TierList` gains required `subject` (`TIER_LIST_SUBJECTS` in types);
the three shipped JSONs migrated to `subject: "configurations"` (one added line each). The store
now keeps **one session-scoped active list per subject** (`setActiveListId` keys by the list's
own subject; `getActiveListFor(subject)` is the new seam) and a **durable per-subject default**
(`getDefaultList`/`setDefaultListId` — the seams #18's Settings pick calls) that boot activates.
The legacy durable active-list key migrates to the configurations default, so existing users keep
booting into the list they had chosen. Pre-#12 personal lists (persisted without a subject) are
backfilled to `configurations` on read — recorded fact, they could rank nothing else. Card-subject
tier keys resolve against power-card **names** (the dataset carries no other id); the canon test
pins every shipped list's subject and holds any future card list's keys against `power-cards.json`.
Backup schema stays v3 — backups never carried the active or default pick — verified by the
round-trip suite. ADR 0002 written. 337/337 green; production build verified at 375px + 1280px:
boot state pixel-identical (Owner's board active everywhere).

**⚠️ Owner note — the default seed is deliberately NOT the credited list yet.** The ticket says
"seeded to the credited cited list", but the owner's named default video
(`watch?v=LoP2T4GO4xo`, MAP.md) matches **no shipped list's citation** — `3mbg-strength-solo-2025`
cites `watch?v=d130MTU08fg`. Seeding 3MBG here would be guessing which video you meant — exactly
the tripwire #18 defines ("stop and surface rather than guessing"), and it would also have broken
this ticket's own "zero visible UI change / all tests green" criteria. The seed stays the owner's
board; #18 verifies the URL, flips the seed via `setDefaultListId`, and ships the attribution
that must accompany it. Recorded in ADR 0002 "Left open" and CONTEXT.md.

One behaviour change shipped as specced (#06 decision 2): switching lists mid-session is now
session-only; the durable thing is the default pick. The old "active list persists across reload"
test was rewritten to pin the new contract.

Code review: Spec axis confirmed one bug (the pre-#12 personal-list stranding), fixed with a
regression test; it judged the seed deferral the more spec-faithful call. The Standards axis run
was interrupted by the owner and did not report.
