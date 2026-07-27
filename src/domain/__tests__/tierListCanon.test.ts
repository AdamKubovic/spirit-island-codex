import { describe, expect, it } from 'vitest'
import ownersBoard from '../../data/tier-lists/owners-board.json'
import siaFavoritesFunSolo from '../../data/tier-lists/sia-favorites-fun-solo-2026.json'
import threeMbgStrengthSolo from '../../data/tier-lists/3mbg-strength-solo-2025.json'
import siaMinorPowers from '../../data/tier-lists/sia-minor-powers-2023.json'
import siaRedMajorPowers from '../../data/tier-lists/sia-red-major-powers-2023.json'
import powerCardsData from '../../data/power-cards.json'
import spiritsData from '../../data/spirits.json'
import { expand } from '../configurations'
import { TIER_LIST_SUBJECTS } from '../types'
import type { PowerCard, Spirit, TierList, TierListSubject } from '../types'

const spirits = spiritsData as Spirit[]
const powerCards = powerCardsData as PowerCard[]
const configIds = new Set(expand(spirits).map((c) => c.configId))

/** The id namespace each subject's tier keys must resolve against (#12/ADR 0002).
 * Card subjects key by card name — the power-card dataset carries no other id. */
const KEY_NAMESPACE: Record<TierListSubject, Set<string>> = {
  configurations: configIds,
  'minor-powers': new Set(powerCards.filter((c) => c.kind === 'minor').map((c) => c.name)),
  'major-powers': new Set(powerCards.filter((c) => c.kind === 'major').map((c) => c.name)),
}

/** Every shipped tier list. Extend this array as new lists land - this test is the tripwire
 * that keeps every one of them honest, modelled on `aspectCanon.test.ts`. */
const SHIPPED_LISTS: TierList[] = [
  ownersBoard as TierList,
  siaFavoritesFunSolo as TierList,
  threeMbgStrengthSolo as TierList,
  siaMinorPowers as TierList,
  siaRedMajorPowers as TierList,
]

/**
 * A deliberate duplication of the owner's 68 expected keys, so drift in `owners-board.json`
 * fails loudly rather than silently losing coverage. See `aspectCanon.test.ts` for why this
 * repo duplicates canonical data in tests rather than trusting the dataset to check itself.
 */
const OWNERS_BOARD_EXPECTED_KEYS = [
  'lightnings-swift-strike',
  'river-surges-in-sunlight',
  'vital-strength-of-the-earth',
  'shadows-flicker-like-flame',
  'thunderspeaker',
  'a-spread-of-rampant-green',
  'oceans-hungry-grasp',
  'bringer-of-dreams-and-nightmares',
  'sharp-fangs-behind-the-leaves',
  'keeper-of-the-forbidden-wilds',
  'heart-of-the-wildfire',
  'serpent-slumbering-beneath-the-island',
  'stones-unyielding-defiance',
  'shifting-memory-of-ages',
  'grinning-trickster-stirs-up-trouble',
  'lure-of-the-deep-wilderness',
  'many-minds-move-as-one',
  'volcano-looming-high',
  'shroud-of-silent-mist',
  'vengeance-as-a-burning-plague',
  'starlight-seeks-its-form',
  'fractured-days-split-the-sky',
  'downpour-drenches-the-world',
  'finder-of-paths-unseen',
  'hearth-vigil',
  'towering-roots-of-the-jungle',
  'ember-eyed-behemoth',
  'relentless-gaze-of-the-sun',
  'wandering-voice-keens-delirium',
  'wounded-waters-bleeding',
  'breath-of-darkness-down-your-spine',
  'dances-up-earthquakes',
  'devouring-teeth-lurk-underfoot',
  'eyes-watch-from-the-trees',
  'fathomless-mud-of-the-swamp',
  'rising-heat-of-stone-and-sand',
  'sun-bright-whirlwind',
  'lightnings-swift-strike::Pandemonium',
  'lightnings-swift-strike::Wind',
  'lightnings-swift-strike::Immense',
  'lightnings-swift-strike::Sparking',
  'river-surges-in-sunlight::Sunshine',
  'river-surges-in-sunlight::Travel',
  'river-surges-in-sunlight::Haven',
  'vital-strength-of-the-earth::Resilience',
  'vital-strength-of-the-earth::Might',
  'vital-strength-of-the-earth::Nourishing',
  'shadows-flicker-like-flame::Madness',
  'shadows-flicker-like-flame::Reach',
  'shadows-flicker-like-flame::Amorphous',
  'shadows-flicker-like-flame::Foreboding',
  'shadows-flicker-like-flame::Dark Fire',
  'thunderspeaker::Tactician',
  'thunderspeaker::Warrior',
  'a-spread-of-rampant-green::Regrowth',
  'a-spread-of-rampant-green::Tangles',
  'oceans-hungry-grasp::Deeps',
  'bringer-of-dreams-and-nightmares::Enticing',
  'bringer-of-dreams-and-nightmares::Violence',
  'sharp-fangs-behind-the-leaves::Encircle',
  'sharp-fangs-behind-the-leaves::Unconstrained',
  'keeper-of-the-forbidden-wilds::Spreading Hostility',
  'heart-of-the-wildfire::Transforming',
  'serpent-slumbering-beneath-the-island::Locus',
  'shifting-memory-of-ages::Intensify',
  'shifting-memory-of-ages::Mentor',
  'lure-of-the-deep-wilderness::Lair',
  'shroud-of-silent-mist::Stranded',
]

