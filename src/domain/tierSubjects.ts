import type { Configuration } from './configurations'
import type { PowerCard, TierListSubject } from './types'

export interface TierSubjectUniverse {
  subject: TierListSubject
  /** The key namespace a list of this subject's tier keys live in — configId for
   * configurations, card name for the card subjects (#12/ADR 0002: the power-card dataset
   * carries no other id). */
  idOf: (item: Configuration | PowerCard) => string
  items: (Configuration | PowerCard)[]
  total: number
}

/** Which items belong to a tier Subject — their universe and their id namespace — in one home.
 * The board, the canon test, and any future card list all derive it from here instead of each
 * re-filtering the power-card pool or deciding the key namespace by hand. */
export function subjectUniverse(
  subject: TierListSubject,
  configurations: Configuration[],
  powerCards: PowerCard[],
): TierSubjectUniverse {
  if (subject === 'configurations') {
    return {
      subject,
      idOf: (item) => (item as Configuration).configId,
      items: configurations,
      total: configurations.length,
    }
  }
  const pool = powerCards.filter((c) => c.kind === (subject === 'minor-powers' ? 'minor' : 'major'))
  return {
    subject,
    idOf: (item) => (item as PowerCard).name,
    items: pool,
    total: pool.length,
  }
}
