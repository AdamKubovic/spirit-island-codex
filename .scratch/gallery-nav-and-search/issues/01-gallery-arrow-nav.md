Status: done

# Gallery arrow-nav in spirit detail modal

## Parent

.scratch/gallery-nav-and-search/PRD.md

## What to build

In the spirit detail modal's enlarge lightbox, let the owner arrow through a spirit's panel
front, panel back, and starting cards 0–3 as one sequence instead of closing and reopening the
lightbox for each image individually. The sequence only includes images that actually exist for
that spirit (e.g. a spirit with no `startingCards` array only has the two panel images in its
sequence). Arrow-key navigation clamps at both ends (no wraparound). Aspect images are unaffected
— they keep opening the same lightbox with no arrow-key behavior. The shared lightbox component's
own interface stays a single-image `src`/`alt`/`onClose` — the sequencing logic lives in the
spirit detail modal itself, so the Cards/Archive tab's use of the same lightbox is untouched.

## Acceptance criteria

- [ ] Opening any panel or starting-card image from a spirit's detail modal enters a combined
      ordered sequence: panel front, panel back, card 0, card 1, card 2, card 3.
- [ ] Left/right arrow keys advance/retreat through that sequence while the lightbox is open,
      clamping (not wrapping) at the first and last image.
- [ ] A spirit with a partial or absent starting-cards list only includes the images that exist
      in the sequence — no placeholder or broken-image entries are inserted to pad it out.
- [ ] Opening an aspect image still uses the same lightbox, but arrow keys do not navigate a
      sequence for it (it remains single-image, click-to-close only).
- [ ] The lightbox's existing click-to-close behavior keeps working unchanged.
- [ ] The Cards/Archive tab's existing use of the same shared lightbox component is unaffected —
      no sequencing behavior leaks into it.

## Blocked by

None — can start immediately.

## Comments

Implemented and tests added in `src/components/__tests__/appSmoke.test.tsx`.
