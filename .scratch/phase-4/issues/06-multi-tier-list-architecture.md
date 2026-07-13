# 06 — Multi-tier-list architecture

Status: needs-triage
Type: wayfinder:grilling (HITL)
Parent: [phase-4 map](../MAP.md)

## Blocked by

_(nothing)_

## Question

How does the tier-list model generalise to lists that rank things other than spirit
configurations — e.g. Minor/Major power card tier lists from other channels — without painting
the design into a corner for future multi-game support?

Facts to bring (read `src/data/tier-lists/` and the tier types first):

- The app already supports **multiple spirit tier lists** — three ship today (two cited with full
  `source` attribution, one personal). List plumbing exists; the open question is **entity-type
  generality**: every list's `tiers` map is keyed by spirit/configuration id.
- What "the spirit's tier" means once lists multiply is this ticket's to answer — it directly
  feeds [#07](07-tier-list-browser-interconnect.md) (Browse detail shows the spirit's tier: from
  which list?). Default list? Per-list display? Owner's pick?
- v5 ruled "rating or tiering cards" **out of scope** — but that ruling was about *this repo
  inventing* ratings. Importing someone else's published card tier list with citation is the same
  move as the existing spirit lists, not a violation. Don't false-trip on it; do note the
  distinction in the resolution.
- The multi-game platform vision is fog on the map: the shape chosen here shouldn't preclude it
  (e.g. game-scoped entity ids), but this ticket does **not** design multi-game.

Run with `/grilling` + `/domain-modeling` — the resolution should name the concepts (list, entity
kind, default list) precisely enough that the spec can state a schema.

## Comments
