# 03 — The radar chart: fix or replace

Status: needs-triage
Type: wayfinder:prototype (HITL)
Parent: [phase-4 map](../MAP.md)

## Blocked by

_(nothing)_

## Question

Does `OcfduRadar` get its colouring fixed for the dark theme, or is it replaced entirely by a
panel showing the spirit's composition, styled like the original game's spirit panels? What's
feasible?

Facts: `OcfduRadar.tsx` has two consumers — `SpiritDetail.tsx` (Browse's detail view) and
`Recommender.tsx`. Whatever wins must work in both, or the ticket decides they diverge.

This is a prototype ticket: build both cheap versions against real spirit data and let the owner
react — v5's tag-colour ticket (#08 there) is the model, screenshots per round.

- **Variant "fix":** the existing radar with dark-theme-correct colours.
- **Variant "replace":** a composition panel in the game's visual idiom (growth track / presence
  track / innate powers layout). Prototype the *layout* with placeholder styling; whether official
  fonts/icons/formatting may be used is
  [#05](05-official-assets-and-licensing.md)'s question — don't wait on it, note the seam where
  official assets would drop in.

Feasibility counsel to bring: what composition data the app actually has per spirit (the panel can
only show what's sourced — this repo never invents data), and roughly what the replace variant
costs at 68-configuration scale.

## Comments
