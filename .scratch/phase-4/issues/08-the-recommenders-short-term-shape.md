# 08 — The recommender's short-term shape

Status: needs-triage
Type: wayfinder:grilling (HITL)
Parent: [phase-4 map](../MAP.md)

## Blocked by

_(nothing)_

## Question

The player-count input currently affects nothing — a dishonest control, the exact smell v5 #01
hunted. Two ways out; pick one:

- **Option A — strip.** Remove the questionnaire down to a plain "start recommendation" button.
  Honest, small, done.
- **Option B — expand.** Grow the questionnaire using player data the frontend already has
  (e.g. a gamer / non-gamer fork with branching questions), serving the broad audience.

Constraints:

- **The AI composition-based recommender is out of scope** for this map (owner's explicit ruling).
  Option B must stay within data already in the frontend — spirit ratings, complexity, tags,
  collection. If the grilling drifts toward "the backend could...", it has left the map.
- The destination says "scoped-down recommender", which leans A — but B is the owner's own
  option; the grilling settles it, not the wording.
- If B: every question asked must visibly change the result (no new dishonest controls), and the
  session should sketch which existing data field answers each question.

Interaction: [#02](02-the-settings-tab.md) holds a "recommendation prefs" slot contingent on this
answer, and [#01](01-the-homepage.md)'s recommender entry point follows it. Record the answer;
[#09](09-assemble-the-phase-4-spec.md) reconciles.

## Comments
