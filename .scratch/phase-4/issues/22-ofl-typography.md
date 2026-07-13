# 22 — OFL typography 🎨

Status: done
Parent: [Phase 4 PRD](../PRD.md) · cluster 5 (Archive & theming)

## Blocked by

None — can start immediately.

## What to build

The typography the owner locked at spec assembly, informed by the
[licensing research](../official-assets-research.md): **OFL fonts only, self-hosted** — the
commercial title font (Fling-a-Ling) and the app-forbidding free lookalike (DK Snemand) were
both declined.

- **Body:** Reem Kufi (reportedly the game's actual body font; SIL OFL via Google Fonts),
  self-hosted — no font CDN, this is a local-first app.
- **Spirit names / display:** one OFL display face, chosen by variant round.

**Variant round (HITL):** render 2–3 OFL display candidates (e.g. Mouse Memoirs, Josefin Sans,
one more of the builder repo's OFL set) on real spirit names in Browse and the detail modal via
the `?variant=` switcher; the owner picks; winner ships; screenshots kept in
`../screenshots-22/`.

## Acceptance criteria

- [x] Font files are committed and self-hosted with their OFL license texts alongside; the app
      makes no network font requests *(Playwright-verified: every font request same-origin)*
- [x] Spirit names render in the chosen display face across Browse, the tier board, and the
      detail modal; body text renders in Reem Kufi
- [x] Every shipped font's license is OFL — verified, not assumed *(per-family OFL.txt from
      google/fonts' `ofl/` tree; one anomaly caught, traced and documented — see the comment)*
- [x] Variant round run and recorded (screenshots kept, scaffolding deleted)
- [x] Browser-verified at 375px + desktop (long spirit names don't overflow their tiles) *(all
      three candidates: zero overflowing names at both widths; re-verify on ship)*

## Comments

**Round prepared (2026-07-13) — OWNER PICK NEEDED, see the question at the end.**

**The locked body call shipped:** Reem Kufi (SIL OFL, reportedly the game's actual body font per
the research) self-hosted from `public/fonts/reem-kufi/` with `OFL.txt` alongside, wired as the
lead of the body font stack in `deck.css` — including the three rules that re-declared the sans
stack (`.deck-field select/input`, `.deck-wizard h2`, `.filters select`), caught in review. The
deck's mono label chrome (`--deck-mono`) is deliberate design and stays. `fontFiles.test.ts`
pins every shipped font file + license so a moved TTF can't silently fall back to system-ui.

**Licensing (the acceptance's "verified, not assumed"):** all four families were pulled from
google/fonts' `ofl/` tree with their per-family OFL.txt, provenance tabled in
`public/fonts/README.md`. One anomaly found and traced rather than papered over: Reem Kufi's
own OFL.txt declares Reserved Font Name **"Josefin Sans"** — the identical line ships in the
font's canonical repo (aliftype/reem-kufi, `main` and `master`), so it is the project's
published license text (an upstream copy-paste bug), shipped verbatim per the no-fabrication
rule. It is SIL OFL 1.1 regardless. File renames (`[wght]` → `-Variable`) are URL hygiene only;
RFN terms bind internal font names, which are untouched. The declined faces (Fling-a-Ling
commercial, DK Snemand app-forbidding, Gobold donation-ware) stay declined.

**The display-face round is live and awaiting the pick.** Real spirit names in Browse tiles and
the detail modal, production build, gated on **`?type=A|B|C`** — note the param: the ticket
wrote `?variant=`, but #20 (`?variant=`) and #21 (`?colors=`) are pending, so this one is
namespaced per the handoff's collision rule. Nothing changes without the param; candidate font
files load only while the round is on:

- **`?type=A` — Mouse Memoirs:** condensed, friendly — the community's heading lookalike.
- **`?type=B` — Josefin Sans:** geometric, elegant, light.
- **`?type=C` — Lato (bold):** sturdy humanist workhorse.

Floating switcher bottom-right (raised above #20's, so simultaneous rounds don't overlap).
Screenshots (baseline + each candidate, Browse and detail, 375px + 1280px):
`../screenshots-22/`. Verified in Playwright against the production build (34 checks): computed
font-families per candidate on both surfaces, `document.fonts.check` confirms real loads, zero
name overflow, all font requests same-origin. Code review (two-axis): applied pre-commit — the
three escaping font stacks above, the prototype's injected `@font-face` URLs now use
`import.meta.env.BASE_URL` (runtime strings dodge Vite's build-time base rewriting), the font
tripwire test. Judgement calls kept: verbatim google/fonts TTFs over a woff2 conversion
toolchain (only Reem Kufi's 128KB loads by default; candidates load only in-round — subset the
winner at ship time if it matters), and the third copy of the floating-switcher markup stays
per-prototype (each file dies independently at its round's close).

**Question for the owner: which display face ships — A (Mouse Memoirs), B (Josefin Sans), or C
(Lato bold)?** Open Browse with `?type=A|B|C`, click into a spirit for the modal, or use the
floating switcher. On your pick: the winner ships into `deck.css` across Browse, the tier
board, and the detail modal per the acceptance, the losing font directories and this prototype
are deleted, and this ticket closes.

---

**Closed (2026-07-13). The owner picked A — Mouse Memoirs — noting the round's size felt
small.** Shipped: the `@font-face` and a grouped rule in `deck.css` covering Browse tiles
(h3/h4), the tier board's tile captions, and the detail modal head — each **sized up a step**
per the owner's note (tile names 0.92→1.15rem, detail head → 1.9rem, tier captions
0.55→0.7rem base / 0.7→0.85rem wide). One CSS-order trap fixed in verification: `.deck-main
h2`'s `font:` shorthand silently reset the family on the detail head (the round's injected
style tag had masked this by loading last), so the family is repeated on that rule with a
comment. Scaffolding deleted (`TypeRound.tsx` + App mount), losing fonts (Josefin Sans, Lato)
and their licenses deleted, `fontFiles.test.ts` and `public/fonts/README.md` updated, `?type=`
inert. Verified on the production build at 375px + 1280px: Mouse Memoirs loaded and computed on
all three surfaces, zero name overflow at the larger sizes, no horizontal overflow. 381/381
tests. Shipped screenshot: `../screenshots-22/1280-SHIPPED-A.png`.
