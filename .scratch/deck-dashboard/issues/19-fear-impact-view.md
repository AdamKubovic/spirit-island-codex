# Fear segment: variant-D impact view

Status: done

## Parent

`../PRD-2.md` (follow-up spec: valence views + element-gap odds)

## What to build

Rebuild the Fear segment as the owner-picked prototype variant D (issue 04's verdict;
prototype commits 7ff7df9/9fb3aef/032a588 are reference, not code to reuse — rewrite
properly on the ratified data):

- Headline stat tiles per impact level, percent first with count bracketed, clickable.
- One 100%-stacked impact bar (sequential green ramp, 2px gaps, direct labels).
- The by-tag facet as mini stacked bars with clickable segments; totals as "count (pct%)".
  The by-expansion facet is dropped.
- Click a tile or segment → inline chip list of exactly those cards, with a clear button;
  click again collapses. Session-only selection state.
- Chips: impact-colored edge; hover → floating card-image preview; click/tap → the shared
  card-enlarge viewer.
- Impact displays as **weak / solid / strong** (data stays 1|2|3); the hidden-subset framing
  copy stays; next-draw odds framed as pool share with the full-pool assumption.

This ticket builds the shared view components the Event segment (#20) reuses.

## Acceptance criteria

- [ ] All of the above, driven by the ratified `impact` data — never stubs.
- [ ] The existing "no valence classification" fear smoke test is rewritten to assert the
      new view (tiles, drill, chip viewer path).
- [ ] Colorblind-safe: direct labels on segments; identity never color-alone.
- [ ] Reload reverts all new state; type check, lint, full suite pass.

## Blocked by

- [18-valence-ratification.md](18-valence-ratification.md)
