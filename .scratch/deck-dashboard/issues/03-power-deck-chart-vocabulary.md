# Power-deck chart vocabulary

Status: ready-for-human
Labels: wayfinder:prototype
Map: ../MAP.md

## Question

What plots do the Minor and Major deck views actually show? The owner named an UpSet plot
(element-combination intersections) — is that the right vocabulary, or do simpler forms
serve the at-the-table question better?

Run `/prototype`: build cheap, concrete candidates the owner can react to. Candidates to
cover at minimum:

- **UpSet plot** of element combinations (cards carry 1–3 elements; 3 element-less minors
  exist — `groupPowerCards` already handles a "No element" group).
- **Per-element bars with draw-N odds** — "chance of ≥1 Fire among the next 4 draws"
  (hypergeometric on the full deck; draw count default 4, decide whether N is adjustable).
- Secondary facets worth showing or dropping: cost distribution, fast/slow split.
- **Spirit highlight treatment**: how the picked spirit's elements (from `spirits.json`)
  read in each candidate.
- Whether a chart library earns its way in, or hand-rolled SVG (per `OcfduBars.tsx`) covers
  the winning form.

Deck contents come from the expansion picker (settled at charting; default = owned
collection). Resolution records the chosen vocabulary and links the prototype artifact.

## Comments
