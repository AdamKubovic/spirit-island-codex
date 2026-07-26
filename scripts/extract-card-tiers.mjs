// Reads the committed transcripts (see scripts/fetch-transcripts.mjs) and works out what the
// Spirit Island Archive card tier-list videos actually rate. Writes proposals + a near-miss
// review file to .scratch/card-tier-lists/extraction/. Ships NO tier list data: the near-miss
// bucket is a human gate (CLAUDE.md — a field that cannot be sourced must be absent).
//
// Two routes to a rating and there is no third:
//   1. verbatim card name in the transcript, under an announced band -> proposed
//   2. anything else that looks like a rating -> review file, waits for the owner
//
// Re-run: `node scripts/extract-card-tiers.mjs`
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'

const TRANSCRIPT_DIR = new URL('../.scratch/card-tier-lists/transcripts/', import.meta.url)
const OUT_DIR = new URL('../.scratch/card-tier-lists/extraction/', import.meta.url)
const cards = JSON.parse(readFileSync(new URL('../src/data/power-cards.json', import.meta.url), 'utf8'))

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const STOP = new Set(
  'a an the of and or to for in on by with from at as is it its their his her that this all one two your you they be'.split(' '),
)

/** Load one transcript as { meta, lines[], text, index[] } where `text` is the normalised
 * running prose and `index[i]` maps character i of `text` back to a line. */
function loadTranscript(file) {
  const raw = readFileSync(new URL(file, TRANSCRIPT_DIR), 'utf8')
  const meta = {}
  const lines = []
  for (const line of raw.split('\n')) {
    const kv = line.match(/^(videoId|url|uploader|published|duration|words): (.*)$/)
    if (kv) meta[kv[1]] = kv[2]
    else if (line.startsWith('# ')) meta.title = line.slice(2)
    const cue = line.match(/^\[(\d\d:\d\d(?::\d\d)?)\] (.*)$/)
    if (cue) lines.push({ at: cue[1], text: cue[2] })
  }
  let text = ''
  const index = []
  for (const [i, l] of lines.entries()) {
    const chunk = norm(l.text) + ' '
    for (let k = 0; k < chunk.length; k++) index.push(i)
    text += chunk
  }
  return { file, meta, lines, text, index }
}

/** Every band letter uttered anywhere. Note this is NOT a section boundary: the reviewer
 * back-references other bands constantly mid-section ("it's not as good as the s tier cards"),
 * so the most recent utterance is a weak signal, never a rating on its own. */
const BAND_RE = /\b([sabcdf]) tier\b|\btier ([sabcdf])\b/g

function bandTimeline(t) {
  const marks = []
  let m
  BAND_RE.lastIndex = 0
  while ((m = BAND_RE.exec(t.text))) {
    const band = (m[1] || m[2]).toUpperCase()
    marks.push({ pos: m.index, band, line: t.index[m.index] })
  }
  return marks
}

const bandAt = (marks, pos) => {
  let band = null
  for (const mark of marks) {
    if (mark.pos > pos) break
    band = mark.band
  }
  return band
}

/** Quote the surrounding transcript sentence-ish: a few cue lines either side. */
const context = (t, line, before = 2, after = 3) =>
  t.lines
    .slice(Math.max(0, line - before), line + after + 1)
    .map((l) => l.text)
    .join(' ')

/** The band each part announces it covers, quoted in its own intro. A verbatim match whose
 * inferred band is not one this part covers is a stale back-reference, not a rating — it goes
 * to the human gate. */
const PART_BANDS = {
  'minor-part-1': ['S', 'A'],
  'minor-part-2': ['B'],
  'minor-part-3': ['C', 'F'],
  'major-part-1': ['F', 'D'],
  'major-part-2': ['C'],
  'major-part-3': ['B'],
  'major-part-4': ['A'],
  'major-part-5': ['S'],
}
const partBands = (file) => PART_BANDS[file.match(/^(?:minor|major)-part-\d+/)?.[0]] ?? []

const SUBJECTS = {
  'minor-powers': { kind: 'minor', files: [] },
  'major-powers': { kind: 'major', files: [] },
}
for (const f of readdirSync(TRANSCRIPT_DIR).sort()) {
  if (f.startsWith('minor-')) SUBJECTS['minor-powers'].files.push(f)
  else if (f.startsWith('major-')) SUBJECTS['major-powers'].files.push(f)
}

const report = []
const reviewEntries = []
/** Parse each transcript once; every pass below reads from here. */
const loaded = new Map(
  [...SUBJECTS['minor-powers'].files, ...SUBJECTS['major-powers'].files].map((f) => [f, loadTranscript(f)]),
)
const marksBy = new Map([...loaded].map(([f, t]) => [f, bandTimeline(t)]))

