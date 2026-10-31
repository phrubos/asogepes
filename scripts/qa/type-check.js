// Fails (exit 1) when body text median < 15px or any visible HTML text < 12px.
// SVG <text> is excluded (its size scales with the viewBox).
// usage: node scripts/qa/type-check.js [baseUrl]
const path = require('path')
const { chromium } = require(path.resolve('node_modules/@playwright/test'))
const base = process.argv[2] || 'http://localhost:3100'
const MEDIAN_MIN = 15, LABEL_MIN = 12

;(async () => {
  const browser = await chromium.launch()
  let failed = 0
  for (const [w, h] of [[1440, 900], [1536, 864], [390, 844]]) {
    const mobile = w < 768
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile })
    const page = await ctx.newPage()
    for (const p of ['/', '/problema', '/technologia', '/kutatas']) {
      await page.goto(base + p, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1500)
      const r = await page.evaluate(() => {
        const body = [], small = []
        for (const el of document.querySelectorAll('body *')) {
          if (el.closest('svg') || ['SCRIPT', 'STYLE'].includes(el.tagName)) continue
          const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ')
          if (own.length < 2) continue
          const b = el.getBoundingClientRect(); const cs = getComputedStyle(el)
          if (!b.width || !b.height || cs.visibility === 'hidden') continue
          const fs = parseFloat(cs.fontSize)
          if (own.length >= 40) body.push(fs)
          if (fs < 12) small.push(`${fs.toFixed(1)}px ${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} "${own.slice(0, 24)}"`)
        }
        body.sort((a, b) => a - b)
        return { median: body.length ? body[Math.floor(body.length / 2)] : null, n: body.length, small }
      })
      const bad = (r.median !== null && r.median < MEDIAN_MIN) || r.small.length > 0
      if (bad) failed++
      console.log(`${bad ? 'FAIL' : 'ok  '} ${w}x${h} ${p.padEnd(12)} body median ${r.median ?? '-'}px (n=${r.n}), <${LABEL_MIN}px: ${r.small.length}`)
      r.small.slice(0, 6).forEach(s => console.log('      ' + s))
    }
    await ctx.close()
  }
  await browser.close()
  console.log(failed ? `\ntype-check FAILED on ${failed} page/viewport(s)` : '\ntype-check passed')
  process.exit(failed ? 1 : 0)
})()
