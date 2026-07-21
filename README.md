# Spirit Island Knowledge Base

Local-first Vite + React + TypeScript app for browsing and recommending Spirit Island
spirits. See `CONTEXT.md` for the domain glossary, `docs/adr/` for design decisions, and
`.scratch/v2/PRD.md` for the shipped project's rationale.

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
