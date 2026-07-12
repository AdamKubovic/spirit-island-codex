# 05b — Scenarios browse, and the tab's rename

Status: done
Type: wayfinder:task (AFK)
Parent: [v5 map](../MAP.md) · Spec: [PRD.md](../PRD.md)

## Blocked by

- [#04 — The tab's new name, and what an adversary or scenario tile shows](04-the-tabs-new-name.md)
- [#05a — Adversaries browse](05a-adversaries-browse.md)

## What to build

The 16 scenarios become browsable as a second new segment, and the tab is renamed to whatever #04 chose —
in the nav, in the page title, everywhere. The rename lands here, with the last segment, so the tab is
never briefly named for content it doesn't have.

**This is a different job from [#05a](05a-adversaries-browse.md), and the difference is the whole risk.**
Adversaries had a dataset waiting. **Scenarios have none, and no upstream source has one** — v4 #01's
source (`sick.oberien.de`, from `oberien/spirit-island-card-katalog`) is a *card* catalogue. It does not
know what a scenario is. So the scenario dataset must be derived from `images/manifest.json` itself, and
the manifest is only `{file, name, asset_type, spirit, source_url}`.

Which means: **expansion may not be derivable for a scenario at all.** Check before assuming. If it isn't
in the manifest, then a scenario record has no expansion, there is no expansion filter on the Scenarios
segment, and that is the correct outcome.

**Do not infer the expansion from the scenario's name.** Do not infer it from what you know about Spirit
Island. This repo has shipped fabricated OCFDU ratings, wrong elements, and five aspects that do not
exist, and this ticket — deriving a dataset from a source that mostly can't answer — is precisely the
shape of the work that produced them. A field that cannot be sourced is **absent**. A Scenarios segment
with fewer filters than the others is not a gap; it is the data telling the truth.

**16 fronts, 15 backs.** One scenario has no back. Find out which one and handle it — don't crash, don't
render an empty frame, and encode it in the test as a known fact rather than a tolerance. Whether a
front/back pair is one flipping tile or two separate tiles is #04's call, not this ticket's.

There is also 1 `scenario_shared_component` in the manifest. Decide what it is before deciding whether it
belongs in the grid.

## Acceptance criteria

- [x] A Scenarios segment renders all 16 scenarios, in the shape #04 chose.
- [x] The tab is renamed in the nav and page title, and the new name still fits at 375px.
- [x] No field on any scenario record is a guess. Anything the manifest cannot source is absent, and the
      absence is noted in the dataset's own comment header (as `adversaries.json`'s `_note` does).
- [x] The scenario with no back doesn't break, and a test names it.
- [x] A test asserts the count against the manifest, so a missing image fails the build.
- [x] Enlarging a scenario opens the same `CardViewer` the card segments use.
- [x] Verified in a real browser at 375px and desktop, against a production build.

## Comments

`scripts/extract-scenarios.mjs` derives `src/data/scenarios.json` straight from
`images/manifest.json`'s 16 `scenario_front` rows — no expansion field (the manifest has none,
and no other source in this repo knows what a scenario is), noted in the JSON's own `_note` per
the ticket's ask. The manifest's 1 `scenario_shared_component` row (reusable board pieces, `name:
null`) is deliberately excluded, documented in the script's header comment.

**Varied Terrains is the scenario with no back** — confirmed against the manifest (16
`scenario_front`, 15 `scenario_back`) and named explicitly in
`src/domain/__tests__/archiveIntegrity.test.ts`. Moot for rendering: #04 decided scenario tiles
are front-only, so the missing back never gets requested.

The tab is renamed **"Archive"** in both the nav (`src/App.tsx`) and the page heading
(`CardsTab.tsx`'s `<h2>`). `ScenarioRows.tsx` (rows view) shows name only — no expansion column,
since there's nothing honest to put there; grid view reuses the existing generic `CardGrid`
directly rather than a new component, since a scenario is exactly the `{name, image}` shape it
already takes.

Built alongside [#05a](05a-adversaries-browse.md) in one pass; see its Comments for the shared
`slug.ts` extraction and the code-review findings (unsound cast, duplicate slugify, hardcoded
manifest counts) that were fixed before this commit, plus the browser-verified 375px overflow fix
(`.card-view-switch` needed `flex-wrap` once it grew to 6 segments).

Both segments unblock nothing further — #05a/#05b were the last items under the adversaries/
scenarios branch of the map.
