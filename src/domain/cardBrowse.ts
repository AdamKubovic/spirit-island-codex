import { EXPANSIONS, normalizeExpansion } from './types'

/** Shared internals of the card browse pipelines — the blocks the power and other-card modules
 * used to copy from each other live here once. */

/** Case-insensitive substring match against a card name; an empty filter matches everything.
 * The name-match block the two filters used to hand-roll. */
export function matchName(name: string | undefined, cardName: string): boolean {
  const needle = name?.trim().toLowerCase()
  if (!needle) return true
  return cardName.toLowerCase().includes(needle)
}

/** Orders a set of raw expansion strings for display: canonical `EXPANSIONS` in their own
 * (release) order first, then any raw string the aliases can't place, alphabetically. Raw
 * strings like `Basegame`/`Promo2` rank by the canonical name they resolve to, so every
 * expansion list reads in release order — the one place filter chips/selects/group headers
 * get their order from. */
export function orderExpansions(raw: Iterable<string>): string[] {
  const rank = (s: string): number => {
    const canonical = normalizeExpansion(s)
    return canonical ? EXPANSIONS.indexOf(canonical) : Number.MAX_SAFE_INTEGER
  }
  return [...new Set(raw)].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
}

/** Groups items by their expansion string, in `orderExpansions` order — canonical release
 * order first, then any raw string outside the alias table under its own label, alphabetically.
 * Never drops a label. */
export function groupByExpansion<T extends { expansion: string }>(items: T[]): { label: string; cards: T[] }[] {
  const byExpansion = new Map<string, T[]>()
  for (const card of items) {
    const bucket = byExpansion.get(card.expansion)
    if (bucket) bucket.push(card)
    else byExpansion.set(card.expansion, [card])
  }
  return orderExpansions(byExpansion.keys()).map((label) => ({ label, cards: byExpansion.get(label)! }))
}
