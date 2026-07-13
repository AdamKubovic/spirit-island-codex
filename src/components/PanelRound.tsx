import type { Element, OCFDU } from '../domain/types'

/**
 * ROUND 02 (panel-theming) — THROWAWAY variant scaffolding, delete on ship (#03).
 *
 * Gated on `?panel=A|B|C` (namespaced param, the #20–#22 pattern): with no param the app is
 * byte-identical (readPanelVariant → null), so the modal renders exactly as it does today. With
 * the param the modal wears one of three panel-aligned treatments and a floating switcher
 * appears to flip between them. Every colour traces to `../../.scratch/panel-theming/
 * panel-vibe-sheet.md` (the #01 sampled palette), applied via the `.panel-A/B/C` CSS blocks in
 * deck.css (also marked delete-on-ship).
 *
 * Deleting the round = this file + its deck.css block + the four call sites in SpiritDetail.
 */
export type PanelVariant = 'A' | 'B' | 'C'

/** SSR-safe (smoke tests render on node with no `window`): returns null there, so the tested
 * markup is the untouched app. */
export function readPanelVariant(): PanelVariant | null {
  if (typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('panel')
  return v === 'A' || v === 'B' || v === 'C' ? v : null
}

const AXES: { key: keyof OCFDU; label: string }[] = [
  { key: 'offense', label: 'Offense' },
  { key: 'control', label: 'Control' },
  { key: 'fear', label: 'Fear' },
  { key: 'defense', label: 'Defense' },
  { key: 'utility', label: 'Utility' },
]
/** #11's settled scale, unchanged by the retheme: the track represents 5, transcribed 6s clamp
 * at a full node while the figure tells the truth. */
const TRACK_MAX = 5

/** The presence-track node idiom (variants A & B): five round stone-like nodes, one per axis,
 * each filled bottom-up by rating/5 (same math #23's bars use — the truth rules survive), the
 * true figure centred over the fill, label beneath. */
export function OcfduNodes({ ratings, elements }: { ratings: OCFDU; elements: Element[] }) {
  return (
    <div className="ocfdu-bars ocfdu-nodes">
      <div className="ocfdu-columns">
        {AXES.map(({ key, label }) => (
          <div className="ocfdu-column" key={key}>
            <span className="ocfdu-node">
              <span
                className="ocfdu-node-fill"
                style={{ height: `${Math.min(100, (ratings[key] / TRACK_MAX) * 100)}%` }}
              />
              <span className="ocfdu-node-value">{ratings[key]}</span>
            </span>
            <span className="ocfdu-bar-label">{label}</span>
          </div>
        ))}
      </div>
      {elements.length > 0 && (
        <div className="ocfdu-elements">
          <span className="ocfdu-elements-label">Elements</span>
          {elements.map((element) => (
            <span key={element} className="ocfdu-element-chip">
              {element}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const LABELS: Record<PanelVariant, string> = {
  A: 'A — light parchment + nodes',
  B: 'B — dark translation + nodes',
  C: 'C — dark + retinted bars',
}
const ORDER: PanelVariant[] = ['A', 'B', 'C']

/** Floating round switcher (the #20–#22 pattern): flips `?panel=` in the URL and re-renders.
 * Only shown once already in the round (a param is present), so the paramless app never carries
 * it. */
export function PanelSwitcher({
  current,
  onPick,
}: {
  current: PanelVariant
  onPick: (v: PanelVariant) => void
}) {
  function go(v: PanelVariant) {
    const params = new URLSearchParams(window.location.search)
    params.set('panel', v)
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
    onPick(v)
  }
  return (
    <div className="panel-switcher" role="group" aria-label="Panel theme variant">
      <span className="panel-switcher-tag">ROUND 02 · {LABELS[current]}</span>
      <div className="panel-switcher-buttons">
        {ORDER.map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={v === current}
            data-active={v === current}
            onClick={() => go(v)}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
