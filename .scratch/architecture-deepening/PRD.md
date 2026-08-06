# Deepen seven shallow seams (architecture-deepening)

Status: ready-for-agent

## Problem Statement

The app works, but seven architectural frictions make it hard to test and hard to navigate. Each one is a place where
the *interface* and the *implementation* are misaligned — either real complexity lives where nothing can test it, or a
thin seam is re-implemented by hand everywhere it is used.

- **The recommend pipeline lives in a React hook.** The whole path from questionnaire answers to a ranked shortlist —
  weights, gap-tuning, candidate pool, four store reads, recommend, de-duplicate, wildcard — exists only inside a
  component hook, is untested, and is pinned by a test that re-implements the wiring by hand. Its correctness rides on a
  comment about when the app unmounts a component, and a dead branch (`elementAffinity`) is computed but never read.
- **The backup round-trip has no module.** `backup.ts` is deep and thoroughly tested, but actually exporting and
  importing a backup is hand-orchestrated inside a component. It is the only untested path in the whole persistence
  area, and its import path writes the persisted answers behind the recommender provider's back — the two diverge until
  a page reload.
- **The persistence seam is shallow.** Every store above the raw string storage re-implements the same slab —
  corrupt-JSON guard, seed fingerprint, edits-vs-seed delta filter, discard-and-report — with subtly different shapes.
  The FNV-1a fingerprint is byte-identical in two files; the delta filter is triplicated; one store has *no* corrupt-JSON
  guard at all.
- **The tier Subject axis is re-derived in the component.** "Where a label sits in a list's vocabulary" is computed
  three different ways, the active/default list policy is re-answered in a component with a subtly different answer, and
  the store re-parses storage on every call.
- **The Archive browse pipeline has no module.** The filter→sort→group composition lives in a component's memo chains,
  two parallel domain modules copy blocks from each other, and one domain module imports a presentation label from the
  components folder — an inverted dependency.
- **Log entry normalization lives in the component.** The module built to hold it holds two helpers instead; the
  form↔entry mapping, clamping policy, and a hand-rolled re-split of a configuration id all sit in untested component
  code, and a duration helper that was promised a test never got one.
- **The scoring cluster re-declares the same facts four times.** The OCFDU axis list, the Complexity→number map, and the
  weight×rating dominance read are each re-implemented in four places — a drift factory whose first casualty is already
  visible (the dead `elementAffinity` branch).

## Solution

Deepen the seven seams: each becomes a domain module with a small interface and the real complexity behind it, tested
through that interface (the interface is the test surface). Every change is behavior-preserving — the app's rendered
behaviour is unchanged; the existing pinned tests are the guard. The module naming follows the domain language: the
recommend pipeline works in Configurations, OCFDU weights, Tempo/board-control, the Wildcard, and the Active list's tier
prior; the persistence work respects ADR 0012's fingerprint-and-discard policy; the tier work respects ADR 0002's
Subject axis and ADR 0007's recommendation model; the Archive work leaves ADR 0009's "never hard-filter by Collection"
untouched.

The one shared test seam across every deepening is the standing codebase pattern: a domain module taking data (and, where
state persists, an injectable storage adapter) and returning results — no DOM, no module singletons mutated in tests.

## User Stories

1. As a maintainer, I want the whole recommend pipeline testable through one call, so a change anywhere in scoring can
   no longer silently shift the ranking without a test catching it.
2. As a maintainer, I want the recommend pipeline's store inputs passed in behind a seam, so the pipeline is deterministic
   and testable with fresh in-memory state.
3. As a maintainer, I want the "correct only because the app unmounts this component" comment deleted, so correctness
   stops depending on a timing convention nobody can see.
4. As a maintainer, I want the regression test that pins the full ranking to call the same module the app calls, so the
   test stops re-implementing the app's wiring by hand.
5. As a maintainer, I want the shortlist size declared once, so the recommender and the Wildcard selection can never
   disagree about how many picks fit the shortlist.
6. As a maintainer, I want the dead `elementAffinity` accumulation removed, so the pipeline stops computing a value
   nothing reads.
7. As a player, I want my persisted questionnaire answers to stay in sync with the recommender after I import a backup,
   so I don't have to reload the page to see my imported answers take effect.
8. As a maintainer, I want the backup export/import round-trip to be a module I can unit-test, so the collect-and-apply
   path that ADR 0012 describes is actually verified.
9. As a maintainer, I want the backup module to own the known-ids assembly and unresolved-id reporting, so a component
   stops reaching into five stores to assemble a backup by hand.
10. As a maintainer, I want the five persistent stores to share one guarded persistence module, so the corrupt-JSON
    guard, seed fingerprint, and delta filter exist once instead of in every store.
11. As a player, I want my saved state never to crash the app when its stored JSON is corrupt, so a truncated or edited
    backup or localStorage value degrades to a fresh state instead of throwing on load.
12. As a maintainer, I want one module to own "a stored edit that merely restates the seed", so backup exports carry
    real edits and never restated no-ops.
