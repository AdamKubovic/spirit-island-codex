/**
 * ROUND 04 (island-retheme) — THROWAWAY variant scaffolding, delete on ship.
 *
 * Ticket #04: now that the owner picked candidate A (light-parchment, ticket #02), does the
 * spirit detail modal's shipped `PANEL_COLOR` (dark umber-parchment, panel-theming #03) flip to
 * match, or stay dark deliberately as a "lantern" moment against the lighter shell? `?modal=
 * stay|flip` toggles between the shipped dark palette and `PANEL_COLOR_LIGHT` (`tagColors.ts`),
 * rendered live — intended to be viewed alongside `?theme=A` (ticket #02's shell), same as
 * ticket #03's `?chips=` param.
 *
 * Deleting the round = this file + `PANEL_COLOR_LIGHT` in `tagColors.ts` + the `modalVariant`
 * threading in `SpiritDetail.tsx` + the switcher call site in `AppShell.tsx`.
 */
export type ModalVariant = 'stay' | 'flip'

const VARIANTS: ModalVariant[] = ['stay', 'flip']

export function readModalVariant(): ModalVariant | null {
  if (typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('modal')
  return v === 'stay' || v === 'flip' ? v : null
}

const LABEL: Record<ModalVariant, string> = {
  stay: 'stays dark (shipped)',
  flip: 'flips to light',
}

export function ModalVariantSwitcher({ current, onPick }: { current: ModalVariant; onPick: (v: ModalVariant) => void }) {
  function go(v: ModalVariant) {
    const params = new URLSearchParams(window.location.search)
    params.set('modal', v)
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
    onPick(v)
  }

  return (
    <div className="variant-switcher" role="group" aria-label="Modal colour variant">
      <span className="variant-switcher-tag">ROUND 04 · {LABEL[current]}</span>
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
