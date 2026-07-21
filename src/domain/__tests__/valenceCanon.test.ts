import { describe, expect, it } from 'vitest'
import otherCardsData from '../../data/other-cards.json'
import type { Impact, OtherCard, Valence } from '../types'

const otherCards = otherCardsData as OtherCard[]
const fearCards = otherCards.filter((c): c is Extract<OtherCard, { kind: 'fear' }> => c.kind === 'fear')
const eventCards = otherCards.filter((c): c is Extract<OtherCard, { kind: 'event' }> => c.kind === 'event')

const TOTAL_FEAR_CARDS = 50
const TOTAL_EVENT_CARDS = 65

/**
 * deck-dashboard #17/#18: the complete ratified name -> rating table, owner-reviewed row by row
 * against `.scratch/deck-dashboard/valence-rubric.md` (fear Impact 1/2/3, event Valence
 * harmful/mixed/beneficial) and its draft at `.scratch/deck-dashboard/valence-draft.md`. This is
 * the tripwire: any drift, omission, or invented rating on `other-cards.json` fails the build.
 */
const FEAR_IMPACT: Record<string, Impact> = {
  'Angry Mobs': 2,
  'Avoid the Dahan': 2,
  'Belief Takes Root': 2,
  'Beset by Many Troubles': 3,
  'Civil Unrest': 3,
  'Communities in Disarray': 1,
  'Dahan Attack': 2,
  'Dahan Enheartened': 2,
  'Dahan Gain the Edge': 2,
  'Dahan Raid': 1,
  'Dahan Reclaim Fishing Grounds': 1,
  'Dahan Threaten': 2,
  'Dahan on their Guard': 2,
  'Daunted by the Dahan': 3,
  Demoralized: 2,
  'Depart the Dangerous Land': 2,
  Depopulation: 2,
  Discord: 2,
  'Distracted by Local Troubles': 1,
  'Emigration Accelerates': 2,
  'Explorers are Reluctant': 2,
  'Fear of the Unseen': 2,
  'Flee from Dangerous Lands': 3,
  'Flee the Pestilent Land': 2,
  'Immigration Slows': 2,
  Isolation: 1,
  'Mimic the Dahan': 2,
  'Nerves Fray': 1,
  'Overseas Trade Seem Safer': 2,
  Panic: 2,
  'Panicked by Wild Beasts': 2,
  'Plan for Departure': 1,
  Quarantine: 2,
  Restlessness: 2,
  'Retreat!': 2,
  Scapegoats: 2,
  'Seek Company': 1,
  'Seek Safety': 2,
  'Sense of Dread': 2,
  'Spreading Timidity': 2,
  'Struggles over Farmland': 1,
  'Supply Chains Abandoned': 2,
  'Tall Tales of Savagery': 3,
  'Theological Strife': 1,
  'Too Many Monsters': 3,
  'Trade Suffers': 1,
  'Tread Carefully': 1,
  Unrest: 2,
  Unsettled: 2,
  'Wary of the Interior': 1,
}

