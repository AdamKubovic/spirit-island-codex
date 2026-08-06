import { QUESTIONS } from './questionnaire'
import { AXES } from './scoringPrimitives'
import type { Complexity, OCFDU } from './types'

export type Answers = Record<string, string>

export interface DerivedPreferences {
  weights: OCFDU
  tempo: number
  boardControl: number
  complexityImportance: number
  complexityCeiling: Complexity
  tierKnob: number
}

export function answersToWeights(answers: Answers): DerivedPreferences {
  const prefs: DerivedPreferences = {
    weights: { offense: 0, control: 0, fear: 0, defense: 0, utility: 0 },
    tempo: 0,
    boardControl: 0,
    complexityImportance: 0.5,
    complexityCeiling: 'Very High',
    tierKnob: 0.5,
  }

  for (const question of QUESTIONS) {
    const selected = answers[question.id]
    const option = question.options.find((o) => o.value === selected)
    if (!option) continue

    for (const [key, value] of Object.entries(option.delta)) {
      if (AXES.includes(key as keyof OCFDU)) {
        prefs.weights[key as keyof OCFDU] += value as number
      } else {
        // tempo, boardControl accumulate; complexityImportance/complexityCeiling/tierKnob are single-source, so assignment is equivalent to accumulation
        if (key === 'tempo' || key === 'boardControl') {
          ;(prefs as unknown as Record<string, number>)[key] += value as number
        } else {
          ;(prefs as unknown as Record<string, unknown>)[key] = value
        }
      }
    }
  }

  for (const axis of AXES) {
    prefs.weights[axis] = Math.max(0, prefs.weights[axis])
  }

  return prefs
}
