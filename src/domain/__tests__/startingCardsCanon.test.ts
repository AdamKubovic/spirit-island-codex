import { describe, expect, it } from 'vitest'
import spiritsData from '../../data/spirits.json'
import type { Spirit } from '../types'

const spirits = spiritsData as Spirit[]

/**
 * The canonical four starting Unique Power Card names per spirit, in panel order, transcribed
 * from spiritislandwiki.com's "Unique Power Cards" section for each spirit page (2026-07-09).
 *
 * A deliberate duplication of the dataset, same discipline as aspectCanon.test.ts: this is the
 * tripwire that fails if `spirits.json` drifts from what was actually read off a real source.
 * It cannot tell you the source itself misheard or mistyped a card name — that is what
 * `verified`-style human cross-checking is for, not this test.
 */
const CANONICAL_STARTING_CARDS: Record<string, string[]> = {
  'lightnings-swift-strike': ["Harbingers of the Lightning", "Lightning's Boon", 'Raging Storm', 'Shatter Homesteads'],
  'river-surges-in-sunlight': ['Boon of Vigor', 'Flash Floods', "River's Bounty", 'Wash Away'],
  'vital-strength-of-the-earth': [
    'A Year of Perfect Stillness',
    'Draw of the Fruitful Earth',
    'Guard the Healing Land',
    'Rituals of Destruction',
  ],
  'shadows-flicker-like-flame': ['Concealing Shadows', 'Crops Wither and Fade', 'Favors Called Due', 'Mantle of Dread'],
  thunderspeaker: ['Manifestation of Power and Glory', 'Sudden Ambush', 'Voice of Thunder', 'Words of Warning'],
  'a-spread-of-rampant-green': [
    'Fields Choked with Growth',
    'Gift of Proliferation',
    'Overgrow in a Night',
    'Stem the Flow of Fresh Water',
  ],
  'oceans-hungry-grasp': ['Call of the Deeps', 'Grasping Tide', 'Swallow the Land-Dwellers', 'Tidal Boon'],
  'bringer-of-dreams-and-nightmares': [
    "Call on Midnight's Dream",
    'Dread Apparitions',
    'Dreams of the Dahan',
    'Predatory Nightmares',
  ],
  'sharp-fangs-behind-the-leaves': [
    'Prey on the Builders',
    'Teeth Gleam from Darkness',
    'Terrifying Chase',
    'Too Near the Jungle',
  ],
  'keeper-of-the-forbidden-wilds': [
    'Boon of Growing Power',
    'Regrow from Roots',
    'Sacrosanct Wilderness',
    'Towering Wrath',
  ],
  'heart-of-the-wildfire': ['Asphyxiating Smoke', "Flame's Fury", 'Flash-Fires', 'Threatening Flames'],
  'serpent-slumbering-beneath-the-island': [
    'Absorb Essence',
    'Elemental Aegis',
    'Gift of Flowing Power',
    'Gift of the Primordial Deeps',
  ],
  'stones-unyielding-defiance': [
    'Jagged Shards Push from the Earth',
    'Plows Shatter on Rocky Ground',
    'Scarred and Stony Land',
    'Stubborn Solidity',
  ],
  'shifting-memory-of-ages': [
    'Boon of Ancient Memories',
    'Elemental Teachings',
    'Share Secrets of Survival',
    "Study the Invaders' Fears",
  ],
  'grinning-trickster-stirs-up-trouble': [
    'Impersonate Authority',
    'Incite the Mob',
    'Overenthusiastic Arson',
    'Unexpected Tigers',
  ],
  'lure-of-the-deep-wilderness': [
    'Gift of the Untamed Wild',
    'Perils of the Deepest Island',
    'Softly Beckon Ever Inward',
    'Swallowed by the Wilderness',
  ],
  'many-minds-move-as-one': [
    'A Dreadful Tide of Scurrying Flesh',
    'Boon of Swarming Bedevilment',
    'Ever-Multiplying Swarm',
    'Guide the Way on Feathered Wings',
  ],
  'volcano-looming-high': ['Exaltation of Molten Stone', 'Lava Flows', 'Pyroclastic Bombardment', 'Rain of Ash'],
  'shroud-of-silent-mist': [
    'Dissolving Vapors',
    'Flowing and Silent Forms Dart By',
    'The Fog Closes In',
    'Unnerving Pall',
  ],
  'vengeance-as-a-burning-plague': [
    'Fetid Breath Spreads Infection',
    'Fiery Vengeance',
    'Plaguebearers',
    'Strike Low with Sudden Fevers',
  ],
  'starlight-seeks-its-form': [
    'Boon of Reimagining',
    'Gather the Scattered Light of Stars',
    'Peace of the Nighttime Sky',
    'Shape the Self Anew',
  ],
  'fractured-days-split-the-sky': [
    'Absolute Stasis',
    'Blur the Arc of Years',
    'Pour Time Sideways',
    'The Past Returns Again',
  ],
  'downpour-drenches-the-world': [
    'Dark Skies Loose a Stinging Rain',
    'Foundations Sink into Mud',
    'Gift of Abundance',
    'Unbearable Deluge',
  ],
  'finder-of-paths-unseen': [
    'A Circuitous and Wending Journey',
    'Aid from the Spirit-Speakers',
    'Offer Passage Between Worlds',
    'Paths Tied by Nature',
  ],
  'hearth-vigil': ['Call to Vigilance', 'Coordinated Raid', 'Favors of Story and Season', 'Surrounded by the Dahan'],
  'towering-roots-of-the-jungle': [
    'Blooming of the Rocks and Trees',
    'Boon of Resilient Power',
    'Entwine the Fates of All',
    'Radiant and Hallowed Grove',
  ],
  'ember-eyed-behemoth': ['Blazing Intimidation', 'Exaltation of Grasping Roots', 'Surging Lahar', 'Terrifying Rampage'],
  'relentless-gaze-of-the-sun': [
    'Blinding Glare',
    "Focus the Sun's Rays",
    'Unbearable Gaze',
    'Wither Bodies, Scar Stones',
  ],
  'wandering-voice-keens-delirium': [
    'Exhale Confusion and Delirium',
    'Frightful Keening',
    "Turmoil's Touch",
    'Twist Perceptions',
  ],
  'wounded-waters-bleeding': [
    'Blood Water and Bloodlust',
    'Boon of Corrupted Blood',
    "Draw to the Water's Edge",
    'Wrack with Pain and Grief',
  ],
  'breath-of-darkness-down-your-spine': [
    'Emerge from the Dread Night Wind',
    'Reach from the Infinite Darkness',
    'Swallowed by the Endless Dark',
    'Terror of the Hunted',
  ],
  'dances-up-earthquakes': [
    'Exaltation of Echoed Steps',
    'Gift of Seismic Energy',
    'Inspire a Winding Dance',
    'Radiating Tremors',
  ],
  'devouring-teeth-lurk-underfoot': [
    'Ferocious Rampage',
    'Gift of Furious Might',
    'Herd Towards the Lurking Maw',
    'Mark Territory with Scars and Teeth',
  ],
  'eyes-watch-from-the-trees': [
    'Boon of Watchful Guarding',
    'Eerie Noises and Moving Trees',
    'Mysterious Abductions',
    'Whispered Guidance Through the Night',
  ],
  'fathomless-mud-of-the-swamp': [
    'Exaltation of Tangled Growth',
    'Foul Vapors and Fetid Muck',
    'Intractable Thickets and Thorns',
    'Open Shifting Waterways',
  ],
  'rising-heat-of-stone-and-sand': [
    'Call on Herders for Aid',
    'Gift of Searing Heat',
    'Stinging Sandstorm',
    'Sweltering Exhaustion',
  ],
  'sun-bright-whirlwind': [
    'Gift of the Sunlit Air',
    'Gift of Wind-Sped Steps',
    'Scatter to the Winds',
    'Tempest of Leaves and Branches',
  ],
}

describe('starting cards canon', () => {
  it('gives every spirit exactly its canonical starting cards, in order', () => {
    for (const spirit of spirits) {
      const expected = CANONICAL_STARTING_CARDS[spirit.id]
      expect(expected, `${spirit.name} has no canonical starting cards recorded`).toBeDefined()
      expect(spirit.startingCards, `${spirit.name}'s startingCards drifted from canon`).toEqual(expected)
    }
  })

  it('every spirit in spirits.json has startingCards (all 37 sourced)', () => {
    for (const spirit of spirits) {
      expect(spirit.startingCards, `${spirit.name} has no startingCards`).toBeDefined()
    }
  })
})
