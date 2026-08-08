import { useMemo, useState } from 'react'
import { ADVERSARIES } from '../domain/adversaries'
import otherCardsData from '../data/other-cards.json'
import powerCardsData from '../data/power-cards.json'
import { browseOtherCards } from '../domain/browseOtherCards'
import { browsePowerCards } from '../domain/browsePowerCards'
import { EMPTY_OTHER_CARD_FILTER, type OtherCardFilterState } from '../domain/otherCardFilter'
import type { OtherCardGroup, OtherGroup } from '../domain/otherCardArrange'
import { EMPTY_POWER_CARD_FILTER, type PowerCardFilterState } from '../domain/powerCardFilter'
import type { PowerGroup, PowerSort } from '../domain/powerCardArrange'
import { SCENARIOS } from '../domain/scenarios'
import type { OtherCard, PowerCard } from '../domain/types'
import { SEGMENT_WIKI, wikiLink } from '../domain/wiki'
import { subtypeGroupLabel } from './tagColors'
import { AdversaryGrid } from './AdversaryGrid'
import { AdversaryRows } from './AdversaryRows'
import { CardFilters } from './CardFilters'
import { CardGrid } from './CardGrid'
import { CardRows } from './CardRows'
import { OtherCardFilters } from './OtherCardFilters'
import { OtherCardRows } from './OtherCardRows'
import { ScenarioGrid } from './ScenarioGrid'
import { ScenarioRows } from './ScenarioRows'

const powerCards = powerCardsData as PowerCard[]
const otherCards = otherCardsData as OtherCard[]
const POWER_EXPANSIONS = [...new Set(powerCards.map((c) => c.expansion))].sort()
const ADVERSARY_EXPANSIONS = [...new Set(ADVERSARIES.map((a) => a.expansion))].sort()

const SEGMENTS = ['Powers', 'Fear', 'Events', 'Blight', 'Adversaries', 'Scenarios'] as const
type Segment = (typeof SEGMENTS)[number]

const OTHER_KIND_BY_SEGMENT: Record<'Fear' | 'Events' | 'Blight', OtherCard['kind']> = {
  Fear: 'fear',
  Events: 'event',
  Blight: 'blight',
}

const SEGMENT_LABEL: Record<Segment, string> = {
  Powers: 'power cards',
  Fear: 'fear cards',
  Events: 'event cards',
  Blight: 'blight cards',
  Adversaries: 'adversaries',
  Scenarios: 'scenarios',
}

function isOtherSegment(segment: Segment): segment is 'Fear' | 'Events' | 'Blight' {
  return segment === 'Fear' || segment === 'Events' || segment === 'Blight'
}

/** The group header for a fear/event/blight group: the domain hands back raw subtype keys, so
 * the human label and blight's "(judgment)" provenance note are applied here at render time. */
function otherGroupTitle(group: OtherCardGroup, kind: OtherCard['kind']): string {
  const suffix = kind === 'blight' ? ' (judgment)' : ''
  if (group.subtype !== undefined) return `${subtypeGroupLabel(group.subtype)}${suffix}`
  if (group.label === 'unclassified') return `Unclassified${suffix}`
  return group.label
}

type View = 'grid' | 'rows'

/** v4 #11/#12/#13, v5 #05a/#05b: the Archive — all 471 cards plus the 8 adversaries and 16
 * scenarios, filterable per #03's spec. A segmented switch swaps the control set rather than
 * showing dead controls for fields a segment doesn't have (#01 found fear/event/blight carry no
 * elements/cost/speed; #05b found scenarios carry no expansion at all). Both v4 #04 result shapes
 * ship within each segment, switchable, per #04's "not on this map" for a detail view. */
