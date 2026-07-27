import { useEffect, useRef } from 'react'
import { stepGalleryIndex } from '../domain/gallerySequence'

/**
 * Left/right arrow keys walk an enlarge sequence, looping at both ends.
 *
 * The keyboard shell around `stepGalleryIndex`, shared so the surfaces that enlarge a card can't
 * drift apart — `SpiritDetail`'s panel+starting-cards gallery (#01) and the tier board's card row
 * behaved differently before this existed. The stepping arithmetic stays in `domain/`, pure and
 * unit-tested; only the effect wiring lives here.
 *
 * Inert when `index` is `undefined` (nothing enlarged, or an image outside any sequence — an
 * aspect thumbnail, say) and when there is nothing to step to: a one-card tier row leaves the
 * arrows alone rather than re-rendering the same image under them.
 */
export function useGalleryArrows(index: number | undefined, length: number, onIndex: (next: number) => void) {
  const onIndexRef = useRef(onIndex)
  onIndexRef.current = onIndex

  useEffect(() => {
    if (index === undefined || length < 2) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      // Without this the arrows also scroll the page behind the overlay.
      e.preventDefault()
      onIndexRef.current(stepGalleryIndex(index as number, e.key === 'ArrowRight' ? 'right' : 'left', length))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [index, length])
}
