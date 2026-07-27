# Add expansion colour to surfaces that don't show it today

Status: done

## Parent

`../README.md`, `phase-4/issues/21-*.md` (the ticket that raised and parked this question)

## Background

Phase 4 #21 set out to make "an expansion is one colour everywhere" true. The audit found the
structural call already held: `EXPANSION_COLOR` in `tagColors.ts` is the one mapping, and its
only two consumers — Browse's `SpiritTile` and the detail's `SpiritDetail` — are the only two
surfaces that colour expansions **at all**. Nothing shipped for that box because there was
nothing inconsistent to fix.

But the ticket's own wording named the tier board and the Archive among the surfaces expansion
colour should appear on, and neither shows it today. The ticket flagged this as a reading
question rather than guessing: consistency-where-it-already-appears (the weaker reading, which
is what #21 shipped) vs. colour-added-to-new-surfaces (the stronger reading, parked here).

## What this needs before it's buildable

- Owner confirmation of which surfaces should gain expansion colour — the tier board, the
  Archive, both, or something else.
- Once scoped, this is likely a small ticket: extend `EXPANSION_COLOR` consumption to the named
  surfaces, no new palette work (the mapping already exists and is single-source).

## Out of scope (for now)

Redesigning `EXPANSION_COLOR` itself — that mapping already shipped and isn't in question, only
where it's consumed.

## Comments

**Scoped and shipped — 2026-07-27.**

**Owner call:** expansion colour on the **tier board and the Archive, both** (the stronger reading
this ticket parked). Scoping that revealed the two halves were in very different states.

### The Archive already had it — nothing was owed

The ticket's premise ("neither shows it today") was true when phase-4 #21 audited it, but has since
gone stale. `legibility-pass` #05 added `expansionColorFor` to all four Archive row views —
`CardRows`, `OtherCardRows`, `ScenarioRows`, `AdversaryRows` — as a solid `.expansion-chip` pill
replacing the plain-text expansion column (owner picked variant C at the time).

The Archive's *tile/grid* views still show no expansion colour, and that was left alone
deliberately: `archive-grouping` #01 removed the tile corner-badge on purpose — "tiles show art,
clean" — and all three grid components (`CardGrid`, `AdversaryGrid`, `ScenarioGrid`) carry a comment
recording it. Adding it back would reverse a standing owner decision, which this ticket's own
"Out of scope" doesn't license. Flagged rather than done.

### The tier board is the real change

`TierBoard`'s spirit tiles and card tiles now carry a 4px left-edge expansion stripe, colour from
the existing single source — `expansionChipColor` for spirits (canonical `ExpansionName`) and
`expansionColorFor` for cards (raw transcribed strings like `Basegame`/`Promo2`, via the alias
table). No new palette, exactly as this ticket predicted.

Three judgment calls, recorded because they weren't in the ticket:

1. **Stripe, not chip.** A tier tile is 116px wide with 53px of art and a figcaption already
   absolutely positioned over its bottom edge — there is nowhere to put a *text* chip, the same
   constraint `.unowned-badge` documents. So the colour reuses the 4px left-edge stripe
   `SpiritTile` already uses for this exact signal, and the expansion's name goes in the tile's
   `title`, where words fit. Colour is never the signal's only carrier.
2. **A configuration has two expansions; a stripe has one.** `isConfigurationOwned` gates on both
   the spirit's box and the aspect's. The stripe follows the **base spirit**, matching what
   `SpiritTile`/`SpiritDetail` already do, so a spirit reads as the same colour on Browse and on the
   board — the "one expansion, one colour everywhere" goal. When an aspect ships in a different box
   the tooltip says so in words ("Base; the aspect ships in Nature Incarnate"). Worth knowing:
   **all 31 aspects ship in a different box from their spirit** (Nature Incarnate 20, Jagged Earth
   6, Feather & Flame 5; none in Base), checked against `spirits.json` — so the same-box branch is
   currently unreachable. `appSmoke.test.tsx` pins both facts, so aspect data that changed either
   surfaces there.
3. **Legibility came from a ring, not from the art.** Measured on the real render, a jewel tone over
   full-bleed art lands between **1.08:1 and 2.40:1** (Base over A Spread of Rampant Green 2.27:1;
   Jagged Earth over Fractured Days' twilight sky 1.08:1 — all but invisible). Six fixed colours
   can't clear a useful figure against 37 artworks, so the stripe gets a dark ring and borrows its
   contrast from that instead. The ring is **`--deck-panel-2`, opaque**: a translucent black
   composites with the art, so its contrast would vary per artwork (an `rgba(0,0,0,.85)` ring
   measured only 2.19:1 worst-case over pale art). Opaque makes the figure exact and
   art-independent — **2.75:1 floor** (Jagged Earth), 3.93:1 ceiling — and pinned in
   `cardChipColors.test.ts`, since `tagColors` explicitly permits re-tuning this palette and a
   re-tune would otherwise silently break a surface no other consumer cares about.

   Every figure above is reproducible: `node .scratch/theming-spread/measure-stripe-contrast.mjs`
   (add `--live` against a running preview for the stripe-vs-art sampling).

### Review pass

`/code-review` ran both axes. Spec: clean — it independently re-derived the aspect counts from
`spirits.json` and recomputed every contrast figure, all confirmed. Standards raised four things,
all fixed rather than argued:

- **ADR 0011.** The ring was `rgba(0, 0, 0, 0.85)` — a new hardcoded chrome value, and invisible to
  the ADR's own `grep '#[0-9a-fA-F]\{3,6\}'` audit because it's `rgba()`. Now `var(--deck-panel-2)`.
  Chasing this exposed a **real error in my own claim**: the ring was semi-transparent, so it
  composites with the art, and the "clears 3:1" figure I'd quoted assumed *pure* black. The true
  worst case for the translucent ring was 2.19:1. The opaque token fixes the variability; the
  honest floor is 2.75:1, and the comment, the test and this ticket all now say so.
- **ADR 0003 (tripwire placement).** Two dataset assertions about aspect expansions sat in the
  render smoke test. The per-expansion counts turned out to be **already pinned** by
  `aspectCanon.test.ts`, so that assertion was redundant and is gone; the genuinely new fact ("no
  aspect ships in its own spirit's expansion") moved there as its own canon test.
- **Unfalsifiable comments.** The quoted contrast figures had no artefact behind them — in a repo
  with this fabrication history, that's a fair objection even when the numbers are right. Added
  `measure-stripe-contrast.mjs`, referenced from the CSS and the test.
- **A vacuous assertion.** `expect(html).toContain('Base')` matches `Basegame` and pins nothing;
  now asserts the full tooltip.

### Verification

- 5 new tests (586 total, all passing), typecheck clean, production build clean.
- ADR 0011 grep audit re-run against the diff: the stripe adds no hardcoded hex to a declaration.
- Checked against the **production build** at 1280px and 375px per the standing convention;
  screenshots in `screenshots-02/`.
- Verified against the live DOM rather than by eye: **68 stripes for 68 configurations** and
  **101 for 101** minor cards, none missing, each 4×53px, computed colours byte-correct
  (`rgb(74,107,138)` = `#4a6b8a` Base, `#7a4a6e` Jagged Earth, `#6e5a2a` Nature Incarnate). Raw
  `Basegame` resolves to Base's colour, confirming the alias path.
- The card tooltip shows the **raw** transcribed string (`Basegame`), matching what the Archive's
  own chip renders verbatim — consistent, and honest about what the source printed.

### Left for the owner

- The Archive's tile/grid views still carry no expansion colour, by `archive-grouping` #01's
  decision (above). Say so if you want that reversed — it's a separate call, not this ticket's.
- **A pure-black stripe ring** would lift the contrast floor from 2.75:1 to 3.03:1, clearing WCAG
  1.4.11's 3:1 even though the stripe is decoration and doesn't owe it. That needs a near-black
  colour role no `--deck-*` token holds, and ADR 0011 escalates a new role to the owner rather than
  letting an agent invent one — so it's your call, not taken. Shipped on the existing token.
- One latent gap the review surfaced, predating this ticket: `EXPANSION_COLOR` has 6 keys while its
  neighbouring comment says "the 7 canonical `ExpansionName` values" — `Promo` has no colour. No
  spirit or card resolves to `Promo` today (ADR 0008 folds it into Feather & Flame), so nothing
  renders stripe-less now, and `ExpansionStripe`'s `undefined` → no-stripe path is the honest
  absence the data rules want rather than a guessed fallback. Noted, not silently "fixed".
