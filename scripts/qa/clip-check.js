// Fails (exit 1) when text is cut off: by the viewport horizontally, or partially by an
// ancestor with overflow hidden/clip. Scrollable ancestors (auto/scroll) are exempt, and so is
// content an ancestor hides completely (closed accordions, carousel slides).
// usage: node scripts/qa/clip-check.js [baseUrl] [--sizes=360x844,390x844] [--pages=/,/kutatas]
const path = require('path')
const { chromium } = require(path.resolve('node_modules/@playwright/test'))
const arg = (name, def) => (process.argv.find(a => a.startsWith(`--${name}=`)) || '').split('=')[1] || def
const base = process.argv.slice(2).find(a => !a.startsWith('--')) || 'http://localhost:3100'
const sizes = arg('sizes', '360x844,390x844,1440x900,1536x864,1366x768').split(',').map(s => s.split('x').map(Number))
const pages = arg('pages', '/,/problema,/technologia,/kutatas').split(',')

function findClipped() {
  const vw = document.documentElement.clientWidth
  const out = []
  const hidden = el => {
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const cs = getComputedStyle(e)
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return true
    }
    return false
  }
  const leaves = [...document.querySelectorAll('body *')].filter(el => {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) return false
    const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('')
    return own.length > 2
  })
  for (const el of leaves) {
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height || hidden(el)) continue
    // 'full' = an ancestor hides it completely (intentional), 'partial' = cut off
    const clipBy = (a, cs) => {
      const ar = a.getBoundingClientRect()
      let partial = null
      for (const [axis, ov, s, e, as, ae] of [['x', cs.overflowX, r.left, r.right, ar.left, ar.right], ['y', cs.overflowY, r.top, r.bottom, ar.top, ar.bottom]]) {
        if (!/hidden|clip/.test(ov)) continue
        if (e <= as + 1 || s >= ae - 1) return { full: true }
        if (s < as - 1.5 || e > ae + 1.5) partial = axis
      }
      return { partial }
    }
    let reason = null, scrollX = false, intentional = false
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const cs = getComputedStyle(a)
      if (/auto|scroll/.test(cs.overflowX)) scrollX = true
      const c = clipBy(a, cs)
      if (c.full) { intentional = true; break }
      if (c.partial && !reason) reason = `clipped-${c.partial} by ${a.tagName.toLowerCase()}.${String(a.className).split(' ')[0]}`
    }
    if (intentional) continue
    if (!reason && !scrollX && (r.right > vw + 1.5 || r.left < -1.5)) reason = `outside viewport (right=${Math.round(r.right)}, vw=${vw})`
    if (reason) out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} "${el.textContent.trim().slice(0, 40)}" — ${reason}`)
  }
  return out
}

;(async () => {
  const browser = await chromium.launch()
  let total = 0
  for (const [w, h] of sizes) {
    const mobile = w < 768
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile })
    const page = await ctx.newPage()
    for (const p of pages) {
      await page.goto(base + p, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1500)
      // walk the page so in-view animations reach their final state
      const height = await page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y < height; y += h) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(350) }
      const found = new Set()
      for (let y = 0; y < height; y += h) {
        await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(150)
        for (const f of await page.evaluate(findClipped)) found.add(f)
      }
      total += found.size
      console.log(`${found.size ? 'FAIL' : 'ok  '} ${w}x${h} ${p}: ${found.size}`)
      ;[...found].slice(0, 8).forEach(f => console.log('      ' + f))
    }
    await ctx.close()
  }
  await browser.close()
  console.log(total ? `\nclip-check FAILED: ${total} clipped text element(s)` : '\nclip-check passed')
  process.exit(total ? 1 : 0)
})()
