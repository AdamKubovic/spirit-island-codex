import { filterOtherCards, type OtherCardFilterState } from './otherCardFilter'
import { groupOtherCards, type OtherCardGroup, type OtherGroup } from './otherCardArrange'
import type { OtherCard } from './types'

export interface BrowseOtherCardsResult {
  /** The segment slice (cards of exactly the chosen kind) before any filtering — feeds the
   * filter control's expansion options and the total count. */
  segmented: OtherCard[]
  /** The flat list after slice → filter (what the ungrouped grid/rows render). */
  cards: OtherCard[]
  /** Null when grouping is off; the slice → filter → group composition otherwise. */
  groups: OtherCardGroup[] | null
}

/** The Archive fear/event/blight pipeline — slice to one kind → filter → group, composed once
 * here so CardsTab keeps state and rendering and calls this instead of wiring the sequence in
 * its own memo chains. */
export function browseOtherCards(
  cards: OtherCard[],
  kind: OtherCard['kind'],
  filter: OtherCardFilterState,
  group: OtherGroup,
): BrowseOtherCardsResult {
  const segmented = cards.filter((c) => c.kind === kind)
  const shown = filterOtherCards(segmented, filter)
  return { segmented, cards: shown, groups: group === 'none' ? null : groupOtherCards(shown, group) }
}
