import type { LogEntry } from './backup'
import type { BoardType } from './difficulty'

/** The Log tab's raw form state — the type the component's inputs hold. Everything is a string
 * or a validated number; `formToEntry` normalises it into a `LogEntry`. */
export interface LogFormState {
  players: { name: string; configId: string }[]
  adversary: string
  adversaryLevel: number
  secondaryAdversary: string
  secondaryAdversaryLevel: number
  boardType: BoardType
  scenario: string
  outcome: 'win' | 'loss'
  terrorLevel: string
  date: string
  notes: string
  difficulty: string
  startTime: string
  endTime: string
}

/** #17: the game log's number inputs advertise a `min`/`max`, but that markup only constrains the
 * spinner - a typed or pasted value (or `Number('')`, which is `0`) sails past it. Enforcing the
 * range where the entry is built, not only in the markup, means an out-of-range value is clamped
 * rather than recorded verbatim. An empty or non-numeric field means "not recorded" (`undefined`),
 * never a fabricated `0`. */
export function clampOptionalInt(raw: string, min: number, max = Infinity): number | undefined {
  if (raw.trim() === '') return undefined
  const n = Number(raw)
  if (!Number.isFinite(n)) return undefined
  return Math.min(Math.max(Math.round(n), min), max)
}

/** Adversary levels clamp to the adversary's printed min/max - a typed or pasted value outside
 * the range is clamped, never recorded verbatim. Owned here so no caller re-encodes the policy. */
export function clampAdversaryLevel(level: number, min: number, max: number): number {
  return Math.min(Math.max(level, min), max)
}

/** Normalises raw form state into a log entry (minus its id). Empty fields become `undefined`
 * (never a fabricated `0` or `""`), strings are trimmed and dropped when empty, and the terror
 * level and difficulty are clamped where they are built. */
export function formToEntry(form: LogFormState): Omit<LogEntry, 'id'> {
  return {
    players: form.players,
    adversary: form.adversary.trim() || undefined,
    adversaryLevel: form.adversaryLevel,
    secondaryAdversary: form.secondaryAdversary || undefined,
    secondaryAdversaryLevel: form.secondaryAdversary ? form.secondaryAdversaryLevel : undefined,
    boardType: form.boardType,
    scenario: form.scenario.trim() || undefined,
    outcome: form.outcome,
    terrorLevel: clampOptionalInt(form.terrorLevel, 1, 3),
    notes: form.notes.trim() || undefined,
    difficulty: clampOptionalInt(form.difficulty, 0),
    startTime: form.startTime || undefined,
    endTime: form.endTime || undefined,
    date: form.date,
  }
}

/** Seeds edit-mode form state from an entry: numbers become strings, absent fields become empty
 * strings, and the board type defaults to `classic`. */
export function entryToForm(entry: LogEntry): LogFormState {
  return {
    players: entry.players.map((p) => ({ ...p })),
    adversary: entry.adversary ?? '',
    adversaryLevel: entry.adversaryLevel,
    secondaryAdversary: entry.secondaryAdversary ?? '',
    secondaryAdversaryLevel: entry.secondaryAdversaryLevel ?? 0,
    boardType: entry.boardType ?? 'classic',
    scenario: entry.scenario ?? '',
    outcome: entry.outcome,
    terrorLevel: entry.terrorLevel !== undefined ? String(entry.terrorLevel) : '',
    date: entry.date.slice(0, 10),
    notes: entry.notes ?? '',
    difficulty: entry.difficulty !== undefined ? String(entry.difficulty) : '',
    startTime: entry.startTime ?? '',
    endTime: entry.endTime ?? '',
  }
}

/** "HH:MM" start/end -> "2h 15m". An end before start is read as crossing midnight (+24h).
 * Either input missing -> undefined, never "0m" or NaN. */
export function formatDuration(start?: string, end?: string): string | undefined {
  if (!start || !end) return undefined
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  if (![sh, sm, eh, em].every(Number.isFinite)) return undefined
  let minutes = eh * 60 + em - (sh * 60 + sm)
  if (minutes < 0) minutes += 24 * 60
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}
