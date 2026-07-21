# 0010 — Derived datasets: committed extraction over a primary source, never model reading

Status: accepted
Date: 2026-07-21

## Context

Two datasets are neither transcribed by hand nor read off images: the card sub-type tags
(`other-cards.json`) and the innate-power thresholds (`innate-powers.json`). Both are one step from
the repo's failure mode — "have a model look at the thing and guess" — so *how* they are built is
itself a decision worth pinning, not an implementation detail. Applies ADR 0003; decided in v5
#02/#03 and deck-dashboard #01/#15.

## Decision

- **A derived dataset is produced by a committed, re-runnable extraction over a machine-readable
  primary source — never a model reading a card or panel image.** The output JSON is committed; the
  extraction can be re-run and audited.
- **Card sub-type classifier** (`otherCardClassifier.ts`): deterministic keyword rules (`RegExp`
  over the card's real `level1/2/3` and effect text from the card katalog), where every tag traces
  to a matched literal substring. The *rule set* is a human's reading and is marked judgment
  (`tagsSource: "judgment"` on blight; fear tags and the event `eventClass` are clearer-cut or
  upstream). Pinned by a **full-corpus** tripwire that re-classifies every fear/blight card from
  committed source text — a code review caught and rejected an earlier 11-card-sample version.
- **Innate-power thresholds** (`innate-powers.json`): sourced from the wiki's raw `{{Threshold|…}}`
  wikitext, cross-checked against the TTS mod JSON's element-count strings, with the local panel
  image as the tiebreaker (none was needed across all 37 spirits). Only element counts are
  recorded — effect text, range and target are omitted, because omitting is safer than
  paraphrasing. Every record carries `source: "wiki+tts"`; pinned by `innateCanon.test.ts`.

## Consequences

- Re-deriving either dataset is mechanical and reviewable; a rule change re-runs the script and the
  tripwire re-pins the result.
- The judgment/fact line stays explicit: the classifier's rules are judgment, the matched text is
  fact; the thresholds' element counts are cross-checked fact.

## Left open, deliberately

**Whether power cards also get a playstyle sub-type** (they carry `description` text the same
classifier could run over) — deferred in v5 until the rule-writing cost of fear/blight is known.
Aspect innate modifications are a marked future extension of `innate-powers.json`.