/**
 * A deliberate duplication of the 36 base spirits 3MBG's video covers, so drift in
 * `3mbg-strength-solo-2025.json` fails loudly. The source never mentions Fathomless Mud of the
 * Swamp and never covers aspects - those 32 keys must stay absent, not filled in.
 */
const THREE_MBG_EXPECTED_KEYS = [
  'lightnings-swift-strike',
  'vital-strength-of-the-earth',
  'river-surges-in-sunlight',
  'shadows-flicker-like-flame',
  'thunderspeaker',
  'a-spread-of-rampant-green',
  'oceans-hungry-grasp',
  'bringer-of-dreams-and-nightmares',
  'sharp-fangs-behind-the-leaves',
  'keeper-of-the-forbidden-wilds',
  'serpent-slumbering-beneath-the-island',
  'heart-of-the-wildfire',
  'shifting-memory-of-ages',
  'many-minds-move-as-one',
  'lure-of-the-deep-wilderness',
  'grinning-trickster-stirs-up-trouble',
  'stones-unyielding-defiance',
  'volcano-looming-high',
  'vengeance-as-a-burning-plague',
  'shroud-of-silent-mist',
  'starlight-seeks-its-form',
  'fractured-days-split-the-sky',
  'downpour-drenches-the-world',
  'finder-of-paths-unseen',
  'eyes-watch-from-the-trees',
  'rising-heat-of-stone-and-sand',
  'devouring-teeth-lurk-underfoot',
  'sun-bright-whirlwind',
  'ember-eyed-behemoth',
  'hearth-vigil',
  'towering-roots-of-the-jungle',
  'relentless-gaze-of-the-sun',
  'wounded-waters-bleeding',
  'wandering-voice-keens-delirium',
  'breath-of-darkness-down-your-spine',
  'dances-up-earthquakes',
]

