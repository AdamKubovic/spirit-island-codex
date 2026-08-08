import { describe, expect, it } from 'vitest'
import { browseOtherCards } from '../browseOtherCards'
import type { OtherCard } from '../types'

function fearCard(overrides: Partial<Extract<OtherCard, { kind: 'fear' }>> & Pick<OtherCard, 'name'>): OtherCard {
  return { kind: 'fear', expansion: 'Base', image: 'x', tags: [], ...overrides } as OtherCard
}

function blightCard(overrides: Partial<Extract<OtherCard, { kind: 'blight' }>> & Pick<OtherCard, 'name'>): OtherCard {
  return {
    kind: 'blight',
    expansion: 'Base',
    image: 'x',
    tags: [],
    tagsSource: 'judgment',
    ...overrides,
  } as OtherCard
}

function eventCard(overrides: Partial<Extract<OtherCard, { kind: 'event' }>> & Pick<OtherCard, 'name'>): OtherCard {
  return { kind: 'event', expansion: 'Base', image: 'x', eventClass: 'choice', ...overrides } as OtherCard
}

// Mixed kinds: the pipeline must slice to exactly one kind before filtering or grouping.
const fearA = fearCard({ name: 'Fear A', expansion: 'Base', tags: ['removal'] })
const fearB = fearCard({ name: 'Fear B', expansion: 'Jagged Earth', tags: ['weaken'] })
const fearUntagged = fearCard({ name: 'Fear C', expansion: 'Base', tags: [] })
const blightX = blightCard({ name: 'Blight X', expansion: 'Base', tags: ['presenceLoss'] })
const eventY = eventCard({ name: 'Event Y', expansion: 'Base', eventClass: 'stage' })
const CARDS = [fearA, blightX, eventY, fearB, fearUntagged]

describe('browseOtherCards', () => {
  it('slices to one kind, then filters, when grouping is off', () => {
    const result = browseOtherCards(CARDS, 'fear', { expansions: ['Base'] }, 'none')
    // slice keeps the three fear cards; the Base filter drops Fear B.
    expect(result.cards.map((c) => c.name)).toEqual(['Fear A', 'Fear C'])
    expect(result.segmented.map((c) => c.name)).toEqual(['Fear A', 'Fear B', 'Fear C'])
    expect(result.groups).toBeNull()
  })

  it('composes slice → filter → group by subtype, with raw keys as labels', () => {
    const result = browseOtherCards(CARDS, 'fear', { fearTags: ['removal'] }, 'subtype')
    // slice keeps fear; the removal filter keeps only Fear A; grouping by subtype is one group.
    expect(result.groups?.map((g) => g.label)).toEqual(['removal'])
    expect(result.groups?.[0].cards.map((c) => c.name)).toEqual(['Fear A'])
  })

  it('groups unclassified fear cards into a trailing "unclassified" group', () => {
    const result = browseOtherCards([fearA, fearUntagged], 'fear', {}, 'subtype')
    expect(result.groups?.map((g) => g.label)).toEqual(['removal', 'unclassified'])
  })

  it('groups by expansion with canonical order for any single kind', () => {
    const result = browseOtherCards(CARDS, 'blight', {}, 'expansion')
    expect(result.groups?.map((g) => g.label)).toEqual(['Base'])
    expect(result.groups?.[0].cards.map((c) => c.name)).toEqual(['Blight X'])
  })

  it('an empty slice returns no groups without throwing', () => {
    const result = browseOtherCards([fearA, blightX], 'event', {}, 'subtype')
    expect(result.segmented).toEqual([])
    expect(result.groups).toEqual([])
  })
})
