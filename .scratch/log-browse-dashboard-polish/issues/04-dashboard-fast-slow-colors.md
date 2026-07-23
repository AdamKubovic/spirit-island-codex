Status: done

# Dashboard Fast/Slow bar recolor

## Parent

`.scratch/log-browse-dashboard-polish/PRD.md`

## What to build

The Dashboard's Fast/Slow facet bars (`DeckFacets.tsx`, styled via `.dashboard-facet-fast` /
`.dashboard-facet-slow` in `src/deck.css`) currently both render in shades of the same green
accent, unrelated to their icons. Recolor them to match their icon colors: Fast = red (matching
`elements/fast.png`'s bird), Slow = blue (matching `elements/slow.png`'s turtle). Sample the exact
hex values from the icon assets. Add new theme tokens (dark/light variants, following the
existing `--deck-accent`/`--deck-dim` token pattern) rather than hardcoding hex values directly
in the CSS rule.

## Acceptance criteria

- [x] New theme tokens for Fast (red) and Slow (blue) colors exist for both dark and light modes,
      following the existing token-pair pattern.
- [x] `.dashboard-facet-fast` uses the new Fast/red token; `.dashboard-facet-slow` uses the new
      Slow/blue token.
- [x] The duplicate `.dashboard-facet-fast`/`-slow` rule definitions in `src/deck.css` (currently
      defined twice, identically) are consolidated to one definition each.
- [x] Colors are legible/consistent in both light and dark theme.
- [x] Verified visually that the bars now read as distinctly red/blue and roughly match the
      fast.png/slow.png icon hues.

## Blocked by

None — can start immediately.

## Comments

Sampled the icons with a canvas pixel histogram: fast.png's bird modes at `#ef3029`, slow.png's
turtle at `#39499c`. Added `--deck-fast`/`--deck-slow` to `:root`, plus darkened parchment
variants (`#b32418` / `#2b3775`) in the `.deck-side, .deck-topbar` scope, mirroring
`--deck-accent`'s dark/light pair. (There is no theme switcher; the parchment sidebar scope is
the app's only "light" token pair, so that's where the light variants live.) The duplicate
`.dashboard-facet-fast`/`-slow` rules at the old line ~2271 were removed; the single surviving
definition sits beside `.dashboard-facet-bar` and points at the new tokens. Verified via
Playwright computed styles: fast bar renders `rgb(239,48,41)`, slow `rgb(57,73,156)`.
