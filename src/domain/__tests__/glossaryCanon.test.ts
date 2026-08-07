import { describe, expect, it } from 'vitest'
import { GLOSSARY, GLOSSARY_SOURCES, type GlossaryEntry } from '../glossary'

/**
 * Tripwire against blank or unsourced glossary definitions — the same discipline as
 * aspectCanon / adversaryCanon. Rules prose is a fabrication risk; every entry must carry
 * non-empty text, a non-empty friendly label (ux-discoverability #03) and a valid source.
 */
describe('glossary canon', () => {
  it('gives every entry non-empty text and a valid source', () => {
    const entries = Object.entries(GLOSSARY) as [string, GlossaryEntry][]
    expect(entries.length).toBeGreaterThan(0)
    for (const [id, entry] of entries) {
      expect(entry.text.trim(), `${id} has empty text`).not.toBe('')
      expect(GLOSSARY_SOURCES, `${id} has invalid source`).toContain(entry.source)
    }
  })

  it('gives every entry a non-empty friendly label, distinct from its internal id (#03)', () => {
    const entries = Object.entries(GLOSSARY) as [string, GlossaryEntry][]
    for (const [id, entry] of entries) {
      expect(entry.label.trim(), `${id} has empty label`).not.toBe('')
      expect(entry.label, `${id} label duplicates its id`).not.toBe(id)
    }
  })
})
