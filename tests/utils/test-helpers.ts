import { Page, expect } from '@playwright/test'

/**
 * Várakozás animáció befejezésére
 */
export async function waitForAnimation(page: Page, selector: string, timeout = 1000) {
  await page.locator(selector).waitFor({ state: 'visible' })
  await page.waitForTimeout(timeout)
}

/**
 * Hover effekt ellenőrzése
 */
export async function checkHoverEffect(page: Page, selector: string): Promise<boolean> {
  const element = page.locator(selector).first()
  
  const beforeStyles = await element.evaluate(el => ({
    transform: window.getComputedStyle(el).transform,
    boxShadow: window.getComputedStyle(el).boxShadow,
  }))
  
  await element.hover()
  await page.waitForTimeout(400)
  
  const afterStyles = await element.evaluate(el => ({
    transform: window.getComputedStyle(el).transform,
    boxShadow: window.getComputedStyle(el).boxShadow,
  }))
  
  return beforeStyles.transform !== afterStyles.transform || 
         beforeStyles.boxShadow !== afterStyles.boxShadow
}

/**
 * Scroll-triggered animáció tesztelése
 */
export async function testScrollAnimation(
  page: Page, 
  triggerSelector: string, 
  animatedSelector: string
): Promise<boolean> {
  await page.locator(triggerSelector).scrollIntoViewIfNeeded()
  await page.waitForTimeout(800)
  
  const element = page.locator(animatedSelector).first()
  const opacity = await element.evaluate(el => 
    window.getComputedStyle(el).opacity
  )
  
  return parseFloat(opacity) === 1
}

/**
 * Oldal betöltés ellenőrzése
 */
export async function checkPageLoad(page: Page, url: string, title: string) {
  await page.goto(url)
  await expect(page).toHaveTitle(new RegExp(title, 'i'))
  await page.waitForLoadState('networkidle')
}

/**
 * Navigáció ellenőrzése
 */
export async function checkNavigation(page: Page, linkText: string, expectedUrl: string) {
  await page.getByRole('link', { name: linkText }).click()
  await page.waitForURL(expectedUrl)
  await expect(page).toHaveURL(expectedUrl)
}

/**
 * Reszponzív nézet tesztelése
 */
export async function testResponsiveView(
  page: Page, 
  selector: string,
  viewportWidth: number
) {
  await page.setViewportSize({ width: viewportWidth, height: 800 })
  await page.waitForTimeout(300)
  
  const element = page.locator(selector).first()
  const isVisible = await element.isVisible()
  
  return isVisible
}
