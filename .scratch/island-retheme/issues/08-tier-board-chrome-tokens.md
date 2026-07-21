# 08 — Tier board chrome onto `--deck-*` tokens

Status: done
Parent: [PRD-2.md](../PRD-2.md)

## What to build

Replace the hardcoded hex declarations in `src/deck.css` for `.tier-tile-art`,
`.tier-tile-card-art`, `.tier-tile-spirit-name`, and `.tier-tile figcaption`'s neighbouring rules
(frame/border/background chrome around the tier tiles, not the tier ribbon itself) with the
semantically-nearest `--deck-*` token. Re-grep before starting.

**Do not touch** `tierColors.ts`'s `PALETTE` (the seven tier-label hues, sampled from the owner's
own TierMaker board) — that is a separate, already-decided semantic system.

## Acceptance criteria

- [x] Every hardcoded hex found in the audited selectors is either a `--deck-*` token or escalated
      to the owner as a declaration with no clean token match — never silently invented.
- [x] `tierColors.ts`'s `PALETTE` is untouched.
- [ ] Visual check at 375px + desktop against the shipped app on both the Tier list tab and
      Browse's tier-badge ribbon; screenshot before/after in `screenshots-06/`. (skipped — no
      browser/screenshot tooling in this session)
- [x] `cardChipColors.test.ts` and the full suite pass unchanged.

## Blocked by

None.

## Comments

Re-grepped `src/deck.css`. Changes:

- `.tier-label { color: #10141a }` → `var(--deck-bg)` — contrast text painted over the locked
  `tierColors.ts` `PALETTE` ribbon background; `#10141a` is numerically almost identical to
  `--deck-bg` (`#1c160e`), same reasoning as ticket 07's `.deck-upset-sizechip[data-active='true']`.
  `PALETTE` itself untouched.
- `.tier-tile-card-art { background: #17202a }` → `var(--deck-panel-2)` (recessed placeholder
  surface while card art loads).
- `.tier-tile-art { background: #222 }` → `var(--deck-panel-2)` (same placeholder role).

Escalated (left alone, no clean token match):

- `.tier-tile figcaption { color: #fff }` — near-white caption text over the tile's `rgba(0, 0, 0,
  0.74)` scrim (the scrim itself is an rgba() literal, not a hex, so it wasn't in the hex audit's
  scope). No `--deck-*` token is near-white; `--deck-text` (`#e7d19c`) is a warm parchment gold and
  would shift the caption's hue against the dark scrim. Same reasoning as ticket 06's
  `.card-row-pill`/`.expansion-chip`/`.subtype-chip`.
- `.tier-tile-spirit-name { color: #fff }` — same figcaption-family near-white text (rendered at
  `opacity: 0.75`), same no-token-fits reasoning as above.

Screenshots not captured — no visual/browser tooling available in this session.

`npx tsc --noEmit` and `npx vitest run` both pass, `cardChipColors.test.ts` unchanged and green.
