import { describe, expect, it } from 'vitest'
import type { Configuration } from '../configurations'
import { drawRandom, eligiblePool } from '../randomChoose'
import type { Spirit } from '../types'

function spirit(id: string, complexity: Spirit['complexity']): Spirit {
  return {
    id,
    name: id,
    expansion: 'Base',
    complexity,
    ratings: { offense: 1, control: 1, fear: 1, defense: 1, utility: 1 },
    elements: [],
    summary: '',
    tags: [],
    aspects: [],
  }
}

function config(id: string, effectiveComplexity: Spirit['complexity']): Configuration {
  return {
    configId: id,
    spirit: spirit(id, effectiveComplexity),
    isBase: true,
    effectiveComplexity,
    personalEffectiveComplexity: effectiveComplexity,
  }
}

const pool: Configuration[] = [
  config('low', 'Low'),
  config('moderate', 'Moderate'),
  config('high', 'High'),
  config('very-high', 'Very High'),
]

describe('eligiblePool', () => {
  it('returns the full pool when there is no complexity constraint', () => {
    expect(eligiblePool(pool)).toHaveLength(4)
  })

  it('excludes configurations above the stated complexity ceiling', () => {
    const eligible = eligiblePool(pool, { complexityCeiling: 'Moderate' })
    expect(eligible.map((c) => c.configId)).toEqual(['low', 'moderate'])
  })

  it("filters on effectiveComplexity, not the spirit's printed base", () => {
    // An aspect that drops complexity down should be eligible even though its base spirit isn't.
    const spreadOut: Configuration = {
      configId: 'very-high::Eased',
      spirit: spirit('very-high', 'Very High'),
      isBase: false,
      effectiveComplexity: 'Low',
      personalEffectiveComplexity: 'Low',
    }
    const eligible = eligiblePool([...pool, spreadOut], { complexityCeiling: 'Low' })
    expect(eligible.map((c) => c.configId)).toEqual(['low', 'very-high::Eased'])
  })
})

describe('drawRandom', () => {
  it('draws uniformly from the eligible pool using an injectable random source', () => {
    expect(drawRandom(pool, {}, () => 0)?.configId).toBe('low')
    expect(drawRandom(pool, {}, () => 0.99)?.configId).toBe('very-high')
  })

  it('never draws a configuration excluded by the constraint', () => {
    const drawn = drawRandom(pool, { complexityCeiling: 'Low' }, () => 0.99)
    expect(drawn?.configId).toBe('low')
  })

  it('returns undefined when the constrained pool is empty', () => {
    const empty = eligiblePool([config('only-very-high', 'Very High')], { complexityCeiling: 'Low' })
    expect(empty).toHaveLength(0)
    expect(drawRandom(empty)).toBeUndefined()
  })
})
