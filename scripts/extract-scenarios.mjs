// Derives src/data/scenarios.json from images/manifest.json — the only source that knows about
// scenarios at all (v4 #01's card source, sick.oberien.de/cards.js, is a *card* catalogue and has
// no scenario concept). Re-run to reproduce: `node scripts/extract-scenarios.mjs`.
//
// The manifest's scenario_front rows carry only {name, file}. No expansion, no rules text — v5
// #05b decided (grilled against #04) that a scenario tile is front-image-only, so that's all this
// dataset needs. A field the manifest can't supply (expansion) is absent, never guessed (CLAUDE.md).
//
// Deliberately excludes the manifest's one scenario_shared_component row (shared-scenario-pieces.png,
// name: null): it's the reusable board pieces printed once for every scenario to draw from, not a
// scenario itself, so it has no name to key a record on and doesn't belong in this list.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { slugify } from '../src/domain/slug.ts'

const MANIFEST_PATH = new URL('../images/manifest.json', import.meta.url)
const OUT_PATH = new URL('../src/data/scenarios.json', import.meta.url)

async function main() {
  const manifest = await import(MANIFEST_PATH, { with: { type: 'json' } }).then((m) => m.default)

  const fronts = manifest.filter((r) => r.asset_type === 'scenario_front')
  const scenarios = fronts.map((row) => ({ name: row.name, image: `scenarios/${slugify(row.name)}.webp` })).sort((a, b) => a.name.localeCompare(b.name))

  const out = {
    _note:
      'Derived from images/manifest.json\'s scenario_front rows (v5 #05b). No expansion field: ' +
      'the manifest does not carry one and no other source in this repo knows what a scenario is. ' +
      'One scenario, Varied Terrains, has no scenario_back in the manifest - the tile only ever ' +
      'shows the front (#04), so that absence has no effect here.',
    scenarios,
  }

  writeFileSync(fileURLToPath(OUT_PATH), JSON.stringify(out, null, 2) + '\n')
  console.log(`Wrote ${scenarios.length} scenarios`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
