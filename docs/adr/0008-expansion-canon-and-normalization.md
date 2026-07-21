# 0008 — The expansion canon and cross-dataset normalization

Status: accepted
Date: 2026-07-21

## Context

Spirits, power cards, other cards, scenarios and the collection all name expansions, but the raw
strings disagree: `spirits.json` uses display names, the card katalog uses `Basegame` / `Promo` /
`Promo2` / `Horizons of Spirit Island`, and the colour and collection surfaces need one key to
resolve against. Left unnormalised, a `Promo2` card and a Feather & Flame spirit are two different
expansions to the code, and any ambiguous spelling is exactly the kind of gap this repo fills by
guessing. Decided in legibility-pass #01, revised in qa-revision #02.

## Decision

- **One canonical expansion set** — `EXPANSIONS` in `src/domain/types.ts`, six keys: `Base`,
  `Branch & Claw`, `Feather & Flame`, `Horizons`, `Jagged Earth`, `Nature Incarnate`. This is the
  namespace the collection, `EXPANSION_COLOR`, and every dataset resolve to.
- **`normalizeExpansion()` maps every raw string to a canonical key** via `EXPANSION_ALIASES`
  (`src/components/tagColors.ts`); a dataset keeps its own raw strings and is normalised at the
  seam that needs a canonical key, not rewritten in place. An unmapped spelling fails a tripwire
  rather than resolving to a wrong or default box.
- **`Promo` is not a canonical expansion.** Feather & Flame is the retail box that combined Promo
  Packs 1 and 2 (wiki-verified), so promo content resolves there: `Promo` and `Promo2` both alias
  to `Feather & Flame` — owner calls (legibility-pass #01 for `Promo2`, qa-revision #02 for
  `Promo`).
- **Genuine ambiguity escalates to the owner** (ADR 0003). `Promo2` was ambiguous in the data
  itself — Downpour Drenches the World is a `Promo` spirit with all-`Promo2` power cards — and was
  escalated rather than guessed; the same Promo-Pack-2-vs-Feather-&-Flame shape in two scenarios
  was carried forward from that ruling, not re-escalated.
- **Aspects carry their own `expansion`**, independent of the base spirit's, sourced live against
  the wiki (the asset-archive filename suffixes would have mis-tagged 2 of the 31 aspects).

## Consequences

- A new dataset joins the colour and collection systems by mapping its raw strings through
  `EXPANSION_ALIASES`; a misspelling is a test failure, not a silent mis-colour.
- Adding a future expansion is one key in `EXPANSIONS` plus its aliases, with the canon tests
  holding every dataset's strings against it.

## Left open, deliberately

**Nothing.** The set is closed at six; a seventh expansion reopens `EXPANSIONS` deliberately, with
its aliases and the tripwire updated together.
