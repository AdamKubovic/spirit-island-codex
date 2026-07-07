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

const tempoFixtureSpirits: Spirit[] = [
  {
    id: 'fast-spirit',
    name: 'Fast Spirit',
    expansion: 'Base',
    complexity: 'Low',
    ratings: { offense: 3, control: 3, fear: 3, defense: 3, utility: 3 },
    elements: [],
    summary: '',
    tags: ['fast-tempo'],
    aspects: [],
  },
  {
    id: 'slow-spirit',
    name: 'Slow Spirit',
    expansion: 'Base',
    complexity: 'Low',
    ratings: { offense: 3, control: 3, fear: 3, defense: 3, utility: 3 },
    elements: [],
    summary: '',
    tags: ['ramping-economy'],
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

  it('does not penalize surplus capability in un-asked dimensions', () => {
    const ranked = recommend(fixtureSpirits, { offense: 1 })
    const highDefense = ranked.find((r) => r.spirit.id === 'high-defense')!
    // high-defense's un-asked defense stat of 5 must not drag its score below its offense contribution
    expect(highDefense.score).toBe(1) // only offense (1) counts; defense=5 is not penalized
  })

  it('boosts fast-tempo spirits when tempo preference is positive', () => {
    const ranked = recommend(tempoFixtureSpirits, {}, { tempo: 2 })
    expect(ranked[0].spirit.id).toBe('fast-spirit')
  })

  it('boosts ramping-economy spirits when tempo preference is negative', () => {
    const ranked = recommend(tempoFixtureSpirits, {}, { tempo: -2 })
    expect(ranked[0].spirit.id).toBe('slow-spirit')
  })
})
