import type { Answers } from './answersToWeights'
import { createGuardedStore } from './guardedStore'
import { defaultStorage, type KeyValueStorage } from './storage'

const STORAGE_KEY = 'spirit-island:last-answers'

/** Persists the last questionnaire answers so the recommender restores on reload. Corrupt stored
 * JSON degrades to a fresh state (`load()` returns null) instead of throwing on load - the answers
 * store previously lacked the corrupt-JSON guard every other persistent store has. */
export function createAnswersStore(storage: KeyValueStorage = defaultStorage()) {
  const guarded = createGuardedStore(storage)
  const listeners = new Set<(answers: Answers) => void>()

  return {
    save(answers: Answers): void {
      guarded.writePlain(STORAGE_KEY, answers)
      // Notify external writers (e.g. a backup import) so an in-memory consumer re-syncs instead
      // of diverging until reload. The listener receives the exact object that was saved, so a
      // consumer that setState's it back bails out on reference equality.
      for (const fn of listeners) fn(answers)
    },
    load(): Answers | null {
      return guarded.readPlain<Answers | null>(STORAGE_KEY, null)
    },
    clear(): void {
      guarded.remove(STORAGE_KEY)
    },
    /** Subscribes to external saves. Returns an unsubscribe function. */
    subscribe(fn: (answers: Answers) => void): () => void {
      listeners.add(fn)
      return () => {
        listeners.delete(fn)
      }
    },
  }
}

export const answersStore = createAnswersStore()
