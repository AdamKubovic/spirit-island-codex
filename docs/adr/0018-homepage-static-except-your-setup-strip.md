# 0018 — The homepage stays static except one live "Your setup" strip

Status: accepted
Date: 2026-08-07

## Context

The homepage has always been a fully static front door by design: count-free, feature-stable
copy that can never go stale (the "three doors" from `#13`). The ux-discoverability effort
redesigned it into a command deck — hero, an eight-tile grid covering every tab, and a "Make it
yours" trio — and added one thing that is not static: a slim live "Your setup" strip that reads
the collection and complexity-override stores and shows the visitor what they have customised.

That one strip is a small, honest exception: it is rendered only when the visitor has customised
(excluded expansions or complexity overrides exist), so a default visitor still sees a clean,
static front door. Its contents are read from the stores at render time, so they can never go
stale the way hardcoded copy could.

## Decision

- **The homepage stays mostly static.** Hero copy, the feature grid, the "Make it yours" trio,
  framing and footer are count-free and feature-stable, as before.
- **One live exception:** the "Your setup" strip renders when — and only when — the visitor has
  customised (collection exclusions or complexity overrides exist), and it reads those stores at
  render time. No counts or feature claims are hardcoded on the homepage.
- **Every feature tile is a real route**, not a second sitemap: the homepage's navigation prop
  now accepts any tab, matching how the rest of the app routes.

## Consequences

- A default visitor gets a clean static front door; a returning, customised visitor gets a
  one-line nudge to where their preferences live in Settings.
- The strip cannot go stale because it holds no hardcoded data — it is derived, and hidden when
  the source state is empty.
- Reverting this means reopening the ADR and removing the strip, or making the whole homepage
  live again.

## References

- `src/components/Homepage.tsx` — the command-deck homepage and the conditional strip.
- `.scratch/ux-discoverability/issues/01-redesigned-homepage.md` — the originating ticket
  (local-only, recoverable from git history).
