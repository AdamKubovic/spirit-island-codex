import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { toConfigId } from '../domain/configurations'
import { stepGalleryIndex } from '../domain/gallerySequence'
import { tierStore } from '../domain/tierStore'
import type { Spirit } from '../domain/types'
import { CardViewer } from './CardViewer'
import { OcfduBars } from './OcfduBars'
import { PlaceholderArt } from './PlaceholderArt'
import { SpiritArt } from './SpiritArt'
import { COMPLEXITY_LEVEL, expansionChipColor, PANEL_COLOR, tagColor, tagLabel } from './tagColors'
import { activeConfigTier, tierColor } from './tierColors'

/** panel-theming #03: the modal's one colour source, injected as CSS custom properties on the
 * modal root and consumed by the `.modal.spirit-detail` rules in deck.css. */
function panelVars(colour: Record<'surface' | 'raised' | 'edge' | 'text' | 'body' | 'accent', string>): CSSProperties {
  return {
    '--panel-surface': colour.surface,
    '--panel-raised': colour.raised,
    '--panel-edge': colour.edge,
    '--panel-text': colour.text,
    '--panel-body': colour.body,
    '--panel-accent': colour.accent,
  } as CSSProperties
}

const PANEL_VARS = panelVars(PANEL_COLOR)

/** Coloured tier chip for one configuration, read from the active configurations-list (#17).
 * Colour is the label's position in that list's own vocabulary; an absent key renders an
 * outlined "unrated" chip — honest absence, never a defaulted tier (ADR 0001). A label outside
 * the vocabulary (a stale override) also reads as unrated, the same rule `groupByTier` applies
 * on the board, so chip and board can never disagree. */
function TierChip({ configId }: { configId: string }) {
  const tier = activeConfigTier(configId)
  if (!tier) return <span className="tier-chip tier-chip-unrated">unrated</span>
  return (
    <span className="tier-chip" style={{ backgroundColor: tierColor(tier.position) }}>
      {tier.label}
    </span>
  )
}

const ARROW: Record<string, string> = { up: '↑ more complex', down: '↓ simpler', same: '→ same complexity' }

/** Matches the slug asset-archive #03/#07 used when naming aspect card derivatives
 * (`public/aspects/<spiritId>-<slug>.webp`): lowercase, non-alphanumeric runs collapsed to `_`. */
function aspectSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

/** An image at a conventional path, falling back to the spirit's placeholder tile on a missing
 * file or load failure - #12's hard requirement that 259 assets need not all arrive at once. */
