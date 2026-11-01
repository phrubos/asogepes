// Fails (exit 1) when prefers-reduced-motion: reduce is not honoured:
// (a) the home page 0.5s and 3s after its images loaded must be pixel-identical (final state at once),
// (b) no <video> on /technologia plays on its own,
// (c) the SMIL rain on /problema (which CSS and Framer cannot reach) is paused even in view.
// usage: node scripts/qa/motion-check.js [baseUrl]
const path = require('path')
const { chromium } = require(path.resolve('node_modules/@playwright/test'))
const base = process.argv[2] || 'http://localhost:3100'

;(async () => {
  const browser = await chromium.launch()
  const results = []
  for (const [name, opts] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['phone', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }]]) {
    const ctx = await browser.newContext({ ...opts, reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    await page.goto(base + '/', { waitUntil: 'load' })
    // image loading is not motion: start the clock once every image is decoded
    await page.waitForFunction(() => [...document.images].every(i => i.complete))
    await page.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))))
    await page.waitForTimeout(500)
    const early = await page.screenshot()
    await page.waitForTimeout(2500)
    const late = await page.screenshot()
    results.push([`${name}: home identical at 0.5s and 3s`, early.equals(late)])
    await ctx.close()
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    await page.goto(base + '/technologia', { waitUntil: 'load' })
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    let playing = 0
    for (let y = 0; y < height; y += 800) {
      await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(400)
      playing = Math.max(playing, await page.evaluate(() => [...document.querySelectorAll('video')].filter(v => !v.paused).length))
    }
    results.push(['/technologia: no video plays on its own', playing === 0])
    await ctx.close()
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    await page.goto(base + '/problema', { waitUntil: 'load' })
    await page.$eval('svg:has(animate)', s => s.scrollIntoView({ block: 'center' })); await page.waitForTimeout(1500)
    results.push(['/problema: SMIL rain paused in view', await page.$eval('svg:has(animate)', s => s.animationsPaused())])
    await ctx.close()
  }
  await browser.close()
  const failed = results.filter(([, ok]) => !ok).length
  for (const [name, ok] of results) console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`)
  console.log(failed ? `\nmotion-check FAILED (${failed})` : '\nmotion-check passed')
  process.exit(failed ? 1 : 0)
})()
