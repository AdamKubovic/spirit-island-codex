import type { Tier } from '../domain/types'

/** Sampled from the owner's TierMaker board so the in-app board reads the same. */
export const TIER_COLOR: Record<Tier, string> = {
  X: '#c078c0',
  S: '#78c0ff',
  A: '#78ffff',
  B: '#78ff78',
  C: '#ffff78',
  D: '#ffc078',
  F: '#ff7878',
}
