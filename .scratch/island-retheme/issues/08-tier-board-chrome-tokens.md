# 08 — Tier board chrome onto `--deck-*` tokens

Status: ready-for-agent
Parent: [PRD-2.md](../PRD-2.md)

## What to build

Replace the hardcoded hex declarations in `src/deck.css` for `.tier-tile-art`,
`.tier-tile-card-art`, `.tier-tile-spirit-name`, and `.tier-tile figcaption`'s neighbouring rules
(frame/border/background chrome around the tier tiles, not the tier ribbon itself) with the
semantically-nearest `--deck-*` token. Re-grep before starting.

**Do not touch** `tierColors.ts`'s `PALETTE` (the seven tier-label hues, sampled from the owner's
own TierMaker board) — that is a separate, already-decided semantic system.

## Acceptance criteria

- [ ] Every hardcoded hex found in the audited selectors is either a `--deck-*` token or escalated
      to the owner as a declaration with no clean token match — never silently invented.
- [ ] `tierColors.ts`'s `PALETTE` is untouched.
- [ ] Visual check at 375px + desktop against the shipped app on both the Tier list tab and
      Browse's tier-badge ribbon; screenshot before/after in `screenshots-06/`.
- [ ] `cardChipColors.test.ts` and the full suite pass unchanged.

## Blocked by

None.

## Comments
