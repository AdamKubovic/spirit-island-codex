# 0019 — The app promises parity between its two layouts

Status: accepted
Date: 2026-08-07
Parent: 0015 (PWA posture)

## Context

The app is one responsive PWA (ADR 0015), but its phone and desktop renderings were not held to
the same bar. The ux-discoverability fold (homepage command deck, Settings complexity panel,
Glossary concept cards, Dashboard expansion cards, collection-affordance links) was designed and
screenshotted at desktop width, and the breakpoint system was five loose `@media` rules (`900`,
`720`, `640`, `480`, `480`) with no recorded promise about which widths are good. The phone
layout worked where the mobile-panel effort had built it (shell, drawer, "Your answers"
disclosure) and was unconsidered elsewhere — a visitor on a phone could land on a surface that
was never designed for their width, with no contract saying that was wrong.

A parity audit (ticket 01) measured every surface at 1280 and 390: two surfaces overflowed the
viewport horizontally (the Dashboard spirit picker's intrinsic-width select, 59px; the Log entry
form's fieldset, 20px), and every other surface reflowed without dropping content — but that was
luck of the CSS, not a promise.

## Decision

The app records a **parity promise** between its two named **layouts**:

- **Phone layout** — `≤640px`, top-bar + drawer shell (ADR 0011/0014 chrome).
- **Desktop layout** — `>640px`, sidebar shell.

The existing breakpoint numbers (`900`, `720`, `480`) are **anonymous refinements inside these
two tiers**, never moved, renamed, or re-architected. There is no third named tier; `480` exists
to fix real 375px-wide phones.

**Parity means same content, same quality:**

- **Content parity is the hard floor.** Every piece of content and every action available in one
  layout is available in the other, adapted to the width. A surface that cannot fit at phone
  width says *less* (a printed-value column hidden at compact widths); it never drops a datum and
  never invents one.
- **Visual quality is the review bar** (tap targets, density, no clipping, no sideways page
  scroll). It is judged by **screenshot verification**: an all-surface screenshot audit at the
  two widths (1280 and 390), plus machine probes for page overflow, clipped content, and
  undersized targets.

Alternatives considered and rejected:

- **"Mobile website" as a second product.** One codebase, one deployment, one data store — the
  phone layout is the same app at a narrower viewport, never a separate build or route.
- **Responsive as an unstated property.** The system already *was* responsive; the failure was
  that nothing promised which widths were good. Recording the promise is the change.
- **More breakpoints.** Adding a named mid-tier would create three layouts and re-architect the
  existing five rules for no measured gain at the verification widths.

## Consequences

- **New surfaces are built against a contract.** A surface ships when it meets the parity bar at
  both widths — designed for its width, not merely reflowed.
- **Content parity is pinned in the smoke suite.** Because the app is CSS-only responsive (one
  DOM for both layouts), server-rendered markup presence is the honest seam for the content-parity
  floor (ticket 08). Layout itself is not unit-testable and is not gated in CI; screenshots remain
  local evidence in `.scratch/`, never committed.
- **The audit harness is the verification mechanism.** One-off Playwright run over every surface
  at both widths, screenshot + probe output; re-run at the close of this effort and whenever a
  future surface lands.
- **Glossary terms** *Layout* and *Parity* (in `CONTEXT.md`) are this ADR's vocabulary; the ADR
  is their durable, surprising-without-context companion.
- Reverting this means deleting the ADR and losing the only recorded statement of which widths
  the app promises to be good at.

## References

- `src/deck.css` — the `640` phone block and the anonymous `900`/`720`/`480` refinements.
- `CONTEXT.md` — glossary entries *Layout* and *Parity*.
- `.scratch/phone-laptop-parity/` — PRD, audit harness, baseline and after checklists (local-only).
