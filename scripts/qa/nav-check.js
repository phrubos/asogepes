// Fails (exit 1) when: a page's server HTML has no <h1> or hides it behind a Suspense boundary, a full-screen
// overlay (z-index >= 9000, covering the viewport) is visible after load, a menu click takes > 1s
// to show the new page's <h1>, or ?section= deep links do not scroll to their section.
// usage: node scripts/qa/nav-check.js [baseUrl]
const path = require('path')
const { chromium } = require(path.resolve('node_modules/@playwright/test'))
const base = process.argv[2] || 'http://localhost:3100'

const overlayVisible = page => page.evaluate(() => [...document.querySelectorAll('body *')].some(e => {
  const cs = getComputedStyle(e); const b = e.getBoundingClientRect()
  return parseInt(cs.zIndex) >= 9000 && cs.position === 'fixed' && b.width >= innerWidth * 0.9 && b.height >= innerHeight * 0.9 && parseFloat(cs.opacity) > 0.1 && cs.visibility !== 'hidden'
}))

;(async () => {
  const results = []
  for (const p of ['/', '/problema', '/technologia', '/kutatas']) {
    const html = await (await fetch(base + p)).text()
    results.push([`server HTML of ${p} contains <h1>`, /<h1[\s>]/.test(html)])
    results.push([`server HTML of ${p} is not held behind a Suspense boundary`, !/<template id="B:\d+"/.test(html)])
  }
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(base + '/problema', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  results.push(['no full-screen overlay 300ms after load', !(await overlayVisible(page))])
  for (const [label, href] of [['Technológia', '/technologia'], ['Kutatás', '/kutatas']]) {
    const before = await page.evaluate(() => document.querySelector('h1')?.textContent)
    const t0 = Date.now()
    await page.click(`nav[aria-label="Fő navigáció"] a[href="${href}"]`)
    await page.waitForFunction(b => { const h = document.querySelector('h1'); return location.pathname !== '/problema' && h && h.textContent !== b && h.getBoundingClientRect().width > 0 }, before, { timeout: 5000 }).catch(() => {})
    const ms = Date.now() - t0
    results.push([`menu → ${label}: new <h1> in ${ms}ms (≤1000)`, ms <= 1000])
    results.push([`menu → ${label}: no overlay`, !(await overlayVisible(page))])
  }
  for (const [p, id] of [['/kutatas', 'lakitelek'], ['/technologia', 'model-40sx']]) {
    await page.goto(`${base}${p}?section=${id}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2500)
    const top = await page.evaluate(id => document.getElementById(id)?.getBoundingClientRect().top, id)
    results.push([`${p}?section=${id} scrolls to it (top=${Math.round(top)})`, top !== undefined && Math.abs(top) < 300])
  }
  await browser.close()
  let failed = 0
  for (const [name, ok] of results) { if (!ok) failed++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`) }
  console.log(failed ? `\nnav-check FAILED (${failed})` : '\nnav-check passed')
  process.exit(failed ? 1 : 0)
})()
