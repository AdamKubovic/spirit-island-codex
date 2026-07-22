import type { ElementDemandRow, ElementDemandSupply } from '../domain/elementDemand'
import type { Element } from '../domain/types'
import { ElementIcon } from './ElementIcon'

/** Bar colours matched to the element icons' own art (carried over from the deleted DeckUpset —
 * deck-dashboard #03: the owner asked totals to read in the icon's colour). */
const ELEMENT_BAR_COLOR: Record<Element, string> = {
  Sun: '#e8b923',
  Moon: '#cdd2e4',
  Fire: '#d4502e',
  Air: '#a7c7e7',
  Water: '#3a7ca5',
  Earth: '#8a5a3b',
  Plant: '#4c8c4a',
  Animal: '#a53232',
}

function supplyRange(rows: ElementDemandRow[]): string {
  const counts = rows.map((r) => r.supply)
  const min = Math.min(...counts)
  const max = Math.max(...counts)
  return min === max ? `${min}` : `${min}–${max}`
}

/**
 * element-demand #02: the spirit-conditioned block that replaces the Minor/Major UpSet and
 * gap-odds table (ADR 0013). Deck-wide element aggregates are flat by design, so nothing here is
 * meaningful without a picked spirit — the no-spirit state is a prompt, not a chart.
 */
export function DeckDemand({ demand, poolLabel }: { demand: ElementDemandSupply | undefined; poolLabel: string }) {
  if (!demand) {
    return (
      <p className="dashboard-assumption deck-demand-prompt">
        This deck's elements are spread evenly across all 8 — what matters is what your spirit's innates are short of. Pick a spirit above to
        see it.
      </p>
    )
  }

  const demandedRows = demand.elements.filter((r) => r.demanded)
  const undemandedRows = demand.elements.filter((r) => !r.demanded)
  const { none, one, twoPlus } = demand.multiHit
  const hitTotal = none + one + twoPlus
  const twoPlusPct = hitTotal === 0 ? 0 : Math.round((twoPlus / hitTotal) * 100)
  const ceilingMax = Math.max(1, ...demandedRows.map((r) => r.ceiling ?? 0))

  return (
    <div className="deck-demand">
      {demand.aspectModifiesInnates && (
        <p className="dashboard-assumption dashboard-gap-odds-caption">
          Thresholds shown are the base spirit's — this aspect changes its innate(s).
        </p>
      )}

      <p className="deck-demand-headline">
        {twoPlusPct}% of {poolLabel} hit 2 or more of what you want
      </p>
      <div className="deck-demand-hitbar" role="img" aria-label={`${none} none, ${one} one, ${twoPlus} two or more`}>
        <span className="deck-demand-hitbar-none" style={{ width: hitTotal === 0 ? 0 : `${(none / hitTotal) * 100}%` }} />
        <span className="deck-demand-hitbar-one" style={{ width: hitTotal === 0 ? 0 : `${(one / hitTotal) * 100}%` }} />
        <span className="deck-demand-hitbar-twoplus" style={{ width: hitTotal === 0 ? 0 : `${(twoPlus / hitTotal) * 100}%` }} />
      </div>

      {demandedRows.length > 0 && (
        <table className="deck-demand-table">
          <thead>
            <tr>
              <th scope="col">Element</th>
              <th scope="col">Demand</th>
              <th scope="col">Supply</th>
              <th scope="col">Odds</th>
            </tr>
          </thead>
          <tbody>
            {demandedRows.map((row) => (
              <tr key={row.element} data-off-affinity={!row.affinity}>
                <th scope="row" className="dashboard-gap-odds-elrow">
                  <ElementIcon element={row.element} />
                  {row.element}
                  {!row.affinity && <span className="deck-demand-offaffinity">no affinity</span>}
                </th>
                <td>
                  <span className="deck-demand-bartrack">
                    {row.demand !== undefined && (
                      <span
                        className="deck-demand-barfill"
                        style={{ width: `${(row.demand / ceilingMax) * 100}%`, background: ELEMENT_BAR_COLOR[row.element] }}
                      />
                    )}
                    {row.ceiling !== undefined && (
                      <span className="deck-demand-barceiling" style={{ left: `${(row.ceiling / ceilingMax) * 100}%` }} />
                    )}
                  </span>
                  {row.demand ?? `(${row.ceiling})`}
                </td>
                <td>{row.supply}</td>
                <td>{row.odds === undefined ? '—' : `${Math.round(row.odds * 100)}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {undemandedRows.length > 0 && (
        <p className="deck-demand-footer">
          No innate demand: {undemandedRows.map((r) => r.element).join(', ')} — supply {supplyRange(undemandedRows)} cards each.
        </p>
      )}
    </div>
  )
}
