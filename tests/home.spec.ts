import { test, expect } from '@playwright/test'
import { waitForAnimation, checkHoverEffect, testScrollAnimation } from './utils/test-helpers'

test.describe('Főoldal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('oldal betöltődik és cím megjelenik', async ({ page }) => {
    await expect(page).toHaveTitle(/Ásógép/i)
  })

  test('Hero szekció elemei láthatók', async ({ page }) => {
    // Badge
    await expect(page.locator('text=/Neumann/i').first()).toBeVisible()
    
    // Fő cím
    await expect(page.locator('h1').first()).toBeVisible()
    
    // Statisztikák (számok és címkék külön lehetnek)
    await expect(page.locator('text=/Helyszín/i').first()).toBeVisible()
    await expect(page.locator('text=/Kezelés/i').first()).toBeVisible()
    await expect(page.locator('text=/Hónap/i').first()).toBeVisible()
  })

  test('CTA gomb működik', async ({ page }) => {
    const ctaButton = page.locator('text=/Fedezd fel/i').first()
    await expect(ctaButton).toBeVisible()
    
    await ctaButton.click()
    await page.waitForURL(/problema/)
    await expect(page).toHaveURL(/problema/)
  })

  test('Kutatási kérdések szekció megjelenik görgetéskor', async ({ page }) => {
    // Görgetés a kutatási kérdések szekcióhoz
    await page.locator('text=/Mire kerestük a választ/i').scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)
    
    // Kártyák láthatók
    const cards = page.locator('[class*="card"]')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('Kutatási kérdés kártya linkek működnek', async ({ page }) => {
    await page.locator('text=/Mire kerestük a választ/i').scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)
    
    // Első kártya link tesztelése
    const firstLink = page.locator('a[href="/eredmenyek"]').first()
    await expect(firstLink).toBeVisible()
  })

  test('AnimatedNumber animáció működik', async ({ page }) => {
    // Várakozás az animáció befejezésére
    await page.waitForTimeout(2500)
    
    // Ellenőrizzük, hogy a számok megjelentek
    const statNumbers = page.locator('[class*="statNumber"], [class*="heroStat"]')
    const count = await statNumbers.count()
    expect(count).toBeGreaterThan(0)
  })

  test('reszponzív mobilnézet', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(300)
    
    // Hero még látható
    await expect(page.locator('h1')).toBeVisible()
  })
})
