Status: done

# Card tier lists — Spirit Island Archive's minor & major power rankings

## Problem Statement

The Tier list tab can already serve three subjects — `configurations`, `minor-powers`,
`major-powers` (ADR 0002) — but only configurations lists have ever shipped. A player who opens
the Tier list tab and looks for the subject picker finds one option. The 101 minor powers and 78
major powers in `power-cards.json` are browsable on the Powers tab but carry no ranking anywhere
in the app, so the question "is this major worth drafting?" has no answer here.

Meanwhile the subject machinery built in ADR 0002 — per-subject active list, per-subject default
list, per-subject key namespaces, the canon tripwire's card-name namespaces — is entirely
unexercised. Its consequences section says shipping a card list is "drop a file, register it,
extend the test", but nobody has ever done it, so the claim is untested.

The owner found the source: Spirit Island Archive's YouTube playlist "Spirit Island: Tier Lists"
contains a 3-part Minor Power Tier List and a 5-part Red's Major Power Tier List, from the same
channel that produced both already-shipped cited lists.

## Solution

Ship two new `cited` tier lists as data — one `minor-powers`, one `major-powers` — transcribed
from the Spirit Island Archive videos, registered in the tier store's shipped array, and pinned by
the canon tripwire. No component changes: the Tier list tab's subject picker gains two real
entries and renders them with machinery that already exists.

Because auto-generated captions mangle card names, the transcription follows a strict provenance
protocol: a card key ships only when the transcript names the card verbatim, or when the owner has
explicitly adjudicated a near-miss. Everything else is **absent** — never estimated, never
inferred from context by an agent. This is the discipline CLAUDE.md's headline warning demands and
ADR 0003 codifies.

## User Stories

1. As a player, I want to open the Tier list tab and switch its subject to Minor powers, so that I
   can see how a respected reviewer ranks the minor power deck.
2. As a player, I want to switch the Tier list tab's subject to Major powers, so that I can see a
   ranking of the major power deck.
3. As a player, I want each card list to render with the same board layout as the spirit lists, so
   that I do not have to learn a second interface.
4. As a player, I want each card tier list to display its own tier vocabulary, so that a list with
   no D band does not show me an empty D band that implies the reviewer rated nothing there.
5. As a player, I want to see a card list's author, title and source URL, so that I know whose
   opinion I am reading and can go watch the source.
6. As a player, I want to see which cards a list did not rate, so that I can tell "the reviewer
   thinks this card is bad" apart from "the reviewer never mentioned this card".
7. As a player, I want the unrated bucket to be honest, so that a sparse list looks sparse rather
   than looking complete and being wrong.
8. As a player, I want to know the list is unverified, so that I weight it appropriately against a
   list a human has checked end to end.
9. As a player, I want to read the list's methodology, so that I understand it was scraped from
   auto-generated captions and what that implies about its reliability.
10. As a player, I want the methodology to tell me which videos the list came from and which tier
    band each video covered, so that I can spot-check any single band against its source.
11. As a player, I want to pick a card list as my default in Settings, so that the Tier list tab
    boots into the subject and list I care about.
12. As a player, I want switching to a card subject mid-session not to change my boot default, so
    that browsing out of curiosity does not silently reconfigure the app.
13. As a player, I want a card list marked `cited` to be immutable in-app, so that I cannot
    accidentally edit someone else's published ranking and then mistake it for theirs.
14. As a player, I want to create my own personal minor-powers or major-powers list, so that I can
    record my own opinions on cards — using the create-list flow that already takes a subject.
15. As a player, I want my personal card-list edits to persist per list, so that editing my minor
    list does not disturb my major list or my spirit list.
16. As a player, I want my personal card-list edits to survive a backup export and import, so that
    I do not lose them when I move browsers.
17. As the owner, I want every rated card to trace to a verbatim transcript match or my own
    explicit sign-off, so that no rating in this repo is an agent's guess.
18. As the owner, I want the near-misses presented to me with the surrounding transcript sentence
    and the tier being discussed, so that I can adjudicate each one quickly and correctly.
19. As the owner, I want names I reject recorded in the data file rather than discarded, so that a
    future maintainer can see what the source said and re-adjudicate.
20. As the owner, I want the exact key set of each new list pinned in the canon test, so that a
    later agent "helpfully filling the gaps" fails CI loudly.
