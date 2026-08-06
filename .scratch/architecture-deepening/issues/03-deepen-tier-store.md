# 03 — Deepen the tier store: Subject dispatch, one rank-of, policy in one place

**What to build:** The tier domain module absorbs what the tier board currently re-derives. Subject dispatch (which
items belong to a Subject — configurations vs power cards — their id namespace and universe size) becomes a domain
concern with one home. "Where a label sits in a list's vocabulary" is computed once — one normalized rank-of covering
the tier prior, the display chips, and the board's row order, including the single-band edge case. Active/default list
resolution is answered only by the store, so the board's divergent fallback is deleted. The empty-string→unrated
sentinel and the cited-list edit refusal stop being re-encoded in the component. Storage reads are memoised once behind
the seam, and the store's near-duplicate public reads collapse.

**Blocked by:** 02 — One guarded persistence module behind the storage seam.

**Status:** done

- [ ] Subject dispatch and the single rank-of computation live in the domain module; the board, the canon test, and the
      dashboard no longer re-derive them.
- [ ] The board's divergent "no list for this Subject" fallback and its copies of the unrated sentinel / edit-refusal
      rules are deleted.
- [ ] A board render no longer re-parses the same stored JSON repeatedly.
- [ ] Existing tier store and tier list canon tests pass unchanged; new tests cover the single rank-of (including
      single-band lists) and the Subject dispatch.

## Comments

Implemented 2026-08-06. `src/domain/tierSubjects.ts` owns subject dispatch (which items, id
namespace, universe size); `tierStore` exports the single `tierLabelPosition`/`rankOf` (single-band
→ 0) used by the prior, the display chips (`tierColors`), and the board. The board's divergent
"no list" fallback was deleted; the empty-string→unrated routing moved into `setTier`; storage
reads are memoised behind the guarded-store cache. `getActiveListId` collapsed into `getActiveList`.
The canon test derives its key namespace from the domain module, keeping its count pins. Existing
tier store and canon tests pass; new `tierSubjects.test.ts` and `tierRank.test.ts` pin the dispatch
and the rank-of.
