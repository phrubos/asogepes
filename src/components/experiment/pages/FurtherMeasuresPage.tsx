'use client'

import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { lakitelekSoil2026 as laki, szentkiralyOnionSoil as szk } from '@/lib/seasons'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import SeasonOnly from '../season/SeasonOnly'
import Story, { type Chapter } from '../story/Story'
import Callout from '../story/Callout'
import { cap, named, namedIn, short } from '../story/dates'
// Same page frame as the other location blocks
import styles from './SzentkirályTimelinePage.module.css'
import own from './FurtherMeasuresPage.module.css'

const hu = (v: number, d: number) => v.toFixed(d).replace('.', ',')
const when = short
const lin = (d0: number, d1: number, r0: number, r1: number) => (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0)

/* Lakitelek numbers the chapters quote, computed from the data */
const lakiDelta = laki.bulkDensity.parcels.map((p) => Math.round((p.values[1] - p.values[0]) * 100))
const lakiUp = lakiDelta.filter((d) => d > 0).length
const lakiDown = lakiDelta.filter((d) => d < 0).length
const lakiSame = lakiDelta.filter((d) => d === 0).length
const lakiMaxDelta = Math.max(...lakiDelta.map(Math.abs))
const lakiWater = laki.water.dates.map((_, j) => {
  const c = laki.water.parcels.map((p) => p[j])
  return { lo: Math.min(...c), hi: Math.max(...c) }
})
const wetIdx = lakiWater.reduce((b, w, j) => (w.lo > lakiWater[b].lo ? j : b), 0)
const wetAboveAll = lakiWater.every((w, j) => j === wetIdx || w.hi < lakiWater[wetIdx].lo)
const rng = (a: number[]) => [Math.min(...a), Math.max(...a)]
const [shootLo, shootHi] = rng(laki.rye.shoot)
const [rootLo, rootHi] = rng(laki.rye.root)
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

const SZK_CHAPTERS: Chapter[] = [
  {
    title: 'Térfogattömeg',
    body: `${cap(namedIn(szk.bulkDensity.dates[0]))} egyformák voltak (${hu(szk.bulkDensity.control[0], 2)} és ${hu(szk.bulkDensity.spade[0], 2)} g/cm³). ${cap(namedIn(szk.bulkDensity.dates[2]))} a kontroll talaj ${hu(szk.bulkDensity.control[2], 2)}, az ásógépes ${hu(szk.bulkDensity.spade[2], 2)} g/cm³. Kisebb = lazább talaj.`,
  },
  {
    title: 'Víztelítettség',
    body: `${cap(namedIn(szk.water.date))}, 10 cm mélyen: az ásógépes talajban ${hu(szk.water.spade[0], 1)}–${hu(szk.water.spade[1], 1)} %, a kontrollban ${hu(szk.water.control[0], 1)}–${hu(szk.water.control[1], 1)} % volt a víztelítettség (mérési pontok).`,
  },
  {
    title: 'Humusz',
    body: `${cap(namedIn(szk.humus.dates[0]))} az ásógépes parcellán több volt (${hu(szk.humus.spade[0], 2)} és ${hu(szk.humus.control[0], 2)} m/m%). ${cap(namedIn(szk.humus.dates[1]))} mindkettő ${hu(szk.humus.spade[1], 2)}.`,
  },
]

