import scenariosData from '../data/scenarios.json'

/** v5 #05b: derived from images/manifest.json's scenario_front rows — see scenarios.json's
 * `_note`. No expansion field; the manifest doesn't carry one and no other source in this repo
 * knows what a scenario is (an absent field beats a guessed one, CLAUDE.md). */
export interface Scenario {
  name: string
  image: string
}

export const SCENARIOS = scenariosData.scenarios as Scenario[]
