# 22 — The aspect nudge and the sibling list argue about the same aspects

Status: done

## Parent

`.scratch/v2/PRD.md`

## The observation

An expanded result row now renders three overlapping views of the same aspects:

1. `findAspectNudge`'s message — "you might like this aspect"
2. `spirit.aspects`, each with its transcribed effect
3. the sibling configurations, each with its tier and effective complexity

The nudge existed because **v1 could not rank aspects**. It was the only way an aspect could
reach the user at all. v2 ranks them directly, so at first glance the nudge is arguing for
something the recommender has already decided — and may have decided against.

## Why this is not simply "delete the nudge"

`findAspectNudge` fires on `aspect.shiftsToward`: it looks for an aspect that points at an
OCFDU axis the user weighted highly and the base spirit rates low on.

`shiftsToward` feeds **nothing else**. The PRD puts "bending fit by `shiftsToward`" explicitly
out of scope for v2 — fit is inherited from the base spirit, unmodified — and calls it a
deliberate follow-on phase. So the nudge is currently the *only* place that hint reaches a
human. Delete it and v2 silently loses the one signal that a later phase is meant to promote
into scoring.

That makes this a design question, not a cleanup.

## The decision to make

Pick one:

- **Keep the nudge as-is.** It is the placeholder for unshipped fit-bending. Then say so in a
  comment on `findAspectNudge`, because nothing currently explains why a ranked-aspect app
  still nudges toward aspects.
- **Fold the hint into the sibling list.** A sibling whose `shiftsToward` matches a
  high-weighted axis gets marked there, and the standalone nudge goes. One view instead of
  three, and the hint survives.
- **Delete the nudge and accept the loss** until `shiftsToward` reaches scoring. Cheapest, and
  defensible if fit-bending is the next thing you build.

Whichever wins: the second list (`spirit.aspects` with effects) and the third (siblings with
tiers) enumerate the same aspects and should be one list either way.

Note that 27 of 31 aspects carry a `shiftsToward` hint. The four without — Immense, Regrowth,
Unconstrained, Spreading Hostility — are pinned by a test, because their cards change economy,
setup or growth rather than pointing at an axis. Any change here must leave that test passing.

## Blocked by

- None

## Comments

**Triaged 2026-07-11: fold the hint into the sibling list.** Owner's decision. A sibling whose
`shiftsToward` matches a high-weighted axis gets marked in the sibling list; the standalone
`findAspectNudge` message goes. The second and third lists (`spirit.aspects` with effects, siblings
with tiers) merge into one list either way. The test pinning the four aspects without
`shiftsToward` (Immense, Regrowth, Unconstrained, Spreading Hostility) must keep passing.

**Implemented 2026-07-11.** `aspectNudge.ts`'s `findAspectNudge` replaced with `topWeightedLowAxis`,
which returns just the axis (if any) that's top-weighted and the base spirit rates low on -
message assembly moved to the sibling list itself. `ResultRow` in `Recommender.tsx` now renders one
merged "Other configurations of X" list (was two: `spirit.aspects` with effects, and siblings with
tiers); the sibling whose `shiftsToward` matches that axis gets an inline hint and the
`.aspect-hint` highlight (renamed from `.aspect-nudge`). The row's own aspect (if the config being
viewed is one) still shows its transcribed effect, just inline rather than duplicated in a
side-list. The four-aspects-without-`shiftsToward` data test (`aspectCanon.test.ts`) is untouched
and still passes. `aspectShiftsToward(aspect, axis)` owns the `+axis` string match (code review
flagged the first pass for inlining that domain check straight into the component, untested); it
now lives in and is tested by `aspectNudge.ts`/`aspectNudge.test.ts`. 236 tests pass,
`tsc -b`/`oxlint` clean.
