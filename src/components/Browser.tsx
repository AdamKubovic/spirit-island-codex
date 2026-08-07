import { useMemo, useState } from 'react'
import spiritsData from '../data/spirits.json'
import { filterSpirits } from '../domain/browserFilter'
import { collectionStore } from '../domain/collectionStore'
import { toConfigId } from '../domain/configurations'
import { resolveAspectName } from '../domain/route'
import { AXES } from '../domain/scoringPrimitives'
import { tierStore } from '../domain/tierStore'
import { EXPANSIONS as EXPANSION_ORDER, type Complexity, type OCFDU, type Spirit } from '../domain/types'
import { ManageCollectionLink } from './collectionAffordances'
import { SpiritDetail } from './SpiritDetail'
import { SpiritTile } from './SpiritTile'
import { Term } from './Term'

const spirits = spiritsData as Spirit[]

const COMPLEXITIES: Complexity[] = ['Low', 'Moderate', 'High', 'Very High']

const EXPANSIONS = [...new Set(spirits.map((s) => s.expansion))].sort()
const TAGS = [...new Set(spirits.flatMap((s) => s.tags))].sort()

// OCFDU is a filter axis, not a sort axis (nobody lands on Browse and sorts by Offense).
type SortKey = 'name' | 'tier' | 'expansion'

export function Browser({
  target,
  onOpenSpirit,
  onCloseDetail,
}: {
  /**
   * spirit-link-new-tab: which spirit's detail is open, straight off the URL — so a cold load of
   * `#/browse/:spiritId/:aspect` in a fresh tab opens the modal, and #02's Recommend→Browse deep
   * link is the same mechanism rather than a special case.
   *
   * This replaced a one-shot `initialTarget` prop plus local `selected` state. The URL is the
   * single source of truth now: there is no second copy to fall out of step with it, and no
   * "consumed" handshake to get wrong.
   */
  target?: { spiritId: string; aspectSlug?: string } | null
  /** Report a tile click upward; `App` turns it into a route change, which comes back as `target`.
   * `Browser` deliberately doesn't know the URL shape. */
  onOpenSpirit?: (spiritId: string, aspectName?: string) => void
  onCloseDetail?: () => void
} = {}) {
  const [expansion, setExpansion] = useState('')
  const [complexity, setComplexity] = useState('')
  const [tag, setTag] = useState('')
  const [strongIn, setStrongIn] = useState<'' | keyof OCFDU>('')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  // Derived from the route, not stored: an unknown id in a hand-typed or stale URL resolves to no
  // modal rather than a crash, and the aspect slug is resolved against *this spirit's* own aspects
  // (`resolveAspectName`), so a URL can never highlight an aspect the spirit doesn't have.
  const selected = target?.spiritId ? spirits.find((s) => s.id === target.spiritId) ?? null : null
  const highlightAspect = selected ? resolveAspectName(selected, target?.aspectSlug) : undefined

  // The active configurations tier list's ranks (0 strongest .. 1 weakest), keyed by configId;
  // unrated spirits are absent, so they sort last. Read once — a view preference, like the rest.
  const rankPrior = useMemo(() => tierStore.getRankPrior(), [])
  // v5 #07c: session-only, like the tier board's and the Recommender's - a view preference, not
  // collection data. #06 named Browse as a surface that respects the collection; Cards does not.
  const [hardFilter, setHardFilter] = useState(false)
  // Read once per render, not once per spirit/aspect - collectionStore.getExcluded() does a
  // storage read + JSON.parse + Set rebuild, and the earlier version called it per tile.
  const excluded = useMemo(() => new Set(collectionStore.getExcluded()), [])

  const shown = useMemo(() => {
    const filtered = filterSpirits(spirits, { expansion, complexity, tag, strongIn, search, hardFilter }, excluded)
    const byName = (a: Spirit, b: Spirit) => a.name.localeCompare(b.name)
    const order = EXPANSION_ORDER as readonly string[]
    return [...filtered].sort((a, b) => {
      if (sortKey === 'tier') {
        const ra = rankPrior[toConfigId(a.id)] ?? Infinity
        const rb = rankPrior[toConfigId(b.id)] ?? Infinity
        return ra - rb || byName(a, b)
      }
      if (sortKey === 'expansion') {
        return order.indexOf(a.expansion) - order.indexOf(b.expansion) || byName(a, b)
      }
      return byName(a, b)
    })
  }, [expansion, complexity, tag, strongIn, search, sortKey, hardFilter, excluded, rankPrior])

  return (
    <section>
      <h2>Browse spirits</h2>
      {/* Same stacked shape as Archive's CardFilters: search on its own row, selects wrapped
          in one row below. `.filters` stays as the companion class that styles label/select. */}
      <div className="card-filters">
        <div className="card-filters-row">
          <label className="search-field-label">
            Search by name
            <span className="search-field">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Spirit or aspect name…"
              />
            </span>
          </label>
        </div>
        <div className="card-filters-row filters">
          <label>
            Expansion
            <select value={expansion} onChange={(e) => setExpansion(e.target.value)}>
              <option value="">All</option>
              {EXPANSIONS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </label>
          <span className="filters-caption">
            <Term id="complexity">Complexity</Term>
          </span>
          <select aria-label="Complexity" value={complexity} onChange={(e) => setComplexity(e.target.value)}>
            <option value="">All</option>
            {COMPLEXITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label>
            Tag
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">All</option>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            Strong in
            <select value={strongIn} onChange={(e) => setStrongIn(e.target.value as '' | keyof OCFDU)}>
              <option value="">Any</option>
              {AXES.map((axis) => (
                <option key={axis} value={axis}>
                  {axis[0].toUpperCase() + axis.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sort by
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
              <option value="name">Name</option>
              <option value="tier">Tier</option>
              <option value="expansion">Expansion</option>
            </select>
          </label>
        </div>
      </div>
      <label className="deck-field-inline">
        <input type="checkbox" checked={hardFilter} onChange={(e) => setHardFilter(e.target.checked)} />
        Only show spirits I own
      </label>{' '}
      <ManageCollectionLink />

      <p>
        {shown.length} of {spirits.length} spirits
      </p>

      <ul className="spirit-grid">
        {shown.map((spirit) => (
          <SpiritTile
            key={spirit.id}
            spirit={spirit}
            onSelect={(s) => onOpenSpirit?.(s.id)}
            owned={!excluded.has(spirit.expansion)}
            excluded={excluded}
          />
        ))}
      </ul>

      {selected && (
        <SpiritDetail spirit={selected} highlightAspect={highlightAspect} onClose={() => onCloseDetail?.()} />
      )}
    </section>
  )
}
