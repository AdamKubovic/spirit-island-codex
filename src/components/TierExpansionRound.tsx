/**
 * ROUND 09 (legibility-pass) — THROWAWAY variant scaffolding, delete on ship.
 *
 * Three treatments for colouring expansion on the tier board (`TierTile` + `CardTile`), gated on
 * `?tierExpansion=A|B|C` — the same idiom ticket 05's Archive round used (namespaced param,
 * floating switcher, byte-identical app without the param). Colour always comes from
 * `expansionColorFor()`; a card/spirit/aspect whose expansion string doesn't normalize renders
 * with no colour in every variant, honest absence per CLAUDE.md, never a guessed fallback.
 *
 * - A — left-edge stripe: the `SpiritTile`/Archive-A idiom, carried onto tier tiles.
 * - B — background tint: a low-opacity wash. Ticket 05 found this invisible on full-bleed art
 *   tiles (Archive grids) — tier tiles are also full-bleed art, so expect the same result here;
 *   the round still renders it live so the owner can confirm rather than take that on faith.
 * - C — solid chip: the owner's Archive pick, a corner badge.
 *
 * Deleting the round = this file + its `deck.css` block (search "ROUND 09") + the variant prop
 * threaded through `TierTile`/`CardTile` + the switcher call site in `TierBoard.tsx`. The corner-
 * chip/tint CSS classes are shared with ticket 05's shipped C treatment where identical (see
 * `.expansion-chip` / `.expansion-chip-corner`) — only tier-board-specific rules live here.
 */
import type { CSSProperties } from 'react'

export type TierExpansionVariant = 'A' | 'B' | 'C'

const VARIANTS: TierExpansionVariant[] = ['A', 'B', 'C']

export function readTierExpansionVariant(): TierExpansionVariant | null {
  if (typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('tierExpansion')
  return v === 'A' || v === 'B' || v === 'C' ? v : null
}

const LABEL: Record<TierExpansionVariant, string> = {
  A: 'left-edge stripe',
  B: 'background tint',
  C: 'solid chip',
}

/** The one place a variant + a colour become inline style, shared by TierTile and CardTile.
 * `color` is `undefined` for a card/spirit/aspect whose expansion string didn't normalize —
 * honest absence, no style applied. Variant C doesn't use inline style on the tile itself; see
 * `expansion-chip` usages. */
export function tierExpansionVariantStyle(variant: TierExpansionVariant | undefined, color: string | undefined): CSSProperties | undefined {
  if (!color || !variant) return undefined
  if (variant === 'A') return { borderLeftWidth: '4px', borderLeftStyle: 'solid', borderLeftColor: color, boxSizing: 'border-box' }
  if (variant === 'B') return { background: `${color}33` }
  return undefined
}

export function TierExpansionVariantSwitcher({
  current,
  onPick,
}: {
  current: TierExpansionVariant
  onPick: (v: TierExpansionVariant) => void
}) {
  function go(v: TierExpansionVariant) {
    const params = new URLSearchParams(window.location.search)
    params.set('tierExpansion', v)
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
    onPick(v)
  }

  return (
    <div className="variant-switcher" role="group" aria-label="Tier board expansion colour variant">
      <span className="variant-switcher-tag">ROUND 09 · {LABEL[current]}</span>
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
