/**
 * theming-spread #02 — the artefact behind the contrast figures quoted in `deck.css`'s
 * `.tier-tile-expansion` comment and pinned by `cardChipColors.test.ts`.
 *
 * Two measurements:
 *   1. Static — every EXPANSION_COLOR against the stripe's ring token, computed from the hexes.
 *   2. Live — each stripe against the art actually beside it, sampled off the running production
 *      build, which is where the "a jewel tone only reaches ~2:1 over art" figure comes from.
 *
 * Static runs standalone. The live pass needs the preview server:
 *   npm run build && npx vite preview --port 5199 --strictPort &
 *   node .scratch/theming-spread/measure-stripe-contrast.mjs --live
 */

const EXPANSION_COLOR = {
  Base: '#4a6b8a',
  'Branch & Claw': '#5c7a4a',
  'Feather & Flame': '#8a5a3a',
  Horizons: '#3a7a6e',
  'Jagged Earth': '#7a4a6e',
  'Nature Incarnate': '#6e5a2a',
}
/** `--deck-panel-2` — the ring. Opaque by design: a translucent ring composites with the art, so
 * its contrast would vary per artwork instead of being one stable, checkable number. */
const RING = '#150f09'

const channel = (v) => {
  v /= 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
const parseHex = (h) => [h.slice(1, 3), h.slice(3, 5), h.slice(5, 7)].map((p) => parseInt(p, 16))
const contrast = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)]
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

console.log(`Stripe vs ring (${RING} = --deck-panel-2), opaque:`)
const ring = parseHex(RING)
const ratios = Object.entries(EXPANSION_COLOR)
  .map(([name, hex]) => [name, hex, contrast(parseHex(hex), ring)])
  .sort((a, b) => a[2] - b[2])
for (const [name, hex, ratio] of ratios) {
  console.log(`  ${name.padEnd(18)} ${hex}  ${ratio.toFixed(2)}:1`)
}
console.log(`  → floor ${ratios[0][2].toFixed(2)}:1 (${ratios[0][0]}), ceiling ${ratios.at(-1)[2].toFixed(2)}:1`)

// Why not a translucent ring: over pale art it lightens, so the worst case is art-dependent.
console.log('\nFor comparison, a translucent rgba(0,0,0,a) ring at its worst (composited over white):')
for (const alpha of [0.55, 0.74, 0.85]) {
  const grey = Math.round(255 * (1 - alpha))
  const worst = Math.min(...Object.values(EXPANSION_COLOR).map((h) => contrast(parseHex(h), [grey, grey, grey])))
  console.log(`  alpha ${alpha} (ring becomes grey ${grey})  ${worst.toFixed(2)}:1 worst-case`)
}
console.log('  → why the shipped ring is opaque: none of these hold a figure you can state.')

if (!process.argv.includes('--live')) {
  console.log('\n(Pass --live, with the preview server running, for the stripe-vs-art sampling.)')
  process.exit(0)
}

const { chromium } = await import('playwright')
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })
  await page.goto('http://localhost:5199/')
  await page.getByRole('button', { name: 'Tier list', exact: true }).first().click()
  await page.waitForTimeout(800)

  const targets = await page.$$eval('.tier-tile-expansion', (els) =>
    els.slice(0, 6).map((el) => {
      const r = el.getBoundingClientRect()
      return {
        title: el.closest('figure')?.getAttribute('title'),
        // A 12px column of art just inside the stripe, avoiding the ring itself.
        art: { x: r.x + 8, y: r.y + 8, width: 12, height: Math.max(1, r.height - 16) },
        css: getComputedStyle(el).backgroundColor,
      }
    }),
  )

  const averageOf = async (clip) => {
    const dataUrl = 'data:image/png;base64,' + (await page.screenshot({ clip })).toString('base64')
    return page.evaluate(async (url) => {
      const img = new Image()
      img.src = url
      await img.decode()
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let r = 0, g = 0, b = 0
      for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2] }
      const n = data.length / 4
      return [Math.round(r / n), Math.round(g / n), Math.round(b / n)]
    }, dataUrl)
  }

  console.log('\nStripe vs the art immediately beside it (sampled live):')
  for (const t of targets) {
    const art = await averageOf(t.art)
    const stripe = t.css.match(/\d+/g).slice(0, 3).map(Number)
    console.log(`  ${contrast(stripe, art).toFixed(2)}:1  ${t.title}`)
    console.log(`         stripe rgb(${stripe})  art rgb(${art})`)
  }
  console.log('  → this is the ~2:1 the ring exists to work around.')
} finally {
  await browser.close()
}
