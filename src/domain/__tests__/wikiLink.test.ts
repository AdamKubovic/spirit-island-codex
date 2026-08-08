import { describe, expect, it } from 'vitest'
import { SEGMENT_WIKI, wikiLink, WIKI_BASE } from '../wiki'
import spiritsData from '../../data/spirits.json'
import powerCardsData from '../../data/power-cards.json'
import otherCardsData from '../../data/other-cards.json'
import { ADVERSARIES } from '../adversaries'
import { SCENARIOS } from '../scenarios'
import type { OtherCard, PowerCard, Spirit } from '../types'

const spirits = spiritsData as Spirit[]
const powerCards = powerCardsData as PowerCard[]
const otherCards = otherCardsData as OtherCard[]

// Expected URLs are the canonical forms the wiki itself links to (verified by fetching
// spiritislandwiki.com, 2026-08-08) - an independent source of truth, never recomputed.
describe('wikiLink', () => {
  it('encodes a spirit title the way the wiki does (apostrophe %27, space underscore)', () => {
    expect(wikiLink("Lightning's Swift Strike")).toBe(
      'https://spiritislandwiki.com/index.php?title=Lightning%27s_Swift_Strike',
    )
  })

  it('leaves hyphens and underscores raw (Sun-Bright Whirlwind, per the wiki nav)', () => {
    expect(wikiLink('Sun-Bright Whirlwind')).toBe(
      'https://spiritislandwiki.com/index.php?title=Sun-Bright_Whirlwind',
    )
  })

  it('percent-encodes an ampersand', () => {
    expect(wikiLink('Branch & Claw')).toBe('https://spiritislandwiki.com/index.php?title=Branch_%26_Claw')
  })

  it('encodes every title in the datasets to a well-formed wiki URL', () => {
    const titles = [
      ...spirits.map((s) => s.name),
      ...spirits.flatMap((s) => s.startingCards ?? []),
      ...powerCards.map((c) => c.name),
      ...otherCards.map((c) => c.name),
      ...ADVERSARIES.map((a) => a.name),
      ...SCENARIOS.map((s) => s.name),
    ]
    for (const title of titles) {
      expect(wikiLink(title), title).toMatch(
        /^https:\/\/spiritislandwiki\.com\/index\.php\?title=[A-Za-z0-9_%.-]+$/,
      )
    }
  })

  it('is stable: the base matches the wiki home', () => {
    expect(WIKI_BASE).toBe('https://spiritislandwiki.com/index.php?title=')
  })

  it('encodes every wiki title the app links (Archive segments, Glossary) to a well-formed URL', () => {
    const titles = [...Object.values(SEGMENT_WIKI), 'Glossary']
    for (const title of titles) {
      expect(wikiLink(title), title).toMatch(
        /^https:\/\/spiritislandwiki\.com\/index\.php\?title=[A-Za-z0-9_%.-]+$/,
      )
    }
  })
})
