import type { Spirit } from '../../domain/types'
import { COMPLEXITY_LEVEL, EXPANSION_COLOR, tagColor, tagLabel } from './palette'

/** v5 #08 PROTOTYPE — Variant G: "F's outlined tag chips, but expansion gets a solid chip that
 * matches the stripe colour exactly." Owner's pick after E vs F: F's lighter outlined tags won,
 * but the plain expansion text under the name felt under-styled next to F's tag chips - bring
 * back E's solid-chip treatment, just for expansion, using the exact same colour as the stripe
 * (not a different shade) so the two reinforce one signal instead of reading as two. */
export function VariantG({ spirits }: { spirits: Spirit[] }) {
  return (
    <ul className="tp-grid">
      {spirits.map((spirit) => {
        const level = COMPLEXITY_LEVEL[spirit.complexity]
        const expansionColor = EXPANSION_COLOR[spirit.expansion]
        return (
          <li key={spirit.id} className="tp-tile tp-tile-stripe" style={{ borderLeftColor: expansionColor }}>
            <div className="tp-name-row">
              <h3>{spirit.name}</h3>
              <span className="tp-complexity-dots" title={spirit.complexity}>
                {[1, 2, 3, 4].map((n) => (
                  <span key={n} className={n <= level ? 'tp-dot tp-dot-filled' : 'tp-dot'} />
                ))}
              </span>
            </div>
            <div className="tp-chip-row tp-chip-row-tight">
              <span className="tp-chip tp-chip-small" style={{ background: expansionColor }}>
                {spirit.expansion}
              </span>
              {spirit.tags.map((tag) => (
                <span key={tag} className="tp-chip-outline" style={{ borderColor: tagColor(tag), color: tagColor(tag) }}>
                  {tagLabel(tag)}
                </span>
              ))}
            </div>
            <p>{spirit.summary}</p>
          </li>
        )
      })}
    </ul>
  )
}
