import { useMemo } from 'react'
import spiritsData from '../data/spirits.json'
import { groupByTier, tierStore } from '../domain/tierStore'
import { TIERS } from '../domain/types'
import type { Spirit } from '../domain/types'
import { SpiritArt } from './SpiritArt'
import { TIER_COLOR } from './tierColors'

const spirits = spiritsData as Spirit[]

/** Read-only visual tier board. Editing lives in the Customise tab. */
export function TierBoard() {
  const grouped = useMemo(() => groupByTier(spirits, tierStore.getAll()), [])
  const customised = tierStore.isCustomised()

  return (
    <section>
      <h2>Tier list</h2>
      <p>
        {customised ? 'Your customised tier list' : 'The shipped tier list'} — <strong>X</strong> is strongest,{' '}
        <strong>F</strong> weakest. This ordering feeds the recommender: the{' '}
        <em>raw power ↔ something fresh</em> slider decides how heavily a spirit's tier counts toward
        its score. Change it in the <strong>Customise tiers</strong> tab.
      </p>

      <div className="tier-board">
        {TIERS.map((tier) => (
          <div className="tier-row" key={tier}>
            <div className="tier-label" style={{ backgroundColor: TIER_COLOR[tier] }}>
              {tier}
            </div>
            <div className="tier-tiles">
              {grouped[tier].length === 0 ? (
                <p className="tier-empty">No spirits in this tier</p>
              ) : (
                grouped[tier].map((spirit) => (
                  <figure className="tier-tile" key={spirit.id} title={spirit.name}>
                    <SpiritArt spirit={spirit} className="tier-tile-art" />
                    <figcaption>{spirit.name}</figcaption>
                  </figure>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