13. As a maintainer, I want the tier Subject dispatch (which items belong to a Subject, their id namespace, their total)
    to live in the domain module, so the board, the canon test, and the dashboard stop each re-deriving it.
14. As a maintainer, I want "where a label sits in a list's vocabulary" computed once, so the tier prior, the display
    chips, and the board's row order all agree even on single-band lists.
15. As a maintainer, I want the active/default list policy answered in one place, so a Subject with no list gets the same
    answer from the store and the board.
16. As a maintainer, I want the tier store to stop re-parsing storage on every read, so a board render no longer hits
    storage five times.
17. As a maintainer, I want the Archive browse pipeline (filter→sort→group) composed in one module per card family, so
    the order is pinned once and CardsTab just renders.
18. As a maintainer, I want the domain to stop importing presentation labels from the components folder, so the
    dependency direction points the right way and the card sub-type labels are decided where they render.
19. As a maintainer, I want the copied name-match and expansion-grouping blocks between the power and other-card modules
    collapsed, so the parallel pair has one home for what they share.
20. As a maintainer, I want the log form↔entry mapping (both directions) in the domain module, so "an empty field means
    undefined, never a fabricated 0" is a unit test instead of untested component code.
21. As a maintainer, I want the log form to use the shared configuration-id helper, so a spirit id is never re-split by
    hand in two places.
22. As a maintainer, I want the duration helper to finally get its long-promised unit test, so past-midnight games are
    measured correctly and verified.
23. As a maintainer, I want the OCFDU axis list, the Complexity map, and the dominance read declared once, so the four
    copies can never drift again.
24. As a maintainer, I want every deepening verified through its own module interface, so the test surface is the same
    seam the app's callers cross.

## Implementation Decisions

The seven deepenings are independent except where noted. Every module follows the codebase's standing pattern: pure
domain logic taking data (and an injectable storage adapter where state persists), returning results. No DOM. No
singleton mutation in tests.

### 1. The rank-session pipeline becomes a module

A new domain module, `rankForSession`, owns the assembly currently performed inside the component hook: answers →
derived preferences → optional gap-tuning toward the team → candidate pool (hard-filter + excluded Configurations) →
times-played map → `recommend()` → `dedupeBySpirit` → `selectWildcard`. Its interface takes the answers and the
session's store-derived inputs (complexity overrides, excluded Configuration ids, times played, the Active list's tier
rank prior, team ids, tuned flag, wildcard offset, hard-filter) and returns the ranked shortlist and the Wildcard.

- `recommend()` remains the scoring seam ADR 0007 names; this module sits *above* it and moves none of its internals.
- The shortlist size is a constant owned by this module; the Wildcard's off-shortlist exclusion reads it.
- The component hook slims to a call; the mount-lifecycle correctness comment is deleted.
- The regression pin test becomes a direct call to `rankForSession` with fresh state — it no longer re-implements the
  wiring.
- The dead `elementAffinity` accumulation is removed from the answers→preferences conversion. The element wizard
  question itself is retained unchanged (removing it is an owner call, out of scope here).
- **The persisted-answers divergence is fixed here.** The answers store gains a change-notification capability; the
  recommender provider subscribes and re-syncs its in-memory answers instead of reading once at boot. This retires the
  second-writer hazard that backup import exposes.

### 2. The backup round-trip becomes a module

A new domain module, `backupService`, owns collecting a backup from the stores and applying one back. It takes the
stores behind a single store-handle seam; the component-facing callers (Settings) only pass a file and a store handle.

- `collectBackup` assembles the backup state from each store; `applyBackup` writes each store, preserving ADR 0012's
  semantics exactly: personal tier-list overrides replaced per list, complexity overrides replaced, Collection replaced,
  answers replaced, game log merged and de-duplicated by entry id; cited lists refused; unknown ids surfaced as
  `unresolved`.
- Known-ids assembly (which Configuration ids, list ids, spirit ids, question ids, and expansions exist) and the
  unresolved-id report move into the module.
- The component keeps the file download, the file-input, and the confirm-before-replace prompt; the export/import
  handlers become thin.
- The import path's answers write goes through the change notification from Deepening 1, so the provider re-syncs.

### 3. One guarded persistence module behind the storage seam

A new domain module, a guarded document store, sits between the raw string storage adapter and the five persistent
stores. Small interface: read, write, reset, and was-discarded. It owns the slab every store currently hand-rolls:

- the corrupt-JSON read guard,
- the seed fingerprint guard (FNV-1a over the seed, mismatch discards and reports — ADR 0012 unchanged),
- the edits-vs-seed delta filter ("user edits" and "is customised" read one source),
- the discard-and-report state.

Each of the five stores (tier, complexity, collection, answers, log) keeps its seed map and business reads, and
composes this module for persistence. The byte-identical fingerprint implementations collapse to one; the triplicated
delta filter collapses; the answers store gains the corrupt-JSON guard it currently lacks. The stores' business
interfaces are unchanged, so no caller is affected.

### 4. The tier store deepens: Subject dispatch, one rank-of, policy in one place

