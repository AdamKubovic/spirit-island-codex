import { useMemo, useState } from 'react'
import powerCardsData from '../data/power-cards.json'
import { EMPTY_POWER_CARD_FILTER, filterPowerCards, type PowerCardFilterState } from '../domain/powerCardFilter'
import type { PowerCard } from '../domain/types'
import { CardFilters } from './CardFilters'
import { CardGrid } from './CardGrid'
import { CardRows } from './CardRows'

const cards = powerCardsData as PowerCard[]
const EXPANSIONS = [...new Set(cards.map((c) => c.expansion))].sort()

type View = 'grid' | 'rows'

/** v4 #11/#12: the Cards tab — all 332 power cards, filterable per #03's spec. Both v4 #04
 * result shapes ship, switchable: the image grid is how the owner recognises cards, the
 * compact rows scan fast as a data sheet. Neither replaces the other. */
export function CardsTab() {
  const [view, setView] = useState<View>('grid')
  const [filter, setFilter] = useState<PowerCardFilterState>(EMPTY_POWER_CARD_FILTER)

  const shown = useMemo(() => filterPowerCards(cards, filter), [filter])

  return (
    <section>
      <h2>Cards</h2>
      <CardFilters filter={filter} onChange={setFilter} expansions={EXPANSIONS} />
      <div className="card-view-switch" role="group" aria-label="Card view">
        <button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')}>
          Grid
        </button>
        <button type="button" aria-pressed={view === 'rows'} onClick={() => setView('rows')}>
          Rows
        </button>
      </div>
      <p>
        {shown.length} of {cards.length} power cards
      </p>
      {view === 'grid' ? <CardGrid cards={shown} /> : <CardRows cards={shown} />}
    </section>
  )
}
