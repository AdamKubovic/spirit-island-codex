# 10 — Sweep-closing audit

Status: ready-for-agent
Parent: [PRD-2.md](../PRD-2.md)

## What to build

Once 06–09 are done, re-run the same audit used to scope this rollout:
`grep -n '#[0-9a-fA-F]\{3,6\}' src/deck.css`, minus the token-definition blocks
(`:root`) themselves. Confirm every remaining hit is a locked semantic value —
`tagColors.ts`'s/`tierColors.ts`'s chip palettes, `DeckUpset.tsx`'s element/set-size colours, or a
value an earlier issue in this rollout explicitly escalated and the owner kept as a hex — never
leftover shell chrome that 06–09 missed.

Record the final list (selector → value → why it's locked, or a link to the escalation that kept
it) in this ticket's Comments, so a future hardcoded-colour regression has something concrete to
diff against.

## Acceptance criteria

- [ ] Every remaining hardcoded hex in `src/deck.css` is accounted for and justified.
- [ ] Any stray shell chrome 06–09 missed is fixed here, not left for a future ticket.
- [ ] `cardChipColors.test.ts` and the full suite pass unchanged.

## Blocked by

- 06, 07, 08, 09.

## Comments
