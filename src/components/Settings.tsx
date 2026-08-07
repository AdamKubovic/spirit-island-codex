import { useEffect, useRef, useState } from 'react'
import spiritsData from '../data/spirits.json'
import { createBackupService } from '../domain/backupService'
import { answersStore } from '../domain/answersStore'
import { collectionStore } from '../domain/collectionStore'
import { complexityStore } from '../domain/complexityStore'
import { gameLog } from '../domain/gameLog'
import { tierStore } from '../domain/tierStore'
import { COMPLEXITIES, EXPANSIONS, TIER_LIST_SUBJECTS } from '../domain/types'
import type { Complexity, Spirit } from '../domain/types'
import { SpiritArt } from './SpiritArt'
import { Term } from './Term'
import { SUBJECT_LABEL } from './TierListControls'

const spirits = spiritsData as Spirit[]

/** The Settings tab's My collection section: every "you don't own this" marking routes here via
 * `MY_COLLECTION_HREF` (`#/settings?focus=collection`), and on landing Settings scrolls this
 * section into view so the visitor is at the control they came to change. */
const COLLECTION_SECTION_ID = 'settings-collection'

/** The whole export/import round-trip lives in the domain module; Settings keeps the file
 * download, the file input, and the confirm-before-replace prompt. */
const backupService = createBackupService({
  tiers: tierStore,
  complexity: complexityStore,
  collection: collectionStore,
  answers: answersStore,
  log: gameLog,
})

