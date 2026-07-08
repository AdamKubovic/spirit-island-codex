import { describe, expect, it } from 'vitest'
import type { Spirit } from '../types'
import { whyYou } from '../whyYou'

const spirit: Spirit = {
  id: 'test-spirit',
  name: 'Test Spirit',
  expansion: 'Base',
  complexity: 'Low',
  ratings: { offense: 5, control: 1, fear: 1, defense: 1, utility: 1 },
  elements: [],
  summary: '',
  tags: [],
  aspects: [],
}

describe('whyYou', () => {
  it('names the dominant weighted axis', () => {
    expect(whyYou(spirit, { offense: 3 })).toContain('aggression')
  })

  it('picks the axis with the highest weight*rating contribution', () => {
    // control weight is higher, but spirit barely rates control -> offense still wins
    expect(whyYou(spirit, { offense: 1, control: 5 })).toContain('aggression')
  })

  it('falls back to a generic line when nothing was weighted', () => {
    expect(whyYou(spirit, {})).toContain(spirit.name)
  })

  it('is deterministic', () => {
    const a = whyYou(spirit, { offense: 3, defense: 2 })
    const b = whyYou(spirit, { offense: 3, defense: 2 })
    expect(a).toBe(b)
  })
})