The tier store absorbs what the board currently re-derives:

- **Subject dispatch** — which items belong to a Subject (configurations vs power cards), their id namespace
  (configuration id vs card name), and their universe size — becomes a domain concern with one home, instead of four
  files each re-deriving it.
- **One rank-of computation** — the vocabulary-position → normalized rank used by the tier prior, the display chips, and
  the board's row order — replaces the three current computations, including the single-band edge case handled once.
- **Active/default resolution** — the store's existing policy becomes the *only* answer to "which list is viewed for a
  Subject"; the component's divergent fallback is deleted.
- The empty-string→unrated sentinel and the cited-list edit refusal stop being re-encoded in the component; they already
  live in the store, so the component's copies are deleted.
- Storage reads are memoised once behind the seam; a render no longer re-parses the same JSON several times.
- The near-duplicate public reads on the store collapse, and callers migrate to the smaller interface.

### 5. The Archive browse pipeline becomes a module; the domain stops importing presentation

- One browse-pipeline module per card family (`browsePowerCards`, `browseOtherCards`) composes the existing
  filter → sort → group primitives in the established order; CardsTab keeps state and rendering and calls the pipeline.
- Presentation labels leave the domain: the domain returns raw card sub-type keys; the render layer applies the
  human label and the judgment suffix. The domain's import of the components-folder label helper is removed — the
  dependency direction points the right way.
- The copied name-match block and the near-verbatim expansion-grouping block collapse into shared internals of the
  pipeline module. The parallel power/other pair keeps its legitimate divergence (the extra group modes, the subtype
  payload), only the duplication is removed.
- The element-icon map's three copies collapse to one component used everywhere it renders.

### 6. The log entry module absorbs the form↔entry mapping

- `formToEntry` (raw form state → a normalised log entry: empty fields become `undefined`, terror level clamped, strings
  trimmed and dropped when empty) and `entryToForm` (entry → form state, seeding edit mode) move into the log entry
  domain module.
- The adversary-level clamping policy (min/max per adversary) moves with them.
- The form uses the shared configuration-id helper instead of re-splitting a configuration id by hand.
- The duration helper stays in the module and finally gains its unit test (same-evening, past-midnight, missing input).

### 7. One scoring-primitives module

- A new domain module declares the canonical OCFDU axis list, the Complexity→number map, and the weight×rating
  dominance read once; the scorers (`recommend`, the Wildcard, the "why you" commentary, the aspect nudges, the
  answers→preferences conversion, the random chooser) consume it.
- The four copies of each fact collapse; the drift risk that produced the dead `elementAffinity` branch is gone.

## Testing Decisions

- **Guiding principle:** every deepening is behavior-preserving; the existing pinned tests are the guard. Each new
  module is tested through its own interface — the same seam its callers cross — never through its internals.
- **rankForSession:** a session with fresh state (matches the current pin), with complexity overrides, with a filtered
  Collection, with a tuned team, with a Wildcard offset. Prior art: the existing regression pin, now as a direct call.
- **backupService:** collect→apply round-trip against in-memory store adapters; unknown ids surfaced; log merge and
  de-dupe; cited list refusal. Prior art: the pure backup tests, including their "touches no localStorage and no DOM"
  guard.
- **Guarded document store:** corrupt JSON degrades to fresh state; a fingerprint mismatch discards and reports; the
  delta filter keeps only real edits. Prior art: the existing store tests with injected memory storage.
- **Tier store:** the existing canon and store tests pass unchanged (behavior pinned); new tests for the single
  rank-of (including single-band lists) and the Subject dispatch.
- **Browse pipeline:** per-family pipeline-order tests (filter→sort→group; slice→filter→group). Prior art: the existing
  filter and arrange tests.
- **Log entry:** `formToEntry`/`entryToForm`/clamp cases and the duration helper. Prior art: the existing log entry and
  log stats tests.
- **Scoring primitives:** the existing axis-pinned score tests keep passing — they are the drift guard.
- **Component smoke:** the existing static-render smoke suite keeps passing; no new component-level interaction tests are
  required for these behavior-preserving refactors.

## Out of Scope

- Any user-visible feature change or new UI.
- Removing the element wizard question (an owner call, pending).
- Changing any tier-list, spirit, card, or scenario data or schema.
- Adding a component-testing library or a real e2e suite; the repo's static-render smoke approach stays.
- Performance work beyond the memoised storage reads and the single pipeline pass.
- Any new data or provenance changes.

## Further Notes

- This spec is the output of the 2026-08-05 architecture review ("Deepen seven shallow seams"); the review HTML lives
  in the OS temp dir (`architecture-review-*.html`).
- The seam strategy, confirmed with the owner: every deepening is a domain module tested through its public interface;
  where state persists, the module takes the injectable storage adapter behind a seam.
- Respect ADRs: 0007 (`recommend()` remains the scoring seam), 0012 (fingerprint-and-discard and merge semantics
  unchanged), 0002 (Subject axis honored), 0009 (the Archive never hard-filters by Collection — untouched).
