/**
 * Central keyed glossary map. Every entry restates an in-repo definition (CONTEXT.md or a
 * classifier/data rule) and carries a `source` and a friendly `label` (the ids stay internal).
 * A tripwire (`glossaryCanon.test.ts`) fails the build on empty text, empty label, or a bad
 * source — the same discipline as `aspectCanon`. Terms with no in-repo source are omitted and
 * listed as an owner TODO; never invented.
 */
export type GlossarySource = 'context' | 'owner' | 'wiki'

export interface GlossaryEntry {
  label: string
  text: string
  source: GlossarySource
}

export const GLOSSARY_SOURCES: readonly GlossarySource[] = ['context', 'owner', 'wiki']

export const GLOSSARY: Record<string, GlossaryEntry> = {
  // Impact (fear) — CONTEXT.md "Impact (fear)": three-level ordinal of how strongly a fear
  // card helps the players; every fear card is good.
  'impact-weak': {
    label: 'Weak impact',
    text: 'Impact 1 of 3 (weak) — how strongly this fear card helps the players. Every fear card is good; impact is how much, never whether.',
    source: 'context',
  },
  'impact-solid': {
    label: 'Solid impact',
    text: 'Impact 2 of 3 (solid) — how strongly this fear card helps the players. Every fear card is good; impact is how much, never whether.',
    source: 'context',
  },
  'impact-strong': {
    label: 'Strong impact',
    text: 'Impact 3 of 3 (strong) — how strongly this fear card helps the players. Every fear card is good; impact is how much, never whether.',
    source: 'context',
  },

  // Valence (event) — CONTEXT.md "Valence (event)".
  'valence-harmful': {
    label: 'Harmful',
    text: 'Bad for the players. Valence is whether an event card helps or hurts — judged per card.',
    source: 'context',
  },
  'valence-mixed': {
    label: 'Mixed',
    text: 'Neither clearly good nor bad — the honest rating for condition-dependent and choice cards, not a fallback.',
    source: 'context',
  },
  'valence-beneficial': {
    label: 'Beneficial',
    text: 'Good for the players. Valence is whether an event card helps or hurts — judged per card.',
    source: 'context',
  },

  // Fear tags — CONTEXT.md "Card sub-type" + otherCardClassifier keyword rules. What a card
  // does, never how good it is; multi-tag; keyword-derived.
  'fear-tag-removal': {
    label: 'Removal',
    text: "Removes or destroys Invaders. One of five keyword-derived fear tags — what the card does, never how good it is; a card can carry several as terror level rises.",
    source: 'context',
  },
  'fear-tag-defensive': {
    label: 'Defensive',
    text: "Defends lands ('Defend N'), preventing damage. One of five keyword-derived fear tags — what the card does, never how good it is; a card can carry several as terror level rises.",
    source: 'context',
  },
  'fear-tag-weaken': {
    label: 'Weaken',
    text: 'Adds Strife, or exploits Strife already placed. One of five keyword-derived fear tags — what the card does, never how good it is; a card can carry several as terror level rises.',
    source: 'context',
  },
  'fear-tag-disruption': {
    label: 'Disruption',
    text: "Interrupts invader actions — Isolate, skipped Explores/Builds, or 'does not' effects. One of five keyword-derived fear tags — what the card does, never how good it is; a card can carry several as terror level rises.",
    source: 'context',
  },
  'fear-tag-displacement': {
    label: 'Displacement',
    text: 'Pushes or gathers Invaders between lands. One of five keyword-derived fear tags — what the card does, never how good it is; a card can carry several as terror level rises.',
    source: 'context',
  },
  'fear-tag-unclassified': {
    label: 'Unclassified',
    text: 'No keyword matched — an empty tag set is Unclassified, never forced into a nearest bucket.',
    source: 'context',
  },

  // Event classes — the upstream card source's own constructor per card (otherCardClassifier.ts
  // eventClassFromConstructorName), not judgment: it draws the line the source data already draws.
  'event-class-choice': {
    label: 'Choice',
    text: 'A ChoiceEventCard — the players pick between two or more listed effects.',
    source: 'context',
  },
  'event-class-stage': {
    label: 'Stage',
    text: 'A StageEventCard — its effect depends on the current Invader stage (I/II/III).',
    source: 'context',
  },
  'event-class-terrorLevel': {
    label: 'Terror level',
    text: 'A TerrorLevelEventCard — its effect depends on the current Terror Level.',
    source: 'context',
  },
  'event-class-healthyBlightedLand': {
    label: 'Healthy or Blighted land',
    text: 'A HealthyBlightedLandEventCard — its effect depends on whether a land is healthy or Blighted.',
    source: 'context',
  },
  'event-class-adversary': {
    label: 'Adversary',
    text: 'An AdversaryEvent — printed by the adversary deck rather than the base Event deck.',
    source: 'context',
  },
  'event-class-unclassified': {
    label: 'Unclassified',
    text: 'No event-class constructor matched — an empty class is Unclassified, never forced into a nearest bucket.',
    source: 'context',
  },

  // Card sub-type — CONTEXT.md "Card sub-type": the descriptive bucket(s) a fear, event or blight
  // card falls into. One entry shared by the Archive's three Sub-type filter labels.
  subtype: {
    label: 'Sub-type',
    text: 'What a fear, event or blight card does — never how good it is. Fear cards carry any of five keyword-derived tags (Removal, Defensive, Weaken, Disruption, Displacement), multi-tag as terror level rises; blight cards carry four coarser tags (Presence loss, Board change, Damage bonus, Resource swing), read from the card effect by judgment — the same provenance as the app\u2019s other judgment fields; events carry exactly one of five upstream classes (Choice, Stage, Terror level, Healthy/blighted land, Adversary). A card that matches nothing is Unclassified, never forced into a nearest bucket.',
    source: 'context',
  },

  // Complexity — CONTEXT.md "Complexity": a spirit's printed rules load, distinct from
  // difficulty (adversary setup) and from a personal complexity override (the user's own read).
  complexity: {
    label: 'Complexity',
    text: 'A spirit\u2019s printed rules load — Low | Moderate | High | Very High. Keep it distinct from a setup\u2019s difficulty (adversary + level) and from your personal complexity override (your own read of how heavy a spirit feels, set in Settings). A configuration\u2019s effective complexity is the base spirit\u2019s printed complexity shifted by its aspect\u2019s arrow, clamped at Very High; the printed value is never mutated. A newcomer safeguard always reads printed complexity; the enjoyment preference reads the override.',
    source: 'context',
  },

  // Difficulty — the additive model computed by domain/difficulty.ts.
  difficulty: {
    label: 'Difficulty',
    text: 'An ≈ approximate suggestion, additive from: the primary adversary\'s printed per-level number, plus (if a second adversary is set) the higher of the two difficulties plus ~60% of the lower, plus a board modifier (Thematic·base +3, Thematic·rebalanced +1, Classic +0, Blighted Island +0 — no sourced chart modifier exists for it), plus the picked scenario\'s printed difficulty. Per-level adversary numbers are official (printed on the panel); the board and second-adversary modifiers are the community difficulty chart\'s own approximations. The stored value is editable — this is a starting point, not a locked score.',
    source: 'owner',
  },
}

export function glossaryEntry(id: string): GlossaryEntry | undefined {
  return GLOSSARY[id]
}
