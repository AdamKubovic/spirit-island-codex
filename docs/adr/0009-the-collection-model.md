# 0009 — The collection: an app-wide, owns-everything-by-default filter

Status: accepted
Date: 2026-07-21

## Context

The owner asked for an expansion filter on the tier list so unowned spirits could be set aside. The
same control would be re-invented on Browse, the Recommender and the Archive within a month, so it
is one concept, not a tier-list feature. It also has to default sanely for a stranger opening a
public knowledge base who owns nothing in particular. Decided across v5 #06/#07a/#07b/#07c.

## Decision

- **The collection is app-wide and expansion-granular** — `collectionStore.ts`, mirroring
  `complexityStore`'s injected-storage shape rather than inventing a new pattern.
- **Absence means owns everything.** The store holds only the expansions the user explicitly turned
  *off* (`excluded`), a delta from "owns everything" — never an "all true" snapshot. A fresh
  visitor, and any pre-collection backup, reads as owning everything with no migration
  (`backup.ts`'s `collection` is absent on schema < v3 and reads as an empty exclude list).
- **Annotate by default; hard-filter is an opt-in, session-only toggle.** Unowned content is dimmed
  with a "not in your collection" note by default — information, not silence — on Browse, the
  Recommender and the tier board. Hiding is an explicit per-surface checkbox that does not persist.
- **The hard-filter pre-filters the candidate pool *before* `recommend()` runs.** This was the open
  question #06 left; the owner chose pre-ranking so an untouched collection reproduces today's
  ranking byte-for-byte and a hard-filtered shortlist always fills rather than coming back short.
  `recommendCollection.test.ts` pins this and **fails if the filter is ever moved to after
  `recommend()`**.
- **The Archive never filters by collection.** Browsing an expansion you don't own is partly how
  you decide to buy it.

## Consequences

- One store, one concept; a new surface opts into the same annotate / hard-filter pattern instead
  of reinventing an expansion control.
- The pre-ranking ordering is a pinned invariant, not a convention — a refactor that reorders it
  breaks a test whose message says why.

## Left open, deliberately

**Nothing outstanding.** The provisional #07c question — should the Archive hide unowned cards? —
was resolved as "no" above.
