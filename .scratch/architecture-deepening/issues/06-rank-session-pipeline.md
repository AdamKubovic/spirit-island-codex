# 06 — Rank-session pipeline becomes a module

**What to build:** A new domain module, `rankForSession`, owns the whole recommend pipeline — answers → derived
preferences → optional gap-tuning toward the team → candidate pool (hard-filter + excluded Configurations) → times-played
→ recommend → de-duplicate by spirit → Wildcard selection. Its interface takes the answers and the session's
store-derived inputs and returns the ranked shortlist and the Wildcard. The recommender component slims to a call, and
the "correct only because the app unmounts this component" comment is deleted. The regression test that pins the full
ranking calls the module directly. The shortlist size is declared once. The answers store gains a change-notification
capability and the recommender provider subscribes, so an external write to the persisted answers (e.g. a backup
import) re-syncs the provider instead of diverging until reload.

**Blocked by:** 01 — Consolidate the scoring primitives into one module.

**Status:** done

- [ ] `rankForSession` produces the same ranked shortlist and Wildcard the app shows today; the component hook slims to
      a call and the mount-timing comment is deleted.
- [ ] The shortlist size is owned by the module; the Wildcard's off-shortlist exclusion reads it.
- [ ] The ranking regression test calls the module directly with fresh state and reproduces the pinned output exactly.
- [ ] The answers store notifies change; the recommender provider re-syncs instead of reading once, and a backup import
      mid-session no longer leaves persisted and in-memory answers diverged.
- [ ] New tests cover the pipeline with fresh state, complexity overrides, a filtered Collection, a tuned team, and a
      Wildcard offset.

## Comments

Implemented 2026-08-06. `src/domain/rankForSession.ts` owns the whole pipeline — answers →
preferences → gap-tuning → candidate pool → times-played → `recommend()` → `dedupeBySpirit` →
Wildcard — with `SHORTLIST_SIZE` declared once and passed to `selectWildcard`. `useRanking` slims
to a snapshot + call; the mount-timing comment is deleted. The answers store gained `subscribe`
and the provider re-syncs on external writes, so a backup import mid-session no longer diverges
persisted and in-memory answers. The ranking pin now calls `rankForSession` directly with fresh
state and reproduces the pinned output exactly. New tests cover fresh state, complexity overrides,
a filtered Collection, a tuned team, and a Wildcard offset.
