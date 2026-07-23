import type { OCFDU, Spirit } from './types'

// A spirit counts as "strong in" an axis at 4+ on the 1–6 OCFDU scale (owner's call, grill 2026-07-23).
export const STRONG_IN_THRESHOLD = 4

export interface BrowserFilterState {
  expansion: string
  complexity: string
  tag: string
  strongIn: '' | keyof OCFDU
  /** Case-insensitive substring match against the spirit's own name or any of its aspect names. */
  search: string
  hardFilter: boolean
}

/** Pure so #03's "combines with existing filters" and "name only" rules are unit-testable
 * without simulating a keystroke - `Browser` calls this from the same `useMemo` it always did. */
export function filterSpirits(spirits: Spirit[], filter: BrowserFilterState, excluded: ReadonlySet<string>): Spirit[] {
  const term = filter.search.trim().toLowerCase()
  return spirits.filter(
    (s) =>
      (!filter.expansion || s.expansion === filter.expansion) &&
      (!filter.complexity || s.complexity === filter.complexity) &&
      (!filter.tag || s.tags.includes(filter.tag)) &&
      (!filter.strongIn || s.ratings[filter.strongIn] >= STRONG_IN_THRESHOLD) &&
      (!filter.hardFilter || !excluded.has(s.expansion)) &&
      (!term || s.name.toLowerCase().includes(term) || s.aspects.some((a) => a.name.toLowerCase().includes(term))),
  )
}