21. As the owner, I want every card key validated against `power-cards.json`, so that a misspelt
    or hallucinated card name cannot ship.
22. As the owner, I want the errata-removed card marker handled correctly, so that a card the
    source crossed out as removed is not ranked as the strongest card in the game.
23. As the owner, I want each list's `tierLabels` derived from what its own videos say, so that a
    vocabulary is not silently copied from an unrelated list.
24. As the owner, I want the ingest reproducible, so that when the reviewer posts an updated list
    I can re-run the extraction rather than reconstruct the method from memory.
25. As the owner, I want `yt-dlp` to stay off the package dependency list, so that the shipped
    bundle remains `react` + `react-dom`.
26. As the owner, I want the author attribution consistent across every list from this channel, so
    that the list picker does not show one creator under two names.
27. As the owner, I want the existing configurations lists to keep working untouched, so that this
    change cannot regress the board the app boots into.
28. As the owner, I want the deferred upvote idea recorded next to the login work it depends on,
    so that it is not lost and not mistaken for chartered work.
29. As a future maintainer, I want the `uncertain` and `unresolved` field documentation to describe
    keys rather than configIds, so that the schema reads correctly now that card subjects use it.
30. As a future maintainer, I want ADR 0002's "left open" question about the configurations default
    to remain untouched by this effort, so that two unrelated decisions do not get entangled.

## Implementation Decisions

### Scope

- **Data only.** No component changes. `TierBoard` already renders card subjects from
  `CARD_POOLS`; `TierListControls` already groups the picker by subject heading; the tier store is
  already subject-generic. This effort proves that claim rather than extending it.
- **The Powers tab stays tier-unaware.** Showing a tier chip on the card browser is a plausible
  follow-on but is deliberately not in this effort — decided with the owner during grilling.
- **The recommender is untouched.** `getRankPrior()` reads the active *configurations* list by
  construction; card rankings feed nothing.

### Source and provenance

- Two lists, both `origin: 'cited'`, both `verified: false`.
- **Major powers** — "Red's Major Power Tier List", 5 parts, published from 2023-11-01, video ids
  `dHe0_n86nq4`, `rkuXUmf7kpM`, `Hc3bLAkiO5o`, `Olm9L9CnHfc`, `Hnm_rD4ziRc`. Type `strength`. The
  two `[OUTDATED]`-titled major videos in the same playlist are superseded and must not be used.
- **Minor powers** — "Minor Power Tier List", 3 parts, published 2023-01-01..03, video ids
  `DdZFT5myaDI`, `bjd98MBYA5U`, `-uT5_RQTolE`. Type `strength`.
- **`SourceCitation` stays singular.** A multi-part series is cited as one source: `url` is Part 1,
  `title` names the series and its part range, and `methodology` enumerates every part's id
  together with the tier band that part covered. No schema change — decided in grilling over the
  alternative of widening `source` to an array.
- **`author` is `"Spirit Island Archive"`** — the channel — for both new lists. `owners-board.json`
  currently says `"Red"` for the same channel and is corrected to match. Its `name` keeps "Red's
  Final Tier List", so credit to Red is preserved in the place the source itself puts it. The
  alternative (asserting Spirit Island Archive *is* Red) would require an identity claim no
  primary source in hand supports.
- `players` is set only if a video states the player count it ranked for. Absent otherwise —
  never inferred.

### Extraction protocol

- An ingest helper lives under `scripts/`: it shells out to `yt-dlp --write-auto-sub --sub-lang en
  --skip-download`, then strips VTT cue timings, tags and the rolling duplicate lines that
  auto-captions emit, producing one plain-text transcript per video. `--convert-subs` is not used
  (it needs ffmpeg and the raw VTT parses fine).
- `yt-dlp` is a **developer-machine tool, not a package dependency**. It is not added to
  `package.json`. Committed transcripts and committed JSON are the durable artefacts.
- **Exact match ships.** A card name from `power-cards.json` appearing verbatim (case- and
  punctuation-insensitive) in a transcript, in a passage where a tier is being assigned, becomes a
  key at that tier.
- **Near-misses go to the owner.** Where a card's content words appear but its full name does not,
  the extraction emits a review entry containing: what the captions heard, the candidate card, the
  surrounding transcript sentence, the timestamp, and the tier band under discussion. Only
  owner-approved entries become keys.
