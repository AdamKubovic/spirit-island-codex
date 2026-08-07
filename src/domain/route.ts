import { slugify } from './slug'
import type { Spirit } from './types'

/**
 * spirit-link-new-tab: the app's one navigation model. **See `docs/adr/0014-hash-routing-as-the-
 * navigation-model.md`** for why hash routing, the full URL contract, and what was left open;
 * `CONTEXT.md` defines *route*, *tab slug* and *aspect slug*. The short version:
 *
 * Navigation used to be `useState<Tab>` in `App.tsx` plus a local `selected` in `Browser.tsx`, so
 * nothing was addressable and a right-click "open in new tab" had nothing to open — that behaviour
 * is browser-native on a real `<a href>`, and a new tab loads cold, so it needs a bootable URL.
 * Hash routing (owner's pick, 2026-07-27) avoids the `404.html` fallback that real paths need on
 * GitHub Pages, and adds no dependency to a project whose runtime list is exactly react + react-dom.
 *
 * A hash also makes the links *free*: `<a href="#/browse/x">` navigates with no `onClick` at all,
 * so ⌘-click and the context menu behave as the browser intends instead of being swallowed.
 *
 * Parsing and formatting are pure and live here rather than in the hook, so the awkward case — a
 * cold load in a fresh tab — is testable without a DOM (`__tests__/route.test.ts`).
 */

/** 'home' is not a nav tab (gallery-nav #01 decision 3): the logo is the only route home, and no
 * nav item shows active while it is current. Lives here, not in `App.tsx`, because the route table
 * below and the app's tab rendering must agree on exactly one list. */
export const TABS = [
  'home',
  'recommender',
  'browser',
  'cards',
  'dashboard',
  'tiers',
  'log',
  'glossary',
  'settings',
] as const

export type Tab = (typeof TABS)[number]

/**
 * Internal tab id → the segment a reader sees in the URL. Deliberately *not* the id: the nav reads
 * "Browse", "Recommend", "Archive", so the URL says the same, and a URL is a thing people paste to
 * each other. `home` is the bare route.
 *
 * One table, read in both directions (`SLUG_TO_TAB` is derived), so a slug can never mean one tab
 * when formatting and another when parsing.
 */
const TAB_SLUG: Record<Tab, string> = {
  home: '',
  recommender: 'recommend',
  browser: 'browse',
  cards: 'archive',
  dashboard: 'dashboard',
  tiers: 'tiers',
  log: 'log',
  glossary: 'glossary',
  settings: 'settings',
}

const SLUG_TO_TAB = new Map<string, Tab>(
  (Object.entries(TAB_SLUG) as [Tab, string][]).filter(([, slug]) => slug !== '').map(([tab, slug]) => [slug, tab]),
)

/** Only Browse opens a spirit's detail, so only Browse carries the extra segments. */
const TAB_WITH_DETAIL: Tab = 'browser'

export interface Route {
  tab: Tab
  /** Browse only: the spirit whose detail modal is open. */
  spiritId?: string
  /** Browse only: which aspect row to highlight — a *slug*, since aspect names carry spaces.
   * Resolve it against the spirit's own aspects with `resolveAspectName`; never trust it as a name. */
  aspectSlug?: string
}

/** The shared slug rule (`slug.ts`), named here so callers read intent rather than a bare slugify. */
export function aspectSlug(aspectName: string): string {
  return slugify(aspectName)
}

/**
 * A slug back to the real aspect name, matched against the spirit that owns it. `undefined` when
 * the spirit has no such aspect — an honest absence, so a hand-typed or stale URL highlights
 * nothing instead of inventing an aspect (this repo has shipped invented aspects before; see
 * `aspectCanon.test.ts`).
 */
export function resolveAspectName(spirit: Spirit, slug: string | undefined): string | undefined {
  if (!slug) return undefined
  const wanted = slugify(slug)
  return spirit.aspects.find((aspect) => aspectSlug(aspect.name) === wanted)?.name
}

