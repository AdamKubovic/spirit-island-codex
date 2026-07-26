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

/** Band announcements. "tier list" is not a band; "s tier"/"tier s"/"looking at a tier" are. */
const BAND_RE = /\b(?:looking at |moving on to |now (?:for )?|on to |into |next up )?\b([sabcdf]) tier\b|\btier ([sabcdf])\b/g

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

for (const [subject, cfg] of Object.entries(SUBJECTS)) {
  const pool = cards.filter((c) => c.kind === cfg.kind)
  const transcripts = cfg.files.map(loadTranscript)
  const marksBy = new Map(transcripts.map((t) => [t.file, bandTimeline(t)]))

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
    const bands = [...new Set(hits.map((h) => h.band).filter(Boolean))]
    if (bands.length === 1) {
      const hit = hits.find((h) => h.band === bands[0])
      proposed[card.name] = bands[0]
      evidence.push({ card: card.name, ...hit, mentions: hits.length })
    } else {
      // Ambiguous or bandless: the transcript does not unambiguously place this card, so it
      // goes to the human gate rather than being guessed at.
      const hit = hits[0]
      reviewEntries.push({
        subject,
        heard: card.name,
        candidate: card.name,
        reason: bands.length
          ? `named verbatim but mentioned under ${bands.length} different bands (${bands.join(', ')})`
          : 'named verbatim but no band was announced before any mention',
        file: hit.file,
        at: hit.at,
        band: bands.join(' or ') || null,
        quote: hits.map((h) => `[${h.file} @ ${h.at}, band ${h.band ?? '?'}] ${h.quote}`).join(' … '),
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

  // Band coverage per part, and every band announcement, for the citation methodology.
  const parts = transcripts.map((t) => ({
    file: t.file,
    videoId: t.meta.videoId,
    title: t.meta.title,
    published: t.meta.published,
    bands: [...new Set(marksBy.get(t.file).map((m) => m.band))],
  }))

  report.push({ subject, pool: pool.length, proposed: Object.keys(proposed).length, review: reviewEntries.filter((e) => e.subject === subject).length, silent: silent.length, parts })
}

// The `X` trap: in the minors video a blue X over a card means "removed by errata", not a band.
const xMarkers = []
for (const t of [...SUBJECTS['minor-powers'].files, ...SUBJECTS['major-powers'].files].map(loadTranscript)) {
  const marks = bandTimeline(t)
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
