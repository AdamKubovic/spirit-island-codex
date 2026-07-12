# 04 — What a filtered result looks like, at 375px

Status: blocked
Type: wayfinder:prototype (HITL)
Parent: [v4 map](../MAP.md)

## Blocked by

- [01 — Where card data comes from](01-where-card-data-comes-from.md)

## Question

Card art is the point of a card browser, but 471 images is a lot on a phone. Does a result read as a
wall of card images, as compact data rows with the art one tap away, or as something between?

The owner explicitly declined to decide this off a description: **"let a prototype decide."** So
build both, cheap and rough, and look at them at a real phone viewport before committing.

## What to build

Use `/prototype`. Throwaway, not production code, not tested, not wired into `AppShell`.

- **A.** Lazy-loaded image grid. Tap enlarges. The filters are the only way to read a card's data.
- **B.** Compact rows — name, elements, cost, speed — that scan fast at 375px. Tap opens the art.
  `SpiritDetail`'s existing click-to-enlarge card modal is the prior art; reuse it, don't rebuild it.

Feed both from real data (#01's source, even hand-copied into a fixture) and real images from
`images/cards/`. A prototype on fake cards answers nothing.

Look at them at **375px and at desktop width** — the desktop layout the owner already likes must not
regress. Judge: how many cards fit before scrolling, how long the grid takes to paint, whether the
data is legible without opening anything.

## What this ticket produces

The owner's choice, recorded in `## Comments`, plus whatever the prototype revealed about
thumbnails — if the grid needs smaller derivatives than the ~28 KB full-size webps, that's the input
[#05](05-card-art-into-the-app.md) is waiting for.
