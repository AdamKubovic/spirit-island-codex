import { describe, expect, it } from 'vitest'
import { recommend } from '../recommend'
import type { Spirit } from '../types'
import { selectWildcard } from '../wildcard'

function spirit(overrides: Partial<Spirit> & Pick<Spirit, 'id' | 'name'>): Spirit {
  return {
    expansion: 'Base',
    complexity: 'Low',
    ratings: { offense: 1, control: 1, fear: 1, defense: 1, utility: 1 },
    elements: [],
    summary: '',
    tags: [],
    aspects: [],
    ...overrides,
  }
}

describe('selectWildcard', () => {
  const pool: Spirit[] = [
    spirit({ id: 'top1', name: 'Top1', ratings: { offense: 6, control: 1, fear: 1, defense: 1, utility: 1 } }),
    spirit({ id: 'top2', name: 'Top2', ratings: { offense: 5, control: 1, fear: 1, defense: 1, utility: 1 } }),
    spirit({ id: 'top3', name: 'Top3', ratings: { offense: 4, control: 1, fear: 1, defense: 1, utility: 1 } }),
    spirit({
      id: 'over-cap',
      name: 'OverCap',
      complexity: 'Very High',
      ratings: { offense: 3, control: 1, fear: 1, defense: 1, utility: 1 },
    }),
    spirit({
      id: 'off-profile-utility',
      name: 'OffProfileUtility',
      ratings: { offense: 1, control: 1, fear: 1, defense: 1, utility: 6 },
    }),
  ]
  const weights = { offense: 1 }

  it('never picks a spirit already in the top-3', () => {
    const ranked = recommend(pool, weights)
    const wildcard = selectWildcard(ranked, weights, undefined)
    const top3Ids = ranked.slice(0, 3).map((r) => r.spirit.id)
    expect(top3Ids).not.toContain(wildcard!.id)
  })

  it('prefers an above-complexity-cap spirit when one exists among the remainder', () => {
    const ranked = recommend(pool, weights)
    const wildcard = selectWildcard(ranked, weights, 'Moderate')
    expect(wildcard!.id).toBe('over-cap')
  })

  it('falls back to the best off-profile pick on the least-weighted axis', () => {
    const ranked = recommend(pool, weights)
    const wildcard = selectWildcard(ranked, weights, undefined)
    expect(wildcard!.id).toBe('off-profile-utility')
  })

  it('cycles through candidates via offset (for reroll)', () => {
    const ranked = recommend(pool, weights)
    const first = selectWildcard(ranked, weights, undefined, 0)
    const second = selectWildcard(ranked, weights, undefined, 1)
    expect(first!.id).not.toBe(second!.id)
  })
})
