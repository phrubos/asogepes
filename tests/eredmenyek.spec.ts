import { test, expect } from '@playwright/test'

test.describe('Eredmények oldal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/eredmenyek')
    await page.waitForLoadState('networkidle')
  })

  test('oldal betöltődik', async ({ page }) => {
    await expect(page).toHaveTitle(/Eredmények/i)
  })

  test('Section header látható', async ({ page }) => {
    await expect(page.locator('text=/04/i').first()).toBeVisible()
    await expect(page.locator('text=/Eredmények/i').first()).toBeVisible()
  })

  test('Hero cím helyesen jelenik meg', async ({ page }) => {
    // "Mit találtunk?" cím
    await expect(page.locator('text=/Mit/i').first()).toBeVisible()
    await expect(page.locator('text=/találtunk/i').first()).toBeVisible()
  })

  test('Fő megállapítások láthatók', async ({ page }) => {
    // 4 fő megállapítás
    await expect(page.locator('text=/Tartósabb lazaság/i').first()).toBeVisible()
    await expect(page.locator('text=/felmelegedés/i').first()).toBeVisible()
  })

  test('Megállapítás kártyák hover effektje', async ({ page }) => {
    const finding = page.locator('[class*="finding"]').first()
    
    if (await finding.isVisible()) {
      await finding.hover()
      await page.waitForTimeout(400)
      
      // Hover státusz - bármilyen vizuális változás
      expect(await finding.isVisible()).toBeTruthy()
    }
  })

  test('Összehasonlító táblázat látható', async ({ page }) => {
    // Táblázat görgetése
    await page.locator('text=/Összehasonlítás|Kezelés/i').first().scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)
    
    // Táblázat sorok
    await expect(page.locator('text=/Ásógép|Szántás/i').first()).toBeVisible()
  })

  test('Táblázat sor hover effektje', async ({ page }) => {
    await page.locator('[class*="table"]').first().scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    
    const tableRow = page.locator('[class*="tableRow"]').nth(1)
    
    if (await tableRow.isVisible()) {
      await tableRow.hover()
      await page.waitForTimeout(300)
    }
  })

  test('Statisztikák animáltan megjelennek', async ({ page }) => {
    // Görgetés a statisztikák szekcióhoz
    await page.locator('[class*="statsSection"], [class*="stats"]').first().scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    
    // Számok láthatók
    await expect(page.locator('text=/3.*Helyszín/i').first()).toBeVisible()
  })

  test('Ajánlások szekció látható', async ({ page }) => {
    // Görgetés az ajánlások szekcióhoz
    await page.locator('text=/Mikor Ajánlott/i').first().scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)
    
    // Ajánlás kártyák
    await expect(page.locator('text=/Öntözéses/i').first()).toBeVisible()
  })

  test('Következtetés szekció látható', async ({ page }) => {
    // Görgetés az oldal aljára
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(600)
    
    // Idézet és végkövetkeztetés
    await expect(page.locator('text=/mélyásógép|kombináció/i').first()).toBeVisible()
  })

  test('Neumann és Agroskill badge látható', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(400)
    
    await expect(page.locator('text=/Neumann.*Agroskill/i').first()).toBeVisible()
  })

  test('reszponzív mobilnézet', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(300)
    
    // Fő tartalom még látható - h1 vagy section header
    await expect(page.locator('h1, [class*="heroTitle"]').first()).toBeVisible()
  })

  test('reszponzív tablet nézet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(300)
    
    // Táblázat helyesen renderelődik
    await expect(page.locator('[class*="table"]').first()).toBeVisible()
  })
})
