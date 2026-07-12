import { useState } from 'react'
import type { Scenario } from '../domain/scenarios'
import { CardViewer } from './CardViewer'

/** v5 #05b: rows view for Scenarios — name only, no expansion column. Scenarios carry no
 * expansion field at all (scenarios.json's `_note`: the manifest doesn't have one), so there is
 * nothing honest to put there. */
export function ScenarioRows({ scenarios }: { scenarios: Scenario[] }) {
  const [enlarged, setEnlarged] = useState<{ src: string; alt: string } | null>(null)
  const base = import.meta.env.BASE_URL

  return (
    <ul className="card-rows">
      {scenarios.map((scenario) => (
        <li key={scenario.name}>
          <button
            type="button"
            className="card-row"
            onClick={() => setEnlarged({ src: `${base}${scenario.image}`, alt: scenario.name })}
          >
            <span className="card-row-name">{scenario.name}</span>
          </button>
        </li>
      ))}
      {enlarged && <CardViewer src={enlarged.src} alt={enlarged.alt} onClose={() => setEnlarged(null)} />}
    </ul>
  )
}
