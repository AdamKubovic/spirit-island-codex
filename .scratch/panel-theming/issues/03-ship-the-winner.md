# 03 — Ship the winner

Status: ready-for-agent
Label: wayfinder:task (AFK once the pick exists)
Parent: [Panel theming map](../MAP.md) · [PRD](../PRD.md)

## Blocked by

- [02 the modal variant round](02-the-modal-variant-round.md) — needs the owner's pick.

## Question

None to decide — this is the map's execution override: rewrite the picked treatment properly
(prod component/CSS, colours in the `tagColors.ts` home where they're a palette, any new pure
logic at a domain seam with tests), delete the round scaffolding and `?panel=` gate, verify on
the production build at 375px + desktop, keep a SHIPPED screenshot, close with a resolution
comment per the house pattern. Apply any reaction notes the pick carried (the #22 "font size
feels small" precedent). The two-axis code review runs before the commit.

Resolution = what shipped and where, linked screenshot, test count.

## Acceptance criteria

- [ ] The picked treatment is the modal's default look; `?panel=` is inert and the round
      scaffolding is deleted
- [ ] The palette lives in the colour home; the collision test pins it apart from the
      expansion, tag, kind/speed, and band palettes
- [ ] App smoke asserts the treatment renders and the OCFDU truth rules survive it
- [ ] The pick's reaction notes are applied (the #22 "sized up" precedent)
- [ ] Production build verified at 375px + desktop; SHIPPED screenshot kept; two-axis code
      review applied before the commit
