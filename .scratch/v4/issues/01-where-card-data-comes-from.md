# 01 — Where card data comes from

Status: ready-for-agent
Type: wayfinder:research (AFK)
Parent: [v4 map](../MAP.md)

## Question

The archive has 471 card **images** and no card **data**. Filtering by element, cost, speed, type or
expansion is impossible until a machine-readable source for those fields exists. Where does it come
from, and which fields can each card type actually supply?

## What is already known

`https://sick.oberien.de/cards.js` is a 276 KB compiled-TypeScript bundle that defines `PowerCard`,
`FearCard`, `ChoiceEventCard`, `StageEventCard`, `TerrorLevelEventCard`,
`HealthyBlightedLandEventCard` and `AdversaryEvent` classes and constructs the whole catalogue from
them. SICK is the same site the 471 images were mirrored from (`source_site: sick.oberien.de` on 471
of the 616 manifest rows), so its names already line up with `images/manifest.json`.

## What this ticket produces

A markdown summary at `.scratch/v4/card-data-source.md` answering:

1. **The source.** Is `cards.js` the whole catalogue, and is there anything upstream of it (an
   oberien repo with the data as JSON/TS before compilation)? Prefer the most upstream form.
2. **The field inventory, per card type.** For power cards: elements, cost, speed, range, target,
   type (minor/major/unique), expansion, spirit (for uniques), card text. For fear/event/blight:
   whatever they actually carry. **List the fields that exist. Do not list fields that ought to
   exist.**
3. **The join.** Does every one of the 471 mirrored images match exactly one card in the source, by
   name? Report the misses in both directions — a card with no image, an image with no card. Do not
   guess a match.
4. **Which of the owner's filters are sourceable and which are not.** He named: elements, cost,
   quick/slow, major/minor, expansion. If any of those is not in the source, say so plainly — that
   filter then does not ship, rather than shipping fabricated.
5. **Licensing/attribution of the *data*.** The image-hosting risk is already accepted and settled;
   this is a separate, one-line note on what SICK says about reuse, if anything. Report it, do not
   litigate it.

Nothing is written into `src/data/` by this ticket — that's [#02](02-land-the-card-dataset.md).
