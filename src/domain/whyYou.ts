import { AXIS_LABEL } from './axisLabels'
import type { Weights } from './recommend'
import { dominantAxis } from './scoringPrimitives'
import type { Spirit } from './types'

/** Deterministic one-line "why you" explanation from the dominant weighted+rated axis. No LLM. */
export function whyYou(spirit: Spirit, weights: Weights): string {
  const dominant = dominantAxis(weights, spirit.ratings)
  if (dominant === undefined) {
    return `${spirit.name} is a strong all-around pick given your answers.`
  }

  return `You leaned into ${AXIS_LABEL[dominant]} — ${spirit.name} delivers that better than most.`
}