- **Rejected near-misses become `unresolved` entries** (`{ heard, at }`) in the shipped JSON, so
  the audit trail lives in the data rather than only in `.scratch/`.
- **Everything else is absent.** No inference from grouping statements ("the rest are all fine"),
  no fuzzy-matching a half-heard name to the nearest card, no filling a band to make counts tidy.
  Absence means "the source never rated this" and that meaning is load-bearing (ADR 0001).
- The owner reviews **one batch covering all eight videos** unless they ask to split it; a
  minors-first / majors-second split is the fallback if the method needs validating early.

### Tier vocabulary

- Each list's `tierLabels` is taken from what its own videos say, strongest first. It is **not**
  copied from `owners-board.json`.
- Known so far from transcripts read during grilling: the majors series explicitly has both `D`
  and `F` bands and defers `C` to Part 2; the minors series describes its split as "an S and A, B
  tier, and then a C and F", implying **no D band** for minors. Both must be confirmed against all
  parts before the files are written.
- **`X` is not a band in the card lists.** In `owners-board.json`, `X` is a band *above* `S` (Red's
  spirit series has a dedicated "Part 8: X-tier" video, and its six X entries are the strongest
  spirits in the game). In the minors video, a blue `X` drawn over a card means the card was
  **removed by errata** — Growth Through Sacrifice sits in `S` tier *with* an X overlay. The band
  recorded is the band it sits in; the errata marker is dropped and described in `methodology`.
  `X` must not appear in either card list's `tierLabels`. If extraction turns up many X-marked
  cards rather than a handful, report the count to the owner rather than silently deciding — a
  dedicated annotation field becomes worth reconsidering at volume.

### Registration

- Both files land in `src/data/tier-lists/` and are added to `SHIPPED_LISTS` in the tier store.
- No change to default-list seeding. Each card subject has exactly one list, and the store's
  existing fallback already activates the first shipped list of a subject when no default is
  stored. ADR 0002's open question about the *configurations* default is out of scope.

### Documentation

- `uncertain` and `unresolved` doc comments on the `TierList` type change "configId" to "key" —
  comment-only; the types are unchanged.
- A backlog note records the deferred community upvote system, filed alongside the existing
  login/sync backlog note and explicitly marked not chartered, because it depends on unique-user
  identity which depends on accounts which depend on a backend the project does not have.
- An ADR is **not** required: ADR 0002 already decided the subject axis and predicted exactly this
  change. If extraction forces a schema change (a `removed` annotation, a multi-URL citation), that
  reverses and an ADR is needed.

## Testing Decisions

A good test here asserts **external behavior and data facts**, not implementation. The valuable
assertions are about what the shipped JSON contains and how the store exposes it — not about how
the extraction script parsed a VTT file, which is a one-shot dev tool whose real output is
reviewed by a human before it is committed.

**Primary seam: `tierListCanon.test.ts`.** This is the existing tripwire and the only seam this
effort needs. Extend it with:

- A **pinned key set per new list**, written out longhand in the test file. This is the deliberate
  duplication the file already practises for `owners-board` (68 keys) and `3mbg-strength-solo-2025`
  (36 keys), and the reason is stated in `aspectCanon.test.ts`: drift must fail loudly rather than
  silently losing or gaining coverage. This is the single most important assertion in the effort —
  it is what stops a future agent filling the gaps.
- An assertion that **`X` is absent from both card lists' `tierLabels`**, with a comment explaining
  the two contradictory meanings of `X` across this creator's lists.
- An assertion that the errata-marked card(s) carry the band the source placed them in.
- Per-list coverage counts, so a partial list's partialness is itself pinned.

**Modification required:** the file's first assertion currently asserts every shipped list declares
`subject: 'configurations'`. It must be relaxed to "declares a subject in `TIER_LIST_SUBJECTS`".
The file's own comment anticipates this ("extend, never drop, when a card list ships"). The
existing per-list loop already validates keys against the correct subject namespace and needs no
change — the `minor-powers` and `major-powers` namespaces are already built from
`power-cards.json` and already asserted to be 101 and 78 entries.

**No new test files.** Explicitly not adding tests for:

