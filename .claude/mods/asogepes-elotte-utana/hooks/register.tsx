import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Entry, Metrics, Snap } from '../types'

const PANE = 'elotte-utana'
const DEV = 'http://localhost:3000'
const OUT = 'node_modules/.cache/elotte-utana'
const WIDTHS = ['390', '1440']
// HMR needs a moment before the edited CSS reaches the page
const HMR_MS = 2500

const isOn = atom({ plugin: 'asogepes-elotte-utana', key: 'isOn' } as const, false, { shape: 'on-1' })
const entries = atom({ plugin: 'asogepes-elotte-utana', key: 'entries' } as const, [] as Entry[], { shape: 'entries-1' })

type $ = EngineInterface

// src/components/experiment/pages/SzentkirályTempPage.module.css + ".header {" -> [class*=Szentkir_lyTempPage_header]
function selectorFor(file: string, css: string): string | null {
  const module = file.split(/[\\/]/).pop()?.replace(/\.module\.css$/, '')
  const cls = css.match(/(?:^|[\s,}])\.([A-Za-z][\w-]*)/)?.[1]
  if (!module || !cls) return null
  // CSS-module class names escape accents as "_"
  return `[class*=${module.replace(/[^A-Za-z0-9_-]/g, '_')}_${cls}]`
}

function pagesFor(file: string): string {
  const f = file.replace(/\\/g, '/')
  if (f.includes('/components/problem/')) return '/problema'
  if (f.includes('/components/solution-v2/')) return '/technologia'
  if (f.includes('/components/experiment/')) return '/kutatas'
  if (f.includes('/components/home/')) return '/'
  return '/,/problema,/technologia,/kutatas'
}

async function snap($: $, selector: string, pages: string, prefix: string): Promise<Snap | null> {
  const ran = await $.process
    .run(['node', 'scripts/qa/snap.js', DEV, selector, prefix, `--pages=${pages}`, `--widths=${WIDTHS.join(',')}`], { timeoutMs: 90000 })
    .catch(() => null)
  if (!ran || ran.exitCode !== 0) return null
  try {
    return JSON.parse(ran.stdout.trim().split(/\r?\n/).pop() ?? '') as Snap
  } catch {
    return null
  }
}

const cssOf = (e: { tool: string } & Record<string, unknown>): string =>
  e.tool === 'Write' ? String(e.content ?? '') : String(e.new_string ?? e.old_string ?? '')

const fmt = (v: number | null | undefined) => (v === null || v === undefined ? '–' : String(v))

export const register: Register = on => {
  let counter = 0

  on('session.start', async ($, e, next) => {
    const started = await next(e)
    if (!(await $.fs.exists('scripts/qa/snap.js'))) return started
    await $.command.register({ name: 'elotte-utana', description: 'Előtte/utána panel be/ki: CSS-módosításkor kép és mérés 390 és 1440 px-en' })
    if (await read($, isOn)) void $.ui.open({ id: PANE, title: 'Előtte / utána' })

    return started
  })

  on('command.run', { command: 'elotte-utana' }, async $ => {
    const was = await read($, isOn)
    await update($, isOn, () => !was)
    if (was) {
      await $.ui.close({ id: PANE })
      return { text: 'Előtte/utána panel kikapcsolva.' }
    }
    await $.ui.open({ id: PANE, title: 'Előtte / utána' })

    return { text: 'Előtte/utána panel bekapcsolva: a következő CSS-module módosításoktól mér (kb. 7 mp-cel lassabb szerkesztésenként).' }
  })

  on('tool.call', async ($, e, next) => {
    if (e.tool !== 'Edit' && e.tool !== 'Write') return next(e)
    const file = String((e as { file_path?: string }).file_path ?? '')
    if (!/\.module\.css$/.test(file) || !(await read($, isOn))) return next(e)
    const selector = selectorFor(file, cssOf(e as unknown as { tool: string } & Record<string, unknown>))
    if (!selector) return next(e)

    counter += 1
    const id = (await $.clock.now()) * 10 + (counter % 10)
    const pages = pagesFor(file)
    const short = file.replace(/\\/g, '/').split('/src/').pop() ?? file
    await update($, entries, list => [{ id, file: short, selector, before: null, after: null, isPending: true }, ...list].slice(0, 6))

    const before = await snap($, selector, pages, `${OUT}/${id}-elotte`)
    await update($, entries, list => list.map(x => (x.id === id ? { ...x, before } : x)))
    const ran = await next(e)
    if (ran.deny !== undefined || ran.isError) {
      await update($, entries, list => list.filter(x => x.id !== id))
      return ran
    }

    $.clock.after(HMR_MS, () => {
      void (async () => {
        const after = await snap($, selector, before?.page ?? pages, `${OUT}/${id}-utana`)
        await update($, entries, list => list.map(x => (x.id === id ? { ...x, after, isPending: false } : x)))
      })()
    })

    return ran
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const list = await read($, entries)
    const open = (png: string) => void $.process.run(['cmd', '/c', 'start', '', png.replace(/\//g, '\\')]).catch(() => undefined)

    const row = (label: string, b: Metrics | null | undefined, a: Metrics | null | undefined, pick: (m: Metrics) => string) => {
      const was = b ? pick(b) : '–'
      const now = a ? pick(a) : '…'
      const changed = a !== undefined && was !== now
      return (
        <Box>
          <Text dimColor>{label.padEnd(9)}</Text>
          <Text color={changed ? 'warning' : undefined} bold={changed}>
            {changed ? `${was} → ${now}` : now === '…' ? was : now}
          </Text>
        </Box>
      )
    }

    if (list.length === 0) {
      return <Text dimColor>Még nincs mérés. A következő *.module.css módosításkor itt jelenik meg az előtte/utána.</Text>
    }

    return (
      <Box flexDirection="column">
        {list.slice(0, 3).map(entry => (
          <Box flexDirection="column" marginBottom={1}>
            <Text bold>{entry.file}</Text>
            <Text dimColor>
              {entry.selector} {entry.before?.page ? `· ${entry.before.page}` : ''} {entry.isPending ? '· mér…' : ''}
            </Text>
            {entry.before?.page === null && <Text color="error">Nem található a dev szerveren (fut az npm run dev?)</Text>}
            {WIDTHS.map(w => {
              const b = entry.before?.results[w]
              const a = entry.isPending ? undefined : entry.after?.results[w]
              if (!b && !a) return null
              return (
                <Box flexDirection="column">
                  <Text color="suggestion">{w} px</Text>
                  {row('bal/jobb', b, a, m => `${m.left}/${m.right}`)}
                  {row('méret', b, a, m => `${m.width}×${m.height}`)}
                  {row('felette', b, a, m => fmt(m.above))}
                  {row('alatta', b, a, m => fmt(m.below))}
                  {row('margin', b, a, m => m.margin)}
                  {row('padding', b, a, m => m.padding)}
                  <Box>
                    {b && <Button key={`${entry.id}-${w}-b`} label="kép előtte" onPress={() => open(b.png)} />}
                    {a && <Button key={`${entry.id}-${w}-a`} label="kép utána" onPress={() => open(a.png)} />}
                  </Box>
                </Box>
              )
            })}
          </Box>
        ))}
      </Box>
    )
  })
}
