Status: done

# Reproducible transcript ingest

## Parent

`.scratch/card-tier-lists/PRD.md`

## What to build

A committed, re-runnable way to turn a YouTube video id into clean plain text, plus the eight
transcripts this effort needs, committed as artefacts.

Everything downstream depends on transcript text, and getting it is the single biggest remaining
risk — so it gets its own ticket and fails on its own if it is going to fail.

**Do not re-litigate the approach. Three methods were tried during grilling and all three failed:**

- Fetching the watch page returns page chrome and no captions; the playlist URL redirects to a
  consent wall.
- Fetching the `timedtext` caption `baseUrl` directly from an authenticated browser session returns
  **HTTP 200 with a zero-byte body**, in every format (`json3`, `srv3`, `vtt`, plain).
- YouTube's own transcript panel, opened in a real logged-in browser, expands to
  `ENGAGEMENT_PANEL_VISIBILITY_EXPANDED` and renders **zero segments**.

`yt-dlp` succeeds where those fail because it falls back to the android-vr player API. Use it.

The helper shells out to `yt-dlp` with auto-subs, English, and no video download, then parses the
resulting VTT itself: strip cue timings, strip inline tags, and collapse the rolling duplicate
lines that auto-generated captions emit (each cue repeats the tail of the previous one, so naive
concatenation roughly doubles the text). Do **not** use `--convert-subs` — it requires ffmpeg,
which is not installed and is not needed, since the raw VTT parses in a few lines.

`yt-dlp` is a developer-machine tool. It must not be added to `package.json` — the shipped runtime
dependency list stays `react` + `react-dom`. Assume it is already installed and fail with a clear
message if it is not.

The eight videos, all from the Spirit Island Archive playlist "Spirit Island: Tier Lists":

| Subject | Video ids, in part order |
| --- | --- |
| Major powers | `dHe0_n86nq4`, `rkuXUmf7kpM`, `Hc3bLAkiO5o`, `Olm9L9CnHfc`, `Hnm_rD4ziRc` |
| Minor powers | `DdZFT5myaDI`, `bjd98MBYA5U`, `-uT5_RQTolE` |

The two `[OUTDATED]`-titled major power videos in the same playlist are superseded and must not be
ingested.

As a reference point for whether de-duplication worked: Major Part 1 (`dHe0_n86nq4`, 31:08) yields
roughly 6,000 words, and Minor Part 1 (`DdZFT5myaDI`, 25:09) roughly 4,300. A transcript coming out
at double those counts means the duplicate-line collapse is not working.

## Acceptance criteria

- [ ] A committed script under `scripts/` takes one or more video ids and writes one plain-text
      transcript per video
- [ ] It reports a clear, actionable error if `yt-dlp` is not on `PATH`
- [ ] It does not require ffmpeg
- [ ] Rolling duplicate caption lines are collapsed; word counts are in the region of the reference
      figures above, not double them
- [ ] All eight transcripts are committed, named so the video id and its part are identifiable
- [ ] Each transcript records its video id, title, uploader and publish date alongside the text, so
      later tickets can build citations without re-querying YouTube
- [ ] `package.json` dependencies are unchanged
- [ ] No tier list data is created or modified by this ticket

## Blocked by

- None — can start immediately
