# 04 — One Archive browse pipeline per card family

**What to build:** A domain browse-pipeline module per card family (power cards and other cards) composes the existing
filter → sort → group primitives in the established order, so the Archive tab calls one pipeline per segment instead of
wiring the sequence in its own memo chains. Presentation labels leave the domain — the domain returns raw card sub-type
keys and the render layer applies the human label and the judgment suffix, removing the domain's import of a
components-folder label helper. The copied name-match block and the near-verbatim expansion-grouping block between the
power and other-card modules collapse into shared internals. The element-icon map's copies collapse to one component
used everywhere.

**Blocked by:** None — can start immediately.

**Status:** done

- [ ] One pipeline module per family composes filter→sort→group; the Archive tab renders its output.
- [ ] The domain no longer imports a presentation label from the components folder; labels and the judgment suffix are
      applied at render time.
- [ ] The copied name-match and expansion-grouping blocks collapse into shared internals.
- [ ] The element-icon map is declared once and used by every renderer.
- [ ] Existing filter and arrange tests pass unchanged; new tests pin each pipeline's order.

## Comments

Implemented 2026-08-06. `browsePowerCards` (filter → sort → group) and `browseOtherCards`
(slice → filter → group) compose the existing primitives; CardsTab renders their output. The
domain returns raw subtype keys and the render layer (`subtypeGroupLabel`, CardsTab's group
titles, FearImpactView/EventValenceView) applies the human label and the blight "(judgment)"
suffix — the domain's import of `tagColors` is gone. `cardBrowse.ts` holds the shared `matchName`
and `groupByExpansion` internals. `ElementIcon` is the one element-icon renderer. Filter/arrange
tests pass unchanged except the arrange labels, which moved to the render layer by design; new
`browsePowerCards.test.ts`/`browseOtherCards.test.ts` pin each pipeline's order.
