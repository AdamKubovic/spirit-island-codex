import { describe, expect, it } from 'vitest'
import spiritsData from '../../data/spirits.json'
import type { Spirit } from '../types'
import { TABS, aspectSlug, configHref, formatRoute, parseHash, resolveAspectName, type Route } from '../route'

const spirits = spiritsData as Spirit[]

/**
 * spirit-link-new-tab: the app's navigation model. Hash routing was the owner's pick (2026-07-27)
 * over real paths and over react-router — it needs no Pages `404.html` fallback and no runtime
 * dependency, and a plain `<a href="#/…">` still gives the native right-click "open in new tab"
 * this effort exists to deliver.
 *
 * Parsing and formatting are pure and live here, away from the DOM, so the awkward part (a cold
 * load in a fresh tab landing on the right screen) is testable without a browser.
 */
describe('route', () => {
  it('round-trips every tab through format → parse', () => {
    for (const tab of TABS) {
      const route: Route = { tab }
      expect(parseHash(formatRoute(route)), tab).toEqual(route)
    }
  })

  it('treats an empty, bare or missing hash as home — the boot state', () => {
    for (const hash of ['', '#', '#/', '/']) {
      expect(parseHash(hash), JSON.stringify(hash)).toEqual({ tab: 'home' })
    }
  })

  it('maps tabs to reader-facing slugs, not internal ids', () => {
    // The nav reads Browse / Recommend / Archive; the URL should say the same, even though the
    // internal ids are 'browser' / 'recommender' / 'cards'.
    expect(formatRoute({ tab: 'browser' })).toBe('#/browse')
    expect(formatRoute({ tab: 'recommender' })).toBe('#/recommend')
    expect(formatRoute({ tab: 'cards' })).toBe('#/archive')
    expect(formatRoute({ tab: 'home' })).toBe('#/')
  })

  it('carries a spirit, and optionally an aspect, on the browse route', () => {
    expect(parseHash('#/browse/lightnings-swift-strike')).toEqual({
      tab: 'browser',
      spiritId: 'lightnings-swift-strike',
    })
    expect(parseHash('#/browse/lightnings-swift-strike/sparking')).toEqual({
      tab: 'browser',
      spiritId: 'lightnings-swift-strike',
      aspectSlug: 'sparking',
    })
    expect(formatRoute({ tab: 'browser', spiritId: 'lightnings-swift-strike' })).toBe(
      '#/browse/lightnings-swift-strike',
    )
    expect(formatRoute({ tab: 'browser', spiritId: 'lightnings-swift-strike', aspectSlug: 'sparking' })).toBe(
      '#/browse/lightnings-swift-strike/sparking',
    )
  })

  it('ignores a spirit hung off a tab that has no detail view', () => {
    // Only Browse opens a spirit. A stray segment elsewhere is dropped rather than carried into
    // state no tab will read.
    expect(parseHash('#/log/lightnings-swift-strike')).toEqual({ tab: 'log' })
    expect(formatRoute({ tab: 'log', spiritId: 'lightnings-swift-strike' })).toBe('#/log')
  })

  it('falls back to home for an unknown tab slug rather than rendering nothing', () => {
    expect(parseHash('#/not-a-tab')).toEqual({ tab: 'home' })
    expect(parseHash('#/browse-ish/x')).toEqual({ tab: 'home' })
  })

  it('tolerates the shapes a real URL bar produces', () => {
    // A hash without the leading slash, a trailing slash, and mixed case all still resolve.
    expect(parseHash('#browse')).toEqual({ tab: 'browser' })
    expect(parseHash('#/browse/')).toEqual({ tab: 'browser' })
    expect(parseHash('#/BROWSE')).toEqual({ tab: 'browser' })
    expect(parseHash('#/browse/lightnings-swift-strike/')).toEqual({
      tab: 'browser',
      spiritId: 'lightnings-swift-strike',
    })
  })

  /**
   * The hash is untrusted input — it is whatever a stranger pasted or a link shortener mangled —
   * and `parseHash` runs during `App`'s own render, so anything it throws blanks the whole app
   * with no error boundary to catch it. These are the hostile cases, added after a review found
   * `#/%E0%A4%A` crashing on an unguarded `decodeURIComponent`.
   */
  describe('hostile input', () => {
    it('never throws, whatever the hash contains', () => {
      const nasty = [
        '#/%E0%A4%A', // malformed percent-escape — decodeURIComponent throws on this
        '#/%',
        '#/browse/%E0%A4%A',
        '#/browse/%ZZ',
        '#'.repeat(500),
        '#/' + 'x'.repeat(5000),
        '#/browse/../../etc/passwd',
        '#/<script>alert(1)</script>',
        '#/browse/x?y=1#z',
      ]
      for (const hash of nasty) {
        expect(() => parseHash(hash), hash.slice(0, 40)).not.toThrow()
        expect(TABS, hash.slice(0, 40)).toContain(parseHash(hash).tab)
      }
    })

    it('keeps a malformed escape out of the spirit id instead of crashing', () => {
      // Undecodable segments survive as their raw text; an id that matches no spirit simply opens
      // no modal (asserted in appSmoke), which is the honest degradation.
      expect(parseHash('#/browse/%E0%A4%A')).toEqual({ tab: 'browser', spiritId: '%e0%a4%a' })
    })

    it('does not let an empty segment promote the aspect into the spirit slot', () => {
      // `#/browse//sparking` used to parse as spiritId 'sparking' — dropping empties collapsed the
      // positions. Segments are positional, so an interior blank must not shift what follows it.
      expect(parseHash('#/browse//sparking')).toEqual({ tab: 'browser' })
      expect(parseHash('#/browse///')).toEqual({ tab: 'browser' })
    })

    it('ignores a query string or nested hash rather than folding it into a segment', () => {
      // Real URLs pick these up (share trackers, chat clients). The tab must survive them.
      expect(parseHash('#/log?utm_source=discord')).toEqual({ tab: 'log' })
      expect(parseHash('#/browse/lightnings-swift-strike?a=1')).toEqual({
        tab: 'browser',
        spiritId: 'lightnings-swift-strike',
      })
      expect(parseHash('#/browse/lightnings-swift-strike/sparking?x=1')).toEqual({
        tab: 'browser',
        spiritId: 'lightnings-swift-strike',
        aspectSlug: 'sparking',
      })
    })

    it('drops segments past the aspect rather than choking on them', () => {
      expect(parseHash('#/browse/lightnings-swift-strike/sparking/junk/more')).toEqual({
        tab: 'browser',
        spiritId: 'lightnings-swift-strike',
        aspectSlug: 'sparking',
      })
    })
  })

  describe('aspect slugs', () => {
    it('round-trips every real aspect name in the dataset', () => {
      // Aspect names are display strings with spaces ("Dark Fire"), so they are slugged for the
      // URL and resolved back against the spirit's own aspects — never guessed.
      for (const spirit of spirits) {
        for (const aspect of spirit.aspects) {
          expect(resolveAspectName(spirit, aspectSlug(aspect.name)), `${spirit.name}/${aspect.name}`).toBe(
            aspect.name,
          )
        }
      }
    })

    it('resolves case-insensitively and returns undefined for an aspect the spirit lacks', () => {
      const lightning = spirits.find((s) => s.id === 'lightnings-swift-strike')!
      expect(resolveAspectName(lightning, 'SPARKING')).toBe('Sparking')
      // Honest absence: Deeps belongs to Ocean's Hungry Grasp, not Lightning.
      expect(resolveAspectName(lightning, 'deeps')).toBeUndefined()
      expect(resolveAspectName(lightning, undefined)).toBeUndefined()
    })

    it('slugs a multi-word aspect name the same way the shared slug rule does', () => {
      expect(aspectSlug('Dark Fire')).toBe('dark-fire')
    })
  })

  describe('configHref', () => {
    it('builds a browse link from a configId, for both a base spirit and an aspect', () => {
      expect(configHref('lightnings-swift-strike')).toBe('#/browse/lightnings-swift-strike')
      expect(configHref('lightnings-swift-strike::Sparking')).toBe('#/browse/lightnings-swift-strike/sparking')
      expect(configHref('heart-of-the-wildfire::Dark Fire')).toBe('#/browse/heart-of-the-wildfire/dark-fire')
    })

    it('produces a link that parses straight back into the configuration it came from', () => {
      // The whole point of the effort: this href in an <a> must cold-boot a new tab onto the
      // right spirit and aspect.
      const spirit = spirits.find((s) => s.id === 'heart-of-the-wildfire')!
      const aspect = spirit.aspects[0]!
      const route = parseHash(configHref(`${spirit.id}::${aspect.name}`))
      expect(route.tab).toBe('browser')
      expect(route.spiritId).toBe(spirit.id)
      expect(resolveAspectName(spirit, route.aspectSlug)).toBe(aspect.name)
    })
  })
})
