import type { OCFDU, Spirit } from './types'

export type Weights = Partial<OCFDU>

export interface RankedSpirit {
  spirit: Spirit
  score: number
}

const AXES: (keyof OCFDU)[] = ['offense', 'control', 'fear', 'defense', 'utility']

function fitScore(spirit: Spirit, weights: Weights): number {
  return AXES.reduce((sum, axis) => sum + (weights[axis] ?? 0) * spirit.ratings[axis], 0)
}

export function recommend(spirits: Spirit[], weights: Weights): RankedSpirit[] {
  return spirits
    .map((spirit) => ({ spirit, score: fitScore(spirit, weights) }))
    .sort((a, b) => b.score - a.score || a.spirit.name.localeCompare(b.spirit.name))
}
