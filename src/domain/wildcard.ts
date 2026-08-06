import type { Configuration } from './configurations'
import type { RankedConfiguration, Weights } from './recommend'
import { AXES, COMPLEXITY_LEVEL } from './scoringPrimitives'
import type { Complexity } from './types'

/**
 * Picks a deliberately off-profile configuration outside the shortlist: preferably one above the
 * complexity ceiling (the wildcard "reaches past" the soft penalty), otherwise the
 * best-rated configuration on whichever axis the user weighted least. `offset` cycles through
 * the eligible candidates deterministically (used by the reroll action). The shortlist size is a
 * required parameter — the rank-session pipeline owns the constant and passes it here. */
export function selectWildcard(
  ranked: RankedConfiguration[],
  weights: Weights,
  complexityCeiling: Complexity | undefined,
  offset = 0,
  shortlistSize: number,
): Configuration | undefined {
  const topIds = new Set(ranked.slice(0, shortlistSize).map((r) => r.config.configId))
  const remaining = ranked.filter((r) => !topIds.has(r.config.configId))
  if (remaining.length === 0) return undefined

  const overCap = complexityCeiling
    ? remaining.filter((r) => COMPLEXITY_LEVEL[r.config.effectiveComplexity] > COMPLEXITY_LEVEL[complexityCeiling])
    : []

  const minWeightAxis = AXES.reduce((a, b) => ((weights[a] ?? 0) <= (weights[b] ?? 0) ? a : b))
  const offProfile = [...remaining].sort(
    (a, b) =>
      b.config.spirit.ratings[minWeightAxis] - a.config.spirit.ratings[minWeightAxis] ||
      a.config.configId.localeCompare(b.config.configId),
  )

  const candidates = overCap.length > 0 ? overCap : offProfile
  return candidates[offset % candidates.length].config
}
