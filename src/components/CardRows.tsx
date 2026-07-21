import { useState } from 'react'
import type { Element, PowerCard } from '../domain/types'
import { CardViewer } from './CardViewer'
import { cardKindColor, cardSpeedColor, expansionColorFor } from './tagColors'

const ELEMENT_ICON: Record<Element, string> = {
  Sun: 'sun',
  Moon: 'moon',
  Fire: 'fire',
  Air: 'air',
  Water: 'water',
  Earth: 'earth',
  Plant: 'plant',
  Animal: 'animal',
}

/** Compact-rows view of the Cards tab (v4 #04 variant B) — scans fast at 375px. Tap opens the
 * same CardViewer the grid uses. Real in-game element icons, not emoji (owner's request after
 * judging the prototype).
 *
 * legibility-pass #05: gained an expansion column — Powers rows were the one rows view without
 * one (OtherCardRows/AdversaryRows already showed it as plain text). Owner picked variant C
 * (solid chip): the column renders as a coloured pill, matching SpiritTile's chip idiom. */
export function CardRows({ cards }: { cards: PowerCard[] }) {
  const [enlarged, setEnlarged] = useState<{ src: string; alt: string } | null>(null)
  const base = import.meta.env.BASE_URL

  return (
    <ul className="card-rows">
      <li className="card-rows-head" aria-hidden="true">
        <span className="card-row-type">Type</span>
        <span className="card-row-name">Name</span>
        <span className="card-row-elements">Elements</span>
        <span className="card-row-cost">Cost</span>
        <span className="card-row-speed">Speed</span>
        <span className="card-row-expansion">Expansion</span>
      </li>
      {cards.map((card) => {
        const color = expansionColorFor(card.expansion)
        return (
          <li key={card.name}>
            <button type="button" className="card-row" onClick={() => setEnlarged({ src: `${base}${card.image}`, alt: card.name })}>
              <span className="card-row-type card-row-pill" style={{ background: cardKindColor(card.kind) }}>
                {card.kind}
              </span>
              <span className="card-row-name">
                {card.name}
                {card.kind === 'unique' && <span className="card-row-spirit"> — {card.spiritName}</span>}
              </span>
              <span className="card-row-elements">
                {card.elements.map((e, i) => (
                  <img key={`${e}-${i}`} src={`${base}elements/${ELEMENT_ICON[e]}.webp`} alt={e} className="card-row-element-icon" />
                ))}
              </span>
              <span className="card-row-cost">{card.cost}</span>
              <span className="card-row-speed card-row-pill" style={{ background: cardSpeedColor(card.speed) }}>
                {card.speed}
              </span>
              <span
                className={color ? 'card-row-expansion expansion-chip' : 'card-row-expansion'}
                style={color ? { background: color } : undefined}
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
