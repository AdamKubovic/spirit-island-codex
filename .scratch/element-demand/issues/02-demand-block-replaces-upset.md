# Demand block replaces the UpSet and gap-odds table

Status: ready-for-agent

## Parent

`../README.md`, ADR 0013

## What to build

The Dashboard's Minor/Major segments lead with one spirit-conditioned block. `DeckUpset` and
`DeckGapOdds` are both deleted; the new block absorbs what gap-odds did.

**With no spirit picked**: a prompt, not a chart. The spirit selector, and one line saying the
deck's elements are evenly spread so what matters is what *your* innates are short of. No
unconditioned fallback view — that is the thing being removed.

**With a spirit picked**:

1. Headline stat — "N% of minors hit 2 or more of what you want" — over a none / one / two-or-more
   bar.
2. One row per demanded element: demand (solid bar at the first rung, ceiling as a ghost mark),
   supply count, and the demand-indexed draw odds. Rows for elements the spirit has no affinity for
   are marked — that is the interesting case, and it applies to 29 of 37 spirits.
3. Elements no innate demands collapse to a single footer line naming them with their supply range.

The existing `aspectModifiesInnates` caption carries over unchanged. The draw-count stepper stays
and now drives the demand-indexed odds. The expansion picker is untouched.

## Acceptance criteria

- [ ] `DeckUpset.tsx` deleted. `DeckUnit` and `ElementIcon` rehomed first — every remaining importer
      (`DeckFacets`, and anything else `grep` finds) updated in the same change, no re-export shim
      left behind pointing at a deleted file.
- [ ] `DeckGapOdds.tsx` deleted, its threshold annotations and aspect caption preserved in the new
      block.
- [ ] Counts/% toggle removed from `DashboardTab`; `DeckFacets` shows counts. Facets otherwise
      untouched.
- [ ] No-spirit state renders the prompt and no chart. Picking a spirit renders the block; clearing
      the pick returns to the prompt.
- [ ] Fear and Event segments render exactly as before — verified, not assumed.
- [ ] Reads at phone width, consistent with the `mobile-panel` treatment already shipped.
- [ ] Smoke test covers: no-spirit prompt, a spirit with off-affinity demand (Lightning's Swift
      Strike), a spirit whose aspect modifies innates (caption present), and the undemanded-elements
      footer.
- [ ] Type check, lint, full suite pass. Any test asserting on UpSet markup is deleted with it, not
      loosened to keep passing.

## Blast radius

`grep -rl "DeckUpset\|DeckGapOdds\|DeckUnit\|ElementIcon" src/` — five files, one of them a test:

```
src/components/DeckUpset.tsx          deleted
src/components/DeckGapOdds.tsx        deleted
src/components/DeckFacets.tsx         imports DeckUnit
src/components/DashboardTab.tsx       call site, Counts/% toggle
src/components/__tests__/appSmoke.test.tsx
```

## Blocked by

- [01-element-demand-domain-module.md](01-element-demand-domain-module.md)
