import { describe, expect, it } from 'vitest'
import { createBackupService } from '../backupService'
import { createAnswersStore } from '../answersStore'
import { createCollectionStore } from '../collectionStore'
import { createComplexityStore } from '../complexityStore'
import { createGameLog } from '../gameLog'
import { memoryStorage } from '../storage'
import { createTierStore } from '../tierStore'
import type { TierList } from '../types'

const LIGHTNING = 'lightnings-swift-strike'

const PERSONAL: TierList = {
  id: 'personal-fixture',
  name: 'My List',
  type: 'strength',
  subject: 'configurations',
  origin: 'personal',
  tierLabels: ['S', 'A', 'B'],
  methodology: 'test fixture',
  verified: true,
  tiers: {},
}

const CITED: TierList = {
  ...PERSONAL,
  id: 'cited-fixture',
  name: 'A Cited List',
  origin: 'cited',
  tiers: { [LIGHTNING]: 'S' },
  source: {
    author: 'Someone',
    title: 'A video',
    url: 'https://example.com',
    retrievedAt: '2026-01-01',
    method: 'llm-transcript-scrape',
  },
}

/** In-memory stores (real factories, memory-backed storage) — the round-trip touches no
 * localStorage and no DOM. */
function makeHandle() {
  return {
    tiers: createTierStore(memoryStorage(), [PERSONAL, CITED]),
    complexity: createComplexityStore(memoryStorage()),
    collection: createCollectionStore(memoryStorage()),
    answers: createAnswersStore(memoryStorage()),
    log: createGameLog(memoryStorage()),
  }
}

describe('backupService', () => {
  it('collect gathers every store section, and apply restores them into a fresh set of stores', () => {
    const source = makeHandle()
    source.tiers.setTier(LIGHTNING, 'A')
    source.complexity.setComplexity(LIGHTNING, 'High')
    source.collection.setOwned('Jagged Earth', false)
    source.answers.save({ beatOpponents: 'force' })
    source.log.append({
      id: 'game-1',
      date: '2026-01-01',
      players: [{ name: 'Adam', configId: LIGHTNING }],
      adversary: 'England',
      adversaryLevel: 3,
      outcome: 'win',
    })
    const backup = createBackupService(source).collect()

    const target = makeHandle()
    createBackupService(target).apply(backup)

    expect(target.tiers.getTier(LIGHTNING)).toBe('A')
    expect(target.complexity.getComplexity(LIGHTNING)).toBe('High')
    expect(target.collection.owns('Jagged Earth')).toBe(false)
    expect(target.answers.load()).toEqual({ beatOpponents: 'force' })
    expect(target.log.list().map((e) => e.id)).toEqual(['game-1'])
  })

  it('applying a backup refuses cited lists and replaces only personal-list overrides', () => {
    const source = makeHandle()
    source.tiers.setTier(LIGHTNING, 'A')
    const backup = createBackupService(source).collect()
    // A stale backup that also names the cited list must not corrupt it.
    backup.tiers[CITED.id] = { [LIGHTNING]: 'B' }

    const target = makeHandle()
    target.tiers.setActiveListId(CITED.id)
    expect(target.tiers.getTier(LIGHTNING)).toBe('S')
    createBackupService(target).apply(backup)
    expect(target.tiers.getTier(LIGHTNING)).toBe('S')
  })

  it('surfaces unknown ids when parsing rather than dropping or throwing', () => {
    const service = createBackupService(makeHandle())
    const { state, unresolved } = service.parse(
      JSON.stringify({
        schemaVersion: 4,
        exportedAt: new Date().toISOString(),
        tiers: { [PERSONAL.id]: { 'no-longer-exists': 'A' } },
        complexityOverrides: {},
        answers: { unknownQuestion: 'x' },
        log: [],
        collection: ['Not A Real Expansion'],
      }),
    )
    expect(state.tiers[PERSONAL.id]).toEqual({})
    expect(unresolved.sort()).toEqual(['Not A Real Expansion', 'no-longer-exists', 'unknownQuestion'])
  })

  it('parsing merges and de-duplicates the log against the existing log by id', () => {
    const handle = makeHandle()
    handle.log.append({
      id: 'existing-1',
      date: '2026-01-01',
      players: [{ name: 'Adam', configId: LIGHTNING }],
      adversaryLevel: 1,
      outcome: 'win',
    })
    const service = createBackupService(handle)
    const incoming = {
      schemaVersion: 4,
      exportedAt: new Date().toISOString(),
      tiers: {},
      complexityOverrides: {},
      answers: {},
      log: [
        {
          id: 'existing-1',
          date: '2026-01-02',
          players: [{ name: 'Jo', configId: LIGHTNING }],
          adversaryLevel: 2,
          outcome: 'loss',
        },
        {
          id: 'new-1',
          date: '2026-02-01',
          players: [{ name: 'Adam', configId: LIGHTNING }],
          adversaryLevel: 3,
          outcome: 'win',
        },
      ],
      collection: [],
    }
    const { state } = service.parse(JSON.stringify(incoming))
    expect(state.log.map((e) => e.id).sort()).toEqual(['existing-1', 'new-1'])
  })

  it('hasExistingData reflects whether an import would replace anything', () => {
    expect(createBackupService(makeHandle()).hasExistingData()).toBe(false)
    const handle = makeHandle()
    handle.answers.save({ beatOpponents: 'force' })
    expect(createBackupService(handle).hasExistingData()).toBe(true)
  })

  it('export serialises what collect gathers', () => {
    const handle = makeHandle()
    handle.complexity.setComplexity(LIGHTNING, 'Moderate')
    const service = createBackupService(handle)
    expect(JSON.parse(service.export())).toMatchObject({
      complexityOverrides: { [LIGHTNING]: 'Moderate' },
    })
  })

  it('touches no localStorage and no DOM', () => {
    expect(typeof localStorage).toBe('undefined')
    expect(typeof document).toBe('undefined')
    const handle = makeHandle()
    expect(() => createBackupService(handle).collect()).not.toThrow()
    expect(() => createBackupService(handle).export()).not.toThrow()
  })
})
