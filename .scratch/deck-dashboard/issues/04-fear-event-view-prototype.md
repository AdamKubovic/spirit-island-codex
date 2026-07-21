# Fear/event view prototype

Status: done
Labels: wayfinder:prototype
Map: ../MAP.md
Blocked-by: 02-fear-event-valence-taxonomy.md

## Question

What do the Fear and Event deck views show, once the valence taxonomy exists?

Run `/prototype` with the taxonomy from
[Fear/event valence taxonomy](02-fear-event-valence-taxonomy.md) in hand: composition of
each deck by valence (the owner's driving question — "how likely is a bad event / a good
fear card?"), plus whatever existing facets earn a place (fear `tags`, event `eventClass`,
expansion split). Decide the draw-odds presentation (next-card odds? next-N?) and keep the
visual language consistent with whatever
[Power-deck chart vocabulary](03-power-deck-chart-vocabulary.md) lands on, if it has
resolved by then.

Resolution records the chosen views and links the prototype artifact.

## Comments

**2026-07-21 — prototype up, awaiting owner verdict.** Three variants mounted inside the real
Dashboard Fear/Event segments (sub-shape A), gated by `?variant=` — without the param the
shipped views render untouched; the switcher is dev-only. Run `npm run dev` and open
`/?variant=A`, then Dashboard → Fear/Event; `←`/`→` or the floating pill cycles variants.
Screenshots in `screenshots-04-proto/`.

- **A — Headline stack:** stat-tile row answering the driving question ("next event: X%
  harmful"), one 100%-stacked valence bar, then the tag/class facet rebuilt as mini stacked
  bars (expansion facet dropped). Odds framing on trial: next-draw odds = pool share.
- **B — Crosstab matrix:** valence × class (impact × tag) grid — "where does the bad live" —
  with an all-cards totals row.
- **C — Card wall:** every card a chip colored by its bucket, grouped by tag/class — browsing
  over aggregating. Known softness: the sequential green impact ramp reads subtly on chip edges.

Ratings are loudly-marked **name-hash stubs** in `Prototype04FearEvent.tsx` — not judgments;
the real table comes with the follow-up spec's rubric + ratification. Colors dataviz-validated
on the app surface: harmful `#d97742` / mixed neutral / beneficial `#4f9ad4` — **blue, not the
accent green, because green fails CVD separation against the warm pole (deutan ΔE 7.1)**; fear
impact uses a sequential green ramp (magnitude, not polarity). Both calls are for the owner to
ratify or override with the variant pick.

**2026-07-21 — VERDICT (owner): variant D**, the round-2/3 hybrid of A and C, for both Fear
and Event segments:

- **A's headline stack** as the base: stat tiles (percent first, count in brackets — "32%
  (16) minor card"), one 100%-stacked bar, tag/class facet as mini stacked bars, expansion
  facet dropped. Next-draw odds framed as pool share.
- **Click-to-drill everywhere:** every stat tile and every bucket×group bar segment expands
  an inline chip list of exactly those cards ("major × Removal · 6 cards (12%)"), with a
  clear button; click again collapses.
- **Card chips open the real card:** hover → floating card-image preview; click → the shared
  `CardViewer` enlarge. (Touch devices rely on the click path — keep both in the real build.)
- **Counts always carry percentages in brackets** — no mental division on a 74-card pool.
- Owner ratified the dataviz color calls: beneficial is **blue** `#4f9ad4` (accent green
  fails CVD separation vs harmful orange `#d97742`); fear impact is a sequential green ramp.
- Naming flag for the follow-up spec: "minor/major" impact levels collide with minor/major
  *powers* — consider renaming the levels (e.g. weak/solid/strong) without touching the #02
  taxonomy.

Prototype artifacts: commits `7ff7df9` (round 1, variants A–C), `9fb3aef` (round 2, drill),
`032a588` (round 3, card preview/enlarge); screenshots in `screenshots-04-proto/`. The
prototype code is deleted with this resolution (stub ratings must not outlive it — the real
view is rebuilt properly in the follow-up spec, on the ratified table); recover it from those
commits when implementing.
