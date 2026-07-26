import { chromium } from 'playwright'

const [scriptPath, widthArg] = process.argv.slice(2)
const width = widthArg ? Number(widthArg) : 1280

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height: 1000 } })
page.on('console', (msg) => console.log('[console]', msg.text()))
page.on('pageerror', (err) => console.log('[pageerror]', err.message))
await page.goto('http://localhost:5199/')
const { run } = await import(scriptPath)
await run(page)
await browser.close()
