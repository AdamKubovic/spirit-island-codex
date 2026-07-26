Status: done

# Extract card ratings and produce the near-miss review

## Parent

`.scratch/card-tier-lists/PRD.md`

## What to build

Read the eight committed transcripts and work out what each list actually rates, stopping at the
human gate. This ticket ships **no** tier list data. Its whole output is a proposed rating set plus
a review file for the owner to adjudicate.

**This is the ticket where this repo has historically shipped fiction.** It has previously shipped
fabricated OCFDU ratings, wrong elements, and five aspects that do not exist. The mechanism was
always the same: a source could not answer, and the gap got filled with something plausible. The
rules below are not stylistic preferences.

### The two routes to a rating, and there is no third

1. **Verbatim match.** A card name from the power-card dataset appears in the transcript, matched
   case- and punctuation-insensitively, in a passage where a tier is being assigned. Ships directly.
2. **Owner adjudication.** Everything else that looks like it might be a rating goes into the
   review file and waits for a human.

Absent is a real, meaningful value in this schema — ADR 0001 makes an absent key mean "the source
never rated this". A gap is therefore information, not an embarrassment to be tidied away. Do not
infer a rating from a grouping statement ("the rest of these are all fine"), do not fuzzy-match a
half-heard name onto the nearest card, and do not fill a band to make the counts look complete.

### The review file

One file covering all eight videos — the owner chose a single batch over a per-video drip. Each
entry needs enough context to be ruled on in seconds without opening the video:

- what the captions heard
- the candidate card from the power-card dataset
- the surrounding transcript sentence, quoted
- the timestamp
- the tier band being discussed at that point

Expect roughly 40–60 entries. On Major Part 1, verbatim matching found 10 of the ~14 cards the
video appears to rate, leaving 4 near-misses — about a quarter. A worked example: the captions
render the sole Nature Incarnate minor as "Rotting Bog"; the card is **Roiling Bog and Snagging
Thorn**. Unambiguous to a human, and still routed through the owner, because the faculty that
resolves that one correctly is the same faculty that invented five nonexistent aspects.

### Tier vocabularies

Derive each list's `tierLabels` from what its own videos say, strongest first. Do **not** copy the
vocabulary from the owner's board.

Known from transcripts already read, to be confirmed against all parts:

- The majors series has both `D` and `F`, and Part 1 explicitly defers `C` to Part 2 — the parts
  split by band, and each video announces which band it covers.
- The minors series describes its own split as "an S and A, B tier, and then a C and F", implying
  **no D band**.

### The `X` trap

`X` means two contradictory things in this creator's lists, and getting it wrong silently corrupts
the rank prior.

- In the owner's board (spirits), `X` is a band **above** `S`. Its six entries are the strongest
  spirits in the game, and it sits first in `tierLabels`, so rank computation scores them as
  strongest.
- In the minors video, a blue `X` drawn over a card means the card was **removed by errata**.
  Growth Through Sacrifice sits in `S` tier *with* an X overlay — the band is `S`, and the X is an
  annotation.

Record the band the card sits in. Drop the errata marker from the ratings and note it for the
`methodology` prose. `X` must not enter either card list's `tierLabels`. If the transcripts turn up
**many** X-marked cards rather than a handful, stop and report the count to the owner rather than
deciding alone — a dedicated annotation field becomes worth reconsidering at volume.

## Acceptance criteria

- [ ] Every one of the 101 minor and 78 major cards is accounted for as: verbatim-matched with a
      band, sent to review, or explicitly not mentioned in any transcript
- [ ] A proposed rating set exists for each subject, containing only verbatim matches
- [ ] Every proposed key resolves to a real card name in the power-card dataset
- [ ] One review file covers all eight videos, with heard text, candidate card, quoted sentence,
      timestamp and band for each entry
- [ ] Each subject's proposed `tierLabels` is recorded with the transcript quotes that establish it,
      strongest first
- [ ] `X` appears in neither proposed vocabulary
- [ ] Every card found carrying an errata `X` marker is listed separately with the band it sits in,
      and the total count is reported
- [ ] Where a video announces which band it covers, that mapping is recorded for the citation
      `methodology` in the shipping tickets
- [ ] No file under the app's data directory is created or modified
- [ ] No list is registered with the tier store

## Blocked by

- Reproducible transcript ingest
