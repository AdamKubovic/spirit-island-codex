import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import spiritsData from '../../data/spirits.json'
import type { Spirit } from '../../domain/types'
import App from '../../App'
import { RecommenderMain, RecommenderProvider, RecommenderSide } from '../Recommender'
import { SpiritDetail } from '../SpiritDetail'

const spirits = spiritsData as Spirit[]

/**
 * The UI is deliberately not unit-tested (it's glue over the four domain seams). This is the
 * one exception: a single smoke render that fails loudly if the app cannot mount at all —
 * a broken context provider, a bad questionnaire index, a missing export. Typechecking
 * cannot catch those. Rendered on the server, so no DOM or localStorage is required.
 */
describe('app smoke', () => {
  it('renders without throwing', () => {
    expect(() => renderToStaticMarkup(<App />)).not.toThrow()
  })

  it('renders the shell and the first wizard question', () => {
    const html = renderToStaticMarkup(<App />)
    expect(html).toContain('alt="Spirit Island"')
    expect(html).toContain('Recommend')
    expect(html).toContain('Tier list')
    // Fresh state (memory storage) starts at the wizard, on its first real question (#10:
    // the player-count screen is gone).
    expect(html).toContain('How do you like to beat your opponents?')
    expect(html).not.toContain('How many players')
  })

  it('throws a useful error if recommender components are used outside the provider', () => {
    expect(() => renderToStaticMarkup(<RecommenderMain />)).toThrow(/RecommenderProvider/)
  })

  it('hides the live controls until the questionnaire is done', () => {
    // Phase starts as "wizard", so the sidebar knobs must not render yet.
    const html = renderToStaticMarkup(
      <RecommenderProvider>
        <RecommenderSide />
      </RecommenderProvider>,
    )
    expect(html).toBe('')
  })

  it('renders the spirit detail view for a spirit without throwing, even with no panel or card images present', () => {
    const spirit = spirits[0]
    expect(() => renderToStaticMarkup(<SpiritDetail spirit={spirit} onClose={() => {}} />)).not.toThrow()
    const html = renderToStaticMarkup(<SpiritDetail spirit={spirit} onClose={() => {}} />)
    expect(html).toContain('spirit-detail')
    expect(html).toContain(spirit.summary)
  })

  it('shows the labelled-bars OCFDU profile with element chips (#11: a 5-rated axis fills the track)', () => {
    const lightning = spirits.find((s) => s.id === 'lightnings-swift-strike')! // offense 5, Air + Fire
    const html = renderToStaticMarkup(<SpiritDetail spirit={lightning} onClose={() => {}} />)
    for (const label of ['Offense', 'Control', 'Fear', 'Defense', 'Utility']) {
      expect(html).toContain(label)
    }
    expect(html).toContain('width:100%')
    expect(html).toContain('Air')
    expect(html).toContain('Fire')
  })

  it('clamps a transcribed 6 at the full track but shows the true figure (#11)', () => {
    const behemoth = spirits.find((s) => s.id === 'ember-eyed-behemoth')! // offense 6
    const html = renderToStaticMarkup(<SpiritDetail spirit={behemoth} onClose={() => {}} />)
    expect(html).toContain('width:100%')
    expect(html).not.toContain('width:120%')
    expect(html).toContain('>6<')
  })

  it('says a spirit is not rated by the active list when it has no tier entry', () => {
    const unrated: Spirit = { ...spirits[0], id: 'a-spirit-no-list-has-ever-heard-of' }
    const html = renderToStaticMarkup(<SpiritDetail spirit={unrated} onClose={() => {}} />)
    expect(html).toContain('not rated by this list')
  })

  it('omits the card row entirely for a spirit with no startingCards, rather than rendering placeholders', () => {
    const noCards: Spirit = { ...spirits[0], startingCards: undefined }
    const html = renderToStaticMarkup(<SpiritDetail spirit={noCards} onClose={() => {}} />)
    expect(html).not.toContain('Starting cards')
  })
})
