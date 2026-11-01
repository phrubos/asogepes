// Fails (exit 1) when hover-only content cannot be reached by touch or keyboard:
// phones show the card text in place (no hidden content); on a touch laptop a tap opens a card
// and it stays open, a second tap closes it;
// a mouse opens it by hovering and a click keeps it open; Enter opens and closes it;
// a tap on a /technologia hub option shows its mini folders (touch laptop), a tap on a phone topic scrolls to it
// (/technologia and /problema); the phone model switcher shows one model per tab and follows deep links;
// Enter on a /problema hero card navigates.
// usage: node scripts/qa/touch-check.js [baseUrl]
const path = require('path')
const { chromium } = require(path.resolve('node_modules/@playwright/test'))
const base = process.argv[2] || 'http://localhost:3100'
const CARDS = ['Gyakori öntözés hatása', 'Eketalp képződés']
// a sentence from each card's body, which phones show without any tap
const CARD_TEXT = { 'Gyakori öntözés hatása': 'Intenzíven öntözött', 'Eketalp képződés': 'A szántás 25-30 cm' }

const expanded = (page, title) => page.getAttribute(`[aria-expanded][aria-label="${title}"]`, 'aria-expanded')
const textLength = (page, title) => page.$eval(`[aria-expanded][aria-label="${title}"]`, e => e.innerText.length)

async function reveal(page, title) {
  await page.goto(base + '/problema', { waitUntil: 'networkidle' })
  const card = page.locator(`[aria-expanded][aria-label="${title}"]`)
  await card.scrollIntoViewIfNeeded(); await page.waitForTimeout(1200)
  return card
}

;(async () => {
  const browser = await chromium.launch()
  const results = []
  const ok = (name, pass) => results.push([name, pass])

  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const page = await ctx.newPage()
    await page.goto(base + '/problema', { waitUntil: 'networkidle' }); await page.waitForTimeout(1200)
    for (const title of CARDS) {
      const body = page.getByText(CARD_TEXT[title]).first()
      await body.scrollIntoViewIfNeeded(); await page.waitForTimeout(400)
      ok(`phone: "${title}" shows its text without a tap`, await body.isVisible())
    }
    ok('phone: no tap-to-open challenge cards', (await page.locator('[aria-expanded][aria-label="Gyakori öntözés hatása"]').count()) === 0)
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300)
    await page.locator('nav[aria-label="A három probléma"] button', { hasText: 'A szántás korlátai' }).tap(); await page.waitForTimeout(2500)
    const top = await page.evaluate(() => document.getElementById('ploughing-effects').getBoundingClientRect().top)
    ok(`phone: tap on a /problema topic scrolls to its section (top=${Math.round(top)})`, Math.abs(top - 80) < 60)
    await ctx.close()
  }

  for (const [label, opts] of [
    ['touch laptop', { viewport: { width: 1366, height: 768 }, hasTouch: true }],
  ]) {
    const ctx = await browser.newContext(opts); const page = await ctx.newPage()
    for (const title of CARDS) {
      const card = await reveal(page, title)
      const closedLength = await textLength(page, title)
      await card.tap(); await page.waitForTimeout(700)
      const openLength = await textLength(page, title)
      ok(`${label}: tap opens "${title}" and shows its text`, (await expanded(page, title)) === 'true' && openLength > closedLength + 20)
      await card.tap(); await page.waitForTimeout(700)
      ok(`${label}: second tap closes "${title}"`, (await expanded(page, title)) === 'false')
    }
    await ctx.close()
  }

  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage()
    for (const title of CARDS) {
      const card = await reveal(page, title)
      await card.hover(); await page.waitForTimeout(500)
      ok(`mouse: hover opens "${title}"`, (await expanded(page, title)) === 'true')
      await card.click(); await page.waitForTimeout(500)
      ok(`mouse: click keeps "${title}" open`, (await expanded(page, title)) === 'true')
      await page.mouse.move(5, 5); await page.waitForTimeout(500)
      await card.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(500)
      ok(`keyboard: Enter opens "${title}"`, (await expanded(page, title)) === 'true')
      await page.keyboard.press('Enter'); await page.waitForTimeout(500)
      ok(`keyboard: Enter closes "${title}"`, (await expanded(page, title)) === 'false')
    }
    // hero cards: Tab-focusable, Enter navigates
    await page.goto(base + '/problema', { waitUntil: 'networkidle' }); await page.waitForTimeout(1500)
    const heroCard = page.locator('[role="button"][class*="spadeCard"]').first()
    await heroCard.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(1500)
    ok('keyboard: Enter on a /problema hero card scrolls to its section', (await page.evaluate(() => window.scrollY)) > 300)
    await ctx.close()
  }

  {
    // touch laptop: the animated hub folder; a tap on an option shows its mini folders
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, hasTouch: true }); const page = await ctx.newPage()
    await page.goto(base + '/technologia', { waitUntil: 'networkidle' }); await page.waitForTimeout(1500)
    await page.locator('[role="button"][aria-expanded]', { hasText: 'Modellek' }).first().tap(); await page.waitForTimeout(1200)
    const folders = await page.locator('button[class*="miniFolder"]', { hasText: '38SX' }).count()
    ok('touch laptop: tap on the "Modellek" hub option shows the model folders', folders > 0)
    await ctx.close()
  }

  {
    // phone: a plain topic list replaces the hub folder; a tap scrolls to the section (its first subsection, like the menu)
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const page = await ctx.newPage()
    await page.goto(base + '/technologia', { waitUntil: 'networkidle' }); await page.waitForTimeout(1500)
    ok('phone: no hub folder is mounted', (await page.locator('[class*="hubFolder"]').count()) === 0)
    await page.locator('nav[aria-label="Témák"] button', { hasText: 'Modellek' }).tap(); await page.waitForTimeout(2500)
    const top = await page.evaluate(() => document.getElementById('model-38sx').getBoundingClientRect().top)
    ok(`phone: tap on the "Modellek" topic scrolls to the first model (top=${Math.round(top)})`, Math.abs(top - 80) < 60)
    // model switcher: one model at a time; a tab shows another; a deep link opens the model it names
    const shown = () => page.evaluate(() => [...document.querySelectorAll('[id^="model-"][role="tabpanel"]')].filter(e => e.offsetParent).map(e => e.id).join(','))
    ok('phone: only the first model is shown', (await shown()) === 'model-38sx')
    await page.locator('#model-38sx [role="tab"]', { hasText: '38WX' }).tap(); await page.waitForTimeout(800)
    ok('phone: tap on the 38WX tab shows 38WX', (await shown()) === 'model-38wx')
    await page.goto(base + '/technologia?section=model-40sx', { waitUntil: 'networkidle' }); await page.waitForTimeout(2500)
    const top40 = await page.evaluate(() => document.getElementById('model-40sx').getBoundingClientRect().top)
    ok(`phone: ?section=model-40sx opens 40SX and scrolls to it (top=${Math.round(top40)})`, (await shown()) === 'model-40sx' && Math.abs(top40 - 80) < 60)
    await ctx.close()
  }

  await browser.close()
  const failed = results.filter(([, pass]) => !pass).length
  for (const [name, pass] of results) console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}`)
  console.log(failed ? `\ntouch-check FAILED (${failed})` : '\ntouch-check passed')
  process.exit(failed ? 1 : 0)
})()
