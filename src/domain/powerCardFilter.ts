import type { Element, PowerCard } from './types'

/**
 * `elements`: AND, not OR — a selected set is a floor. A card matches if it carries every
 * selected element (it may carry more). Empty = no element filter. Owner's call (v4 #03):
 * picking Fire + Sun narrows to cards with both, not cards with either.
 *
 * Every other field composes with elements and with each other by AND (narrows the result),
 * except `kinds`, where multiple selections are OR — a card can only ever be one kind, so
 * selecting minor + major means "show either," never an impossible intersection.
 */
export interface PowerCardFilterState {
  elements: Element[]
  /** Card must cost at most this. undefined = no ceiling. */
  maxCost?: number
  speed?: PowerCard['speed']
  /** OR within this list. Empty = every kind. */
  kinds: PowerCard['kind'][]
  expansion?: string
}

export const EMPTY_POWER_CARD_FILTER: PowerCardFilterState = { elements: [], kinds: [] }

export function filterPowerCards(cards: PowerCard[], filter: PowerCardFilterState): PowerCard[] {
  return cards.filter((card) => {
    if (filter.elements.length > 0 && !filter.elements.every((e) => card.elements.includes(e))) return false
    if (filter.maxCost !== undefined && card.cost > filter.maxCost) return false
    if (filter.speed && card.speed !== filter.speed) return false
    if (filter.kinds.length > 0 && !filter.kinds.includes(card.kind)) return false
    if (filter.expansion && card.expansion !== filter.expansion) return false
    return true
  })
}
