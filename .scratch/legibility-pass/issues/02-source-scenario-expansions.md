# 02 — Source scenario expansions from canon

Status: done
Label: wayfinder:research (AFK — sourcing task with a tripwire)
Parent: [Legibility-pass map](../MAP.md)

## Blocked by

_(nothing — can run in parallel with 01)_

## Question

`scenarios.json` (16 records) carries **no expansion field** — its `_note` records that the manifest
had none. The owner wants scenarios to show (and later colour) their expansion. Per the owner's
charting decision, **source it from canon** rather than dropping it.

Transcribe each of the 16 scenarios' expansion from a **high-trust source** (Spirit Island wiki /
official product pages), add an `expansion` field (using a raw string that ticket
[01](01-canonical-expansion-normalization.md)'s normalisation resolves — coordinate on the exact
strings), and add a **tripwire test** pinning the sourced values (the `adversaryCanon.test.ts`
pattern) so drift/fabrication is caught.

⚠ This is the exact surface of the repo's documented failure mode. **If a scenario's expansion
can't be sourced confidently, that field is ABSENT for that scenario, not estimated** — record which
ones (if any) were left absent in the resolution.

Resolution records: the sourced expansion per scenario, the source URL(s), any left absent, and the
tripwire test added.

## Acceptance criteria

- [x] Each of the 16 scenarios has a canon-sourced `expansion` (or is explicitly recorded as
      unsourceable and left absent)
- [x] Source URLs captured in the resolution / a linked asset
- [x] A tripwire test pins the sourced expansions (fails on drift)
- [x] Raw strings chosen to resolve through ticket 01's normalisation
- [x] Test suite / `tsc -b` / `oxlint` green

> Unblocks the fog item **"scenario expansion colouring"** — once this + ticket 05 land, applying the
> chosen expansion treatment to scenarios becomes a trivial follow-up ticket.

## Comments

All 16 rows sourced with 0 left absent — every scenario's own Spirit Island Wiki page states
"Part of the ___ Expansion" / "Part of the Base Game" explicitly. Fetch trail + source URLs in
[`scenario-expansions-research.md`](scenario-expansions-research.md).

`expansion` added to `scenarios.json` as the **raw wiki string** ("Base Game", "Branch and Claw",
"Jagged Earth", "Nature Incarnate", "Promo Pack 2") — same convention as `other-cards`/`power-cards`/
`adversaries`, resolved through `normalizeExpansion()` rather than pre-collapsed in the dataset.
`EXPANSION_ALIASES` (`tagColors.ts`) gained two new entries: `'Base Game' → 'Base'` and
`'Promo Pack 2' → 'Feather & Flame'`.

One nuance, not an ambiguity: *A Diversity of Spirits* and *Varied Terrains* each print "Part of
Promo Pack 2" on their own wiki page but are category-tagged Feather and Flame. This is the same
shape ticket 01 already resolved for `adversaries.json`'s Scotland record — **owner call carried
forward: Promo Pack 2 always resolves to Feather & Flame** — so the new `'Promo Pack 2'` alias
reuses that call rather than re-escalating an already-settled question.

Tripwire: `scenarioCanon.test.ts` gained `CANONICAL_EXPANSIONS`, pinning the raw string (mirrors
the existing `CANONICAL_DIFFICULTIES` pin, which is also kept verbatim rather than collapsed).
`expansionCanon.test.ts` (the ticket 01 tripwire) extended with a scenario case pinning the exact
raw → canonical mapping, plus `scenarios.json` folded into its `EXPANSION_COLOR`-membership check.

Deleted `archiveIntegrity.test.ts`'s `has no expansion field on any scenario record (#05b: the
manifest cannot source one)` test — that pinned the *absence* this ticket exists to fill; keeping
it would have made "sourcing the field" a test failure.

Surges of Colonization's two dataset rows (Normal/Larger Surges) share one wiki page and one
expansion (Nature Incarnate) — reconciles the 16 rows / 15 canonical scenarios cleanly, no split
needed on the expansion axis.
