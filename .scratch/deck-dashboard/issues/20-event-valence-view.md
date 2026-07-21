# Event segment: variant-D valence view

Status: ready-for-agent

## Parent

`../PRD-2.md` (follow-up spec: valence views + element-gap odds)

## What to build

The Event segment gets the same variant-D treatment as Fear (#19), on the valence axis:
headline tiles for harmful / mixed / beneficial (poles warm-orange `#d97742` /
cool-blue `#4f9ad4`, neutral mixed — dataviz-validated, owner-ratified over the accent
green), stacked valence bar, by-class facet as mini stacked bars, click-to-drill chips with
hover preview and tap enlarge, counts with percentages. Reuses #19's shared components.
The by-expansion facet is dropped; the base-game-only empty state keeps reading as a rule
of the game.

## Acceptance criteria

- [ ] The full variant-D interaction set on the Event segment, driven by ratified `valence`
      data — never stubs.
- [ ] The existing "no valence classification" event smoke test is rewritten to assert the
      new view; the empty-state smoke test still passes unchanged.
- [ ] Colorblind-safe poles with direct labels; identity never color-alone.
- [ ] Reload reverts all new state; type check, lint, full suite pass.

## Blocked by

- [18-valence-ratification.md](18-valence-ratification.md)
- [19-fear-impact-view.md](19-fear-impact-view.md)
