# 02 — The Settings tab

Status: needs-triage
Type: wayfinder:grilling (HITL)
Parent: [phase-4 map](../MAP.md)

## Blocked by

_(nothing)_

## Question

Exactly what moves into a Settings/Customization tab, and how does it interact with the Browse and
Recommend views?

Candidates the owner named: ownership (the v5 collection store and its expansion toggles), custom
tiers (today a whole nav tab — "Customise tiers", `TierEditor.tsx`), and recommendation
preferences. The grilling should walk the full inventory of app state and sort each piece:
moves to Settings, stays on its surface, or lives in both.

Things to pin down:

- **The boundary between a setting and an in-view control.** v5 deliberately put the collection
  *hard-filter* toggle on each surface (session-only, next to the results it filters) while the
  collection itself is durable state. Does that split survive, or does Settings absorb the
  toggles too?
- **Custom tiers.** Does the "Customise tiers" tab fold into Settings, and if so what happens to
  its nav slot?
- **Recommendation prefs** are contingent on
  [#08](08-the-recommenders-short-term-shape.md) — if the recommender strips down to a button,
  there may be no prefs to house. Record the dependency rather than guessing #08's answer.
- **Complexity preference** (`complexityStore`) and anything else durable that currently has no
  visible home.

## Comments
