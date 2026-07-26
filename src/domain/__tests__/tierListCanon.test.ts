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

  describe('the card lists - deliberately partial, and pinned that way', () => {
    // Both lists were transcribed from auto-generated captions, which carry no section
    // boundaries. A card is rated only where it is named verbatim inside a part that announces
    // it covers exactly ONE band, so the band is the video's own declaration rather than
    // proximity to a spoken tier letter. The rest await owner adjudication
    // (.scratch/card-tier-lists/extraction/near-miss-review.md).
    //
    // These key sets are pinned longhand, the deliberate duplication this file already practises
    // for the owner's board and 3MBG: a later agent "helpfully filling the gaps" must fail CI
    // loudly. Adding an adjudicated key is a deliberate edit HERE as well as in the JSON.

    /** Minor Part 2 (B tier) is the only single-band minor part, so every key is B. */
    const MINOR_EXPECTED_KEYS = [
      'Birds Cry Warning',
      'Confounding Mists',
      'Dark and Tangled Woods',
      'Dire Metamorphosis',
      'Disorienting Landscape',
      'Guardian Serpents',
      "Nature's Resilience",
      'Scour the Land',
      'Strong And Constant Currents',
      'Sucking Ooze',
      'Swarming Wasps',
      'Territorial Strife',
      'Voracious Growth',
    ]

    /** Major Parts 2-5 are single-band (C, B, A, S). Part 1 covers F *and* D, so this list
     * rates nothing at F or D. */
    const MAJOR_EXPECTED_KEYS = [
      'Angry Bears',
      'Bargains of Power and Protection',
      'Bombard with Boulders and Stinging Seeds',
      'Draw Towards a Consuming Void',
      'Entwined Power',
      'Exaltation of the Incandescent Sky',
      'Flocking Red-Talons',
      'Flow like Water, Reach like Air',
      'Infestation of Venomous Spiders',
      'Insatiable Hunger of the Swarm',
      'Irresistible Call',
      'Paralyzing Fright',
      'Pent-Up Calamity',
      'Poisoned Land',
      'Ravaged Undergrowth Slithers Back to Life',
      'Sea Monsters',
      'Smothering Infestation',
      'Spill Bitterness into the Earth',
      'Storm-Swath',
      'Sweep into the Sea',
      'Talons of Lightning',
      'Terrifying Nightmares',
      'Transformative Sacrifice',
      'Trees Radiate Celestial Brilliance',
      'Tsunami',
      "Unleash a Torrent of the Self's Own Essence",
      'Voice of Command',
      'Walls of Rock and Thorn',
      'Weave Together the Fabric of Place',
      'Winds of Rust and Atrophy',
    ]

    it('sia-minor-powers-2023 rates exactly the 13 cards the captions place beyond doubt', () => {
      expect(Object.keys(siaMinorPowers.tiers).sort()).toEqual([...MINOR_EXPECTED_KEYS].sort())
    })

    it('sia-red-major-powers-2023 rates exactly the 30 cards the captions place beyond doubt', () => {
      expect(Object.keys(siaRedMajorPowers.tiers).sort()).toEqual([...MAJOR_EXPECTED_KEYS].sort())
    })

    it('pins how partial each list is, so partialness is itself a tested fact', () => {
      expect(Object.keys(siaMinorPowers.tiers)).toHaveLength(13) // of 101 minor powers
      expect(Object.keys(siaRedMajorPowers.tiers)).toHaveLength(30) // of 78 major powers
    })

    it('uses the vocabulary its own videos state, and the minors series has no D band', () => {
      // Minor Part 1: "an S and a a b tier and then a CNF" - S, A, B, C, F and no D.
      expect(siaMinorPowers.tierLabels).toEqual(['S', 'A', 'B', 'C', 'F'])
      // Major Part 1 defines F and D and defers C to Part 2; Parts 2-5 cover C, B, A, S.
      expect(siaRedMajorPowers.tierLabels).toEqual(['S', 'A', 'B', 'C', 'D', 'F'])
    })

    it('never admits X as a band', () => {
      // X means two contradictory things in this creator's lists. On the owner's board (spirits)
      // it is a band ABOVE S. In the minors video a blue X drawn over a card means the card was
      // REMOVED BY ERRATA - Growth through Sacrifice sits in S tier *with* an X overlay. So X is
      // an annotation here, never a band, and must never enter a card list's vocabulary or reach
      // the rank prior as "stronger than S".
      expect(siaMinorPowers.tierLabels).not.toContain('X')
      expect(siaRedMajorPowers.tierLabels).not.toContain('X')
      expect(Object.values(siaMinorPowers.tiers)).not.toContain('X')
      expect(Object.values(siaRedMajorPowers.tiers)).not.toContain('X')
    })

    it('leaves the errata-marked card unrated rather than guessing its band', () => {
      // Growth through Sacrifice is S tier in Minor Part 1 - but Part 1 covers S *and* A, so the
      // captions alone do not fix which. It is in the near-miss batch, and absent until the owner
      // rules. Absence here means "not yet transcribed", which ADR 0001 makes a real value.
      expect('Growth through Sacrifice' in siaMinorPowers.tiers).toBe(false)
    })

    it('rates no card at a band that only a two-band part covers', () => {
      // Major Part 1 is the only source of F and D, and it covers both, so neither can be
      // attributed. If an F or D key appears here, band inference has crept back in.
      expect(Object.values(siaRedMajorPowers.tiers)).not.toContain('F')
      expect(Object.values(siaRedMajorPowers.tiers)).not.toContain('D')
    })

    it('ships as unverified cited lists - nobody has re-checked them against the videos', () => {
      for (const list of [siaMinorPowers, siaRedMajorPowers]) {
        expect(list.origin).toBe('cited')
        expect(list.verified).toBe(false)
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
