# Spirit chips: open in new tab

Status: done

## Origin

User request (2026-07-25): players said they'd like to right-click a spirit
(e.g. in the Log tab) and "open in new tab" instead of only opening it in the
current view.

## Current state

- No URL routing exists anywhere in the app. `App.tsx:32` holds tab state as
  a plain `useState<Tab>('home')`; tabs render via conditional JSX, not
  routes. No `window.location`/`history.pushState`/`URLSearchParams` usage
  anywhere in `src/`.
- Browse's spirit detail is in-memory state too: `Browser.tsx` keeps a local
  `selected: Spirit | null` (set on tile click) and renders `<SpiritDetail>`
  as an overlay when it's set. There's no per-spirit URL.
- The Log tab's spirit chips (`AvatarChip`) are a plain `<span>` — no
  `onClick`, no link, not clickable at all today.
- `package.json` has no `react-router-dom` or similar routing dependency.

## Why this is bigger than a click handler

Right-click → "open in new tab" is a browser-native behavior on real `<a>`
elements with a real `href`. A new tab loads cold, so there must be a URL the
app can boot straight into (e.g. `/browse/:spiritId`) — an `onClick`-only
handler can never satisfy this, no matter what tab it lives in.

## Rough scope

- Add routing (react-router-dom, or a lighter hash-based scheme) covering at
  least `/browse/:spiritId`; ideally also stable routes per top-level tab
  (`/log`, `/dashboard`, etc.) so a reload lands on the same tab.
- Migrate `App.tsx`'s tab `useState` and `Browser.tsx`'s `selected` state to
  read/write the URL instead of local state.
- Convert the Log's `AvatarChip` spirit chips into real `<a href="/browse/...">`
  links so the native right-click menu works.
- Regression-test the existing Recommend → Browse deep link
  (`browseTarget`/`goToConfiguration` in `App.tsx:35-40`), which currently
  relies on the in-memory tab-switch approach and needs to keep working
  through the new routing.

Estimated: half a day to a day — touches the app's top-level navigation
model, not just the Log tab.

## Open question for triage

Scope down first (make chips clickable in-app, no real URL, defer new-tab
support) vs. do routing properly in one pass. Needs the maintainer's call
before implementation starts.

## Comments

2026-07-26: Scoped down per maintainer request — shipped in-app clickability
only (no new-tab support, no routing). Log's `AvatarChip` spirit chips now
render as `<button>` and call `onSelectConfiguration`, reusing the existing
`goToConfiguration` path (`App.tsx`) that Recommend already uses to jump to
Browse and open a spirit's detail view. Real URL routing (and therefore
right-click "open in new tab") remains open — see scope estimate above.

2026-07-27: **The routing half shipped — the original request now works.** Right-click (and
⌘-click, and middle-click) on a Log spirit chip opens a new tab that cold-boots straight onto that
spirit's detail, aspect row highlighted.

**Triage answered:** the maintainer picked **hash routing, hand-rolled, no new dependency**, from
three options (vs. real paths + a `public/404.html` SPA fallback, vs. `react-router-dom`). Reasons
are recorded in [ADR 0014](../../docs/adr/0014-hash-routing-as-the-navigation-model.md): a fragment
never reaches the server, so Pages needs no fallback and no deep link is served with a 404 status;
and the runtime dependency list stays exactly `react` + `react-dom`.

A consequence worth naming, because it shaped the code: with a hash, **links need no JavaScript.**
`<a href="#/browse/x">` navigates because the browser sets the hash and `hashchange` fires. There is
no `onClick` and no `preventDefault` on the chips, which is precisely why the native context menu
and ⌘-click work — a handler would have swallowed them. This is what the PRD's "bigger than a click
handler" section was pointing at.

### Rough scope, item by item

