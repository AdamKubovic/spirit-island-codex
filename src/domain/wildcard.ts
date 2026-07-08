import type { RankedSpirit, Weights } from './recommend'
import type { Complexity, OCFDU, Spirit } from './types'

const AXES: (keyof OCFDU)[] = ['offense', 'control', 'fear', 'defense', 'utility']

const COMPLEXITY_LEVEL: Record<Complexity, number> = { Low: 1, Moderate: 2, High: 3, 'Very High': 4 }

/**
 * Picks a deliberately off-profile spirit outside the top-3: preferably one above the
 * complexity ceiling (the wildcard "reaches past" the soft penalty), otherwise the
 * best-rated spirit on whichever axis the user weighted least. `offset` cycles through
 * the eligible candidates deterministically (used by the reroll action).
 */
export function selectWildcard(
  ranked: RankedSpirit[],
  weights: Weights,
  complexityCeiling: Complexity | undefined,
  offset = 0,
): Spirit | undefined {
  const topIds = new Set(ranked.slice(0, 3).map((r) => r.spirit.id))
  const remaining = ranked.filter((r) => !topIds.has(r.spirit.id))
  if (remaining.length === 0) return undefined

  const overCap = complexityCeiling
    ? remaining.filter((r) => COMPLEXITY_LEVEL[r.spirit.complexity] > COMPLEXITY_LEVEL[complexityCeiling])
    : []

  const minWeightAxis = AXES.reduce((a, b) => ((weights[a] ?? 0) <= (weights[b] ?? 0) ? a : b))
  const offProfile = [...remaining].sort(
    (a, b) =>
      b.spirit.ratings[minWeightAxis] - a.spirit.ratings[minWeightAxis] ||
      a.spirit.name.localeCompare(b.spirit.name),
  )

  const candidates = overCap.length > 0 ? overCap : offProfile
  return candidates[offset % candidates.length].spirit
}
