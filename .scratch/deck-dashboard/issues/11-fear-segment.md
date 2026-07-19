# Fear segment

Status: ready-for-agent

## Parent

`../PRD.md` (Deck Dashboard spec)

## What to build

The Fear segment replaces its stub: for the current expansion set, the fear pool's size,
its composition by fear tag (removal, defensive, weaken, disruption, displacement), and an
expansion breakdown. A card carrying several tags counts under each tag it carries — like
elements — but only once in the pool size. The view carries the framing copy that the
in-play fear deck is a small hidden subset of this pool built at setup, so the numbers
read as pool odds — the honest static answer — never as a card counter. No valence axis:
that is explicitly out of scope pending the map's taxonomy grilling.

## Acceptance criteria

- [ ] Pool size, per-tag composition, and expansion breakdown derive from the domain
      module and respect the current expansion set.
- [ ] Multi-tag counting pinned on fixtures: counted once per tag, once only in pool size.
- [ ] The hidden-subset framing copy is visible on the segment.
- [ ] No good/bad classification appears anywhere — existing sourced tags only.
- [ ] Type check, lint, and the full test suite pass.

## Blocked by

- `06-walking-skeleton-dashboard-tab.md`
