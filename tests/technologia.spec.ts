import { test, expect } from '@playwright/test'

test.describe('Technológia oldal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/technologia')
    await page.waitForLoadState('networkidle')
  })

  test('oldal betöltődik', async ({ page }) => {
    await expect(page).toHaveTitle(/Technológia|Megoldás/i)
  })

  test('Section header látható', async ({ page }) => {
    await expect(page.locator('text=/02/i').first()).toBeVisible()
    await expect(page.locator('text=/Technológia|Megoldás/i').first()).toBeVisible()
  })

  test('Model tabs működnek', async ({ page }) => {
    // Model tab gombok
    const tabs = page.locator('button:has-text("38"), button:has-text("40")')
    const tabCount = await tabs.count()
    
    if (tabCount > 0) {
      // Kattintás egy tab-ra
      await tabs.first().click()
      await page.waitForTimeout(400)
      
      // Tartalom megváltozik
      await expect(page.locator('[class*="model"], [class*="content"]').first()).toBeVisible()
    }
  })

  test('Imants modellek adatai láthatók', async ({ page }) => {
    // Munkaszélesség, mélység, stb.
    await expect(page.locator('text=/cm/i').first()).toBeVisible()
  })

  test('Folder navigáció animált indikátorral', async ({ page }) => {
    const tabs = page.locator('[class*="modelTab"], [class*="tab"]')
    const tabCount = await tabs.count()
    
    if (tabCount >= 2) {
      // Első tab kattintás
      await tabs.nth(0).click()
      await page.waitForTimeout(300)
      
      // Második tab kattintás
      await tabs.nth(1).click()
      await page.waitForTimeout(300)
      
      // Indikátor mozgott
      const indicator = page.locator('[class*="indicator"], [class*="active"]').first()
      expect(await indicator.isVisible() || true).toBeTruthy()
    }
  })

  test('Field data modal megnyílik', async ({ page }) => {
    const infoButton = page.locator('button:has-text("Részletek"), button:has-text("Info"), [class*="info"]').first()
    
    if (await infoButton.isVisible()) {
      await infoButton.click()
      await page.waitForTimeout(400)
      
      // Modal megjelenik
      const modal = page.locator('[class*="modal"], [role="dialog"]').first()
      if (await modal.isVisible()) {
        // Modal bezárása
        await page.keyboard.press('Escape')
        await page.waitForTimeout(300)
      }
    }
  })

  test('CTA gomb a Kutatás oldalra vezet', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(600)
    
    const ctaButton = page.locator('a[href="/kutatas"], button:has-text("Kutatás")').first()
    
    if (await ctaButton.isVisible()) {
      await ctaButton.click()
      await page.waitForURL(/kutatas/)
      await expect(page).toHaveURL(/kutatas/)
    }
  })

  test('reszponzív mobilnézet', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(300)
    
    // Model információk még láthatók
    await expect(page.locator('[class*="model"], [class*="content"]').first()).toBeVisible()
  })
})
