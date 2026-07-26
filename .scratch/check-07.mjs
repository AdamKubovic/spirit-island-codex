export async function run(page) {
  await page.getByRole('button', { name: 'Log', exact: true }).first().click()
  await page.waitForTimeout(300)

  // Create an entry: England L2, thematic-base, blight 4, note
  await page.getByPlaceholder('Name').first().fill('Solo')
  await page.locator('select').nth(0).selectOption({ index: 1 })
  const advSelect = page.locator('label', { hasText: 'Adversary (optional)' }).locator('select').first()
  await advSelect.selectOption({ label: 'England' })
  await page.getByRole('button', { name: 'Thematic · base', exact: true }).click()
  await page.getByPlaceholder('How did it go?').fill('first try')
  await page.getByRole('button', { name: 'Record game' }).click()
  await page.waitForTimeout(300)
  const stored1 = JSON.parse(await page.evaluate(() => localStorage.getItem('spirit-island:game-log')))
  console.log('created id:', stored1[0].id, '| outcome:', stored1[0].outcome, '| board:', stored1[0].boardType)

  // Click Edit — form should populate and switch to edit mode
  await page.getByRole('button', { name: 'Edit game' }).first().click()
  await page.waitForTimeout(400)
  console.log('legend:', await page.locator('.log-panel legend').first().innerText())
  console.log('adversary select after edit:', await advSelect.inputValue())
  console.log('active board chip:', await page.locator('.log-chip[data-active="true"]').first().innerText())
  console.log('notes after edit:', await page.getByPlaceholder('How did it go?').inputValue())
  console.log('submit label:', await page.locator('.log-submit').innerText())

  // Change outcome to Loss + notes, submit -> update in place
  await page.getByRole('button', { name: 'Loss', exact: true }).click()
  await page.getByPlaceholder('How did it go?').fill('corrected')
  await page.getByRole('button', { name: 'Update game' }).click()
  await page.waitForTimeout(300)
  const stored2 = JSON.parse(await page.evaluate(() => localStorage.getItem('spirit-island:game-log')))
  console.log('count after update:', stored2.length, '| same id:', stored2[0].id === stored1[0].id, '| outcome:', stored2[0].outcome, '| notes:', stored2[0].notes, '| date kept:', stored2[0].date === stored1[0].date)
  const rowText = await page.locator('.log-table tbody tr').first().innerText()
  console.log('row shows Loss:', rowText.includes('Loss'), '| shows corrected:', rowText.includes('corrected'))

  // Edit again then Cancel — entry untouched, form back to create mode
  await page.getByRole('button', { name: 'Edit game' }).first().click()
  await page.waitForTimeout(300)
  await page.getByPlaceholder('How did it go?').fill('discarded')
  await page.getByRole('button', { name: 'Cancel edit' }).click()
  await page.waitForTimeout(300)
  const stored3 = JSON.parse(await page.evaluate(() => localStorage.getItem('spirit-island:game-log')))
  console.log('after cancel notes still:', stored3[0].notes, '| legend:', await page.locator('.log-panel legend').first().innerText(), '| submit label:', await page.locator('.log-submit').innerText())
  await page.evaluate(() => localStorage.clear())
}
