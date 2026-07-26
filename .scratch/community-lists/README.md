# community-lists — upvoting shipped tier lists (future)

Status: backlog

Raised while grilling the card tier lists effort (2026-07-26): visitors upvote the shipped tier
lists so the app can surface which ranking the community finds most trustworthy. Filed so the
idea isn't lost — **not chartered, not ready to build.**

## The constraint that forces this note

An upvote is only meaningful if votes come from distinguishable people. Without that, "most
trusted list" measures who refreshes hardest. The chain is:

distinguishable people → accounts → auth and per-user storage → a backend.

The app is local-first and served from GitHub Pages — static assets only, no server, no database,
no runtime; the runtime dependency list is `react` + `react-dom`. So this is not a separate
infrastructure question: it is a feature that arrives **after** the backend decision that
`.scratch/login-sync/README.md` already scopes. Charter that first, or this note stays parked.

## Considered and declined: letting visitors upload their own tier lists

Not deferred — **declined**, and on stronger grounds than "needs a backend".

The value of this repo's tier-list corpus is that every list is either `cited` (a named source, a
URL, a stated methodology, a pinned key set in `tierListCanon.test.ts`) or `personal` (the
owner's own, stored in their own browser). An uploaded stranger's list is neither. It has no
citation, no methodology and no verifiable author; it would need a third `origin` value, and none
of the tripwire tests that make this data trustworthy could hold it to anything. That conflicts
with the project's core discipline (CLAUDE.md, ADR 0003), not merely its hosting.

Upvoting *shipped, cited* lists does not have this problem — it ranks curated data rather than
admitting uncurated data.
