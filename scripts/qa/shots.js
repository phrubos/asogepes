// Viewport-step screenshots of every page (desktop 1440x900, mobile 390x844) + console-error report.
// usage: node scripts/qa/shots.js <outDir> [baseUrl]
const path = require('path')
const { chromium } = require(path.resolve('node_modules/@playwright/test'))
const out = process.argv[2]
const base = process.argv[3] || 'http://localhost:3100'
const pages = ['/', '/problema', '/technologia', '/kutatas']
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } }
;(async () => {
  require('fs').mkdirSync(out, { recursive: true })
  const browser = await chromium.launch()
  const report = []
  for (const [vpName, vp] of Object.entries(viewports)) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: vpName === 'mobile', hasTouch: vpName === 'mobile' })
    for (const p of pages) {
      const page = await ctx.newPage()
      const errors = []
      page.on('pageerror', e => errors.push(e.message))
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
      await page.goto(base + p, { waitUntil: 'networkidle' })
      await page.waitForTimeout(2500)
      // the page grows while content-visibility sections render: re-read its height on every step
      const pageHeight = () => page.evaluate(() => document.documentElement.scrollHeight)
      let steps = 0
      for (let i = 0; i < 40 && i * vp.height < (await pageHeight()); i++, steps++) {
        await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), i * vp.height)
        await page.waitForTimeout(1200)
        const name = `${vpName}${p === '/' ? '_home' : p.replace(/\//g, '_')}_${String(i).padStart(2, '0')}.png`
        await page.screenshot({ path: path.join(out, name) })
      }
      const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      report.push({ vp: vpName, page: p, scrollHeight: await pageHeight(), steps, overflowX, errors: errors.slice(0, 5) })
      await page.close()
    }
    await ctx.close()
  }
  await browser.close()
  console.log(JSON.stringify(report, null, 1))
})()