- *"Add routing … covering at least `/browse/:spiritId`"* — done. `src/domain/route.ts` (pure:
  `parseHash`, `formatRoute`, `spiritRoute`, `configHref`) + `src/useRoute.ts` (the only file that
  touches `window.location`; `useSyncExternalStore` over `hashchange`, with a server snapshot
  because the suite renders `<App />` via `renderToStaticMarkup`).
- *"ideally also stable routes per top-level tab … so a reload lands on the same tab"* — done, all
  nine tabs. Slugs are reader-facing (`#/archive`, not `#/cards`), since a URL is a thing people
  paste.
- *"Migrate `App.tsx`'s tab `useState` and `Browser.tsx`'s `selected` state"* — done. Both are gone;
  `Browser` derives the open spirit from its `target` prop, and `App` owns navigation so `Browser`
  never learns the URL shape. The old one-shot `initialTarget`/`onTargetConsumed` handshake is
  deleted outright — with the URL as the single source of truth there is no second copy to
  desynchronise. Filter/sort state stays local on purpose: a view preference, not asked for.
- *"Convert the Log's `AvatarChip` spirit chips into real `<a href>` links"* — done. `AvatarChip`
  takes `href` instead of `onClick`. `GameLog` no longer needs the `onSelectConfiguration` prop at
  all, so it was removed.
- *"Regression-test the existing Recommend → Browse deep link"* — done. `goToConfiguration` still
  backs `RecommenderMain` and now simply navigates; its test is updated in place, and three new
  cases cover the failure modes.

### Two things found by checking rather than assuming

- **A crash, caught by `/code-review`.** `parseHash` called `decodeURIComponent` unguarded, so
  `#/%E0%A4%A` threw *during `App`'s render* — with no error boundary above it, that blanks the
  entire app, and a truncated shared link produces exactly that escape. Fixed, plus a "hostile
  input" test block (malformed escapes, 5000-char segments, `<script>`, traversal) asserting
  `parseHash` is total. A second bug from the same pass: dropping empty segments collapsed
  *positions*, so `#/browse//sparking` parsed the aspect as the spirit id. Now only leading and
  trailing blanks are dropped. Query strings (`?utm_source=…`, which chat clients append) are also
  stripped rather than folded into a segment.
- **`tsc --noEmit` is not the gate; `npm run build` is.** A type error in a new test passed
  `tsc --noEmit` and failed `tsc -b`. It silently meant `vite preview` was serving a stale bundle,
  which briefly looked like a routing failure. Build before believing a browser check.

### Verification

- 606 tests pass (17 of them the new pure route module), build and lint clean.
- Driven in a real browser against the production build: cold-loaded `#/browse/:spirit/:aspect`
  (modal open, correct aspect highlighted), `#/log`, `#/total-nonsense` → homepage,
  `#/browse/no-such-spirit` → grid with no modal. In-app nav writes the hash; a tile click deep-links;
  **back closes the modal and forward reopens it**, free with hash history; reload stays on the tab.
- The origin behaviour, driven explicitly: ⌘-click on a chip opens a *new page* carrying
  `#/browse/lightnings-swift-strike/sparking`, which cold-boots into the modal with Sparking
  highlighted, while the original page stays on `#/log`.
- Screenshots at 1280px and 375px in `screenshots/`, plus a 4× zoom of the chip — it reads as a
  pill, not a browser-blue underlined link. The CSS change was load-bearing, not cosmetic:
  `button.avatar-chip-clickable` would have silently stopped matching an `<a>`, dropping the hover
  and cursor; a `:focus-visible` ring replaces the focus outline the `<button>` got for free.

### Left open (recorded in ADR 0014, not silently dropped)

- **The Recommender's "View in Browse" is still a `<button>`**, so it navigates but has no native
  new-tab affordance. Small follow-up; outside this PRD's stated scope.
- **Only Browse has a detail route.** The Archive's card viewer, the tier board's modal and the
  Dashboard's picked spirit remain local state — nothing needed them addressable yet.
