# 12 — Panel and card images in the detail view

Status: done (cards only — panels still render `PlaceholderArt`, see Comments)

## Parent

`.scratch/v3/PRD.md`

## What to build

The detail view gains the spirit's panel and its four starting power cards, **as images**.

- **Panel front** — growth options and presence tracks are printed on it.
- **Panel back** — innate powers and setup are printed on it.
- **Four starting power cards**, each labelled with its name from `startingCards`, so the view is
  usable with a screen reader and a card is searchable by name.
- Tap or click a card to **enlarge** it, so its rules text is readable on a phone.

Nothing is transcribed. Growth options, presence tracks, innate powers and card rules text are
**not** turned into fields — nothing computes on them, and every hand-typed rules string is a
fabrication opportunity this repo has already paid for three times. They are legible on the images.

- Assets: panels at `public/panels/<spiritId>-{front,back}.webp`; cards at
  `public/cards/<spiritId>-<n>.webp`, where `n` is the index into `startingCards`.
- **A missing image renders the existing `PlaceholderArt` rather than breaking the view.** 259
  assets will not arrive at once, and this ticket ships green with zero of them present.
- **A spirit with no `startingCards` renders its panels and no card row**, rather than four
  placeholders labelled with nothing. #11 leaves the key absent where it could not read the names.
- **An aspect configuration shows its base spirit's panel and cards**, plus the aspect's `delta`
  text. Some aspects alter a spirit's starting cards or panel; the repo has no data on which, and
  this ticket will not guess. Establishing that mapping is a separate transcription job with its own
  tripwire (see the PRD's Out of Scope).

## Acceptance criteria

- [ ] The detail view shows panel front, panel back, and four card images
- [ ] Each card image's alt text is its name from `startingCards`
- [ ] A spirit with no `startingCards` shows its panels and omits the card row entirely
- [ ] A card image enlarges on click/tap and can be dismissed
- [ ] A spirit with no panel or card assets present renders `PlaceholderArt` for each and does not
      throw — verified in `appSmoke.test.tsx`
- [ ] An aspect configuration shows the base spirit's images and the aspect's `delta`
- [ ] No growth option, presence track, innate power or card rules text is transcribed into data
- [ ] The page does not scroll horizontally on a phone-width viewport

## Blocked by

- #10 (there is no detail view to put images in)
- #11 (four images on one page need four alt texts, and there is no filename mapping without the
  names)

## Comments

Resolved 2026-07-09, cards side. `SpiritDetail.tsx` renders panel front/back (always
`PlaceholderArt` right now — no panel assets exist yet, see #11) and, when `startingCards` is
present, a card grid with each image's alt/label set from the card name. Clicking a card opens a
full-size overlay (`.card-enlarge-backdrop`); clicking that overlay dismisses just the enlarged
card, not the whole detail view (verified: the detail modal stays open underneath). A spirit with
no `startingCards` renders no card row at all — no placeholder cards, no empty heading.

Verified with a real headless-browser pass, not just the test suite: clicking a spirit tile opens
the modal with real card art, enlarging works and is dismissible, and at a 375px viewport the
page has zero horizontal overflow (`scrollWidth === clientWidth`). `appSmoke.test.tsx` covers the
no-throw and no-`startingCards` cases; `dataIntegrity.test.ts` asserts a card image file exists on
disk for every `startingCards` entry.

**Not addressed:** the aspect-configuration acceptance criterion. Browse has no aspect-level
selection UI (only base spirits are clickable), so there is no path that reaches "an aspect
configuration's detail view" yet — the detail view always shows a spirit's own images plus *all*
of its aspects' `delta` text (already true, unchanged from #10), which is the only aspect-facing
behaviour there currently is to verify.
