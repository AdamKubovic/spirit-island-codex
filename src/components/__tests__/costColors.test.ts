import { describe, expect, it } from 'vitest'
import { COST_COLOR, costColor } from '../costColors'
import { CARD_KIND_COLOR, CARD_SPEED_COLOR, EXPANSION_COLOR, PANEL_COLOR, SCENARIO_BAND_COLOR, SUBTYPE_COLOR, TAG_COLOR } from '../tagColors'

/** The dashboard's Fast/Slow bars live in CSS tokens (deck.css `--deck-fast`/`--deck-slow`,
 * sampled from the icon assets) rather than in a JS module — pinned here as literals so the
 * cost scale's separation from them is tested, not just claimed. */
const SPEED_TOKEN_COLORS = ['#ef3029', '#39499c']

describe('costColors', () => {
  const costs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

  it('returns a distinct, stable color per cost value 0-9', () => {
    const colors = costs.map((c) => costColor(c))
    expect(new Set(colors).size).toBe(costs.length)
    expect(costs.map((c) => costColor(c))).toEqual(colors)
  })

  it('reads as one sequential family: every shade shares the accent hue (green channel dominant)', () => {
    for (const cost of costs) {
      const hex = COST_COLOR[cost]
      const [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((c) => parseInt(c, 16))
      expect(g, hex).toBeGreaterThan(r)
      expect(g, hex).toBeGreaterThan(b)
    }
  })

  it('orders the scale light -> dark as cost rises', () => {
    const lightness = costs.map((cost) => {
      const hex = COST_COLOR[cost]
      const [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((c) => parseInt(c, 16))
      return Math.max(r, g, b) + Math.min(r, g, b)
    })
    for (let i = 1; i < lightness.length; i++) {
      expect(lightness[i]).toBeLessThan(lightness[i - 1])
    }
  })

  it('shares no value byte-identically with the Fast/Slow tokens or any tagColors palette', () => {
    const others = new Set([
      ...SPEED_TOKEN_COLORS,
      ...Object.values(CARD_SPEED_COLOR),
      ...Object.values(EXPANSION_COLOR),
      ...Object.values(TAG_COLOR),
      ...Object.values(CARD_KIND_COLOR),
      ...Object.values(SCENARIO_BAND_COLOR),
      ...Object.values(SUBTYPE_COLOR),
      ...Object.values(PANEL_COLOR),
    ])
    for (const cost of costs) {
      expect(others.has(COST_COLOR[cost]), COST_COLOR[cost]).toBe(false)
    }
  })

  it('clamps out-of-range costs to the nearest end of the scale, never inventing a new shade', () => {
    expect(costColor(-3)).toBe(costColor(0))
    expect(costColor(42)).toBe(costColor(9))
  })
})
