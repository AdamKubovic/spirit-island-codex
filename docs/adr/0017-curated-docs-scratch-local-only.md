# 0017 — Curated, self-contained docs; `.scratch/` is local-only

Status: accepted
Date: 2026-08-07

## Context

The repo went public and the app deployed (ADR 0016), but the committed documentation still carried
the full archaeology of a long agent-driven build: 30 `.scratch/` effort directories plus one-off
check scripts (~106 MB on disk, 604 tracked files) of PRDs, screenshots, transcripts and research
notes — most of which no longer serves anyone deploying or using the app. A fresh clone pulled in
all of it, and the agent-facing docs (`CLAUDE.md`, `docs/agents/`) were written for the owner's own
skill workflow, not for a fresh contributor.

## Decision

The repo ships a curated, self-contained documentation set, and `.scratch/` stays off the repo:

- **`AGENTS.md` is the single agent-facing guide**: what the project is, the first reads
  (`CONTEXT.md` glossary, `docs/adr/` decisions, `README.md` overview), the provenance house rule,
  the commands, a repo map, and the "do not commit `.scratch/`" rule. `CLAUDE.md` is reduced to a
  thin pointer to it.
- **`.scratch/` is gitignored and untracked.** Local copies stay untouched — the owner is the sole
  developer, and the effort history stays on disk for recovery. Effort docs are local-only going
  forward; a fresh clone does not have `.scratch/`. No committed doc links into it as material a
  reader can follow; the only surviving references are historical-provenance citations (older ADRs,
  and this ADR's own References), each explicitly marked as local-only.
- **`README.md` is the human overview** — one audience per doc, no duplication with `AGENTS.md`. It
  no longer maps or links `.scratch/` paths; the deploy-diagnosis link is replaced by a one-line
  caveat.
- **`docs/agents/` stays committed** as maintainer-internal workflow docs, referenced from
  `AGENTS.md` and marked as such. `issue-tracker.md` records that the tracker lives in a gitignored,
  local-only `.scratch/`.
- **All 16 earlier ADRs stay committed, and their `.scratch` citations remain as historical
  provenance.** Those paths are local-only working notes; where a citation survives, it is a record
  of where a decision was reached, not a pointer a fresh clone can follow. Recoverable from git
  history where once committed.

## Consequences

- A person or agent who pulls the repo fresh gets a small, accurate doc set with a clear
  entry point. The only `.scratch/` references that survive are marked historical provenance, never
  pointers a reader is expected to follow.
- The provenance discipline survives verbatim: it moves from `CLAUDE.md` into `AGENTS.md`
  (ADR 0003, ADR 0006 and `images/manifest.json` are untouched).
- The owner keeps the full working history locally, and future effort dirs created by the owner's
  skills can never accidentally be committed.
- Reverting to shipping archaeology means deleting `AGENTS.md`'s posture — reopening this ADR.

## References

- `.scratch/docs-curation/PRD.md` — full problem statement, user stories, and the implementation
  decisions this ADR summarises (local-only, recoverable from git history).
