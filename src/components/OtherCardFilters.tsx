import { BLIGHT_TAGS, EVENT_CLASSES, FEAR_TAGS, type BlightTag, type FearTag } from '../domain/types'
import type { OtherCardFilterState } from '../domain/otherCardFilter'
import { subtypeLabel } from './tagColors'
import { Term } from './Term'

type Segment = 'Fear' | 'Events' | 'Blight'

/** v4 #13: the fear/event/blight filter bar — only the controls their fields can support
 * (expansion, sub-type). No elements/cost/speed controls, since #01 found these cards don't carry
 * those fields; `OtherCardFilterState` has no fields for them, so there is nothing to wire up. No
 * kind control (v5 #01) — the segmented switch above already picks the kind.
 *
 * The sub-type control itself differs per segment (v5 #02/#03: "a fear bucket is not a blight
 * bucket") - fear and blight get a multi-select of their own tag set plus an explicit
 * "Unclassified" option; events get a single-select of their one upstream class. Expansion is a
 * multi-select of chips, OR within the list (a card has exactly one expansion). Blight's tags are
 * judgment (`tagsSource: 'judgment'`); the label's Term popover carries that provenance. */
export function OtherCardFilters({
  segment,
  filter,
  onChange,
  expansions,
}: {
  segment: Segment
  filter: OtherCardFilterState
  onChange: (filter: OtherCardFilterState) => void
  expansions: string[]
}) {
  const isCleared =
    !filter.expansions?.length && !filter.eventClass && !filter.fearTags?.length && !filter.blightTags?.length && !filter.name

  function toggleFearTag(tag: FearTag | 'unclassified') {
    const has = filter.fearTags?.includes(tag) ?? false
    onChange({ ...filter, fearTags: has ? filter.fearTags!.filter((t) => t !== tag) : [...(filter.fearTags ?? []), tag] })
  }

  function toggleBlightTag(tag: BlightTag | 'unclassified') {
    const has = filter.blightTags?.includes(tag) ?? false
    onChange({ ...filter, blightTags: has ? filter.blightTags!.filter((t) => t !== tag) : [...(filter.blightTags ?? []), tag] })
  }

  function toggleExpansion(exp: string) {
    const has = filter.expansions?.includes(exp) ?? false
    onChange({
      ...filter,
      expansions: has ? (filter.expansions ?? []).filter((e) => e !== exp) : [...(filter.expansions ?? []), exp],
    })
  }

  return (
    <div className="card-filters">
      <div className="card-filters-row">
        <label className="search-field-label">
          Search by name
          <span className="search-field">
            <input
              type="text"
              value={filter.name ?? ''}
              onChange={(e) => onChange({ ...filter, name: e.target.value || undefined })}
              placeholder="Card name…"
            />
          </span>
        </label>
      </div>
      {segment === 'Fear' && (
        <div className="card-filters-row">
          <span className="card-filters-label">
            <Term id="subtype">Sub-type</Term>
          </span>
          <div className="card-filters-kinds">
            {[...FEAR_TAGS].sort().map((tag) => (
              <button key={tag} type="button" aria-pressed={filter.fearTags?.includes(tag) ?? false} onClick={() => toggleFearTag(tag)}>
                {subtypeLabel(tag)}
              </button>
            ))}
            <button type="button" aria-pressed={filter.fearTags?.includes('unclassified') ?? false} onClick={() => toggleFearTag('unclassified')}>
              Unclassified
            </button>
          </div>
        </div>
      )}

      {segment === 'Blight' && (
        <div className="card-filters-row">
          <span className="card-filters-label">
            <Term id="subtype">Sub-type</Term>
          </span>
          <div className="card-filters-kinds">
            {[...BLIGHT_TAGS].sort().map((tag) => (
              <button key={tag} type="button" aria-pressed={filter.blightTags?.includes(tag) ?? false} onClick={() => toggleBlightTag(tag)}>
                {subtypeLabel(tag)}
              </button>
            ))}
            <button type="button" aria-pressed={filter.blightTags?.includes('unclassified') ?? false} onClick={() => toggleBlightTag('unclassified')}>
              Unclassified
            </button>
          </div>
        </div>
      )}

      {segment === 'Events' && (
        <div className="card-filters-row">
          <span className="card-filters-label">
            <Term id="subtype">Sub-type</Term>
          </span>
          <div className="card-filters-kinds">
            {[...EVENT_CLASSES].sort().map((cls) => (
              <button
                key={cls}
                type="button"
                aria-pressed={filter.eventClass === cls}
                onClick={() => onChange({ ...filter, eventClass: filter.eventClass === cls ? undefined : cls })}
              >
                {subtypeLabel(cls)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card-filters-row">
        <span className="card-filters-label">Expansion</span>
        <div className="card-filters-kinds">
          {expansions.map((exp) => (
            <button key={exp} type="button" aria-pressed={filter.expansions?.includes(exp) ?? false} onClick={() => toggleExpansion(exp)}>
              {exp}
            </button>
          ))}
        </div>
        <button type="button" className="card-filters-clear" disabled={isCleared} onClick={() => onChange({})}>
          Clear filters
        </button>
      </div>
    </div>
  )
}
