import { describe, expect, it } from 'vitest'
import { classValenceBreakdown, valenceBreakdown, type EventCard } from '../valenceBreakdown'

function event(name: string, valence: EventCard['valence'], eventClass: EventCard['eventClass']): EventCard {
  return { name, expansion: 'Base', kind: 'event', image: '', eventClass, valence, valenceSource: 'judgment' }
}

const CARDS: EventCard[] = [
  event('A', 'harmful', 'choice'),
  event('B', 'mixed', 'choice'),
  event('C', 'mixed', 'stage'),
  event('D', 'beneficial', 'stage'),
]

describe('valenceBreakdown', () => {
  it('gives one bucket per valence, zero-count included', () => {
    const buckets = valenceBreakdown(CARDS)
    expect(buckets.map((b) => b.valence)).toEqual(['harmful', 'mixed', 'beneficial'])
    expect(buckets.map((b) => b.cards.length)).toEqual([1, 2, 1])
  })

  it('computes each bucket\'s share of the pool', () => {
    const buckets = valenceBreakdown(CARDS)
    expect(buckets.map((b) => b.share)).toEqual([0.25, 0.5, 0.25])
  })

  it('shares are 0, never NaN, for an empty pool', () => {
    const buckets = valenceBreakdown([])
    expect(buckets.every((b) => b.share === 0)).toBe(true)
    expect(buckets.every((b) => b.cards.length === 0)).toBe(true)
  })
})

describe('classValenceBreakdown', () => {
  it('crosses each event class with valence, every card counted exactly once (single-valued)', () => {
    const groups = classValenceBreakdown(CARDS)
    const choice = groups.find((g) => g.label === 'Choice')!
    expect(choice.cards.map((c) => c.name).sort()).toEqual(['A', 'B'])
    expect(choice.byValence.find((b) => b.valence === 'harmful')!.cards.map((c) => c.name)).toEqual(['A'])
    expect(choice.byValence.find((b) => b.valence === 'mixed')!.cards.map((c) => c.name)).toEqual(['B'])

    const stage = groups.find((g) => g.label === 'Stage')!
    expect(stage.cards.map((c) => c.name).sort()).toEqual(['C', 'D'])
  })

  it('never produces an Unclassified group — every event carries exactly one class', () => {
    const groups = classValenceBreakdown(CARDS)
    expect(groups.find((g) => g.label === 'Unclassified')).toBeUndefined()
  })
})
