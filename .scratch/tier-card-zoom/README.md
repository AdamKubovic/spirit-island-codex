# tier-card-zoom — enlarge a power card from the tier board

Status: done (owner to confirm on Pages)

## Origin

Owner request, 2026-07-27, routed through `/ask-matt`:

> "We have the major and minor power tier lists. However, similar to the spirits, I would like to
> click on the icon and then I would like to see the contents over the cards. I would like to sort
> of the zoomed-in view so it is not the case right now."

No PRD or grilling pass — the target behaviour already existed on the spirit surfaces (v3 #11), so
this was a single-session `/implement` against a two-line spec rather than a chartered effort.

## What the gap actually was

Narrower than it sounded. `CardTile` already rendered real card art from `card.image`, every one of
the 332 records in `src/data/power-cards.json` carries a populated `image`, and all 332 files exist
under `public/` (pinned by `cardCanon.test.ts`). There was no missing name→image mapping and no
asset work. The tile simply had no click handler and `TierBoard` never imported the `CardViewer`
that eight other surfaces already used.

## Decisions

Two questions were put to the owner before building; both answers are load-bearing.

**Only the image is the click target, not the tile.** The tile already contains the edit-mode tier
select, so a tile-wide button would nest an interactive control inside a button. The art is wrapped
in a real `<button class="tier-tile-card-zoom">` with an `aria-label`, keyboard-reachable and
announced; the `<figure>` stays inert.

**Arrow navigation is scoped to the tier row, not the board.** The spec didn't say, so both scopes
were inventions — but `stepGalleryIndex` wraps, and a whole-board sequence would walk silently
across the tier boundaries the board exists to draw. The row is also the only grouping on screen.
Recorded in `src/domain/gallerySequence.ts`.

**Enlarging stays live during edit mode** — a deliberate divergence from the spirit tile, which
suppresses its click-to-open while editing (#17). That suppression exists because there the *whole
tile* is the open target and would swallow the select; the image-only constraint above removes the
conflict entirely. Reading a card is most useful exactly while deciding its tier. Reversible in one
line if the owner disagrees.

## Scope taken on during review

`/code-review` flagged that the first pass duplicated `SpiritDetail`'s arrow-key effect and added
Escape-to-close to the tier board only. Rather than ship the second keyboard shell:

- `useGalleryArrows` (`src/components/useGalleryArrows.ts`) is now the single arrow-key effect,
  used by both `SpiritDetail` and `TierBoard`, so the surfaces can't drift. The stepping
  arithmetic stays pure and unit-tested in `domain/gallerySequence`.
- Escape-to-close and focus restoration moved into `CardViewer` itself. All eleven call sites
  wanted both; fixing only the tier board would have left the other ten without them.
- `CardViewer` renders a placeholder for an image that fails to load, matching the missing-file
  posture its calling tiles already had. Defence-in-depth only — `cardCanon.test.ts` means no
  power card can 404 today.

This is wider than the request. Judged the honest fix over knowingly landing a third copy.

## Verification

`npm run build` clean; 608 tests pass. Static-markup smoke tests can't cover interaction, so this
was also driven headless in a real browser: both the minor and major boards, arrow wraparound at
both ends, Escape, focus returning to the originating tile button, opening via Enter, and
`SpiritDetail`'s gallery still intact after the refactor. No page errors.

## Not done

Nothing outstanding in scope. Note that the tier board's *spirit* tiles are unchanged — they still
open the detail modal tile-wide, which is the right behaviour for them.

## Comments

Landed in `11b48e4`. Deployed by hand via `npm run deploy`, because the `on: push` trigger still
does not fire — see `.scratch/deploy-push-trigger/README.md`.