for (const [subject, cfg] of Object.entries(SUBJECTS)) {
  const pool = cards.filter((c) => c.kind === cfg.kind)
  const transcripts = cfg.files.map((f) => loaded.get(f))

  const proposed = {}
  const evidence = []
  const unmatched = []

  for (const card of pool) {
    const needle = norm(card.name) + ' '
    // Every occurrence across every part, not just the first: a card named in passing in one
    // part and rated in another must not inherit the passing mention's band.
    const hits = []
    for (const t of transcripts) {
      let from = 0
      let pos
      while ((pos = t.text.indexOf(needle, from)) !== -1) {
        from = pos + 1
        const line = t.index[pos]
        const band = bandAt(marksBy.get(t.file), pos)
        hits.push({
          file: t.file,
          at: t.lines[line].at,
          band: partBands(t.file).includes(band) ? band : null,
          quote: context(t, line),
        })
      }
    }
    if (!hits.length) {
      unmatched.push(card)
      continue
    }
    // A rating is only proposed where the *video itself* fixes the band: the card is named in
    // exactly one part, and that part announces it covers exactly one band. Everything else —
    // a two-band part, or a card named across parts — goes to the human gate, because the
    // nearest band utterance is not a section boundary and guessing from it fabricates ratings.
    const parts = [...new Set(hits.map((h) => h.file))]
    const covered = parts.length === 1 ? partBands(parts[0]) : []
    if (covered.length === 1) {
      proposed[card.name] = covered[0]
      evidence.push({ card: card.name, ...hits[0], band: covered[0], mentions: hits.length, basis: `${parts[0]} covers ${covered[0]} tier only` })
    } else {
      const suggest = [...new Set(hits.map((h) => h.band).filter(Boolean))]
      reviewEntries.push({
        subject,
        heard: card.name,
        candidate: card.name,
        reason:
          parts.length > 1
            ? `named verbatim in ${parts.length} parts — one of them is a back-reference, not a rating`
            : `named verbatim in ${parts[0]}, which covers ${partBands(parts[0]).join(' and ') || 'no announced band'} — the part does not fix the band by itself`,
        file: hits[0].file,
        at: hits[0].at,
        band: suggest.join(' or ') || null,
        quote: hits.map((h) => `[${h.file} @ ${h.at}, nearest band utterance ${h.band ?? '?'}] ${h.quote}`).join(' … '),
      })
    }
  }

  // Near-misses: an unmatched card whose distinctive content words cluster in one passage.
  for (const card of unmatched) {
    const words = norm(card.name).split(' ').filter((w) => w.length > 3 && !STOP.has(w))
    if (!words.length) continue
    let best = null
    for (const t of transcripts) {
      const hay = ' ' + t.text + ' '
      for (const w of words) {
        let from = 0
        let pos
        while ((pos = hay.indexOf(' ' + w + ' ', from)) !== -1) {
          from = pos + 1
          const window = hay.slice(Math.max(0, pos - 120), pos + 120)
          const score = words.filter((x) => window.includes(x)).length
          if (!best || score > best.score) {
            const line = t.index[Math.min(Math.max(0, pos - 1), t.index.length - 1)]
            best = { score, file: t.file, line, pos: pos - 1, t }
          }
        }
      }
    }
    if (!best || best.score < Math.max(2, Math.ceil(words.length / 2))) continue
    reviewEntries.push({
      subject,
      heard: norm(context(best.t, best.line, 0, 1)).slice(0, 140),
      candidate: card.name,
      reason: `${best.score}/${words.length} content words clustered`,
      file: best.file,
      at: best.t.lines[best.line].at,
      band: bandAt(marksBy.get(best.file), best.pos),
      quote: context(best.t, best.line),
    })
  }

  const reviewed = new Set(reviewEntries.filter((e) => e.subject === subject).map((e) => e.candidate))
  const silent = unmatched.filter((c) => !reviewed.has(c.name)).map((c) => c.name)

  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(
    new URL(`proposed-${subject}.json`, OUT_DIR),
    JSON.stringify({ subject, tiers: proposed, evidence, notMentioned: silent }, null, 2) + '\n',
  )

  // Per part: the band it announces it covers (for the citation `methodology`), alongside every
  // band letter it utters — the two differ, which is exactly why utterances can't fix a rating.
  const parts = transcripts.map((t) => ({
    file: t.file,
    videoId: t.meta.videoId,
    title: t.meta.title,
    published: t.meta.published,
    covers: partBands(t.file),
    bandUtterances: [...new Set(marksBy.get(t.file).map((m) => m.band))],
  }))

  report.push({ subject, pool: pool.length, proposed: Object.keys(proposed).length, review: reviewEntries.filter((e) => e.subject === subject).length, silent: silent.length, parts })
}

// The `X` trap: in the minors video a blue X over a card means "removed by errata", not a band.
const xMarkers = []
for (const t of loaded.values()) {
  const marks = marksBy.get(t.file)
  const re = /\b(?:blue x|x through it|has an x|an x through)\b/g
  let m
  while ((m = re.exec(t.text))) {
    const line = t.index[m.index]
    xMarkers.push({ file: t.file, at: t.lines[line].at, band: bandAt(marks, m.index), quote: context(t, line, 4, 4) })
  }
}

writeFileSync(
  new URL('extraction-report.json', OUT_DIR),
  JSON.stringify({ report, xMarkers }, null, 2) + '\n',
)

const md = [
  '# Near-miss review — card tier lists',
  '',
  'Every entry below is a rating this repo will **not** ship without your explicit sign-off.',
  'Mark each `approve` (becomes a tier key at the stated band) or `reject` (becomes an',
  '`unresolved` entry recording what the captions heard).',
  '',
  ...reviewEntries.map(
    (e, i) =>
      `## ${i + 1}. ${e.candidate} — ${e.subject}\n\n` +
      `- band under discussion: **${e.band ?? 'none announced'}**\n` +
      `- source: ${e.file} @ ${e.at}\n` +
      `- why it is here: ${e.reason}\n` +
      `- captions heard: "${e.heard}"\n` +
      `- context: "${e.quote}"\n` +
      `- verdict: \n`,
  ),
].join('\n')
writeFileSync(new URL('near-miss-review.md', OUT_DIR), md)

console.log(JSON.stringify(report.map(({ subject, pool, proposed, review, silent }) => ({ subject, pool, proposed, review, silent })), null, 2))
console.log('X markers:', xMarkers.length)
