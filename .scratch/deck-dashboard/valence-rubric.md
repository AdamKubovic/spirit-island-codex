# Fear impact / event valence rubric

deck-dashboard #17 (PRD-2 user story 21). Defines what makes a fear card weak (1) / solid (2) /
strong (3) **Impact**, and what makes an event harmful / mixed / beneficial **Valence** — one
overall judgment per card, not per terror level. Classification reads the card's own printed
text (all three terror-level effects on a fear card, the single effect on an event card); the
keyword-derived fear `tags` and mechanical `eventClass` are cross-checks only, never inputs
(PRD-2 user story 23) — a card is rated on what it does, not on which bucket a keyword scan
dropped it in.

## Fear Impact (1 = weak, 2 = solid, 3 = strong)

Fear cards always help the players (every fear card removes invader presence, blocks invader
actions, or otherwise sets the invaders back) — so "impact" means *how much this fear card is
worth drawing*, judged across its three terror-level tiers together as one overall card, not
tier-by-tier.

- **Weak (1):** effect is narrow, small in magnitude even at terror level III, or conditional on
  a state that often doesn't hold (few Dahan present, a specific card type in a specific deck
  region). A player rarely feels this card land.
  - *Example:* **Communities in Disarray** — removes/isolates in a single land tied to Blight;
    at level I it's a minor local nudge, and the card never scales into a board-wide effect.
- **Solid (2):** a dependable, moderate setback most games can use — removes a meaningful chunk
  of presence/explorers in 1-2 lands, or a debuff that reliably slows the invaders for a turn.
  The default rating for a fear card that does what fear cards do, without a standout swing.
  - *Example:* **Panic** — weakens invaders in one or more lands at increasing severity by
    tier; useful nearly every game, never a blowout.
- **Strong (3):** removes/displaces presence across multiple lands, or a debuff/removal so large
  at terror level III that it swings a turn on its own (e.g. clears several lands' worth of
  invaders, or a board-wide slow).
  - *Example:* **Too Many Monsters** — its top tier can remove Explorers/Towns/Cities across
    every land matching a wide criterion, a broad board-level effect few fear cards match.

## Event Valence (harmful / mixed / beneficial)

Judged from the player's-side perspective: does resolving this event set the invaders back
(beneficial to the players), set the players back (harmful), or genuinely depend on a choice or
board state so neither reading dominates (mixed)?

- **Harmful:** every resolution (or the only resolution, for non-choice cards) advances
  invaders — adds Explorers/Towns/Cities, adds Blight, or otherwise strengthens the invasion with
  no player-favoring branch.
  - *Example:* **Invaders Surge Inland** — a `healthyBlightedLand` card whose branches both push
    Invaders forward; no branch favors the players.
- **Beneficial:** every resolution favors the players — removes invaders, adds Dahan, blocks an
  Invader action, heals the land — with no invader-favoring branch.
  - *Example:* **Slave Rebellion** — the adversary-track card that (mechanically, by ruling)
    only ever damages/weakens the Invaders' position.
- **Mixed:** a genuine `choice` card where the two options trade off (Fear/Invader progress vs.
  a cost, or a pick between two harms), OR a `healthyBlightedLand`/`terrorLevel`/`stage` card
  whose branch depends on board state that swings roughly evenly in practice (healthy-land
  branch helps invaders, blighted-land branch hurts them, or vice versa, and either is common at
  the table). "Mixed" is the honest home for these — never forced into harmful or beneficial to
  avoid a third bucket.
  - *Example:* **Years of Little Rain** — a `choice` card offering the players a real trade
    (accept a cost now vs. a larger cost later), not a card whose choice is a false one.

## Cross-checks (never inputs)

- Fear `tags` (`removal`/`defensive`/`weaken`/`disruption`/`displacement`) describe *what kind*
  of effect a card has, not *how strong* — a `defensive` card can still be weak (small
  magnitude) or strong (board-wide). A draft row is flagged when its impact reads unusually for
  its tag mix (e.g. a `defensive`+`disruption` card drafted **weak** despite typically-larger
  disruption effects, or a bare untagged card drafted **strong**) so the owner double-checks
  those specifically.
- Event `eventClass` constrains *what a card can be* (a `choice` card structurally offers two
  paths — it is a strong candidate for **mixed**, though not automatically so; `terrorLevel` and
  `stage` cards scale their effect but not necessarily their valence; `healthyBlightedLand`
  cards branch on board state) but never dictates the rating — a `healthyBlightedLand` card
  whose *both* branches read as one-sided still gets that one-sided rating, not an automatic
  "mixed." A draft row is flagged when a `choice` card is *not* rated mixed, or a non-`choice`
  card *is*, so the owner can confirm the reasoning holds.

## Output

The draft table (`valence-draft.md`) rates all 50 fear + 65 event cards, one row per card, with
a short justification tied to the rubric criteria above and a cross-check flag column. Nothing
here touches `other-cards.json` — the draft is reviewed and amended by the owner in
[#18](issues/18-valence-ratification.md) before anything merges.
