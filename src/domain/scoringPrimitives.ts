import type { Complexity, OCFDU } from './types'

/** The five OCFDU axes, in the canonical order every scorer and renderer iterates. Declared once
 * here; the scorers (recommend, the Wildcard, the "why you" line, the aspect nudges, the
 * answers→preferences conversion, the random chooser) import it rather than re-declaring it. */
export const AXES: (keyof OCFDU)[] = ['offense', 'control', 'fear', 'defense', 'utility']

/** Ordinal position of each printed complexity level on the Low..Very High scale. Single home for
 * the map the scorers and the render layer both use. */
export const COMPLEXITY_LEVEL: Record<Complexity, number> = { Low: 1, Moderate: 2, High: 3, 'Very High': 4 }

/** The axis whose weight × rating product dominates — what the "why you" line reports. Undefined
 * when nothing is weighted (the caller renders its generic fallback instead). */
export function dominantAxis(weights: Partial<OCFDU>, ratings: OCFDU): keyof OCFDU | undefined {
  const weighted = AXES.filter((axis) => (weights[axis] ?? 0) > 0)
  if (weighted.length === 0) return undefined
  return weighted.reduce((best, axis) =>
    (weights[axis] ?? 0) * ratings[axis] > (weights[best] ?? 0) * ratings[best] ? axis : best,
  )
}
