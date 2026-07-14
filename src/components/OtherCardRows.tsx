import { useState } from 'react'
import type { OtherCard } from '../domain/types'
import { expansionVariantStyle, type ExpansionVariant } from './ExpansionColorRound'
import { CardViewer } from './CardViewer'
import { expansionColorFor } from './tagColors'

/** Compact-rows view for fear/event/blight (v4 #13) — the same shape as CardRows, but without
 * elements/cost/speed columns, since #01 found these types don't carry those fields. */
export function OtherCardRows({ cards, variant }: { cards: OtherCard[]; variant?: ExpansionVariant }) {
  const [enlarged, setEnlarged] = useState<{ src: string; alt: string } | null>(null)
  const base = import.meta.env.BASE_URL

  return (
    <ul className="card-rows">
      {cards.map((card) => {
        const color = expansionColorFor(card.expansion)
        return (
          <li key={card.name}>
            <button
              type="button"
              className="card-row"
              style={expansionVariantStyle(variant, color)}
              onClick={() => setEnlarged({ src: `${base}${card.image}`, alt: card.name })}
            >
              <span className="card-row-type" data-kind={card.kind}>
                {card.kind}
              </span>
              <span className="card-row-name">{card.name}</span>
              <span
                className={color && variant === 'C' ? 'card-row-expansion expansion-chip' : 'card-row-expansion'}
                style={color && variant === 'C' ? { background: color } : undefined}
              >
                {card.expansion}
              </span>
            </button>
          </li>
        )
      })}
      {enlarged && <CardViewer src={enlarged.src} alt={enlarged.alt} onClose={() => setEnlarged(null)} />}
    </ul>
  )
}