export function CardsTab() {
  const [segment, setSegment] = useState<Segment>('Powers')
  const [view, setView] = useState<View>('grid')
  const [powerFilter, setPowerFilter] = useState<PowerCardFilterState>(EMPTY_POWER_CARD_FILTER)
  const [powerSort, setPowerSort] = useState<PowerSort>('none')
  const [powerGroup, setPowerGroup] = useState<PowerGroup>('none')
  const [otherFilter, setOtherFilter] = useState<OtherCardFilterState>(EMPTY_OTHER_CARD_FILTER)
  const [otherGroup, setOtherGroup] = useState<OtherGroup>('none')
  const [adversaryExpansion, setAdversaryExpansion] = useState<string>('')

  // phase-4 #19: the Powers pipeline is filter → sort → group, composed in the domain module
  // (`browsePowerCards`); the locked call keeps every other segment's ordering untouched (their
  // data can't support more).
  const powerResult = useMemo(
    () => browsePowerCards(powerCards, powerFilter, powerSort, powerGroup),
    [powerFilter, powerSort, powerGroup],
  )
  const shownPowerCards = powerResult.cards
  const powerGroups = powerResult.groups

  // The fear/event/blight pipeline slices to the segment's kind, then filter → group
  // (`browseOtherCards`); the filter control's expansion options read the pre-filter slice.
  const otherResult = useMemo(
    () => (isOtherSegment(segment) ? browseOtherCards(otherCards, OTHER_KIND_BY_SEGMENT[segment], otherFilter, otherGroup) : null),
    [segment, otherFilter, otherGroup],
  )
  const segmentOtherCards = otherResult?.segmented ?? []
  const shownOtherCards = otherResult?.cards ?? []
  const otherGroups = otherResult?.groups ?? null
  const otherExpansions = useMemo(
    () => (otherResult ? [...new Set(otherResult.segmented.map((c) => c.expansion))].sort() : []),
    [otherResult],
  )

  const shownAdversaries = useMemo(
    () => (adversaryExpansion ? ADVERSARIES.filter((a) => a.expansion === adversaryExpansion) : ADVERSARIES),
    [adversaryExpansion],
  )

  function selectSegment(next: Segment) {
    setSegment(next)
    setOtherFilter(EMPTY_OTHER_CARD_FILTER)
    setOtherGroup('none')
    setAdversaryExpansion('')
  }

  // Only Powers/Fear/Events/Blight share the {name, image} shape CardGrid/CardRows take -
  // Adversaries and Scenarios render through their own components below, so this stays narrowly
  // typed as PowerCard[] | OtherCard[] rather than widening to a union that needs an unsafe cast.
  const shownCards = segment === 'Powers' ? shownPowerCards : shownOtherCards
  const shownCount =
    segment === 'Powers' ? shownPowerCards.length : isOtherSegment(segment) ? shownOtherCards.length : segment === 'Adversaries' ? shownAdversaries.length : SCENARIOS.length
  const total =
    segment === 'Powers' ? powerCards.length : isOtherSegment(segment) ? segmentOtherCards.length : segment === 'Adversaries' ? ADVERSARIES.length : SCENARIOS.length

  return (
    <section>
      <h2>Archive</h2>
      <div className="card-view-switch" role="group" aria-label="Card type">
        {SEGMENTS.map((s) => (
          <button key={s} type="button" aria-pressed={segment === s} onClick={() => selectSegment(s)}>
            {s}
          </button>
        ))}
      </div>
      <p className="meta">
        Full catalog on the{' '}
        <a href={wikiLink(SEGMENT_WIKI[segment])} target="_blank" rel="noreferrer">
          Spirit Island Wiki ↗
        </a>
      </p>

      {segment === 'Powers' && (
        <>
          <CardFilters filter={powerFilter} onChange={setPowerFilter} expansions={POWER_EXPANSIONS} />
          <div className="card-filters-row filters">
            <label>
              Sort
              <select value={powerSort} onChange={(e) => setPowerSort(e.target.value as PowerSort)}>
                <option value="none">Deck order</option>
                <option value="cost-asc">Cost (low → high)</option>
                <option value="cost-desc">Cost (high → low)</option>
                <option value="name-asc">Name (A → Z)</option>
                <option value="name-desc">Name (Z → A)</option>
              </select>
            </label>
            <label>
              Group by
              <select value={powerGroup} onChange={(e) => setPowerGroup(e.target.value as PowerGroup)}>
                <option value="none">No grouping</option>
                <option value="cost">Cost</option>
                <option value="speed">Speed</option>
                <option value="element">Element</option>
                <option value="expansion">Expansion</option>
                <option value="type">Type</option>
              </select>
            </label>
          </div>
        </>
      )}
      {isOtherSegment(segment) && (
        <>
          <OtherCardFilters segment={segment} filter={otherFilter} onChange={setOtherFilter} expansions={otherExpansions} />
          <div className="card-filters-row filters">
            <label>
              Group by
              <select value={otherGroup} onChange={(e) => setOtherGroup(e.target.value as OtherGroup)}>
                <option value="none">No grouping</option>
                <option value="expansion">Expansion</option>
                <option value="subtype">Subtype</option>
              </select>
            </label>
          </div>
        </>
      )}
      {segment === 'Adversaries' && (
        <div className="card-filters">
          <div className="card-filters-row filters">
            <label>
              Expansion
              <select value={adversaryExpansion} onChange={(e) => setAdversaryExpansion(e.target.value)}>
                <option value="">Any</option>
                {ADVERSARY_EXPANSIONS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" disabled={!adversaryExpansion} onClick={() => setAdversaryExpansion('')}>
              Clear filters
            </button>
          </div>
        </div>
      )}

      <div className="card-view-switch" role="group" aria-label="Card view">
        <button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')}>
          Grid
        </button>
        <button type="button" aria-pressed={view === 'rows'} onClick={() => setView('rows')}>
          Rows
        </button>
      </div>
      <p>
        {shownCount} of {total} {SEGMENT_LABEL[segment]}
      </p>
      {segment === 'Adversaries' ? (
        view === 'grid' ? (
          <AdversaryGrid adversaries={shownAdversaries} />
        ) : (
          <AdversaryRows adversaries={shownAdversaries} />
        )
      ) : segment === 'Scenarios' ? (
        view === 'grid' ? (
          <ScenarioGrid />
        ) : (
          <ScenarioRows scenarios={SCENARIOS} />
        )
      ) : segment === 'Powers' && powerGroups ? (
        powerGroups.map((group) => (
          <section key={group.label} className="card-group">
            <h3>{group.label}</h3>
            {view === 'grid' ? <CardGrid cards={group.cards} /> : <CardRows cards={group.cards} />}
          </section>
        ))
      ) : isOtherSegment(segment) && otherGroups ? (
        otherGroups.map((group) => (
          <section key={group.label} className="card-group">
            <h3>{otherGroupTitle(group, OTHER_KIND_BY_SEGMENT[segment])}</h3>
            {view === 'grid' ? <CardGrid cards={group.cards} /> : <OtherCardRows cards={group.cards} />}
          </section>
        ))
      ) : view === 'grid' ? (
        <CardGrid cards={shownCards} />
      ) : segment === 'Powers' ? (
        <CardRows cards={shownPowerCards} />
      ) : (
        <OtherCardRows cards={shownOtherCards} />
      )}
    </section>
  )
}
