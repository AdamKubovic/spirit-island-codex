import { useMemo, useState } from 'react'
import spiritsData from '../data/spirits.json'
import { groupByTier, tierStore } from '../domain/tierStore'
import { TIERS } from '../domain/types'
import type { Spirit, Tier } from '../domain/types'
import { SpiritArt } from './SpiritArt'
import { TIER_COLOR } from './tierColors'

const spirits = spiritsData as Spirit[]

/** Editable tier list. The read-only visual board lives in the Tier list tab. */
export function TierEditor() {
  const [version, setVersion] = useState(0)

  const grouped = useMemo(() => groupByTier(spirits, tierStore.getAll()), [version])
  const customised = tierStore.isCustomised()

  const handleSetTier = (id: string, tier: Tier) => {
    tierStore.setTier(id, tier)
    setVersion((v) => v + 1)
  }

  const handleReset = () => {
    tierStore.reset()
    setVersion((v) => v + 1)
  }

  return (
    <section>
      <h2>Customise tiers</h2>
      <p>
        Reassign any spirit. Your edits are saved in this browser and override the shipped list —
        they change how the recommender's <em>raw power</em> slider ranks spirits.
      </p>
      <p>
        <button type="button" onClick={handleReset} disabled={!customised}>
          Reset to the shipped tier list
        </button>{' '}
        {customised ? <span className="meta">You have unsaved-to-repo edits.</span> : null}
      </p>

      {TIERS.map((tier) => (
        <div key={tier}>
          <h3>
            <span className="tier-chip" style={{ backgroundColor: TIER_COLOR[tier] }}>
              {tier}
            </span>{' '}
            <span className="meta">{grouped[tier].length}</span>
          </h3>
          <ul className="spirit-grid">
            {grouped[tier].map((spirit) => (
              <li key={spirit.id} className="spirit-tile">
                <SpiritArt spirit={spirit} />
                <h4>{spirit.name}</h4>
                <label>
                  <span className="visually-hidden">Tier for {spirit.name}</span>
                  <select value={tier} onChange={(e) => handleSetTier(spirit.id, e.target.value as Tier)}>
                    {TIERS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
