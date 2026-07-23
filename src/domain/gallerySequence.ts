/** #01's arrow-key step: advance/retreat one position in the panel+starting-cards sequence,
 * clamping (never wrapping) at both ends - pure so the clamp behaviour is unit-testable without
 * dispatching a real keydown event. */
export function stepGalleryIndex(current: number, direction: 'left' | 'right', length: number): number {
  const next = current + (direction === 'right' ? 1 : -1)
  return Math.min(length - 1, Math.max(0, next))
}
