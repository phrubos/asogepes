// Phones and tablets: one gutter, left-aligned titles, even title spacing.
// usage: node scripts/qa/layout-check.js [baseUrl=http://localhost:3100] [--widths=390,900]
// Fails when, at <=1024px,
//   - a top-level card or a free-standing title/badge does not start (and end) at the section gutter,
//   - a title or badge outside a card is centred (data badges and the 3D play label excepted),
//   - a section title sits more than 24px, or a badge more than 16px, above its content.
// Elements beside an icon or a number in the same row are skipped (their text starts after the icon).
const path = require('path')
const { chromium } = require(path.resolve('node_modules/@playwright/test'))

const base = (process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'http://localhost:3100').replace(/\/$/, '')
const widthsArg = process.argv.find(a => a.startsWith('--widths='))
const WIDTHS = widthsArg ? widthsArg.slice(9).split(',').map(Number) : [390, 900]
const PAGES = ['/problema', '/technologia', '/kutatas']
const CENTRE_OK = /diffBadge|playLabel|scaleLabel|scaleValue/
const MAX_TITLE_GAP = 24
const MAX_BADGE_GAP = 16

;(async () => {
  const browser = await chromium.launch()
  let failures = 0
  for (const W of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: W, height: 844 }, isMobile: true, hasTouch: true })
    for (const url of PAGES) {
      await page.goto(base + url, { waitUntil: 'load', timeout: 120000 })
      await page.waitForTimeout(1500)
      // lazy sections report placeholder sizes; walk the page so every entrance animation has finished
      await page.addStyleTag({ content: '* { content-visibility: visible !important }' })
      // re-read the height on every step, in case the page still grows (fonts, images, late entrances)
      const pageHeight = () => page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y < (await pageHeight()); y += 300) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(120) }
      await page.waitForTimeout(1500)

      const problems = await page.evaluate(({ CENTRE_OK, MAX_TITLE_GAP, MAX_BADGE_GAP }) => {
        const centreOk = new RegExp(CENTRE_OK)
        const out = []
        const main = document.querySelector('main')
        const section = main.querySelector('section[class*=ScrollLayout_section]')
        const gutter = section ? parseFloat(getComputedStyle(section).paddingLeft) : 20
        const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0 }
        const isCard = e => { const cs = getComputedStyle(e); return (parseFloat(cs.borderLeftWidth) > 0 && cs.borderLeftStyle !== 'none') || !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) || cs.backgroundImage !== 'none' }
        const inCard = e => { for (let a = e.parentElement; a && a !== main; a = a.parentElement) if (isCard(a) && a.getBoundingClientRect().width < innerWidth - 2) return true; return false }
        const skip = e => e.closest('nav, [class*=MobileSectionBar], [class*=odal], [class*=sheet], [class*=Sheet], [aria-hidden=true]')
        // something visible to the left in the same row (an icon, a number) up to 3 levels up
        const besideSomething = e => {
          for (let a = e, i = 0; a && a !== main && i < 3; a = a.parentElement, i++) {
            const r = a.getBoundingClientRect()
            for (let s = a.previousElementSibling; s; s = s.previousElementSibling) {
              const q = s.getBoundingClientRect()
              if (vis(s) && q.right <= r.left + 1 && q.bottom > r.top && q.top < r.bottom) return true
            }
          }
          return false
        }
        const name = e => String(e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className).split(' ')[0].replace(/__\w+$/, '') || e.tagName
        const text = e => (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40)
        const y = e => Math.round(e.getBoundingClientRect().top + scrollY)
        const painted = el => { const cs = getComputedStyle(el); return /^(IMG|CANVAS|svg|VIDEO)$/.test(el.tagName) || isCard(el) || [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) }
        // vertical space from a title (or badge) to the first painted thing after it
        const gapBelow = e => {
          let blk = e, next = null
          for (let i = 0; i < 4 && blk && blk !== main; i++) {
            let s = blk.nextElementSibling
            while (s && !vis(s)) s = s.nextElementSibling
            if (s) { next = s; break }
            blk = blk.parentElement
          }
          if (!next) return null
          let top = Infinity
          for (const d of [next, ...next.querySelectorAll('*')]) if (vis(d) && painted(d)) top = Math.min(top, d.getBoundingClientRect().top)
          return top === Infinity ? null : Math.round(top - e.getBoundingClientRect().bottom)
        }

        // 1. top-level cards span the column
        for (const e of main.querySelectorAll('div, section, article, figure')) {
          if (!vis(e) || skip(e) || !isCard(e) || inCard(e)) continue
          const r = e.getBoundingClientRect()
          if (r.width < 200 || r.height < 60 || r.width > innerWidth - 2) continue
          if (besideSomething(e)) continue
          const l = Math.round(r.left), rr = Math.round(innerWidth - r.right)
          // two-up grids are fine as long as the row starts and ends at the gutter
          if (Math.abs(l - gutter) > 3 && Math.abs(rr - gutter) > 3) out.push(`card off the gutter (l=${l} r=${rr}, gutter ${gutter})  ${name(e)} y=${y(e)}`)
        }

        // 2. titles and badges outside cards: at the gutter, left aligned, close to their content
        for (const e of main.querySelectorAll('h1, h2, h3, [class*=adge]')) {
          if (!vis(e) || skip(e) || inCard(e) || !text(e)) continue
          const isBadge = !/^H\d$/.test(e.tagName)
          const cs = getComputedStyle(e)
          const r = e.getBoundingClientRect()
          const par = e.parentElement.getBoundingClientRect()
          // a badge's own text-align only centres the text inside the pill
          const centred = (!isBadge && cs.textAlign === 'center') || (r.width < par.width - 20 && Math.abs((r.left - par.left) - (par.right - r.right)) < 4)
          if (centred && !centreOk.test(name(e))) out.push(`centred title  ${name(e)} y=${y(e)} | ${text(e)}`)
          if (!centred && !besideSomething(e) && Math.abs(Math.round(r.left) - gutter) > 3) out.push(`title off the gutter (x=${Math.round(r.left)}, gutter ${gutter})  ${name(e)} y=${y(e)} | ${text(e)}`)
          if (besideSomething(e) || e.closest('header, [class*=hero], [class*=Hero]')) continue
          const g = gapBelow(e)
          const max = isBadge ? MAX_BADGE_GAP : MAX_TITLE_GAP
          if (g !== null && g > max) out.push(`${isBadge ? 'badge' : 'title'} gap ${g}px > ${max}px  ${name(e)} y=${y(e)} | ${text(e)}`)
        }
        return [...new Set(out)]
      }, { CENTRE_OK: CENTRE_OK.source, MAX_TITLE_GAP, MAX_BADGE_GAP })

      for (const p of problems) console.log(`FAIL ${W}px ${url}: ${p}`)
      failures += problems.length
    }
    await page.close()
  }
  await browser.close()
  if (failures) { console.log(`layout-check: ${failures} problem(s)`); process.exit(1) }
  console.log('layout-check passed')
})()
