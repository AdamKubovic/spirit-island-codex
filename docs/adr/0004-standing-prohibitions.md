# 0004 — Standing prohibitions: what this app will not compute

Status: accepted
Date: 2026-07-21

## Context

Across v1–v5 the owner and agents repeatedly reached the same conclusion about a tempting feature:
building it would mean stating something no source ever stated. These "we deliberately don't do X"
decisions were scattered through five PRDs' Out-of-Scope sections and one wayfinder map. Scattered,
they get re-proposed every few months. Collected here, a future effort sees the line before
crossing it. Each is an application of ADR 0003.

## Decision

The following are out of scope **permanently** — not deferred, not "not yet". Reversing any of them
means reopening this ADR with a source that removes the objection.

- **No blending or averaging tier lists into a consensus ranking.** Averaging sources with
  different methodologies and coverage produces a number no source ever stated (v3).
- **No authored player-count deltas.** Player count is metadata a cited list declares; deriving a
  solo tier from a four-player tier is inventing data (v3, phase-4). The player-count input that
  did nothing was removed rather than made to fake an effect.
- **No curated adversary/scenario compatibility matrix.** Logging what happened is not predicting
  what will happen; the game log must not become this matrix through the back door (v1, v2).
- **The game log feeds scoring exactly one fact: `timesPlayed`.** Outcomes (win/loss) are recorded
  and displayed but never scored — n is too small, and scoring them would silently corrupt
  owner-authored tiers and weights (v2).
- **This repo does not *author* card ratings.** Cards may carry *descriptive* sub-types (what a
  card does) but never an *evaluative* axis of this repo's own devising — the
  "aggressive/less-aggressive" blight axis was dropped for exactly this reason (v4, v5). See
  CONTEXT.md's "Card sub-type". **Cited card tier lists are permitted**, per ADR 0002's subject
  axis and ADR 0001's cited-document rules: transcribing a named creator's published ranking
  invents nothing. See "Amended" below.
- **No adversary subtype axis.** Canon defines none (checked the wiki's Adversary glossary, the
  Category:Adversaries index, and three adversary pages); the premise was mistaken, not a sourcing
  gap. `adversaries.json`'s existing fields are complete (legibility-pass #03).

## Consequences

- A feature request matching one of these has a one-line answer with a citation, not a fresh
  debate.
- The distinction that keeps card sub-typing legal — descriptive vs evaluative — is written down,
  so a future "just rank the fear cards" request is recognisably over the line.

## Amended — 2026-07-26, the card-ranking bullet

The bullet above originally read "No rating, tiering or ranking of cards … the tier machinery is
spirit-shaped and so are its sources". Reopened under this ADR's own clause ("Reversing any of
them means reopening this ADR with a source that removes the objection"), because both halves of
that claim had stopped being true:

- **It was never a permanent decision.** It began as an *Out of scope* line in `.scratch/v4/MAP.md`
  (2026-07-12) — scoping for that map — carried forward verbatim by v5. The backfill commit
  `38990f5` (2026-07-21) that created this ADR promoted it to "out of scope **permanently** — not
  deferred, not 'not yet'". That escalation is not in either source document.
- **It already contradicted ADR 0002** (2026-07-13), which added `minor-powers` and `major-powers`
  as tier-list subjects and states outright that "a card tier list ships the same way a spirit list
  does". 0002 is the later decision and the backfill did not reconcile with it.
- **The source now exists.** Spirit Island Archive's Minor Power Tier List (3 parts) and Red's
  Major Power Tier List (5 parts) rank the card decks. "The sources are spirit-shaped" was a
  statement about what had been found, not about what exists.

What survives is the part that was always the real principle, and it is unchanged: this repo does
not invent an evaluative axis. A `cited` card list is somebody else's opinion, transcribed with a
citation and pinned by a canon tripwire — the same standing as every spirit list here.

## Left open, deliberately

**Element-threshold card matching** ("I have Sun + Fire + Plant — what can I play?") is *deferred,
not prohibited* — it states nothing unsourced, it is only more machinery. It is the thing that
would make the Cards tab better than SICK rather than a nicer SICK, and it is recorded in the v4
map's *Not yet specified*.