/**
 * `decodeURIComponent` throws on a malformed escape (`%E0%A4%A`, a bare `%`), and a URL bar is
 * exactly where those turn up — a truncated link, an over-eager chat client. A throw here would
 * take the whole app down (see `parseHash`), so an undecodable segment degrades to its raw text
 * instead. It won't match a spirit id, which resolves to no modal — the honest outcome.
 */
function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

/**
 * Parse a `location.hash` into a route. **Total** — this is called during `App`'s render with no
 * error boundary above it, so anything it throws blanks the app. Every unrecognised, malformed or
 * hostile input resolves to a real route (`home` at worst); `route.test.ts`'s "hostile input"
 * block is the guard, added after a review caught the `decodeURIComponent` crash.
 *
 * Tolerates the shapes a real URL bar produces — a missing leading slash, a trailing slash, mixed
 * case, a stray `?utm_source=…` — since a URL that differs only in punctuation should not land
 * somewhere different.
 */
export function parseHash(hash: string): Route {
  const segments = hash
    // A query string or a second `#` belongs to neither the tab nor the spirit; share links and
    // chat clients append them, so they're cut before positions are read.
    .replace(/^#/, '')
    .split(/[?#]/)[0]
    .split('/')
    .map((segment) => decodeSegment(segment).trim().toLowerCase())

  // Only the leading and trailing blanks are dropped. Interior blanks are kept, because segments
  // are *positional*: collapsing `#/browse//sparking` would promote the aspect into the spirit slot.
  while (segments.length && segments[0] === '') segments.shift()
  while (segments.length && segments[segments.length - 1] === '') segments.pop()

  if (segments.length === 0) return { tab: 'home' }

  const tab = SLUG_TO_TAB.get(segments[0])
  if (!tab) return { tab: 'home' }
  if (tab !== TAB_WITH_DETAIL) return { tab }

  const [, spiritId, aspect] = segments
  const route: Route = { tab }
  // An empty spirit slot means there is no detail to open, so nothing after it is read either.
  if (!spiritId) return route
  route.spiritId = spiritId
  if (aspect) route.aspectSlug = aspect
  return route
}

/** A route back to the hash that parses to it. Inverse of `parseHash` for every route the app
 * constructs (pinned as a round-trip in `route.test.ts`). */
export function formatRoute(route: Route): string {
  const slug = TAB_SLUG[route.tab]
  if (!slug) return '#/'
  // A spirit only means something on Browse; dropped elsewhere so the URL can't imply state no
  // tab will read.
  if (route.tab !== TAB_WITH_DETAIL || !route.spiritId) return `#/${slug}`
  const detail = route.aspectSlug ? `${route.spiritId}/${route.aspectSlug}` : route.spiritId
  return `#/${slug}/${detail}`
}

/**
 * The route that opens a spirit's detail — the *only* constructor for one, so the rule that
 * `aspectSlug` is meaningless without `spiritId` is enforced here rather than re-hand-written at
 * every call site (it was, in three of them, until a review pointed it out). Takes an aspect's
 * display *name* because that is what callers hold; slugging is this module's business.
 */
export function spiritRoute(spiritId: string, aspectName?: string): Route {
  return { tab: 'browser', spiritId, aspectSlug: aspectName ? aspectSlug(aspectName) : undefined }
}

/**
 * The `href` for a configuration — the bridge from the ids the rest of the app already speaks
 * (`toConfigId`'s `spiritId::AspectName`) to a link. This is what makes the Log's spirit chips
 * right-clickable, and it is deliberately built from `configId` so callers holding a log entry or
 * a recommendation don't have to know the URL shape.
 */
export function configHref(configId: string): string {
  const [spiritId, aspectName] = configId.split('::')
  return formatRoute(spiritRoute(spiritId, aspectName))
}

/**
 * The `href` every "you don't own this" marking and "Manage collection" control points at
 * (ux-discoverability #04): the Settings tab with a `?focus=collection` query that Settings reads
 * on mount to scroll to the My collection section. The query is stripped by `parseHash` for
 * routing (it splits on `?`), so the tab resolves normally; the marker survives in the raw hash
 * for Settings' own effect to see.
 */
export const MY_COLLECTION_HREF = '#/settings?focus=collection'
