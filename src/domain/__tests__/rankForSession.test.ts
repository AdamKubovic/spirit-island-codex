import { describe, expect, it } from 'vitest'
import { createCollectionStore } from '../collectionStore'
import { rankForSession, SHORTLIST_SIZE } from '../rankForSession'
import { memoryStorage } from '../storage'
import { createTierStore } from '../tierStore'

function session(overrides: Partial<Parameters<typeof rankForSession>[0]> = {}) {
  const tierStore = createTierStore(memoryStorage())
  return rankForSession({
    answers: {},
    complexityOverrides: {},
    excluded: new Set(),
    timesPlayed: {},
    tierPrior: tierStore.getRankPrior(),
    teamIds: [],
    tuned: false,
    wildcardOffset: 0,
    hardFilter: false,
    ...overrides,
  })
}

describe('rankForSession', () => {
  it('returns a shortlist of exactly SHORTLIST_SIZE, plus a wildcard outside it', () => {
    const { ranked, shortlist, wildcard } = session()
    expect(shortlist).toHaveLength(SHORTLIST_SIZE)
    expect(wildcard).toBeDefined()
    const topIds = new Set(shortlist.map((r) => r.config.configId))
    expect(topIds.has(wildcard!.configId)).toBe(false)
    expect(shortlist).toEqual(ranked.slice(0, SHORTLIST_SIZE))
  })

  it('is deterministic across repeated calls with the same inputs', () => {
    const a = session()
    const b = session()
    expect(a.shortlist.map((r) => [r.config.configId, r.score])).toEqual(
      b.shortlist.map((r) => [r.config.configId, r.score]),
    )
    expect(a.wildcard?.configId).toBe(b.wildcard?.configId)
  })

  it('hard-filters the candidate pool by collection: an unowned configuration never ranks', () => {
    const store = createCollectionStore(memoryStorage())
    store.setOwned('Jagged Earth', false)
    const result = session({ excluded: new Set(store.getExcluded()), hardFilter: true })
    const shown = [...result.shortlist.map((r) => r.config), ...(result.wildcard ? [result.wildcard] : [])]
    for (const config of shown) {
      expect(config.spirit.expansion, config.configId).not.toBe('Jagged Earth')
    }
  })

  it('tuning toward a team\'s role gaps changes the weights from untuned', () => {
    const untuned = session({})
    const tuned = session({ teamIds: ['lightnings-swift-strike'], tuned: true })
    expect(tuned.weights).not.toEqual(untuned.weights)
  })

  it('a wildcard offset cycles the wildcard deterministically', () => {
    const first = session({ wildcardOffset: 0 })
    const second = session({ wildcardOffset: 1 })
    expect(new Set([first.wildcard?.configId, second.wildcard?.configId]).size).toBeGreaterThan(1)
  })

  it('complexity overrides change the personal reading without changing the spirit pool', () => {
    const base = session({})
    const overridden = session({ complexityOverrides: { 'lightnings-swift-strike': 'Very High' } })
    // The spirit pool is identical — overrides never add or remove configurations.
    expect(new Set(overridden.ranked.map((r) => r.config.spirit.id))).toEqual(
      new Set(base.ranked.map((r) => r.config.spirit.id)),
    )
    // …but the overridden spirit's personal reading now reflects the override.
    const lightning = overridden.ranked.find((r) => r.config.spirit.id === 'lightnings-swift-strike')
    expect(lightning?.config.personalEffectiveComplexity).toBe('Very High')
  })
})
