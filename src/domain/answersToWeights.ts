import { QUESTIONS } from './questionnaire'
import type { Complexity, OCFDU } from './types'

export type Answers = Record<string, string>

export interface DerivedPreferences {
  weights: OCFDU
  tempo: number
  boardControl: number
  complexityImportance: number
  complexityCeiling: Complexity
  tierKnob: number
  elementAffinity: string[]
}

const WEIGHT_AXES: (keyof OCFDU)[] = ['offense', 'control', 'fear', 'defense', 'utility']

export function answersToWeights(answers: Answers): DerivedPreferences {
  const prefs: DerivedPreferences = {
    weights: { offense: 0, control: 0, fear: 0, defense: 0, utility: 0 },
    tempo: 0,
    boardControl: 0,
    complexityImportance: 0.5,
    complexityCeiling: 'Very High',
    tierKnob: 0.5,
    elementAffinity: [],
  }

  for (const question of QUESTIONS) {
    const selected = answers[question.id]
    const option = question.options.find((o) => o.value === selected)
    if (!option) continue

    for (const [key, value] of Object.entries(option.delta)) {
      if (key === 'elementAffinity') {
        prefs.elementAffinity = [...prefs.elementAffinity, ...(value as string[])]
      } else if (WEIGHT_AXES.includes(key as keyof OCFDU)) {
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

  for (const axis of WEIGHT_AXES) {
    prefs.weights[axis] = Math.max(0, prefs.weights[axis])
  }

  return prefs
}
