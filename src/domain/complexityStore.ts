import spiritsData from '../data/spirits.json'
import { createGuardedStore, editsVsSeed } from './guardedStore'
import { defaultStorage, type KeyValueStorage } from './storage'
import type { Complexity, Spirit } from './types'

const SPIRITS = spiritsData as Spirit[]
const SEED: Record<string, Complexity> = Object.fromEntries(SPIRITS.map((s) => [s.id, s.complexity]))
const STORAGE_KEY = 'spirit-island:complexity-overrides'

/**
 * Seam 5: personal complexity override, on the tierStore pattern. Printed `complexity` in
 * spirits.json stays untouched - fact and judgment stay separable, as with `ratings` /
 * `ratingsSource`. Aspects are not individually overridable (their printed arrow stands), so
 * this is keyed by spirit id, not configId.
 */
export function createComplexityStore(storage: KeyValueStorage = defaultStorage()) {
  const guarded = createGuardedStore(storage)
  const seedFingerprint = guarded.fingerprint(JSON.stringify(SEED))

  /** Same staleness guard as tierStore: an override edited against a since-changed printed
   * complexity would silently misjudge the newcomer ceiling, so it's discarded, not carried over. */
  function readOverrides(): Record<string, Complexity> {
    return guarded.read(STORAGE_KEY, seedFingerprint, {})
  }

  function writeOverrides(overrides: Record<string, Complexity>): void {
    guarded.write(STORAGE_KEY, seedFingerprint, overrides)
  }

  /** Stored overrides minus the ones that merely restate the printed value. */
  function userEdits(): Record<string, Complexity> {
    return editsVsSeed(readOverrides(), SEED)
  }

  return {
    getComplexity(spiritId: string): Complexity | undefined {
      return readOverrides()[spiritId] ?? SEED[spiritId]
    },
    setComplexity(spiritId: string, complexity: Complexity): void {
      const overrides = readOverrides()
      overrides[spiritId] = complexity
      writeOverrides(overrides)
    },
    reset(spiritId: string): void {
      const overrides = readOverrides()
      delete overrides[spiritId]
      writeOverrides(overrides)
    },
    resetAll(): void {
      guarded.remove(STORAGE_KEY)
    },
    getAll(): Record<string, Complexity> {
      return { ...SEED, ...readOverrides() }
    },
    /** Only the user's edits (keys whose value differs from the seed) - what a backup export
     * should carry, as distinct from `getAll()`'s merged view the recommender depends on.
     * Assigning a spirit the complexity it already has stores a no-op override; this filters
     * it back out, so that no-op never round-trips through a backup as a real edit. */
    getOverrides(): Record<string, Complexity> {
      return userEdits()
    },
    /** Reads the same filtered map the export does, so "has edits" and "exports edits" can
     * never disagree. */
    isCustomised(): boolean {
      return Object.keys(userEdits()).length > 0
    },
    /** True once a fingerprint mismatch has discarded stored overrides this session. */
    wasDiscarded(): boolean {
      readOverrides()
      return guarded.wasDiscarded(STORAGE_KEY)
    },
    /** Silences the discard notice for the rest of this session. */
    dismissDiscardNotice(): void {
      guarded.dismissDiscard(STORAGE_KEY)
    },
  }
}

export const complexityStore = createComplexityStore()
