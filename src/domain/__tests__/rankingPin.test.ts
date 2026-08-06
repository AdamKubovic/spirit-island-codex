import { describe, expect, it } from 'vitest'
import { rankForSession } from '../rankForSession'
import { memoryStorage } from '../storage'
import { createTierStore } from '../tierStore'

/**
 * Phase 4 #10: the player-count input was removed from the recommender. It was never an input
 * to the ranking pipeline, so its removal must not move the ranking. This pins the full ranking
 * over the real dataset — the exact wiring `useRanking()` performs on a fresh visit (default tier
 * prior, no plays, no overrides) — with values captured BEFORE the removal. It calls
 * `rankForSession` directly, the same module the app's hook calls, so the test stops
 * re-implementing the wiring by hand. If a later change makes any ranking input implicit (a
 * player count, a viewport, a clock), this fails. Model: the collection-ranking regression test
 * (recommendCollection.test.ts).
 */
function rankFor(answers: Record<string, string>) {
  const tierStore = createTierStore(memoryStorage())
  return rankForSession({
    answers,
    complexityOverrides: {},
    excluded: new Set(),
    timesPlayed: {},
    tierPrior: tierStore.getRankPrior(),
    teamIds: [],
    tuned: false,
    wildcardOffset: 0,
    hardFilter: false,
  }).ranked
}

describe('ranking pin: player-count removal changed nothing', () => {
  it('a completed questionnaire produces the pinned shortlist', () => {
    const ranked = rankFor({
      beatOpponents: 'outsmart',
      gutReaction: 'scare-off',
      focusStyle: 'many-options',
      turnStyle: 'steady',
      tempo: 'slow',
      boardControl: 'love',
      complexityTolerance: 'some',
      experience: 'experienced',
      element: 'moon',
      powerVsFresh: 'balanced',
    })
    expect(ranked.slice(0, 5).map((r) => [r.config.configId, r.score])).toEqual([
      ['many-minds-move-as-one', 1.2083333333333333],
      ['a-spread-of-rampant-green', 1.1111111111111112],
      ['wandering-voice-keens-delirium', 1.0833333333333335],
      ['river-surges-in-sunlight::Travel', 1.0833333333333333],
      ['grinning-trickster-stirs-up-trouble', 0.9722222222222223],
    ])
  })

  it('an empty answer set (all defaults) produces the pinned shortlist', () => {
    const ranked = rankFor({})
    expect(ranked.slice(0, 5).map((r) => [r.config.configId, r.score])).toEqual([
      ['eyes-watch-from-the-trees', 1.1666666666666667],
      ['fathomless-mud-of-the-swamp', 1.125],
      ['rising-heat-of-stone-and-sand', 1.125],
      ['river-surges-in-sunlight', 1.125],
      ['sun-bright-whirlwind', 1.125],
    ])
  })
})
