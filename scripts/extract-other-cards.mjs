// Derives src/data/other-cards.json (fear/event/blight — the 139 cards outside PowerCard) from
// the same upstream source #01/#11 used. Re-run to reproduce: `node scripts/extract-other-cards.mjs`.
//
// These card types carry no elements/cost/speed (#01's finding) — the dataset does not invent
// them. Only name, expansion and image are recorded.
import { createContext, runInContext } from 'node:vm'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const CARDS_JS_URL = 'https://sick.oberien.de/cards.js'
const MANIFEST_PATH = new URL('../images/manifest.json', import.meta.url)
const OUT_PATH = new URL('../src/data/other-cards.json', import.meta.url)

const KIND_BY_CLASS = {
  FearCard: 'fear',
  BlightCard: 'blight',
  ChoiceEventCard: 'event',
  StageEventCard: 'event',
  TerrorLevelEventCard: 'event',
  HealthyBlightedLandEventCard: 'event',
  AdversaryEvent: 'event',
}

async function loadDbCards() {
  const res = await fetch(CARDS_JS_URL)
  if (!res.ok) throw new Error(`fetch ${CARDS_JS_URL} failed: ${res.status}`)
  const src = await res.text()
  const sandbox = {
    document: {
      addEventListener() {},
      createElement: () => ({ style: {}, appendChild() {}, setAttribute() {}, classList: { add() {} } }),
      getElementById: () => null,
      body: { appendChild() {} },
      querySelector: () => null,
    },
    navigator: { userAgent: 'node' },
    console,
  }
  sandbox.window = sandbox
  sandbox.self = sandbox
  const ctx = createContext(sandbox)
  runInContext(src, ctx)
  const db = sandbox.DB ?? sandbox.window.DB
  if (!db?.CARDS) throw new Error('cards.js did not expose DB.CARDS in the sandbox')
  return db.CARDS
}

// SICK's own image-naming rule: a multi-name card (event/blighted-land stage titles) files
// under name[0] — see #01's card-data-source.md.
function primaryName(name) {
  return Array.isArray(name) ? name[0] : name
}

async function main() {
  const [dbCards, manifest] = await Promise.all([
    loadDbCards(),
    import(MANIFEST_PATH, { with: { type: 'json' } }).then((m) => m.default),
  ])

  const otherCards = dbCards.filter((c) => KIND_BY_CLASS[c.constructor?.name])

  const manifestByName = new Map(
    manifest.filter((r) => r.asset_type === 'fear' || r.asset_type === 'event' || r.asset_type === 'blight').map((r) => [r.name, r]),
  )

  const out = []
  const misses = []

  for (const card of otherCards) {
    const name = primaryName(card.name)
    const manifestRow = manifestByName.get(name)
    if (!manifestRow) {
      misses.push(name)
      continue
    }
    out.push({
      name,
      expansion: card.set,
      kind: KIND_BY_CLASS[card.constructor.name],
      image: `cards/${manifestRow.asset_type}/${manifestRow.file.split('/').pop()}`,
    })
  }

  if (misses.length > 0) {
    throw new Error(`${misses.length} card(s) with no manifest match: ${misses.join(', ')}`)
  }

  out.sort((a, b) => a.name.localeCompare(b.name))
  writeFileSync(fileURLToPath(OUT_PATH), JSON.stringify(out, null, 2) + '\n')

  const counts = { fear: 0, event: 0, blight: 0 }
  for (const c of out) counts[c.kind]++
  console.log(`Wrote ${out.length} cards: ${counts.fear} fear / ${counts.event} event / ${counts.blight} blight`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
