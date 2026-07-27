# theming-spread — one remaining visual-consistency thread

Status: backlog

Filed 2026-07-23 as two threads raised and deliberately deferred during earlier efforts rather
than scoped and built. **One of the two turned out to be already delivered.** See `issues/` for
each; `grep '^Status:' issues/*.md` is the authoritative view.

- [01 panel theme spread](issues/01-panel-theme-spread.md) — **`done`, closed as
  already-delivered (2026-07-27).** A stale duplicate of [`island-retheme`](../island-retheme/MAP.md),
  which was chartered 2026-07-17 as *exactly* the spread effort panel-theming #04 deferred to, and
  whose app-wide rollout closed 2026-07-21 — two days before this directory was filed. Its three
  named surfaces (shell, Browse, tier board) are token-driven with the panel palette today; the
  owner's variant pick (theme **B**) is already live. No code was owed. The ticket's Comments record
  the full chain and the in-tree verification.
- [02 expansion colour on more surfaces](issues/02-expansion-colour-more-surfaces.md) —
  **still `needs-triage`.** Genuinely open, and untouched by `island-retheme`: that effort swept
  *chrome* onto `--deck-*` tokens and deliberately left `EXPANSION_COLOR` alone as a locked
  semantic system. Needs an owner conversation to name which surfaces gain expansion colour (tier
  board, Archive, both) before it's `ready-for-agent`. Once scoped it's expected to be small —
  extend consumption of the existing single-source mapping, no new palette work.

**Lesson for whoever files the next backlog note:** before recording a thread as deferred, check
whether a later effort already picked it up. Chase the *forward* links — panel-theming's own MAP
had already been updated with "**Now charted:** island-retheme" under Out of scope, so the
duplication was visible at filing time.
