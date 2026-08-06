import { groupByExpansion } from './cardBrowse'
import { BLIGHT_TAGS, EVENT_CLASSES, FEAR_TAGS, type BlightTag, type EventClass, type FearTag, type OtherCard } from './types'

export type OtherGroup = 'none' | 'expansion' | 'subtype'

export interface OtherCardGroup {
  /** For expansion groups the canonical/raw expansion string. For subtype groups the RAW tag
   * key (e.g. `removal`) or the literal `unclassified` — the human label and the blight
   * "(judgment)" suffix are applied at render time, never decided here. */
  label: string
  /** Set when grouped by subtype — the raw fear/blight/event tag; absent for expansion groups
   * and Unclassified. */
  subtype?: FearTag | BlightTag | EventClass
  cards: OtherCard[]
}

function subtypesOf(card: OtherCard): (FearTag | BlightTag | EventClass)[] {
  return card.kind === 'event' ? [card.eventClass] : card.tags
}

/** Sibling of `powerCardArrange.ts`'s `groupPowerCards`, mirroring its conventions for the 139
 * fear/event/blight cards `PowerCard` doesn't cover. Kept in its own module so the power-only file
 * stays power-only (archive-grouping #03). */
export function groupOtherCards(cards: OtherCard[], group: Exclude<OtherGroup, 'none'>): OtherCardGroup[] {
  if (group === 'expansion') {
    return groupByExpansion(cards)
  }

  // 'subtype': fear/blight are multi-valued (the `element` pattern — a card appears under EVERY
  // tag it carries, zero-tag cards land in a trailing "Unclassified" group); event is
  // single-valued (every event carries exactly one class, so it never has an Unclassified group).
  // Precondition: `cards` is homogeneous by `kind` — the Cards tab's segmented switch (Fear |
  // Events | Blight) already isolates one kind before calling this, same assumption
  // `groupPowerCards` makes about its own input.
  const kind = cards[0]?.kind
  if (kind === undefined) return []
  const canonicalOrder: readonly (FearTag | BlightTag | EventClass)[] =
    kind === 'fear' ? FEAR_TAGS : kind === 'blight' ? BLIGHT_TAGS : EVENT_CLASSES

  const groups: OtherCardGroup[] = canonicalOrder
    .map((tag) => ({
      label: tag,
      subtype: tag,
      cards: cards.filter((c) => subtypesOf(c).includes(tag)),
    }))
    .filter((g) => g.cards.length > 0)

  const unclassified = cards.filter((c) => subtypesOf(c).length === 0)
  if (unclassified.length > 0) groups.push({ label: 'unclassified', cards: unclassified })

  return groups
}
