// Fails (exit 1) when a phone layout (390x844, also 360x740) has:
// (a) an empty vertical band taller than 300px between pieces of content,
// (b) text boxes that overlap each other (two different texts drawn on top of one another),
// (c) a visible tap target (button, link, [role=button]) smaller than 44x44 px (24px for inline text links).
// usage: node scripts/qa/mobile-check.js [baseUrl] [--pages=/,/problema] [--show=N]
const path = require('path')
const { chromium } = require(path.resolve('node_modules/@playwright/test'))
const args = process.argv.slice(2)
const base = args.find(a => !a.startsWith('--')) || 'http://localhost:3100'
const opt = name => (args.find(a => a.startsWith(`--${name}=`)) || '').split('=')[1]
const pages = (opt('pages') || '/,/problema,/technologia,/kutatas').split(',')
const show = +(opt('show') || 6)
const sizes = [[390, 844], [360, 740]]

;(async () => {
  const browser = await chromium.launch()
  let failed = 0
  for (const [w, h] of sizes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true })
    const page = await ctx.newPage()
    for (const p of pages) {
      await page.goto(base + p, { waitUntil: 'load', timeout: 60000 })
      await page.waitForTimeout(1200)
      // walk the page so lazy sections render and in-view entrances finish
      const height = await page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y < height; y += h / 2) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(200) }
      await page.waitForTimeout(800)
      const r = await page.evaluate(() => {
        const vis = e => { const s = getComputedStyle(e); return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05 }
        const name = e => `${e.tagName.toLowerCase()}.${String(e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className).split(' ')[0].split('__')[0].slice(0, 40)}`
        const fixed = e => { for (let n = e; n; n = n.parentElement) { const pos = getComputedStyle(n).position; if (pos === 'fixed' || pos === 'sticky') return true } return false }
        // a box cut away by an overflow:hidden/clip ancestor is not drawn, so it cannot overlap anything
        const clippedOut = (el, rc) => {
          const cx = (rc.left + rc.right) / 2, cy = (rc.top + rc.bottom) / 2
          for (let n = el.parentElement; n; n = n.parentElement) {
            const s = getComputedStyle(n)
            if (/hidden|clip/.test(s.overflowX + s.overflowY)) { const r = n.getBoundingClientRect(); if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return true }
          }
          return false
        }
        const main = document.querySelector('main') || document.body
        const sy = window.scrollY
        // content boxes: text runs, images, svg, canvas, video
        const boxes = []
        const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT)
        for (let n; (n = walker.nextNode());) {
          if (!n.textContent.trim() || !n.parentElement || !vis(n.parentElement) || fixed(n.parentElement)) continue
          const range = document.createRange(); range.selectNodeContents(n)
          for (const rc of range.getClientRects()) if (rc.width > 1 && rc.height > 1 && !clippedOut(n.parentElement, rc)) boxes.push({ top: rc.top + sy, bottom: rc.bottom + sy, left: rc.left, right: rc.right, el: n.parentElement, text: n.textContent.trim().slice(0, 40) })
        }
        for (const e of main.querySelectorAll('img, svg, canvas, video')) {
          if (!vis(e) || fixed(e) || e.closest('button, a') && e.tagName === 'svg') continue
          const rc = e.getBoundingClientRect(); if (rc.width > 40 && rc.height > 40) boxes.push({ top: rc.top + sy, bottom: rc.bottom + sy, media: true })
        }
        // (a) gaps
        const sorted = boxes.slice().sort((a, b) => a.top - b.top)
        const gaps = []; let reach = sorted.length ? sorted[0].bottom : 0
        for (const b of sorted) { if (b.top - reach > 300) gaps.push(`${Math.round(reach)}→${Math.round(b.top)} (${Math.round(b.top - reach)}px) before "${b.text || 'media'}"`); reach = Math.max(reach, b.bottom) }
        // (b) overlapping texts from different elements
        const texts = boxes.filter(b => b.text)
        const overlaps = []
        for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
          const a = texts[i], c = texts[j]
          if (a.el === c.el || a.el.contains(c.el) || c.el.contains(a.el)) continue
          const ix = Math.min(a.right, c.right) - Math.max(a.left, c.left), iy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top)
          if (ix > 4 && iy > 4) overlaps.push(`"${a.text}" × "${c.text}"`)
          if (overlaps.length > 20) break
        }
        // (c) tap targets
        const small = []
        for (const e of document.querySelectorAll('button, a[href], [role="button"], input, select')) {
          if (!vis(e)) continue
          const rc = e.getBoundingClientRect(); if (rc.width === 0 || rc.height === 0) continue
          const inline = e.tagName === 'A' && getComputedStyle(e).display === 'inline'
          const min = inline ? 24 : 44
          if (rc.width < min || rc.height < min) small.push(`${name(e)} "${(e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(rc.width)}x${Math.round(rc.height)}`)
        }
        return { gaps, overlaps: [...new Set(overlaps)], small: [...new Set(small)] }
      })
      const n = r.gaps.length + r.overlaps.length + r.small.length
      failed += n
      console.log(`${n ? 'FAIL' : 'ok  '} ${w}x${h} ${p}: gaps ${r.gaps.length}, overlaps ${r.overlaps.length}, small targets ${r.small.length}`)
      for (const [k, list] of Object.entries({ gap: r.gaps, overlap: r.overlaps, small: r.small })) for (const l of list.slice(0, show)) console.log(`      ${k}: ${l}`)
    }
    await ctx.close()
  }
  await browser.close()
  console.log(failed ? `\nmobile-check FAILED (${failed})` : '\nmobile-check passed')
  process.exit(failed ? 1 : 0)
})()
