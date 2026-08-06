# AGENTS.md — working in this repo

This file is the single agent-facing guide for this repo. It tells you what the project is, how to
work in it, and the non-negotiable rules. If you are a human, start with `README.md` instead.

## What the project is

Spirit Island Codex is a local-first web app (Vite + React + TypeScript) for browsing and
recommending Spirit Island spirits and cards. It runs entirely in the browser — no backend, no
accounts, no API keys — and deploys as a static site to GitHub Pages.

The unit of recommendation is a **configuration**: a base spirit, or that spirit with exactly one
aspect applied. 37 spirits + 31 aspects = 68 configurations.

The shipped app has Browse, Recommend, Archive, Dashboard, Tier list, Log, and Settings.

## First read

Start with these, in order:

1. **`CONTEXT.md`** — the domain glossary, the project's ubiquitous language. Use its vocabulary.
2. **`docs/adr/`** — the architecture decision records (0001–0017). Read the ones touching the area
   you work in; ADR 0003 is the most important.
3. **`README.md`** — the human-facing overview of the app.

`docs/agents/` holds maintainer-internal workflow docs (issue tracker, triage labels, domain-docs
conventions). It is written for the owner's own skill workflow, not for a fresh contributor.

## The house rule: provenance

This repo has a documented failure mode: agents invent data when a source cannot answer. It has
shipped fabricated OCFDU ratings, wrong elements, and five aspects that do not exist. The rules
below are non-negotiable and apply to every dataset in `src/data/`.

1. **A field a source cannot answer is absent, never estimated.** Absent is a legal, expected,
   common state — never null, never a default, never the middle band, never inherited. A partial
   record is never padded to look complete.
2. **Provenance lives on the data, distinguishing fact from judgment.** A value read from print is a
   fact; a value that is someone's read is judgment, and it says so *in the data*, not just in a
   comment: `ratingsSource: "estimate"`, `shiftsToward`, `tagsSource: "judgment"`,
   `impactSource`/`valenceSource: "judgment"`, `source: "wiki+tts"`.
3. **Every new or changed dataset ships with a canon tripwire test.** A deliberate duplication of
   the dataset's expected shape and counts that fails loudly on drift — `aspectCanon`,
   `adversaryCanon`, `cardCanon`, `scenarioCanon`, etc.
4. **Ambiguity escalates to the owner; it is never resolved by guessing.** When a source is
   genuinely unclear, stop and ask.

ADR 0003 records this discipline. It exists because the repo has shipped fabricated data before, and
these rules are what stop it recurring.

## Commands

```sh
npm install        # install dependencies
npm run dev        # Vite dev server
npm test           # vitest run (the canon tripwire suite)
npm run build      # tsc -b && vite build && node scripts/check-precache.mjs
npm run lint       # oxlint
npm run deploy     # dispatch the GitHub Pages workflow for pushed HEAD and wait
```

## Repository map

| Path | What lives there |
|---|---|
| `src/domain/` | Pure logic: scoring, filtering, stores, datasets' types |
| `src/data/` | The hand- and machine-maintained datasets (spirits, cards, tier lists, …) |
| `src/components/` | React UI — glue over the domain layer |
| `CONTEXT.md` | The domain glossary (the project's ubiquitous language) |
| `docs/adr/` | Architecture Decision Records |
| `docs/agents/` | Maintainer-internal workflow docs (owner's skills) |
| `AGENTS.md` | This file |

## Do not commit `.scratch/`

`.scratch/<effort>/` is the owner's local working directory for per-effort specs, wayfinder maps,
screenshots, transcripts and one-off check scripts. It is **gitignored and never committed**. A
fresh clone does not have it; nothing in the committed docs points at it. Effort docs are local-only
and recoverable from git history where they were once committed. Do not create committed files under
`.scratch/` and do not write effort docs anywhere that would be committed.

## Maintainer workflow

The owner's engineering skills (issue tracker, triage labels, domain docs) have their own
conventions, documented under `docs/agents/`. If you are the owner using those skills, follow
`docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, and `docs/agents/domain.md`. The
issue tracker itself lives in a gitignored, local-only `.scratch/` — never commit tickets or PRDs.
