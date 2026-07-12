import type { OtherCard } from '../domain/types'
import type { OtherCardFilterState } from '../domain/otherCardFilter'

const KINDS: OtherCard['kind'][] = ['fear', 'event', 'blight']

/** v4 #13: the fear/event/blight filter bar — only the controls their fields can support
 * (kind, expansion). No elements/cost/speed controls, since #01 found these cards don't carry
 * those fields; `OtherCardFilterState` has no fields for them, so there is nothing to wire up. */
export function OtherCardFilters({
  filter,
  onChange,
  expansions,
}: {
  filter: OtherCardFilterState
  onChange: (filter: OtherCardFilterState) => void
  expansions: string[]
}) {
  const isCleared = filter.kinds.length === 0 && !filter.expansion

  function toggleKind(kind: OtherCard['kind']) {
    const has = filter.kinds.includes(kind)
    onChange({ ...filter, kinds: has ? filter.kinds.filter((k) => k !== kind) : [...filter.kinds, kind] })
  }

  return (
    <div className="card-filters">
      <div className="card-filters-row">
        <span className="card-filters-label">Type</span>
        <div className="card-filters-kinds">
          {KINDS.map((kind) => (
            <button key={kind} type="button" aria-pressed={filter.kinds.includes(kind)} onClick={() => toggleKind(kind)}>
              {kind}
            </button>
          ))}
        </div>
      </div>
      <div className="card-filters-row filters">
        <label>
          Expansion
          <select value={filter.expansion ?? ''} onChange={(e) => onChange({ ...filter, expansion: e.target.value || undefined })}>
            <option value="">Any</option>
            {expansions.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
        </label>
        <button type="button" disabled={isCleared} onClick={() => onChange({ kinds: [] })}>
          Clear filters
        </button>
      </div>
    </div>
  )
}
