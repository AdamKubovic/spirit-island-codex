/**
 * PROTOTYPE — deck-dashboard #04 (fear/event view). THROWAWAY: delete or absorb after the
 * owner picks a variant. Three variants of the Fear/Event segments once the #02 valence
 * taxonomy exists, switchable via `?variant=A|B|C` on the Dashboard tab (sub-shape A: mounted
 * inside the real segments, real pickers, real density). Without the param, the shipped
 * segments render untouched.
 *
 * STUB RATINGS: the real impact/valence table does not exist yet (rubric + owner ratification
 * come with the follow-up spec). Every rating below is a deterministic name-hash — NOT data,
 * NOT judgment, never to be shipped. Distributions are skewed to match expectations (events
 * mostly harmful, fear mostly solid) so layouts read plausibly.
 *
 * Colors (dataviz-validated on --deck-bg #1c160e): diverging poles harmful #d97742 /
 * beneficial #4f9ad4 with neutral mixed — the app's accent green FAILS CVD separation against
 * the warm pole (deutan ΔE 7.1), hence blue for "good"; flagged for the owner. Fear impact is
 * magnitude, not polarity: sequential green ramp of the app accent.
 */
import { useEffect, useState } from 'react'
import type { OtherCard } from '../domain/types'
import { groupOtherCards } from '../domain/otherCardArrange'
import { CardViewer } from './CardViewer'

export type FearImpact = 1 | 2 | 3
export type EventValence = 'harmful' | 'mixed' | 'beneficial'

const VALENCE_ORDER: EventValence[] = ['harmful', 'mixed', 'beneficial']
const VALENCE_COLOR: Record<EventValence, string> = { harmful: '#d97742', mixed: '#948a78', beneficial: '#4f9ad4' }
const IMPACT_ORDER: FearImpact[] = [1, 2, 3]
const IMPACT_LABEL: Record<FearImpact, string> = { 1: 'minor', 2: 'solid', 3: 'major' }
// sequential (magnitude): one hue, light→dark, from the app's accent green
const IMPACT_COLOR: Record<FearImpact, string> = { 1: '#8fd7ab', 2: '#3fae6a', 3: '#1f6b3e' }

function hash(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return h
}

/** STUB — skewed name-hash, not a judgment. Events ~55% harmful / 30% mixed / 15% beneficial. */
export function stubValence(card: OtherCard): EventValence {
  const r = hash(card.name) % 100
  return r < 55 ? 'harmful' : r < 85 ? 'mixed' : 'beneficial'
}
/** STUB — skewed name-hash, not a judgment. Fear ~30% minor / 45% solid / 25% major. */
export function stubImpact(card: OtherCard): FearImpact {
  const r = hash(card.name) % 100
  return r < 30 ? 1 : r < 75 ? 2 : 3
}

interface Rated {
  card: OtherCard
  bucket: string // valence name or impact label
  color: string
}

function rateEvents(cards: OtherCard[]): Rated[] {
  return cards.map((card) => {
    const v = stubValence(card)
    return { card, bucket: v, color: VALENCE_COLOR[v] }
  })
}
function rateFear(cards: OtherCard[]): Rated[] {
  return cards.map((card) => {
    const i = stubImpact(card)
    return { card, bucket: IMPACT_LABEL[i], color: IMPACT_COLOR[i] }
  })
}

function bucketMeta(kind: 'fear' | 'event') {
  return kind === 'event'
    ? VALENCE_ORDER.map((v) => ({ key: v as string, color: VALENCE_COLOR[v] }))
    : IMPACT_ORDER.map((i) => ({ key: IMPACT_LABEL[i], color: IMPACT_COLOR[i] }))
}

const stubBanner = (
  <p style={{ color: 'var(--deck-warn)', fontSize: 12, border: '1px dashed var(--deck-warn)', padding: '4px 8px', borderRadius: 6 }}>
    PROTOTYPE — ratings are name-hash stubs, not judgments. Shapes only.
  </p>
)

