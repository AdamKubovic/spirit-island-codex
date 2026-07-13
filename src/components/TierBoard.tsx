import { useState, type ReactNode } from 'react'
import spiritsData from '../data/spirits.json'
import { collectionStore, filterOwnedConfigurations, isConfigurationOwned } from '../domain/collectionStore'
import { expand, type Configuration } from '../domain/configurations'
import { groupByTier, tierStore } from '../domain/tierStore'
import type { Spirit } from '../domain/types'
import { SpiritArt } from './SpiritArt'
import { tierColor } from './tierColors'
import { TierListControls } from './TierListControls'

const spirits = spiritsData as Spirit[]
const configurations = expand(spirits)

/** Edit-mode controls for one tile (#15): reassign its tier, or send it to Unrated. Rendered
 * only when the active list is personal — the store refuses cited edits, the UI never offers
 * them. Note for #17: while edit mode is active it owns tile interaction; the view-mode
 * click-to-detail behaviour must never fire during editing. */
function TierTileEdit({
  config,
  current,
  labels,
  onAssign,
}: {
  config: Configuration
  current: string
  labels: string[]
  onAssign: (label: string) => void
}) {
  const name = config.aspect ? `${config.spirit.name} — ${config.aspect.name}` : config.spirit.name
  return (
    <label className="tier-tile-edit">
      <span className="visually-hidden">Tier for {name}</span>
      <select value={current} onChange={(e) => onAssign(e.target.value)}>
        {labels.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
        <option value="">Unrated</option>
      </select>
    </label>
  )
}

/** v5 #06: a configuration outside the collection stays in its rated tier row - a tier is
 * "how good," not "do you own it," so it's dimmed and badged in place, never regrouped. */
function TierTile({ config, owned, edit }: { config: Configuration; owned: boolean; edit?: ReactNode }) {
  return (
    <figure
      className={owned ? 'tier-tile' : 'tier-tile tier-tile-unowned'}
      title={
        (config.aspect ? `${config.spirit.name} — ${config.aspect.name} aspect` : config.spirit.name) +
        (owned ? '' : ' (not in your collection)')
      }
    >
      <SpiritArt spirit={config.spirit} className="tier-tile-art" />
      {config.aspect ? (
        <figcaption className="tier-tile-aspect">
          <span className="tier-tile-aspect-name">{config.aspect.name}</span>
          <span className="tier-tile-spirit-name">{config.spirit.name}</span>
        </figcaption>
      ) : (
        <figcaption>{config.spirit.name}</figcaption>
      )}
      {edit}
      {!owned && (
        <span className="unowned-badge" aria-hidden="true">
          ⊘
        </span>
      )}
      {!owned && <span className="visually-hidden"> — not in your collection</span>}
    </figure>
  )
}

/** The tier board. Editing is a mode on this board (#15, the dissolution) — available only on
 * personal-origin lists, persisting through the same override machinery the old editor used. */
export function TierBoard() {
  const [, setVersion] = useState(0)
  const [hardFilter, setHardFilter] = useState(false)
  const [editing, setEditing] = useState(false)
  const bump = () => setVersion((v) => v + 1)
  const active = tierStore.getActiveList()
  const customised = tierStore.isCustomised()
  const excluded = new Set(collectionStore.getExcluded())
  // The store refuses cited edits; the UI must not offer them (#15). `editing` may survive a
  // list switch, so the affordance is gated on the *current* list's origin, not the toggle.
  const canEdit = active.origin === 'personal'
  const editingHere = editing && canEdit
  // Hard-filter (#06's opt-in): excluded exactly as if annotation had removed them first, rather
  // than dimmed in place. Session-only - a view preference, not collection data, so it isn't
  // persisted or exported like the collection itself.
  const visibleConfigurations = hardFilter ? filterOwnedConfigurations(configurations, excluded) : configurations
  const grouped = groupByTier(visibleConfigurations, tierStore.getAll(), active.tierLabels)

  const assign = (configId: string) => (label: string) => {
    if (label === '') tierStore.clearTier(configId)
    else tierStore.setTier(configId, label)
    bump()
  }

  const editFor = (config: Configuration, current: string) =>
    editingHere ? (
      <TierTileEdit config={config} current={current} labels={active.tierLabels} onAssign={assign(config.configId)} />
    ) : undefined

  return (
    <section>
      <h2>Tier list</h2>
      <TierListControls totalConfigs={configurations.length} allowCreate onChange={bump} />
      <p>
        {customised ? 'Your customised tier list' : 'The shipped tier list'} — <strong>{active.tierLabels[0]}</strong>{' '}
        is strongest, <strong>{active.tierLabels[active.tierLabels.length - 1]}</strong> weakest. This ordering feeds
        the recommender: the <em>raw power ↔ something fresh</em> slider decides how heavily a spirit's tier counts
        toward its score.{' '}
        {canEdit ? (
          <>Toggle <strong>Edit tiers</strong> to reassign spirits right here.</>
        ) : (
          <>A cited list can't be edited — switch to a personal list to make changes.</>
        )}
      </p>
      <label className="deck-field-inline">
        <input type="checkbox" checked={hardFilter} onChange={(e) => setHardFilter(e.target.checked)} />
        Only show spirits I own
      </label>
      {canEdit && (
        <label className="deck-field-inline">
          <input type="checkbox" checked={editing} onChange={(e) => setEditing(e.target.checked)} />
          Edit tiers
        </label>
      )}
      {tierStore.wasDiscarded() && (
        <p className="notice">
          Your saved tier edits were discarded because the shipped tier list has changed since you
          made them. Export a backup from Settings next time to avoid losing edits like this.{' '}
          <button
            type="button"
            onClick={() => {
              tierStore.dismissDiscardNotice()
              bump()
            }}
          >
            Dismiss
          </button>
        </p>
      )}
      {editingHere && (
        <p>
          <button
            type="button"
            disabled={!customised}
            onClick={() => {
              if (!customised) return
              const ok = window.confirm(
                'This discards your tier edits and cannot be undone. Export a backup from Settings first?\n\n' +
                  'Choose Cancel to go export, or OK to reset anyway.',
              )
              if (!ok) return
              tierStore.reset()
              bump()
            }}
          >
            Reset to the shipped tier list
          </button>{' '}
          {customised ? <span className="meta">You have unsaved-to-repo edits.</span> : null}
        </p>
      )}

      <div className="tier-board">
        {active.tierLabels.map((label, i) => (
          <div className="tier-row" key={label}>
            <div className="tier-label" style={{ backgroundColor: tierColor(i) }}>
              {label}
            </div>
            <div className="tier-tiles">
              {grouped.labeled[label].length === 0 ? (
                <p className="tier-empty">No spirits in this tier</p>
              ) : (
                grouped.labeled[label].map((config) => (
                  <TierTile
                    key={config.configId}
                    config={config}
                    owned={isConfigurationOwned(config, excluded)}
                    edit={editFor(config, label)}
                  />
                ))
              )}
            </div>
          </div>
        ))}

        <div className="tier-row tier-row-unrated">
          <div className="tier-label tier-label-unrated">Unrated</div>
          <div className="tier-tiles">
            <p className="tier-empty meta">
              Not rated by this source — different from rated badly. {grouped.unrated.length} of {configurations.length}{' '}
              configurations here.
            </p>
            {grouped.unrated.map((config) => (
              <TierTile
                key={config.configId}
                config={config}
                owned={isConfigurationOwned(config, excluded)}
                edit={editFor(config, '')}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