const LAKI_CHAPTERS: Chapter[] = [
  {
    title: 'Térfogattömeg',
    body: `${cap(named(laki.bulkDensity.dates[0]))} → ${named(laki.bulkDensity.dates[1])} (tarló): kicsi és vegyes a változás. ${lakiUp} parcellán nőtt, ${lakiDown} parcellán csökkent, ${lakiSame} parcellán nem változott; legfeljebb ${hu(lakiMaxDelta / 100, 2)} g/cm³.`,
  },
  {
    title: 'Víztelítettség',
    body:
      `10 cm mélyen, a ${laki.water.parcels.length} parcella átlagai: ${laki.water.dates.map((d, j) => `${named(d)} ${hu(lakiWater[j].lo, 1)}–${hu(lakiWater[j].hi, 1)} %`).join(', ')}.` +
      (wetAboveAll ? ` ${cap(namedIn(laki.water.dates[wetIdx]))} mind a ${laki.water.parcels.length} parcellán nedvesebb volt, mint a másik két mérésnél.` : ''),
  },
  {
    title: 'Hajtás és gyökér',
    body: `${cap(namedIn(laki.rye.date))} a rozs hajtása ${shootLo}–${shootHi} cm, a gyökere ${rootLo}–${rootHi} cm volt a ${laki.rye.shoot.length} parcellán.`,
  },
]

