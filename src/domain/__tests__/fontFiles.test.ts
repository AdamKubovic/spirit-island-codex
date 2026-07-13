import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * phase-4 #22: the body font is a locked call, but a moved or renamed TTF would fail silently —
 * the CSS fallback stack just takes over. This pins every shipped font file and its OFL license
 * text (CLAUDE.md: the licenses are the provenance; see public/fonts/README.md).
 */
const FONT_FILES = [
  'reem-kufi/ReemKufi-Variable.ttf',
  'mouse-memoirs/MouseMemoirs-Regular.ttf',
  'josefin-sans/JosefinSans-Variable.ttf',
  'lato/Lato-Bold.ttf',
]

describe('shipped fonts', () => {
  it.each(FONT_FILES)('%s exists with its OFL.txt alongside', (file) => {
    const dir = file.split('/')[0]
    expect(existsSync(new URL(`../../../public/fonts/${file}`, import.meta.url))).toBe(true)
    expect(existsSync(new URL(`../../../public/fonts/${dir}/OFL.txt`, import.meta.url))).toBe(true)
  })
})
