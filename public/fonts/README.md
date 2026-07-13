# Self-hosted fonts (phase-4 #22)

All fonts here are SIL Open Font License 1.1 — each family ships with its `OFL.txt` verbatim
from source. Downloaded 2026-07-13 from the google/fonts repository (`ofl/` tree = OFL-licensed
families), per the licensing research in `.scratch/phase-4/official-assets-research.md`:
commercial and app-forbidding lookalikes (Fling-a-Ling, DK Snemand, Gobold) were declined; only
OFL faces ship. Local-first app: no font CDN, no network font requests.

| Family | File | Role | Source |
|---|---|---|---|
| Reem Kufi | `reem-kufi/ReemKufi-Variable.ttf` | body (reportedly the game's actual body font) | https://github.com/google/fonts/tree/main/ofl/reemkufi |
| Mouse Memoirs | `mouse-memoirs/MouseMemoirs-Regular.ttf` | display candidate (#22 round) | https://github.com/google/fonts/tree/main/ofl/mousememoirs |
| Josefin Sans | `josefin-sans/JosefinSans-Variable.ttf` | display candidate (#22 round) | https://github.com/google/fonts/tree/main/ofl/josefinsans |
| Lato (Bold) | `lato/Lato-Bold.ttf` | display candidate (#22 round) | https://github.com/google/fonts/tree/main/ofl/lato |

License verification note: Reem Kufi's `OFL.txt` states Reserved Font Name **"Josefin Sans"** —
an upstream oddity, cross-checked 2026-07-13 against the font's canonical project
(https://github.com/aliftype/reem-kufi, same text on `main` and `master`), so it is the
project's own published license file, shipped verbatim, not a download error. The license is
SIL OFL 1.1 either way. Reserved-name terms are honoured: no font is renamed (the variable-font
FILES are renamed `[wght]` → `-Variable` for URL safety only; internal font names untouched).

When #22's round closes, the losing display candidates' directories are deleted.
