import { describe, expect, it } from 'vitest'
import powerCardsData from '../../data/power-cards.json'
import spiritsData from '../../data/spirits.json'
import { expand } from '../configurations'
import { subjectUniverse } from '../tierSubjects'
import type { PowerCard, Spirit } from '../types'

const spirits = spiritsData as Spirit[]
const powerCards = powerCardsData as PowerCard[]
const configurations = expand(spirits)

describe('subjectUniverse', () => {
  it('the configurations subject keys by configId and covers every configuration', () => {
    const u = subjectUniverse('configurations', configurations, powerCards)
    expect(u.total).toBe(68)
    expect(u.items).toHaveLength(68)
    expect(new Set(u.items.map((item) => u.idOf(item)))).toEqual(
      new Set(configurations.map((c) => c.configId)),
    )
  })

  it('the minor-powers subject keys by card name and covers the whole minor deck', () => {
    const u = subjectUniverse('minor-powers', configurations, powerCards)
    expect(u.total).toBe(101)
    expect(new Set(u.items.map((item) => u.idOf(item)))).toEqual(
      new Set(powerCards.filter((c) => c.kind === 'minor').map((c) => c.name)),
    )
  })

  it('the major-powers subject keys by card name and covers the whole major deck', () => {
    const u = subjectUniverse('major-powers', configurations, powerCards)
    expect(u.total).toBe(78)
    expect(new Set(u.items.map((item) => u.idOf(item)))).toEqual(
      new Set(powerCards.filter((c) => c.kind === 'major').map((c) => c.name)),
    )
  })

  it('configuration items are configurations and card items are power cards', () => {
    const configs = subjectUniverse('configurations', configurations, powerCards)
    const majors = subjectUniverse('major-powers', configurations, powerCards)
    expect(configs.items.every((i) => 'configId' in i)).toBe(true)
    expect(majors.items.every((i) => 'cost' in i)).toBe(true)
  })
})
