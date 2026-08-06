import { describe, expect, it } from 'vitest'
import { rankOf, tierLabelPosition } from '../tierStore'

describe('tierLabelPosition', () => {
  it('returns the raw index of a label in a list\'s vocabulary', () => {
    expect(tierLabelPosition('A', ['S', 'A', 'B'])).toBe(1)
  })

  it('returns undefined for a label outside the vocabulary', () => {
    expect(tierLabelPosition('X', ['S', 'A', 'B'])).toBeUndefined()
  })
})

describe('rankOf', () => {
  it('normalises a label\'s position to 0 strongest .. 1 weakest', () => {
    expect(rankOf('A', ['S', 'A', 'B', 'C'])).toBeCloseTo(1 / 3)
  })

  it('ranks everything 0 on a single-band list without dividing by zero', () => {
    expect(rankOf('Only', ['Only'])).toBe(0)
  })

  it('returns undefined for a label outside the vocabulary', () => {
    expect(rankOf('X', ['S', 'A'])).toBeUndefined()
  })

  it('the strongest label ranks 0', () => {
    expect(rankOf('S', ['S', 'A', 'B'])).toBe(0)
  })
})
