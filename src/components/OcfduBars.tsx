import type { Element, OCFDU } from '../domain/types'

const AXES: { key: keyof OCFDU; label: string }[] = [
  { key: 'offense', label: 'Offense' },
  { key: 'control', label: 'Control' },
  { key: 'fear', label: 'Fear' },
  { key: 'defense', label: 'Defense' },
  { key: 'utility', label: 'Utility' },
]

/** The track represents 5 (phase-4 #03's settled scale) — a 5-rated axis fills it. Three
 * spirits carry a transcribed 6 on one axis; the fill clamps at the full track and the value
 * figure tells the truth, rather than overflowing or rescaling every other spirit's bar. */
const TRACK_MAX = 5

/** The labelled-bars OCFDU profile that won the #03 prototype round: full-word axis labels,
 * thin accent bars, value figures, plus the Elements chip row the detail never showed. */
export function OcfduBars({ ratings, elements }: { ratings: OCFDU; elements: Element[] }) {
  return (
    <div className="ocfdu-bars">
      {AXES.map(({ key, label }) => (
        <div className="ocfdu-bar-row" key={key}>
          <span className="ocfdu-bar-label">{label}</span>
          <span className="ocfdu-bar-track">
            <span
              className="ocfdu-bar-fill"
              style={{ width: `${Math.min(100, (ratings[key] / TRACK_MAX) * 100)}%` }}
            />
          </span>
          <span className="ocfdu-bar-value">{ratings[key]}</span>
        </div>
      ))}
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
