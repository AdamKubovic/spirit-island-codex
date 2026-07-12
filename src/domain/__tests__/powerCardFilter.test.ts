import { describe, expect, it } from 'vitest'
import { EMPTY_POWER_CARD_FILTER, filterPowerCards, type PowerCardFilterState } from '../powerCardFilter'
import type { PowerCard } from '../types'

function card(overrides: Partial<PowerCard> & Pick<PowerCard, 'name' | 'kind'>): PowerCard {
  return {
    expansion: 'Basegame',
    cost: 1,
    speed: 'Fast',
    elements: [],
    image: 'cards/minor/x.webp',
    ...overrides,
  } as PowerCard
}

const fireOnly = card({ name: 'Fire Only', kind: 'minor', elements: ['Fire'], cost: 1, speed: 'Fast', expansion: 'Basegame' })
const sunOnly = card({ name: 'Sun Only', kind: 'minor', elements: ['Sun'], cost: 2, speed: 'Slow', expansion: 'Basegame' })
const fireAndSun = card({ name: 'Fire And Sun', kind: 'major', elements: ['Fire', 'Sun'], cost: 3, speed: 'Fast', expansion: 'Jagged Earth' })
const fireSunAndAir = card({
  name: 'Fire Sun Air',
  kind: 'unique',
  spirit: 'lightnings-swift-strike',
  spiritName: "Lightning's Swift Strike",
  elements: ['Fire', 'Sun', 'Air'],
  cost: 0,
  speed: 'Slow',
  expansion: 'Branch & Claw',
} as PowerCard)

const CARDS = [fireOnly, sunOnly, fireAndSun, fireSunAndAir]

describe('filterPowerCards', () => {
  it('returns everything for the empty filter', () => {
    expect(filterPowerCards(CARDS, EMPTY_POWER_CARD_FILTER)).toEqual(CARDS)
  })

  it('elements: a single selected element matches any card carrying it', () => {
    const result = filterPowerCards(CARDS, { ...EMPTY_POWER_CARD_FILTER, elements: ['Fire'] })
    expect(result.map((c) => c.name)).toEqual(['Fire Only', 'Fire And Sun', 'Fire Sun Air'])
  })

  it('elements: two selected elements require BOTH, not either (AND, not OR) — the semantics v4 #03 pinned', () => {
    const result = filterPowerCards(CARDS, { ...EMPTY_POWER_CARD_FILTER, elements: ['Fire', 'Sun'] })
    expect(result.map((c) => c.name)).toEqual(['Fire And Sun', 'Fire Sun Air'])
    // Fire Only and Sun Only each carry one of the two but not both — must not match.
    expect(result).not.toContainEqual(fireOnly)
    expect(result).not.toContainEqual(sunOnly)
  })

  it('elements: a selected set is a floor — a card with extra elements beyond the selection still matches', () => {
    const result = filterPowerCards(CARDS, { ...EMPTY_POWER_CARD_FILTER, elements: ['Fire', 'Sun'] })
    expect(result.map((c) => c.name)).toContain('Fire Sun Air')
  })

  it('maxCost narrows to cards at or under the ceiling', () => {
    const result = filterPowerCards(CARDS, { ...EMPTY_POWER_CARD_FILTER, maxCost: 1 })
    expect(result.map((c) => c.name)).toEqual(['Fire Only', 'Fire Sun Air'])
  })

  it('speed narrows to an exact match', () => {
    const result = filterPowerCards(CARDS, { ...EMPTY_POWER_CARD_FILTER, speed: 'Slow' })
    expect(result.map((c) => c.name)).toEqual(['Sun Only', 'Fire Sun Air'])
  })

  it('kinds: multiple selections are OR (a card is only ever one kind)', () => {
    const result = filterPowerCards(CARDS, { ...EMPTY_POWER_CARD_FILTER, kinds: ['minor', 'major'] })
    expect(result.map((c) => c.name)).toEqual(['Fire Only', 'Sun Only', 'Fire And Sun'])
  })

  it('expansion narrows to an exact match', () => {
    const result = filterPowerCards(CARDS, { ...EMPTY_POWER_CARD_FILTER, expansion: 'Jagged Earth' })
    expect(result.map((c) => c.name)).toEqual(['Fire And Sun'])
  })

  it('combines every control by AND, narrowing rather than replacing', () => {
    const filter: PowerCardFilterState = { elements: ['Fire'], maxCost: 1, speed: 'Fast', kinds: ['minor'] }
    expect(filterPowerCards(CARDS, filter).map((c) => c.name)).toEqual(['Fire Only'])
  })

  it('a filter can match nothing', () => {
    const filter: PowerCardFilterState = { elements: ['Fire', 'Sun'], speed: 'Slow', kinds: ['minor'] }
    expect(filterPowerCards(CARDS, filter)).toEqual([])
  })

  it('a filter on a value no card in the set has (e.g. an expansion none of them are from) matches nothing, not everything', () => {
    const result = filterPowerCards(CARDS, { ...EMPTY_POWER_CARD_FILTER, expansion: 'Nature Incarnate' })
    expect(result).toEqual([])
  })
})
