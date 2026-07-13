import spiritsData from '../data/spirits.json'
import type { Spirit } from '../domain/types'
import { SpiritArt } from './SpiritArt'

const spirits = spiritsData as Spirit[]

/** The three intent doors (#01 decision 4). Archive, Log, and Settings are nav-only —
 * the doors are guidance, not a second sitemap. Copy is deliberately count-free and
 * feature-stable: nothing on the homepage may go stale (#01 decision 1). */
type DoorTarget = 'browser' | 'recommender' | 'tiers'

const DOORS: { title: string; sub: string; target: DoorTarget; artId: string }[] = [
  {
    title: 'Explore every spirit',
    sub: 'Every spirit and aspect — art, profile, and detail.',
    target: 'browser',
    artId: 'lightnings-swift-strike',
  },
  {
    title: 'Not sure what to play?',
    sub: 'Answer a few questions and get a shortlist for tonight.',
    target: 'recommender',
    artId: 'river-surges-in-sunlight',
  },
  {
    title: 'How do they rank?',
    sub: 'Published tier lists and your own board.',
    target: 'tiers',
    artId: 'a-spread-of-rampant-green',
  },
]

const OFFICIAL_SITE = 'https://shop.greaterthangames.com/pages/spirit-island'

function spiritFor(artId: string): Spirit {
  return spirits.find((s) => s.id === artId) ?? spirits[0]
}

/** The app's front door (#13, layout A from the variant round): orientation + router.
 * Mostly static by design — nothing here may go stale. */
export function Homepage({ onNavigate }: { onNavigate: (target: DoorTarget) => void }) {
  return (
    <section className="home">
      <div className="home-framing">
        <p>
          Spirit Island is a cooperative board game of powerful spirits defending their island
          home from colonizing invaders —{' '}
          <a href={OFFICIAL_SITE} target="_blank" rel="noreferrer">
            learn more at the official site
          </a>
          .
        </p>
        <p>This is an unofficial, fan-made companion for exploring its spirits, picking one to play, and comparing tier lists.</p>
      </div>

      <div className="home-doors">
        {DOORS.map((door) => (
          <button key={door.target} type="button" className="home-door-banner" onClick={() => onNavigate(door.target)}>
            <SpiritArt spirit={spiritFor(door.artId)} className="home-door-art" />
            <span className="home-door-text">
              <span className="home-door-title">{door.title}</span>
              <span className="home-door-sub">{door.sub}</span>
            </span>
          </button>
        ))}
      </div>

      <p className="home-footer">
        Unofficial, fan-made, non-commercial companion — not affiliated with the Spirit Island rights holders.
      </p>
    </section>
  )
}
