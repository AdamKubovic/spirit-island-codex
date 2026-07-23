Status: done

# Gallery arrow-nav, Recommend→Browse linkup, and name search

## Problem Statement

Three small frictions in the shipped app:

1. In the spirit detail modal, the panel images (front/back) and starting-card images render as
   separate static grids. Viewing them one at a time by clicking each tile is tedious when the
   owner wants to flip through a spirit's whole panel-and-cards set in sequence.
2. On the Recommend tab, survey results render as plain text/buttons. Clicking a recommended
   spirit or configuration does nothing — the owner has to manually switch to Browse and find the
   spirit again to see its panels or aspects, which feels finicky.
3. Browse's filters (expansion, complexity, tag, strong-in, hard-filter) and Archive's filters
   (power cards via `CardFilters`, fear/event/blight via `OtherCardFilters`) have no text search —
   only dropdowns and a checkbox. Finding one spirit or card by name means scanning the whole grid.

## Solution

1. Merge the panel and starting-card images already shown in the spirit detail modal into one
   arrow-key-navigable sequence: front panel, back panel, card 0, card 1, card 2, card 3 (up to 6
   images; fewer if some are absent). Aspect images are unaffected and stay click-only.
2. Clicking a spirit or configuration in Recommend results switches the active tab to Browse and
   opens that exact configuration's detail modal immediately, highlighting the specific aspect if
   the recommendation was for an aspect.
3. Add a name-only text search input to Browse's filter bar and to both Archive filter panels
   (`CardFilters`, `OtherCardFilters`), each filtering within its own set by name substring match.

## User Stories

1. As the owner reviewing a spirit's detail modal, I want to arrow through its panel front, panel
   back, and four starting cards in one sequence, so that I can flip through the full set without
   closing and reopening the enlarge view for each image.
2. As the owner, when a spirit has fewer than four starting-card images (or none), I want the
   arrow sequence to only include the images that actually exist, so that arrowing never lands on
   a broken or placeholder image inserted just to pad the sequence.
3. As the owner, I want the arrow-key sequence scoped to panels + starting cards only, so that
   aspect images (which I did not ask to include) keep behaving exactly as they do today.
4. As the owner, I want arrow-key navigation to only engage while the enlarge lightbox is open, so
   that arrow keys elsewhere in the app (e.g. scrolling, other inputs) are unaffected.
5. As the owner, I want the enlarge lightbox's existing click-to-close behavior to keep working
   unchanged alongside the new arrow-key navigation.
6. As the owner, I want the Cards tab's own use of the shared enlarge lightbox to be completely
   unaffected by this change, so that adding gallery nav to Browse doesn't regress Archive.
7. As the owner reviewing Recommend survey results, I want clicking a recommended spirit to switch
   me straight to the Browse tab, so that I don't have to manually navigate there myself.
8. As the owner, I want the spirit's detail modal to open automatically on arrival in Browse from
   a Recommend click, so that I land directly on its panels/aspects instead of an empty grid.
9. As the owner, when the recommendation was for a specific aspect (not the base spirit), I want
   the opened modal to highlight/scroll to that aspect, so that I see exactly the configuration
   that was recommended, not just the base spirit.
10. As the owner, when the recommendation was for a base spirit (no aspect), I want the opened
    modal to show the base view with no aspect highlighted, so that the highlight only appears
    when it's actually meaningful.
11. As the owner, I want this Recommend→Browse jump to work regardless of which Recommend result I
    click, so that every recommended configuration is reachable this way, not just the top pick.
12. As the owner using Browse, I want a text field that filters the grid by spirit/aspect name, so
    that I can jump straight to a spirit I already know by name instead of scanning the grid.
13. As the owner using Browse, I want the name search to combine with the existing dropdown
    filters (expansion, complexity, tag, strong-in) and the hard-filter checkbox, so that I can
    narrow by name and by attribute at the same time.
14. As the owner viewing the Archive power-card tab, I want a text field that filters by card
    name, so that I can find one card without scanning the whole deck view.
15. As the owner viewing the Archive fear/event/blight tab, I want the same name-search behavior
    there, so that both Archive sub-tabs are consistent.
16. As the owner, I want each of the three search inputs (Browse, `CardFilters`,
    `OtherCardFilters`) to filter only by name — not summary, notes, or other text fields — so
    that results stay predictable and match what "search" was asked for.
17. As the owner, I want the search match to be case-insensitive and to match anywhere in the
    name (substring), so that partial or lowercase typing still finds the right spirit/card.

## Implementation Decisions

- **Gallery arrow-nav** lives entirely in `SpiritDetail`: it already builds the panel
  front/back entries and the starting-card entries as separate lists and passes single
  `{src, alt}` selections to the shared `CardViewer` lightbox via `enlarged` state. Build one
  combined ordered list (panel front, panel back, card 0–3, skipping any that don't apply — e.g.
  no `startingCards` means those entries are omitted) and, only while `enlarged` is set from
  this list, attach a keydown listener for left/right arrow that advances/retreats the `enlarged`
  index within that list and wraps or clamps at the ends (clamp, not wrap — simplest, matches no
  stated wraparound requirement).
