# theming-spread — two visual-consistency threads, both now closed

Status: done

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
  **`done` (2026-07-27).** Owner scoped it to the tier board *and* the Archive. Scoping split the
  two: the **Archive rows already had it** (`legibility-pass` #05 added the `.expansion-chip` pill
  after #21's audit, so the ticket's "neither shows it today" had gone stale), leaving the **tier
  board** as the real change — a 4px left-edge stripe on spirit and card tiles, colour from the
  existing single-source mapping, no new palette. Archive *tile/grid* views were deliberately left
  alone: `archive-grouping` #01 decided "tiles show art, clean," and reversing that is the owner's
  call, not this ticket's. Judgment calls, the aspect-vs-spirit expansion question and a measured
  contrast fix are recorded in the ticket's Comments; screenshots in `screenshots-02/`.

**Lesson for whoever files the next backlog note:** before recording a thread as deferred, check
whether a later effort already picked it up. Chase the *forward* links — panel-theming's own MAP
had already been updated with "**Now charted:** island-retheme" under Out of scope, so the
duplication was visible at filing time.
