// Why does this element sit where it does? Prints the element and its ancestors up to <main>
// with the box, margins, paddings, gap, flex/grid alignment and max-width, plus the gap to the next sibling.
// usage: node scripts/qa/trace.js <url> "<css selector>" [width=390] [height=844]
//   e.g. node scripts/qa/trace.js http://localhost:3000/kutatas "[class*=Szentkir_lyTempPage_header]" 1440 900
// Class names are CSS-module hashed: match with [class*=Component_class]; accented names are
// escaped with "_" (Szentkirály -> Szentkir_ly).
const path = require('path')
const { chromium } = require(path.resolve('node_modules/@playwright/test'))

const [url, selector, w = '390', h = '844'] = process.argv.slice(2)
if (!url || !selector) { console.log('usage: node scripts/qa/trace.js <url> "<selector>" [width] [height]'); process.exit(1) }

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: +w, height: +h }, isMobile: +w <= 1024, hasTouch: +w <= 1024 })
  await page.goto(url, { waitUntil: 'load', timeout: 120000 })
  await page.waitForTimeout(1500)
  await page.addStyleTag({ content: '* { content-visibility: visible !important }' })
  // scroll the element in so whileInView entrances finish (their translate would skew the numbers)
  const found = await page.evaluate(s => { const e = document.querySelector(s); if (!e) return false; scrollTo(0, e.getBoundingClientRect().top + scrollY - 200); return true }, selector)
  if (!found) { console.log('no element matches', selector); await browser.close(); process.exit(1) }
  await page.waitForTimeout(2500)
  console.log(await page.evaluate(s => {
    const short = e => (String(e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className).split(' ')[0] || e.tagName).slice(0, 44)
    const box = (e, i) => {
      const r = e.getBoundingClientRect(), c = getComputedStyle(e)
      const px = v => v === '0px' ? '0' : v
      const parts = [`x=${Math.round(r.left)}..${Math.round(r.right)} y=${Math.round(r.top)}..${Math.round(r.bottom)} (${Math.round(r.width)}x${Math.round(r.height)})`,
        `m=${px(c.marginTop)} ${px(c.marginRight)} ${px(c.marginBottom)} ${px(c.marginLeft)}`,
        `p=${px(c.paddingTop)} ${px(c.paddingRight)} ${px(c.paddingBottom)} ${px(c.paddingLeft)}`]
      if (/flex|grid/.test(c.display)) parts.push(`${c.display} ${c.flexDirection} gap=${c.rowGap}/${c.columnGap} jc=${c.justifyContent} ai=${c.alignItems}`)
      else parts.push(c.display)
      if (c.maxWidth !== 'none') parts.push(`max-w=${c.maxWidth}`)
      if (c.textAlign !== 'start') parts.push(`text-align=${c.textAlign}`)
      if (c.transform !== 'none') parts.push(`transform=${c.transform}`)
      if (+c.opacity < 1) parts.push(`opacity=${c.opacity}`)
      let next = e.nextElementSibling
      while (next && next.getBoundingClientRect().height === 0) next = next.nextElementSibling
      if (next) parts.push(`-> next ${short(next)} ${Math.round(next.getBoundingClientRect().top - r.bottom)}px below`)
      return `${'  '.repeat(i)}${short(e)}  ${parts.join('  ')}`
    }
    const out = []
    let e = document.querySelector(s)
    for (let i = 0; e && e.tagName !== 'BODY'; e = e.parentElement, i++) { out.push(box(e, i)); if (e.tagName === 'MAIN') break }
    return out.join('\n')
  }, selector))
  await browser.close()
})()
