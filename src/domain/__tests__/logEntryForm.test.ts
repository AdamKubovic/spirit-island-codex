import { describe, expect, it } from 'vitest'
import type { LogEntry } from '../backup'
import { clampAdversaryLevel, clampOptionalInt, entryToForm, formatDuration, formToEntry, type LogFormState } from '../logEntry'

function emptyForm(): LogFormState {
  return {
    players: [{ name: 'Adam', configId: 'lightnings-swift-strike' }],
    adversary: '',
    adversaryLevel: 0,
    secondaryAdversary: '',
    secondaryAdversaryLevel: 0,
    boardType: 'classic',
    scenario: '',
    outcome: 'win',
    terrorLevel: '',
    date: '2026-06-01',
    notes: '',
    difficulty: '',
    startTime: '',
    endTime: '',
  }
}

describe('formToEntry', () => {
  it('turns an empty field into undefined, never a fabricated 0 or empty string', () => {
    const entry = formToEntry(emptyForm())
    expect(entry.adversary).toBeUndefined()
    expect(entry.scenario).toBeUndefined()
    expect(entry.notes).toBeUndefined()
    expect(entry.terrorLevel).toBeUndefined()
    expect(entry.difficulty).toBeUndefined()
    expect(entry.startTime).toBeUndefined()
    expect(entry.endTime).toBeUndefined()
    expect(entry.secondaryAdversary).toBeUndefined()
    expect(entry.secondaryAdversaryLevel).toBeUndefined()
  })

  it('trims strings and drops whitespace-only values', () => {
    const entry = formToEntry({ ...emptyForm(), adversary: '  England  ', notes: '   ' })
    expect(entry.adversary).toBe('England')
    expect(entry.notes).toBeUndefined()
  })

  it('clamps the terror level to 1..3', () => {
    expect(formToEntry({ ...emptyForm(), terrorLevel: '9' }).terrorLevel).toBe(3)
    expect(formToEntry({ ...emptyForm(), terrorLevel: '0' }).terrorLevel).toBe(1)
    expect(formToEntry({ ...emptyForm(), terrorLevel: '2' }).terrorLevel).toBe(2)
  })

  it('carries the difficulty through a non-negative clamp', () => {
    expect(formToEntry({ ...emptyForm(), difficulty: '12.6' }).difficulty).toBe(13)
    expect(formToEntry({ ...emptyForm(), difficulty: '-3' }).difficulty).toBe(0)
  })

  it('keeps a secondary level only alongside its adversary', () => {
    const withSecondary = formToEntry({ ...emptyForm(), secondaryAdversary: 'England', secondaryAdversaryLevel: 5 })
    expect(withSecondary.secondaryAdversary).toBe('England')
    expect(withSecondary.secondaryAdversaryLevel).toBe(5)
    const orphaned = formToEntry({ ...emptyForm(), secondaryAdversary: '', secondaryAdversaryLevel: 5 })
    expect(orphaned.secondaryAdversary).toBeUndefined()
    expect(orphaned.secondaryAdversaryLevel).toBeUndefined()
  })

  it('carries players, date and outcome through', () => {
    const entry = formToEntry({ ...emptyForm(), outcome: 'loss' })
    expect(entry.players).toEqual([{ name: 'Adam', configId: 'lightnings-swift-strike' }])
    expect(entry.date).toBe('2026-06-01')
    expect(entry.outcome).toBe('loss')
  })
})

describe('entryToForm', () => {
  it('round-trips a fully-populated entry back to the same entry (minus id)', () => {
    const entry: LogEntry = {
      id: 'game-1',
      date: '2026-06-01T00:00:00.000Z',
      players: [{ name: 'Adam', configId: 'lightnings-swift-strike' }],
      adversary: 'England',
      adversaryLevel: 4,
      secondaryAdversary: 'Sweden',
      secondaryAdversaryLevel: 2,
      boardType: 'thematic-rebalanced',
      scenario: 'Elemental Invocation',
      outcome: 'loss',
      terrorLevel: 3,
      notes: 'close game',
      difficulty: 12,
      startTime: '23:00',
      endTime: '01:30',
    }
    const form = entryToForm(entry)
    // entryToForm slices a full ISO date to YYYY-MM-DD — the form's date input only ever carries
    // the date part, so the round-trip normalises to that.
    expect(formToEntry(form)).toEqual({ ...entry, id: undefined, date: '2026-06-01' })
  })

  it('maps absent entry fields to empty form strings, and level 0 to a bare 0', () => {
    const form = entryToForm({
      id: 'game-2',
      date: '2026-06-02',
      players: [{ name: 'Adam', configId: 'river-surges-in-sunlight' }],
      adversaryLevel: 0,
      outcome: 'win',
    })
    expect(form.adversary).toBe('')
    expect(form.scenario).toBe('')
    expect(form.notes).toBe('')
    expect(form.terrorLevel).toBe('')
    expect(form.difficulty).toBe('')
    expect(form.startTime).toBe('')
    expect(form.endTime).toBe('')
    expect(form.boardType).toBe('classic')
    expect(form.adversaryLevel).toBe(0)
  })

  it('seeds edit mode with numeric fields as strings', () => {
    const form = entryToForm({
      id: 'game-3',
      date: '2026-06-03',
      players: [{ name: 'Adam', configId: 'lightnings-swift-strike' }],
      adversaryLevel: 3,
      terrorLevel: 2,
      difficulty: 7,
      outcome: 'win',
    })
    expect(form.terrorLevel).toBe('2')
    expect(form.difficulty).toBe('7')
    expect(form.adversaryLevel).toBe(3)
  })
})

describe('clampAdversaryLevel', () => {
  it('passes an in-range level through unchanged', () => {
    expect(clampAdversaryLevel(3, 0, 6)).toBe(3)
  })

  it('clamps a level above the adversary\'s printed max', () => {
    expect(clampAdversaryLevel(9, 0, 6)).toBe(6)
  })

  it('clamps a level below the adversary\'s printed min', () => {
    expect(clampAdversaryLevel(-1, 0, 6)).toBe(0)
  })
})

describe('formatDuration (the long-promised test)', () => {
  it('formats a same-evening game', () => {
    expect(formatDuration('19:30', '22:15')).toBe('2h 45m')
  })

  it('reads an end before start as crossing midnight (+24h)', () => {
    expect(formatDuration('23:00', '01:30')).toBe('2h 30m')
  })

  it('returns minutes only under an hour', () => {
    expect(formatDuration('19:00', '19:40')).toBe('40m')
  })

  it('returns undefined when either input is missing', () => {
    expect(formatDuration()).toBeUndefined()
    expect(formatDuration('19:00')).toBeUndefined()
    expect(formatDuration(undefined, '20:00')).toBeUndefined()
  })
})

describe('clampOptionalInt', () => {
  it('treats an empty field as not recorded, never a fabricated 0', () => {
    expect(clampOptionalInt('', 1, 3)).toBeUndefined()
    expect(clampOptionalInt('   ', 0)).toBeUndefined()
  })
})
