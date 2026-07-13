# 02 — The Settings tab

Status: done
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

**Resolution (2026-07-13, grilled with the owner — four decisions, all owner's calls):**

The grill's key fact find: the "Customise tiers" tab was already a proto-Settings tab —
`TierEditor.tsx` hosts tier editing *plus* Backup, My collection (the v5 expansion toggles), and
Complexity overrides. So the question became the tab's fate, not what to move.

1. **Customise tiers dissolves.** Tier editing moves into the Tier list tab as an **edit mode on
   the owner's own board**; the tab's three settings sections migrate to a new Settings tab. The
   edit-mode UX is downstream build work — noted on
   [#07](07-tier-list-browser-interconnect.md) so the interconnect prototype stays compatible,
   and it hands [#06](06-multi-tier-list-architecture.md) a cleaner premise (editing is
   per-list, not a global tab).
2. **Settings ships with exactly the migrated trio** (Backup, My collection, Complexity
   overrides) **plus an open-door policy**: any future durable, app-wide preference defaults to
   Settings unless its ticket argues for surface-local — pre-answering knob placement for
   [#08](08-the-recommenders-short-term-shape.md) (recommendation prefs, if any) and
   [#06](06-multi-tier-list-architecture.md) (default-list pick, if any).
3. **The v5 split survives.** Settings owns the durable collection; Browse, Recommend, and the
   tier board keep their session-only "hide unowned" checkboxes beside the results.
   Annotate-over-hide stays the default posture ("information, not silence").
4. **The button is "Settings", last in nav.** Nav is now fixed at both ends — Browse first (from
   [#01](01-the-homepage.md)), Settings last; middle order finalized at
   [#09](09-assemble-the-phase-4-spec.md).
