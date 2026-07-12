# 09 — The name and the URL

Status: done
Type: wayfinder:task (HITL — only the owner can do the GitHub half)
Parent: [v4 map](../MAP.md)

## Question

The site is served from `adamkubovic.github.io/spirit-island/`. The owner wants his name out of the
URL, and the app renamed now that it's more than a recommender.

## The constraint, stated plainly

A GitHub Pages **project** site is always `<owner>.github.io/<repo>`. There is no setting that
removes the owner segment. There are exactly two ways out, and the owner **chose the first**
(2026-07-12):

1. **A free GitHub organisation.** Create an org (e.g. `spirit-island-kb`), transfer the repo to it,
   and name the repo `spirit-island-kb.github.io` — a *user/org* site, served from the root:
   `https://spirit-island-kb.github.io/`. Free, no renewal, name gone.
2. A custom domain — **ruled out**, costs money.

## The checklist

The owner does the GitHub half (an agent cannot create an org or transfer a repo):

1. Create the org. Pick the final name here — it becomes the URL and it's annoying to change later.
2. Transfer `AdamKubovic/spirit-island` to it. GitHub redirects the old URLs, so nothing breaks
   immediately.
3. Rename the repo to `<org>.github.io`.
4. Re-enable Pages on the transferred repo (settings do not always survive a transfer) and confirm
   the `deploy.yml` workflow still has permission to publish.

Then the agent half:

5. **`vite.config.ts` currently sets `base: '/spirit-island/'`.** A root-served org site needs
   `base: '/'`. Every asset path in the app breaks if this is missed — and it breaks *only* in the
   deployed build, not in dev, which is the worst way to find out. Verify against the real deployed
   site, not localhost.
6. Update `git remote`, the app's `<title>`, and the header text to the new name.
7. Grep the repo for the old URL — README, docs, manifest, anything that hard-codes it.

## What this ticket produces

The new name (owner's call, recorded in `## Comments`) and a working deploy at the new URL, with the
old one redirecting.

## Comments

**Owner's chosen name (2026-07-12): `Tabletop-Atlas`.** Deliberately generic, not Spirit-Island-
specific — the owner's stated plan is to expand this app to other board games (Dune Imperium,
Terraforming Mars mentioned) under the same umbrella, so a game-specific org name would have painted
the URL into a corner. Checked availability (unclaimed at decision time) before committing; picked
over `spirit-island-kb` and three other candidates.

**One rename false start, recorded because it's a real gotcha:** the org was created and the repo
transferred cleanly (GitHub's repo-transfer redirect worked immediately), but the first rename only
produced `tabletop-atlas`, not `tabletop-atlas.github.io`. GitHub Pages' root-site behavior is keyed
on that exact literal repo name — `<owner-login>.github.io`, full stop — not on Pages settings, not
on the workflow, not automatically appended when Pages builds. A repo named anything else, even
`tabletop-atlas`, always gets project-site behavior (subpath), regardless of whether Pages is
enabled. Second rename to the exact `.github.io` suffix fixed it.

**Agent half, done once the rename landed:**
- `vite.config.ts`: `base: '/spirit-island/'` → `base: '/'`
- `index.html` `<title>` and `README.md`'s heading: "Spirit Island Spirit Recommender" →
  "Spirit Island Knowledge Base" (PRD story 32 — the app itself is still Spirit-Island-only content;
  no "Tabletop Atlas" branding injected into the app yet since multi-game content doesn't exist —
  that's a real decision for whenever a second game actually gets built, not implied by the org name)
- `git remote` updated to `git@github.com:Tabletop-Atlas/tabletop-atlas.github.io.git`
- Grepped the repo for `adamkubovic.github.io` / `AdamKubovic/spirit-island` outside `.scratch/` —
  no hits. `.scratch/`'s historical references (PRDs, this ticket) were left as-is; they're a record
  of what was true when written, not live config.

**Verified against the real deployed site**, not localhost, per this ticket's own instruction:
`https://tabletop-atlas.github.io/` returns 200, title is correct, and JS/CSS/logo/favicon all
resolve from the root with no `/spirit-island/` prefix. Confirmed via the Actions run
(`gh run view`) that both the `build` and `deploy` jobs succeeded.

**Correction to this ticket's own "what it produces" line:** the old *repo* URL
(`github.com/AdamKubovic/spirit-island`) does redirect (301) as expected. The old **Pages** URL
(`adamkubovic.github.io/spirit-island/`) does **not** — it 404s. Pages sites don't inherit the
repo-transfer redirect; the old site was served from the previous owner's Pages namespace and simply
stops existing once the repo moves. Anyone with the old link gets a 404, not a redirect. Worth
knowing if the old URL was ever shared anywhere that can't be updated.
