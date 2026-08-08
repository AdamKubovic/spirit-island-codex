import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { glossaryEntry } from '../domain/glossary'

/**
 * Inline glossary term: dotted underline + popover on hover/click/focus. An id absent from the
 * map renders as plain text (no broken affordance) so missing definitions stay honest.
 *
 * The popover opens above the term; when the term sits so close to the top of the viewport that
 * the popover would clip (Browse's Complexity caption on a fresh load), it flips below instead.
 */
export function Term({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  const entry = glossaryEntry(id)
  const [open, setOpen] = useState(false)
  const [below, setBelow] = useState(false)
  const tipId = useId()
  const wrapRef = useRef<HTMLSpanElement>(null)
  const popRef = useRef<HTMLSpanElement | null>(null)

  // The popover is in the DOM only while open, so measure after it renders.
  useEffect(() => {
    const wrap = wrapRef.current
    const pop = popRef.current
    if (!open || !wrap || !pop) return
    setBelow(wrap.getBoundingClientRect().top - 6 < pop.getBoundingClientRect().height)
  }, [open])

  if (!entry) {
    return className ? <span className={className}>{children}</span> : <>{children}</>
  }

  return (
    <span ref={wrapRef} className={className ? `term-wrap ${className}` : 'term-wrap'}>
      <button
        type="button"
        className="term"
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={(e) => {
          // Don't dismiss a keyboard-focused term just because the pointer left.
          if (e.currentTarget !== document.activeElement) setOpen(false)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false)
            e.currentTarget.blur()
          }
        }}
      >
        {children}
      </button>
      {open && (
        <span ref={popRef} id={tipId} role="tooltip" className={below ? 'term-popover term-popover-below' : 'term-popover'}>
          {entry.text}
        </span>
      )}
    </span>
  )
}
