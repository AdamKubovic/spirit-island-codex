import { useState } from 'react'
import { ADVERSARIES } from '../domain/adversaries'
import { GLOSSARY } from '../domain/glossary'
import { wikiLink } from '../domain/wiki'

/**
 * ux-discoverability #03: three friendly groups — Fear cards (impact and fear tags together),
 * Event cards (valence and event classes together), and Difficulty — plus Complexity. Entries
 * render as concept cards carrying their friendly `label`; the internal id never shows. A search
 * box filters across labels and definitions. The Difficulty group keeps the additive-model table
 * (it is canon-guarded data, never a duplicate).
 */
const GROUPS: { label: string; test: (id: string) => boolean; table?: 'difficulty' }[] = [
  {
    label: 'Fear cards',
    test: (id) => id.startsWith('impact-') || id.startsWith('fear-tag-'),
  },
  {
    label: 'Event cards',
    test: (id) => id.startsWith('valence-') || id.startsWith('event-class-'),
  },
  { label: 'Difficulty', test: (id) => id === 'difficulty', table: 'difficulty' },
  { label: 'Complexity', test: (id) => id === 'complexity' },
]

const SOURCE_LABEL: Record<string, string> = {
  context: 'CONTEXT.md',
  owner: 'Owner',
  wiki: 'Spirit Island Wiki',
}

const LEVELS = [0, 1, 2, 3, 4, 5, 6]

function DifficultyTable() {
  return (
    <div className="log-table-wrap glossary-difficulty-table">
      <table className="log-table">
        <thead>
          <tr>
            <th>Adversary</th>
            {LEVELS.map((l) => (
              <th key={l}>L{l}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ADVERSARIES.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              {LEVELS.map((l) => (
                <td key={l}>{a.difficultyByLevel?.[l] ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="meta">
        Per-level numbers: Spirit Island Wiki (spiritislandwiki.com), one fetch per adversary. Modifiers — second
        adversary (higher + ~60% of lower), board (Thematic·base +3, Thematic·rebalanced +1), scenario (its own
        printed difficulty) — from the community difficulty chart (
        <code>Spirit_Island_Difficulty_Chart_with_Expansions_053122v2.pdf</code>). An adversary with no
        wiki-published per-level table shows blank cells, never a guessed zero.
      </p>
    </div>
  )
}

function matches(query: string, entry: { label: string; text: string }): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return (entry.label + ' ' + entry.text).toLowerCase().includes(q)
}

/** Browsable listing of every `GLOSSARY` entry in concept-card groups. A future entry needs no
 * page edit as long as its id fits an existing group's prefix test; the Difficulty group also
 * renders the additive model as a table built from `adversaries.json`, never a hardcoded
 * duplicate of the numbers. */
export function GlossaryTab() {
  const [query, setQuery] = useState('')
  const entries = Object.entries(GLOSSARY)

  return (
    <section className="glossary-tab">
      <h2>Glossary</h2>
      <p className="meta">
        Every defined term in one place, grouped by category, each with its source.{' '}
        <a href={wikiLink('Glossary')} target="_blank" rel="noreferrer">
          Reference: the wiki's Glossary ↗
        </a>
      </p>

      <label className="search-field-label">
        Search
        <span className="search-field">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Term or definition…"
          />
        </span>
      </label>

      {GROUPS.map((group) => {
        const inGroup = entries.filter(([id, entry]) => group.test(id) && matches(query, entry))
        if (inGroup.length === 0) return null
        return (
          <section className="glossary-group" key={group.label}>
            <h3 className="glossary-group-label">{group.label}</h3>
            {group.table === 'difficulty' && <DifficultyTable />}
            <ul className="glossary-cards">
              {inGroup.map(([id, entry]) => (
                <li className="glossary-card" key={id}>
                  <h4 className="glossary-card-title">{entry.label}</h4>
                  <p className="glossary-card-text">{entry.text}</p>
                  <span className="meta">source: {SOURCE_LABEL[entry.source] ?? entry.source}</span>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </section>
  )
}
