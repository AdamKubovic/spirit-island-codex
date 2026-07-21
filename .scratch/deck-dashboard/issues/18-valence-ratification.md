# Owner ratification + valence canon

Status: done

## Parent

`../PRD-2.md` (follow-up spec: valence views + element-gap odds)

## What to build

The human gate: the owner reviews the draft classification row-by-row, amends what they
disagree with, and ratifies. Only then do the ratings land on the card catalog — fear
`impact: 1|2|3` + `impactSource: "judgment"`, event
`valence: "harmful"|"mixed"|"beneficial"` + `valenceSource: "judgment"` (blight `tagsSource`
precedent) — pinned by a valence-canon tripwire. Ratification is what makes `judgment` mean
the owner's judgment; nothing downstream (the view tickets) may start before this merges.

## Acceptance criteria

- [ ] Owner has reviewed all 115 rows; amendments recorded on this ticket.
- [ ] Ratified ratings + source markers land on every fear/event card in the catalog.
- [ ] Valence-canon tripwire pins the complete name→rating table, asserts every fear/event
      card is rated and source-marked, and links the rubric doc.
- [ ] Type check, lint, and the full test suite pass.

## Blocked by

- [17-valence-rubric-and-draft.md](17-valence-rubric-and-draft.md)

## Comments

**2026-07-21 — ratified.** Owner reviewed all 115 rows against `.scratch/deck-dashboard/
valence-draft.md`: the 16 cross-check-flagged rows individually (2 amended — Gradual Corruption
mixed→harmful, Influx of Settlers harmful→mixed; the rest confirmed as drafted), then the
remaining 99 rows in 5 batches (2 fear, 3 event), all approved as drafted. Ratings landed on
`src/data/other-cards.json` (`impact`/`impactSource: "judgment"` on fear cards,
`valence`/`valenceSource: "judgment"` on event cards), pinned by
`src/domain/__tests__/valenceCanon.test.ts`. Type check, lint, and full suite (474 tests) pass.
