import type { OCFDU, Spirit } from './types'

export type Weights = Partial<OCFDU>

export interface RecommendOptions {
  /** Positive = wants a fast start, negative = wants a slow snowball. */
  tempo?: number
  /** Positive = wants positioning puzzles, negative = wants to avoid them. */
  boardControl?: number
}

export interface RankedSpirit {
  spirit: Spirit
  score: number
}

const AXES: (keyof OCFDU)[] = ['offense', 'control', 'fear', 'defense', 'utility']

function fitScore(spirit: Spirit, weights: Weights): number {
  return AXES.reduce((sum, axis) => sum + (weights[axis] ?? 0) * spirit.ratings[axis], 0)
}

function tagBoost(spirit: Spirit, tempo: number, boardControl: number): number {
  let bonus = 0
  if (spirit.tags.includes('fast-tempo')) bonus += tempo
  if (spirit.tags.includes('ramping-economy')) bonus -= tempo
  if (spirit.tags.includes('board-control')) bonus += boardControl
  return bonus
}

export function recommend(
  spirits: Spirit[],
  weights: Weights,
  options: RecommendOptions = {},
): RankedSpirit[] {
  const { tempo = 0, boardControl = 0 } = options
  return spirits
    .map((spirit) => ({
      spirit,
      score: fitScore(spirit, weights) + tagBoost(spirit, tempo, boardControl),
    }))
    .sort((a, b) => b.score - a.score || a.spirit.name.localeCompare(b.spirit.name))
}
