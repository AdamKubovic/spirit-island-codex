import { describe, expect, it } from 'vitest'
import { editsVsSeed, createGuardedStore } from '../guardedStore'
import { memoryStorage } from '../storage'

describe('createGuardedStore', () => {
  it('round-trips a fingerprinted document', () => {
    const storage = memoryStorage()
    const guarded = createGuardedStore(storage)
    guarded.write('key', guarded.fingerprint('seed'), { overrides: { a: 'S' } })
    expect(guarded.read('key', guarded.fingerprint('seed'), {})).toEqual({ overrides: { a: 'S' } })
  })

  it('returns the fallback when nothing was ever stored, without reporting a discard', () => {
    const guarded = createGuardedStore(memoryStorage())
    expect(guarded.read('missing', 'any-seed', {})).toEqual({})
    expect(guarded.wasDiscarded('missing')).toBe(false)
  })

  it('discards and reports on corrupt stored JSON (ADR 0012)', () => {
    const storage = memoryStorage()
    storage.setItem('key', '{not json')
    const guarded = createGuardedStore(storage)
    expect(guarded.read('key', 'any-seed', {})).toEqual({})
    expect(guarded.wasDiscarded('key')).toBe(true)
    expect(storage.getItem('key')).toBeNull()
  })

  it('discards and reports on a fingerprint mismatch (ADR 0012)', () => {
    const storage = memoryStorage()
    storage.setItem('key', JSON.stringify({ seed: 'a-stale-fingerprint', value: { overrides: { a: 'F' } } }))
    const guarded = createGuardedStore(storage)
    expect(guarded.read('key', guarded.fingerprint('current'), {})).toEqual({})
    expect(guarded.wasDiscarded('key')).toBe(true)
    expect(storage.getItem('key')).toBeNull()
  })

  it('stays reported across reads until dismissed', () => {
    const storage = memoryStorage()
    storage.setItem('key', JSON.stringify({ seed: 'stale', value: {} }))
    const guarded = createGuardedStore(storage)
    guarded.read('key', 'current', {})
    expect(guarded.wasDiscarded('key')).toBe(true)
    expect(guarded.wasDiscarded('key')).toBe(true)
    guarded.dismissDiscard('key')
    expect(guarded.wasDiscarded('key')).toBe(false)
  })

  it('readPlain returns the fallback on corrupt JSON and reports it', () => {
    const storage = memoryStorage()
    storage.setItem('key', 'not json')
    const guarded = createGuardedStore(storage)
    expect(guarded.readPlain('key', [])).toEqual([])
    expect(guarded.wasDiscarded('key')).toBe(true)
  })

  it('reports a discard without touching storage (migration path)', () => {
    const storage = memoryStorage()
    storage.setItem('legacy', 'kept')
    const guarded = createGuardedStore(storage)
    guarded.reportDiscard('list-id')
    expect(guarded.wasDiscarded('list-id')).toBe(true)
    expect(storage.getItem('legacy')).toBe('kept')
  })

  it('memoises a successful read: repeat reads return the same parsed reference without re-parsing', () => {
    const storage = memoryStorage()
    const guarded = createGuardedStore(storage)
    guarded.write('key', 'seed', { overrides: { a: 'S' } })
    const first = guarded.read('key', 'seed', {})
    const second = guarded.read('key', 'seed', {})
    expect(first).toBe(second)
    // A write invalidates the cache: the next read re-parses from storage.
    guarded.write('key', 'seed', { overrides: { a: 'A' } })
    expect(guarded.read('key', 'seed', {})).toEqual({ overrides: { a: 'A' } })
  })

  it('remove clears both storage and the read cache', () => {
    const storage = memoryStorage()
    const guarded = createGuardedStore(storage)
    guarded.write('key', 'seed', { overrides: { a: 'S' } })
    guarded.read('key', 'seed', {})
    guarded.remove('key')
    expect(guarded.read('key', 'seed', {})).toEqual({})
    expect(storage.getItem('key')).toBeNull()
  })

  it('fingerprint is deterministic', () => {
    const guarded = createGuardedStore(memoryStorage())
    expect(guarded.fingerprint('{}')).toBe(guarded.fingerprint('{}'))
  })
})

describe('editsVsSeed', () => {
  it('keeps only entries whose value differs from the seed', () => {
    expect(editsVsSeed({ a: 'S', b: 'A' }, { a: 'S', b: 'B' })).toEqual({ b: 'A' })
  })

  it('returns an empty record when every entry restates the seed', () => {
    expect(editsVsSeed({ a: 'S' }, { a: 'S' })).toEqual({})
  })
})
