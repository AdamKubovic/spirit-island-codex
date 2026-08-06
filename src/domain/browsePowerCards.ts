import { filterPowerCards, type PowerCardFilterState } from './powerCardFilter'
import { groupPowerCards, sortPowerCards, type PowerCardGroup, type PowerGroup, type PowerSort } from './powerCardArrange'
import type { PowerCard } from './types'

export interface BrowsePowerCardsResult {
  /** The flat list after filter → sort (what the ungrouped grid/rows render). */
  cards: PowerCard[]
  /** Null when grouping is off; the filter → sort → group composition otherwise. */
  groups: PowerCardGroup[] | null
}

/** The Archive Powers pipeline — filter → sort → group, composed once here so CardsTab keeps
 * state and rendering and calls this instead of wiring the sequence in its own memo chains. */
export function browsePowerCards(
  cards: PowerCard[],
  filter: PowerCardFilterState,
  sort: PowerSort,
  group: PowerGroup,
): BrowsePowerCardsResult {
  const shown = sortPowerCards(filterPowerCards(cards, filter), sort)
  return group === 'none' ? { cards: shown, groups: null } : { cards: shown, groups: groupPowerCards(shown, group) }
}
