# 01 — Consolidate the scoring primitives into one module

**What to build:** A single domain module becomes the only home for the facts the scorers currently re-declare: the
OCFDU axis list, the Complexity→number map, and the weight×rating dominance read. The four copies of each fact — spread
across the recommend scorer, the Wildcard selector, the "why you" commentary, the aspect nudges, the answers→preferences
conversion, the random chooser, and the configuration expansion — collapse into imports from that one module. The
behavior of every scorer is unchanged; only where the facts live changes.

**Blocked by:** None — can start immediately.

**Status:** done

- [ ] One module declares the canonical OCFDU axis list, the Complexity→number map, and a single dominance/fit read.
- [ ] Every existing scorer consumes the module instead of re-declaring the facts; the re-declarations are deleted.
- [ ] The dead `elementAffinity` accumulation is removed from the answers→preferences conversion; the element wizard
      question itself is unchanged.
- [ ] The existing axis-pinned score tests pass unchanged (they are the drift guard).

## Comments

Implemented 2026-08-06. `src/domain/scoringPrimitives.ts` now declares `AXES`, `COMPLEXITY_LEVEL`,
and `dominantAxis` once; `recommend`, `wildcard`, `randomChoose`, `answersToWeights`, `whyYou`,
`aspectNudge`, and `teamCoverage` import them, and the render copies in `Recommender`/`Browser`/
`tagColors`/`axisLabels` consume or re-export the same declarations. The dead `elementAffinity`
accumulation was removed from `answersToWeights` (the element wizard question is unchanged). The
axis-pinned score tests and the ranking pin pass unchanged.
