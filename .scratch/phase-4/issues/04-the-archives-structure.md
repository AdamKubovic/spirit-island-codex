# 04 — The Archive's structure: tabs vs subfolders

Status: needs-triage
Type: wayfinder:grilling (HITL)
Parent: [phase-4 map](../MAP.md)

## Blocked by

_(nothing)_

## Question

Does the Archive keep card-type tabs on top, or restructure into subfolders per type? The owner
explicitly wants the agent's counsel on the implications — they don't know what each option costs.

Facts to bring to the grilling (read `CardsTab.tsx` first):

- The Archive is a single component with a **6-segment switch** (Minor / Major / Fear / Events /
  Blight / Adversaries / Scenarios area) — v5 grew it from 4 to 6 segments and it already
  overflowed a 375px viewport once, caught and fixed in v5 #05b. More segments won't fit; that's
  part of why the question exists.
- There is **no backend** — this is a static Vite site with in-memory state and no router. What
  the owner calls "backend implications" is really: component structure, whether the app adopts
  URL routing (subfolders imply URLs; today tab state is a `useState` in `App.tsx`), and what
  either shape does to deep-linking later (deep-linking a single card is v5 fog, still open).
- The locked Archive sorting call (Minor/Major groupable by cost/elements/speed; Fear stays
  alphabetical) lands on this surface — the structure chosen must leave room for per-type
  controls that differ between types.

The decision is structure only; the sorting/grouping build is spec work downstream.

## Comments
