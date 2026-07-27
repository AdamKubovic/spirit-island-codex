# 0014 — Hash routing is the app's navigation model

Status: accepted
Date: 2026-07-27

## Context

Until now the app had no URLs. `App.tsx` held the current tab in `useState<Tab>('home')` and
rendered tabs by conditional JSX; `Browser.tsx` held the open spirit in a local
`selected: Spirit | null`. Nothing about where you were was addressable.

That blocked a real user request (`.scratch/spirit-link-new-tab/PRD.md`, 2026-07-25): players
wanted to right-click a spirit in the Log and "open in new tab". That behaviour is *browser-native*
on an `<a href>` and cannot be emulated by a click handler — a new tab loads cold, so there has to
be a URL the app can boot straight into. A first pass shipped in-app clickability only (chips as
`<button>`), explicitly deferring the URL half.

Three options were put to the owner, who picked the first:

1. **Hash routing, hand-rolled** (`#/browse/:spiritId/:aspect`).
2. Real paths, hand-rolled, plus a copied `public/404.html`.
3. `react-router-dom` with real paths.

## Decision

**Navigation state lives in `location.hash`, parsed by a hand-rolled module. No routing
dependency.** Two concrete reasons, not stylistic preference:

- **GitHub Pages serves static files only.** A real-path deep link (`/browse/lightning`) has no
  file behind it: Pages answers **404**, and the usual fix is copying `index.html` to `404.html` so
  the SPA boots from the error page and rewrites the URL. That works, but it means every shared
  deep link is served with a 404 status. A fragment never reaches the server at all, so
  `#/browse/lightning` is a plain request for `/` that the app then reads.
- **The runtime dependency list is exactly `react` + `react-dom`**, which this project treats as a
  property worth keeping (`.scratch/community-lists/README.md` cites it when reasoning about what
  the app can and cannot do). Hash routing needs nothing added.

A third benefit decided the shape of the code: with a hash, **links need no JavaScript.**
`<a href="#/browse/x">` navigates because the browser sets the hash and fires `hashchange`. No
`onClick`, no `preventDefault` — so ⌘-click, middle-click and the context menu behave exactly as
the browser intends, instead of being swallowed by a handler.

Structure:

- **`src/domain/route.ts`** — pure. The `Tab` union, the tab↔slug table, `parseHash`,
  `formatRoute`, `spiritRoute`, `configHref`, and the aspect-slug helpers. No DOM reference, so
  the awkward case (a cold load in a fresh tab) is unit-testable without a browser.
- **`src/useRoute.ts`** — the only file that touches `window.location`. `useSyncExternalStore` over
  `hashchange`, with a `getServerSnapshot` because the test suite renders `<App />` through
  `renderToStaticMarkup`, where no `window` exists.
- **`App.tsx`** owns navigation; `Browser` receives `target` and reports clicks upward, so it never
  learns the URL shape.

**URL contract** (a public interface once people paste links):

| Route | Meaning |
|---|---|
| `#/` | Home |
| `#/browse`, `#/recommend`, `#/archive`, `#/dashboard`, `#/tiers`, `#/log`, `#/glossary`, `#/settings` | Top-level tabs |
| `#/browse/:spiritId` | Browse with that spirit's detail open |
| `#/browse/:spiritId/:aspectSlug` | …with that aspect's row highlighted |

Slugs are **reader-facing, not internal ids** — the nav says "Browse"/"Recommend"/"Archive", so the
URL does too, even though the ids are `browser`/`recommender`/`cards`. One table is read in both
directions so a slug cannot mean different things when parsing and formatting.

**`parseHash` is total.** It runs inside `App`'s render with no error boundary above it, so a throw
blanks the app. Every malformed or hostile input resolves to a real route — `home` at worst. This
is a load-bearing property, not a nicety: the first implementation crashed on `#/%E0%A4%A`, because
`decodeURIComponent` throws on a malformed escape, and a truncated shared link produces exactly
that. `route.test.ts`'s "hostile input" block is the guard.

Bad *data* in a well-formed URL degrades honestly rather than being invented (ADR 0003): an unknown
spirit id opens no modal, and an aspect slug the spirit doesn't own highlights nothing — this repo
has shipped invented aspects before (`aspectCanon.test.ts`).

## Consequences

- Every screen is linkable, and browser back/forward walk the app for free — a hash assignment
  pushes a history entry, so closing a spirit modal is one "back" away from reopening.
- Reload lands where you were rather than on the homepage.
- URLs carry a `#`. Accepted as the cost of the two reasons above.
- Filter and sort state stays local, deliberately: it is a view preference, and putting it in the
  URL was not asked for.
- Adding a tab means adding it in **two** places that must agree — `TABS` and `TAB_SLUG` — but
  `TAB_SLUG` is a `Record<Tab, string>`, so a missing entry is a type error, not a silent gap.

## Left open, deliberately

- **Only Browse has a detail route.** The Archive's card viewer, the tier board's modal and the
  Dashboard's picked spirit are all still local state. Nothing needed them addressable yet; the
  route module carries one `TAB_WITH_DETAIL` today rather than a general per-tab detail scheme.
- **The Recommender's "View in Browse" is still a `<button>`** calling `goToConfiguration`, not an
  `<a>`. It works, but it doesn't get the native new-tab affordance the Log's chips now have.
  Converting it is a small follow-up, out of the PRD's scope.
