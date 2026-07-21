# Can innate power thresholds be sourced?

Status: done
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

**2026-07-21 — resolved: sourceable, all 37 spirits.** Full findings in
[../innate-thresholds-research.md](../innate-thresholds-research.md). Three independent sources,
two already on disk: (1) wiki raw wikitext (`?action=raw`) exposes structured
`{{Threshold|s=2|m=2|...}}` templates with counts, names, speed and effect text — the primary
transcription source (rendered pages/WebFetch are unreliable; Fractured Days hides its innates
under an odd heading); (2) the TTS mod JSON (`images/spirit_island_tabletop_simulator_mod.json`)
carries `LuaScriptState.thresholds` 8-digit element-count strings for 37/37 spirits — the machine
cross-check (counts only, no names/effects); (3) local panel images
(`images/spirits/<slug>/panel_front.png`, 37/37) are legible tiebreakers. Aspects: covered by wiki
raw text + the 31 local aspect card images, and aspect-named TTS objects carry thresholds too
(160 threshold-bearing objects in the mod JSON, verified). Estimated ~70–80 innate
powers / ~200–230 threshold rows, a few KB of JSON, one focused session for spirits plus a smaller
one for aspects; the note proposes an `innateCanon.test.ts` tripwire. This unblocks
[#05](05-threshold-odds-in-scope.md) (the in-scope decision, `ready-for-human`).
