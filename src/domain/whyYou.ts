import type { Weights } from './recommend'
import type { OCFDU, Spirit } from './types'

const AXES: (keyof OCFDU)[] = ['offense', 'control', 'fear', 'defense', 'utility']

const AXIS_LABEL: Record<keyof OCFDU, string> = {
  offense: 'aggression',
  control: 'battlefield control',
  fear: 'fear generation',
  defense: 'staying power',
  utility: 'flexibility',
}

/** Deterministic one-line "why you" explanation from the dominant weighted+rated axis. No LLM. */
export function whyYou(spirit: Spirit, weights: Weights): string {
  const weighted = AXES.filter((axis) => (weights[axis] ?? 0) > 0)
  if (weighted.length === 0) {
    return `${spirit.name} is a strong all-around pick given your answers.`
  }

  const dominant = weighted.reduce((best, axis) =>
    (weights[axis] ?? 0) * spirit.ratings[axis] > (weights[best] ?? 0) * spirit.ratings[best] ? axis : best,
  )

  return `You leaned into ${AXIS_LABEL[dominant]} — ${spirit.name} delivers that better than most.`
}
