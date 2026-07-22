# element-demand — the Dashboard's Minor/Major view, conditioned on the spirit

Replaces the UpSet plot on the Dashboard's Minor/Major segments with a spirit-conditioned
element demand/supply block.

**Why**: the power decks are near-uniformly balanced across elements (38–39 of 101 minors per
element; all 28 element pairs present, 10–14 each), so every deck-wide element aggregate the tab
rendered was flat. The UpSet showed 76 element sets whose tallest column was 3 — sampling noise
drawn as structure. Everything that varies is conditional on a specific spirit. Measured, not
assumed: see **ADR 0013**, which also carries the standing instruction not to rebuild a deck-wide
element chart.

Vocabulary: **element demand / supply** in `CONTEXT.md`.

Scope: Minor/Major segments only. Fear and Event are untouched — their distributions are genuinely
uneven and need no conditioning.

`issues/` — `grep '^Status:' issues/*.md` is the authoritative view. Two tickets: **01 (domain)
blocks 02 (view)**. The Counts/% toggle removal rides in 02 rather than standing alone, because it
touches the same `DashboardTab` lines.
