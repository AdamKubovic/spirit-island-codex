# Panel vibe sheet — buildable ingredients for the modal retheme

Resolves ticket [01](issues/01-panel-vibe-sheet.md). Feeds the variant round
([02](issues/02-the-modal-variant-round.md)): variants build from these sampled hexes, not from
guessed "parchment-ish" colours.

## Provenance

Hexes below are **sampled** off the panel scans the repo already hosts (`public/panels/*.webp`,
2697×1797 fronts), by adaptive-palette quantisation (`PIL … quantize(FASTOCTREE)`, 12 colours
per panel, coverage recorded). Six fronts sampled for spread across expansions:

| Panel | Expansion |
|---|---|
| `lightnings-swift-strike-front` | Base |
| `bringer-of-dreams-and-nightmares-front` | Base |
| `a-spread-of-rampant-green-front` | Branch & Claw |
| `keeper-of-the-forbidden-wilds-front` | Branch & Claw |
| `heart-of-the-wildfire-front` | Jagged Earth |
| `river-surges-in-sunlight-front` | Jagged Earth |

These are **design judgment informed by real assets, not game data** — no canon tripwire is owed
(PRD). Each hex names the panel it came from and its coverage there. The dark-translation column
is a **proposal** (design judgment for a dark theme), not sampled.

## Palette — surface / text / accent roles

Every role's representative hex is a *real sampled value* from the named panel. The clusters were
tight across all six panels — the numbers below are the middle of each cluster, not an outlier.

### Surface (the parchment field and its shading)

| Role | Sampled hex | From (coverage) | Notes | Proposed dark-translation |
|---|---|---|---|---|
| `parchment` — the field | `#e7d19c` | river-surges (38%) | the paper itself; L≈0.75, warm | `#241d12` umber field |
| `parchment-lit` — highlights | `#f2e7c8` | keeper (8.6%) | lit vellum, top of the page | `#33291a` raised umber |
| `parchment-aged` — shaded paper | `#cdb88c` | river/heart/keeper (~6%) | the paper in shadow, section edges | `#463a24` line/edge |
| `parchment-shadow` — deepest tan | `#a89368` | **all six** (~10%) | most reliable cross-panel colour; the aged shadow band | `#5a4a2e` deep edge |

### Text (the lettering)

| Role | Sampled hex | From (coverage) | Notes | Proposed dark-translation |
|---|---|---|---|---|
| `ink` — headers & figures | `#2e2520` | river (5%) | near-black warm brown; the panel's lettering | `#e7d19c` (parchment — invert to light-on-dark) |
| `ink-soft` — body | `#5b4e2d` | keeper/spread (~4%) | softer brown for secondary text | `#c8b78f` (muted parchment body) |

### Accent (bands, ornament, presence, innate headers)

| Role | Sampled hex | From (coverage) | Notes | Proposed dark-translation |
|---|---|---|---|---|
| `band-tan` — section bands | `#d2b068` | river (6.9%) | the golden divider bands; L≈0.62 S≈0.55 | `#d2b068` (holds on dark) |
| `gold` — ornament / icons | `#eecb73` | bringer/keeper/heart (~11%) | bright ceremonial gold; growth icons | `#eecb73` (holds on dark) |
| `presence-green` — track | `#239850` | a-spread (3.2%) | the presence-track green | `#3fae6a` (brightened for dark) |
| `presence-green-deep` — ring | `#1e572b` | a-spread (8.7%) | dark forest green, node rims | `#1e572b` (holds) |
| `innate-rust` — power headers | `#a4562f` | lightning (3.5%) | terracotta of innate-power headers | `#c56a3a` (brightened) |

**Not core chrome — spirit-specific element accents** (sampled, recorded so the round doesn't
mistake them for panel identity): night-blues `#3062aa`/`#1f2f52` (bringer), water teals
`#205b64`/`#2a999c`/`#a1d4d2` (river). These follow the *spirit*, not the *panel*; the retheme
must not bake them into the surface.

## Node anatomy — the presence-track node, as CSS

What makes a printed presence-track node read as one, expressed as CSS-achievable properties (no
image assets):

- **Shape:** a circle — `border-radius: 50%`, fixed diameter (~40px desktop, ~34px at 375px).
- **Stone edge:** a ring in the deep green/brown — `border: 2px solid` in `presence-green-deep`
  (`#1e572b`) or `ink-soft`; a faint recessed feel from `box-shadow: inset 0 1px 3px rgba(0,0,0,.35)`.
- **Fill vs empty:** a *filled* node carries the value (fill colour = `band-tan`/`gold`, or
  `presence-green` for the track idiom); an *empty*/track slot is `parchment-aged` with the ring
  only. This is the light/dark contrast the printed track uses to show progression.
- **Figure weight:** the number sits centred in `ink`, in the display face (Mouse Memoirs),
  sized so a two-digit-safe glyph (the transcribed 6s) never clips the circle.

The node idiom is the reusable ingredient; the OCFDU widget may render five nodes (one per axis)
instead of #23's bars, each node's fill = `rating/5` mapped onto the token colours, the figure
telling the truth over it.

## Type hierarchy — panel ranking on the shipped faces

The panel ranks three tiers; mapped onto the app's shipped OFL faces (Mouse Memoirs display,
Reem Kufi body — **no new fonts**):

| Panel element | Panel treatment | App rendering |
|---|---|---|
| Section headers (GROWTH / PRESENCE / INNATE POWERS) | uppercase, wide-tracked, centred on a tan band, ink brown | **Mouse Memoirs**, `text-transform: uppercase`, `letter-spacing: 0.12–0.16em`, colour `ink` |
| Figures (track numbers, costs) | large, heavy, ink brown | **Mouse Memoirs**, larger size, colour `ink` |
| Body / rules text | regular weight, ink-soft brown | **Reem Kufi**, colour `ink-soft` |

## Fidelity guard — what NOT to copy (inherited by the round)

**Vibe, not replica.** Borrow only the palette, the node idiom, and the type ranking above. Do
**not** reproduce:

- the panel's **ornate chrome** — carved/wooden frame, corner flourishes, embossed borders;
- the panel's **layout structure** — the three-column growth/presence/innate arrangement;
- any **border filigree, drop-shadow embossing, or texture** meant to mimic printed relief.

Trade-dress status is unknown (`.scratch/phase-4/official-assets-research.md`) and the next
edition obsoletes the printed look — so the retheme evokes a panel, it does not counterfeit one.
