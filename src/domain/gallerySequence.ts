/** #01's arrow-key step: advance/retreat one position in the panel+starting-cards sequence,
 * looping from the last image back to the first (and vice versa) - pure so the wrap behaviour
 * is unit-testable without dispatching a real keydown event. */
export function stepGalleryIndex(current: number, direction: 'left' | 'right', length: number): number {
  const next = current + (direction === 'right' ? 1 : -1)
  return (next + length) % length
}

/** One image in an arrow-navigable enlarge sequence. */
export type GalleryImage = { src: string; alt: string }

/**
 * The enlarge sequence for a *tier row* of power cards.
 *
 * Scoped to the row, not the whole board: arrowing off the end of S into A would cross a rating
 * boundary the board exists to draw, and the rows are the only grouping the user can see. Looping
 * within the row is `stepGalleryIndex`'s job, unchanged from the spirit gallery (#01).
 *
 * `alt` is the card's name — the same text the tile's `figcaption` shows, so the enlarged view is
 * legible to a screen reader without transcribing any rules text (ADR 0002 / v3 #12).
 */
export function powerCardGallery(cards: { name: string; image: string }[], base: string): GalleryImage[] {
  return cards.map((card) => ({ src: `${base}${card.image}`, alt: card.name }))
}
