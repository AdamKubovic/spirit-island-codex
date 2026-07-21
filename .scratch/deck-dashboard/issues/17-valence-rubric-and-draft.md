# Valence rubric + draft classification

Status: done

## Parent

`../PRD-2.md` (follow-up spec: valence views + element-gap odds)

## What to build

The written rubric and the draft ratings for all 115 fear/event cards — delivered as a
reviewable table for the owner, touching nothing in the shipped catalog.

The rubric defines, with examples, what makes a fear card weak (1) / solid (2) / strong (3)
impact — one overall judgment per card, not per terror level — and what makes an event
harmful / mixed / beneficial ("mixed" is the honest home for condition-dependent and choice
cards). Classification reads the actual card images; the keyword-derived fear `tags` and
mechanical `eventClass` are cross-checks only, never inputs. Cross-check anomalies (e.g. a
defensive-tagged card drafted weak) are flagged in the draft for the owner's attention.

## Acceptance criteria

- [ ] Rubric doc exists with criteria and worked examples for both axes.
- [ ] Draft table rates all 50 fear + 65 event cards from card images, each row traceable
      to a rubric criterion; anomalies vs tags/eventClass flagged.
- [ ] The shipped card catalog is untouched; no data merges in this ticket.
- [ ] The draft is presented in a form the owner can review and amend row-by-row.

## Blocked by

None — can start immediately.
