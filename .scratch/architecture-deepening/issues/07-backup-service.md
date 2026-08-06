# 07 — Backup round-trip becomes a module

**What to build:** A new domain module, `backupService`, owns collecting a backup from the stores and applying one back,
taking the stores behind a single store-handle seam. Collecting assembles the backup state from each store; applying
writes each store with ADR 0012's semantics exactly — personal tier-list overrides replaced per list, complexity
overrides replaced, Collection replaced, answers replaced, game log merged and de-duplicated by entry id, cited lists
refused, unknown ids surfaced as unresolved. Known-ids assembly and the unresolved-id report move into the module. The
Settings tab keeps the file download, file input, and confirm-before-replace prompt, but its export/import handlers
become thin. The import path's answers write flows through the change notification from the rank-session work, so the
recommender provider re-syncs.

**Blocked by:** 06 — Rank-session pipeline becomes a module.

**Status:** done

- [ ] `backupService` collect/apply works over in-memory store adapters; the Settings handlers are thin.
- [ ] Applying a backup reproduces ADR 0012 semantics exactly (replace per personal list, replace complexity, replace
      Collection, replace answers, merge + de-duplicate log, refuse cited lists, surface unknown ids).
- [ ] A backup import mid-session updates the recommender's in-memory answers through the change notification.
- [ ] Collect→apply round-trip, unknown-id surfacing, and log merge/de-dupe are unit-tested (touching no localStorage
      and no DOM).

## Comments

Implemented 2026-08-06. `src/domain/backupService.ts` owns collect/apply over a single store-handle
seam, plus known-ids assembly and the unresolved-id report. Applying reproduces ADR 0012 exactly
(replace per personal list, replace complexity/Collection/answers, merged + de-duplicated log,
cited lists refused, unknown ids surfaced). Settings' handlers are thin (file download, file input,
confirm prompt). The answers write flows through `answers.save`, so the recommender provider
re-syncs via the change notification. `backupService.test.ts` covers the collect→apply round-trip,
cited refusal, unknown ids, and log merge/de-dupe over in-memory adapters (no localStorage, no DOM).