- `CardViewer`'s own interface (`src`, `alt`, `onClose`) is **not changed** — it stays a
  single-image lightbox. The sequencing/keydown logic is owned by `SpiritDetail`, so the Cards
  tab's use of `CardViewer` is untouched.
- Aspect images keep using `setEnlarged` exactly as today, outside the new sequence — opening an
  aspect image does not engage arrow-key navigation.
- **Recommend→Browse linkup**: lift a small piece of navigation-intent state up to `App` (the
  existing owner of `tab: Tab` local state) — e.g. a `browseTarget: { configId: string } | null`
  set by a callback passed into the Recommend result renderer, and cleared once consumed. `App`
  switches `tab` to `'browser'` and passes `browseTarget` into `Browser`.
- `Browser` gains an optional prop carrying the initial target (spirit id + optional aspect
  name, derived from the configuration id via the existing `toConfigId`/spirit-lookup
  utilities). On receiving a target, `Browser` seeds its internal `selected` state to that
  spirit on mount/update and passes the aspect name through to `SpiritDetail`'s existing
  `highlightAspect` prop — no new prop is needed on `SpiritDetail` itself, since it already
  supports this exact case (used today when opening from an aspect tile in the grid).
  A base-spirit recommendation passes no aspect name, so no highlight is applied — matching
  today's behavior when opening a spirit from its base tile.
- **Search inputs**: three independent, non-shared additions — a controlled text `<input>` and
  matching `useState<string>` in `Browser`, `CardFilters`, and `OtherCardFilters` respectively.
  Each filters its own existing list by case-insensitive substring match against the name field
  already used for display (spirit/aspect name in Browser; card name in the Archive filters).
  The search term combines with existing filter state via the same `useMemo` derivation each
  component already uses — an additional `&&` condition, not a new filtering pipeline.
  No shared search component is introduced — the three call sites don't currently share filter
  code and this doesn't change that.

## Testing Decisions

- Follow this repo's existing single-seam convention: all new cases append to
  `src/components/__tests__/appSmoke.test.tsx` rather than new test files, matching how
  `SpiritDetail`'s existing `highlightAspect` behavior is already tested there (rendering
  `SpiritDetail` directly with React Testing Library) and how cross-tab flows are tested by
  rendering `App`.
- Gallery arrow-nav: render `SpiritDetail` directly for a spirit with panel + full starting-card
  images, open the lightbox, dispatch arrow-key events, assert the enlarged image's `src`/`alt`
  advances through the expected sequence and clamps at both ends. Add a case for a spirit with a
  partial/absent `startingCards` array to assert the sequence only includes images that exist.
  Assert aspect-image clicks do not respond to arrow keys (or are simply outside the sequence).
- Recommend→Browse: render `App`, drive the Recommender flow to a result, click a recommended
  configuration, assert the active tab is now Browse and `SpiritDetail` is open for that spirit —
  with an additional case asserting the aspect row is highlighted when the recommendation was for
  an aspect, and not highlighted for a base-spirit recommendation.
- Search inputs: for each of `Browser`, `CardFilters`, `OtherCardFilters`, render the component,
  type a name substring into the new search field, assert the visible list narrows to matching
  items only, and assert it combines correctly with at least one existing filter (e.g. typing a
  name plus picking an expansion in Browser narrows to the intersection).
- Only test external behavior (rendered output, filtered lists, which modal/tab is showing) —
  not internal state shapes.

## Out of Scope

- Sourcing or adding any new image assets — panel and starting-card images are already complete
  for the base spirit set; this is a UX change only.
- Including aspect images in the arrow-key gallery sequence.
- Extending `CardViewer`'s own interface to be sequence-aware (e.g. accepting `items`/`index`) —
  the sequencing logic stays local to `SpiritDetail` for this change.
- Full-text search over summary/notes or any field other than name.
- A shared search/filter component unifying Browse and Archive — the three additions remain
  independent, matching the existing lack of shared filter code between those surfaces.
- URL-based deep linking / shareable links to a specific spirit or configuration — the
  Recommend→Browse jump is in-session navigation state only, not a router or URL param.
- Wraparound arrow navigation (looping from the last image back to the first) — clamping at the
  ends is the simpler default absent a stated requirement for wraparound.

## Further Notes

- Confirmed directly against the repo during grilling: `public/panels/` has all 74 files (37
  spirits × front/back) and `public/cards/<id>-0..3.webp` has all starting-card images for the
  base spirit set — an earlier pass mistakenly flagged `public/cards/unique/` (a different,
  incomplete directory unrelated to this feature) as the relevant asset location; it is not used
  by `SpiritDetail` and is irrelevant here.
- `SpiritDetail` already accepts a `highlightAspect?: string` prop, exercised today when opening
  the modal from an aspect tile in the Browse grid — the Recommend→Browse work reuses this
  mechanism rather than adding a new one.
