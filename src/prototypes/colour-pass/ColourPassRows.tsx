import { useState, type CSSProperties } from 'react'
import type { Element, PowerCard } from '../../domain/types'
import { CardRows } from '../../components/CardRows'
import { CardViewer } from '../../components/CardViewer'

/**
 * PROTOTYPE — phase-4 #21's variant round, awaiting the owner's pick. Three kind/speed chip
 * palettes on the real Powers rows (the one Archive view where minor/major/unique mix), gated
 * on `?colors=A|B|C` — namespaced away from #20's pending `?variant=` round so the two can't
 * collide. Nothing changes without the param. Every candidate keeps the locked calls: Fast is
 * a red, Slow is a blue, and no two kinds (nor the speeds) share a colour. Once the owner
 * picks, the winner ships properly into CardRows/deck.css with the pinning test, and this
 * file is deleted.
 *
 *   A  Tinted text    coloured type/speed text, saturated hues, no chrome
 *   B  Filled pills   solid rounded chips, muted hues, light text
 *   C  Outlined chips bordered chips, colour on border + text
 *
 * Hue disclosure for the pick (tagColors.ts's rule: chip systems stay tellable-apart): A reuses
 * Browse's TAG_COLOR hues verbatim (different treatment — tinted text vs filled chips); B/C sit
 * near the muted/saturated families, and B's Fast red matches #20's top difficulty band. If a
 * winner ships, its hues get separated from the colliding system per tagColors' own re-check
 * rule — the owner picks a TREATMENT here, exact shipped hues may shift a step.
 */
type ColourVariant = 'A' | 'B' | 'C'

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

/** One palette per variant. Keys: the three kinds plus the two speeds. */
type ChipKey = PowerCard['kind'] | PowerCard['speed']
const PALETTES: Record<ColourVariant, Record<ChipKey, string>> = {
  A: { minor: '#4fb84a', major: '#8a5ce0', unique: '#2fb8c4', Fast: '#e0475a', Slow: '#3f9de0' },
  B: { minor: '#6b8a52', major: '#8a5578', unique: '#557a99', Fast: '#a33232', Slow: '#2f5e8a' },
  C: { minor: '#7fb069', major: '#c65f8a', unique: '#d7b56a', Fast: '#d64545', Slow: '#4a90d9' },
}

function chipStyle(variant: ColourVariant, key: ChipKey): CSSProperties {
  const colour = PALETTES[variant][key]
  if (variant === 'A') return { color: colour }
  if (variant === 'B') return { background: colour, color: '#f2f2f2', borderRadius: 999, padding: '0.15rem 0.4rem' }
  return { color: colour, border: `1px solid ${colour}`, borderRadius: 999, padding: '0.1rem 0.4rem' }
}

function readColourVariant(): ColourVariant | null {
  const v = new URLSearchParams(window.location.search).get('colors')
  return v === 'A' || v === 'B' || v === 'C' ? v : null
}

function writeColourVariant(v: ColourVariant | null) {
  const url = new URL(window.location.href)
  if (v) url.searchParams.set('colors', v)
  else url.searchParams.delete('colors')
  window.history.replaceState(null, '', url)
}

/** Drop-in for the Powers rows branch: identical to `<CardRows cards={cards} />` unless
 * `?colors=` is in the URL (the #20 gate shape — the whole gate lives here, not in CardsTab). */
export function ColourPassRows({ cards }: { cards: PowerCard[] }) {
  const [variant, setVariant] = useState<ColourVariant | null>(readColourVariant)
  const [enlarged, setEnlarged] = useState<{ src: string; alt: string } | null>(null)
  const base = import.meta.env.BASE_URL
  const change = (v: ColourVariant | null) => {
    writeColourVariant(v)
    setVariant(v)
  }

  if (!variant) return <CardRows cards={cards} />
  return (
    <>
      <ul className="card-rows">
        {cards.map((card) => (
          <li key={card.name}>
            <button type="button" className="card-row" onClick={() => setEnlarged({ src: `${base}${card.image}`, alt: card.name })}>
              <span className="card-row-type" style={chipStyle(variant, card.kind)}>
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
              <span className="card-row-speed" style={chipStyle(variant, card.speed)}>
                {card.speed}
              </span>
            </button>
          </li>
        ))}
        {enlarged && <CardViewer src={enlarged.src} alt={enlarged.alt} onClose={() => setEnlarged(null)} />}
      </ul>
      <div
        style={{
          position: 'fixed',
          bottom: 12,
          left: 12,
          zIndex: 300,
          display: 'flex',
          gap: 6,
          alignItems: 'center',
          background: 'var(--deck-panel)',
          border: '1px solid var(--deck-line)',
          borderRadius: 999,
          padding: '0.3rem 0.5rem',
          font: '600 11px/1 var(--deck-mono)',
        }}
      >
        <span style={{ color: 'var(--deck-dim)' }}>#21</span>
        {(['A', 'B', 'C'] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={variant === v}
            onClick={() => change(v)}
            style={{
              border: '1px solid var(--deck-line)',
              borderRadius: 999,
              padding: '0.2rem 0.55rem',
              cursor: 'pointer',
              background: variant === v ? 'var(--deck-text)' : 'transparent',
              color: variant === v ? 'var(--deck-panel-2)' : 'var(--deck-text)',
            }}
          >
            {v}
          </button>
        ))}
        <button
          type="button"
          onClick={() => change(null)}
          style={{ border: 'none', background: 'transparent', color: 'var(--deck-dim)', cursor: 'pointer' }}
        >
          off
        </button>
      </div>
    </>
  )
}
