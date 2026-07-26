import { chromium } from 'playwright'

const [tabLabel, outPath, widthArg] = process.argv.slice(2)
const width = widthArg ? Number(widthArg) : 1280

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height: 1000 } })
await page.goto('http://localhost:5199/')
await page.getByRole('button', { name: tabLabel, exact: true }).first().click()
await page.waitForTimeout(600)
await page.screenshot({ path: outPath, fullPage: true })
await browser.close()
console.log('saved', outPath)
