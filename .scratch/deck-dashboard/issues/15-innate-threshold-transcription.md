# Innate-threshold transcription + canon

Status: ready-for-agent

## Parent

`../PRD-2.md` (follow-up spec: valence views + element-gap odds)

## What to build

The sourced innate-threshold catalog for all 37 spirits: per innate power, the spirit,
power name, speed, and ordered thresholds as element→count maps. Effect text deliberately
omitted (omitting is safer than paraphrasing). Spirits only — aspect modifications are a
marked future extension.

Transcription protocol (from the #01 research, non-negotiable per the repo data rule):
wiki raw wikitext `{{Threshold|...}}` templates as the primary source, the on-disk TTS mod
JSON element-count strings as the machine cross-check, local panel images as the tiebreaker.
Every source-vs-source mismatch escalates to the panel image and is logged on this ticket.
A field that cannot be sourced is absent, never estimated.

## Acceptance criteria

- [ ] Catalog covers 37/37 spirits' innate powers (~70–80 powers, ~200–230 threshold rows),
      every row cross-checked wiki-vs-TTS, mismatches resolved via panel image and logged.
- [ ] An innate-canon tripwire test pins the complete table (spirit → powers → thresholds)
      so drift, omission, or invention fails the build.
- [ ] No effect text, no estimated values, no aspect rows.
- [ ] Type check, lint, and the full test suite pass.

## Blocked by

None — can start immediately.
