# 09 — Misc/global chrome onto `--deck-*` tokens

Status: ready-for-agent
Parent: [PRD-2.md](../PRD-2.md)

## What to build

Replace the hardcoded hex declarations in `src/deck.css` for `.spirit-tile select`,
`.home-door-banner:hover`, `.notice`, `.notes`, `.placeholder-art`, `.deck-why`, `.deck-heat`,
`.deck-row-head:hover`, `.deck-thumb`, `.aspect-hint`, `.scenario-difficulty`, and
`.adversary-tile-level` with the semantically-nearest `--deck-*` token. Re-grep before starting —
this is the widest-net issue in the rollout and most likely to turn up a value with no clean token
match; escalate those rather than guessing.

## Acceptance criteria

- [ ] Every hardcoded hex found in the audited selectors is either a `--deck-*` token or escalated
      to the owner as a declaration with no clean token match — never silently invented.
- [ ] Visual check at 375px + desktop across the Homepage, Browse (placeholder art / notices),
      Archive (scenario/adversary chrome), and Recommend (`.deck-why`); screenshot before/after in
      `screenshots-06/`.
- [ ] `cardChipColors.test.ts` and the full suite pass unchanged.

## Blocked by

None.

## Comments
