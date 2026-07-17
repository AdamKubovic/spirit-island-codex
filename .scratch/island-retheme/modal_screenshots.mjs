import { chromium } from 'playwright'

const BASE = 'http://localhost:5183'
const OUT = '/Users/adamkubovic/Coding Projects/spirit_island/.scratch/island-retheme/screenshots-04'
const MODAL_VARIANTS = ['stay', 'flip']

const browser = await chromium.launch()

for (const modal of MODAL_VARIANTS) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto(`${BASE}/?theme=A&modal=${modal}`)
  await page.waitForSelector('text=Spirit Island')

  await page.getByRole('button', { name: 'Browse', exact: true }).click()
  await page.waitForTimeout(300)
  await page.locator('.spirit-tile-open').first().click()
  await page.waitForSelector('.modal.spirit-detail')
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${OUT}/${modal}-SpiritDetail-1280.png` })

  await page.close()
  console.log(`done ${modal}`)
}
await browser.close()
