# 02 — One guarded persistence module behind the storage seam

**What to build:** A new domain module between the raw string storage adapter and the five persistent stores owns the
slab every store currently hand-rolls: the corrupt-JSON read guard, the seed fingerprint guard (mismatch discards and
reports, per ADR 0012), the edits-vs-seed delta filter, and the discard-and-report state. Each store keeps its seed map
and its business reads and composes the module for persistence. The byte-identical fingerprint implementations and the
triplicated delta filter collapse to one; the answers store gains the corrupt-JSON guard it currently lacks. No caller's
view of a store changes.

**Blocked by:** None — can start immediately.

**Status:** done

- [ ] One module owns the corrupt-JSON guard, seed fingerprint, delta filter, and discard-report; the per-store copies
      are deleted.
- [ ] All five persistent stores compose the module with their business interfaces unchanged.
- [ ] The answers store now degrades to a fresh state on corrupt JSON instead of throwing on load.
- [ ] Every existing store test passes unchanged; new cases cover corrupt JSON, fingerprint mismatch discard + report,
      and the delta filter keeping only real edits.

## Comments

Implemented 2026-08-06. `src/domain/guardedStore.ts` owns the corrupt-JSON guard, the FNV-1a seed
fingerprint, the discard-and-report state, and a per-key read cache; `editsVsSeed` is the single
delta filter. All five stores (tier, complexity, collection, answers, log) compose it — the
byte-identical fingerprint copies and the triplicated delta filter are gone, and the answers store
now degrades to a fresh state on corrupt JSON instead of throwing. Existing store tests pass
unchanged; new `guardedStore.test.ts` covers corrupt JSON, fingerprint mismatch discard + report,
and the delta filter.
