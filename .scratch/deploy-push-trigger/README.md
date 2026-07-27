# Pages deploy never fires on push — every deploy so far was a manual dispatch

Status: needs-triage

## Origin

Found while shipping `theming-spread` #02 and `spirit-link-new-tab` (2026-07-27). Pushed to `main`,
waited ~2.5 minutes for the Pages deploy, and no workflow run appeared at all. Both deploys that day
only reached the live site because they were dispatched by hand.

**Consequence: pushing to `main` does not currently publish the site.** Anyone assuming it does will
believe they've shipped something that is still only in git.

## The evidence

`.github/workflows/deploy.yml` declares the trigger:

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

Yet the repository's **entire** run history is three runs, and every one of them is
`workflow_dispatch` — there has never been a `push`-triggered run:

```
$ gh run list --limit 20 --json event,headSha,createdAt,conclusion
2026-07-27T18:02:56Z  workflow_dispatch  4d2fc0f  success
2026-07-27T06:23:56Z  workflow_dispatch  321681f  success
2026-07-26T08:49:19Z  workflow_dispatch  5f2d999  success
```

Those three SHAs were each pushed to `main` before being dispatched, and earlier commits
(`ae200ea`, `73b52e3`, `99a04ca`, `681a66e`, `14f83e4`, …) were pushed with no run of any kind. So
this is not a one-off delay: the push trigger has apparently never worked.

## What has been ruled out

- **Actions being disabled or restricted.** `gh api repos/…/actions/permissions` returns
  `{"enabled":true,"allowed_actions":"all","sha_pinning_required":false}`.
- **The workflow file being absent or new.** It has been on `main` since 2026-07-08
  (`git log -1 --format=%ad -- .github/workflows/deploy.yml`), well before these pushes.
- **Pages being misconfigured.** `gh api repos/…/pages` reports `"build_type":"workflow"`,
  `"source":{"branch":"main","path":"/"}` — and the dispatched runs do deploy successfully, so the
  publish half works.
- **The workflow failing.** All three runs succeeded; the site serves the pushed commits' assets
  (verified by matching the live CSS hash against the local `dist/`).

## Plausible causes, untested

- **A branch/ref mismatch.** Worth confirming the default branch really is `main` and that nothing
  (a ruleset, a branch protection, a `paths-ignore`) filters the event.
- **Pushes made with a token that suppresses workflow events.** GitHub deliberately does not trigger
  workflows for pushes authenticated with `GITHUB_TOKEN`; some app/PAT setups behave similarly.
  These pushes were over SSH from a local clone, which normally *does* trigger, so this is a guess.
- **An org-level Actions policy** on `Tabletop-Atlas` that permits `workflow_dispatch` but filters
  `push`. Not inspected — needs org-admin visibility.

## Suggested next step

Push a trivial no-op commit to `main` and watch `gh run list --watch` to confirm the behaviour
reproduces in isolation, then check the repo's **Settings → Actions** and **Settings → Rules** in the
web UI (the API surface above doesn't expose rulesets or org policy). If the trigger genuinely can't
be fixed, the honest fallback is to document "deploys are manual: `gh workflow run deploy.yml --ref
main`" in `README.md`, so nobody assumes a push published anything.

## Not in scope

Redesigning the deploy pipeline. The workflow itself is fine — it builds, tests, and deploys
correctly every time it actually runs.
