import { MY_COLLECTION_HREF } from '../domain/route'
import type { Complexity } from '../domain/types'
import { COMPLEXITY_LEVEL } from './tagColors'

/** ux-discoverability #07: the complexity dots + word, shared by the Browse tile and the spirit
 * detail modal. Each host wraps it in a `Term` (a button), so the markup stays in one place. */
export function ComplexityDots({ complexity }: { complexity: Complexity }) {
  const level = COMPLEXITY_LEVEL[complexity]
  return (
    <>
      {[1, 2, 3, 4].map((n) => (
        <span key={n} className={n <= level ? 'spirit-tile-dot spirit-tile-dot-filled' : 'spirit-tile-dot'} />
      ))}
      <span className="spirit-tile-complexity-label">{complexity}</span>
    </>
  )
}

/** ux-discoverability #04: the "you don't own this" note, made actionable — a link to Settings →
 * My collection. One component so every dimming surface reads the same words and routes the same
 * way. */
export function UnownedNote() {
  return (
    <a className="unowned-note" href={MY_COLLECTION_HREF}>
      · not in your collection
    </a>
  )
}

/** ux-discoverability #04: the "take me to My collection" affordance beside every hide-unowned
 * control (Browse, Recommend, Tier list). */
export function ManageCollectionLink() {
  return (
    <a className="deck-manage-collection" href={MY_COLLECTION_HREF}>
      Manage collection →
    </a>
  )
}
