export async function run(page) {
  // DeckPoolBreakdown lives on the Recommend tab's side pane / dashboard pool section — find it
  await page.getByRole('button', { name: 'Recommend', exact: true }).first().click()
  await page.waitForTimeout(500)
  const fills = page.locator('.deck-element-fill')
  const n = await fills.count()
  console.log('element-fill count on Recommend:', n)
  if (n > 0) {
    console.log('element fill bg:', await fills.first().evaluate((el) => getComputedStyle(el).backgroundColor))
  }
}
