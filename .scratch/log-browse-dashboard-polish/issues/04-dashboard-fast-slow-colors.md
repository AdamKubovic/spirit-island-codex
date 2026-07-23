Status: ready-for-agent

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

- [ ] New theme tokens for Fast (red) and Slow (blue) colors exist for both dark and light modes,
      following the existing token-pair pattern.
- [ ] `.dashboard-facet-fast` uses the new Fast/red token; `.dashboard-facet-slow` uses the new
      Slow/blue token.
- [ ] The duplicate `.dashboard-facet-fast`/`-slow` rule definitions in `src/deck.css` (currently
      defined twice, identically) are consolidated to one definition each.
- [ ] Colors are legible/consistent in both light and dark theme.
- [ ] Verified visually that the bars now read as distinctly red/blue and roughly match the
      fast.png/slow.png icon hues.

## Blocked by

None — can start immediately.
