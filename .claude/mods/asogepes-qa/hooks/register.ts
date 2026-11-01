import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { LayoutRun } from '../types'


const DEV = 'http://localhost:3000'
const lastLayout = atom({ plugin: 'asogepes-qa', key: 'lastLayout' } as const, null as LayoutRun | null, { shape: 'layout-1' })
const isCssDirty = atom({ plugin: 'asogepes-qa', key: 'isCssDirty' } as const, false, { shape: 'dirty-1' })
const isChecking = atom({ plugin: 'asogepes-qa', key: 'isChecking' } as const, false, { shape: 'checking-1' })

type $ = EngineInterface

const hhmm = (ms: number) => new Date(ms).toTimeString().slice(0, 5)
const lines = (text: string) => text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)

// Only in this project: the QA scripts are the marker.
const isProject = ($: $) => $.fs.exists('scripts/qa/layout-check.js')

async function git($: $, args: string[]) {
  const ran = await $.process.run(['git', ...args], { timeoutMs: 60000 })
  return { ok: ran.exitCode === 0, out: (ran.stdout + ran.stderr).trim() }
}

async function isDevUp($: $) {
  const ran = await $.process.run(['curl', '-s', '-I', '--max-time', '2', DEV], { timeoutMs: 5000 }).catch(() => null)
  return ran !== null && ran.exitCode === 0
}

function layoutFromOutput(text: string, at: number): LayoutRun | null {
  if (/layout-check passed/.test(text)) return { isPassed: true, problems: 0, at }
  const failed = text.match(/layout-check: (\d+) problem/)
  return failed ? { isPassed: false, problems: Number(failed[1]), at } : null
}

async function refreshStatus($: $, note?: string) {
  const branch = await git($, ['rev-parse', '--abbrev-ref', 'HEAD'])
  const ahead = await git($, ['rev-list', '--count', 'origin/main..HEAD'])
  const dev = await isDevUp($)
  const layout = await read($, lastLayout)
  const dirty = await read($, isCssDirty)
  const parts = [
    `⎇ ${branch.ok ? branch.out : '?'}`,
    ahead.ok ? (ahead.out === '0' ? 'main naprakész' : `${ahead.out} commit nincs a main-en`) : 'main ?',
    dev ? 'dev :3000 ✓' : 'dev :3000 ✗',
    layout === null ? 'layout –' : layout.isPassed ? `layout ✓ ${hhmm(layout.at)}` : `layout ✗ ${layout.problems} hiba`,
  ]
  if (dirty) parts.push('CSS változott, layout-check kell')
  if (note) parts.push(note)
  $.ui.status(parts.join('  ·  '))
}

type Step = { name: string; argv: string[] }
const STEPS: Step[] = [
  { name: 'tsc', argv: ['node', 'node_modules/typescript/bin/tsc', '--noEmit'] },
  { name: 'layout-check', argv: ['node', 'scripts/qa/layout-check.js', DEV] },
  { name: 'type-check', argv: ['node', 'scripts/qa/type-check.js', DEV] },
  { name: 'clip-check', argv: ['node', 'scripts/qa/clip-check.js', DEV] },
]

async function runChecks($: $) {
  await update($, isChecking, () => true)
  try {
    if (!(await isDevUp($))) {
      $.ui.log('ellenőrzés: a dev szerver nem fut a 3000-es porton (npm run dev), csak a tsc fut le')
    }
    const report: string[] = []
    let failed = 0
    for (const [i, step] of STEPS.entries()) {
      if (i > 0 && !(await isDevUp($))) { report.push(`– ${step.name}: kihagyva (nincs dev szerver)`); continue }
      await refreshStatus($, `ellenőrzés ${i + 1}/${STEPS.length}: ${step.name}…`)
      const ran = await $.process.run(step.argv, { timeoutMs: 600000 }).catch(err => ({ exitCode: 1, stdout: '', stderr: String(err) }))
      const out = ran.stdout + '\n' + ran.stderr
      if (step.name === 'layout-check') {
        const run = layoutFromOutput(out, await $.clock.now())
        if (run) {
          await update($, lastLayout, () => run)
          if (run.isPassed) await update($, isCssDirty, () => false)
        }
      }
      if (ran.exitCode === 0) report.push(`✓ ${step.name}`)
      else {
        failed += 1
        const detail = lines(out).filter(l => /FAIL|error|hiba|problem|clipped|<\s*1[0-9]px/i.test(l)).slice(0, 6)
        report.push(`✗ ${step.name}`, ...(detail.length ? detail : lines(out).slice(-4)).map(l => `    ${l.slice(0, 160)}`))
      }
    }
    $.ui.log(['Ellenőrzés (/ellenoriz):', ...report].join('\n'))
    $.ui.toast(failed ? `Ellenőrzés: ${failed} lépés hibás` : 'Ellenőrzés: minden rendben')
  } finally {
    await update($, isChecking, () => false)
    await refreshStatus($)
  }
}

