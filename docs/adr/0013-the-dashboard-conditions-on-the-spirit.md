# 0013 — The Dashboard conditions on the spirit

Status: accepted
Date: 2026-07-22

## Context

The Dashboard's Minor/Major segments led with an UpSet plot (`DeckUpset`, 245 lines): a matrix of
exact element sets, ranked by frequency, with per-element marginal bars down the left and a
combination-count bar chart on top. It was the owner's pick out of `deck-dashboard #03`'s prototype
rounds, chosen on the expectation that element sets would show meaningful structure.

They do not. Measured against the shipped data:

| | Minor (101 cards) | Major (78 cards) |
|---|---|---|
| Per-element totals | 38–39, all eight | 29–31, all eight |
| Distinct element pairs present | 28 of 28 | 28 of 28 |
| Pair co-occurrence range | 10–14 | 9–13 |
| Distinct exact element sets | 76 | — |
| Tallest set column | 3 cards | — |

The power decks are near-uniformly balanced across elements — almost certainly on purpose, by the
game's designers. Every deck-wide element aggregate the tab could show is therefore flat: the
marginal bars, the `≥1 / ≥2 / ≥3` gap-odds columns (85–86 / 48–50 / 15–16% across all eight rows),
and any co-occurrence matrix we might have built to replace the UpSet. The UpSet's long tail of
76 sets was rendering sampling noise as if it were structure.

What varies is anything conditioned on a **specific spirit**:

- 29 of 37 spirits have innates demanding an element the spirit has no affinity for (20 of 37 even
  at the first rung only).
- The share of minors carrying 2+ of a spirit's demanded elements ranges from 12% (Sun-Bright
  Whirlwind, wants 2 elements) to 98% (Starlight Seeks Its Form, wants all 8).
- Draw odds indexed to actual demand spread properly: at 4 draws, P(≥1) 86%, P(≥2) 50%, P(≥3) 16%,
  P(≥4) 2% — and the draw-count stepper finally moves a number that means something (3 Fire: 16% at
  4 draws, 66% at 8, 92% at 12).

The one spirit-conditioned thing already on the tab — `DeckGapOdds`, which annotates element rows
with the picked spirit's innate thresholds — was the *last* block on the page. The tab's priorities
were inverted.

## Decision

- **The Minor/Major view is conditioned on a picked spirit, or it shows nothing.** With no spirit
  selected the block is a prompt to pick one, not a deck-wide fallback. There is no unconditioned
  reading worth rendering, and rendering one anyway is what produced this ADR.
- **The baseline is innate thresholds, not affinity elements.** Affinity is the part the player
  already knows; the innates' off-affinity demands are the part the deck can answer.
- **Demand is the first rung**, with the highest rung shown as a secondary ceiling mark. A rung
  selector was considered and rejected: rung counts vary per innate (2 to 5), so its range would
  shift per spirit for little gain.
- **Draw odds are indexed to demand**, one column, replacing the fixed `≥1 / ≥2 / ≥3` triple.
- **`DeckUpset` is deleted**, absorbing `DeckGapOdds` into the new block. `deckComposition.ts` and
  its tests survive unchanged — the maths was correct, it was wearing the wrong chart.
- **Elements no innate demands collapse to a footer line**, not eight full rows.
- **The unit stays the spirit, not the Configuration** — unchanged from `deck-dashboard #10`;
  element data exists at spirit level only, and the existing `aspectModifiesInnates` caption still
  covers aspects that alter innates.

## Consequences

- The Dashboard's Minor/Major segments cost one interaction before they say anything. Accepted:
  the alternative is saying nothing in more pixels.
- Fear and Event segments are untouched — their valence and tag distributions are genuinely uneven,
  so they need no conditioning.
- The Counts/% toggle is dropped. It existed to keep the UpSet and Facets in agreement; with one of
  them gone it had no job.
- `DeckUnit` and `ElementIcon` move out of `DeckUpset.tsx` before it is deleted.

## Left open, deliberately

**Per-card output is out of scope.** The block answers "how much of what I need is in this deck",
not "which specific cards" — the Archive already browses cards, and duplicating that here would
recreate the density problem in a new form.

**Do not rebuild a deck-wide element chart.** The flatness above is a property of the game's data,
not of the chart that displayed it. Any future proposal for an element matrix, co-occurrence
heatmap or set plot over the whole deck should be checked against these numbers first — this ADR
exists so that measurement does not have to be repeated.
