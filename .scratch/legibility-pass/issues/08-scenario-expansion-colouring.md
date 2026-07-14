# 08 — Scenario expansion colouring

Status: done
Label: wayfinder:task (AFK — mechanical once both blockers land)
Parent: [Legibility-pass map](../MAP.md) · [PRD](../PRD.md)

## Blocked by

- [02 source scenario expansions](02-source-scenario-expansions.md) — scenarios have no expansion
  field to colour until this lands.
- [05 expansion colour across the Archive](05-expansion-colour-archive.md) — this ticket applies
  **that** ticket's owner-picked treatment; there's no treatment to apply until #05 ships.

## What to build

Bring scenarios into the expansion-colour system now that they have the data (#02) and the treatment
is decided (#05). Apply the same owner-picked "underlying character" expansion treatment to the
Scenario grid (`ScenarioGrid`) and Scenario rows (`ScenarioRows`) that #05 applied to the other card
types — using the same `EXPANSION_COLOR` value (via `normalizeExpansion()`), so a scenario's
expansion matches that expansion's colour everywhere else on the site.

This is deliberately mechanical: no new variant round, no new palette, no new decision — it's the
follow-through that #05 excluded only because scenario data didn't exist yet. If #02 left any
scenario's expansion honestly absent, that scenario shows no expansion colour (honest absence, not a
default).

Note: the Scenario grid already colours its tiles by **difficulty band** (`SCENARIO_BAND_COLOR`).
Adding expansion colour must not clobber or clash with the difficulty banding — reconcile the two
signals the same way #05 reconciled expansion colour with any existing tile colour (follow the
treatment #05 shipped; if the two genuinely can't coexist on the scenario tile, surface it rather
than dropping either).

## Acceptance criteria

- [x] Scenario grid + rows show expansion in the treatment #05 shipped, from the one `EXPANSION_COLOR` map
- [x] A scenario's expansion colour matches that expansion's colour on Browse tiles / other Archive types byte-for-byte
- [x] Scenarios left expansion-absent by #02 show no colour (no default) — moot today (all 16 resolve), the guard is still in place
- [x] Difficulty banding and expansion colour coexist legibly (or the conflict is surfaced, not silently resolved)
- [x] `cardChipColors.test.ts` green; test suite / `tsc -b` / `oxlint` green
- [x] Legible on dark theme at 375px + desktop

## Comments

**Shipped (2026-07-14).** `ScenarioGrid` gained a top-left `expansion-chip-corner` (the same chip
CardGrid/AdversaryGrid use), sitting opposite the existing bottom-left difficulty tab — the two
signals don't overlap or compete (`.scenario-difficulty` is `bottom: 0; left: 0`,
`.expansion-chip-corner` is `top: 0.3rem; left: 0.3rem`). `ScenarioRows` gained the same
`card-row-expansion`/`expansion-chip` pill `OtherCardRows`/`AdversaryRows` already show, replacing
its stale "scenarios carry no expansion field at all" comment (true before ticket 02, not since).
Colour comes from `expansionColorFor()` — the same function and `EXPANSION_COLOR` map every other
surface uses, so no separate palette. All 16 scenarios' raw expansion strings resolve today (ticket
02's "0 left absent" holds); the honest-absence guard renders no chip if that ever changes, rather
than guessing. Screenshots at 375px + 1280px, grid + rows, in
[`../screenshots-08/`](../screenshots-08/). `tsc -b`, `oxlint`, and the full test suite (390 tests)
green.
