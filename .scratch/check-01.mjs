export async function run(page) {
  await page.getByRole('button', { name: 'Log', exact: true }).first().click()
  await page.waitForTimeout(300)

  // Adversary select defaults to None
  const advLabel = page.locator('.log-field-label', { hasText: 'Adversary (optional)' }).first()
  const advSelect = advLabel.locator('..').locator('select')
  console.log('adversary select value:', JSON.stringify(await advSelect.inputValue()))
  const advLevel = advLabel.locator('../..').locator('input[type=number]').first()
  console.log('primary level disabled:', await advLevel.isDisabled())

  // Fill player name + spirit only, no adversary
  await page.getByPlaceholder('Name').first().fill('Solo')
  await page.locator('select').nth(0).selectOption({ index: 1 })

  const submit = page.getByRole('button', { name: 'Record game' })
  console.log('can submit without adversary:', await submit.isEnabled())
  await submit.click()
  await page.waitForTimeout(300)

  // History row should show the entry, with a dash for adversary
  const row = page.locator('.log-table tbody tr').first()
  const advCell = row.locator('td[data-label="Adversary"]')
  console.log('history adversary cell text:', JSON.stringify((await advCell.innerText()).trim()))
  const stored = await page.evaluate(() => localStorage.getItem('spirit-island:game-log'))
  console.log('stored adversary:', JSON.stringify(JSON.parse(stored)[0].adversary))
  await page.evaluate(() => localStorage.clear())
}