async function pushMain($: $) {
  const branch = await git($, ['rev-parse', '--abbrev-ref', 'HEAD'])
  if (!branch.ok) return `Nem git repó? ${branch.out}`
  const from = branch.out
  const log: string[] = []
  const step = async (label: string, args: string[]) => {
    const r = await git($, args)
    log.push(`${r.ok ? '✓' : '✗'} ${label}${r.ok ? '' : `: ${r.out.split('\n').slice(-3).join(' ')}`}`)
    return r
  }
  if (!(await step('fetch', ['fetch', '-q', 'origin'])).ok) return log.join('\n')
  const pending = await git($, ['log', '--oneline', `origin/main..${from}`])
  if (pending.ok && pending.out === '') return `Nincs új commit a(z) ${from} ágon a main-hez képest.`
  try {
    if (from !== 'main') {
      if (!(await step('checkout main', ['checkout', '-q', 'main'])).ok) return log.join('\n')
      if (!(await step(`main ← ${from} (fast-forward)`, ['merge', '--ff-only', '-q', from])).ok) return log.join('\n') + '\nA main elágazott; kézzel kell rendezni.'
    }
    const pushed = await step('push origin main', ['push', 'origin', 'main'])
    if (!pushed.ok) return log.join('\n')
    return [`Fent van a main-en (${from} → main):`, ...lines(pending.out).map(l => `  ${l}`), ...log].join('\n')
  } finally {
    if (from !== 'main') await step(`vissza: ${from}`, ['checkout', '-q', from])
    await refreshStatus($)
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    if (!(await isProject($))) return started
    await $.command.register({ name: 'ellenoriz', description: 'tsc + layout-check + type-check + clip-check a dev szerveren (háttérben), összefoglalóval' })
    await $.command.register({ name: 'mehet', description: 'A munkaág fast-forward a main-re, push, vissza a munkaágra' })
    void refreshStatus($)
    $.clock.every(20000, () => void refreshStatus($))

    return started
  })

  on('command.run', { command: 'ellenoriz' }, async $ => {
    if (await read($, isChecking)) return { text: 'Az ellenőrzés már fut.' }
    $.clock.after(10, () => void runChecks($))

    return { text: 'Ellenőrzés elindult a háttérben (tsc, layout-check, type-check, clip-check). Az állapotsor mutatja, hol tart.' }
  })

  on('command.run', { command: 'mehet' }, async $ => ({ text: await pushMain($) }))

  // A CSS module changed: remember it, and tell the model once that a layout-check is due.
  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    if (e.tool === 'Bash') {
      const cmd = e.command
      if (/layout-check/.test(cmd)) {
        const run = layoutFromOutput(ran.text ?? '', await $.clock.now())
        if (run) {
          await update($, lastLayout, () => run)
          if (run.isPassed) await update($, isCssDirty, () => false)
          void refreshStatus($)
        }
        return ran
      }
      if (!/\.module\.css/.test(cmd) || !/(py |sed -i|cat >>|>\s*\S+\.module\.css)/.test(cmd)) return ran
    } else if (e.tool === 'Edit' || e.tool === 'Write') {
      if (!/\.module\.css$/.test(String((e as { file_path?: string }).file_path ?? ''))) return ran
    } else return ran

    if (ran.deny !== undefined || ran.isError) return ran
    const wasDirty = await read($, isCssDirty)
    await update($, isCssDirty, () => true)
    void refreshStatus($)
    if (wasDirty) return ran

    return {
      ...ran,
      context: [...(ran.context ?? []), 'asogepes-qa: a CSS module changed. Before reporting the fix as done, run `node scripts/qa/layout-check.js http://localhost:3000` (and trace.js for the spot you changed).'],
    }
  })

  // End of a main turn with unchecked CSS: one line under the answer.
  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    if (e.agentId !== undefined || e.reason !== 'answer') return done
    const dirty = await read($, isCssDirty)
    const layout = await read($, lastLayout)
    if (dirty) return { ...done, text: '⚠ CSS változott, de utána nem futott layout-check (/ellenoriz).' }
    if (layout && !layout.isPassed) return { ...done, text: `⚠ Az utolsó layout-check ${layout.problems} hibát talált.` }

    return done
  })
}
