export async function run(page) {
  await page.getByRole('button', { name: 'Archive', exact: true }).first().click()
  await page.waitForTimeout(400)
  const sortSelect = page.locator('label', { hasText: 'Sort' }).locator('select').first()
  const options = await sortSelect.locator('option').allTextContents()
  console.log('sort options:', JSON.stringify(options))

  const firstNames = async () =>
    (await page.locator('.card-grid img, .card-rows img').evaluateAll((imgs) => imgs.slice(0, 3).map((i) => i.alt))).join(' | ')

  await sortSelect.selectOption('name-asc')
  await page.waitForTimeout(300)
  console.log('first 3 name-asc:', await firstNames())
  await sortSelect.selectOption('name-desc')
  await page.waitForTimeout(300)
  console.log('first 3 name-desc:', await firstNames())
}
