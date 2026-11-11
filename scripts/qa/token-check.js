// Design-token guard (ticket 020): counts the distinct hand-written values per property in src/**/*.css
// and fails when a count rises above its ceiling, so new one-off values don't creep back in.
//   node scripts/qa/token-check.js            report + check against the ceilings below
//   node scripts/qa/token-check.js --list p   also list the values of property p (font-size, border-radius, ...)
// A token reference (var(--text-sm)) counts as one value like any other. Lower a ceiling whenever a
// consolidation step lands; never raise one without a reason in the commit message.
const fs = require('fs')
const path = require('path')

const CEILINGS = {
  'font-size': 39,
  'border-radius': 37,
  'box-shadow': 56,
  'color-literal': 310,
  transition: 82,
}

const files = []
;(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (p.endsWith('.css')) files.push(p)
  }
})(path.resolve('src'))

const seen = {}
const add = (prop, value, file) => {
  const m = (seen[prop] = seen[prop] || new Map())
  const v = m.get(value) || { n: 0, files: new Set() }
  v.n++
  v.files.add(path.relative(process.cwd(), file))
  m.set(value, v)
}

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8')
  for (const m of src.matchAll(/(?:^|[;{\s])([a-z-]+)\s*:\s*([^;{}]+);/g)) {
    const prop = m[1]
    if (prop.startsWith('--')) continue // token definitions are the scale itself
    const value = m[2].replace(/\s+/g, ' ').replace(/\s*!important$/, '').trim()
    if (prop === 'font-size' || prop === 'border-radius' || prop === 'box-shadow' || prop === 'transition') add(prop, value, f)
    for (const c of value.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g) || []) add('color-literal', c.toLowerCase().replace(/\s/g, ''), f)
  }
}

let failed = false
for (const [prop, max] of Object.entries(CEILINGS)) {
  const n = seen[prop] ? seen[prop].size : 0
  const ok = n <= max
  if (!ok) failed = true
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${prop.padEnd(14)} ${String(n).padStart(4)} distinct (ceiling ${max})`)
}

const listArg = process.argv.indexOf('--list')
if (listArg > -1) {
  const prop = process.argv[listArg + 1]
  const rows = [...(seen[prop] || new Map())].sort((a, b) => b[1].n - a[1].n)
  for (const [v, { n, files }] of rows) console.log(`${String(n).padStart(4)}  ${v}  (${[...files].slice(0, 3).join(', ')}${files.size > 3 ? ', …' : ''})`)
}

if (failed) {
  console.log('\ntoken-check FAILED: use a token from src/app/globals.css instead of a new value (see --list)')
  process.exit(1)
}
console.log('\ntoken-check passed')
