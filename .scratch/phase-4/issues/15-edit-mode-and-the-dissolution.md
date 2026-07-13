# 15 — Edit mode and the dissolution

Status: done
Parent: [Phase 4 PRD](../PRD.md) · cluster 3 (app restructure)

## Blocked by

- [#14 the Settings tab](14-the-settings-tab.md) — the other three sections must already have
  their new home before the Customise tab can be deleted.

## What to build

Tier editing moves onto the board, completing the
[Settings resolution](02-the-settings-tab.md)'s dissolution call: the Tier list tab gains an
**edit mode** available only when the active list is personal-origin. In edit mode the owner
assigns and moves configurations between tiers (including the unrated bucket) directly on the
board, persisting through the existing override machinery. Cited lists show no edit affordance —
the store already refuses their edits; the UI must not offer them. With editing relocated, the
Customise tiers tab is deleted, leaving nav as: Browse, Recommend, Archive, Tier list, Log,
Settings.

Note for [#17](17-the-interconnect.md): edit mode owns tile clicks while active — the
view-mode click-to-detail behaviour arrives there and must never fire during editing.

## Acceptance criteria

- [x] Edit mode toggle appears only for personal-origin lists; cited lists offer no editing
- [x] Assigning/moving a configuration's tier on the board (incl. to/from unrated) persists and
      survives reload
- [x] The Customise tiers tab is gone from nav and from the codebase
- [x] Nav reads exactly: Browse, Recommend, Archive, Tier list, Log, Settings (app smoke asserts)
- [x] Existing tier-store override/fingerprint tests still pass unchanged

## Comments

**Resolved (2026-07-13).** The board gains an **Edit tiers** toggle (personal-origin lists only —
gated on the *current* list's origin, so a toggle left on can't edit a cited list after a
switch); in edit mode every tile carries a tier select whose options are the list's own labels
plus Unrated. "To unrated" needed one store addition: `clearTier`, which writes an empty-string
sentinel **in the override layer only** — `getTier`/`getAll` strip it, so it never renders,
never reaches the rank prior, and never enters a list's own `tiers` (ADR 0001's absence rule is
about the cited document, untouched). Where the seed never rated a config, clearing deletes the
override instead, so it isn't a phantom edit. The sentinel rides the existing
`Record<string,string>` backup schema unchanged (round-trip tested); note for the record: `''`
is now a reserved value in that schema, and a canon test pins that no shipped list may use an
empty tier label. `TierEditor.tsx` is deleted; nav reads exactly Browse, Recommend, Archive,
Tier list, Log, Settings.

Two regressions the dissolution would have smuggled in, caught by code review and fixed here:
the **"Reset to the shipped tier list" button** (its only UI died with the editor — now lives in
edit mode, same confirm) and the **tier discard notice** (fingerprint-mismatch data loss would
have become silent — now shown on the board with its Dismiss). Also kept: the create-a-personal-
list form, whose only `allowCreate` caller was the editor — the board's controls take it over,
judged in-spec (edit mode presupposes a personal list to edit).

Verified: 352/352 (8 new clearTier store tests, canon guard, smoke: exact nav, edit affordance
per origin); production build at 375px + 1280px — move to S, to Unrated, back out, reload
persistence, reset-restores-seed, cited list offers nothing. Screenshots in `../screenshots-15/`.
