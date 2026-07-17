# 02 — Add "expansion" and "type" to the Powers Group by

Status: done
Blocked by: None — can start immediately
Parent: ../README.md

## What

The Powers segment's **Group by** control (`src/components/CardsTab.tsx:122`) offers
`none / cost / speed / element`. Add two options (owner request, 2026-07-17):

- **Expansion** — group by `PowerCard.expansion`.
- **Type** — group by `PowerCard.kind` (`minor` / `major` / `unique`). The control option reads
  "Type" (owner's word); the group headers use the app's existing card-kind wording (see
  `CARD_KIND_COLOR` keys in `tagColors.ts` and any existing kind label — reuse it, don't coin a new
  one).

## Where

- `src/domain/powerCardArrange.ts` — extend the `PowerGroup` union with `'expansion' | 'type'`, and
  add the two cases to `groupPowerCards`.
- `src/components/CardsTab.tsx` — add the two `<option>`s to the Group by `<select>`.

## Semantics (follow `groupPowerCards`'s existing conventions)

- Both new keys are **single-valued** per card (unlike `element`), so each card lands in exactly one
  group — simpler than the element case.
- **Fixed canonical group order, empty groups omitted** — the file's stated rule (see its header
  comment and the `cost` / `speed` cases):
  - **Expansion**: use the canonical `EXPANSIONS` order from `src/domain/types.ts` (NOT alphabetical),
    so it matches expansion ordering elsewhere in the app. A card whose expansion string isn't in
    the canonical set still groups under its raw string — never drop a card (mirror how the filter
    tolerates raw strings).
  - **Type**: fixed order minor → major → unique.

## Tests

Extend `src/domain/__tests__/powerCardArrange.test.ts` in the same style (small fixtures; assert
group labels, membership, order, and empty-group omission) for both new groupings.

## Acceptance criteria

- [x] The Powers "Group by" offers **Expansion** and **Type** (minor/major/unique), alongside the
      existing cost / speed / element.
- [x] Expansion grouping uses canonical `EXPANSIONS` order; a card with an unrecognised expansion
      string still appears under its raw label (never dropped).
- [x] Type grouping uses fixed minor → major → unique order, reusing the app's existing kind labels.
- [x] Empty groups are omitted; grouping works in both grid and rows views.
- [x] `powerCardArrange.test.ts` is extended (labels, membership, order, empty-omission, the
      raw-string case).
- [x] `tsc -b`, `oxlint`, and the suite are clean; verified in the running app.

## Comments

- Implemented 2026-07-17: `groupPowerCards` gained `'expansion'` and `'type'` cases in
  `powerCardArrange.ts`; `CardsTab.tsx`'s Group by select gained the two `<option>`s.
  Expansion grouping: canonical `EXPANSIONS` values in order, then any card whose raw `expansion`
  string isn't canonical groups under that raw string — mirrors `powerCardFilter.ts`'s literal
  (non-normalized) string matching, per the ticket's explicit instruction. Real power-card data
  is mostly transcribed strings (`Basegame`, `Promo2`, `Horizons of Spirit Island`) that don't
  match the 7 canonical names, so ~36% of cards land in the raw-fallback bucket, trailing after
  the canonical groups — a known tension between the ticket's literal-matching instruction and
  story 9's "canonical order... matches the rest of the app," flagged for the owner rather than
  resolved unilaterally by reaching for `normalizeExpansion` (which the ticket didn't ask for).
  Type grouping: label is the raw `card.kind` string (`'minor'|'major'|'unique'`), matching the
  one existing kind label in the codebase (`CardRows.tsx` renders `card.kind` verbatim,
  CSS-uppercased) rather than inventing a capitalized string nowhere else in the codebase. Added
  a presentation-only `.card-group h3 { text-transform: capitalize }` CSS rule (`deck.css`) so
  group headers read "Minor"/"Fast"/"Base" etc. visually without a second label string to keep in
  sync with the data.
  Code review (Standards + Spec sub-agents) caught both of the above before commit: the original
  cut had invented a `CARD_KIND_LABEL` map with new capitalized strings, and the `expansion` case
  built three intermediate arrays with a nested filter (O(n·m)) — simplified to a single-pass
  `Map<string, PowerCard[]>` instead.
  `powerCardArrange.test.ts` extended with 7 new tests (labels, membership, canonical order,
  empty-omission, raw-string fallback, for both new groupings) — 16/16 pass. Full suite 403/403,
  `tsc -b` and `oxlint` clean. Verified live in the dev server via Playwright: both new options
  appear in the select, group by Expansion/Type renders correct headers (capitalized visually) in
  both grid and rows views, no console errors.
