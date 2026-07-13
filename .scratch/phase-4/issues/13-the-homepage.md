# 13 — The homepage 🎨

Status: done
Parent: [Phase 4 PRD](../PRD.md) · cluster 3 (app restructure)

## Blocked by

None — can start immediately.

## What to build

The app's front door, per the [homepage resolution](01-the-homepage.md): every visit boots to a
homepage that orients and routes. One line on the game (linking out to the official site), one
line on the app ("an unofficial fan-made companion…"), three intent-phrased doors as art-backed
tiles using already-hosted spirit art — "Explore every spirit → Browse" first, then "Not sure
what to play? → Recommend", then "How do they rank? → Tier list" — and a footer disclaimer:
unofficial, fan-made, non-commercial, not affiliated with the rights holders. The logo becomes
the clickable route home (no Home nav button; no nav item active on the homepage), and nav
reorders to start with Browse. Nothing on the page may go stale.

**Variant round (HITL):** before finalising, present 2–3 *structurally different* homepage
layouts on the live app via the repo's `?variant=` + floating-switcher pattern (see the #03
prototype precedent). The owner picks; the winner ships properly; the switcher and losing
variants are deleted; round screenshots are kept in `../screenshots-13/`.

## Acceptance criteria

- [x] Every boot lands on the homepage; the logo returns home from any tab; no Home nav button
- [x] The three doors navigate to their surfaces; Archive/Log/Settings remain nav-only
- [x] Framing lines and the fan-content disclaimer are present; the game line links out
- [x] Nav order starts with Browse ("Recommended" demoted per the locked call)
- [x] App smoke asserts boot view, logo click, and nav order
- [x] Variant round run and recorded (screenshots kept, scaffolding deleted)
- [x] Browser-verified at 375px + desktop; door tiles don't overflow

## Comments

**Resolved (2026-07-13). Variant round: the owner picked A — stacked banners** (three full-width
horizontal door rows, art left, intent text right) over B (three-column tile grid) and C (Browse
as a lead hero tile). All three were live on the real app behind `?variant=` with a floating
switcher, per the #03 precedent; round screenshots for both viewports kept in
`../screenshots-13/` (`*-variant-{A,B,C}.png`, shipped state as `*-SHIPPED-A.png`); the switcher
and losing variants are deleted.

Shipped: `Homepage.tsx` (framing lines, three intent doors backed by hosted spirit art —
Lightning / River / Rampant Green, ids pinned in the smoke test — and the PRD-verbatim footer
disclaimer); boot goes to `home`, which no nav item matches, so none shows active; the logo
became the app's only Home control (`aria-label="Home"` button in `AppShell`); nav reordered to
Browse, Recommend, Archive, Tier list, Customise tiers, Log (Settings arrives in #14, the
dissolution in #15). The game line links to the publisher's official page
(`shop.greaterthangames.com/pages/spirit-island` — live-verified this session; the older
`greaterthangames.com/spirit-island` 404s). Copy is count-free so nothing goes stale.

Verified: 339/339 tests; production build at 375px + 1280px — doors navigate, logo returns home,
no nav active on home, no horizontal overflow. Code review: no hard violations beyond a
CONTEXT.md vocabulary slip in door copy ("rankings" is on the Tier-list avoid list — fixed to
"Published tier lists and your own board", which also corrected the "side by side" overstatement
the Spec axis flagged); its other judgement calls (pin door art ids, assert Browse is literally
first, drop a dead export) applied.
