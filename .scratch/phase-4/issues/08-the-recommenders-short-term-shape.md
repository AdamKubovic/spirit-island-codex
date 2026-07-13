# 08 — The recommender's short-term shape

Status: done
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

**Resolution (2026-07-13, grilled with the owner):**

Fact finds that reframed the ticket: the recommender is not an empty shell — a **10-question
wizard** (`questionnaire.ts`) already feeds real, distinct ranking weights
(`answersToWeights.ts`), including an experience question. And the player-count input's only
honest effect is a **note-relevance badge** (`noteRelevance.ts`) — `recommend.ts` never reads it.

1. **The player-count input is stripped entirely** — wizard and sidebar inputs removed, the
   badge logic (`noteRelevance.ts`, `isRelevantToPlayerCount`) deleted with it; the note's own
   text ("strong solo") already carries the signal. The wizard opens on its first real question
   — the notes' Option A, applied precisely.
2. **Standing constraint, recorded for future maps:** player count cannot be wired into the
   *ranking* until sourced per-player-count data exists. Every candidate source is solo or
   unstated (why v5 #01 removed the tier player-count filter); wiring it today = fabrication,
   the repo's cardinal sin.
3. **The questionnaire holds at 10 questions — no gamer/non-gamer branching.** The spec carries
   a **copy pass** instead: every prompt and option answerable by someone who has never played.
   Branching would grow question-authoring and weight-design inside the surface this phase
   deliberately scopes down, one edge away from the out-of-scope AI recommender.
4. **Ripples for [#09](09-assemble-the-phase-4-spec.md):** the Settings "recommendation prefs"
   slot ([#02](02-the-settings-tab.md)'s open door) stays **empty** this phase; the homepage's
   "Not sure what to play?" door ([#01](01-the-homepage.md)) stays accurate unchanged.
