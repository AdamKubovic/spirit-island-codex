import { describe, expect, it } from 'vitest'
import { groupOtherCards } from '../otherCardArrange'
import type { OtherCard } from '../types'

function fearCard(overrides: Partial<Extract<OtherCard, { kind: 'fear' }>> & Pick<OtherCard, 'name'>): OtherCard {
  return { kind: 'fear', expansion: 'Base', image: 'cards/fear/x.webp', tags: [], ...overrides } as OtherCard
}

function blightCard(overrides: Partial<Extract<OtherCard, { kind: 'blight' }>> & Pick<OtherCard, 'name'>): OtherCard {
  return {
    kind: 'blight',
    expansion: 'Base',
    image: 'cards/blight/x.webp',
    tags: [],
    tagsSource: 'judgment',
    ...overrides,
  } as OtherCard
}

function eventCard(overrides: Partial<Extract<OtherCard, { kind: 'event' }>> & Pick<OtherCard, 'name'>): OtherCard {
  return { kind: 'event', expansion: 'Base', image: 'cards/event/x.webp', eventClass: 'choice', ...overrides } as OtherCard
}

describe('groupOtherCards by subtype — fear', () => {
  const removalOnly = fearCard({ name: 'A', tags: ['removal'] })
  const removalAndWeaken = fearCard({ name: 'B', tags: ['removal', 'weaken'] })
  const untagged = fearCard({ name: 'C', tags: [] })

  it('a multi-tag card appears under EVERY tag it carries; groups are alphabetical by tag', () => {
    expect(groupOtherCards([removalAndWeaken, removalOnly], 'subtype')).toEqual([
      { label: 'removal', subtype: 'removal', cards: [removalAndWeaken, removalOnly] },
      { label: 'weaken', subtype: 'weaken', cards: [removalAndWeaken] },
    ])
  })

  it('zero-tag cards land in a trailing "unclassified" group', () => {
    expect(groupOtherCards([removalOnly, untagged], 'subtype')).toEqual([
      { label: 'removal', subtype: 'removal', cards: [removalOnly] },
      { label: 'unclassified', cards: [untagged] },
    ])
  })

  it('omits tags no card carries — no empty groups', () => {
    expect(groupOtherCards([removalOnly], 'subtype')).toEqual([
      { label: 'removal', subtype: 'removal', cards: [removalOnly] },
    ])
  })
})

describe('groupOtherCards by subtype — blight (judgment)', () => {
  const presenceLossOnly = blightCard({ name: 'A', tags: ['presenceLoss'] })
  const presenceLossAndBoard = blightCard({ name: 'B', tags: ['presenceLoss', 'boardChange'] })
  const untagged = blightCard({ name: 'C', tags: [] })

  it('a multi-tag card appears under EVERY tag it carries; group headers carry the raw key; the render layer adds the "(judgment)" note', () => {
    expect(groupOtherCards([presenceLossAndBoard, presenceLossOnly], 'subtype')).toEqual([
      { label: 'boardChange', subtype: 'boardChange', cards: [presenceLossAndBoard] },
      { label: 'presenceLoss', subtype: 'presenceLoss', cards: [presenceLossAndBoard, presenceLossOnly] },
    ])
  })

  it('zero-tag cards land in a trailing "unclassified" group', () => {
    expect(groupOtherCards([presenceLossOnly, untagged], 'subtype')).toEqual([
      { label: 'presenceLoss', subtype: 'presenceLoss', cards: [presenceLossOnly] },
      { label: 'unclassified', cards: [untagged] },
    ])
  })
})

describe('groupOtherCards by subtype — event (single-valued, never judgment)', () => {
  const choice = eventCard({ name: 'A', eventClass: 'choice' })
  const stage = eventCard({ name: 'B', eventClass: 'stage' })

  it('groups are alphabetical by class; no judgment note', () => {
    expect(groupOtherCards([stage, choice], 'subtype')).toEqual([
      { label: 'choice', subtype: 'choice', cards: [choice] },
      { label: 'stage', subtype: 'stage', cards: [stage] },
    ])
  })

  it('omits classes no card has — no empty groups, and no Unclassified (every event has exactly one class)', () => {
    expect(groupOtherCards([choice], 'subtype')).toEqual([{ label: 'choice', subtype: 'choice', cards: [choice] }])
  })

  // deck-dashboard #12: a base-game-only expansion set has zero event cards — the empty
  // composition this produces must never throw (PRD user story 26's "rule of the game, not a
  // bug" reads on top of this).
  it('an empty card set (e.g. no events in the checked expansions) returns no groups, without throwing', () => {
    expect(() => groupOtherCards([], 'subtype')).not.toThrow()
    expect(groupOtherCards([], 'subtype')).toEqual([])
    expect(groupOtherCards([], 'expansion')).toEqual([])
  })
})

describe('groupOtherCards by expansion', () => {
  const base = fearCard({ name: 'A', expansion: 'Base' })
  const jaggedEarth = fearCard({ name: 'B', expansion: 'Jagged Earth' })
  const jaggedEarth2 = fearCard({ name: 'C', expansion: 'Jagged Earth' })
  const unrecognized = fearCard({ name: 'D', expansion: 'Some Future Box' })

  it('groups follow the canonical EXPANSIONS order; cards within a group keep input order', () => {
    expect(groupOtherCards([jaggedEarth, base, jaggedEarth2], 'expansion')).toEqual([
      { label: 'Base', cards: [base] },
      { label: 'Jagged Earth', cards: [jaggedEarth, jaggedEarth2] },
    ])
  })

  it('a card whose expansion string is not in the canonical set still groups under its raw label, never dropped', () => {
    expect(groupOtherCards([base, unrecognized], 'expansion')).toEqual([
      { label: 'Base', cards: [base] },
      { label: 'Some Future Box', cards: [unrecognized] },
    ])
  })
})
