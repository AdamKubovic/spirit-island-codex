# 02 — The modal variant round 🎨

Status: ready-for-agent
Label: wayfinder:prototype (HITL — the owner picks)
Parent: [Panel theming map](../MAP.md) · [PRD](../PRD.md)

## Blocked by

- [01 the panel vibe sheet](01-panel-vibe-sheet.md) — variants are built from its sampled
  palette, not guesses.

## Question

Which panel-aligned treatment does the owner want for the spirit detail modal?

Build three coherent compositions on the REAL modal, gated on `?panel=A|B|C` (the #20–#22
pattern: floating switcher, byte-identical without the param, production build):

- **A — light parchment + nodes:** the modal becomes a light parchment card over the dark app;
  OCFDU renders as five panel-style nodes carrying the true figures.
- **B — dark translation + nodes:** panel palette translated into the dark theme (umber/tan
  surfaces, parchment text); same node treatment.
- **C — dark + retinted bars (anchor):** the conservative composition — #23's vertical bars
  kept, retinted to the sampled palette on a dark-translated surface.

Constraints inherited from the map: vibe not replica; #11's data rules (true figures, clamped
track, absent = unrated); chips/buttons inside the modal must stay legible in every variant
(the light-surface chip question is mapped fog — variants may hold chips as-is and note the
tension, not solve it). Screenshots (baseline + each variant, modal open, 375px + 1280px) to
`../screenshots-02/`; ticket waits at `needs-info` for the pick — never self-close.

Resolution = the owner's pick recorded, plus their reactions worth carrying into the ship
ticket (e.g. "A but warmer", size notes).

## Acceptance criteria

- [ ] Three compositions (A light parchment + nodes, B dark translation + nodes, C dark +
      retinted bars anchor) live behind `?panel=A|B|C` with the floating switcher; the app is
      byte-identical without the param
- [ ] Every colour traces to the vibe sheet's sampled palette
- [ ] OCFDU truth rules hold in every variant (a transcribed 6 shows 6 over a clamped track;
      unrated renders nothing)
- [ ] Screenshots (baseline + each variant, modal open) at 375px + 1280px in
      `../screenshots-02/`; no horizontal overflow at 375px
- [ ] Ticket left at `needs-info` carrying the pick question — never self-closed