/** One 100%-stacked bar with 2px surface gaps and direct labels. */
function StackedBar({ rated, kind }: { rated: Rated[]; kind: 'fear' | 'event' }) {
  const total = rated.length
  if (total === 0) return null
  return (
    <div style={{ display: 'flex', gap: 2, height: 26, borderRadius: 6, overflow: 'hidden', marginTop: 6 }}>
      {bucketMeta(kind).map(({ key, color }) => {
        const n = rated.filter((r) => r.bucket === key).length
        if (n === 0) return null
        return (
          <div
            key={key}
            title={`${key}: ${n} of ${total} (${Math.round((n / total) * 100)}%)`}
            style={{
              flex: n,
              background: color,
              display: 'grid',
              placeItems: 'center',
              color: '#10130f',
              font: '600 12px/1 var(--deck-mono)',
              minWidth: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {n / total > 0.12 ? `${key} ${Math.round((n / total) * 100)}%` : ''}
          </div>
        )
      })}
    </div>
  )
}

function Legend({ kind }: { kind: 'fear' | 'event' }) {
  return (
    <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 12, color: 'var(--deck-body)' }}>
      {bucketMeta(kind).map(({ key, color }) => (
        <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: color, display: 'inline-block' }} />
          {key}
        </span>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- variant A — headline stack
 * Hierarchy: answer the driving question first ("next draw: X% harmful") as a stat tile row,
 * then ONE stacked valence bar for the whole pool, then the existing facets each rebuilt as a
 * mini stacked bar (valence within tag/class), expansion facet dropped to earn its keep. */
function VariantA({ rated, kind, drawNoun }: { rated: Rated[]; kind: 'fear' | 'event'; drawNoun: string }) {
  const total = rated.length
  const meta = bucketMeta(kind)
  const headline = meta[kind === 'event' ? 0 : 2] // events: harmful; fear: major
  const headlineN = rated.filter((r) => r.bucket === headline.key).length
  const groups = groupOtherCards(rated.map((r) => r.card), 'subtype')
  return (
    <div>
      {stubBanner}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {meta.map(({ key, color }) => {
          const n = rated.filter((r) => r.bucket === key).length
          return (
            <div key={key} style={{ background: 'var(--deck-panel)', border: '1px solid var(--deck-line-soft)', borderRadius: 8, padding: '10px 14px', minWidth: 110 }}>
              <div style={{ font: '600 22px/1.1 var(--deck-mono)', color: 'var(--deck-text)' }}>{total ? Math.round((n / total) * 100) : 0}%</div>
              <div style={{ fontSize: 12, color: 'var(--deck-dim)', marginTop: 2 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: 'inline-block', marginRight: 5 }} />
                {key} {drawNoun}
              </div>
            </div>
          )
        })}
      </div>
      <p style={{ fontSize: 12, color: 'var(--deck-dim)', marginTop: 6 }}>
        Next-{drawNoun} odds equal pool share — a full pool, nothing drawn. Headline: {Math.round((headlineN / Math.max(1, total)) * 100)}% {headline.key}.
      </p>
      <StackedBar rated={rated} kind={kind} />
      <Legend kind={kind} />
      <h3>{kind === 'event' ? 'By event class' : 'By fear tag'}</h3>
      <div className="deck-pool-bars">
        {groups.map(({ label, cards }) => {
          const sub = rated.filter((r) => cards.includes(r.card))
          return (
            <div className="deck-pool-row" key={label}>
              <span className="deck-pool-label">{label}</span>
              <span style={{ display: 'flex', gap: 2, height: 10, borderRadius: 999, overflow: 'hidden', width: `${(cards.length / Math.max(1, total)) * 100}%`, minWidth: 24 }}>
                {bucketMeta(kind).map(({ key, color }) => {
                  const n = sub.filter((r) => r.bucket === key).length
                  return n > 0 ? <span key={key} style={{ flex: n, background: color }} title={`${label} · ${key}: ${n}`} /> : null
                })}
              </span>
              <span className="deck-element-count">{cards.length}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- variant B — crosstab matrix
 * Hierarchy: WHERE the good/bad lives. Rows = tag/class, columns = the three buckets, cells =
 * counts with a sequential fill; column headers carry the bucket color. Totals row on top. */
function VariantB({ rated, kind }: { rated: Rated[]; kind: 'fear' | 'event' }) {
  const meta = bucketMeta(kind)
  const groups = groupOtherCards(rated.map((r) => r.card), 'subtype')
  const total = rated.length
  const max = Math.max(1, ...groups.flatMap(({ cards }) => meta.map(({ key }) => rated.filter((r) => cards.includes(r.card) && r.bucket === key).length)))
  return (
    <div>
      {stubBanner}
      <table style={{ borderCollapse: 'separate', borderSpacing: 2, marginTop: 8 }}>
        <thead>
          <tr>
            <th />
            {meta.map(({ key, color }) => (
              <th key={key} style={{ fontSize: 12, color: 'var(--deck-body)', fontWeight: 600, padding: '2px 10px' }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: color, display: 'inline-block', marginRight: 5 }} />
                {key}
              </th>
            ))}
          </tr>
          <tr>
            <th style={{ fontSize: 12, textAlign: 'right', color: 'var(--deck-dim)', padding: '2px 8px' }}>all cards</th>
            {meta.map(({ key }) => {
              const n = rated.filter((r) => r.bucket === key).length
              return (
                <td key={key} style={{ textAlign: 'center', font: '600 13px/1 var(--deck-mono)', color: 'var(--deck-text)', background: 'var(--deck-panel)', borderRadius: 4, padding: '6px 10px' }}>
                  {n} <span style={{ color: 'var(--deck-dim)', fontWeight: 400 }}>({total ? Math.round((n / total) * 100) : 0}%)</span>
                </td>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {groups.map(({ label, cards }) => (
            <tr key={label}>
              <td style={{ fontSize: 13, textAlign: 'right', color: 'var(--deck-text)', padding: '2px 8px', whiteSpace: 'nowrap' }}>{label}</td>
              {meta.map(({ key, color }) => {
                const n = rated.filter((r) => cards.includes(r.card) && r.bucket === key).length
                return (
                  <td
                    key={key}
                    title={`${label} · ${key}: ${n}`}
                    style={{
                      textAlign: 'center',
                      font: '12px/1 var(--deck-mono)',
                      color: n ? 'var(--deck-text)' : 'var(--deck-dim)',
                      background: n ? `color-mix(in oklab, ${color} ${20 + (n / max) * 55}%, var(--deck-panel-2))` : 'var(--deck-panel-2)',
                      borderRadius: 4,
                      padding: '6px 10px',
                      minWidth: 44,
                    }}
                  >
                    {n || '·'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <Legend kind={kind} />
    </div>
  )
}

/* ---------------------------------------------------------------- variant C — card wall
 * Hierarchy: the individual cards. Every card is a chip colored by its bucket, grouped by
 * tag/class, name on the chip — counts are implicit, browsing is the point. */
function VariantC({ rated, kind }: { rated: Rated[]; kind: 'fear' | 'event' }) {
  const groups = groupOtherCards(rated.map((r) => r.card), 'subtype')
  return (
    <div>
      {stubBanner}
      <Legend kind={kind} />
      {groups.map(({ label, cards }) => (
        <div key={label} style={{ marginTop: 10 }}>
          <h4 style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--deck-dim)', fontWeight: 600 }}>
            {label} · {cards.length}
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {rated
              .filter((r) => cards.includes(r.card))
              .map(({ card, bucket, color }) => (
                <span
                  key={card.name}
                  title={`${card.name} — ${bucket} (${card.expansion})`}
                  style={{
                    fontSize: 11,
                    color: 'var(--deck-text)',
                    background: 'var(--deck-panel)',
                    border: '1px solid var(--deck-line-soft)',
                    borderLeft: `4px solid ${color}`,
                    borderRadius: 5,
                    padding: '3px 7px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {card.name}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- variant D — round 2 hybrid
 * Owner's verdict direction (2026-07-21): A's headline stack, but every bucket and every
 * bucket×group intersection is CLICKABLE and expands to C's card chips filtered to it —
 * "show me the major removal cards". All counts carry percentages in brackets. */
function VariantD({ rated, kind, drawNoun }: { rated: Rated[]; kind: 'fear' | 'event'; drawNoun: string }) {
  const total = rated.length
  const meta = bucketMeta(kind)
  const groups = groupOtherCards(rated.map((r) => r.card), 'subtype')
  // one selection: a bucket alone (group=null) or a bucket×group intersection
  const [picked, setPicked] = useState<{ bucket: string; group: string | null } | null>(null)
  // round 3: hover a chip → floating card image preview; click → the app's CardViewer enlarge
  const [hovered, setHovered] = useState<{ card: OtherCard; x: number; y: number } | null>(null)
  const [enlarged, setEnlarged] = useState<OtherCard | null>(null)
  const imgBase = import.meta.env.BASE_URL
  const pct = (n: number) => `${total ? Math.round((n / total) * 100) : 0}%`
  function toggle(bucket: string, group: string | null) {
    setPicked((p) => (p && p.bucket === bucket && p.group === group ? null : { bucket, group }))
  }
  const pickedCards = picked
    ? rated.filter(
        (r) =>
          r.bucket === picked.bucket &&
          (picked.group === null || (groups.find((g) => g.label === picked.group)?.cards.includes(r.card) ?? false)),
      )
    : []
  const chipWall = picked && (
    <div style={{ margin: '8px 0 4px', padding: '8px 10px', background: 'var(--deck-panel-2)', border: '1px solid var(--deck-line-soft)', borderRadius: 8 }}>
      <div style={{ fontSize: 12, color: 'var(--deck-dim)', marginBottom: 6 }}>
        {picked.bucket}
        {picked.group ? ` × ${picked.group}` : ''} · {pickedCards.length} card{pickedCards.length === 1 ? '' : 's'} ({pct(pickedCards.length)})
        <button type="button" onClick={() => setPicked(null)} style={{ marginLeft: 10, background: 'none', border: '1px solid var(--deck-line)', borderRadius: 4, color: 'var(--deck-body)', cursor: 'pointer', fontSize: 11, padding: '1px 7px' }}>
          clear
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {pickedCards.map(({ card, bucket, color }) => (
          <button
            key={card.name}
            type="button"
            title={`${card.name} — ${bucket} (${card.expansion})`}
            onClick={() => setEnlarged(card)}
            onMouseEnter={(e) => {
              const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
              setHovered({ card, x: r.left, y: r.bottom })
            }}
            onMouseLeave={() => setHovered(null)}
            style={{ fontSize: 11, color: 'var(--deck-text)', background: 'var(--deck-panel)', border: '1px solid var(--deck-line-soft)', borderLeft: `4px solid ${color}`, borderRadius: 5, padding: '3px 7px', whiteSpace: 'nowrap', cursor: 'zoom-in' }}
          >
            {card.name}
          </button>
        ))}
      </div>
    </div>
  )
  const hoverPreview = hovered && !enlarged && (
    <img
      src={`${imgBase}${hovered.card.image}`}
      alt={hovered.card.name}
      style={{
        position: 'fixed',
        left: Math.min(hovered.x, window.innerWidth - 260),
        top: Math.min(hovered.y + 6, window.innerHeight - 360),
        width: 240,
        borderRadius: 10,
        boxShadow: '0 8px 28px rgba(0,0,0,0.6)',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    />
  )
  return (
    <div>
      {stubBanner}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {meta.map(({ key, color }) => {
          const n = rated.filter((r) => r.bucket === key).length
          const active = picked?.bucket === key && picked.group === null
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key, null)}
              style={{
                background: active ? 'var(--deck-accent-bg)' : 'var(--deck-panel)',
                border: `1px solid ${active ? 'var(--deck-accent)' : 'var(--deck-line-soft)'}`,
                borderRadius: 8,
                padding: '10px 14px',
                minWidth: 118,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ font: '600 22px/1.1 var(--deck-mono)', color: 'var(--deck-text)' }}>
                {pct(n)} <span style={{ fontSize: 13, color: 'var(--deck-dim)', fontWeight: 400 }}>({n})</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--deck-dim)', marginTop: 2 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: 'inline-block', marginRight: 5 }} />
                {key} {drawNoun}
              </div>
            </button>
          )
        })}
      </div>
      <p style={{ fontSize: 12, color: 'var(--deck-dim)', marginTop: 6 }}>
        Next-{drawNoun} odds equal pool share — a full pool, nothing drawn. Click a tile or a bar segment to list its cards.
      </p>
      <StackedBar rated={rated} kind={kind} />
      <Legend kind={kind} />
      {picked && picked.group === null && chipWall}
      <h3>{kind === 'event' ? 'By event class' : 'By fear tag'}</h3>
      <div className="deck-pool-bars">
        {groups.map(({ label, cards }) => {
          const sub = rated.filter((r) => cards.includes(r.card))
          return (
            <div key={label}>
              <div className="deck-pool-row">
                <span className="deck-pool-label">{label}</span>
                <span style={{ display: 'flex', gap: 2, height: 12, borderRadius: 999, overflow: 'hidden', width: `${(cards.length / Math.max(1, total)) * 100}%`, minWidth: 24 }}>
                  {meta.map(({ key, color }) => {
                    const n = sub.filter((r) => r.bucket === key).length
                    const active = picked?.bucket === key && picked.group === label
                    return n > 0 ? (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggle(key, label)}
                        title={`${label} × ${key}: ${n} (${pct(n)}) — click to list`}
                        style={{ flex: n, background: color, border: 'none', cursor: 'pointer', padding: 0, outline: active ? '2px solid var(--deck-text)' : 'none', outlineOffset: -2 }}
                      />
                    ) : null
                  })}
                </span>
                <span className="deck-element-count" style={{ whiteSpace: 'nowrap' }}>
                  {cards.length} ({pct(cards.length)})
                </span>
              </div>
              {picked && picked.group === label && chipWall}
            </div>
          )
        })}
      </div>
      {hoverPreview}
      {enlarged && <CardViewer src={`${imgBase}${enlarged.image}`} alt={enlarged.name} onClose={() => setEnlarged(null)} />}
    </div>
  )
}

/* ---------------------------------------------------------------- switcher + host */
const VARIANTS = ['A', 'B', 'C', 'D'] as const
export type PrototypeVariant = (typeof VARIANTS)[number]
const VARIANT_NAME: Record<PrototypeVariant, string> = { A: 'Headline stack', B: 'Crosstab matrix', C: 'Card wall', D: 'Headline + drill (round 2)' }

export function readPrototypeVariant(): PrototypeVariant | null {
  if (import.meta.env.PROD || typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('variant')?.toUpperCase()
  return (VARIANTS as readonly string[]).includes(v ?? '') ? (v as PrototypeVariant) : null
}

function setVariantParam(v: PrototypeVariant) {
  const url = new URL(window.location.href)
  url.searchParams.set('variant', v)
  window.history.replaceState(null, '', url)
}

export function Prototype04FearEvent({ cards, kind, variant, onVariant }: { cards: OtherCard[]; kind: 'fear' | 'event'; variant: PrototypeVariant; onVariant: (v: PrototypeVariant) => void }) {
  const rated = kind === 'event' ? rateEvents(cards) : rateFear(cards)
  const drawNoun = kind === 'event' ? 'event' : 'card'

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      const i = VARIANTS.indexOf(variant)
      if (e.key === 'ArrowLeft') cycle(VARIANTS[(i + VARIANTS.length - 1) % VARIANTS.length])
      if (e.key === 'ArrowRight') cycle(VARIANTS[(i + 1) % VARIANTS.length])
    }
    function cycle(v: PrototypeVariant) {
      setVariantParam(v)
      onVariant(v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [variant, onVariant])

  const i = VARIANTS.indexOf(variant)
  return (
    <div>
      {variant === 'A' && <VariantA rated={rated} kind={kind} drawNoun={drawNoun} />}
      {variant === 'B' && <VariantB rated={rated} kind={kind} />}
      {variant === 'C' && <VariantC rated={rated} kind={kind} />}
      {variant === 'D' && <VariantD rated={rated} kind={kind} drawNoun={drawNoun} />}
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: '#000',
          color: '#fff',
          borderRadius: 999,
          padding: '8px 14px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          zIndex: 50,
          font: '600 13px/1 var(--deck-mono)',
        }}
      >
        <button
          type="button"
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 15 }}
          onClick={() => {
            const v = VARIANTS[(i + VARIANTS.length - 1) % VARIANTS.length]
            setVariantParam(v)
            onVariant(v)
          }}
        >
          ←
        </button>
        <span>
          {variant} — {VARIANT_NAME[variant]}
        </span>
        <button
          type="button"
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 15 }}
          onClick={() => {
            const v = VARIANTS[(i + 1) % VARIANTS.length]
            setVariantParam(v)
            onVariant(v)
          }}
        >
          →
        </button>
      </div>
    </div>
  )
}
