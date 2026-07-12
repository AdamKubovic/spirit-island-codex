import type { OtherCard } from './types'

/**
 * Fear/event/blight's own filter — deliberately narrower than `PowerCardFilterState`. #01 found
 * these three types carry no elements, cost or speed, so `OtherCardFilterState` has no fields for
 * them: the type system is the enforcement that "no control is ever offered for a field the
 * selected card type lacks" (v4 #13's acceptance criterion), not a runtime check.
 */
export interface OtherCardFilterState {
  /** OR within this list — a card is only ever one kind. Empty = every kind. */
  kinds: OtherCard['kind'][]
  expansion?: string
}

export const EMPTY_OTHER_CARD_FILTER: OtherCardFilterState = { kinds: [] }

export function filterOtherCards(cards: OtherCard[], filter: OtherCardFilterState): OtherCard[] {
  return cards.filter((card) => {
    if (filter.kinds.length > 0 && !filter.kinds.includes(card.kind)) return false
    if (filter.expansion && card.expansion !== filter.expansion) return false
    return true
  })
}
