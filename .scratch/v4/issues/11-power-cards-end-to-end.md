# 11 — Power cards, end to end, unfiltered

Status: blocked
Type: wayfinder:task (AFK)
Parent: [v4 map](../MAP.md) · Spec: [PRD.md](../PRD.md)

## What to build

The first complete path: a **Cards** tab that lists every power card in the game and enlarges one
when you tap it. No filters yet — this ticket proves the data, the images, the tests and the UI all
join up before any filtering is layered on.

332 power cards: 101 minor, 78 major, 153 unique. Their data comes from the source #01 established,
extracted by a **committed script** so it can be re-run and audited — never by a model reading a card
image. A field the source cannot supply is **absent**, not estimated. This is the rule CLAUDE.md
exists to enforce and this repo has already broken three times.

## Acceptance criteria

- [ ] A script in the repo derives the power-card dataset from the source; re-running it reproduces
      the committed data
- [ ] The dataset lives alongside the existing spirit and adversary data, follows the same
      conventions (absent key = the source never said; provenance recorded on the data), and models
      card types as a discriminated union rather than one wide interface of optionals
- [ ] `cardCanon.test.ts` pins the counts — 101 minor, 78 major, 153 unique — and spot-pins the
      fields of a handful of cards a human checked against the printed card. It fails loudly if a
      count moves
- [ ] The card webps are served from `public/`, reconciled with the starting cards already there (a
      starting card **is** a unique power — do not ship a second copy under a second name)
- [ ] Filenames resolve from the dataset by rule, not via a lookup table
- [ ] The existing asset-existence check covers cards: every card in the dataset resolves to an image
      that exists
- [ ] A **Cards** entry in the nav opens a tab listing all 332, in the shape #04's prototype chose
- [ ] A unique power shows which spirit it belongs to
- [ ] Tapping a card opens the viewer from #10
- [ ] Images load lazily — opening the tab does not pull every image at once
- [ ] Verified in a real headless browser at 375px **and** desktop width. Tests passing is not
      evidence the tab is visible; v3 proved that

## Blocked by

- [01 — Where card data comes from](01-where-card-data-comes-from.md)
- [04 — What a filtered result looks like, at 375px](04-result-shape-prototype.md)
- [10 — Prefactor: a reusable card viewer](10-prefactor-reusable-card-viewer.md)
