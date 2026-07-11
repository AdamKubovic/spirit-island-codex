import type { Configuration } from './configurations'
import type { Complexity } from './types'

const COMPLEXITY_LEVEL: Record<Complexity, number> = { Low: 1, Moderate: 2, High: 3, 'Very High': 4 }

export interface RandomChooseOptions {
  complexityCeiling?: Complexity
}

/** Constraints are hard filters here (unlike the recommender's soft complexity penalty).
 * Filters on `effectiveComplexity` (printed base + aspect arrow) - the drawer's ceiling is the
 * newcomer safeguard's cousin, so it must never soften against a personal override. */
export function eligiblePool(configurations: Configuration[], options: RandomChooseOptions = {}): Configuration[] {
  const { complexityCeiling } = options
  if (!complexityCeiling) return configurations
  return configurations.filter((c) => COMPLEXITY_LEVEL[c.effectiveComplexity] <= COMPLEXITY_LEVEL[complexityCeiling])
}

/** Uniform draw over the eligible pool. randomFn is injectable for deterministic tests. */
export function drawRandom(
  configurations: Configuration[],
  options: RandomChooseOptions = {},
  randomFn: () => number = Math.random,
): Configuration | undefined {
  const pool = eligiblePool(configurations, options)
  if (pool.length === 0) return undefined
  return pool[Math.floor(randomFn() * pool.length)]
}
