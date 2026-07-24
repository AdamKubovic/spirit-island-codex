/**
 * log-browse-dashboard-polish #05: the Dashboard Cost facet's sequential color scale — one shade
 * per cost value, a family of the site's presence-green accent hue (`--deck-accent` #3fae6a,
 * hsl(143, 47%, 46%)) stepped in lightness from #87d4a4 (cost 0) down to #266940 (cost 9).
 * Cost 5 lands a hair off the accent itself, which is the point: same family, clearly not the
 * element-demand bars' flat accent fill.
 *
 * An explicit hex table (not an HSL generator) following tagColors.ts's convention — the values
 * are pinned apart from the Fast/Slow icon tokens and every categorical palette byte-for-byte in
 * `__tests__/costColors.test.ts`, the same separation rule every palette in this codebase keeps.
 */
export const COST_COLOR: Record<number, string> = {
  0: '#87d4a4',
  1: '#76ce98',
  2: '#66c88b',
  3: '#55c27f',
  4: '#44bc72',
  5: '#3eac68',
  6: '#389b5e',
  7: '#328a54',
  8: '#2c7a4a',
  9: '#266940',
}

const COST_MIN = 0
const COST_MAX = 9

/** Stable color for a power-card cost. Out-of-range costs clamp to the nearest end of the
 * scale — a presentation color may clamp, it may never invent a new shade. */
export function costColor(cost: number): string {
  return COST_COLOR[Math.min(Math.max(Math.round(cost), COST_MIN), COST_MAX)]
}
