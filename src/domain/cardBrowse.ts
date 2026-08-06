import { EXPANSIONS } from './types'

/** Shared internals of the card browse pipelines — the blocks the power and other-card modules
 * used to copy from each other live here once. */

/** Case-insensitive substring match against a card name; an empty filter matches everything.
 * The name-match block the two filters used to hand-roll. */
export function matchName(name: string | undefined, cardName: string): boolean {
  const needle = name?.trim().toLowerCase()
  if (!needle) return true
  return cardName.toLowerCase().includes(needle)
}

/** Groups items by their expansion string, canonical `EXPANSIONS` first, then any raw string
 * outside the canonical set under its own label — never dropped. The near-verbatim block
 * `groupPowerCards` and `groupOtherCards` both hand-rolled. */
export function groupByExpansion<T extends { expansion: string }>(items: T[]): { label: string; cards: T[] }[] {
  const byExpansion = new Map<string, T[]>()
  for (const card of items) {
    const bucket = byExpansion.get(card.expansion)
    if (bucket) bucket.push(card)
    else byExpansion.set(card.expansion, [card])
  }
  const canonicalSet: ReadonlySet<string> = new Set(EXPANSIONS)
  const canonical = EXPANSIONS.filter((exp) => byExpansion.has(exp)).map((exp) => ({
    label: exp,
    cards: byExpansion.get(exp)!,
  }))
  const raw = [...byExpansion.keys()]
    .filter((label) => !canonicalSet.has(label))
    .map((label) => ({ label, cards: byExpansion.get(label)! }))
  return [...canonical, ...raw]
}
