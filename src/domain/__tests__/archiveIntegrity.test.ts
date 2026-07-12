import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ADVERSARIES, adversaryImage } from '../adversaries'
import { SCENARIOS } from '../scenarios'

// images/manifest.json is the one file committed from the otherwise-gitignored asset archive
// (see .gitignore), so - unlike assetArchive.test.ts's on-disk image checks - this comparison
// always runs, not just when the archive has been retrieved locally.
type ManifestRow = { asset_type: string }
const manifest: ManifestRow[] = JSON.parse(readFileSync(new URL('../../../images/manifest.json', import.meta.url), 'utf-8'))

/**
 * v5 #05a/#05b: ships an image for every adversary and scenario the Archive renders, and pins
 * the counts against the live manifest so a missing image - or the manifest gaining/losing a
 * row - fails the build rather than rendering a hole in the grid (both tickets' acceptance
 * criteria: "a test asserts the count against the manifest").
 */
describe('Archive artwork', () => {
  it('has exactly one adversary per manifest.json adversary_panel entry', () => {
    const manifestCount = manifest.filter((r) => r.asset_type === 'adversary_panel').length
    expect(ADVERSARIES).toHaveLength(manifestCount)
  })

  it('ships a panel image for every adversary', () => {
    for (const adversary of ADVERSARIES) {
      const path = new URL(`../../../public/${adversaryImage(adversary.name)}`, import.meta.url)
      expect(existsSync(path), `${adversary.name} has no artwork at public/${adversaryImage(adversary.name)}`).toBe(true)
    }
  })

  it('has exactly one scenario per manifest.json scenario_front entry', () => {
    const manifestCount = manifest.filter((r) => r.asset_type === 'scenario_front').length
    expect(SCENARIOS).toHaveLength(manifestCount)
  })

  it('ships a front image for every scenario', () => {
    for (const scenario of SCENARIOS) {
      const path = new URL(`../../../public/${scenario.image}`, import.meta.url)
      expect(existsSync(path), `${scenario.name} has no artwork at public/${scenario.image}`).toBe(true)
    }
  })

  it('has no expansion field on any scenario record (#05b: the manifest cannot source one)', () => {
    for (const scenario of SCENARIOS) {
      expect(scenario).not.toHaveProperty('expansion')
    }
  })

  it('names Varied Terrains as the scenario with no back in the manifest (front-only tile per #04, so this has no rendering effect)', () => {
    expect(SCENARIOS.map((s) => s.name)).toContain('Varied Terrains')
  })
})
