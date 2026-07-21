# Research: Can innate power thresholds be sourced?

Ticket: [issues/01-innate-thresholds-sourcing.md](issues/01-innate-thresholds-sourcing.md)
Date: 2026-07-21

## Verdict: **Sourceable** — for all 37 spirits, from three independent sources that cross-check each other.

Two of the three sources are already on disk in this repo. Nothing needs to be estimated; every
threshold can be transcribed and independently verified.

## Evidence per candidate source

### 1. Spirit Island Wiki — raw wikitext templates (best primary source)

Spirit pages carry innate powers as **structured `{{Threshold|...}}` wiki templates**, not just
images. Fetching `?action=raw` exposes them directly, e.g. Fractured Days Split the Sky
(`https://spiritislandwiki.com/index.php?title=Fractured_Days_Split_the_Sky&action=raw`):

```
{{Threshold|m=3|a=1|Target Spirit may Resolve 1 {{slow}} Power now.}}
{{Threshold|s=2|m=2|Target Spirit may Reclaim 1 Power Card...}}
```

Element codes: `s`=Sun, `m`=Moon, `a`=Air, etc. — numeric counts plus full effect text, power
name, speed, range, target. Verified across expansions:

- Base: River Surges in Sunlight — "Massive Flooding": 1 Sun 2 Water / 2 Sun 3 Water / 3 Sun 4 Water 1 Earth, with effect text.
- Jagged Earth/promo: Sharp Fangs Behind the Leaves — both innates with full threshold text.
- Jagged Earth: Fractured Days Split the Sky — both innates as templates (rendered page hides them under an unusual heading; the raw wikitext is unambiguous).
- Horizons: Devouring Teeth Lurk Underfoot — 4 thresholds, text.
- Nature Incarnate: Wounded Waters Bleeding — both innates, text.

### 2. TTS mod JSON — already on disk, machine-readable (best cross-check)

`images/spirit_island_tabletop_simulator_mod.json` stores, on every spirit-panel object, a
`LuaScriptState` of the form:

```json
{"thresholds": [{"elements": "10002000", "position": {...}}, ...]}
```

The 8-digit string is per-element counts in canonical order (Sun, Moon, Fire, Air, Water, Earth,
Plant, Animal). River's entries `10002000 / 20003000 / 30004100` decode to exactly the panel's
1 Sun 2 Water / 2 Sun 3 Water / 3 Sun 4 Water 1 Earth. **Coverage verified: 37/37 spirits**
(one case-only nickname mismatch, "Eyes Watch from the Trees"). In total 160 nicknamed objects
carry threshold data — the extras include aspects and other threshold-bearing components.

Limitations: no power name, speed/range/target, or effect text — just element requirements per
panel (grouping thresholds into powers would require inferring from `position`, which is
inference, not sourcing). So it is the *verifier*, not the primary transcription source.

### 3. Local spirit panel images — already on disk, human-legible (tiebreaker)

`images/spirits/<slug>/panel_front.png` exists for all 37 spirits
(`.scratch/asset-archive/assets/panels-manifest.json`, 74 rows = 37 × front/back). Read at 1600px,
River's panel is fully legible: innate name, speed/range/target box, and each threshold's element
icons and effect text. Usable to settle any wiki-vs-TTS disagreement.

### 4. sick.oberien.de mirror — not useful for innates

The mirror (`.scratch/asset-archive/issues/02-mirror-sick.md`) is a *card* catalog (`cards.js`:
powers/fear/event/blight). Innate powers are panel content, not cards; SICK does not cover them.

### 5. Rendered wiki pages via WebFetch — usable but inferior

Rendered pages do show thresholds as text (verified on River), but headings vary (Fractured Days
initially looked like it had no innates section) and the summarizing fetch model adds risk. Use
`action=raw` instead.

## Coverage analysis

- **Spirits: 37/37.** Wiki has a page per spirit; TTS JSON has thresholds for all 37; panel
  images exist for all 37.
- **Aspects:** wiki aspect pages carry threshold modifications as text too — verified on Sunshine
  (`https://spiritislandwiki.com/index.php?title=Sunshine&action=raw`): its replacement innate
  "Boon of Sunshine's Promise" lists 2 Sun / 3 Sun 1 Water / 4 Sun 2 Water with effects. The repo
  also holds all 31 aspect card images
  (`.scratch/asset-archive/assets/wiki-aspects-manifest.json`) as a legibility fallback. Aspects
  *are* additionally present in the TTS threshold data — aspect-named objects (e.g. Encircle,
  Haven, Enticing, Hearth-Vigil) carry populated `thresholds` arrays (verified 2026-07-21 by
  scanning the mod JSON: 160 nicknamed objects carry thresholds, not just the 37 spirits) — so
  aspects get the same wiki-text + TTS cross-check + image-tiebreaker treatment. Only the
  subset of aspects that add/replace/modify innates needs data; the rest record "no innate change".

## Proposed dataset shape

```jsonc
// src/data/innate-powers.json
{
  "spirit": "river-surges-in-sunlight",
  "name": "Massive Flooding",
  "speed": "slow",
  "thresholds": [
    { "elements": { "sun": 1, "water": 2 } },
    { "elements": { "sun": 2, "water": 3 } },
    { "elements": { "sun": 3, "water": 4, "earth": 1 } }
  ]
}
```

For the dashboard's odds question only element counts matter; effect text, range and target can be
omitted (or added later) — omitting is safer than paraphrasing. Aspect modifications as an overlay
keyed by aspect id (`replacesInnate` / `addsInnate` / `modifiesThresholds`), same element shape.

Size estimate: ~70–80 innate powers across 37 spirits (1–3 each), ~200–230 threshold rows;
aspects add roughly 20–40 more rows. A few KB of JSON.

## Transcription effort

- **Spirits:** script the TTS extraction (already prototyped in this research — an hour), fetch 37
  raw-wikitext pages for names/grouping/speed, and diff the element counts source-vs-source. Any
  mismatch escalates to reading the local panel image. Estimate: **one focused agent session**
  (~half a day), dominated by the cross-check, not the typing.
- **Aspects:** wiki raw text per aspect + local aspect card image spot-checks; ~31 pages, most of
  which are "no innate change". Estimate: **a second, smaller session**.

## Tripwire test (`innateCanon.test.ts`, aspectCanon-style)

Pin, so silent drift or invention fails loudly:

- exactly 37 spirits present, each with ≥1 innate power;
- total innate-power count and total threshold count (exact numbers, fixed at transcription);
- per-spirit threshold element strings for a hand-picked sentinel set spanning expansions (e.g.
  River `1S2W/2S3W/3S4W1E`, Eyes Watch from the Trees `1M2P/2M3P/2M2A4P/3M3A5P` — as decoded from
  TTS strings `01000020/02000030/02020040/03030050`; verify against wiki at transcription time);
- element keys drawn only from the 8 canonical elements;
- every aspect id in the overlay exists in the 31-aspect canon, and the count of
  innate-modifying aspects is pinned;
- a provenance field (`source: "wiki+tts"`) present on every record — no unsourced rows.
