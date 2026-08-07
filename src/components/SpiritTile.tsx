import { useState } from 'react'
import { toConfigId } from '../domain/configurations'
import type { ExpansionName, Spirit } from '../domain/types'
import { ComplexityDots, UnownedNote } from './collectionAffordances'
import { SpiritArt } from './SpiritArt'
import { Term } from './Term'
import { expansionChipColor, tagColor, tagLabel } from './tagColors'
import { activeConfigTier, tierColor } from './tierColors'

/** v5 #07c: Browse annotates (never hides, unless the caller already dropped it via
 * hard-filter) a spirit outside the collection - dimmed with a note, same treatment as the
 * tier board's tiles (#06/#07a). Aspects are gated independently (#06): an aspect line only gets
 * its own note when its expansion is excluded *and the spirit's own note isn't already saying
 * the same thing* - a spirit already dimmed and noted unowned doesn't need every aspect
 * repeating it, that's new information only when the aspect's exclusion is independent of the
 * spirit's. `excluded` is passed down rather than read per-aspect from `collectionStore` - the
 * caller already reads it once per render (Browser.tsx).
 *
 * v5 #08/#09: colour scheme decided via `/prototype` (variant H, screenshots in
 * `.scratch/v5/screenshots-08/`) - a left-edge stripe and a solid chip (same colour, verified
 * identical) carry the expansion; the complexity dots carry a text word next to them; playstyle
 * tags get their own outlined chips on a separate line below the expansion chip. */
/** Same rule/colour as the tile's own tier ribbon (`activeConfigTier` + `tierColor`), so an
 * aspect's rank in Browse can never disagree with its rank in the modal (SpiritDetail's TierChip). */
function AspectTierChip({ configId }: { configId: string }) {
  const tier = activeConfigTier(configId)
  if (!tier) return <span className="tier-chip tier-chip-unrated">unrated</span>
  return (
    <span className="tier-chip" style={{ backgroundColor: tierColor(tier.position) }}>
      {tier.label}
    </span>
  )
}

export function SpiritTile({
  spirit,
  onSelect,
  owned,
  excluded,
}: {
  spirit: Spirit
  onSelect?: (spirit: Spirit) => void
  owned: boolean
  excluded: ReadonlySet<ExpansionName>
}) {
  const [expanded, setExpanded] = useState(false)
  const expansionColor = expansionChipColor(spirit.expansion)
  const tier = activeConfigTier(toConfigId(spirit.id))

  return (
    <li className={owned ? 'spirit-tile' : 'spirit-tile spirit-tile-unowned'} style={{ borderLeftColor: expansionColor }}>
      <button
        type="button"
        className="spirit-tile-open"
        onClick={() => onSelect?.(spirit)}
        aria-label={`View ${spirit.name} details`}
      >
        <div className="spirit-tile-art-wrap">
          <SpiritArt spirit={spirit} />
          {tier && (
            <span className="tier-badge-ribbon" style={{ background: tierColor(tier.position) }}>
              {tier.label}
            </span>
          )}
        </div>
        <div className="spirit-tile-name-row">
          <h3>{spirit.name}</h3>
        </div>
      </button>
      <div className="spirit-tile-chip-row">
        <span className="spirit-tile-chip" style={{ background: expansionColor }}>
          {spirit.expansion}
        </span>
        {/* ux-discoverability #07: the complexity word is a live `Term` popover, but a `<button>`
         * can't nest inside the tile's open button — so the dots live on the chip row instead. */}
        <Term id="complexity" className="spirit-tile-complexity">
          <ComplexityDots complexity={spirit.complexity} />
        </Term>
        {!owned && <UnownedNote />}
      </div>
      {spirit.tags.length > 0 && (
        <div className="spirit-tile-chip-row spirit-tile-tags">
          {spirit.tags.map((tag) => (
            <span key={tag} className="spirit-tile-tag-chip" style={{ borderColor: tagColor(tag), color: tagColor(tag) }}>
              {tagLabel(tag)}
            </span>
          ))}
        </div>
      )}
      <p>{spirit.summary}</p>

      {spirit.aspects.length > 0 && (
        <>
          <button type="button" onClick={() => setExpanded((e) => !e)}>
            {expanded ? 'Hide' : 'Show'} aspects ({spirit.aspects.length})
          </button>
          {expanded && (
            <ul className="aspects">
              {spirit.aspects.map((aspect) => (
                <li key={aspect.name}>
                  <AspectTierChip configId={toConfigId(spirit.id, aspect.name)} /> <strong>{aspect.name}:</strong>{' '}
                  {aspect.delta ?? <em className="meta">effect not transcribed yet</em>}
                  {owned && excluded.has(aspect.expansion) && <span className="unowned-note"> · not in your collection</span>}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  )
}
