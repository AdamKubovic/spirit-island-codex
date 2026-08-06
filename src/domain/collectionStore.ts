import type { Configuration } from './configurations'
import { createGuardedStore } from './guardedStore'
import { defaultStorage, type KeyValueStorage } from './storage'
import { EXPANSIONS, type ExpansionName } from './types'

const STORAGE_KEY = 'spirit-island:collection'

interface StoredCollection {
  /** Expansions the player has explicitly turned OFF - a delta from "owns everything", the
   * same discipline as `complexityStore.getOverrides()`. Absence (no key stored at all) means
   * owns everything, not an explicit "all true" snapshot - a fresh visitor to a public knowledge
   * base has filled in nothing and must see the full app, and a future expansion needs no
   * migration to be included by default. */
  excluded: ExpansionName[]
}

/**
 * v5 #06/#07a: the app-wide "what I own" setting. Mirrors `complexityStore`'s shape (injected
 * storage, create-function-plus-default-instance) rather than inventing a new pattern.
 */
export function createCollectionStore(storage: KeyValueStorage = defaultStorage()) {
  const guarded = createGuardedStore(storage)

  function readExcluded(): Set<ExpansionName> {
    const stored = guarded.readPlain<Partial<StoredCollection> | null>(STORAGE_KEY, null)
    if (!stored) return new Set()
    const known = new Set<string>(EXPANSIONS)
    return new Set((stored.excluded ?? []).filter((e): e is ExpansionName => known.has(e)))
  }

  function writeExcluded(excluded: Set<ExpansionName>): void {
    if (excluded.size === 0) {
      guarded.remove(STORAGE_KEY)
      return
    }
    const payload: StoredCollection = { excluded: [...excluded] }
    guarded.writePlain(STORAGE_KEY, payload)
  }

  return {
    owns(expansion: ExpansionName): boolean {
      return !readExcluded().has(expansion)
    },
    setOwned(expansion: ExpansionName, owned: boolean): void {
      const excluded = readExcluded()
      if (owned) excluded.delete(expansion)
      else excluded.add(expansion)
      writeExcluded(excluded)
    },
    /** The expansions turned off - what a backup export carries, mirroring
     * `complexityStore.getOverrides()`. */
    getExcluded(): ExpansionName[] {
      return [...readExcluded()].sort()
    },
    isCustomised(): boolean {
      return readExcluded().size > 0
    },
    resetAll(): void {
      guarded.remove(STORAGE_KEY)
    },
  }
}

export const collectionStore = createCollectionStore()

/**
 * Pure: a configuration is owned when both the base spirit's expansion and (if there is one)
 * the aspect's own expansion are unexcluded - v5 #06's call that aspects are gated
 * independently, since an aspect can ship in a different box than its spirit.
 */
export function isConfigurationOwned(config: Configuration, excluded: ReadonlySet<ExpansionName>): boolean {
  if (excluded.has(config.spirit.expansion)) return false
  if (config.aspect && excluded.has(config.aspect.expansion)) return false
  return true
}

/**
 * Pure: whether a power card's box is in the collection.
 *
 * Takes the **canonical** expansion, not the card's raw transcribed string (`Basegame`, `Promo2`,
 * …) — the alias table lives with the rest of the presentation-layer expansion handling, so the
 * caller resolves the raw string through `normalizeExpansion` first and this stays a plain set
 * lookup. Mirrors `isConfigurationOwned`, which can index directly because `spirits.json` is
 * already canonical.
 *
 * `undefined` — a raw string the alias table can't place — counts as **owned**. Dimming it would
 * assert the player doesn't own something the data can't actually identify; ADR 0003's rule is
 * that an unanswerable field is absent, never estimated.
 */
export function isCardOwned(
  expansion: ExpansionName | undefined,
  excluded: ReadonlySet<ExpansionName>,
): boolean {
  if (!expansion) return true
  return !excluded.has(expansion)
}

/** The opt-in hard-filter case (#06): only the configurations the collection actually owns,
 * excluded exactly as if annotation had removed them first. */
export function filterOwnedConfigurations(configs: Configuration[], excluded: ReadonlySet<ExpansionName>): Configuration[] {
  return configs.filter((c) => isConfigurationOwned(c, excluded))
}

/** v5 #07b: the exact candidate-pool decision the Recommender makes before calling `recommend()`
 * - hard-filter off (default) leaves the pool untouched (an unowned configuration can still
 * surface, annotated); on, it's pre-filtered so an unowned configuration never enters scoring.
 * Exported so `recommendCollection.test.ts` pins this function itself, not a reimplementation of
 * it - a test that imports this and a test that imports `Recommender.tsx`'s wiring are the same
 * test once the component calls this instead of inlining the ternary. */
export function candidatesForRecommender(
  configs: Configuration[],
  hardFilter: boolean,
  excluded: ReadonlySet<ExpansionName>,
): Configuration[] {
  return hardFilter ? filterOwnedConfigurations(configs, excluded) : configs
}
