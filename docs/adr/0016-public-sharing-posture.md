# 0016 — Public sharing posture: publish, disclaim, comply

Status: accepted
Date: 2026-08-06

## Context

The owner wanted to share the app publicly on Reddit but worried about reproducing Spirit Island
copyrighted content (card text, artwork) as a non-commercial, EU-based fan project. Research
(`.scratch/sharing-effort/README.md`) found no GtG fan-content policy, but the official FAQ's
"Creating your own game elements" section carries the publisher's position: "Do what you like, so
long it doesn't involve: charging money for it; portraying it as an official Spirit Island product;
posting it on the official greaterthangames.com forums." The repo was private; the site was not yet
published. The owner emailed GtG and received no reply.

## Decision

- **Publish.** The repo goes public and the app ships on GitHub Pages. Source, assets, and git
  history are accepted as exposed; the 1.6GB `images/` originals remain git-ignored. Nothing was
  removed on copyright grounds.
- **Disclaim and attribute.** The app already disclaims "unofficial, fan-made, non-commercial … not
  affiliated with the Spirit Island rights holders" and cites every tier list via a "ⓘ Source"
  disclosure (ADR 0001). The footer additionally links the official game page and the FAQ's
  "Creating your own game elements" terms, and credits the tier-list authors.
- **Comply.** On any DMCA notice, C&D, or rights-holder request: take the content down immediately,
  file no counter-notice. (A counter-notice would consent to US federal jurisdiction and risk
  escalation of the *Tetris v. Xio* kind.)
- **Promote narrowly.** One r/spiritisland post as a community resource seeking feedback; do not
  mention the unanswered GtG outreach.

## Consequences

- The strongest legal shield is the publisher's own written position, captured verbatim in
  `.scratch/sharing-effort/README.md`. This remains an inference for *reproducing existing*
  content (the FAQ governs *creating your own* elements), backed by the tolerance precedent of SICK,
  the GtG-permitted TTS mod, and ArkhamDB/Scryfall/Dominion Strategy Wiki.
- Realistic worst case is a takedown, not a suit — and the response to it is pre-committed.
- Reversing "comply immediately" or "keep the repo public" means reopening this ADR; deleting the
  repo or a hosted copy is always available but does not recall already-forked content.
