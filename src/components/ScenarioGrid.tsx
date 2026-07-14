import { useState } from 'react'
import { SCENARIOS, scenarioDifficultyFigure } from '../domain/scenarios'
import { CardViewer } from './CardViewer'
import { expansionColorFor, SCENARIO_BAND_COLOR } from './tagColors'

/** phase-4 #20 (owner picked variant C, banded frame): the difficulty band — presentation
 * only, the tab's TEXT is always the verbatim printed value. Bands: ≤0 green, 1–2 yellow,
 * 3–4 orange, 5+ red; no readable figure falls back to the neutral band. Colour comes inline
 * from the tagColors map (the SpiritTile idiom), so the chip-collision test can see it. */
function bandColor(difficulty: string): string {
  const figure = scenarioDifficultyFigure(difficulty)
  if (figure === undefined) return SCENARIO_BAND_COLOR.none
  if (figure <= 0) return SCENARIO_BAND_COLOR.low
  if (figure <= 2) return SCENARIO_BAND_COLOR.mid
  if (figure <= 4) return SCENARIO_BAND_COLOR.high
  return SCENARIO_BAND_COLOR.top
}

/** The Scenarios grid — CardGrid's shape plus the difficulty indicator the owner locked
 * (frame tinted by band, verbatim value in a corner tab).
 *
 * legibility-pass #08: expansion colour (owner's #05 pick, a solid chip) joins the difficulty
 * band now that scenarios carry an `expansion` field (#02). The two signals don't clash — the
 * band tints the tile's border/bottom tab, the expansion chip sits in the opposite (top-left)
 * corner — so both stay legible at once rather than one winning. Colour comes from the one
 * `EXPANSION_COLOR` map via `expansionColorFor()`; a scenario whose raw expansion string doesn't
 * normalize shows no chip (honest absence, never a guessed colour). */
export function ScenarioGrid() {
  const [enlarged, setEnlarged] = useState<{ src: string; alt: string } | null>(null)
  const base = import.meta.env.BASE_URL

  return (
    <div className="card-grid">
      {SCENARIOS.map((scenario) => {
        const band = bandColor(scenario.difficulty)
        const expansionColor = expansionColorFor(scenario.expansion)
        return (
          <button
            key={scenario.name}
            type="button"
            className="card-grid-tile scenario-tile"
            style={{ borderColor: band }}
            onClick={() => setEnlarged({ src: `${base}${scenario.image}`, alt: scenario.name })}
          >
            <img src={`${base}${scenario.image}`} alt={scenario.name} loading="lazy" decoding="async" />
            {expansionColor && (
              <span className="expansion-chip expansion-chip-corner" style={{ background: expansionColor }}>
                {scenario.expansion}
              </span>
            )}
            <span className="scenario-difficulty" style={{ background: band }} title={`Difficulty ${scenario.difficulty}`}>
              {scenario.difficulty}
            </span>
          </button>
        )
      })}
      {enlarged && <CardViewer src={enlarged.src} alt={enlarged.alt} onClose={() => setEnlarged(null)} />}
    </div>
  )
}
