import { describe, expect, it } from 'vitest'
import { SCENARIOS, scenarioDifficultyFigure } from '../scenarios'

/**
 * Pins every scenario's printed difficulty against the Spirit Island Wiki (phase-4 #20; see
 * scenarios.json's `_note` for the fetch trail). Same tripwire as the adversary/aspect canons:
 * this repo has shipped fabricated data before, so sourced values are pinned verbatim — the
 * wiki prints qualified values (`1*`, `-1*`, `+/- 1`) and collapsing them to bare numbers
 * would be estimation. The one derived reading: the wiki gives Surges of Colonization a single
 * `+2/+7` (normal/Larger Surges); the dataset's two rows split it accordingly, supported by
 * the scenario page's own "LARGER SURGES (HIGHER DIFFICULTY)" rules text.
 */
const CANONICAL_DIFFICULTIES: Record<string, string> = {
  'A Diversity of Spirits': '0',
  Blitz: '0',
  'Dahan Insurrection': '4',
  'Despicable Theft': '2',
  'Destiny Unfolds': '-1*',
  'Elemental Invocation': '1*',
  "Guard the Isle's Heart": '0',
  'Powers Long Forgotten': '1*',
  'Rituals of Terror': '3',
  'Rituals of the Destroying Flame': '3',
  'Second Wave': '+/- 1',
  'Surges of Colonization (Larger Surges)': '+7',
  'Surges of Colonization (Normal Surges)': '+2',
  'The Great River': '3',
  'Varied Terrains': '2',
  'Ward the Shores': '2',
}

/**
 * legibility-pass #02: pins every scenario's expansion against the Spirit Island Wiki (each
 * scenario's own page states "Part of the ___ Expansion" / "Part of the Base Game"; fetch trail
 * in `.scratch/legibility-pass/scenario-expansions-research.md`). Kept as the raw wiki string, not
 * the canonical `ExpansionName` — same convention as `difficulty` above and as the other card
 * datasets; `expansionCanon.test.ts` is the tripwire that these raw strings resolve correctly via
 * `normalizeExpansion()`. A Diversity of Spirits and Varied Terrains print "Part of Promo Pack 2"
 * on their own pages but are category-tagged Feather and Flame; `normalizeExpansion` resolves
 * `Promo Pack 2` to `Feather & Flame` per the owner's legibility-pass #01 call (Promo2/Promo Pack 2
 * always resolves to Feather & Flame).
 */
const CANONICAL_EXPANSIONS: Record<string, string> = {
  'A Diversity of Spirits': 'Promo Pack 2',
  Blitz: 'Base Game',
  'Dahan Insurrection': 'Base Game',
  'Despicable Theft': 'Jagged Earth',
  'Destiny Unfolds': 'Nature Incarnate',
  'Elemental Invocation': 'Jagged Earth',
  "Guard the Isle's Heart": 'Base Game',
  'Powers Long Forgotten': 'Branch and Claw',
  'Rituals of Terror': 'Base Game',
  'Rituals of the Destroying Flame': 'Branch and Claw',
  'Second Wave': 'Branch and Claw',
  'Surges of Colonization (Larger Surges)': 'Nature Incarnate',
  'Surges of Colonization (Normal Surges)': 'Nature Incarnate',
  'The Great River': 'Jagged Earth',
  'Varied Terrains': 'Promo Pack 2',
  'Ward the Shores': 'Branch and Claw',
}

describe('scenario canon', () => {
  it('pins every scenario difficulty to the wiki-sourced value', () => {
    expect(Object.fromEntries(SCENARIOS.map((s) => [s.name, s.difficulty]))).toEqual(CANONICAL_DIFFICULTIES)
  })

  it('pins every scenario expansion to the wiki-sourced value', () => {
    expect(Object.fromEntries(SCENARIOS.map((s) => [s.name, s.expansion]))).toEqual(CANONICAL_EXPANSIONS)
  })

  it('covers exactly the 16 shipped scenarios — a new scenario cannot ship without a sourced difficulty', () => {
    expect(SCENARIOS).toHaveLength(16)
    const names = SCENARIOS.map((s) => s.name)
    expect(new Set(names).size).toBe(names.length)
  })
})

describe('scenarioDifficultyFigure', () => {
  it('reads the figure out of every printed form, qualified values by their number', () => {
    expect(scenarioDifficultyFigure('0')).toBe(0)
    expect(scenarioDifficultyFigure('4')).toBe(4)
    expect(scenarioDifficultyFigure('1*')).toBe(1)
    expect(scenarioDifficultyFigure('-1*')).toBe(-1)
    expect(scenarioDifficultyFigure('+/- 1')).toBe(1)
    expect(scenarioDifficultyFigure('+7')).toBe(7)
  })

  it('a value with no figure reads undefined, never a guess', () => {
    expect(scenarioDifficultyFigure('varies')).toBeUndefined()
  })

  it('every shipped difficulty has a readable figure', () => {
    for (const s of SCENARIOS) {
      expect(scenarioDifficultyFigure(s.difficulty), s.name).not.toBeUndefined()
    }
  })
})
