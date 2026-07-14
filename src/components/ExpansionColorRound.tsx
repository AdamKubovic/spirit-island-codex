/**
 * ROUND 05 (legibility-pass) — THROWAWAY variant scaffolding, delete on ship.
 *
 * Three treatments for colouring expansion across the Archive (grid + rows views), gated on
 * `?expansionColor=A|B|C` (the panel-theming #02 pattern: namespaced param, floating switcher,
 * byte-identical app without the param). Colour always comes from `expansionColorFor()` — a card
 * whose raw expansion string doesn't normalize renders with no colour in every variant, honest
 * absence per CLAUDE.md's rule, never a guessed fallback.
 *
 * - A — left-edge stripe: the `SpiritTile` idiom, carried onto grid tiles and rows.
 * - B — background tint: a low-opacity wash of the expansion colour across the tile/row surface.
 * - C — solid chip: the `SpiritTile` chip idiom, as a small tile-corner badge / row pill.
 *
 * Deleting the round = this file + its `deck.css` block (search "ROUND 05") + the variant prop
 * threaded through CardGrid/AdversaryGrid/CardRows/OtherCardRows/AdversaryRows + the switcher
 * call site in CardsTab. `expansionColorFor` (tagColors.ts) and the new expansion column in
 * CardRows are NOT scaffolding — they survive the round regardless of which letter wins.
 */
import type { CSSProperties } from 'react'

export type ExpansionVariant = 'A' | 'B' | 'C'

const VARIANTS: ExpansionVariant[] = ['A', 'B', 'C']

/** The one place a variant + a colour become inline style, shared by every grid/rows component
 * in the round so A/B's treatment can't drift between surfaces. `color` is `undefined` for a
 * card whose raw expansion string didn't normalize — honest absence, no style applied. Variant
 * C (chip) doesn't use inline style on the tile/row itself; see `expansion-chip` usages. */
export function expansionVariantStyle(variant: ExpansionVariant | undefined, color: string | undefined): CSSProperties | undefined {
  if (!color || !variant) return undefined
  if (variant === 'A') return { borderLeftWidth: '4px', borderLeftStyle: 'solid', borderLeftColor: color }
  if (variant === 'B') return { background: `${color}33` }
  return undefined
}

export function readExpansionVariant(): ExpansionVariant | null {
  if (typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('expansionColor')
  return v === 'A' || v === 'B' || v === 'C' ? v : null
}

const LABEL: Record<ExpansionVariant, string> = {
  A: 'left-edge stripe',
  B: 'background tint',
  C: 'solid chip',
}

export function ExpansionVariantSwitcher({
  current,
  onPick,
}: {
  current: ExpansionVariant
  onPick: (v: ExpansionVariant) => void
}) {
  function go(v: ExpansionVariant) {
    const params = new URLSearchParams(window.location.search)
    params.set('expansionColor', v)
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
    onPick(v)
  }

  return (
    <div className="variant-switcher" role="group" aria-label="Expansion colour variant">
      <span className="variant-switcher-tag">ROUND 05 · {LABEL[current]}</span>
      <div className="variant-switcher-buttons">
        {VARIANTS.map((v) => (
          <button key={v} type="button" aria-pressed={v === current} data-active={v === current} onClick={() => go(v)}>
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
