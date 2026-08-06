import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/spirit-island-codex/',
  plugins: [
    react(),
    VitePWA({
      // ADR 0015: full precache, silent auto-update, disabled in dev.
      registerType: 'autoUpdate',
      injectRegister: null,
      devOptions: { enabled: false },
      workbox: {
        // Largest panel is ~968 KB; Workbox's 2 MB default would already cover it, but the asset
        // library grows, so this is set explicitly rather than left to the default.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,json,svg,webp,png,jpg,jpeg,woff,woff2,ttf}'],
      },
      manifest: {
        name: 'Spirit Island Codex',
        short_name: 'SI Codex',
        start_url: '/spirit-island-codex/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#1c160e',
        theme_color: '#1c160e',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
