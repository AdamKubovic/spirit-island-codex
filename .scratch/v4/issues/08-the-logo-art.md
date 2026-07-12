# 08 — The logo art

Status: ready-for-agent
Type: wayfinder:task (AFK, with one HITL check)
Parent: [v4 map](../MAP.md)

## Question

The header's top-left is a text wordmark. The owner wants the **original Spirit Island logo art**
there. Find a real source for it and swap it in.

## The one thing that could make this hard

The archive has 616 assets and **not one of them is the logo** — it's cards, panels, adversaries,
scenarios. So this ticket has a retrieval half before it has a CSS half. Likely sources, in order:
the TTS mod JSON (which already gave 114 assets and may carry a box/banner image), the wiki, the
publisher's own press/media page. `.scratch/asset-archive/REFERENCE.md` holds the pacing and
user-agent rules that make those sources work — read it first.

**Get a real file.** Do not have a model draw an approximation of the logo, and do not settle for a
low-res screenshot scaled up. If no usable source turns up, say so in `## Comments` and stop — a
"close enough" logo is worse than the text one.

## What this ticket produces

- The logo as a committed asset in `public/`, added to `images/manifest.json` with its `source_url`,
  like every other asset in this repo.
- Swapped into the header, sized so it survives #07's 375px pass — a wide wordmark in a phone header
  is exactly the kind of thing that overflows.
- Rights: hosting risk is already accepted (2026-07-09). Do not reopen it.
