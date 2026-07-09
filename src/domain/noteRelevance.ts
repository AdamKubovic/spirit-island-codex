/**
 * Whether a spirit's free-text `notes` field reads as relevant to a given player count -
 * a light UI annotation only (surfaces/de-emphasises a note), never a scoring input.
 *
 * TODO(review): `notes` is unstructured prose (mixes player-count flavour with unrelated
 * data-provenance remarks - see spirits.json), so this is a keyword heuristic, not a
 * structured tag. It will miss phrasings it doesn't recognise and can false-positive on
 * unrelated text. A structured per-note player-count tag would make this exact; out of
 * scope for this slice, which only had to make the question do *something* rather than
 * nothing.
 */
const SOLO_RE = /\bsolo\b/
const HIGH_COUNT_RE = /\bhigh[- ]?(dahan|player)|\bdahan\b/
const LOW_COUNT_RE = /\binland\b|\blow[- ]?(dahan|player)/

export function isRelevantToPlayerCount(notes: string, playerCount: number): boolean {
  const text = notes.toLowerCase()
  if (playerCount <= 1) return SOLO_RE.test(text)
  if (playerCount >= 4) return HIGH_COUNT_RE.test(text)
  return LOW_COUNT_RE.test(text)
}
