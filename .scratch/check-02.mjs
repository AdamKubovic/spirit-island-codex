export async function run(page) {
  await page.getByRole('button', { name: 'Browse', exact: true }).first().click()
  await page.waitForTimeout(300)

  const rows = page.locator('.card-filters > .card-filters-row')
  console.log('row count:', await rows.count())
  const searchBox = await page.locator('.card-filters .search-field input').boundingBox()
  const firstSelect = await rows.nth(1).locator('select').first().boundingBox()
  console.log('search y:', searchBox.y, 'selects y:', firstSelect.y, '=> search above selects:', searchBox.y < firstSelect.y)
  const lastSelect = await rows.nth(1).locator('select').last().boundingBox()
  console.log('selects row spans y:', firstSelect.y, '..', lastSelect.y + lastSelect.height, '(wraps within one row ok)')
  console.log('selects in second row:', await rows.nth(1).locator('select').count())

  // filtering still works: search narrows the grid
  const before = await page.locator('.spirit-grid li').count()
  await page.locator('.card-filters .search-field input').fill('river')
  await page.waitForTimeout(200)
  const after = await page.locator('.spirit-grid li').count()
  console.log('grid count before/after search:', before, '/', after)
  await page.locator('.card-filters .search-field input').fill('')
}
