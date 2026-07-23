Status: ready-for-agent

# Dashboard Cost bar color scale

## Parent

`.scratch/log-browse-dashboard-polish/PRD.md`

## What to build

The Dashboard's Cost facet bars currently share `.deck-element-fill` / `--deck-accent` with the
unrelated element-demand bars, so they render in the same green as everything else. Give Cost
bars their own sequential color scale — one shade per cost value — expressed as a small pure
lookup/generator function (new module, colocated with existing color helpers like
`src/components/tagColors.ts`) so it's unit-testable independent of rendering. The scale should
read as a family of the site's existing accent hue at different shades, and must be visually
distinct from the new Fast/Slow red/blue tokens and from `tagColors.ts`'s categorical palette.
Cost bars stop sharing the `.deck-element-fill` class with element-demand bars — give them their
own styling hook driven by the new per-cost color function.

## Acceptance criteria

- [ ] A new pure function/module maps a cost value to a stable, distinct color.
- [ ] Cost bars in `DeckFacets.tsx` use per-cost colors from the new function instead of the
      shared `.deck-element-fill`/`--deck-accent` styling.
- [ ] Element-demand bars elsewhere in the app are unaffected (still use their existing color).
- [ ] The cost color scale is visually distinct from the Fast/Slow colors and from
      `tagColors.ts`'s palette, and reads coherently as a themed sequential scale in both light
      and dark mode.
- [ ] A new test file (colocated with the module, following the `__tests__` convention) asserts
      the function returns a distinct, stable color per cost value.

## Blocked by

None — can start immediately.
