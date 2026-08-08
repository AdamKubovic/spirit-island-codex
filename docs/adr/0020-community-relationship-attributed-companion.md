# 0020 — Community relationship: an attributed companion, not a replacement

Status: accepted
Date: 2026-08-08

## Context

ADR 0016 settled the legal posture (publish, disclaim, comply) but not the relationship with the
community that supplies the app's content. The wiki admin's "State of the Wiki" post (2026-08-07)
showed the community's patience with AI is thin — crawlers were eating the wiki's hosting
bandwidth and were blocked — and the owner worried the app would be read as an AI-slop thief: a
scraped, competing product built on the wiki's community labour, with that reputation sticking to
a personal, publicly-facing name. Transferring the repo to an anonymous org was considered and
rejected in discussion: an org move was already tried on 2026-08-06 and reverted because git
history still tied authorship to the owner's name, and an anonymous repo full of GtG's copyrighted
art reads more suspicious than a named fan who credits everything. Grilled 2026-08-08, owner
ratified.

## Decision

- **Stay named.** The repo remains under the owner's personal account. The defence against a
  slop reading is the artifact itself — canon tripwires, provenance fields, the no-LLM runtime —
  plus the relationships below, not anonymity.
- **Attributed companion, not replacement.** The wiki remains the reference; Codex adds what the
  wiki does not (recommendation, judgment, draw odds). In-app link-outs send traffic back to the
  wiki wherever content came from it: spirit detail, card detail, archive galleries, glossary, and
  a footer sources line. The one-liner: *the wiki tells you what a spirit does; Codex tells you
  which one you'll enjoy — and sends you back to the wiki for the what.*
- **Dual licensing.** The repo gains a dual license mirroring its sources: MIT for code (like
  SICK's Apache-2.0/MIT), CC BY-NC-SA 4.0 for data and assets (the wiki's license).
- **Reach out before announcing.** The wiki admin (lynkfox) is contacted before any public post:
  what the tool is, exactly what it sources from the wiki, how it credits, and a question — does
  anything conflict, is the attribution sufficient.
- **Lead with the debt.** The r/spiritisland announcement (ADR 0016's narrow promotion) opens
  with the community debt — built from community sources, credited per asset, wiki remains the
  reference — before the differentiators.
- **AI disclosure.** Nothing is said about the build; the runtime claim ("no LLM, deterministic
  domain layer") stays prominent and honest.

## Consequences

- The announcement now has sequencing where ADR 0016 had none: admin contact must precede the
  post, and the post can truthfully say the admin knows and approves.
- Any drift toward replacement framing — features that duplicate the wiki instead of linking to
  it, or a license change toward all-rights-reserved — reopens this ADR.
- The link-outs and license pair are visible in the repo and app, so a future reader can verify
  the companion stance without reading this file.