describe('tier list canon', () => {
  it('every shipped list declares a known subject (#12 data migration — extend, never drop, when a card list ships)', () => {
    for (const list of SHIPPED_LISTS) {
      expect(
        TIER_LIST_SUBJECTS,
        `${list.id} declares unknown subject "${list.subject}"`,
      ).toContain(list.subject)
    }
  })

  for (const list of SHIPPED_LISTS) {
    describe(list.id, () => {
      it('declares a known subject and every tier key resolves in that subject\'s namespace', () => {
        const namespace = KEY_NAMESPACE[list.subject]
        expect(namespace, `${list.id} declares unknown subject "${list.subject}"`).toBeDefined()
        for (const key of Object.keys(list.tiers)) {
          expect(namespace, `${list.id} rates unknown ${list.subject} key "${key}"`).toContain(key)
        }
      })

      it('uses only labels declared in its own tierLabels', () => {
        for (const [configId, label] of Object.entries(list.tiers)) {
          expect(list.tierLabels, `${list.id}/${configId} uses label "${label}" outside its vocabulary`).toContain(
            label,
          )
        }
      })

      it('has no duplicate tierLabels', () => {
        expect(new Set(list.tierLabels).size).toBe(list.tierLabels.length)
      })

      it('has no empty-string tierLabel (reserved: the edit layer encodes "un-rated" as empty, #15)', () => {
        expect(list.tierLabels).not.toContain('')
      })

      it('has a source with a URL if origin is cited', () => {
        if (list.origin === 'cited') {
          expect(list.source, `${list.id} is cited but has no source`).toBeDefined()
          expect(list.source?.url, `${list.id}'s source has no URL`).toBeTruthy()
        }
      })

      it('declares verified as a boolean', () => {
        expect(typeof list.verified).toBe('boolean')
      })
    })
  }

  it('the card-subject namespaces resolve against power-cards.json (deliberate duplication - the tripwire any future card list hits)', () => {
    expect(KEY_NAMESPACE['minor-powers'].size).toBe(101)
    expect(KEY_NAMESPACE['major-powers'].size).toBe(78)
  })

  it('the owner\'s board covers all 68 configurations (deliberate duplication - drift fails loudly)', () => {
    expect(Object.keys(ownersBoard.tiers).sort()).toEqual([...OWNERS_BOARD_EXPECTED_KEYS].sort())
  })

  it('3mbg-strength-solo-2025 covers exactly the 36 base spirits the video rates (deliberate duplication - drift fails loudly)', () => {
    expect(Object.keys(threeMbgStrengthSolo.tiers).sort()).toEqual([...THREE_MBG_EXPECTED_KEYS].sort())
  })

  it('3mbg-strength-solo-2025 never rates an aspect configId', () => {
    for (const configId of Object.keys(threeMbgStrengthSolo.tiers)) {
      expect(configId, `${configId} should not appear - 3MBG never covers aspects`).not.toContain('::')
    }
  })

  it('3mbg-strength-solo-2025 never rates Fathomless Mud of the Swamp', () => {
    expect('fathomless-mud-of-the-swamp' in threeMbgStrengthSolo.tiers).toBe(false)
  })

  describe('the card lists', () => {
    // Transcribed from auto-generated captions, which carry no section boundaries. Each rating
    // was read off the transcript section the card is discussed in - NOT from proximity to a
    // spoken tier letter, which provably mis-bands (the reviewer says "s tier" mid-A-section
    // constantly, and back-references other bands inside single-band parts too).
    //
    // These key sets are pinned longhand, the deliberate duplication this file already practises
    // for the owner's board and 3MBG: drift must fail CI loudly rather than silently gaining or
    // losing coverage. Changing a band is a deliberate edit HERE as well as in the JSON.

    /** All 101 minor powers - the series covers the whole deck and rates all of it. */
    const MINOR_EXPECTED_KEYS = [
      'Absorb Corruption',
      'Animated Wrackroot',
      'Bats Scout For Raids By Darkness',
      'Birds Cry Warning',
      'Blood Draws Predators',
      'Call To Guard',
      'Call of the Dahan Ways',
      'Call to Bloodshed',
      'Call to Ferocity',
      'Call to Isolation',
      'Call to Migrate',
      'Call to Tend',
      'Call to Trade',
      'Carapaced Land',
      'Confounding Mists',
      'Cycles of Time and Tide',
      'Dark and Tangled Woods',
      'Delusions of Danger',
      'Desiccating Winds',
      'Devouring Ants',
      'Dire Metamorphosis',
      'Disorienting Landscape',
      'Domesticated Animals Go Berserk',
      'Drift down into Slumber',
      'Drought',
      'Dry Wood Explodes In Smoldering Splinters',
      'Elemental Boon',
      'Elusive Ambushes',
      'Encompassing Ward',
      'Enticing Splendor',
      'Entrancing Apparitions',
      'Entrap The Forces Of Corruption',
      'Favor Of The Sun And Star-Lit Dark',
      'Fire in the Sky',
      'Fleshrot Fever',
      'Flow Downriver, Blow Downwind',
      'Gift of Constancy',
      'Gift of Living Energy',
      "Gift of Nature's Connection",
      'Gift of Power',
      'Gift of Twinned Days',
      'Gnawing Rootbiters',
      "Gold's Allure",
      'Growth through Sacrifice',
      'Guardian Serpents',
      'Haunted By Primal Memories',
      'Hazards Spread Across The Island',
      'Here there be Monsters',
      'Infested Aquifers',
      'Inflame the Fires of Life',
      'Land of Haunts and Embers',
      'Like Calls to Like',
      'Lure of the Unknown',
      'Mesmerized Tranquility',
      "Nature's Resilience",
      'Pact of the Joined Hunt',
      'Poisoned Dew',
      'Portents of Disaster',
      'Promises of Protection',
      'Prowling Panthers',
      'Pull Beneath the Hungry Earth',
      'Purifying Flame',
      "Quicken the Earth's Struggles",
      'Rain of Blood',
      'Razor-Sharp Undergrowth',
      'Reaching Grasp',
      'Renewing Boon',
      'Renewing Rain',
      "Rites of the Land's Rejection",
      'Roiling Bog and Snagging Thorn',
      'Rouse the Trees and Stones',
      'Sap the Strength of Multitudes',
      'Savage Mawbeasts',
      'Scour the Land',
      'Scream Disease Into The Wind',
      'Sear Anger Into The Wild Lands',
      'Set Them On An Ever-Twisting Trail',
      'Shadows of the Burning Forest',
      'Skies Herald The Season Of Return',
      'Sky Stretches to Shore',
      'Song of Sanctity',
      'Spur on with Words of Fire',
      'Steam Vents',
      'Strong And Constant Currents',
      'Sucking Ooze',
      "Sunset's Fire Flows Across The Land",
      'Swarming Wasps',
      'Teeming Rivers',
      'Territorial Strife',
      'Terror Turns To Madness',
      'The Shore Seethes With Hatred',
      'Thriving Chokefungus',
      'Tormenting Rotflies',
      'Treacherous Waterways',
      'Twilight Fog brings Madness',
      'Uncanny Melting',
      'Unquenchable Flames',
      "Veil the Night's Hunt",
      'Visions of Fiery Doom',
      'Voracious Growth',
      'Weep For What Is Lost',
    ]

    /** All 78 majors. */
    const MAJOR_EXPECTED_KEYS = [
      'Accelerated Rot',
      'Angry Bears',
      'Bargain of Coursing Paths',
      'Bargains of Power and Protection',
      'Blazing Renewal',
      'Bloodwrack Plague',
      'Bombard with Boulders and Stinging Seeds',
      'Cast down into the Briny Deep',
      'Cleansing Floods',
      'Death Falls Gently from Open Blossoms',
      'Dissolve the Bonds of Kinship',
      'Draw Towards a Consuming Void',
      'Dream of the Untouched Land',
      'Entwined Power',
      'Exaltation of the Incandescent Sky',
      'Fire and Flood',
      'Flocking Red-Talons',
      'Flow like Water, Reach like Air',
      "Focus the Land's Anguish",
      'Forests of Living Obsidian',
      'Fragments of Yesteryear',
      'Grant Hatred a Ravenous Form',
      'Indomitable Claim',
      'Infestation of Venomous Spiders',
      'Infinite Vitality',
      'Insatiable Hunger of the Swarm',
      'Inspire the Release of Stolen Lands',
      'Instruments of their own Ruin',
      'Irresistible Call',
      'Manifest Incarnation',
      'Melt Earth into Quicksand',
      'Mists of Oblivion',
      'Paralyzing Fright',
      'Pent-Up Calamity',
      'Pillar of Living Flame',
      'Plague Ships Sail to Distant Ports',
      'Poisoned Land',
      'Powerstorm',
      'Pyroclastic Flow',
      'Ravaged Undergrowth Slithers Back to Life',
      'Rumbling Earthquakes',
      'Savage Transformation',
      'Sea Monsters',
      'Settle Into Hunting-Grounds',
      'Sleep and Never Waken',
      'Smothering Infestation',
      'Solidify Echoes of Majesty Past',
      'Spill Bitterness into the Earth',
      'Storm-Swath',
      'Strangling Firevine',
      'Sweep into the Sea',
      'Talons of Lightning',
      'Terrifying Nightmares',
      'The Jungle Hungers',
      'The Land Thrashes in Furious Pain',
      'The Trees and Stones Speak of War',
      'The Wounded Wild Turns on its Assailants',
      'Thickets Erupt with Every Touch of Breeze',
      'Tigers Hunting',
      'Transform to a Murderous Darkness',
      'Transformative Sacrifice',
      'Trees Radiate Celestial Brilliance',
      'Tsunami',
      'Twisted Flowers Murmur Ultimatums',
      'Unearth a Beast of Wrathful Stone',
      "Unleash a Torrent of the Self's Own Essence",
      'Unlock the Gates of Deepest Power',
      'Unrelenting Growth',
      'Utter a Curse of Dread and Bone',
      'Vanish Softly Away, Forgotten by All',
      'Vengeance of the Dead',
      'Vigor of the Breaking Dawn',
      'Voice of Command',
      'Volcanic Eruption',
      'Walls of Rock and Thorn',
      'Weave Together the Fabric of Place',
      'Winds of Rust and Atrophy',
      'Wrap in Wings of Sunlight',
    ]

    it('sia-minor-powers-2023 rates exactly the 101 minor powers', () => {
      expect(Object.keys(siaMinorPowers.tiers).sort()).toEqual([...MINOR_EXPECTED_KEYS].sort())
    })

    it('sia-red-major-powers-2023 rates exactly the 78 major powers', () => {
      expect(Object.keys(siaRedMajorPowers.tiers).sort()).toEqual([...MAJOR_EXPECTED_KEYS].sort())
    })

    it('pins coverage, so a later gain or loss is a deliberate edit', () => {
      expect(Object.keys(siaMinorPowers.tiers)).toHaveLength(101) // the whole minor deck
      expect(Object.keys(siaRedMajorPowers.tiers)).toHaveLength(78) // the whole major deck
    })

    it('rates Vengeance of the Dead at the band of the printing this app ships', () => {
      // The source rates this card twice: the base printing D (Part 1), "the exploratory
      // version" A (Part 4). power-cards.json carries one card of that name, and the art it
      // ships (images/cards/major/vengeance_of_the_dead.webp) shows 3 fear and "1 Damage per
      // building/dahan destroyed" - the BASE printing. So the key means the base card: D.
      // If the card dataset is ever rebuilt and ships the exploratory art, this becomes A.
      expect(siaRedMajorPowers.tiers['Vengeance of the Dead']).toBe('D')
      expect(siaRedMajorPowers.methodology).toContain('exploratory')
    })

    it('uses the vocabulary its own videos state, and the minors series has no D band', () => {
      // Minor Part 1: "an S and a a b tier and then a CNF" - S, A, B, C, F and no D.
      expect(siaMinorPowers.tierLabels).toEqual(['S', 'A', 'B', 'C', 'F'])
      expect(Object.values(siaMinorPowers.tiers)).not.toContain('D')
      // Major Part 1 defines F and D and defers C to Part 2; Parts 2-5 cover C, B, A, S.
      expect(siaRedMajorPowers.tierLabels).toEqual(['S', 'A', 'B', 'C', 'D', 'F'])
    })

    it('never admits X as a band', () => {
      // X means two contradictory things in this creator's lists. On the owner's board (spirits)
      // it is a band ABOVE S. In the minors video a blue X drawn over a card means the card was
      // REMOVED BY ERRATA. So X is an annotation here, never a band, and must never reach the
      // rank prior as "stronger than S".
      for (const list of [siaMinorPowers, siaRedMajorPowers]) {
        expect(list.tierLabels).not.toContain('X')
        expect(Object.values(list.tiers)).not.toContain('X')
      }
    })

    it('records the errata-marked card at the band the source placed it in', () => {
      // Growth through Sacrifice sits in S tier *with* a blue X overlay. The band is S; the
      // errata is prose in `methodology`, not a tier.
      expect(siaMinorPowers.tiers['Growth through Sacrifice']).toBe('S')
      expect(siaMinorPowers.methodology).toContain('errata')
    })

    it('marks its own ratings as judgment, not a clean read (ADR 0003)', () => {
      for (const list of [siaMinorPowers, siaRedMajorPowers]) {
        expect(list.origin).toBe('cited')
        expect(list.verified).toBe(false)
        expect(list.ratingsSource, `${list.id} must say how its ratings were obtained`).toBeTruthy()
      }
    })

    it('names every part id and the band it covers in the methodology', () => {
      for (const id of ['DdZFT5myaDI', 'bjd98MBYA5U', '-uT5_RQTolE']) {
        expect(siaMinorPowers.methodology).toContain(id)
      }
      for (const id of ['dHe0_n86nq4', 'rkuXUmf7kpM', 'Hc3bLAkiO5o', 'Olm9L9CnHfc', 'Hnm_rD4ziRc']) {
        expect(siaRedMajorPowers.methodology).toContain(id)
      }
      // The two [OUTDATED] major videos are superseded; the exclusion is recorded, not silent.
      expect(siaRedMajorPowers.methodology).toContain('OUTDATED')
    })
  })

  describe('sia-favorites-fun-solo-2026 - the dash/"None" edge case', () => {
    // The source video marks six spirits with a dash rather than a letter (it rated only their
    // aspects, not the plain base). That is "the source declined to rate this", the same fact
    // an absent key always represents - so those six configIds must have NO key at all, not a
    // "None" tier. This is the edge case the owner supplied this list to test.
    const DASH_MAPPED_TO_ABSENT = [
      'river-surges-in-sunlight',
      'lightnings-swift-strike',
      'shadows-flicker-like-flame',
      'bringer-of-dreams-and-nightmares',
      'shifting-memory-of-ages',
      'shroud-of-silent-mist',
    ]

    it('never carries the literal string "None" as a tier value', () => {
      expect(Object.values(siaFavoritesFunSolo.tiers)).not.toContain('None')
    })

    it('omits the key entirely for every dash-marked base spirit', () => {
      for (const configId of DASH_MAPPED_TO_ABSENT) {
        expect(configId in siaFavoritesFunSolo.tiers, `${configId} should be absent, not "None"`).toBe(false)
      }
    })

    it('still rates that spirit\'s aspects even though its own base is unrated', () => {
      // river-surges-in-sunlight itself is absent, but the source did rate its three aspects.
      expect(siaFavoritesFunSolo.tiers['river-surges-in-sunlight::Travel']).toBe('A')
      expect(siaFavoritesFunSolo.tiers['river-surges-in-sunlight::Sunshine']).toBe('F')
      expect(siaFavoritesFunSolo.tiers['river-surges-in-sunlight::Haven']).toBe('B')
    })

    it('covers exactly 62 of 68 configurations (68 minus the 6 dash-marked bases)', () => {
      expect(Object.keys(siaFavoritesFunSolo.tiers)).toHaveLength(62)
    })

    it('uses only the four-band vocabulary the source actually printed (no C or D band)', () => {
      expect(siaFavoritesFunSolo.tierLabels).toEqual(['S', 'A', 'B', 'F'])
    })
  })
})
