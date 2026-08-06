import type { LogEntry } from './backup'
import { createGuardedStore } from './guardedStore'
import { defaultStorage, type KeyValueStorage } from './storage'

const STORAGE_KEY = 'spirit-island:game-log'

/** Shared so the store's own reads and writes compose the same guarded seam. */
function readEntries(guarded: ReturnType<typeof createGuardedStore>): LogEntry[] {
  const parsed = guarded.readPlain<unknown>(STORAGE_KEY, null)
  // backup.parse rejects these on import, but a log corrupted by an older build is already
  // in storage - and timesPlayed() reads it on every render of the Recommend tab.
  return Array.isArray(parsed) ? parsed.filter((e) => Array.isArray(e?.players)) : []
}

/**
 * Seam 6: a journal, not a feedback loop. Records what was played; feeds exactly one fact
 * back into scoring (`timesPlayed`, consumed by #07's novelty knob). Outcomes are recorded
 * and displayed, never scored - see the PRD's "Out of Scope": auto-tuning the tier prior from
 * a two-game sample would silently corrupt the one dataset the owner authored personally.
 */
export function createGameLog(storage: KeyValueStorage = defaultStorage()) {
  const guarded = createGuardedStore(storage)

  function writeEntries(entries: LogEntry[]): void {
    guarded.writePlain(STORAGE_KEY, entries)
  }

  return {
    /** Stamps a stable id at creation - cross-device de-duplication on import depends on it.
     * An explicit `id` is the undo path: re-append a removed entry with its original id. */
    append(entry: Omit<LogEntry, 'id'> & { id?: string }): LogEntry {
      const full: LogEntry = { ...entry, id: entry.id ?? crypto.randomUUID() }
      writeEntries([...readEntries(guarded), full])
      return full
    },
    list(): LogEntry[] {
      return readEntries(guarded)
    },
    /** Drops exactly the entry with this id; returns it so the caller can undo via re-append. */
    remove(id: string): LogEntry | undefined {
      const entries = readEntries(guarded)
      const removed = entries.find((e) => e.id === id)
      if (!removed) return undefined
      writeEntries(entries.filter((e) => e.id !== id))
      return removed
    },
    /** Replaces an entry's fields in place (log-browse-dashboard-polish #07): same id, same
     * position — a correction, not a delete-and-re-append. The patch carries the form's whole
     * field set (id and date stay as recorded); unknown id is a no-op returning undefined. */
    update(id: string, patch: Omit<LogEntry, 'id'>): LogEntry | undefined {
      const entries = readEntries(guarded)
      const index = entries.findIndex((e) => e.id === id)
      if (index === -1) return undefined
      const updated: LogEntry = { ...patch, id }
      writeEntries(entries.map((e, i) => (i === index ? updated : e)))
      return updated
    },
    /** Counts entries where some player played this configuration. A fact, not a score. */
    timesPlayed(configId: string): number {
      return readEntries(guarded).filter((entry) => entry.players.some((p) => p.configId === configId)).length
    },
    /** Overwrites the whole log - used by backup import, which has already computed the
     * append-and-dedupe merge in backup.parse(). */
    replaceAll(entries: LogEntry[]): void {
      writeEntries(entries)
    },
  }
}

export const gameLog = createGameLog()
