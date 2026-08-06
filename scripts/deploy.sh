#!/usr/bin/env bash
# Deploy the current `main` to GitHub Pages, and wait to see whether it worked.
#
# Why this exists: the `on: push` trigger in `.github/workflows/deploy.yml` does not fire — every
# deploy this repo has ever had was a manual `workflow_dispatch`. See
# `.scratch/deploy-push-trigger/README.md` for the diagnosis. Until that's fixed, pushing to `main`
# does NOT publish the site, so this script makes the dispatch explicit rather than something you
# have to remember.
#
# Usage:  npm run deploy
#
# Delete this script once the push trigger works; it's a stopgap, not the design.

set -euo pipefail

WORKFLOW="pages.yml"
BRANCH="main"

command -v gh >/dev/null || { echo "error: the GitHub CLI (gh) is required" >&2; exit 1; }

# Deploying a commit that isn't pushed would publish something nobody else can see, so refuse.
if ! git diff --quiet HEAD || ! git diff --cached --quiet; then
  echo "error: working tree is dirty — commit or stash before deploying" >&2
  exit 1
fi
git fetch --quiet origin "$BRANCH"
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")
if [ "$LOCAL" != "$REMOTE" ]; then
  echo "error: HEAD ($(git rev-parse --short HEAD)) != origin/$BRANCH ($(git rev-parse --short "origin/$BRANCH"))" >&2
  echo "       push first — the workflow builds what's on the remote, not what's local." >&2
  exit 1
fi

echo "dispatching $WORKFLOW on $BRANCH ($(git rev-parse --short HEAD))…"
gh workflow run "$WORKFLOW" --ref "$BRANCH"

# `gh workflow run` returns before the run is queryable, so poll for the run on this exact SHA
# rather than blindly grabbing the newest one (which could be someone else's).
echo -n "waiting for the run to appear"
RUN_ID=""
for _ in $(seq 1 20); do
  sleep 3
  RUN_ID=$(gh run list --workflow="$WORKFLOW" --limit 10 \
    --json databaseId,headSha,status \
    --jq "[.[] | select(.headSha == \"$LOCAL\")] | first | .databaseId // empty")
  [ -n "$RUN_ID" ] && break
  echo -n "."
done
echo

if [ -z "$RUN_ID" ]; then
  echo "error: no run appeared for $LOCAL after 60s — check https://github.com/AdamKubovic/spirit-island-codex/actions" >&2
  exit 1
fi

gh run watch "$RUN_ID" --exit-status
echo
echo "deployed: https://adamkubovic.github.io/spirit-island-codex/"
