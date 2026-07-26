// Turns YouTube video ids into committed plain-text transcripts, one file per video.
// Re-run to reproduce: `node scripts/fetch-transcripts.mjs <videoId> [...]`, or with no
// arguments to fetch the eight Spirit Island Archive card tier-list videos.
//
// Requires `yt-dlp` on PATH (a developer-machine tool — deliberately NOT a package
// dependency; the shipped runtime stays react + react-dom). ffmpeg is not needed: we parse
// the raw auto-caption VTT ourselves rather than using --convert-subs.
//
// Auto-generated captions roll: cue N repeats the tail of cue N-1, so naive concatenation
// roughly doubles the text. Consecutive-duplicate collapse fixes that.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const OUT_DIR = new URL('../.scratch/card-tier-lists/transcripts/', import.meta.url)

/** The eight videos this effort needs. The two [OUTDATED] major videos in the same
 * playlist are superseded and deliberately excluded. */
const DEFAULT_VIDEOS = [
  ['major-part-1', 'dHe0_n86nq4'],
  ['major-part-2', 'rkuXUmf7kpM'],
  ['major-part-3', 'Hc3bLAkiO5o'],
  ['major-part-4', 'Olm9L9CnHfc'],
  ['major-part-5', 'Hnm_rD4ziRc'],
  ['minor-part-1', 'DdZFT5myaDI'],
  ['minor-part-2', 'bjd98MBYA5U'],
  ['minor-part-3', '-uT5_RQTolE'],
]

function requireYtDlp() {
  try {
    execFileSync('yt-dlp', ['--version'], { stdio: 'pipe' })
  } catch {
    throw new Error(
      'yt-dlp not found on PATH. Install it (e.g. `brew install yt-dlp`) and re-run. ' +
        'It is a developer-machine tool and is not a package dependency.',
    )
  }
}

function ytDlp(args) {
  return execFileSync('yt-dlp', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
}

function metadata(id) {
  const raw = ytDlp(['--no-warnings', '--print', '%(title)s\n%(uploader)s\n%(upload_date)s\n%(duration_string)s', `https://www.youtube.com/watch?v=${id}`])
  const [title, uploader, uploadDate, duration] = raw.trim().split('\n')
  return { title, uploader, uploadDate, duration }
}

/** Parse an auto-caption VTT into `[mm:ss] line` entries, tags stripped, rolling
 * duplicates collapsed. */
function parseVtt(vtt) {
  const out = []
  let cueStart = null
  for (const rawLine of vtt.split('\n')) {
    const line = rawLine.trim()
    const cue = line.match(/^(\d{2}:\d{2}:\d{2})\.\d{3} --> /)
    if (cue) {
      cueStart = cue[1].replace(/^00:/, '')
      continue
    }
    if (!cueStart || !line || line.startsWith('WEBVTT') || /^(Kind|Language|NOTE):?/.test(line)) continue
    const text = line
      .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, '')
      .replace(/<\/?c[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (!text) continue
    if (out.length && out[out.length - 1].text === text) continue
    out.push({ at: cueStart, text })
  }
  return out
}

function fetchTranscript(label, id) {
  const dir = mkdtempSync(join(tmpdir(), 'si-subs-'))
  ytDlp([
    '--no-warnings',
    '--skip-download',
    '--write-auto-sub',
    '--sub-lang',
    'en',
    '--sub-format',
    'vtt',
    '-o',
    join(dir, 'sub'),
    `https://www.youtube.com/watch?v=${id}`,
  ])
  const file = readdirSync(dir).find((f) => f.endsWith('.vtt'))
  if (!file) throw new Error(`${id}: yt-dlp produced no VTT (no English auto-captions?)`)
  const lines = parseVtt(readFileSync(join(dir, file), 'utf8'))
  const meta = metadata(id)
  const words = lines.reduce((n, l) => n + l.text.split(' ').length, 0)
  const header = [
    `# ${meta.title}`,
    `videoId: ${id}`,
    `url: https://www.youtube.com/watch?v=${id}`,
    `uploader: ${meta.uploader}`,
    `published: ${meta.uploadDate}`,
    `duration: ${meta.duration}`,
    `words: ${words}`,
    '',
  ].join('\n')
  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(
    new URL(`${label}-${id}.txt`, OUT_DIR),
    header + lines.map((l) => `[${l.at}] ${l.text}`).join('\n') + '\n',
  )
  console.log(`${label} (${id}): ${lines.length} lines, ${words} words`)
}

requireYtDlp()
const args = process.argv.slice(2)
const videos = args.length ? args.map((id, i) => [`video-${i + 1}`, id]) : DEFAULT_VIDEOS
for (const [label, id] of videos) fetchTranscript(label, id)
