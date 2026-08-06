import spiritsData from '../data/spirits.json'
import { answersToWeights, type Answers } from './answersToWeights'
import { candidatesForRecommender } from './collectionStore'
import { expand, type Configuration } from './configurations'
import { dedupeBySpirit, recommend, type RankedConfiguration, type Weights } from './recommend'
import { analyzeTeam, tuneTowardGaps } from './teamCoverage'
import type { Complexity, ExpansionName, Spirit } from './types'
import { selectWildcard } from './wildcard'

const spirits = spiritsData as Spirit[]

/** Deliberately narrow: three picks plus a wildcard, not a menu to agonise over. Declared once
 * here — the recommender's heading and the Wildcard's off-shortlist exclusion both read it. */
export const SHORTLIST_SIZE = 3

export interface RankForSessionInput {
  answers: Answers
  /** spiritId -> override, e.g. `complexityStore.getAll()`. Feeds only the enjoyment-preference
   * reading (the newcomer ceiling always reads the printed value). */
  complexityOverrides: Record<string, Complexity>
  /** Expansions excluded from the collection, e.g. `collectionStore.getExcluded()`. */
  excluded: ReadonlySet<ExpansionName>
  /** configId -> games played, e.g. from `gameLog.timesPlayed`. Absent entries read as 0. */
  timesPlayed?: Record<string, number>
  /** configId -> normalised tier rank (0 strongest .. 1 weakest), e.g. `tierStore.getRankPrior()`. */
  tierPrior: Record<string, number>
  /** Spirit ids of the teammate list (the gap-tuning knob reads these). */
  teamIds: string[]
  /** Whether the gap-tuning knob is engaged. */
  tuned: boolean
  /** Cycles the Wildcard among its eligible candidates (the reroll action). */
  wildcardOffset: number
  /** Whether unowned configurations are pre-filtered out of the candidate pool (#06). */
  hardFilter: boolean
}

export interface RankForSessionResult {
  /** Every configuration ranked and deduplicated to one per spirit. */
  ranked: RankedConfiguration[]
  /** The top `SHORTLIST_SIZE` of `ranked`. */
  shortlist: RankedConfiguration[]
  /** The deliberately off-profile pick outside the shortlist. */
  wildcard: Configuration | undefined
  /** The weights actually scored (tuned, when the knob is engaged). */
  weights: Weights
  /** The excluded expansions the pool was built against. */
  excluded: ReadonlySet<ExpansionName>
}

/**
 * The whole recommend pipeline, in one testable seam: answers → derived preferences → optional
 * gap-tuning toward the team → candidate pool (hard-filter + excluded Configurations) →
 * times-played → `recommend()` (ADR 0007's scoring seam) → `dedupeBySpirit` → Wildcard selection.
 * Every store-derived input is passed in, so the pipeline is deterministic and testable with
 * fresh in-memory state; the caller just snapshots the stores and hands them over.
 */
export function rankForSession(input: RankForSessionInput): RankForSessionResult {
  const {
    answers,
    complexityOverrides,
    excluded,
    timesPlayed,
    tierPrior,
    teamIds,
    tuned,
    wildcardOffset,
    hardFilter,
  } = input

  const prefs = answersToWeights(answers)
  const team = spirits.filter((s) => teamIds.includes(s.id))
  const roleGaps = analyzeTeam(team).roleGaps
  const weights = tuned ? tuneTowardGaps(prefs.weights, roleGaps) : prefs.weights

  // Hard-filter (opt-in) removes unowned configurations from the candidate pool *before*
  // recommend() ever sees them - an untouched collection is a no-op, and a full collection
  // exclusion always fills the shortlist rather than handing back a short one.
  const allConfigs = expand(spirits, complexityOverrides)
  const configsForRanking = candidatesForRecommender(allConfigs, hardFilter, excluded)

  const ranked = dedupeBySpirit(
    recommend(configsForRanking, weights, {
      tempo: prefs.tempo,
      boardControl: prefs.boardControl,
      complexityImportance: prefs.complexityImportance,
      complexityCeiling: prefs.complexityCeiling,
      tierPrior,
      tierKnob: prefs.tierKnob,
      timesPlayed,
    }),
  )

  const wildcard = selectWildcard(ranked, weights, prefs.complexityCeiling, wildcardOffset, SHORTLIST_SIZE)

  return {
    ranked,
    shortlist: ranked.slice(0, SHORTLIST_SIZE),
    wildcard,
    weights,
    excluded,
  }
}
