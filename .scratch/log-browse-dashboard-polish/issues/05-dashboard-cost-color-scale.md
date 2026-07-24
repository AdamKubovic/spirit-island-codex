Status: done

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

- [x] A new pure function/module maps a cost value to a stable, distinct color.
- [x] Cost bars in `DeckFacets.tsx` use per-cost colors from the new function instead of the
      shared `.deck-element-fill`/`--deck-accent` styling.
- [x] Element-demand bars elsewhere in the app are unaffected (still use their existing color).
- [x] The cost color scale is visually distinct from the Fast/Slow colors and from
      `tagColors.ts`'s palette, and reads coherently as a themed sequential scale in both light
      and dark mode.
- [x] A new test file (colocated with the module, following the `__tests__` convention) asserts
      the function returns a distinct, stable color per cost value.

## Blocked by

None — can start immediately.

## Comments

New `src/components/costColors.ts`: `COST_COLOR` lookup for costs 0-9 — the presence-green
accent hue (hsl 143/47%) stepped in lightness from `#87d4a4` down to `#266940`, hexes computed
then hardcoded as an explicit table per the tagColors.ts convention. `costColor(cost)` clamps
out-of-range costs to the nearest end rather than inventing a shade. DeckFacets cost rows now
use a `.dashboard-cost-fill` hook (geometry only, same shape as `.deck-element-fill`) with the
background applied inline from `costColor(cost)`. `.deck-element-fill` and its one remaining
consumer (DeckPoolBreakdown, currently unmounted anywhere) are untouched. The PRD's "expected
Fast/Slow colors" assertion is honored by pinning the CSS token hexes as literals in the new
test file (the speed colors themselves live in deck.css tokens, per ticket 04). Tests in
`src/components/__tests__/costColors.test.ts` pin: distinctness/stability per cost, green-family
hue, monotonic light->dark ordering, byte-level separation from the Fast/Slow tokens and every
tagColors palette, and clamp behavior. Verified via Playwright: cost bars render distinct
per-cost shades (rgb(135,212,164), rgb(118,206,152), ...).
