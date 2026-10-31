// FCP / LCP / CLS / TBT (long tasks) / bytes per type. Report only.
// usage: node scripts/qa/perf.js [baseUrl]
const path = require('path')
const { chromium } = require(path.resolve('node_modules/@playwright/test'))
const base = process.argv[2] || 'http://localhost:3100'
const profiles = {
  mobile4g: { vp: { width: 390, height: 844 }, mobile: true, net: { latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 }, cpu: 4 },
  desktop: { vp: { width: 1440, height: 900 }, mobile: false, net: { latency: 40, downloadThroughput: 10e6 / 8, uploadThroughput: 5e6 / 8 }, cpu: 1 },
}
;(async () => {
  const browser = await chromium.launch()
  for (const [name, pr] of Object.entries(profiles)) {
    for (const p of ['/', '/problema', '/technologia', '/kutatas']) {
      const ctx = await browser.newContext({ viewport: pr.vp, isMobile: pr.mobile, hasTouch: pr.mobile, deviceScaleFactor: pr.mobile ? 3 : 1 })
      const page = await ctx.newPage()
      const cdp = await ctx.newCDPSession(page)
      await cdp.send('Network.enable')
      await cdp.send('Network.emulateNetworkConditions', { offline: false, ...pr.net })
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: pr.cpu })
      const bytes = {}; let reqs = 0
      const types = {}
      cdp.on('Network.responseReceived', e => { types[e.requestId] = e.type })
      cdp.on('Network.loadingFinished', e => { reqs++; const t = types[e.requestId] || 'Other'; bytes[t] = (bytes[t] || 0) + e.encodedDataLength })
      await page.addInitScript(() => {
        window.__m = { lcp: 0, cls: 0, longTasks: 0, lcpEl: '' }
        new PerformanceObserver(l => { for (const e of l.getEntries()) { window.__m.lcp = e.startTime; window.__m.lcpEl = (e.element && (e.element.tagName + '.' + (e.element.className || '').toString().split(' ')[0])) || e.url } }).observe({ type: 'largest-contentful-paint', buffered: true })
        new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value }).observe({ type: 'layout-shift', buffered: true })
        new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.longTasks += Math.max(0, e.duration - 50) }).observe({ type: 'longtask', buffered: true })
      })
      const t0 = Date.now()
      await page.goto(base + p, { waitUntil: 'load', timeout: 120000 })
      const loadMs = Date.now() - t0
      await page.waitForTimeout(6000)
      const m = await page.evaluate(() => ({ ...window.__m, fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0 }))
      const kb = Object.fromEntries(Object.entries(bytes).map(([k, v]) => [k, Math.round(v / 1024)]))
      const total = Object.values(bytes).reduce((a, b) => a + b, 0)
      console.log(`${name.padEnd(9)} ${p.padEnd(13)} FCP ${(m.fcp / 1000).toFixed(1)}s  LCP ${(m.lcp / 1000).toFixed(1)}s (${m.lcpEl})  CLS ${m.cls.toFixed(3)}  TBT~${Math.round(m.longTasks)}ms  load ${(loadMs / 1000).toFixed(1)}s  ${reqs} req  ${Math.round(total / 1024)} KB ${JSON.stringify(kb)}`)
      await ctx.close()
    }
  }
  await browser.close()
})()
