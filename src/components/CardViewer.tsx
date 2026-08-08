import { useEffect, useRef, useState } from 'react'
import { wikiLink } from '../domain/wiki'

/** A click-to-enlarge card image, lifted out of `SpiritDetail` (v3 #11) so any surface — the
 * Cards tab included — can reuse it instead of building a second one.
 *
 * Escape-to-close and focus restoration live here rather than in any one caller: there are a
 * dozen call sites and every one of them wants both, so a surface that forgot would be an
 * accessibility hole nobody notices. Callers keep owning *what* is shown; the viewer owns the
 * overlay's own keyboard contract.
 *
 * `wikiTitle` is optional: when a caller knows the content's wiki page (the Archive's cards), the
 * viewer shows the ADR 0020 link-out back to it. Surfaces without a page — spirit panels, the
 * tier board's tiles — simply don't pass it.
 */
export function CardViewer({
  src,
  alt,
  onClose,
  wikiTitle,
}: {
  src: string
  alt: string
  onClose: () => void
  wikiTitle?: string
}) {
  const [failed, setFailed] = useState(false)
  // Held in a ref so the listener can be mount/unmount-scoped: every call site passes a fresh
  // inline arrow, which would otherwise tear the listener down and rebuild it on every render.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    // Whatever had focus when the overlay opened — usually the tile's zoom button. Restored on
    // close so a keyboard user comes back to their place instead of the top of the document.
    const opener = document.activeElement as HTMLElement | null
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      e.preventDefault()
      onCloseRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      opener?.focus?.()
    }
  }, [])

  return (
    <div
      className="card-enlarge-backdrop"
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      {/* The same missing-file posture as every tile that opens this: a plain placeholder,
          never the browser's broken-image glyph. */}
      {failed ? (
        <p className="card-enlarge-missing">{alt} — image unavailable</p>
      ) : (
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      )}
      {wikiTitle && (
        <a
          className="card-enlarge-wiki"
          href={wikiLink(wikiTitle)}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {wikiTitle} — wiki page ↗
        </a>
      )}
    </div>
  )
}
