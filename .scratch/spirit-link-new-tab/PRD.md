# Spirit chips: open in new tab

Status: needs-triage (in-app clickability shipped; new-tab/routing still open)

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