- The ingest script — testing it tests `yt-dlp`, and its output passes through human review.
- `tierStore` — it is already subject-generic and covered by `tierStore.test.ts`; this effort adds
  data, not store behavior. If any store change proves necessary, that is a signal the scope was
  misjudged and should be raised rather than absorbed.
- `TierBoard` — unchanged. `appSmoke.test.tsx` already exercises the app's tabs.

Prior art to follow: `aspectCanon.test.ts` (the canonical tripwire pattern and the rationale for
duplicating data in tests), `tierListCanon.test.ts`'s existing `3mbg-strength-solo-2025` block (a
deliberately partial cited list, with its absences pinned as assertions), and its
`sia-favorites-fun-solo-2026` block (absence-not-sentinel for entries the source declined to rate).

## Out of Scope

- **The community upvote system.** Cut during grilling. It needs unique-user identity → accounts →
  a backend; GitHub Pages is static. Recorded as a backlog note beside the login/sync note.
- **Uploading community tier lists.** Never chartered; would require a third `origin` value and
  admits uncited data into a corpus whose value is its citations.
- Tier chips on the Powers tab.
- Any recommender or Browse behavior for cards.
- Schema changes to `TierList` or `SourceCitation`.
- Resolving ADR 0002's open question about the configurations default list.
- The two `[OUTDATED]` major power videos, and the playlist's adversary, matchup-axis and
  "6 // 6" tier lists.

## Further Notes

- **Why `yt-dlp` and not something simpler.** Three approaches failed first, and the record matters
  so nobody retries them: `WebFetch` on a watch page returns no captions and the playlist URL
  redirects to a consent wall; fetching the `timedtext` `baseUrl` from an authenticated browser
  session returns **HTTP 200 with a zero-byte body** in every format; YouTube's own transcript
  panel expands and renders zero segments. `yt-dlp` succeeds by falling back to the android-vr
  player API. A 31-minute video yields ~6,000 words of clean prose after de-duplication.
- **Expected gap size.** On Major Part 1, exact matching found 10 of the ~14 cards the video
  appears to rate, with 4 near-misses. Extrapolated across 8 videos that is roughly 40–60
  adjudications. Plan for the review to be real work, not a formality.
- **A worked example of a near-miss.** The captions render the Nature Incarnate minor as "Rotting
  Bog"; the card is **Roiling Bog and Snagging Thorn**. Unambiguous in context — and still routed
  through owner sign-off rather than agent judgement, because the mechanism that resolves this one
  correctly is the same mechanism that produced this repo's fabricated OCFDU ratings and five
  nonexistent aspects.
- **Coverage expectations.** The minors series states it covers all minor cards across Base, Branch
  & Claw, Jagged Earth and the single Nature Incarnate minor — so near-complete coverage of 101 is
  plausible. The majors series says it covers the Nature Incarnate majors. Neither claim should be
  trusted over the extraction: what ships is what the transcripts verbatim support.
- **Age.** The minors list is from January 2023 and the majors from November 2023. Both predate
  today by years and the minors list discusses an errata that has since landed. This is normal for
  a cited document — the citation carries its own date and `verified: false` says nobody has
  re-checked it.

## Comments
Shipped 2026-07-26. Both lists are live and deliberately partial: 13/101 minors, 30/78 majors,
with the key sets and coverage counts pinned longhand in `tierListCanon.test.ts`.

Two departures from the spec as written, both decided with the owner:

- **ADR 0004 needed amending after all.** The PRD said "an ADR is not required". It missed that
  0004 carried a bullet prohibiting card ranking "permanently". Tracing it showed the bullet began
  as an *Out of scope* line in `.scratch/v4/MAP.md` — scoping for that map, whose stated reason was
  "the sources are spirit-shaped" — and was escalated to a permanent prohibition by the docs
  backfill commit `38990f5`, which also did not reconcile it with ADR 0002 eight days earlier.
  0004 is now amended: this repo does not *author* card ratings; cited card lists are permitted.
- **Bands, not names, were the hard part.** The PRD expected 40-60 name near-misses. The real
  ambiguity is which band a mention sits under, because captions have no section boundaries. The
  86-entry review batch in `extraction/near-miss-review.md` is the remaining work; adjudicating it
  is what raises the two coverage counts.
