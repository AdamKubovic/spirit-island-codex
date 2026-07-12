import { useState } from 'react'
import type { Adversary } from '../domain/adversaries'
import { adversaryImage } from '../domain/adversaries'
import { CardViewer } from './CardViewer'

/** v5 #05a: rows view for Adversaries — same shape as OtherCardRows, plus the level range that's
 * the point of #04's "image + data" call. */
export function AdversaryRows({ adversaries }: { adversaries: Adversary[] }) {
  const [enlarged, setEnlarged] = useState<{ src: string; alt: string } | null>(null)
  const base = import.meta.env.BASE_URL

  return (
    <ul className="card-rows">
      {adversaries.map((adversary) => {
        const src = `${base}${adversaryImage(adversary.name)}`
        return (
          <li key={adversary.name}>
            <button type="button" className="card-row" onClick={() => setEnlarged({ src, alt: adversary.name })}>
              <span className="card-row-name">{adversary.name}</span>
              <span className="card-row-expansion">{adversary.expansion}</span>
              <span className="card-row-cost">
                Lv {adversary.minLevel}–{adversary.maxLevel}
              </span>
            </button>
          </li>
        )
      })}
      {enlarged && <CardViewer src={enlarged.src} alt={enlarged.alt} onClose={() => setEnlarged(null)} />}
    </ul>
  )
}
