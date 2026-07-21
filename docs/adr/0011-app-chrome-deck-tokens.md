# 0011 — App chrome routes through `--deck-*` design tokens

Status: accepted
Date: 2026-07-21

## Context

The app shipped a warm-dark retheme (island-retheme) as its unconditional default. The four anchor
surfaces were built against CSS custom-property tokens, but ~45 other declarations in `deck.css`
still hardcoded the old cool near-black palette, so the app read as a half-rethemed patchwork.
Beyond that one sweep, there was no recorded rule that chrome must use the tokens — so the drift
would recur. Decided in island-retheme PRD-2.

## Decision

- **Every app-chrome colour declaration points at the semantically-nearest `--deck-*` role token**
  in `src/deck.css`'s `:root`: `bg`, `panel`, `panel-2`, `line`, `line-soft`, `text`, `body`,
  `dim`, `accent`, `accent-bg`, `warn` (plus `mono`). A hardcoded hex in chrome is a regression.
- **A role with no existing token escalates to the owner** — a hover tint or a disabled-state grey
  with no token is a genuine new judgment value, not something to invent (ADR 0003 applied to
  presentation).
- **The categorical *palettes* are a separate system, not chrome.** `tagColors.ts` /
  `tierColors.ts` (`EXPANSION_COLOR`, `TAG_COLOR`, `SUBTYPE_COLOR`, `CARD_KIND_COLOR`, …) and
  `DeckUpset.tsx`'s element / set-size colours are decided semantic values, pinned pairwise-distinct
  by `cardChipColors.test.ts`. The token sweep must never touch them; if a chip test needs editing
  to make a chrome change pass, the change reached into the wrong system.
- **The guard is a `grep` audit, not a test.** The sweep's closing step recorded the allowlist of
  legitimately non-token hex values (the semantic palettes above) so a future hardcoded regression
  has something to diff against — re-run `grep -n '#[0-9a-fA-F]\{3,6\}' src/deck.css` and confirm
  every hit is on that list.

## Consequences

- Retheming or re-tuning the whole app is editing `:root`, not hunting literals across the
  stylesheet.
- The one weak spot is honest: chrome-token adherence is guarded by a manual grep + allowlist, not
  an automated test, because CSS literals are awkward to assert on. A regression is caught by the
  audit, not by CI.

## Left open, deliberately

**A `deck.css` lint/test that fails on a non-allowlisted hex** would upgrade the manual audit to an
automated guard. Not built; the allowlist + grep is today's contract.
