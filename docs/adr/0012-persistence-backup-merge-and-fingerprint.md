# 0012 — Persistence: backup merge policy and the seed-fingerprint staleness guard

Status: accepted
Date: 2026-07-21

## Context

The app persists user state in `localStorage` (tier overrides, complexity overrides, questionnaire
answers, the game log, the collection) and can export/import it as a backup file. Two questions
recur and are easy to get subtly wrong: how a backup merges into existing state, and what happens to
an override when the shipped data it was edited against changes. Decided in v2, extended through
v3/v5; the tier-side migration detail lives in ADR 0001.

## Decision

- **Backup merge is asymmetric, by design** (`backup.ts`): `tiers`, `complexityOverrides`,
  `answers` and `collection` **replace** existing state (each is one coherent opinion); the `log`
  **appends and de-duplicates by entry `id`**, because a game log is an accumulating record that
  replacing would destroy. An entry with a missing/invalid `id` or `players` is reported, never
  merged blind.
- **Unknown ids surface, never silently drop.** A key the current dataset no longer recognises — a
  stale configId, a removed listId, an unknown expansion — lands in `unresolved` rather than being
  dropped or applied. Surfacing data loss beats hiding it.
- **The backup carries no seed fingerprint**, so a restore is lossless across seed growth (e.g. the
  37→68-configuration expansion): `BackupState` has no fingerprint field, and a schema < v3 backup
  migrates forward — a v1 flat tier map attributes to the owner's list (ADR 0001), an absent
  `collection` reads as "owns everything". The schema version only guards against importing a
  *newer* file than the app understands.
- **In-store overrides are fingerprint-guarded, and discard is reported.** `tierStore` and
  `complexityStore` stamp a `SEED_FINGERPRINT`; an override edited against a since-changed printed
  value (a changed tier seed, a changed printed complexity) is discarded rather than silently
  misapplied — a stale complexity override would misjudge the newcomer ceiling (ADR 0007). The
  discard is reported (`wasDiscarded`), never silent.

## Consequences

- The two persistence layers have deliberately opposite policies: overrides are disposable opinions
  guarded against staleness; the log and backup are durable records guarded against loss.
- A dataset change that moves a fingerprint is a known, reported event, not a silent data loss.

## Left open, deliberately

**Nothing outstanding.** The fingerprint guard is deliberately conservative — discard-and-report on
any seed change; a finer-grained migration that preserved more overrides across seed changes would
be a future enhancement, not a correction.
