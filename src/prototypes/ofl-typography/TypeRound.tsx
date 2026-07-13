import { useState } from 'react'

/**
 * PROTOTYPE — phase-4 #22's variant round, awaiting the owner's pick. Three OFL display-face
 * candidates on real spirit names (Browse tiles + the detail modal), gated on `?type=A|B|C` —
 * namespaced away from #20's `?variant=` and #21's `?colors=` pending rounds. Nothing changes
 * without the param; the candidates' font files load only while the round is on (all
 * self-hosted OFL, provenance in public/fonts/README.md). Once the owner picks, the winner
 * ships properly into deck.css (Browse + tier board + detail per the acceptance), the losing
 * font directories are deleted, and this file goes with them.
 *
 *   A  Mouse Memoirs  condensed, friendly — the community's heading lookalike
 *   B  Josefin Sans   geometric, elegant, light
 *   C  Lato (bold)    sturdy humanist workhorse
 */
type TypeVariant = 'A' | 'B' | 'C'

const FACE: Record<TypeVariant, { name: string; css: string }> = {
  A: { name: 'Mouse Memoirs', css: "'Mouse Memoirs', ui-sans-serif, sans-serif" },
  B: { name: 'Josefin Sans', css: "'Josefin Sans', ui-sans-serif, sans-serif" },
  C: { name: 'Lato', css: "'Lato', ui-sans-serif, sans-serif" },
}

/** Spirit-name surfaces the round restyles: Browse tiles and the detail modal head. */
const NAME_SELECTORS = '.spirit-tile h3, .spirit-tile-open h3, .spirit-detail-head h2'

// Runtime-injected string Vite never rewrites, so the base comes from the env like every
// other component's asset URL (deck.css's @font-face IS rewritten at build time).
const base = import.meta.env.BASE_URL
const FONT_FACES = `
@font-face { font-family: 'Mouse Memoirs'; src: url('${base}fonts/mouse-memoirs/MouseMemoirs-Regular.ttf') format('truetype'); font-display: swap; }
@font-face { font-family: 'Josefin Sans'; src: url('${base}fonts/josefin-sans/JosefinSans-Variable.ttf') format('truetype'); font-weight: 100 700; font-display: swap; }
@font-face { font-family: 'Lato'; src: url('${base}fonts/lato/Lato-Bold.ttf') format('truetype'); font-weight: 700; font-display: swap; }
`

function readTypeVariant(): TypeVariant | null {
  // Unlike the #20/#21 prototypes this mounts at App level, which the smoke suite renders
  // server-side — no window there, and the round is a no-op.
  if (typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('type')
  return v === 'A' || v === 'B' || v === 'C' ? v : null
}

function writeTypeVariant(v: TypeVariant | null) {
  const url = new URL(window.location.href)
  if (v) url.searchParams.set('type', v)
  else url.searchParams.delete('type')
  window.history.replaceState(null, '', url)
}

/** Mounted once in App; renders nothing without `?type=`. */
export function TypeRound() {
  const [variant, setVariant] = useState<TypeVariant | null>(readTypeVariant)
  const change = (v: TypeVariant | null) => {
    writeTypeVariant(v)
    setVariant(v)
  }

  if (!variant) return null
  return (
    <>
      <style>{`${FONT_FACES}\n${NAME_SELECTORS} { font-family: ${FACE[variant].css}; }`}</style>
      <div
        style={{
          position: 'fixed',
          bottom: 56,
          right: 12,
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
        <span style={{ color: 'var(--deck-dim)' }}>#22</span>
        {(['A', 'B', 'C'] as const).map((v) => (
          <button
            key={v}
            type="button"
            title={FACE[v].name}
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
