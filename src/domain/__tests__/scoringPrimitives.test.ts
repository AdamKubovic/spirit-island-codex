import { describe, expect, it } from 'vitest'
import { AXES, COMPLEXITY_LEVEL, dominantAxis } from '../scoringPrimitives'

describe('scoringPrimitives', () => {
  it('declares the canonical OCFDU axis list once', () => {
    expect(AXES).toEqual(['offense', 'control', 'fear', 'defense', 'utility'])
  })

  it('maps every printed complexity level to its ordinal position', () => {
    expect(COMPLEXITY_LEVEL).toEqual({ Low: 1, Moderate: 2, High: 3, 'Very High': 4 })
  })

  describe('dominantAxis', () => {
    const ratings = { offense: 5, control: 1, fear: 3, defense: 1, utility: 2 }

    it('returns the axis with the highest weight*rating contribution', () => {
      // control is weighted highest, but the spirit barely rates it -> offense dominates.
      expect(dominantAxis({ offense: 1, control: 5 }, ratings)).toBe('offense')
    })

    it('returns undefined when nothing is weighted', () => {
      expect(dominantAxis({}, ratings)).toBeUndefined()
    })

    it('is deterministic for a given input', () => {
      const a = dominantAxis({ offense: 3, defense: 2 }, ratings)
      const b = dominantAxis({ offense: 3, defense: 2 }, ratings)
      expect(a).toBe(b)
    })
  })
})
