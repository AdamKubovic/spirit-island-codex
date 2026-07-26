export async function run(page) {
  await page.getByRole('button', { name: 'Log', exact: true }).first().click()
  await page.waitForTimeout(300)

  // Board chip group offers Blighted Island
  const boardChips = await page.locator('.log-chip-group[aria-label="Board type"] .log-chip').allTextContents()
  console.log('board chips:', JSON.stringify(boardChips))

  // Log a game on Blighted Island with blight remaining
  await page.getByPlaceholder('Name').first().fill('Solo')
  await page.locator('select').nth(0).selectOption({ index: 1 })
  await page.getByRole('button', { name: 'Blighted Island', exact: true }).click()
  await page.locator('input[type=number]').nth(3).fill('5') // blight remaining (after 2 level inputs + terror)
  await page.getByRole('button', { name: 'Record game' }).click()
  await page.waitForTimeout(300)

  const outcomeCell = await page.locator('.log-table tbody tr td[data-label="Outcome"]').first().innerText()
  console.log('outcome cell:', JSON.stringify(outcomeCell))
  const stored = JSON.parse(await page.evaluate(() => localStorage.getItem('spirit-island:game-log')))
  console.log('stored boardType:', stored[0].boardType, '| blightRemaining:', stored[0].blightRemaining)
  await page.evaluate(() => localStorage.clear())
}
