# Spirit Island Knowledge Base

Local-first Vite + React + TypeScript app for browsing and recommending Spirit Island
spirits. See `HANDOFF_spirit_island_recommender.md` and `.scratch/spirit-recommender/PRD.md`
for full project context.

## Development

```
npm install
npm run dev
npm test
npm run build
```

## Deployment

Pushes to `main` build the app and deploy `dist/` to GitHub Pages via
`.github/workflows/deploy.yml`. Served from the `Tabletop-Atlas` organisation's root Pages
site (`tabletop-atlas.github.io`), so `vite.config.ts` sets `base: '/'`.

**One-time human setup (the workflow cannot do this itself):** in the repo, go to
Settings → Pages → Source = "GitHub Actions". Once enabled, every push to `main` deploys
automatically.
