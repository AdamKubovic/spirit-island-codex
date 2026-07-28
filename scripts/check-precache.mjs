// Guards issue #02 of .scratch/installable-app: Workbox silently drops any file over its size
// limit from the precache manifest, and the build stays green when it does. This reads the
// generated dist/sw.js after the build and asserts every file in dist/ (built assets AND the
// copied-through public/ images) appears in the precache list, by count, not by sample — a sample
// is exactly what would miss a size-limit drop. On failure it names the missing files.
import { readFileSync } from 'node:fs'
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = fileURLToPath(new URL('../dist', import.meta.url))
const SW_PATH = join(DIST, 'sw.js')

function allFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...allFiles(full))
    else out.push(relative(DIST, full))
  }
  return out
}

function precachedUrls(swSource) {
  const match = swSource.match(/precacheAndRoute\(\[(.*?)\]\s*,/s)
  if (!match) throw new Error('Could not find precacheAndRoute([...]) in dist/sw.js')
  // Not valid JSON - Workbox emits unquoted keys (url:, revision:) - so evaluate it as JS instead.
  const entries = new Function(`return [${match[1]}]`)()
  return new Set(entries.map((e) => e.url))
}

function main() {
  const swSource = readFileSync(SW_PATH, 'utf8')
  const precached = precachedUrls(swSource)
  // sw.js and its workbox runtime chunk aren't precached entries themselves - they're the cache.
  // Only assets the running app actually fetches need to be offline - font licence text
  // (fonts/**/OFL.txt) and READMEs are never requested at runtime, so they're not part of this
  // guard's contract even though vite copies them into dist/ alongside the fonts.
  const onDisk = allFiles(DIST).filter(
    (f) => f !== 'sw.js' && !/^workbox-[0-9a-f]+\.js$/.test(f) && !f.endsWith('.md') && !f.endsWith('.txt'),
  )

  const missing = onDisk.filter((f) => !precached.has(f))
  const largestPanel = onDisk.find((f) => f.startsWith('panels/') && f.endsWith('.webp'))

  if (missing.length > 0) {
    console.error(`Precache guard failed: ${missing.length} file(s) on disk are missing from the service worker's precache manifest:`)
    for (const f of missing) console.error(`  - ${f}`)
    process.exit(1)
  }

  if (largestPanel && !precached.has(largestPanel)) {
    console.error(`Precache guard failed: sampled panel image "${largestPanel}" is not precached.`)
    process.exit(1)
  }

  console.log(`Precache guard passed: all ${onDisk.length} built files are in the precache manifest.`)
}

main()
