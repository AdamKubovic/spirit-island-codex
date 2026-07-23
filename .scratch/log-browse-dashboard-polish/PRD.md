Status: ready-for-agent

# Log, Browse & Dashboard polish batch

## Problem Statement

Several small frictions surfaced from actual play sessions:

- The Log form forces an Adversary choice even for games with no adversary (e.g. solo scenario
  play, or a game recorded before the player picked one).
- On Browse, the search box shares one flat row with every filter `<select>`, so on narrower
  viewports the filters get visually squeezed by the growing search field. Archive already solves
  this with a stacked layout (search on its own row, filters below).
- The Powers tab's "Sort by" control has no alphabetical option — only deck order and cost.
- The Dashboard's Fast/Slow facet bars and Cost facet bars all render in the same green accent
  color, so they don't visually key to anything. The Fast/Slow icons themselves are red (bird) and
  blue (turtle) — the bars don't match.
- Logging a game on Blighted Island is ambiguous today: "Blight remaining" is a bare number with
  no record of whether the board started blighted or healthy, so past entries logged on Blighted
  Island can't be told apart from classic/thematic games after the fact.
- The log's History table only supports delete (with a 10s undo) — there's no way to correct a
  mis-entered field on a past game without deleting and manually re-entering it from scratch.

## Solution

A batch of independent, small UI/data-model fixes to the Log, Browse, Powers, and Dashboard
surfaces:

1. Adversary becomes optional on the Log form, matching the existing (already-optional) secondary
   adversary field.
2. Browse's filter row is restructured to match Archive's existing stacked layout, reusing
   Archive's CSS classes instead of duplicating rules.
3. Powers "Sort by" gains alphabetical (A→Z and Z→A) options, mirroring the existing
   cost-asc/cost-desc pairing.
4. Dashboard's Fast/Slow bars are recolored to match their icons (red / blue); Cost bars get their
   own sequential color scale, one shade per cost value, distinct from the element/expansion
   palettes already in use.
5. "Blighted Island" becomes a new `boardType` value alongside the existing classic/thematic-base/
   thematic-rebalanced options.
6. History log entries become editable: an "Edit" button loads an entry's fields back into the Log
   form; submitting in edit mode updates the entry in place instead of appending a new one.

## User Stories

1. As a player who ran a solo/no-adversary game, I want to leave Adversary blank when logging it, so that I don't have to pick an arbitrary or wrong adversary just to submit.
2. As a player filling in the Log form, I want the primary Adversary field to behave like the existing secondary Adversary field (optional, blank default, non-blocking), so that the two fields are consistent.
3. As a player browsing spirits on a narrow window, I want the search box to sit on its own row above the filter selects, so that the filters aren't squeezed or wrapped awkwardly.
4. As a player who already learned Archive's search-above-filters layout, I want Browse to look and behave the same way, so that the two browsing surfaces feel consistent.
5. As a player browsing powers, I want to sort them alphabetically by name (A→Z), so that I can quickly find a specific power by name.
6. As a player browsing powers, I want a Z→A alphabetical sort too, so that the sort behaves symmetrically with the existing cost-asc/cost-desc pair.
7. As a player viewing the Dashboard, I want the Fast/Slow facet bars colored to match the red bird / blue turtle icons, so that the chart is immediately legible without reading labels.
8. As a player viewing the Dashboard, I want each Cost value's bar to have its own distinct color, so that I can visually distinguish the cost distribution at a glance.
9. As a player who played on the Blighted Island board variant, I want to record that board type when logging the game, so that my history accurately reflects which board setup was played.
10. As a player reviewing past log entries, I want to see which board type (including Blighted Island) was used, so that I can understand the context of "Blight remaining" for that game.
11. As a player who made a mistake in a past log entry, I want to click Edit and have the entry's data load into the Log form, so that I can correct it without re-entering everything.
12. As a player editing a log entry, I want submitting the form to update the existing entry in place, so that the entry's id/history position is preserved rather than being deleted and re-created.
13. As a player, I want the Edit flow to reuse the same form validation as creating a new entry, so that edited entries are held to the same data-quality bar as new ones.
14. As a developer maintaining this app, I want Browse's filter layout to share Archive's CSS classes rather than duplicate them, so that layout fixes only need to happen in one place.
15. As a developer maintaining this app, I want the cost/speed bar colors expressed as a small pure function or lookup table, so that the color logic is unit-testable independent of rendering.

## Implementation Decisions

- **Adversary optionality**: `LogEntry.adversary` changes from required `string` to optional
  (`string | undefined`), matching `secondaryAdversary`'s existing shape. The primary Adversary
  `<select>` gets the same blank-default, non-required treatment as the secondary select. The
  `canSubmit` gate drops its adversary-non-empty check. `findAdversary`/`ADVERSARIES` lookup logic
  is unchanged — only the requiredness and optionality of the stored value changes.
- **Browse layout**: `Browser.tsx`'s filter markup is restructured to reuse Archive's existing
  `.card-filters` / `.card-filters-row` classes (defined in `src/deck.css`, currently used by
  `CardFilters.tsx`) rather than introducing parallel rules under `.filters`. Search goes in its
  own row; the existing five selects (Expansion, Complexity, Tag, Strong in, Sort by) stay
  together in one wrapping row below it — no further sub-grouping or collapsed "more" section
  (that pattern is Archive-specific and out of scope here).
  the `.filters` class and any now-unused CSS rules tied to it should be cleaned up if fully
  superseded.
