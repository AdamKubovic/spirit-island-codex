import { describe, expect, it } from 'vitest'
import { browsePowerCards } from '../browsePowerCards'
import type { PowerCard } from '../types'

function card(overrides: Partial<PowerCard> & Pick<PowerCard, 'name' | 'cost'>): PowerCard {
  return { kind: 'minor', expansion: 'Basegame', speed: 'Fast', elements: [], image: 'x', ...overrides } as PowerCard
}

// A filterable, sortable, groupable set: names out of order, a name that a filter can drop, and
// a cost tie so sort stability is observable inside a group.
const cheap = card({ name: 'Cheap', cost: 0 })
const b = card({ name: 'B', cost: 1 })
const z = card({ name: 'Z', cost: 1 })
const pricey = card({ name: 'Pricey', cost: 4 })
const CARDS = [b, pricey, cheap, z]

describe('browsePowerCards', () => {
  it('composes filter → sort when grouping is off', () => {
    const result = browsePowerCards(CARDS, { elements: [], kinds: [], maxCost: 1 }, 'cost-asc', 'none')
    // filter keeps cost ≤ 1 (Cheap, B, Z); sort cost-asc keeps the cost-1 tie in deck order.
    expect(result.cards.map((c) => c.name)).toEqual(['Cheap', 'B', 'Z'])
    expect(result.groups).toBeNull()
  })

  it('composes filter → sort → group; sorted order survives inside the groups', () => {
    const result = browsePowerCards(CARDS, { elements: [], kinds: [] }, 'cost-asc', 'cost')
    expect(result.groups?.map((g) => g.label)).toEqual(['Cost 0', 'Cost 1', 'Cost 4'])
    expect(result.groups?.[1].cards.map((c) => c.name)).toEqual(['B', 'Z'])
  })

  it('sorts by name without grouping', () => {
    const result = browsePowerCards(CARDS, { elements: [], kinds: [] }, 'name-asc', 'none')
    expect(result.cards.map((c) => c.name)).toEqual(['B', 'Cheap', 'Pricey', 'Z'])
  })

  it('does not mutate the input', () => {
    const input = [...CARDS]
    browsePowerCards(input, { elements: [], kinds: [] }, 'cost-desc', 'none')
    expect(input).toEqual(CARDS)
  })
})