/** "További mérések": the 2026 soil measurements beside the main ones, told in three steps */
export default function FurtherMeasuresPage({ site }: { site: 'szentkiraly' | 'lakitelek' }) {
  const phone = useMediaQuery('(max-width: 1024px)') === true
  const [step, setStep] = useState(1)
  const isSzk = site === 'szentkiraly'
  const chapters = isSzk ? SZK_CHAPTERS : LAKI_CHAPTERS

  const W = phone ? 430 : 680
  const FS = phone ? 17 : 15
  const H = phone ? 380 : 400
  const box = { fs: FS, w: W, h: H }
  const X0 = phone ? 54 : 70
  const yTop = FS * 1.6
  const yBot = H - FS * 3

  const grid = (ticks: number[], y: (v: number) => number, d: number) =>
    ticks.map((v) => (
      <g key={v}>
        <line x1={X0 - 8} x2={W - 4} y1={y(v)} y2={y(v)} className={own.grid} />
        <text x={X0 - 14} y={y(v) + 4} fontSize={FS - 1} textAnchor="end" className={own.axis}>{hu(v, d)}</text>
      </g>
    ))
  const xTick = (x: number, label: string, gold = false) => (
    <text key={label + x} x={x} y={H - FS * 1.2} fontSize={FS - 1} textAnchor="middle" className={`${own.tick} ${gold ? own.tickGold : ''}`}>
      {label}
    </text>
  )

  let chart: ReactNode = null
  let callouts: ReactNode = null
  let title = ''
  let unit = ''

  if (isSzk && step === 1) {
    const d = szk.bulkDensity
    title = 'Térfogattömeg'
    unit = 'g/cm³ · kisebb = lazább talaj'
    const y = lin(1.2, 1.5, yBot, yTop + FS)
    const xs = d.dates.map((_, i) => lin(0, 2, X0 + 30, W - (phone ? 110 : 150))(i))
    const lines = [
      { k: 'K', v: d.control, cls: own.control },
      { k: 'Á', v: d.spade, cls: own.spadeLine },
    ]
    const bx = W - 18
    chart = (
      <>
        {grid([1.2, 1.3, 1.4, 1.5], y, 1)}
        {lines.map((l, li) => (
          <g key={l.k} className={l.cls}>
            <polyline points={l.v.map((v, i) => `${xs[i]},${y(v)}`).join(' ')} pathLength={1} className={own.line} style={{ animationDelay: `${li * 200}ms` }} />
            {l.v.map((v, i) => <circle key={i} cx={xs[i]} cy={y(v)} r={FS * 0.4} className={own.mark} />)}
            <text x={xs[2] + FS} y={y(l.v[2]) + (li ? FS * 0.9 : -FS * 0.2)} fontSize={FS} className={own.endLabel}>
              {l.k} {hu(l.v[2], 2)}
            </text>
          </g>
        ))}
        <path d={`M${bx - 8},${y(d.control[2])} H${bx} V${y(d.spade[2])} H${bx - 8}`} className={own.bracket} />
        {d.dates.map((dt, i) => xTick(xs[i], when(dt), i === 2))}
      </>
    )
    callouts = <Callout {...box} x={bx} y={(y(d.control[2]) + y(d.spade[2])) / 2} side="left" dy={FS * 2.2 - (y(d.control[2]) + y(d.spade[2])) / 2} main={`${hu(d.control[2], 2)} / ${hu(d.spade[2], 2)}`} sub={`${when(d.dates[2]).toLowerCase()}: a kontroll tömörebb`} delay={1100} />
  }

  if (isSzk && step === 2) {
    const d = szk.water
    title = 'Víztelítettség'
    unit = `${when(d.date)} · 10 cm · V/V%`
    const y = lin(0, 50, yBot, yTop + FS)
    const cw = phone ? 80 : 100
    const cols = [
      { name: 'KONTROLL', r: d.control, x: X0 + (phone ? 50 : 90), cls: own.control },
      { name: 'ÁSÓGÉP', r: d.spade, x: X0 + (phone ? 190 : 290), cls: own.spadeLine },
    ]
    chart = (
      <>
        {grid([0, 10, 20, 30, 40, 50], y, 0)}
        {cols.map((c, i) => (
          <g key={c.name} className={c.cls}>
            <rect x={c.x} y={y(c.r[0])} width={cw} height={y(0) - y(c.r[0])} rx={6} className={own.colSolid} style={{ animationDelay: `${i * 200}ms` }} />
            <rect x={c.x} y={y(c.r[1])} width={cw} height={y(c.r[0]) - y(c.r[1])} rx={6} className={own.colBand} style={{ animationDelay: `${600 + i * 200}ms` }} />
            {i === 0 && (
              <text x={c.x + cw / 2} y={y(c.r[1]) - 10} fontSize={FS} textAnchor="middle" className={`${own.endLabel} ${own.fadeIn}`} style={{ animationDelay: '700ms' }}>
                {hu(c.r[0], 1)}–{hu(c.r[1], 1)}
              </text>
            )}
            {xTick(c.x + cw / 2, c.name, i === 1)}
          </g>
        ))}
      </>
    )
    callouts = <Callout {...box} x={cols[1].x + cw} y={y(d.spade[1])} side="right" dy={FS * 2} main={`${hu(d.spade[0], 1)}–${hu(d.spade[1], 1)} %`} sub={`kontroll: ${hu(d.control[0], 1)}–${hu(d.control[1], 1)} %`} delay={1000} />
  }

  if (isSzk && step === 3) {
    const d = szk.humus
    title = 'Humusz'
    unit = `m/m% · ${when(d.dates[0])} → ${when(d.dates[1])}`
    const y = lin(2.5, 2.8, yBot, yTop + FS)
    const xa = X0 + (phone ? 60 : 110)
    const xb = W - (phone ? 120 : 220)
    const lines = [
      { k: 'K', v: d.control, cls: own.control },
      { k: 'Á', v: d.spade, cls: own.spadeLine },
    ]
    chart = (
      <>
        {grid([2.5, 2.6, 2.7, 2.8], y, 1)}
        {lines.map((l, li) => (
          <g key={l.k} className={l.cls}>
            <line x1={xa} y1={y(l.v[0])} x2={xb} y2={y(l.v[1])} pathLength={1} className={own.line} style={{ animationDelay: `${li * 200}ms` }} />
            <circle cx={xa} cy={y(l.v[0])} r={FS * 0.4} className={own.mark} />
            <circle cx={xb} cy={y(l.v[1])} r={FS * 0.4} className={own.mark} />
            <text x={xa + FS * 0.8} y={y(l.v[0]) - FS * 0.7} fontSize={FS} className={own.endLabel}>
              {l.k} {hu(l.v[0], 2)}
            </text>
          </g>
        ))}
        {xTick(xa, when(d.dates[0]))}
        {xTick(xb, when(d.dates[1]), true)}
      </>
    )
    callouts = <Callout {...box} x={xb} y={y(d.spade[1])} side="right" dy={-FS * 3} main={`${hu(d.control[1], 2)} = ${hu(d.spade[1], 2)}`} sub={`${when(d.dates[1]).toLowerCase()}: egyforma`} delay={900} />
  }

  if (!isSzk && step === 1) {
    const d = laki.bulkDensity
    title = 'Térfogattömeg parcellánként'
    unit = `g/cm³ · ${when(d.dates[0])} ○ → ● ${when(d.dates[1])} (tarló)`
    const x = lin(1.36, 1.52, X0 + 10, W - (phone ? 24 : 150))
    const rowH = (H - FS * 7.6) / d.parcels.length
    const ry = (i: number) => FS * 2.2 + rowH * (i + 0.5)
    const big = lakiDelta.findIndex((v) => Math.abs(v) === lakiMaxDelta && v > 0)
    const mark = big >= 0 ? big : 0
    chart = (
      <>
        {[1.4, 1.45, 1.5].map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={FS * 1.6} y2={ry(d.parcels.length - 1) + rowH / 2} className={own.grid} />
            <text x={x(v)} y={FS * 1.1} fontSize={FS - 1} textAnchor="middle" className={own.axis}>{hu(v, 2)}</text>
          </g>
        ))}
        {d.parcels.map((p, i) => {
          const cls = p.role === 'other' ? own.control : own.spadeLine
          const strong = Math.abs(lakiDelta[i]) === lakiMaxDelta
          return (
            <g key={p.num} className={`${cls} ${strong ? '' : own.soft}`}>
              <text x={X0 - 14} y={ry(i) + 5} fontSize={FS} textAnchor="end" className={own.rowName}>{p.num.replace('.', '')}</text>
              <line x1={x(p.values[0])} x2={x(p.values[1])} y1={ry(i)} y2={ry(i)} pathLength={1} className={own.line} style={{ animationDelay: `${150 + i * 90}ms` }} />
              <circle cx={x(p.values[0])} cy={ry(i)} r={FS * 0.38} className={own.hollow} />
              <circle cx={x(p.values[1])} cy={ry(i)} r={FS * 0.42} className={own.mark} />
              {!phone && (
                <text x={W - 130} y={ry(i) + 5} fontSize={FS - 1} className={own.rowValue}>
                  {hu(p.values[0], 2)} → {hu(p.values[1], 2)}
                </text>
              )}
            </g>
          )
        })}
      </>
    )
    callouts = (
      <Callout
        {...box}
        x={(x(d.parcels[mark].values[0]) + x(d.parcels[mark].values[1])) / 2}
        y={ry(mark)}
        side="right"
        dy={H - FS * 2.2 - ry(mark)}
        main={`legfeljebb ${hu(lakiMaxDelta / 100, 2)}`}
        sub={`${lakiUp} nőtt · ${lakiDown} csökkent · ${lakiSame} nem változott`}
        delay={900}
      />
    )
  }

  if (!isSzk && step === 2) {
    const d = laki.water
    title = 'Víztelítettség'
    unit = '10 cm · a parcellák átlagai · V/V%'
    const y = lin(0, 20, yBot, yTop + FS)
    const step3 = (W - X0 - (phone ? 30 : 160)) / d.dates.length
    const xs = d.dates.map((_, j) => X0 + step3 * (j + 0.5))
    const cw = phone ? 56 : 80
    chart = (
      <>
        {grid([0, 5, 10, 15, 20], y, 0)}
        {d.dates.map((dt, j) => {
          const w = lakiWater[j]
          const on = j === wetIdx
          return (
            <g key={j} className={on ? own.spadeLine : own.control}>
              <rect x={xs[j] - cw / 2} y={y(w.hi)} width={cw} height={y(w.lo) - y(w.hi)} rx={6} className={own.colBand} style={{ animationDelay: `${j * 150}ms` }} />
              {d.parcels.map((p, i) => (
                <circle key={i} cx={xs[j] + (i - 3) * (cw / 9)} cy={y(p[j])} r={FS * 0.3} className={`${own.mark} ${own.fadeIn}`} style={{ animationDelay: `${300 + j * 150 + i * 30}ms` }} />
              ))}
              <text x={xs[j]} y={y(w.hi) - 10} fontSize={FS} textAnchor="middle" className={`${own.endLabel} ${own.fadeIn}`} style={{ animationDelay: `${600 + j * 150}ms` }}>
                {hu(w.lo, 1)}–{hu(w.hi, 1)}
              </text>
              {xTick(xs[j], when(dt), on)}
            </g>
          )
        })}
      </>
    )
    callouts = (
      <Callout
        {...box}
        x={xs[wetIdx] - cw / 2}
        y={y(lakiWater[wetIdx].hi)}
        side="left"
        dy={FS * 1.5}
        main={`${hu(lakiWater[wetIdx].lo, 1)}–${hu(lakiWater[wetIdx].hi, 1)} %`}
        sub={wetAboveAll ? 'mind a 7 parcella nedvesebb' : 'a 7 parcella tartománya'}
        delay={1000}
      />
    )
  }

  if (!isSzk && step === 3) {
    const d = laki.rye
    title = `Rozs, ${when(d.date)}`
    unit = 'cm · parcellánként'
    const soil = H - FS * 4.2
    const k = (soil - FS * 1.5) / 130
    const n = d.shoot.length
    const span = W - X0 - (phone ? 150 : 250)
    const xs = d.shoot.map((_, i) => X0 + (span / (n - 1)) * i)
    const bw = phone ? 16 : 22
    const last = n - 1
    chart = (
      <>
        <rect x={-2} y={soil} width={W + 4} height={H - soil + 2} className={own.soil} />
        <line x1={-2} x2={W + 2} y1={soil} y2={soil} className={own.soilLine} />
        {d.shoot.map((s, i) => (
          <g key={i}>
            <rect x={xs[i] - bw / 2} y={soil - s * k} width={bw} height={s * k} rx={4} className={own.shoot} style={{ animationDelay: `${i * 70}ms` }} />
            <rect x={xs[i] - bw / 2} y={soil} width={bw} height={d.root[i] * k} rx={3} className={own.root} style={{ animationDelay: `${500 + i * 70}ms` }} />
            <text x={xs[i]} y={H - FS * 0.6} fontSize={FS - 1} textAnchor="middle" className={own.rowName}>{ROMAN[i]}</text>
          </g>
        ))}
      </>
    )
    callouts = (
      <>
        <Callout {...box} x={xs[last] + bw / 2} y={soil - d.shoot[last] * k * 0.6} side="right" main={`${shootLo}–${shootHi} cm`} sub="hajtás" delay={900} />
        <Callout {...box} x={xs[last] + bw / 2} y={soil + d.root[last] * k} side="right" dy={-FS * 0.5} main={`${rootLo}–${rootHi} cm`} sub="gyökér" grey delay={1100} />
      </>
    )
  }

  const stage = (
    <>
      <div className={own.chartHead}>
        <span className={own.chartTitle}>{title}</span>
        <span className={own.chartUnit}>{unit}</span>
      </div>
      <svg key={`${site}-${step}`} viewBox={`0 0 ${W} ${H}`} className={own.chart} role="img" aria-label={`${title}. ${chapters[step - 1].body}`}>
        {chart}
        {callouts}
      </svg>
    </>
  )

  return (
    <div className={styles.timelinePage}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerBadge}>
          <MapPin size={12} />
          <span>{isSzk ? 'Szentkirály' : 'Lakitelek'}</span>
        </div>
        <h3 className={styles.headerTitle}>{isSzk ? 'További mérések: a talaj a hagyma alatt' : 'További mérések: talaj és rozs'}</h3>
        <div className={styles.seasonRow}>
          <SeasonOnly years={[2026]} />
        </div>
      </motion.div>

      <Story label={isSzk ? 'További mérések, Szentkirály' : 'További mérések, Lakitelek'} chapters={chapters} step={step} onStep={setStep} stage={stage} />
    </div>
  )
}
