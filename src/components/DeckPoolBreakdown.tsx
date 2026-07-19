import type { OtherCardGroup } from '../domain/otherCardArrange'

/** v6 #11: a generic bar view over `groupOtherCards`' groups (fear tags, event classes, or an
 * expansion breakdown) — no odds column, since these pools carry no draw-N concept, unlike the
 * power decks' `DeckElementBars`. A multi-tag card's own count already lands in every group it
 * belongs to (the domain module's job); this component only renders what it's given. */
export function DeckPoolBreakdown({ groups, poolSize }: { groups: OtherCardGroup[]; poolSize: number }) {
  return (
    <div className="deck-pool-bars">
      {groups.map(({ label, cards }) => (
        <div className="deck-pool-row" key={label}>
          <span className="deck-pool-label">{label}</span>
          <span className="deck-element-track">
            <span className="deck-element-fill" style={{ width: `${poolSize === 0 ? 0 : Math.min(100, (cards.length / poolSize) * 100)}%` }} />
          </span>
          <span className="deck-element-count">{cards.length}</span>
        </div>
      ))}
    </div>
  )
}
