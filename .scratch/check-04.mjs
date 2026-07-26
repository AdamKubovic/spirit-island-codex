export async function run(page) {
  await page.getByRole('button', { name: 'Dashboard', exact: true }).first().click()
  await page.waitForTimeout(500)
  const fast = page.locator('.dashboard-facet-fast').first()
  const slow = page.locator('.dashboard-facet-slow').first()
  console.log('fast count:', await page.locator('.dashboard-facet-fast').count())
  console.log('fast bg:', await fast.evaluate((el) => getComputedStyle(el).backgroundColor))
  console.log('slow bg:', await slow.evaluate((el) => getComputedStyle(el).backgroundColor))
}
