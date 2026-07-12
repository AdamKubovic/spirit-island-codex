# 07 — What actually breaks at 375px

Status: ready-for-agent
Type: wayfinder:task (AFK)
Parent: [v4 map](../MAP.md)

## Question

The owner wants the app usable on a phone so his friends can open it. Before deciding a single fix:
go and look. Which parts of the app are actually broken at phone width, and how?

## Why this is a task and not a redesign

The owner chose **"responsive: nothing breaks"** over a phone-first rewrite. Desktop stays exactly as
it is. So the work is a list of breakages, not a new design — and the list has to come from driving
the real app, not from reading CSS and imagining.

## What to do

Drive the built app in a headless browser at **375×667** (and 390×844) through every surface:
questionnaire, recommender results, browser, tier board, tier editor, spirit detail modal, game log,
statistics, backup/import. For each, record: horizontal overflow, text under 12px, tap targets under
44px, controls that fall off-screen, modals that don't fit, tables that can't be read.

Screenshot each breakage. Note that v3 already verified `SpiritDetail`'s card modal at 375px, so
that one is expected to pass — if it doesn't, that's a regression worth flagging loudly.

## What this ticket produces

A findings list in `## Comments`, ordered worst-first, each with a screenshot. **No fixes.** The
fixes graduate out of the map's fog once the list exists — the nav shell in particular is likely to
need a real decision (`AppShell`'s tabs were designed for one big surface, and v4 adds a second), and
that decision is worth making with evidence rather than ahead of it.
