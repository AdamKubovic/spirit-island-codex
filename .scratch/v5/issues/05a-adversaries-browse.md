# 05a — Adversaries browse

Status: done
Type: wayfinder:task (AFK)
Parent: [v5 map](../MAP.md) · Spec: [PRD.md](../PRD.md)

## Blocked by

- [#04 — The tab's new name, and what an adversary or scenario tile shows](04-the-tabs-new-name.md)

## What to build

The 8 adversaries become browsable as a new segment on the card tab, showing whatever #04 decided a
tile shows (panel art alone, or panel art plus the data).

**The whole point of this ticket is that the data already exists.** `src/data/adversaries.json` holds
all 8 with their 0–6 level ranges, transcribed from spiritislandwiki.com one page at a time, guarded by
`adversaryCanon.test.ts`, and already driving the Recommender's adversary picker. The 8 panel images are
already in `images/manifest.json` as `adversary_panel`.

So this is a **join**, not an extraction. There is no new dataset.

**Do not create a second adversary record.** One adversary, one record, used by both the Recommender and
the browser. If the join needs a field the JSON lacks — an image path — add the field to the existing
file; don't fork it, and don't build a parallel `adversary-cards.json` alongside the one that's already
canon-tested. Two adversary datasets will drift, and the tripwire only guards one of them.

Reuse the existing browse machinery: the segmented type switch, the grid/rows toggle, and `CardViewer`
(v4 #10 lifted it out standalone for exactly this). If #04 decided an adversary tile shows *data* and not
just art, that tile is a new component — but everything it can share with the card tile, it shares.

The tab is **not renamed here** — that lands with [#05b](05b-scenarios-and-the-rename.md), so the rename
happens once, when both new segments actually exist, rather than leaving the tab briefly named for content
it doesn't have yet.

## Acceptance criteria

- [x] An Adversaries segment renders all 8 adversaries, in the shape #04 chose.
- [x] The data comes from the existing `adversaries.json`. No second adversary dataset exists in the repo.
- [x] `adversaryCanon.test.ts` still passes, unmodified. This is the proof of the point above.
- [x] A test asserts the count against `images/manifest.json`'s 8 `adversary_panel` entries, so a missing
      image fails the build rather than rendering a hole in the grid.
- [x] Enlarging an adversary opens the same `CardViewer` the card segments use.
- [x] Verified in a real browser at 375px and desktop, against a production build.

## Comments

Built alongside [#05b](05b-scenarios-and-the-rename.md) in one pass, per #04's grilled shape
(image + `adversaries.json`'s existing level range). `adversaryImage(name)` in
`src/domain/adversaries.ts` derives the panel path from the name via a shared `slugify()`
(`src/domain/slug.ts`, also used by #05b's extraction script so the two joins against
`images/manifest.json`'s filenames can't drift apart) — no field was added to `adversaries.json`,
so `adversaryCanon.test.ts` needed zero changes.

New components: `AdversaryGrid.tsx` (image + a `Lv min–max` badge, the "genuinely different
surface" #04 asked for) and `AdversaryRows.tsx` (name, expansion, level range). Both reuse the
existing `CardViewer` for enlarging. `src/domain/__tests__/archiveIntegrity.test.ts` asserts the
adversary count against a live read of `images/manifest.json` (not a hardcoded number), plus an
`existsSync` check per adversary's derivative image at `public/adversaries/<slug>.webp`.

A code-review pass (standards + spec agents) caught: an unsound `as` cast in `CardsTab.tsx`'s
segment-branching that has since been removed in favor of a narrowly-typed `shownCards` variable;
a duplicate/inconsistent slugify implementation (fixed by extracting the shared `slug.ts`); and
the count-assertion test hardcoding `8`/`16` instead of reading the manifest live (fixed). A
stray debug script left over from browser verification was also deleted before commit.
Browser-verified (Playwright, production build, 375px + desktop): all 8 tiles render with real
artwork (`naturalWidth > 0`), the level badge and rows data are correct, enlarge/close works, no
console errors. That pass also caught and fixed a real regression: the segmented switch overflowed
375px once it grew from 4 to 6 buttons (`flex-wrap: wrap` added to `.card-view-switch`).
