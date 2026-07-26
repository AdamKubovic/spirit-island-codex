Status: done

# Correct author attribution on the owner's board

## Parent

`.scratch/card-tier-lists/PRD.md`

## What to build

The two cited lists shipped today disagree about how to name the same creator. `owners-board.json`
records `source.author` as `"Red"`; `sia-favorites-fun-solo-2026.json` records
`"Spirit Island Archive"`. Both videos are from the same YouTube channel, Spirit Island Archive,
and this effort is about to add two more lists from that same channel. Left alone, the list picker
would show one creator under two names.

Settle on the channel as the author. `author` means the publisher; the person's name stays where
the source itself puts it — in the list's `name`.

The alternative — asserting that Spirit Island Archive **is** Red and normalising everything to
"Red" — requires an identity claim that no primary source in hand supports. Per ADR 0003 and
CLAUDE.md, a field that cannot be sourced must not be asserted. The channel name is directly
observable from the video metadata; the identity link is not.

## Acceptance criteria

- [ ] `owners-board.json`'s `source.author` reads `"Spirit Island Archive"`
- [ ] Its `name` still reads "Red's Final Tier List", so credit to Red is preserved
- [ ] Its `source.title` is unchanged — it quotes the video's own title
- [ ] The `methodology` prose still makes sense with the new author; adjust only if it now reads as
      self-contradictory, and do not rewrite its substance
- [ ] No change to the list's `tiers`, `tierLabels`, `subject`, or `verified`
- [ ] The canon test's pinned 68-key set for this list still passes untouched
- [ ] Full test suite green

## Blocked by

- None — can start immediately
