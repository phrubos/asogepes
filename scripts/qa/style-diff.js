// Before/after guard for CSS refactors (ticket 020): dumps the computed look of every visible element
// on the four pages at a phone and a desktop width, then compares two dumps.
//   node scripts/qa/style-diff.js dump <out.json> [base]      (base default http://localhost:3000)
//   node scripts/qa/style-diff.js diff <before.json> <after.json> [--tol=0.5]
// Elements are keyed by tag + class list + occurrence, so the dump survives edits that keep class names.
// Runs with reduced motion so entrance animations do not show up as differences.
const path = require('path')
const fs = require('fs')

const PROPS = ['fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'borderTopLeftRadius', 'borderTopRightRadius',
  'borderBottomLeftRadius', 'borderBottomRightRadius', 'boxShadow', 'textShadow', 'color', 'backgroundColor',
  'borderTopColor', 'borderTopWidth', 'rowGap', 'columnGap', 'paddingTop', 'paddingRight', 'paddingBottom',
  'paddingLeft', 'marginTop', 'marginBottom', 'width', 'height']
const PAGES = ['/', '/problema', '/technologia', '/kutatas']
const WIDTHS = [390, 1440]

async function dump(out, base) {
  const { chromium } = require(path.resolve('node_modules/@playwright/test'))
  const browser = await chromium.launch()
  const res = {}
  for (const w of WIDTHS) {
    for (const pg of PAGES) {
      const tab = await browser.newPage({ viewport: { width: w, height: w <= 1024 ? 844 : 900 }, isMobile: w <= 1024, hasTouch: w <= 1024, reducedMotion: 'reduce' })
      await tab.goto(base + pg, { waitUntil: 'load', timeout: 90000 })
      await tab.addStyleTag({ content: '* { content-visibility: visible !important }' })
      await tab.evaluate(() => document.fonts.ready)
      // walk down once so whileInView content mounts, then back to the top
      await tab.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)) }
        scrollTo(0, 0)
      })
      await tab.waitForTimeout(800)
      res[`${w} ${pg}`] = await tab.evaluate((props) => {
        const seen = {}, out = {}
        for (const e of document.body.querySelectorAll('*')) {
          if (e.closest('svg') && e.tagName.toLowerCase() !== 'svg') continue
          const r = e.getBoundingClientRect()
          if (r.width === 0 && r.height === 0) continue
          const cls = typeof e.className === 'string' ? e.className.trim().split(/\s+/).sort().join('.') : ''
          const base = e.tagName.toLowerCase() + (cls ? '.' + cls : '')
          const n = (seen[base] = (seen[base] || 0) + 1)
          const c = getComputedStyle(e)
          const v = {}
          for (const p of props) v[p] = p === 'width' || p === 'height' ? String(Math.round(p === 'width' ? r.width : r.height)) : c[p]
          out[base + '#' + n] = v
        }
        return out
      }, PROPS)
      await tab.close()
      process.stdout.write('.')
    }
  }
  await browser.close()
  fs.writeFileSync(out, JSON.stringify(res))
  console.log(`\nsaved ${out}: ${Object.values(res).reduce((s, x) => s + Object.keys(x).length, 0)} elements`)
}

function diff(a, b, tol) {
  const A = JSON.parse(fs.readFileSync(a, 'utf8')), B = JSON.parse(fs.readFileSync(b, 'utf8'))
  const nums = (s) => (String(s).match(/-?[\d.]+/g) || []).map(Number)
  const close = (x, y) => {
    if (x === y) return true
    const nx = nums(x), ny = nums(y)
    if (nx.length !== ny.length || !nx.length) return false
    if (String(x).replace(/-?[\d.]+/g, '#') !== String(y).replace(/-?[\d.]+/g, '#')) return false
    return nx.every((v, i) => Math.abs(v - ny[i]) <= tol)
  }
  const byProp = {}
  let missing = 0, total = 0
  for (const k of Object.keys(A)) {
    for (const el of Object.keys(A[k])) {
      const x = A[k][el], y = B[k] && B[k][el]
      if (!y) { missing++; continue }
      for (const p of Object.keys(x)) {
        total++
        if (!close(x[p], y[p])) (byProp[p] = byProp[p] || []).push(`${k} ${el.slice(0, 90)}: ${x[p]} -> ${y[p]}`)
      }
    }
  }
  const changed = Object.values(byProp).reduce((s, l) => s + l.length, 0)
  console.log(`compared ${total} values, ${changed} changed (tolerance ${tol}px), ${missing} elements missing in after`)
  for (const [p, l] of Object.entries(byProp).sort((x, y) => y[1].length - x[1].length)) {
    console.log(`\n${p}: ${l.length}`)
    for (const line of l.slice(0, 12)) console.log('  ' + line)
  }
  process.exit(changed ? 1 : 0)
}

const [cmd, x, y] = process.argv.slice(2)
const tolArg = process.argv.find(s => s.startsWith('--tol='))
if (cmd === 'dump' && x) dump(x, (y && !y.startsWith('--') ? y : 'http://localhost:3000').replace(/\/$/, ''))
else if (cmd === 'diff' && x && y) diff(x, y, tolArg ? Number(tolArg.split('=')[1]) : 0.5)
else console.log('usage: style-diff.js dump <out.json> [base] | diff <before.json> <after.json> [--tol=0.5]')
