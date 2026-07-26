export async function run(page) {
  await page.getByRole('button', { name: 'Dashboard', exact: true }).first().click()
  await page.waitForTimeout(500)
  const fills = page.locator('.dashboard-cost-fill')
  const n = await fills.count()
  console.log('cost fill count:', n)
  const colors = []
  for (let i = 0; i < n; i++) {
    colors.push(await fills.nth(i).evaluate((el) => getComputedStyle(el).backgroundColor))
  }
  console.log('cost colors:', JSON.stringify(colors))
  console.log('all distinct:', new Set(colors).size === n)
  // element-demand bars elsewhere still use the accent fill
  const demand = page.locator('.deck-element-fill').first()
  if ((await demand.count()) > 0) {
    console.log('element-demand fill still accent:', await demand.evaluate((el) => getComputedStyle(el).backgroundColor))
  }
}
