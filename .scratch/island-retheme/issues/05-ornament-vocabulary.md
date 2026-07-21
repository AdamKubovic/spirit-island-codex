# 05 — Ornament vocabulary for the winning direction

Status: done
Type: wayfinder:prototype
Blocked by: —
Assignee: —
Parent: ../MAP.md

> **Correction (2026-07-17):** ticket 02's base-direction pick moved from A (light-parchment) to
> **B (warm-dark, nature accent)** after this ticket was originally charted against A — see
> [02's correction note](02-theme-variant-round.md#correction--owners-revised-pick-2026-07-17).
> Build ornament candidates against **`?theme=B`**, not `?theme=A`; the "Question" and "candidates
> render against `?theme=A`" line below are stale, left as-written for the audit trail rather than
> silently rewritten.

## Question

Now that the owner has picked candidate A (light-parchment) on the theme variant round
([02](02-theme-variant-round.md)), which CSS-only leaf/vine/flourish motifs, on which surfaces,
and how heavy — the "floral is figurative + CSS ornament, not illustrated art" call locked at
charting (map Notes)? This was deliberately held back from ticket 02 ("Base palette / surface /
light-dark only... Ornament is a *later* ticket, deliberately held back so it doesn't muddy the
base direction decision") so the owner could react to ornament sitting on the *actual* winning
surface, not a placeholder.

No new art assets — CSS-achievable shapes only (dividers, corner flourishes, accent rules), per
the charting-time constraint. Candidates should render against the live `?theme=A` shell (see the
correction above: read as `?theme=B`).

## Acceptance criteria

- [ ] At least two or three ornament-density/motif candidates (e.g. minimal accent rules only vs.
      corner flourishes vs. leaf/vine dividers) rendered on at least the app shell + one other
      anchor surface, behind a namespaced param.
- [ ] CSS-only — no new image assets.
- [ ] Chip-system and modal legibility (per tickets 03/04's outcomes, if already resolved) hold.
- [ ] Owner's pick + reaction notes recorded.

## HITL

The **OWNER** picks the motif/density, never the agent. Ticket waits at `needs-info` once
candidates are live.

## Candidates built (2026-07-17)

Three CSS-only motifs, gated on `?ornament=rules|corners|vines`, rendered against `?theme=B`
(per the correction above) on the app shell sidebar and Browse tiles (`src/components/
OrnamentRound.tsx`, `deck.css` "ROUND 05" block). No query param = the fourth, implicit
candidate: the shipped look, undecorated.

- **`rules`** — minimal accent rules only: a thin accent-coloured gradient line under the logo,
  a hairline `--deck-line` rule closing off the nav block, and a fading accent underline below
  each tile's name row.
- **`corners`** — corner flourishes: open-cornered accent brackets (picture-frame style) at the
  sidebar's top-left/bottom-left edges, and smaller matching brackets at each tile art's
  top-left/bottom-right corners.
- **`vines`** — leaf/vine dividers: a row of small accent-coloured dots (standing in for a vine's
  leaf buds — no illustrated art) under the nav block and under each tile's name row.

All three hold chip-system distinctness and modal legibility untouched — only `.deck-side`,
`.deck-brand-button`, `.deck-nav`, and `.spirit-tile`/`.spirit-tile-art-wrap`/`.spirit-tile-
name-row` are touched, and only via pseudo-elements/background-images layered on the existing
surfaces. `cardChipColors.test.ts` and the full suite (414 tests) pass unchanged; the modal isn't
touched by this round at all (no `.modal`/`.spirit-detail` selector appears in the new CSS), so
tickets 03/04's outcomes stand untouched rather than re-verified.

Screenshots (375px and 1280px, all three candidates plus the undecorated `baseline`) are in
[screenshots-05/](../screenshots-05/), taken via `ornament_screenshots.mjs`. Each capture opens
the Browse tab so the sidebar (app shell) and the tile grid (the other anchor surface) are both
visible in one shot — filenames are `{variant}-Shell-Browse-{width}.png`, not a separate
app-shell-only capture.

Waiting on the owner's pick.

## Fourth candidate built (2026-07-21)

Owner's first pass landed on `corners`, with a note that `vines`' dot-run read as too plain for
"floral." Rather than reconsider the constraint, a fourth candidate — `floral` — was built to test
whether a leaf-shaped divider (still CSS-only: an inline `mask-image` data URI painted with
`var(--deck-accent)`, not a sourced image) read better than the dot run. Gated on
`?ornament=floral`, same anchor surfaces (`.deck-nav`, `.spirit-tile-name-row`), same structure as
`vines`. Screenshots in `screenshots-05/floral-Shell-Browse-{375,1280}.png`.

## Owner's pick (2026-07-21)

**`rules`** — minimal accent rules only. (The earlier `corners` read was a mis-click/typo,
corrected on reflection once `floral` was shown alongside it.)

Ticket resolved: `rules` is the winning ornament direction. `deck.css`'s "ROUND 05" block and
`OrnamentRound.tsx` stay in place as throwaway scaffolding per this round's own header comment
(delete on ship) — shipping `rules` as the default look, and deleting the scaffolding, is the
terminal-deliverable's job (see `../MAP.md`'s "Not yet specified" — that deliverable graduates now
that this pick has landed).
