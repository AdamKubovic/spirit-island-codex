Status: done

# Backlog note: community upvote system

## Parent

`.scratch/card-tier-lists/PRD.md`

## What to build

A short backlog note recording an idea that was raised, examined, and deliberately deferred during
this effort's grilling — so it is not lost, and equally is not mistaken for chartered work.

The idea: visitors upvote the shipped tier lists, so the app can surface which ranking the
community finds most trustworthy.

Why it was cut, which is the part worth writing down:

- An upvote is only meaningful if votes come from distinguishable people. Without that, "most
  trusted list" measures who refreshes hardest.
- Distinguishable people means accounts. Accounts mean auth and per-user storage.
- The app is local-first and served from GitHub Pages — static assets only, no server, no database,
  no runtime. The runtime dependency list is `react` + `react-dom`.
- So this is gated on exactly the backend decision the existing login/sync backlog note already
  scopes. It is not a separate infrastructure question; it is a feature that arrives *after* that
  one is answered.

File it alongside the login/sync note and cross-reference the two in both directions, since neither
is actionable without the other. Match that note's shape and tone: status `backlog`, states the
constraint that forces the deferral, explicitly **not chartered, not ready to build**.

Also worth recording, briefly, the adjacent idea that was rejected on stronger grounds than
"needs a backend": letting visitors **upload their own tier lists**. That one conflicts with the
project's core discipline rather than merely its hosting. An uploaded list has no citation, no
methodology and no verifiable author; it would need a third `origin` value beyond `cited` and
`personal`, and none of the tripwire tests that make this repo's data trustworthy could hold a
stranger's JSON to anything. Note it as considered and declined, not as pending.

## Acceptance criteria

- [ ] A backlog note exists for the upvote system, marked `backlog` and explicitly not chartered
- [ ] It states the identity → accounts → backend dependency chain as the reason for deferral
- [ ] It cross-references the login/sync backlog note, and that note gains a pointer back
- [ ] It records the uploaded-community-lists idea as considered and declined, with the provenance
      reasoning rather than the hosting reasoning
- [ ] No application code, data, or test is modified

## Blocked by

- None — can start immediately
