import { useState } from 'react'
import { expansionVariantStyle, type ExpansionVariant } from './ExpansionColorRound'
import { CardViewer } from './CardViewer'
import { expansionColorFor } from './tagColors'

/** Image-grid view of the Cards tab (v4 #04 variant A) — card art is how the owner recognises
 * cards. Lazy-loaded; tap enlarges via the shared CardViewer. Only needs a name, an image, and
 * (legibility-pass #05) an expansion string to colour, so it works for power cards and
 * fear/event/blight alike (v4 #13) without a second component. */
export function CardGrid({
  cards,
  variant,
}: {
  cards: { name: string; image: string; expansion?: string }[]
  /** ROUND 05 scaffolding — delete this prop and its uses on ship (see ExpansionColorRound.tsx). */
  variant?: ExpansionVariant
}) {
  const [enlarged, setEnlarged] = useState<{ src: string; alt: string } | null>(null)
  const base = import.meta.env.BASE_URL

  return (
    <div className="card-grid">
      {cards.map((card) => {
        const color = card.expansion ? expansionColorFor(card.expansion) : undefined
        return (
          <button
            key={card.name}
            type="button"
            className={variant ? `card-grid-tile card-grid-tile-variant-${variant}` : 'card-grid-tile'}
            style={expansionVariantStyle(variant, color)}
            onClick={() => setEnlarged({ src: `${base}${card.image}`, alt: card.name })}
          >
            <img src={`${base}${card.image}`} alt={card.name} loading="lazy" decoding="async" />
            {color && variant === 'C' && (
              <span className="expansion-chip expansion-chip-corner" style={{ background: color }}>
                {card.expansion}
              </span>
            )}
          </button>
        )
      })}
      {enlarged && <CardViewer src={enlarged.src} alt={enlarged.alt} onClose={() => setEnlarged(null)} />}
    </div>
  )
}
