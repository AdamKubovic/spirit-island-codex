Status: done

# Ship the minor powers tier list

## Parent

`.scratch/card-tier-lists/PRD.md`

## What to build

Turn the extracted minor-power ratings, plus the owner's adjudications, into a shipped `cited` tier
list. A player opens the Tier list tab, switches the subject picker to Minor powers, and sees
Spirit Island Archive's ranking of the minor power deck rendered on the existing board.

**No component changes.** `TierBoard` already builds its card pools from the power-card dataset and
already renders card subjects; the picker already groups lists under subject headings; the store is
already subject-generic. If this ticket needs a component or store change to work, that is a signal
the effort was mis-scoped — raise it rather than absorbing it.

### The list

- `subject: 'minor-powers'`, keyed by **power-card name** (the card dataset carries no other id).
- `origin: 'cited'` — immutable in-app. `verified: false` — nobody has re-checked it against the
  video end to end.
- `type: 'strength'`.
- `tierLabels` is the vocabulary established in the extraction ticket, strongest first, taken from
  what the videos themselves say. Not copied from the owner's board. `X` must not appear in it.
- Keys come from exactly two places: verbatim transcript matches, and near-misses the owner
  approved. Nothing else. A card nobody matched and nobody approved has **no key** — that absence
  means "the source never rated this" and is load-bearing.
- Near-misses the owner **rejected** become `unresolved` entries recording what the captions heard
  and where, so the audit trail lives in the shipped data rather than only in scratch notes.
- Any card the source marked as errata-removed carries the band it sits in, with the errata
  explained in `methodology`.

### The citation

`SourceCitation` is singular and stays that way — a three-part series is cited as one source.

- `author`: `"Spirit Island Archive"`
- `url`: Part 1 (`DdZFT5myaDI`)
- `title`: names the series and its part range
- `published`: from the video metadata (the parts ran 1–3 January 2023)
- `method`: records that this came from auto-generated captions scraped with `yt-dlp`
- `methodology`: enumerates all three part ids **and** which tier band each part covered, notes the
  auto-caption provenance, notes that near-misses were adjudicated by the owner, and explains the
  errata-marked card handling
- `players` only if a video states the player count it ranked for. Absent otherwise — never inferred.

### The tripwire

Extend the canon test with a **pinned, longhand key set** for this list. This is the single most
important assertion in the effort: it is what stops a future agent "helpfully" filling the gaps.
The file already practises this deliberate duplication for the owner's board (68 keys) and the
3MBG list (36 keys); the reasoning is spelled out in the aspect canon test.

## Acceptance criteria

- [ ] A `minor-powers` list is registered in the tier store's shipped array
- [ ] Every tier key resolves to a real minor power card name — enforced by the existing namespace
      check, which needs no modification
- [ ] Every label used appears in the list's own `tierLabels`
- [ ] `X` is absent from `tierLabels`, asserted in the test with a comment explaining that `X` means
      "top band" in the spirit list and "removed by errata" here
- [ ] Any errata-marked card carries the band the source placed it in, asserted in the test
- [ ] The exact key set is pinned longhand in the canon test
- [ ] The coverage count is pinned, so partialness is itself a tested fact
- [ ] `origin` is `cited`, `verified` is `false`, and a source with a URL is present
- [ ] `methodology` names all three video ids and the band each covers
- [ ] Owner-rejected near-misses appear as `unresolved` entries
- [ ] The Tier list tab's subject picker offers Minor powers and renders the board
- [ ] No component file and no tier store logic is modified
- [ ] Full test suite green

## Blocked by

- Prefactor: canon test accepts any known subject
- Extract card ratings and produce the near-miss review

## Comments

Shipped as `src/data/tier-lists/sia-minor-powers-2023.json` with **13 of 101** keys, all at `B`.

Auto-captions carry no section boundaries, and the reviewer back-references other bands
constantly mid-section, so band-by-proximity provably fabricates ratings (it put five Part 1
A-tier cards in `S`). A key therefore ships only where the card is named verbatim inside a part
that declares it covers exactly one band. Part 2 (B tier) is the minors series' only single-band
part, so S, A, C and F are unrated here.

`unresolved` is absent rather than empty: no near-miss has been rejected yet, because none has
been adjudicated. The 50 minor entries in `extraction/near-miss-review.md` are still open, and
Growth through Sacrifice (the errata-X card, S tier in the video) is among them — the canon test
pins its absence so it cannot be quietly filled in.
