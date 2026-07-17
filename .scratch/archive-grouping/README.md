# Archive tab — grouping & grid-chip polish

A small, self-contained batch of **functional** Archive/Cards changes from the owner (2026-07-17),
kept deliberately **separate from the [island-retheme](../island-retheme/MAP.md) theme map** — that
map is a visual-direction *decision* (palette / surface / ornament), and grouping logic doesn't
belong in it.

Planner charted these as specs for a **builder agent**; not implemented here. Each issue is
self-contained and AFK-ready (owner already decided the direction; the semantics are fully
determined by existing patterns, so no invention is required).

## Spec

[PRD.md](PRD.md) — the assembled, path-free contract (Status: `ready-for-agent`). Start here; the
issues below carry the exact call sites.

## Issues

- [01 — Drop the expansion chip from Archive grid tiles (keep it in rows)](issues/01-grid-drop-expansion-chip.md)
- [02 — Add "expansion" and "type" to the Powers Group by](issues/02-powers-group-by-expansion-type.md)
- [03 — Group by for Fear, Blight, and Event cards](issues/03-other-cards-group-by.md)

Independent — buildable in any order. 02 and 03 both extend the Group by feature; a builder doing
both may share a canonical-order helper.

## Prior art consumed (don't reopen)

- **legibility-pass #05** put expansion colour on grid corner-badges AND row pills; issue 01 narrows
  it to rows-only. **#08** added the scenario expansion chip beside the difficulty band.
- **phase-4 #19** built the Powers filter → sort → group pipeline (`src/domain/powerCardArrange.ts`);
  issue 02 extends it.
- `groupPowerCards`'s **element** case is the template for all multi-valued grouping (issue 03).

## Invariants (all three)

- **Chip-system distinctness** (`cardChipColors.test.ts`) is untouched — these change chip *usage*
  and *grouping*, never the palette values.
- **Data honesty / judgment provenance** — blight subtypes are `tagsSource: 'judgment'`; grouping
  by them must carry that note, never dress judgment as canon.
- Standard gates: `tsc -b`, `oxlint`, `vitest` all clean; verify at 375px + desktop.
