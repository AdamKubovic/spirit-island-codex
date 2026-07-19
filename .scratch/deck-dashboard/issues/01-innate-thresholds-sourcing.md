# Can innate power thresholds be sourced?

Status: ready-for-agent
Labels: wayfinder:research
Map: ../MAP.md

## Question

Can a reliable, transcribable dataset of innate powers and their element thresholds (e.g.
"2 Fire, 1 Air") be sourced for all 37 spirits — and at what cost?

Investigate the Spirit Island Wiki (and any other canonical source): do spirit pages carry
innate thresholds in a form we can transcribe without guessing? Remember the repo's lesson
that `WebFetch` renders wiki pages to markdown and throws images away — rules text often
lives *in* the card images, which must be downloaded and read directly (that is how the 31
aspect effects were transcribed). Assess: coverage (all 37 spirits? aspects that modify
innates?), dataset size and shape, transcription effort, and what a tripwire test
(`aspectCanon.test.ts`-style) would pin.

**This ticket decides feasibility only** — whether threshold odds actually join the
dashboard is [Do innate-threshold odds join the dashboard?](05-threshold-odds-in-scope.md),
blocked on this one.

Deliverable: a markdown summary linked from this issue (verdict: sourceable / partially /
not, with evidence and effort estimate).

## Comments
