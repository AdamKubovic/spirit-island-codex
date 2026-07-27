# Pages deploy never fires on push — every deploy so far was a manual dispatch

Status: done (fixed 2026-07-27 by renaming the workflow file — see Resolution at the bottom)

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

## Second diagnostic pass (2026-07-27)

Everything checkable from a non-org-admin token is correct, which narrows this considerably:

| Check | Result |
|---|---|
| `repos/…` `default_branch` | `main` — matches the `branches: [main]` filter |
| `fork` / `private` / `archived` | all `false` (public, so Actions minutes are free — not a billing block) |
| `actions/workflows` | one workflow, **`state=active`**, `path=.github/workflows/deploy.yml` |
| `repos/…/rulesets` | `[]` — nothing filtering the event |
| `repos/…/actions/permissions` | `enabled:true`, `allowed_actions:"all"` |
| `repos/…/events` | GitHub **did** record `PushEvent` on `refs/heads/main` for every push |
| `PushEvent` actor | `AdamKubovic`, a real `User` (not a bot/app token, which *would* suppress runs) |
| `workflows/…/runs?event=push` | **`total_count: 0`** against `total_count: 3` overall |
| Raw `deploy.yml` bytes on `main` | `name: …\n\non:\n  push:\n    branches: [main]\n  workflow_dispatch:` — no BOM, correct nesting, `on` parses as a mapping |

So the trigger is declared correctly, on the right branch, in an active workflow, and GitHub saw the
pushes from a human account — yet created zero push-triggered runs.

**The one thing not inspectable from here:** the organization's Actions policy.
`gh api orgs/Tabletop-Atlas/actions/permissions` returns **403** ("You must be an org admin…";
needs the `admin:org` scope, which the current token lacks — it has `repo`, `read:org`,
`admin:public_key`, `delete_repo`, `gist`). An org policy that permits `workflow_dispatch` while
filtering `push` would explain every observation above.

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

## Reproduced in isolation (2026-07-27)

Ran the experiment this ticket asked for — a single commit pushed to `main`, then watched:

```
runs before push: 3
  acb0d1b..95035b0  main -> main
  t+10s  push-runs=0  total-runs=3
  …
  t+90s  push-runs=0  total-runs=3
```

Ninety seconds, zero new runs. Not a delay, not a one-off: the `push` event does not start this
workflow. Combined with the table above (every repo-level setting correct, `PushEvent` recorded from
a human account), the fault is **not in this repository's configuration**.

## What was fixed, and what wasn't

**Not fixed: the trigger itself.** The only remaining suspect is the organisation's Actions policy,
and reading it needs the `admin:org` scope. The account *is* an org admin
(`user/memberships/orgs/Tabletop-Atlas` → `role: admin`, `state: active`), so this is purely a token
scope, not a permissions problem — but refreshing it is an interactive browser flow that can't be
done unattended:

```sh
gh auth refresh -h github.com -s admin:org
```

With that scope, the checks to run are `gh api orgs/Tabletop-Atlas/actions/permissions` and
`…/actions/permissions/repositories` (is this repo in a "selected repositories" allowlist that
happens to exclude it?), plus the web UI at **Organisation → Settings → Actions → General**, which
exposes policy the REST API doesn't.

**Fixed: the silent failure.** `README.md` claimed "every push to `main` deploys automatically",
which was false from the day the workflow landed — the docs actively misled anyone who trusted them.
Now the README states the real situation, links here, and points at a script:

```sh
npm run deploy   # scripts/deploy.sh
```

It dispatches the workflow for the *pushed* `HEAD`, polls for the run matching that exact SHA (rather
than grabbing the newest run, which could be someone else's), and waits on `gh run watch
--exit-status`, so a deploy either succeeds visibly or fails loudly. It refuses to run on a dirty
tree or when `HEAD != origin/main`, because the workflow builds the remote's commit — deploying
local-only work would publish something nobody else can see. Both refusal paths were exercised, not
just written:

```
error: working tree is dirty — commit or stash before deploying
error: HEAD (9b87221) != origin/main (ec76d54)
       push first — the workflow builds what's on the remote, not what's local.
```

This is a **stopgap**. Delete `scripts/deploy.sh`, the `deploy` npm script and the README warning
once `on: push` fires; the workflow itself was never the problem.

## Resolution (2026-07-27) — a stuck workflow registration, fixed by renaming the file

The owner granted the `admin:org` scope, which unblocked the last untested hypothesis. **It was
wrong.** The organisation's Actions policy is entirely permissive:

```
$ gh api orgs/Tabletop-Atlas/actions/permissions
{"enabled_repositories":"all","allowed_actions":"all","sha_pinning_required":false}
```

Org-level rulesets could not have been the cause either — they are a paid feature and this org is
on Free (`gh api orgs/Tabletop-Atlas/rulesets` → 403 "Upgrade to GitHub Team"). With that, every
hypothesis in this ticket was eliminated: org policy clean, repo public and not fork/archived/
disabled, default branch `main`, Actions enabled, the full workflow file valid with no `paths`
filter or duplicate `on:` key, and GitHub recording a `PushEvent` on `refs/heads/main` from a real
user account for every push — against `total_count: 0` push-triggered runs.

So the configuration was provably correct and GitHub still would not fire. That is a stuck trigger
registration on GitHub's side. Two remedies, in order of escalation:

1. **Disable and re-enable the workflow** (`gh workflow disable/enable deploy.yml`). Tried first
   because it changes nothing in the repo. Pushed an empty commit (`a655b55`) and watched for 90
   seconds: **still zero runs.** Did not work.
2. **Rename the workflow file**, forcing GitHub to register a brand-new workflow record.
   `deploy.yml` → `pages.yml` (`671a487`). The push-triggered run appeared **within 15 seconds**
   and completed successfully:

   ```
   push  671a487  completed/success  Deploy to GitHub Pages
   ```

`scripts/deploy.sh` was updated to dispatch `pages.yml`. The workflow's *contents* were never
touched — the file is byte-identical apart from its name, which is the clearest evidence that the
fault was registration, not configuration.

### What this means for the stopgap

`scripts/deploy.sh` and the `npm run deploy` script are **kept**, with their justification changed.
They are no longer a workaround for a broken trigger; they are the way to publish without a push
and to watch a deploy to completion with a non-zero exit on failure. The README warning that
pushing does not deploy is gone, because it no longer does.

### Caveat worth remembering

The trigger is confirmed working across three consecutive pushes. If it ever silently stops again,
the diagnosis above is mostly reusable — but start at the rename, since that is what actually
worked, and a stuck registration leaves every inspectable setting looking correct.
