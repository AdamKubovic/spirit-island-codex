import { describe, expect, it } from 'vitest'
import { recommend } from '../recommend'
import type { Spirit } from '../types'

const fixtureSpirits: Spirit[] = [
  {
    id: 'high-offense',
    name: 'High Offense',
    expansion: 'Base',
    complexity: 'Low',
    ratings: { offense: 5, control: 1, fear: 1, defense: 1, utility: 1 },
    elements: [],
    summary: '',
    tags: [],
    aspects: [],
  },
  {
    id: 'high-defense',
    name: 'High Defense',
    expansion: 'Base',
    complexity: 'Low',
    ratings: { offense: 1, control: 1, fear: 1, defense: 5, utility: 1 },
    elements: [],
    summary: '',
    tags: [],
    aspects: [],
  },
]

describe('recommend', () => {
  it('ranks the high-offense spirit first when offense is weighted', () => {
    const ranked = recommend(fixtureSpirits, { offense: 1 })
    expect(ranked[0].spirit.id).toBe('high-offense')
  })

  it('is deterministic across repeated calls', () => {
    const a = recommend(fixtureSpirits, { offense: 1 })
    const b = recommend(fixtureSpirits, { offense: 1 })
    expect(a.map((r) => r.spirit.id)).toEqual(b.map((r) => r.spirit.id))
  })
})
