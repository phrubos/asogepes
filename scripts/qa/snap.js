// Screenshot and measure one element at a phone and a desktop width (used by the before/after mod).
// usage: node scripts/qa/snap.js <base> "<selector>" <outPrefix> [--pages=/problema,/kutatas] [--widths=390,1440]
// Tries the pages in order and uses the first one where the selector matches a visible element.
// Prints JSON: { page, results: { [width]: { png, left, right, width, height, above, below, margin, padding } } }
// "above" / "below": px to the previous / next visible sibling (negative: overlap).
const path = require('path')
const { chromium } = require(path.resolve('node_modules/@playwright/test'))

const [base, selector, outPrefix] = process.argv.slice(2)
const arg = name => (process.argv.find(a => a.startsWith(`--${name}=`)) || '').split('=')[1]
const pages = (arg('pages') || '/,/problema,/technologia,/kutatas').split(',')
const widths = (arg('widths') || '390,1440').split(',').map(Number)
if (!base || !selector || !outPrefix) { console.log('usage: node scripts/qa/snap.js <base> "<selector>" <outPrefix>'); process.exit(1) }

async function shoot(browser, page, w) {
  const tab = await browser.newPage({ viewport: { width: w, height: w <= 1024 ? 844 : 900 }, isMobile: w <= 1024, hasTouch: w <= 1024 })
  try {
    await tab.goto(base.replace(/\/$/, '') + page, { waitUntil: 'load', timeout: 60000 })
    await tab.addStyleTag({ content: '* { content-visibility: visible !important }' })
    const found = await tab.evaluate(s => {
      const e = [...document.querySelectorAll(s)].find(x => x.getBoundingClientRect().height > 0)
      if (!e) return false
      e.setAttribute('data-snap', '1')
      scrollTo(0, e.getBoundingClientRect().top + scrollY - 120)
      return true
    }, selector)
    if (!found) return null
    // whileInView entrances finish
    await tab.waitForTimeout(1800)
    const m = await tab.evaluate(() => {
      const e = document.querySelector('[data-snap]')
      const r = e.getBoundingClientRect(), c = getComputedStyle(e)
      const visible = x => x && x.getBoundingClientRect().height > 0
      let prev = e.previousElementSibling; while (prev && !visible(prev)) prev = prev.previousElementSibling
      let next = e.nextElementSibling; while (next && !visible(next)) next = next.nextElementSibling
      const side = v => v.split(' ').map(x => Math.round(parseFloat(x))).join(' ')
      return {
        left: Math.round(r.left), right: Math.round(innerWidth - r.right),
        width: Math.round(r.width), height: Math.round(r.height),
        above: prev ? Math.round(r.top - prev.getBoundingClientRect().bottom) : null,
        below: next ? Math.round(next.getBoundingClientRect().top - r.bottom) : null,
        margin: side(`${c.marginTop} ${c.marginRight} ${c.marginBottom} ${c.marginLeft}`),
        padding: side(`${c.paddingTop} ${c.paddingRight} ${c.paddingBottom} ${c.paddingLeft}`),
      }
    })
    const png = `${outPrefix}-${w}.png`
    // the element plus a little context around it
    const box = await tab.locator('[data-snap]').boundingBox()
    const vp = tab.viewportSize()
    const clip = { x: 0, y: Math.max(0, box.y - 40), width: vp.width, height: Math.min(vp.height, box.height + 80) }
    await tab.screenshot({ path: png, clip })
    return { png, ...m }
  } finally { await tab.close() }
}

;(async () => {
  const browser = await chromium.launch()
  try {
    for (const page of pages) {
      const shots = await Promise.all(widths.map(w => shoot(browser, page, w).catch(err => { console.error(String(err).slice(0, 300)); return null })))
      if (shots.some(Boolean)) {
        const results = {}
        widths.forEach((w, i) => { results[w] = shots[i] })
        console.log(JSON.stringify({ page, results }))
        return
      }
    }
    console.log(JSON.stringify({ page: null, results: {} }))
  } finally { await browser.close() }
})()