- **Powers sort**: `PowerSort` type (`src/domain/powerCardArrange.ts`) gains `'name-asc'` and
  `'name-desc'`, each sorting by the power card's display name. `sortPowerCards()` gets matching
  cases. The `<select>` in `CardsTab.tsx` gets two new `<option>`s following the existing
  cost-asc/cost-desc option pattern/wording style.
- **Dashboard facet colors**:
  - Fast/Slow bars (`DeckFacets.tsx`, styled via `.dashboard-facet-fast` / `.dashboard-facet-slow`
    in `src/deck.css`) are recolored to match their icon colors: Fast = red (matching
    `elements/fast.png`'s bird), Slow = blue (matching `elements/slow.png`'s turtle). Exact hex
    values sampled from the icon assets themselves, added as new theme tokens (dark/light variants
    following the existing `--deck-accent`/`--deck-dim` pattern) rather than hardcoded in the CSS
    rule.
  - Cost bars (currently sharing `.deck-element-fill` / `--deck-accent` with unrelated
    element-demand bars) get their own sequential color scale — one shade per cost value — expressed
    as a small pure lookup/generator function (new module, colocated with existing color helpers
    like `src/components/tagColors.ts`) rather than inline in CSS, so it's unit-testable. The scale
    should read as a family of the site's existing accent hue at different shades/opacities, and
    must be visually distinct from the Fast/Slow red/blue and from `tagColors.ts`'s categorical
    palette. Cost bars stop sharing the `.deck-element-fill` class with the unrelated
    element-demand bars — they get their own styling hook driven by the new per-cost color
    function.
- **Blighted Island board type**: `boardType` gains a new value (e.g. `'blighted-island'`)
  alongside the existing `'classic' | 'thematic-base' | 'thematic-rebalanced'`. Added to the
  `<select>` options in `GameLog.tsx` and the `LogEntry` type in `src/domain/backup.ts`. No new
  field — this is an additional enum member, not a separate boolean/track field. "Blight
  remaining" itself is unchanged (still a bare optional number); the new board type just gives it
  interpretive context.
- **Editing log entries**: `createGameLog()` (`src/domain/gameLog.ts`) gains an `update(id,
  patch)` method alongside the existing `append`/`list`/`remove`/`timesPlayed`/`replaceAll`. In
  `GameLog.tsx`, an "Edit" button is added to each History row next to the existing "Delete"
  button. Clicking it populates all form fields (including the new optional-adversary and
  boardType fields) from that entry and switches the form into "edit mode" — tracked via local
  state (e.g. an `editingId`). Submitting while in edit mode calls `update(editingId, patch)`
  instead of `append(entry)`, preserving the entry's original `id`. The form should offer a way to
  cancel out of edit mode back to "create" mode without submitting. Edit mode reuses the exact same
  field components and the same `canSubmit` validation as creation — no parallel edit-only form.

## Testing Decisions

Tests should exercise external behavior of each seam, not internal rendering details — this
matches the existing style in `src/domain/__tests__/`.

- `src/domain/__tests__/gameLog.test.ts`: extend with cases for the new `update(id, patch)`
  method — updating an existing entry's fields, id preservation, and behavior when the id doesn't
  exist (prior art: existing `append`/`remove` test cases in this file).
- `src/domain/__tests__/logEntry.test.ts`: extend/add cases confirming an entry with `adversary:
  undefined` and `boardType: 'blighted-island'` round-trips correctly through whatever
  construction/clamping helpers this module owns (prior art: `clampOptionalInt` tests already in
  this file for `blightRemaining`).
- `src/domain/__tests__/powerCardArrange.test.ts`: extend with cases for `'name-asc'` and
  `'name-desc'` sorting, following the existing `cost-asc`/`cost-desc` test shape in this file.
- New test file for the cost/speed color helper module (colocated with the module, following the
  `__tests__` convention used elsewhere): assert the function returns a distinct, stable color per
  cost value and the expected Fast/Slow colors.
- Layout/CSS changes (Browse filter row restructuring, visual bar recoloring beyond the pure color
  function) are verified visually/manually — not unit tested, consistent with how existing
  layout-only changes in this repo are handled.

## Out of Scope

- Any further Archive-style sub-grouping or collapsed "more" filter section on Browse — only the
  search-above-filters split is in scope.
- A general free-text or structured "island health"/blight-track model beyond adding the one new
  `boardType` enum value — the existing `blightRemaining` number field is untouched.
- Inline table editing of log entries — editing goes through the existing form, not editable table
  cells.
- Bulk edit/delete of multiple log entries at once.
- Any change to the adversary catalog (`ADVERSARIES`) itself or to the already-optional secondary
  adversary field's behavior — only the primary field's requiredness changes.
- Reworking `tagColors.ts`'s categorical palette or the element-demand bars' existing color scheme.

## Further Notes

This is a batch of otherwise-unrelated small fixes surfaced together during a play-session
review, not one cohesive feature — implementers may pick these off independently, but they're
specified together since they share a Log/Browse/Dashboard-review origin and a single grilling
session established consistent decisions across all of them (e.g. "reuse existing patterns over
inventing new ones" applied uniformly to the adversary field, the layout classes, and the sort
options).
