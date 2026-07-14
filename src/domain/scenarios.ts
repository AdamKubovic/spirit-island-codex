import scenariosData from '../data/scenarios.json'

/** v5 #05b: derived from images/manifest.json's scenario_front rows — see scenarios.json's
 * `_note`. phase-4 #20 added `difficulty`: the printed modifier, transcribed VERBATIM from the
 * Spirit Island Wiki — kept a string because the wiki qualifies some values (`1*`, `-1*`,
 * `+/- 1`) and collapsing those to numbers would be estimation. legibility-pass #02 added
 * `expansion`, the raw string transcribed from each scenario's own wiki page (same convention as
 * other-cards/power-cards/adversaries) — resolve it through `normalizeExpansion()`
 * (`components/tagColors.ts`) before colouring, don't assume it's already canonical. Pinned by
 * scenarioCanon.test.ts. */
export interface Scenario {
  name: string
  difficulty: string
  expansion: string
  image: string
}

export const SCENARIOS = scenariosData.scenarios as Scenario[]

/** The numeric reading of a printed difficulty, for presentation (band colours) only — the
 * verbatim string is what renders. Qualified values read their figure (`+/- 1` → 1, `-1*` → -1);
 * a value with no figure reads undefined. */
export function scenarioDifficultyFigure(difficulty: string): number | undefined {
  const match = difficulty.match(/[+-]?\d+/)
  return match ? Number(match[0]) : undefined
}
