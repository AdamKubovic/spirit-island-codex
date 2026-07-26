Status: needs-info

# Ship the major powers tier list

## Parent

`.scratch/card-tier-lists/PRD.md`

## What to build

Turn the extracted major-power ratings, plus the owner's adjudications, into a shipped `cited` tier
list. A player opens the Tier list tab, switches the subject picker to Major powers, and sees Red's
ranking of the major power deck rendered on the existing board.

Runs in parallel with the minor powers ticket — neither blocks the other. Same rules throughout;
the differences from that ticket are the subject, the source, and the vocabulary.

**No component changes.** If this ticket needs one, the effort was mis-scoped — raise it.

### The list

- `subject: 'major-powers'`, keyed by **power-card name**.
- `origin: 'cited'`, `verified: false`, `type: 'strength'`.
- `tierLabels` from what the videos themselves say, strongest first. Part 1 establishes both `D`
  and `F` and explicitly defers `C` to Part 2, so the bands are announced by the videos rather than
  inferred. Not copied from the owner's board. `X` must not appear in it.
- Keys come only from verbatim transcript matches and owner-approved near-misses. Everything else
  has no key, and that absence means "the source never rated this".
- Owner-rejected near-misses become `unresolved` entries.

### The citation

- `author`: `"Spirit Island Archive"`
- `url`: Part 1 (`dHe0_n86nq4`)
- `title`: names the series ("Red's Major Power Tier List") and its part range
- `published`: from video metadata (Part 1 is 1 November 2023)
- `method`: auto-generated captions scraped with `yt-dlp`
- `methodology`: enumerates all five part ids and the band each covers, notes the auto-caption
  provenance and the owner adjudication, and records that the two `[OUTDATED]`-titled major power
  videos in the same playlist were deliberately excluded as superseded
- `players` only if a video states it

Note the list `name` may carry "Red's", matching the videos' own titles, while `author` remains the
channel — the same split already used for the owner's board.

### The tripwire

Pin the exact key set longhand in the canon test, plus the coverage count. Expect this list to be
**visibly partial** — Part 1 alone left roughly a quarter of its ratings in the near-miss bucket.
A sparse shipped list that is honestly sparse is the correct outcome; pinning the sparseness is
what keeps it that way.

## Acceptance criteria

- [ ] A `major-powers` list is registered in the tier store's shipped array
- [ ] Every tier key resolves to a real major power card name
- [ ] Every label used appears in the list's own `tierLabels`
- [ ] `X` is absent from `tierLabels`
- [ ] The exact key set is pinned longhand in the canon test
- [ ] The coverage count is pinned
- [ ] `origin` is `cited`, `verified` is `false`, and a source with a URL is present
- [ ] `methodology` names all five video ids, the band each covers, and the exclusion of the two
      outdated videos
- [ ] Owner-rejected near-misses appear as `unresolved` entries
- [ ] The Tier list tab's subject picker offers Major powers and renders the board
- [ ] No component file and no tier store logic is modified
- [ ] Full test suite green

## Blocked by

- Prefactor: canon test accepts any known subject
- Extract card ratings and produce the near-miss review