function DetailImage({
  spirit,
  src,
  alt,
  className,
}: {
  spirit: Spirit
  src: string
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  if (failed) return <PlaceholderArt spirit={spirit} className={className} />
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

/**
 * Everything the app already holds about a spirit, plus its panel and starting-card images
 * (#12) once #11 has sourced them. No rules text is transcribed - growth options, presence
 * tracks, innate powers and card effects are legible on the images themselves, not turned into
 * fields. An aspect configuration has no images of its own; it shows the base spirit's panel
 * and cards (the repo has no data on which aspects change which cards) plus its own `delta`.
 */
export function SpiritDetail({
  spirit,
  onClose,
  highlightAspect,
}: {
  spirit: Spirit
  onClose: () => void
  /** #17: opened from an aspect tile — scroll to the Aspects section with this row highlighted. */
  highlightAspect?: string
}) {
  // #01: panel front, panel back, then starting cards 0-3 (only the ones that exist), as one
  // arrow-navigable sequence. `index` is present only for images in this sequence - an aspect
  // image's `enlarged` has no index, so it stays single-image/click-to-close only.
  const [enlarged, setEnlarged] = useState<{ src: string; alt: string; index?: number } | null>(null)
  // "Lands scrolled" is a one-time act: without this guard the inline callback ref re-fires on
  // every re-render (e.g. enlarging a card image) and snaps scroll back to the aspect row.
  const scrolledToAspect = useRef(false)
  const activeList = tierStore.getActiveList()
  const base = import.meta.env.BASE_URL
  const level = COMPLEXITY_LEVEL[spirit.complexity]
  const expansionColor = expansionChipColor(spirit.expansion)

  const galleryImages = useMemo(() => {
    const images = [
      { src: `${base}panels/${spirit.id}-front.webp`, alt: `${spirit.name} panel front` },
      { src: `${base}panels/${spirit.id}-back.webp`, alt: `${spirit.name} panel back` },
    ]
    spirit.startingCards?.forEach((cardName, i) => {
      images.push({ src: `${base}cards/${spirit.id}-${i}.webp`, alt: cardName })
    })
    return images
  }, [spirit, base])

  useEffect(() => {
    if (enlarged?.index === undefined) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      setEnlarged((current) => {
        if (current?.index === undefined) return current
        const next = stepGalleryIndex(current.index, e.key === 'ArrowRight' ? 'right' : 'left', galleryImages.length)
        return { ...galleryImages[next], index: next }
      })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enlarged?.index, galleryImages])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal spirit-detail"
        style={PANEL_VARS}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={spirit.name}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="spirit-detail-head">
          <SpiritArt spirit={spirit} />
          <div>
            <h2>{spirit.name}</h2>
            <div className="spirit-tile-complexity" title={spirit.complexity}>
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={n <= level ? 'spirit-tile-dot spirit-tile-dot-filled' : 'spirit-tile-dot'} />
              ))}
              <span className="spirit-tile-complexity-label">{spirit.complexity}</span>
            </div>
            <div className="spirit-tile-chip-row">
              <span className="spirit-tile-chip" style={{ background: expansionColor }}>
                {spirit.expansion}
              </span>
            </div>
            {spirit.tags.length > 0 && (
              <div className="spirit-tile-chip-row spirit-tile-tags">
                {spirit.tags.map((tag) => (
                  <span
                    key={tag}
                    className="spirit-tile-tag-chip"
                    style={{ borderColor: tagColor(tag), color: tagColor(tag) }}
                  >
                    {tagLabel(tag)}
                  </span>
                ))}
              </div>
            )}
            <p className="meta spirit-detail-tier-line">
              Tier ({activeList.name}): <TierChip configId={spirit.id} />
            </p>
          </div>
        </div>

        <p>{spirit.summary}</p>

        <div className="spirit-detail-body">
          <OcfduBars ratings={spirit.ratings} elements={spirit.elements} />
          {spirit.ratingsSource === 'estimate' && (
            <p className="meta">
              These OCFDU ratings are an estimate — nobody has verified them against a printed source.
            </p>
          )}
        </div>

        <h3>Panel</h3>
        <div className="spirit-detail-panels">
          {galleryImages.slice(0, 2).map(({ src, alt }, i) => (
            <button key={src} type="button" className="spirit-detail-panel" onClick={() => setEnlarged({ src, alt, index: i })}>
              <DetailImage spirit={spirit} src={src} alt={alt} />
            </button>
          ))}
        </div>

        {spirit.startingCards && (
          <>
            <h3>Starting cards</h3>
            <ul className="spirit-detail-cards">
              {spirit.startingCards.map((cardName, i) => {
                const { src, alt } = galleryImages[i + 2]
                return (
                  <li key={cardName}>
                    <button
                      type="button"
                      className="spirit-detail-card"
                      onClick={() => setEnlarged({ src, alt, index: i + 2 })}
                    >
                      <DetailImage spirit={spirit} src={src} alt={alt} />
                      <span className="spirit-detail-card-name">{cardName}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}

        {spirit.aspects.length > 0 && (
          <>
            <h3>Aspects</h3>
            <ul className="aspects spirit-detail-aspects">
              {spirit.aspects.map((aspect) => {
                const src = `${base}aspects/${spirit.id}-${aspectSlug(aspect.name)}.webp`
                const highlighted = aspect.name === highlightAspect
                return (
                  <li
                    key={aspect.name}
                    className={highlighted ? 'aspect-row-highlight' : undefined}
                    ref={
                      highlighted
                        ? (el) => {
                            if (el && !scrolledToAspect.current) {
                              scrolledToAspect.current = true
                              el.scrollIntoView({ block: 'center' })
                            }
                          }
                        : undefined
                    }
                  >
                    <button
                      type="button"
                      className="spirit-detail-aspect-card"
                      onClick={() => setEnlarged({ src, alt: `${spirit.name} (${aspect.name})` })}
                    >
                      <DetailImage spirit={spirit} src={src} alt={`${spirit.name} (${aspect.name}) aspect card`} />
                    </button>
                    <div className="spirit-detail-aspect-text">
                      <TierChip configId={toConfigId(spirit.id, aspect.name)} /> <strong>{aspect.name}</strong>
                      {aspect.complexityDelta && <span className="meta"> · {ARROW[aspect.complexityDelta]}</span>}
                      {' — '}
                      {aspect.delta ?? <em className="meta">effect not transcribed yet</em>}
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>

      {enlarged && <CardViewer src={enlarged.src} alt={enlarged.alt} onClose={() => setEnlarged(null)} />}
    </div>
  )
}
