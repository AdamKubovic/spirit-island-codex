# 01 — The panel vibe sheet

Status: done
Label: wayfinder:research (AFK)
Parent: [Panel theming map](../MAP.md) · [PRD](../PRD.md)

## Blocked by

None — the frontier; can start immediately.

## Question

What, concretely, makes a printed spirit panel look like a spirit panel — at vibe level, as
buildable ingredients? The variants must be built from sampled fact, not from guessed
"parchment-ish" hexes.

Produce a short markdown vibe sheet (`.scratch/panel-theming/panel-vibe-sheet.md`) from the
panel scans this repo already hosts (`public/panels/*.webp`, ~4–6 panels sampled for spread):

- **Palette:** actual sampled hexes — the parchment field (and its darker aged edges), the
  section-band tans, the dark-brown lettering, the presence-track greens, the innate-power
  header browns. Grouped as surface / text / accent roles, with a proposed dark-translation of
  each (the round needs both light and dark treatments).
- **Node anatomy:** what makes a presence-track node read as one — shape, ring/edge treatment,
  figure weight — described as CSS-achievable properties (no image assets).
- **Type hierarchy:** how the panel ranks GROWTH / PRESENCE / INNATE POWERS headers vs body vs
  figures (case, spacing, weight), mapped onto the app's shipped faces (Mouse Memoirs display,
  Reem Kufi body — no new fonts).
- **What NOT to copy** (fidelity guard): panel chrome, ornate borders, layout structure —
  restate the vibe-not-replica line so the prototype ticket inherits it.

Resolution = the vibe sheet linked from this ticket, with the sampled panels named.

## Acceptance criteria

- [x] Vibe sheet exists with hexes sampled from at least four named panel scans, grouped into
      surface / text / accent roles, each with a proposed dark translation
- [x] Node anatomy and type hierarchy described as CSS-achievable properties using only the
      shipped fonts — no new assets proposed
- [x] The fidelity guard (what NOT to copy) is restated for the round to inherit

## Comments

**Resolved (2026-07-13).** Vibe sheet at [`../panel-vibe-sheet.md`](../panel-vibe-sheet.md).
Six panel fronts sampled (Base ×2, Branch & Claw ×2, Jagged Earth ×2) by adaptive-palette
quantisation; every role's hex traces to a named panel with recorded coverage. Findings worth
carrying into the round:

- The **parchment field** clusters tight at `#e7d19c` (L≈0.75); `#a89368` (the deep aged-shadow
  tan) appears in **all six** panels — the single most reliable cross-panel colour.
- **Ink** lettering is a near-black warm brown `#2e2520`, body a softer `#5b4e2d`.
- **Gold** (`#eecb73`) and **band-tan** (`#d2b068`) are the ornament/divider accents; the
  **presence green** (`#239850`, deep rim `#1e572b`) and **innate rust** (`#a4562f`) round out
  the accents. Blues/teals are *spirit-specific element accents*, flagged as NOT panel chrome so
  the round doesn't bake them into the surface.
- Node idiom, type hierarchy, and the fidelity guard (no chrome, no layout, no filigree/relief)
  are all written as CSS-achievable properties on the shipped faces. Dark-translations proposed
  per role for the B/C dark variants.
