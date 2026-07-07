import { describe, expect, it } from 'vitest'
import { answersToWeights } from '../answersToWeights'

describe('answersToWeights', () => {
  it('maps "hit hard and fast" to high offense weight and fast tempo', () => {
    const prefs = answersToWeights({ beatOpponents: 'force', tempo: 'fast' })
    expect(prefs.weights.offense).toBeGreaterThan(prefs.weights.control)
    expect(prefs.weights.offense).toBeGreaterThan(0)
    expect(prefs.tempo).toBeGreaterThan(0)
  })

  it('accumulates redundant questions rather than overwriting', () => {
    const single = answersToWeights({ beatOpponents: 'force' })
    const both = answersToWeights({ beatOpponents: 'force', gutReaction: 'strike-first' })
    expect(both.weights.offense).toBeGreaterThan(single.weights.offense)
  })

  it('sets a low complexity ceiling for a first-timer', () => {
    const prefs = answersToWeights({ experience: 'newcomer' })
    expect(prefs.complexityCeiling).toBe('Low')
  })

  it('never lets weights go negative', () => {
    const prefs = answersToWeights({ focusStyle: 'one-thing' })
    expect(prefs.weights.utility).toBe(0)
  })

  it('defaults sensibly with no answers', () => {
    const prefs = answersToWeights({})
    expect(prefs.weights).toEqual({ offense: 0, control: 0, fear: 0, defense: 0, utility: 0 })
    expect(prefs.complexityCeiling).toBe('Very High')
  })
})
