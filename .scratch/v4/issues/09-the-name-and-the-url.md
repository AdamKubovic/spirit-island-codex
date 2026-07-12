# 09 — The name and the URL

Status: ready-for-human
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
