import { describe, expect, it } from 'vitest'
import { isRelevantToPlayerCount } from '../noteRelevance'

describe('isRelevantToPlayerCount', () => {
  it('flags a solo note only at player count 1', () => {
    const notes = 'Excellent solo pick; less table synergy needed.'
    expect(isRelevantToPlayerCount(notes, 1)).toBe(true)
    expect(isRelevantToPlayerCount(notes, 4)).toBe(false)
  })

  it('flags a high-Dahan note only at high player counts', () => {
    const notes = 'Shines with high Dahan counts.'
    expect(isRelevantToPlayerCount(notes, 4)).toBe(true)
    expect(isRelevantToPlayerCount(notes, 1)).toBe(false)
    expect(isRelevantToPlayerCount(notes, 2)).toBe(false)
  })

  it('flags an inland/low-count note at low-to-mid player counts', () => {
    const notes = 'Weak on inland-heavy boards.'
    expect(isRelevantToPlayerCount(notes, 2)).toBe(true)
    expect(isRelevantToPlayerCount(notes, 4)).toBe(false)
  })

  it('is false for a note with no player-count keywords, at any count', () => {
    const notes = 'OCFDU are estimates; verify against the physical Horizons panel.'
    expect(isRelevantToPlayerCount(notes, 1)).toBe(false)
    expect(isRelevantToPlayerCount(notes, 3)).toBe(false)
    expect(isRelevantToPlayerCount(notes, 6)).toBe(false)
  })

  it('is case-insensitive', () => {
    expect(isRelevantToPlayerCount('SOLO powerhouse.', 1)).toBe(true)
  })
})
