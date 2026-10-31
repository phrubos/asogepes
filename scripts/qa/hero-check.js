// Fails (exit 1) when the home hero is blocked: (a) video blocked → title visible within 3s,
// (b) slow 4G phone → title visible within 4s and no .mp4 request, (c) slow desktop → title within 3s.
// "Visible" = the element at the h1's centre is the h1 (nothing covers it) and it is opaque.
// usage: node scripts/qa/hero-check.js [baseUrl]
const path = require('path')
const { chromium } = require(path.resolve('node_modules/@playwright/test'))
const base = process.argv[2] || 'http://localhost:3100'

const titleVisible = page => page.evaluate(() => {
  const h1 = document.querySelector('header h1, h1'); if (!h1) return false
  const b = h1.getBoundingClientRect(); if (!b.width) return false
  const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2)
  if (!hit || !(h1 === hit || h1.contains(hit))) return false
  for (let e = h1; e; e = e.parentElement) if (parseFloat(getComputedStyle(e).opacity) < 0.9) return false
  return true
}).catch(() => false)

async function timeToTitle(page, limitMs) {
  const t0 = Date.now()
  await page.goto(base + '/', { waitUntil: 'commit' })
  while (Date.now() - t0 < limitMs + 5000) {
    if (await titleVisible(page)) return Date.now() - t0
    await page.waitForTimeout(100)
  }
  return Infinity
}

async function throttle(ctx, page, down, latency, cpu) {
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency, downloadThroughput: down / 8, uploadThroughput: 750e3 / 8 })
  if (cpu) await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu })
}

;(async () => {
  const browser = await chromium.launch()
  const results = []
  // (a) video blocked, desktop
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage()
    await page.route('**/*.mp4', r => r.abort())
    const t = await timeToTitle(page, 3000)
    results.push(['video blocked (desktop): title visible', t, 3000]); await ctx.close()
  }
  // (b) slow 4G phone
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const page = await ctx.newPage()
    await throttle(ctx, page, 1.6e6, 150, 4)
    let mp4 = 0; page.on('request', r => { if (/\.mp4/.test(r.url())) mp4++ })
    const t = await timeToTitle(page, 4000)
    await page.waitForTimeout(4000)
    results.push(['slow 4G phone: title visible', t, 4000])
    results.push(['slow 4G phone: .mp4 requests', mp4, 0]); await ctx.close()
  }
  // (c) slow desktop
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage()
    await throttle(ctx, page, 4e6, 80, 1)
    const t = await timeToTitle(page, 3000)
    results.push(['slow desktop (4 Mbit/s): title visible', t, 3000]); await ctx.close()
  }
  await browser.close()
  let failed = 0
  for (const [name, value, limit] of results) {
    const ok = value <= limit; if (!ok) failed++
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${value === Infinity ? 'never' : value}${name.includes('requests') ? '' : 'ms'} (limit ${limit})`)
  }
  console.log(failed ? `\nhero-check FAILED (${failed})` : '\nhero-check passed')
  process.exit(failed ? 1 : 0)
})()
