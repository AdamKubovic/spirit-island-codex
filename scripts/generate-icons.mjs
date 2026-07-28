// One-off (installable-app #03): generates the two committed PWA icons from the existing favicon
// glyph. Not wired into the build - the outputs are committed, so this script is a record of
// provenance. Re-run to reproduce: `node scripts/generate-icons.mjs`.
//
// Three changes from the favicon: recoloured purple -> the green accent token (--deck-accent,
// the current palette; purple predates the island retheme), composited on the dark background
// token (--deck-bg) instead of left transparent, and padded into Android's adaptive-icon safe
// zone (glyph sized to ~66% of the canvas, centred) so the maskable circle doesn't crop it.
import { readFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const DECK_BG = '#1c160e'
const DECK_ACCENT = '#3fae6a'
const OUT_DIR = new URL('../public/icons/', import.meta.url)

const rawSvg = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8')
// The favicon glyph is drawn in several purple/blue tones, and each shape's `style` attribute
// (fill:...;fill:color(display-p3 ...)) wins the cascade over its `fill` attribute - so the P3
// colour has to go too, not just the hex, or the recolour is invisible. Stripping `style`
// entirely leaves the `fill` attribute (already recoloured) in charge, turning every shape into
// one flat, single-colour glyph - legible at launcher size, matches the app.
const glyphSvg = rawSvg.replace(/#[0-9a-fA-F]{6}/g, DECK_ACCENT).replace(/\sstyle="[^"]*"/g, '')

function pageHtml(canvasSize, glyphFraction) {
  const glyphSize = Math.round(canvasSize * glyphFraction)
  return `<!doctype html><html><head><style>
    html,body{margin:0;padding:0}
    .canvas{width:${canvasSize}px;height:${canvasSize}px;background:${DECK_BG};display:flex;align-items:center;justify-content:center}
    .canvas svg{width:${glyphSize}px;height:auto}
  </style></head><body><div class="canvas">${glyphSvg}</div></body></html>`
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const size of [192, 512]) {
    await page.setViewportSize({ width: size, height: size })
    // 66%: Android's adaptive-icon safe zone is the inner ~66% of the canvas: content outside it
    // may be clipped by the launcher's mask shape (circle, squircle, ...).
    await page.setContent(pageHtml(size, 0.66))
    await page.screenshot({ path: fileURLToPath(new URL(`icon-${size}.png`, OUT_DIR)) })
  }

  await browser.close()
  console.log('Wrote public/icons/icon-192.png and public/icons/icon-512.png')
}

main()
