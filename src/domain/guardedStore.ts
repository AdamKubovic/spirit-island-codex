import type { KeyValueStorage } from './storage'

/** A fingerprinted document: the value plus the seed fingerprint it was edited against (ADR 0012). */
export interface GuardedDocument<T> {
  seed: string
  value: T
}

/**
 * The guarded persistence seam between the raw string storage adapter and the five persistent
 * stores. Owns the slab every store used to hand-roll: the corrupt-JSON read guard, the seed
 * fingerprint guard (mismatch discards and reports — ADR 0012), the discard-and-report state,
 * and a per-key read cache so a render never re-parses the same stored JSON several times.
 *
 * The stores keep their seed maps and business reads; they compose this module for persistence.
 */
export function createGuardedStore(storage: KeyValueStorage) {
  // Sticky for the life of this store instance (one page load) — a discard must not flip back to
  // "not discarded" just because the next read found nothing to discard.
  const discardedKeys = new Set<string>()
  // Successful parses are cached per storage key so repeated reads don't re-hit storage. Writes
  // and removes invalidate the key.
  const cache = new Map<string, unknown>()

  /** FNV-1a. Cheap, stable, and we only need change-detection, not cryptography. */
  function fingerprint(input: string): string {
    let h = 2166136261
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    return (h >>> 0).toString(36)
  }

  function discard(key: string): void {
    cache.delete(key)
    storage.removeItem(key)
    discardedKeys.add(key)
  }

  /** Reads a fingerprinted document. Corrupt JSON or a seed mismatch discards and reports
   * (ADR 0012), returning `fallback`; the caller's business shape checks still apply. */
  function read<T>(key: string, seed: string, fallback: T): T {
    if (cache.has(key)) return cache.get(key) as T
    const raw = storage.getItem(key)
    if (raw === null) return fallback
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      discard(key)
      return fallback
    }
    const doc = parsed as Partial<GuardedDocument<T>>
    if (typeof doc?.seed !== 'string' || doc.seed !== seed) {
      discard(key)
      return fallback
    }
    const value = doc.value as T
    cache.set(key, value)
    return value
  }

  function write<T>(key: string, seed: string, value: T): void {
    cache.delete(key)
    const doc: GuardedDocument<T> = { seed, value }
    storage.setItem(key, JSON.stringify(doc))
  }

  /** Reads a plain (fingerprint-less) document. Corrupt JSON discards and reports; the caller's
   * shape checks still apply. */
  function readPlain<T>(key: string, fallback: T): T {
    if (cache.has(key)) return cache.get(key) as T
    const raw = storage.getItem(key)
    if (raw === null) return fallback
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      discard(key)
      return fallback
    }
    cache.set(key, parsed)
    return parsed as T
  }

  function writePlain(key: string, value: unknown): void {
    cache.delete(key)
    storage.setItem(key, JSON.stringify(value))
  }

  /** Removes a stored value and its cache entry. */
  function remove(key: string): void {
    cache.delete(key)
    storage.removeItem(key)
  }

  /** Records a discard without touching storage — for migration paths that report under a
   * different key (e.g. the v2 tier migration reports on the owner's list id). */
  function reportDiscard(key: string): void {
    discardedKeys.add(key)
  }

  function wasDiscarded(key: string): boolean {
    return discardedKeys.has(key)
  }

  function dismissDiscard(key: string): void {
    discardedKeys.delete(key)
  }

  return {
    fingerprint,
    read,
    write,
    readPlain,
    writePlain,
    remove,
    reportDiscard,
    wasDiscarded,
    dismissDiscard,
  }
}

/** "User edits" and "is customised" read one source: entries whose value differs from the seed.
 * Assigning the value a key already has stores a no-op override; this filters it back out, so
 * that no-op never round-trips through a backup as a real edit. */
export function editsVsSeed<T extends string | number>(overrides: Record<string, T>, seed: Record<string, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(overrides).filter(([id, value]) => value !== seed[id]))
}
