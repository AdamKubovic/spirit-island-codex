import { describe, expect, it } from 'vitest'
import { EMPTY_OTHER_CARD_FILTER, filterOtherCards, type OtherCardFilterState } from '../otherCardFilter'
import type { OtherCard } from '../types'

const fear = { name: 'A Fear Card', expansion: 'Basegame', kind: 'fear', image: 'cards/fear/x.webp' } satisfies OtherCard
const event = { name: 'An Event Card', expansion: 'Branch & Claw', kind: 'event', image: 'cards/event/x.webp' } satisfies OtherCard
const blight = { name: 'A Blight Card', expansion: 'Basegame', kind: 'blight', image: 'cards/blight/x.webp' } satisfies OtherCard

const CARDS = [fear, event, blight]

describe('filterOtherCards', () => {
  it('returns everything for the empty filter', () => {
    expect(filterOtherCards(CARDS, EMPTY_OTHER_CARD_FILTER)).toEqual(CARDS)
  })

  it('kinds: multiple selections are OR', () => {
    const result = filterOtherCards(CARDS, { kinds: ['fear', 'blight'] })
    expect(result.map((c) => c.name)).toEqual(['A Fear Card', 'A Blight Card'])
  })

  it('expansion narrows to an exact match, combining with kinds by AND', () => {
    const filter: OtherCardFilterState = { kinds: ['fear', 'blight'], expansion: 'Basegame' }
    expect(filterOtherCards(CARDS, filter).map((c) => c.name)).toEqual(['A Fear Card', 'A Blight Card'])
  })

  it('a filter can match nothing', () => {
    expect(filterOtherCards(CARDS, { kinds: ['event'], expansion: 'Basegame' })).toEqual([])
  })

  // v4 #13's acceptance criterion: "the filter function's tests cover ... a filter on a field
  // that type does not have." #01 found fear/event/blight carry no elements, cost or speed —
  // OtherCardFilterState has no fields for them at all, so this is enforced at the type level:
  // `filterOtherCards(CARDS, { kinds: [], elements: ['Fire'] })` is a compile error, not a
  // runtime branch to test. The line below documents that; it would fail `tsc -b` if uncommented.
  // filterOtherCards(CARDS, { kinds: [], elements: ['Fire'] })
  it('has no field for elements/cost/speed on its filter state (compile-time enforced, asserted here in spirit)', () => {
    const filter: OtherCardFilterState = EMPTY_OTHER_CARD_FILTER
    expect('elements' in filter).toBe(false)
    expect('cost' in filter).toBe(false)
    expect('speed' in filter).toBe(false)
  })
})
