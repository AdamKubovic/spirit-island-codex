# 01 — The homepage

Status: needs-triage
Type: wayfinder:grilling (HITL)
Parent: [phase-4 map](../MAP.md)

## Blocked by

_(nothing)_

## Question

What is the homepage — its content, how it frames the app's purpose, and what it links to?

There is no homepage today: `App.tsx` boots straight into the Recommend tab, which is also pinned
first in nav. Two owner calls are already locked and shape this ticket: the Spirit Island logo
becomes clickable → homepage, and "Recommended" loses its pinned top spot. The current nav is
Recommend / Browse / Archive / Tier list / Customise tiers / Log.

Things the grilling should pin down:

- **Purpose framing.** The audience is broad — gamers who know Spirit Island and non-gamers who
  don't. Does the homepage explain the game, the app, or both? What does a first-time visitor do
  next?
- **What it links to.** Which surfaces get top billing, and does the homepage replace Recommend as
  the default view?
- **Its relationship to nav.** Is "home" a nav tab, or reachable only via the logo?

Interactions, not blockers: [#02](02-the-settings-tab.md) may change what tabs exist, and
[#08](08-the-recommenders-short-term-shape.md) may change what the recommender entry point looks
like. Decide the homepage top-down; where its links depend on those outcomes, record the
requirement ("links to whatever #08 produces") and let
[#09](09-assemble-the-phase-4-spec.md) reconcile.

## Comments
