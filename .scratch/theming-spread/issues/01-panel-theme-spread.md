# Spread the panel theme (variant C) beyond the spirit detail modal

Status: done

## Parent

`../README.md`, `panel-theming/MAP.md` (the modal's own effort — complete, shipped variant C)

## Background

`panel-theming` shipped the spirit detail modal in **variant C**: a dark translation of the
printed spirit panels — umber parchment surface, parchment text, #23's vertical OCFDU bars
retinted to match. The palette lives in `PANEL_COLOR` (`src/components/tagColors.ts`), injected
as `--panel-*` CSS variables, with `panel-vibe-sheet.md` recording the prior-art decisions.

At the time, the owner said the aesthetic is wanted on **more surfaces** — Browse tiles, the tier
board, the shell — but that was explicitly out of scope for the modal effort. It was never
chartered as its own work. `phase-4` #23 independently hit the same wall (its bars wanted the
panel look) and also deferred to "the left panel / global theming" conversation.

## What this needs before it's buildable

Not scoped yet. Before this is `ready-for-agent`, an owner conversation needs to settle:

- Which surfaces actually get the parchment treatment — Browse tiles? Tier board? The left
  sidebar shell itself? All of them, or a subset?
- Whether it's a straight reuse of `PANEL_COLOR`/`--panel-*`, or those need extending for
  surfaces the modal effort never touched (e.g. list/grid density, hover states).
- A variant round if the reuse isn't a drop-in fit for a given surface — per this repo's HITL
  rule, any 🎨 decision needs the owner's pick, never an agent's guess.

## Out of scope (for now)

Nothing is chartered yet — this ticket exists to hold the thread, not to define the build.

## Comments

**Closed as already-delivered — 2026-07-27, during `/implement next`.**

This ticket is a stale duplicate of [`island-retheme`](../../island-retheme/MAP.md). It was filed
2026-07-23, two days *after* that effort's rollout closed (2026-07-21), and its Background reasons
from panel-theming's spread verdict without noticing which effort consumed it.

The chain the ticket missed: panel-theming #04 deferred the spread to "a future session charts the
spread as its own wayfinder effort, consuming this effort's vibe sheet + `PANEL_COLOR` as prior
art." That session happened — `island-retheme` (charted 2026-07-17) names itself "**This is that
effort**" and locks the same three anchor surfaces this ticket asks about: app shell (sidebar /
nav / knobs / background), Browse grid, tier board.

Each open question here was answered there, by the owner, not an agent:

- *Which surfaces?* All of them, plus Archive/Cards — the four anchor surfaces of `island-retheme`
  #02's variant round, then every remaining surface via PRD-2.md's five-ticket sweep (#06–#10).
- *Straight reuse of `PANEL_COLOR`, or extend it?* Extend — #01's
  [token-palette.md](../../island-retheme/token-palette.md) lifted the panel vibe sheet's roles into
  app-wide shell tokens. The values landed near-identical to `PANEL_COLOR` because the owner's pick
  (theme **B**, warm-dark) sits close to the shipped modal palette, which is also why #04's modal
  round resolved to `stay` — no modal change needed.
- *A variant round?* Ran, and decided by the owner per the HITL rule: theme **B** behind
  `?theme=A|B|C` (initially A, corrected to B after living with it), chips `original`, modal `stay`,
  ornament `rules`. Scaffolding shipped and deleted.

Verified in the current tree before closing, rather than trusting the maps:

- `:root` in `src/deck.css` carries `--deck-panel: #241d12`, `--deck-text: #e7d19c`,
  `--deck-line: #463a24` — byte-identical to `PANEL_COLOR`'s `surface` / `text` / `edge`.
- `SpiritTile.tsx`, `TierBoard.tsx` and `AppShell.tsx` contain no hardcoded hex at all; the three
  surfaces are entirely `--deck-*`-driven.
- The sidebar went *past* this ticket's ask — `qa-revision` #01's owner-picked "inverted-parchment"
  variant re-points the tokens inside `.deck-side` / `.deck-topbar` so the shell renders as the
  printed parchment against the dark main pane.

No code shipped for this ticket because there was nothing left to build. Opening a variant round
now would re-litigate theme B, a decision the owner has already made and once already corrected.

Its sibling [02](02-expansion-colour-more-surfaces.md) is **not** affected — expansion colour on
the tier board / Archive is a separate question that `island-retheme` never touched (it swept
*chrome* onto tokens; `EXPANSION_COLOR` is a locked semantic system deliberately left alone). That
ticket stays `needs-triage`, still waiting on the owner to name its surfaces.
