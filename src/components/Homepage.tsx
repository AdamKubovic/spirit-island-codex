import { collectionStore } from '../domain/collectionStore'
import { complexityStore } from '../domain/complexityStore'
import { formatRoute, type Tab } from '../domain/route'

/**
 * The app's front door (ux-discoverability #01, variant A "command deck" folded from the
 * prototype): a hero with one primary CTA, an eight-tile grid covering every tab, a "Make it
 * yours" trio pointing at Settings, and a slim live "Your setup" strip shown only once the
 * visitor customises. Copy is deliberately count-free and feature-stable — nothing here may go
 * stale (ADR 0018). The one live exception is the strip, which reads the stores at render time
 * and disappears when they are untouched, so a default visitor still sees a clean front door.
 */
const OFFICIAL_SITE = 'https://shop.greaterthangames.com/pages/spirit-island'
const FAN_CONTENT_TERMS = 'https://querki.net/u/darker/spirit-island-faq/#!Creating-your-own-game-elements'
const SETTINGS_HREF = formatRoute({ tab: 'settings' })

const FEATURES: { tab: Tab; title: string; line: string }[] = [
  { tab: 'browser', title: 'Browse every spirit', line: 'Every spirit and aspect — art, profile, and detail.' },
  { tab: 'recommender', title: 'Not sure what to play?', line: 'Answer a few questions and get a shortlist for tonight.' },
  { tab: 'cards', title: 'Archive', line: 'The full card pool — powers, fear, and events — browsable and filterable.' },
  { tab: 'dashboard', title: 'Dashboard', line: 'Deck odds, element demand, and the card pool by expansion.' },
  { tab: 'tiers', title: 'Tier lists', line: 'Published tier lists and your own boards, side by side.' },
  { tab: 'log', title: 'Game log', line: 'Log games, then read win rates back off your history.' },
  { tab: 'glossary', title: 'Glossary', line: 'Every term defined, sourced, in one place.' },
  { tab: 'settings', title: 'Settings', line: 'Your collection, complexity overrides, tier defaults, and backup.' },
]

const MAKE_IT_YOURS: { title: string; line: string }[] = [
  { title: 'Your collection', line: 'Say which expansions you own. What you don\u2019t own is dimmed, never hidden.' },
  { title: 'Complexity overrides', line: 'Disagree with a printed complexity? Adjust your own enjoyment reading.' },
  { title: 'Default tier lists', line: 'Choose which list each subject boots into.' },
]

/** Renders only when the visitor has customised — the ADR 0018 exception to the static front
 * door. Counts are read live from the stores at render time, so they can never go stale. */
function SetupStrip() {
  const excluded = collectionStore.getExcluded()
  const overrides = Object.keys(complexityStore.getOverrides())
  const bits: string[] = []
  if (excluded.length > 0) bits.push(`${excluded.length} expansion${excluded.length === 1 ? '' : 's'} excluded`)
  if (overrides.length > 0) bits.push(`${overrides.length} complexity override${overrides.length === 1 ? '' : 's'}`)
  if (bits.length === 0) return null
  return (
    <div className="home-setup">
      <strong>Your setup:</strong> {bits.join(' · ')} <a href={SETTINGS_HREF}>Edit in Settings</a>
    </div>
  )
}

function Framing() {
  return (
    <div className="home-framing">
      <p>
        Spirit Island is a cooperative board game of powerful spirits defending their island home from
        colonizing invaders —{' '}
        <a href={OFFICIAL_SITE} target="_blank" rel="noreferrer">
          learn more at the official site
        </a>
        .
      </p>
      <p>
        This is an unofficial, fan-made companion for exploring its spirits, picking one to play, and comparing
        tier lists.
      </p>
    </div>
  )
}

function Footer() {
  return (
    <>
      <p className="home-footer">
        Unofficial, fan-made, non-commercial companion — not affiliated with the Spirit Island rights holders.{' '}
        <a href={FAN_CONTENT_TERMS} target="_blank" rel="noreferrer">
          Terms for creating Spirit Island game elements.
        </a>
      </p>
      <p className="home-footer">
        Tier lists by{' '}
        <a href="https://www.youtube.com/watch?v=jkBInOMEFvA" target="_blank" rel="noreferrer">
          Spirit Island Archive
        </a>{' '}
        and{' '}
        <a href="https://www.youtube.com/watch?v=d130MTU08fg" target="_blank" rel="noreferrer">
          3 Minute Board Games
        </a>
        , credited per list on the Tier list tab.
      </p>
    </>
  )
}

/** The nav prop widens to any tab (not just the old three doors): every feature tile routes. */
export function Homepage({ onNavigate }: { onNavigate: (target: Tab) => void }) {
  return (
    <section className="home">
      <header className="home-hero">
        <h1>Spirit Island Codex</h1>
        <p className="home-lead">
          A companion for exploring spirits, finding your next game, and keeping the boards you trust.
        </p>
        <button type="button" className="home-cta" onClick={() => onNavigate('recommender')}>
          Find a spirit to play
        </button>
      </header>

      <Framing />
      <SetupStrip />

      <h2 className="home-section-title">What you can do here</h2>
      <div className="home-grid">
        {FEATURES.map((f) => (
          <button key={f.tab} type="button" className="home-card" onClick={() => onNavigate(f.tab)}>
            <span className="home-card-title">{f.title}</span>
            <span className="home-card-line">{f.line}</span>
          </button>
        ))}
      </div>

      <h2 className="home-section-title">Make it yours</h2>
      <div className="home-trio">
        {MAKE_IT_YOURS.map((m) => (
          <a key={m.title} className="home-trio-card" href={SETTINGS_HREF}>
            <span className="home-trio-title">{m.title}</span>
            <span className="home-trio-line">{m.line}</span>
          </a>
        ))}
      </div>

      <Footer />
    </section>
  )
}
