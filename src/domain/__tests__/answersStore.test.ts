import { describe, expect, it } from 'vitest'
import { memoryStorage } from '../storage'
import { createAnswersStore } from '../answersStore'

describe('answersStore', () => {
  it('returns null when nothing has been saved', () => {
    const store = createAnswersStore(memoryStorage())
    expect(store.load()).toBeNull()
  })

  it('round-trips save then load', () => {
    const store = createAnswersStore(memoryStorage())
    store.save({ beatOpponents: 'force' })
    expect(store.load()).toEqual({ beatOpponents: 'force' })
  })

  it('survives a simulated reload (same backing storage, fresh store instance)', () => {
    const storage = memoryStorage()
    createAnswersStore(storage).save({ tempo: 'fast' })
    const reloaded = createAnswersStore(storage)
    expect(reloaded.load()).toEqual({ tempo: 'fast' })
  })

  it('degrades to a fresh state on corrupt stored JSON instead of throwing on load', () => {
    const storage = memoryStorage()
    storage.setItem('spirit-island:last-answers', '{not json')
    expect(createAnswersStore(storage).load()).toBeNull()
  })

  describe('change notification (backup-import re-sync)', () => {
    it('notifies subscribers on save, with the exact saved object', () => {
      const store = createAnswersStore(memoryStorage())
      const seen: unknown[] = []
      store.subscribe((answers) => seen.push(answers))
      const saved = { beatOpponents: 'force' }
      store.save(saved)
      expect(seen).toEqual([saved])
    })

    it('does not notify a subscriber after it unsubscribes', () => {
      const store = createAnswersStore(memoryStorage())
      let count = 0
      const unsubscribe = store.subscribe(() => {
        count += 1
      })
      unsubscribe()
      store.save({ beatOpponents: 'force' })
      expect(count).toBe(0)
    })
  })
})