const EVENT_VALENCE: Record<string, Valence> = {
  'A Strange Madness among the Beasts': 'mixed',
  'Accumulated Devastation': 'harmful',
  'An Ominous Dawn': 'mixed',
  'Bureaucrats Adjust Funding': 'mixed',
  'Cities Rise': 'harmful',
  'Civic Engagement': 'harmful',
  'Coastal Towns Multiply': 'harmful',
  'Cultural Assimilation': 'harmful',
  'Dahan Trade with the Invaders': 'mixed',
  'Distant Exploration': 'harmful',
  'Eager Explorers': 'harmful',
  'Ethereal Conjunction': 'mixed',
  'Far-Off Wars Touch the Island': 'mixed',
  'Farmers Seek the Dahan for Aid': 'mixed',
  'Focused Farming': 'harmful',
  'Fortune-Seekers': 'harmful',
  'Gradual Corruption': 'harmful',
  'Hard-Working Settlers': 'mixed',
  'Harvest Bounty, Harvest Dust': 'harmful',
  'Heavy Farming': 'harmful',
  'Influx of Settlers': 'mixed',
  'Interesting Discoveries': 'harmful',
  'Invaders Surge Inland': 'harmful',
  'Invested Aristocracy': 'harmful',
  'Investigation of Dangers': 'harmful',
  'Lesser Spirits Imperiled': 'mixed',
  "Life's Balance Tilts": 'mixed',
  'Mapmakers Chart the Wild': 'harmful',
  'Missionaries Arrive': 'mixed',
  'New Species Spread': 'mixed',
  'No Bravery without Numbers': 'mixed',
  'Numinous Crisis': 'mixed',
  Outpaced: 'mixed',
  Overconfidence: 'harmful',
  'Population Rises': 'mixed',
  'Promising Farmland': 'harmful',
  'Provincial Seat': 'harmful',
  'Pull Together in Adversity': 'mixed',
  'Putting down Roots': 'harmful',
  'Relentless Optimism': 'mixed',
  "Remnants of a Spirit's Heart": 'mixed',
  'Resourceful Populace': 'harmful',
  'Rising Interest in the Island': 'mixed',
  'Sacred Sites under Threat': 'mixed',
  'Search for Unclaimed Land': 'harmful',
  'Search for new Lands': 'harmful',
  'Seek New Farmland': 'harmful',
  'Seeking the Interior': 'harmful',
  'Slave Rebellion': 'beneficial',
  'Smaller Ports Spring Up': 'harmful',
  'Sprawl Contained by the Wilds': 'mixed',
  'Strange Tales attract Explorers': 'harmful',
  'Temporary Truce': 'beneficial',
  'Terror Spikes Upwards': 'mixed',
  'The Frontier Calls': 'harmful',
  'The Struggles of Growth': 'mixed',
  'Thriving Trade': 'harmful',
  'Tight-Knit Communities': 'harmful',
  'Urban Development': 'harmful',
  'Visions Out of Time': 'mixed',
  "War Touches the Island's Shores": 'mixed',
  'Wave of Reconnaissance': 'harmful',
  'Well-Prepared Explorers': 'harmful',
  'Wounded Lands Attract Explorers': 'mixed',
  'Years of Little Rain': 'mixed',
}

describe('valence canon', () => {
  it('rates all 50 fear + 65 event cards, none invented', () => {
    expect(fearCards.length).toBe(TOTAL_FEAR_CARDS)
    expect(eventCards.length).toBe(TOTAL_EVENT_CARDS)
    expect(Object.keys(FEAR_IMPACT).length).toBe(TOTAL_FEAR_CARDS)
    expect(Object.keys(EVENT_VALENCE).length).toBe(TOTAL_EVENT_CARDS)
  })

  it('matches the ratified impact rating for every fear card, exactly', () => {
    for (const card of fearCards) {
      expect(FEAR_IMPACT[card.name], `unknown fear card "${card.name}" in canon`).toBeDefined()
      expect(card.impact, `${card.name} impact drifted from the ratified canon`).toBe(FEAR_IMPACT[card.name])
    }
  })

  it('matches the ratified valence rating for every event card, exactly', () => {
    for (const card of eventCards) {
      expect(EVENT_VALENCE[card.name], `unknown event card "${card.name}" in canon`).toBeDefined()
      expect(card.valence, `${card.name} valence drifted from the ratified canon`).toBe(EVENT_VALENCE[card.name])
    }
  })

  it('carries judgment provenance on every fear and event card, no unsourced rows', () => {
    for (const card of fearCards) {
      expect(card.impactSource, `${card.name} is missing impactSource`).toBe('judgment')
    }
    for (const card of eventCards) {
      expect(card.valenceSource, `${card.name} is missing valenceSource`).toBe('judgment')
    }
  })

  it('gives every fear card a canonical impact level, every event card a canonical valence', () => {
    for (const card of fearCards) {
      expect([1, 2, 3], `${card.name} has an invalid impact`).toContain(card.impact)
    }
    for (const card of eventCards) {
      expect(['harmful', 'mixed', 'beneficial'], `${card.name} has an invalid valence`).toContain(card.valence)
    }
  })
})
