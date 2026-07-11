import { AXES } from './axisLabels'
import type { Weights } from './recommend'
import type { Aspect, OCFDU, Spirit } from './types'

const LOW_RATING_THRESHOLD = 2

/**
 * The axis, if any, that the user weighted most highly AND the base spirit rates low on.
 * Feeds the sibling list's aspect hint: a sibling whose `shiftsToward` points at this axis
 * is the one worth calling out. Aspects are never scored/ranked themselves - this only
 * decides which sibling earns a highlight, not the ranking.
 */
export function topWeightedLowAxis(spirit: Spirit, weights: Weights): keyof OCFDU | undefined {
  const maxWeight = Math.max(0, ...AXES.map((axis) => weights[axis] ?? 0))
  if (maxWeight <= 0) return undefined

  const highImportanceAxes = AXES.filter((axis) => (weights[axis] ?? 0) === maxWeight)
  return highImportanceAxes.find((axis) => spirit.ratings[axis] <= LOW_RATING_THRESHOLD)
}

/** Whether an aspect's `shiftsToward` hint points at the given axis. Owns the `+axis` string
 * convention so no caller re-derives it. */
export function aspectShiftsToward(aspect: Aspect | undefined, axis: keyof OCFDU | undefined): boolean {
  return axis !== undefined && aspect?.shiftsToward === `+${axis}`
}
