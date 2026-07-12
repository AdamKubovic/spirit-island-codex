# 06 — What "I own this" filters

Status: done
Type: wayfinder:grilling (HITL)
Parent: [v5 map](../MAP.md)

## Blocked by

_(nothing)_

## Question

The app assumes you own every expansion. The owner asked for an expansion filter **on the tier list**:

> Potentially add a filter in the tier list for what expansions the player has. Right now we always
> assume all of them are available, but maybe we could go with the mindset of not all expansions are
> available.

The charting call (2026-07-12) was to build this as **one app-wide "my collection" setting**, not a
tier-list-local control — because the same filter would otherwise be re-invented on Browse, the
Recommender, and the Cards tab within a month, four times, four ways. That's settled. What the setting
*does* is not.

## What to settle

1. **Granularity.** Expansion-level (Base, Branch & Claw, Jagged Earth, Horizons, Nature Incarnate,
   Promo, Promo 2) — or something finer? Note the data already carries `expansion` on every spirit and
   every one of the 471 cards (v4 #01), so expansion-level is nearly free and anything finer is not.
   Also: **Promo/Promo2 are not expansions you buy.** Decide whether they're a checkbox at all.
2. **Hard filter or annotation?** Does a spirit you don't own *disappear* from Browse and the
   Recommender, or does it show, greyed, marked "not in your collection"? These are very different
   products. The Recommender case is the sharp one: recommending a spirit the user cannot play is
   useless — but *hiding* it means the app silently narrows its answer, and the user may want to know
   "the best spirit for you is in Jagged Earth, which you don't have."
3. **Which surfaces respect it.** Browse, Recommender candidates, Tier list, Cards tab. Cards is the
   least obvious — do you want the Cards tab to hide 200 power cards because you don't own Jagged
   Earth, when browsing cards is partly *how you decide whether to buy it*?
4. **The tier list's specific case.** A tier list rates spirits from expansions you don't own. Are they
   hidden from the board, greyed in place, or moved to their own row? (This is currently in the map's
   fog; it graduates or resolves here.)
5. **Aspects.** Aspects ship with expansions too, and a configuration is spirit-plus-aspect. Does the
   collection gate aspects independently of their spirit?
6. **Persistence and default.** The default must be "you own everything" — a new visitor to a public
   knowledge base has not filled in a collection form and must not see a crippled app. Where the
   setting lives (there's already `complexityStore` / `answersStore` / `tierStore` and a `backup.ts` —
   follow the existing pattern, don't invent a new one) and whether it's part of the backup blob.

## Notes

Use `/grilling` and `/domain-modeling` — "collection" is a new domain concept and it wants a name and a
definition, not just a checkbox array. Read `src/domain/backup.ts` and the existing stores first so the
answer fits the persistence pattern that's already there.

Scope guard: the owner asked for a tier-list filter. If the grilling reveals the app-wide version is a
much bigger animal than it looks, it is legitimate to come back with "ship the tier list's, and here is
why app-wide is a separate effort" — but say so explicitly, don't drift there by accident.

## Comments

**Resolved 2026-07-12, via `/grilling`.** #07a implements this verbatim.

### Granularity

Expansion-level: **Base, Branch & Claw, Feather & Flame, Horizons, Jagged Earth, Nature Incarnate,
Promo** — a checkbox per canonical name, Promo included as an ordinary entry (not a special case).

**Real wrinkle found in the data:** expansion strings are not unified across datasets.
`spirits.json` says `"Base"`/`"Horizons"`/`"Feather & Flame"`; `power-cards.json`/`other-cards.json`
say `"Basegame"`/`"Horizons of Spirit Island"`, and neither carries `"Feather & Flame"` at all
(the expansion added 2 spirits and no new cards — a real game fact, not a data gap). #07a needs a
small canonical-name → per-dataset-raw-value mapping table, not a raw string match. Canonical set,
one row per raw value actually seen:

| Canonical | spirits.json | power-cards.json | other-cards.json |
|---|---|---|---|
| Base | `Base` | `Basegame` | `Basegame` |
| Branch & Claw | `Branch & Claw` | `Branch & Claw` | `Branch & Claw` |
| Feather & Flame | `Feather & Flame` | *(none)* | *(none)* |
| Horizons | `Horizons` | `Horizons of Spirit Island` | *(none)* |
| Jagged Earth | `Jagged Earth` | `Jagged Earth` | `Jagged Earth` |
| Nature Incarnate | `Nature Incarnate` | `Nature Incarnate` | `Nature Incarnate` |
| Promo | `Promo` | `Promo` + `Promo2` | `Promo2` |

(Cards' `Promo`/`Promo2` both fold into the single canonical `Promo` bucket — same call as the
owner's confirmation below on Feather & Flame/Promo Pack 2: promo-released content is tracked by
the box a player would actually own, not the wave it first shipped in.)

### Hard filter or annotation

**Annotate by default; hard-filter is an explicit opt-in toggle** ("only show what I own"). An
unowned spirit/card is never invisible unless the player asks for that — a silently narrowed
Recommender answer (best match is in an expansion you don't have, and you're never told) is a
worse failure than an unfiltered one. When hard-filter is on, unowned items are excluded exactly
as if annotation had removed them first.

### Which surfaces respect it

- **Browse** — respects it (annotate/hard-filter, per above).
- **Recommender candidates** — respects it.
- **Tier list** — respects it (see below for the specific layout).
- **Cards tab** — **does not respect it, at all.** Browsing the full card pool is how you decide
  whether to buy an expansion; hiding or annotating it would work against that. If cards ever want
  ownership-awareness, that is a fresh decision, not inherited from this one.

### The tier list's specific case

An unowned spirit **stays in its rated tier row**, visually dimmed/badged — never pulled into a
separate "not owned" grouping. A tier row means "how good," not "do you own it"; conflating the
two axes would be exactly the kind of control lying about itself that #01 fixed. Hard-filter-on
excludes it from the board the same way any other exclusion would.

### Aspects

**Aspects are gated independently of their spirit** (owner's call) — an aspect can ship in a
different box than its base spirit, so a configuration (spirit + aspect) can be owned or not
independently of whether the spirit itself is owned.

This required real data `Aspect` didn't have: **no `expansion` field existed on any of the 31
aspects.** Rather than skip it or guess, the mapping was sourced live against
`https://spiritislandwiki.com/index.php/List_of_Aspect_Cards` (fetched 2026-07-12) — not
reverse-engineered from the wiki image filenames' `(set-abbrev)` suffixes, which would have
mis-classified 2 aspects (see below). Verified counts match the owner's recollection exactly:
Jagged Earth 6 / Nature Incarnate 20 / Feather & Flame 5 (31 total).

| Aspect | Spirit | Expansion |
|---|---|---|
| Pandemonium | Lightning's Swift Strike | Jagged Earth |
| Wind | Lightning's Swift Strike | Jagged Earth |
| Sunshine | River Surges in Sunlight | Jagged Earth |
| Madness | Shadows Flicker Like Flame | Jagged Earth |
| Reach | Shadows Flicker Like Flame | Jagged Earth |
| Resilience | Vital Strength of the Earth | Jagged Earth |
| Immense | Lightning's Swift Strike | Feather & Flame |
| Travel | River Surges in Sunlight | Feather & Flame |
| Amorphous | Shadows Flicker Like Flame | Feather & Flame |
| Foreboding | Shadows Flicker Like Flame | Feather & Flame |
| Might | Vital Strength of the Earth | Feather & Flame |
| Regrowth | A Spread of Rampant Green | Nature Incarnate |
| Tangles | A Spread of Rampant Green | Nature Incarnate |
| Enticing | Bringer of Dreams and Nightmares | Nature Incarnate |
| Violence | Bringer of Dreams and Nightmares | Nature Incarnate |
| Transforming | Heart of the Wildfire | Nature Incarnate |
| Spreading Hostility | Keeper of the Forbidden Wilds | Nature Incarnate |
| Sparking | Lightning's Swift Strike | Nature Incarnate |
| Lair | Lure of the Deep Wilderness | Nature Incarnate |
| Deeps | Ocean's Hungry Grasp | Nature Incarnate |
| Haven | River Surges in Sunlight | Nature Incarnate |
| Locus | Serpent Slumbering Beneath the Island | Nature Incarnate |
| Dark Fire | Shadows Flicker Like Flame | Nature Incarnate |
| Encircle | Sharp Fangs Behind the Leaves | Nature Incarnate |
| Unconstrained | Sharp Fangs Behind the Leaves | Nature Incarnate |
| Intensify | Shifting Memory of Ages | Nature Incarnate |
| Mentor | Shifting Memory of Ages | Nature Incarnate |
| Stranded | Shroud of Silent Mist | Nature Incarnate |
| Tactician | Thunderspeaker | Nature Incarnate |
| Warrior | Thunderspeaker | Nature Incarnate |
| Nourishing | Vital Strength of the Earth | Nature Incarnate |

**Why not trust the filename suffixes:** `.scratch/asset-archive/assets/wiki-aspects-manifest.json`
encodes a `(set-abbrev)` in some URLs (`ni` for Nature Incarnate, `ff` for the Feather & Flame
group) but *not* for Ocean's Hungry Grasp's Deeps or Serpent Slumbering's Locus — not because
they're Jagged Earth, but because those two were fetched from a different wiki page (the aspect's
own page, not the numbered-power-card filename pattern) that doesn't carry the suffix at all. Both
are actually Nature Incarnate per the wiki's own table. Inferring from the suffix alone would have
silently mis-tagged 2 of 31 aspects — the wiki table (not the archive's incidental filename
pattern) is the source of record for #07a.

**Owner's framing (2026-07-12) on the "Feather & Flame" name:** Promo Pack 2's 5 aspects and the
Feather & Flame box are "basically both promised together" and Feather & Flame is the name that
sticks going forward — so these 5 fold into the canonical `Feather & Flame` bucket, not a separate
`Promo2` aspect bucket, matching `spirits.json`'s existing expansion name.

### Persistence and default

Mirrors `complexityStore`: a `collectionStore` keyed by canonical expansion name, injected
`KeyValueStorage`, same create-function-plus-default-instance shape.

- **Default is "owns everything," represented by absence** — `collectionStore.owns(expansion)`
  returns `true` when nothing has been stored, not by writing an explicit "all true" snapshot on
  first load. Absence needs no migration when a future expansion ships; an explicit snapshot would.
- **Backup inclusion:** `BackupState` gains a `collection` field storing only the expansions a
  player has explicitly turned *off* (deltas from the "everything" seed), same discipline as
  `complexityOverrides` storing only deltas from the printed complexity.
