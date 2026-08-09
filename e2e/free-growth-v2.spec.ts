import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

async function declineAnalytics(page: Page) {
  const decline = page.getByRole('button', { name: '暂不参与' })
  if (await decline.isVisible().catch(() => false)) await decline.click()
}

async function chooseFirstAnswer(page: Page) {
  await page.getByRole('radio', { name: /更接近 A，快捷键 1/ }).click()
}

async function chooseGuessYes(page: Page) {
  const option = page.getByRole('radio', { name: '是，快捷键 1', exact: true })
  await option.click()
  await expect(option).toBeDisabled()
  await page.waitForTimeout(430)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test('public atlas is prerendered, accessible and ad-free by default', async ({ page }) => {
  await page.goto('/types/')
  await declineAnalytics(page)
  await expect(page.getByRole('heading', { name: '16 型公开人格图鉴' })).toBeVisible()
  await expect(page.locator('.profile-grid .profile-card')).toHaveCount(16)
  await expect(page.locator('[data-ad-enabled="true"]')).toHaveCount(0)

  const results = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze()
  const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))
  expect(serious).toEqual([])
})

test('keyboard input and refresh restore local assessment progress', async ({ page }) => {
  await page.goto('/test/')
  await declineAnalytics(page)
  await expect(page.locator('.quiz-count strong')).toHaveText('01')
  await page.keyboard.press('1')
  await expect(page.locator('.quiz-count strong')).toHaveText('02')
  await chooseFirstAnswer(page)
  await chooseFirstAnswer(page)
  await expect(page.locator('.quiz-count strong')).toHaveText('04')

  await page.reload()
  await expect(page.locator('.quiz-count strong')).toHaveText('04')
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('tt16:assessment:v2') || '{}'))
  expect(Object.keys(stored.answers)).toHaveLength(3)
  expect(stored.version).toBe('assessment-2')
})

test('complete local flow survives refresh and generates both share-card formats', async ({ page }) => {
  await page.goto('/test/')
  await declineAnalytics(page)
  for (let index = 0; index < 20; index += 1) await chooseFirstAnswer(page)

  await expect(page).toHaveURL(/\/result\/$/)
  await expect(page.locator('.result-name')).toBeVisible()
  await expect(page.getByText('两项压力反应')).toBeVisible()
  expect(new URL(page.url()).search).toBe('')

  await page.reload()
  await expect(page.locator('.result-name')).toBeVisible()
  await page.getByRole('button', { name: '生成我的人格卡' }).click()
  const dialog = page.getByRole('dialog', { name: '把人格说明分享给同路人' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('img')).toHaveAttribute('src', /^data:image\/png/)
  await dialog.getByRole('radio', { name: /故事卡片 9:16/ }).click()
  await expect(dialog.getByRole('radio', { name: /故事卡片 9:16/ })).toHaveAttribute('aria-checked', 'true')

  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('tt16:assessment:v2') || '{}'))
  expect(state.completed).toBe(true)
  expect(Object.keys(state.answers)).toHaveLength(20)
})

test('compare, review and printable sheet stay neutral and local', async ({ page }) => {
  await page.goto('/compare/')
  await declineAnalytics(page)
  await page.getByLabel('类型 A').selectOption('RHDP')
  await page.getByLabel('类型 B').selectOption('RHDF')
  await expect(page.getByRole('heading', { name: '共同倾向' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '分歧维度与沟通提醒' })).toBeVisible()
  await expect(page.locator('[data-ad-enabled="true"]')).toHaveCount(0)

  await page.goto('/tools/review/')
  await page.getByRole('checkbox').first().click()
  await expect(page.locator('.review-score strong')).toHaveText('1')
  await page.reload()
  await expect(page.locator('.review-score strong')).toHaveText('0')

  await page.goto('/types/RHDP/print/')
  await page.emulateMedia({ media: 'print' })
  await expect(page.getByRole('heading', { name: '复利园丁' })).toBeVisible()
  await expect(page.locator('.print-profile footer')).toContainText('不构成投资建议')
})

test('declining analytics and disabled ads produce no third-party requests', async ({ page }) => {
  const thirdParty = new Set<string>()
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.origin !== 'http://127.0.0.1:4173') thirdParty.add(url.origin)
  })

  await page.goto('/')
  await declineAnalytics(page)
  await page.goto('/types/RHDP/')
  await page.goto('/compare/')
  await page.goto('/tools/review/')
  await page.goto('/guess/')
  await expect(page.getByRole('radio', { name: '是，快捷键 1', exact: true })).toBeVisible()
  await expect(page.locator('[data-ad-enabled="true"]')).toHaveCount(0)
  expect([...thirdParty]).toEqual([])
})

test('adaptive guess stays local, restores progress and remains separate from the formal report', async ({ page }) => {
  await page.goto('/guess/')
  await expect(page.getByRole('radiogroup', { name: '选择回答' })).toBeVisible()
  await expect(page.getByRole('button', { name: '暂不参与' })).toHaveCount(0)

  for (let index = 0; index < 18; index += 1) {
    if (await page.getByRole('button', { name: '猜对了' }).isVisible().catch(() => false)) break
    await chooseGuessYes(page)
  }
  await expect(page.getByRole('button', { name: '猜对了' })).toBeVisible()
  await expect(page.getByText('为什么这样猜')).toBeVisible()
  expect(new URL(page.url()).search).toBe('')

  const stored = await page.evaluate(() => ({
    guess: JSON.parse(localStorage.getItem('tt16:guess:v1') || 'null'),
    assessment: localStorage.getItem('tt16:assessment:v2'),
  }))
  expect(stored.guess.version).toBe('guess-1')
  expect(stored.guess.events.length).toBeGreaterThanOrEqual(6)
  expect(stored.guess.events.length).toBeLessThanOrEqual(18)
  expect(stored.assessment).toBeNull()

  await page.reload()
  await expect(page.getByRole('button', { name: '猜对了' })).toBeVisible()
  await page.getByRole('button', { name: '不准，继续猜' }).click()
  await expect(page.getByText(/1 已排除/)).toBeVisible()
  await expect(page.getByRole('radio', { name: '是，快捷键 1', exact: true })).toBeVisible()

  for (let index = 0; index < 10; index += 1) {
    if (await page.getByRole('button', { name: '猜对了' }).isVisible().catch(() => false)) break
    await chooseGuessYes(page)
  }
  await page.getByRole('button', { name: '猜对了' }).click()
  await expect(page.getByText('这次猜中了。')).toBeVisible()
  await expect(page.getByText('快速猜型 · 娱乐结果')).toBeVisible()
  await expect(page.getByRole('link', { name: '完成正式 20 题' })).toHaveAttribute('href', /\/test\/$/)
  expect(await page.evaluate(() => localStorage.getItem('tt16:assessment:v2'))).toBeNull()

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '保存娱乐卡' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/^TT16-快速猜型-[A-Z]{4}\.png$/)

  const results = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze()
  const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))
  expect(serious).toEqual([])
})