function downloadBackup(json: string) {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `spirit-island-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

function ComplexitySelect({
  value,
  onSet,
  label,
}: {
  value: Complexity
  onSet: (c: Complexity) => void
  label: string
}) {
  return (
    <label className="cx-row-select">
      <span className="visually-hidden">{label}</span>
      <select value={value} onChange={(e) => onSet(e.target.value as Complexity)}>
        {COMPLEXITIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  )
}

/** ux-discoverability #02: the "Complexity overrides" panel, overrides-first (prototype
 * variant C). A compact row per spirit — thumb, printed level, your select — grouped by
 * expansion, so the wall of large spirit cards is gone. "Your overrides" lists only the spirits
 * whose override differs from printed; everything else hides under the collapsed "All spirits"
 * disclosure. Store semantics are untouched: this is the same `getAll()`/`set`/`reset` the old
 * grid used, so an override set here reads exactly as before everywhere else. */
function ComplexityPanel({
  spirits,
  overrides,
  onSet,
  onReset,
}: {
  spirits: Spirit[]
  overrides: Record<string, Complexity>
  onSet: (spiritId: string, complexity: Complexity) => void
  onReset: (spiritId: string) => void
}) {
  const [adding, setAdding] = useState(false)
  const [pick, setPick] = useState('')
  const [level, setLevel] = useState<Complexity>('Moderate')
  const customised = spirits.filter((s) => overrides[s.id] !== s.complexity)
  const addable = spirits.filter((s) => overrides[s.id] === s.complexity)

  return (
    <div className="cx-panel">
      <h4 className="cx-panel-head">Your overrides ({customised.length})</h4>
      {customised.length === 0 ? (
        <p className="meta">None yet — every spirit reads its printed complexity.</p>
      ) : (
        <ul className="cx-rows">
          {customised.map((s) => (
            <li key={s.id} className="cx-row">
              <SpiritArt spirit={s} className="cx-thumb" />
              <span className="cx-name">{s.name}</span>
              <span className="cx-printed">printed {s.complexity}</span>
              <ComplexitySelect
                value={overrides[s.id]}
                onSet={(c) => onSet(s.id, c)}
                label={`Complexity override for ${s.name}`}
              />
              <button type="button" className="cx-reset" onClick={() => onReset(s.id)}>
                Reset
              </button>
            </li>
          ))}
        </ul>
      )}

      {!adding ? (
        <button type="button" onClick={() => setAdding(true)}>
          Add an override…
        </button>
      ) : (
        <div className="cx-add">
          <label className="cx-add-field">
            <span className="visually-hidden">Spirit to override</span>
            <select value={pick} onChange={(e) => setPick(e.target.value)}>
              <option value="">Pick a spirit…</option>
              {addable.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <ComplexitySelect value={level} onSet={setLevel} label="Complexity to set" />
          <button
            type="button"
            disabled={!pick}
            onClick={() => {
              onSet(pick, level)
              setPick('')
              setAdding(false)
            }}
          >
            Add
          </button>
        </div>
      )}

      <details className="cx-details">
        <summary>All spirits ({spirits.length})</summary>
        {EXPANSIONS.map((exp) => {
          const group = spirits.filter((s) => s.expansion === exp)
          if (group.length === 0) return null
          return (
            <div key={exp} className="cx-group">
              <h4 className="cx-exp">{exp}</h4>
              <ul className="cx-rows">
                {group.map((s) => (
                  <li key={s.id} className="cx-row">
                    <SpiritArt spirit={s} className="cx-thumb" />
                    <span className="cx-name">{s.name}</span>
                    <span className="cx-printed">printed {s.complexity}</span>
                    <ComplexitySelect
                      value={overrides[s.id]}
                      onSet={(c) => onSet(s.id, c)}
                      label={`Complexity override for ${s.name}`}
                    />
                    {overrides[s.id] !== s.complexity && (
                      <button type="button" className="cx-reset" onClick={() => onReset(s.id)}>
                        Reset
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </details>
    </div>
  )
}

/**
 * The Settings tab (#14): exactly the three durable-state sections that used to ride inside
 * "Customise tiers" — Backup, My collection, Complexity overrides — moved with behaviour
 * identical. Open-door policy (#02 decision 2): any future durable, app-wide preference
 * defaults here unless its ticket argues for surface-local. Session-only controls (each
 * surface's hide-unowned checkbox) stay beside the results they filter.
 */
export function Settings({ offlineReady = false }: { offlineReady?: boolean } = {}) {
  const [, setVersion] = useState(0)
  const [importMessage, setImportMessage] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const bump = () => setVersion((v) => v + 1)
  const complexityOverrides = complexityStore.getAll()
  const complexityDiscarded = complexityStore.wasDiscarded()
  const collectionCustomised = collectionStore.isCustomised()
  const allLists = tierStore.getLists()

  // ux-discoverability #04: a "you don't own this" marking elsewhere routes here with
  // ?focus=collection; on landing, scroll the My collection section into view so the visitor is
  // at the control they came to change, not at the top of a long page.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const query = window.location.hash.split('?')[1] ?? ''
    if (new URLSearchParams(query).get('focus') !== 'collection') return
    const section = document.getElementById(COLLECTION_SECTION_ID)
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleSetComplexity = (spiritId: string, complexity: Complexity) => {
    complexityStore.setComplexity(spiritId, complexity)
    bump()
  }

  const handleResetComplexity = (spiritId: string) => {
    complexityStore.reset(spiritId)
    bump()
  }

  const handleSetOwned = (expansion: (typeof EXPANSIONS)[number], owned: boolean) => {
    collectionStore.setOwned(expansion, owned)
    bump()
  }

  const handleExport = () => {
    downloadBackup(backupService.export())
  }

  const handleImportFile = async (file: File) => {
    setImportMessage(null)
    let result
    try {
      result = backupService.parse(await file.text())
    } catch (err) {
      setImportMessage(err instanceof Error ? err.message : 'Could not read that backup file.')
      return
    }

    if (backupService.hasExistingData()) {
      const ok = window.confirm(
        'Importing will replace your tiers, complexity overrides, collection and answers with ' +
          'the ones in this file. Your game log is merged instead - entries are appended and ' +
          'de-duplicated by id, so nothing already logged is lost.\n\nExport a backup first if ' +
          'you want to keep what you have now?\n\nChoose Cancel to go export, or OK to import anyway.',
      )
      if (!ok) return
    }

    backupService.apply(result.state)
    bump()
    setImportMessage(
      result.unresolved.length > 0
        ? `Imported. Could not resolve ${result.unresolved.length} id(s): ${result.unresolved.join(', ')}`
        : 'Imported successfully.',
    )
  }

  return (
    <section>
      <h2>Settings</h2>
      {complexityDiscarded && (
        <p className="notice">
          Your saved complexity overrides were discarded because the shipped complexity values have
          changed since you made them. Export a backup next time to avoid losing edits like this.{' '}
          <button
            type="button"
            onClick={() => {
              complexityStore.dismissDiscardNotice()
              bump()
            }}
          >
            Dismiss
          </button>
        </p>
      )}

      <h3>Offline</h3>
      <p className="meta">{offlineReady ? 'Offline cache ready.' : 'Offline cache: not yet.'}</p>

      <h3>Backup</h3>
      <p className="meta">
        Nothing here survives a cleared browser cache unless you export it. Export carries your
        edits to every personal list, not just the one shown here. Import replaces those edits,
        your complexity overrides and your answers; your game log is appended and de-duplicated by
        id instead, so merging two devices' histories never loses a played game.
      </p>
      <p>
        <button type="button" onClick={handleExport}>
          Export backup
        </button>{' '}
        <button type="button" onClick={() => fileInput.current?.click()}>
          Import backup
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json"
          className="visually-hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleImportFile(file)
            e.target.value = ''
          }}
        />
      </p>
      {importMessage ? <p className="meta">{importMessage}</p> : null}

      {/* phase-4 #18: the durable boot pick, on the #12 seams. The active list stays session
       * state — changing the default here changes which list boots next load, not this one.
       * Seed note: the owner's named default video matches no shipped citation, so the seed
       * stays the owner's board pending the owner's answer (escalated in #12/#18, ADR 0002). */}
      <h3>Default tier list</h3>
      <p className="meta">
        Which list each subject boots into. Switching a list on the Tier list tab lasts for the
        session; the pick here is what a fresh load starts from.
      </p>
      {TIER_LIST_SUBJECTS.filter((subject) => allLists.some((l) => l.subject === subject)).map((subject) => (
        <label key={subject} className="deck-field">
          <span>{SUBJECT_LABEL[subject]}</span>
          <select
            value={tierStore.getDefaultList(subject)?.id ?? ''}
            onChange={(e) => {
              tierStore.setDefaultListId(e.target.value)
              bump()
            }}
          >
            {allLists
              .filter((l) => l.subject === subject)
              .map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
          </select>
        </label>
      ))}

      <section id={COLLECTION_SECTION_ID}>
        <h3>My collection</h3>
        <p className="meta">
          Choose the expansions in your collection. Nothing disappears by default — spirits and aspects
          outside your collection are dimmed wherever a surface respects it (starting with the tier
          board), never hidden. The Cards tab never respects this: browsing the full card pool is
          how you decide whether to buy an expansion.{' '}
          {collectionCustomised ? <span>You've excluded some expansions.</span> : null}
        </p>
        <div className="collection-picker" role="group" aria-label="Expansions in your collection">
          <div className="collection-picker-head">
            <span className="collection-picker-label">Your expansions</span>
            {collectionCustomised && (
              <button type="button" className="collection-picker-reset" onClick={() => {
                collectionStore.resetAll()
                bump()
              }}>
                Own all
              </button>
            )}
          </div>
          <div className="collection-picker-options">
            {EXPANSIONS.map((expansion) => {
              const owned = collectionStore.owns(expansion)
              return (
                <button
                  key={expansion}
                  type="button"
                  className="collection-option"
                  aria-pressed={owned}
                  onClick={() => handleSetOwned(expansion, !owned)}
                >
                  <span>{expansion}</span>
                  <small>{owned ? 'In collection' : 'Not owned'}</small>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <h3>Complexity overrides</h3>
      <p className="meta">
        Disagree with the printed <Term id="complexity">Complexity</Term>? Override it here. This only changes your
        own <em>enjoyment</em> preference score — a newcomer's safeguard always reads the printed
        value, never your override. Aspects aren't individually overridable; their printed arrow
        still applies on top.
      </p>

      <ComplexityPanel spirits={spirits} overrides={complexityOverrides} onSet={handleSetComplexity} onReset={handleResetComplexity} />
    </section>
  )
}
