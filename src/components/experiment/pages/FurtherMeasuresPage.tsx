'use client'

import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import {
  lakitelekSoil2026 as laki,
  szentkiralyOnionSoil as szk,
  szentkiralyOnionSoilLife as szkLife,
  szentkiralyTomatoSoil as tom,
  type MeasureDate,
} from '@/lib/seasons'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import SeasonOnly from '../season/SeasonOnly'
import switchStyles from '../season/SeasonSwitch.module.css'
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
/* Lakitelek humus: change per parcel, m/m%; under 0,05 counts as no real change */
const humDelta = laki.humus.parcels.map((p) => Math.round((p.values[1] - p.values[0]) * 1000) / 1000)
const humUp = humDelta.filter((d) => d >= 0.05).length
const humDown = humDelta.filter((d) => d <= -0.05).length
const humSame = humDelta.length - humUp - humDown
const humMax = humDelta.reduce((b, d, i) => (Math.abs(d) > Math.abs(humDelta[b]) ? i : b), 0)
const humMaxP = laki.humus.parcels[humMax]
const HUM_NAMES = ['mélyásógép', 'lazítás + ásógép', 'ásógép', 'lazítás + szántás + kombinátor', 'szántás + kombinátor', 'lazítás + szántás + ásógép', 'szántás + ásógép']

/* Szentkirály onion soil life */
const lifeCtl = szkLife.fields.find((f) => f.role === 'control') ?? szkLife.fields[0]
const lifeSpring = szkLife.fields.map((f) => f.values[0]).filter((v): v is number => v !== null)
const lifeJuly = szkLife.fields.filter((f) => f.values[1] !== null)
const lifeNoJuly = szkLife.fields.filter((f) => f.values[1] === null)
const lifeTopJuly = lifeJuly.reduce((b, f) => ((f.values[1] as number) > (b.values[1] as number) ? f : b))
const lifeFb = szkLife.fields.flatMap((f) => f.fb).filter((v): v is number => v !== null)


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
  {
    title: 'Talajélet',
    body:
      `Élő mikrobiális szén (${szkLife.unit}) a tábla három részén. ${cap(namedIn(szkLife.dates[0]))} ${Math.round(Math.min(...lifeSpring))}–${Math.round(Math.max(...lifeSpring))}; ` +
      `${namedIn(szkLife.dates[1])} a ${lifeTopJuly.role === 'control' ? 'kontroll' : 'egyik ásógépes'} rész volt a legmagasabb (${Math.round(lifeTopJuly.values[1] as number)}). ` +
      `A júliusi értékek 2 minta átlagai, az ásógépes részen nagy szórással (±${Math.round(szkLife.julySpread)})` +
      (lifeNoJuly.length ? `; ${lifeNoJuly.map((f) => f.id).join(', ')} részen nyáron nem mértek.` : '.') +
      ` Gomba : baktérium arány ${hu(Math.min(...lifeFb), 2)}–${hu(Math.max(...lifeFb), 2)}. Kísérő adat, nem az ásógép melletti bizonyíték.`,
  },
]

/* Szentkirály tomato */
const tomLooser = tom.bulkDensity.spade.every((v, i) => v < tom.bulkDensity.control[i])
const tomFb = [...tom.life.fb.control, ...tom.life.fb.spade]
const r = Math.round

const TOMATO_CHAPTERS: Chapter[] = [
  {
    title: 'Térfogattömeg',
    body:
      `${cap(namedIn(tom.bulkDensity.dates[0]))} volt a legnagyobb a különbség: kombinátor ${hu(tom.bulkDensity.control[0], 2)}, ásógép ${hu(tom.bulkDensity.spade[0], 2)} g/cm³. ` +
      `${cap(namedIn(tom.bulkDensity.dates[2]))} mindkettő tömörebb (${hu(tom.bulkDensity.control[2], 2)} és ${hu(tom.bulkDensity.spade[2], 2)})` +
      (tomLooser ? `, de az ásógépes talaj mind a ${tom.bulkDensity.dates.length} mérésnél lazább volt.` : '.') +
      ' Kisebb = lazább talaj.',
  },
  {
    title: 'Humusz',
    body: `${cap(namedIn(tom.humus.dates[0]))} egyforma volt (${hu(tom.humus.control[0], 2)} és ${hu(tom.humus.spade[0], 2)} m/m%). ${cap(namedIn(tom.humus.dates[1]))} az ásógépes parcellán ${hu(tom.humus.spade[1], 2)}, a kombinátorosan ${hu(tom.humus.control[1], 2)}.`,
  },
  // Hajtáshossz lives in the "Föld felett, föld alatt" block of the tomato section (photos + numbers)
  {
    title: 'Talajélet',
    body:
      `Élő mikrobiális szén (${tom.life.unit}). ${cap(namedIn(tom.life.dates[0]))} a kombinátoros parcellán volt több (${r(tom.life.control[0])} és ${r(tom.life.spade[0])}), ` +
      `${namedIn(tom.life.dates[1])} az ásógépesen (${r(tom.life.spade[1])} és ${r(tom.life.control[1])}); az augusztusi értékek 2 minta átlagai. ` +
      `Gomba : baktérium arány ${hu(Math.min(...tomFb), 2)}–${hu(Math.max(...tomFb), 2)}. Kísérő adat.`,
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
  // Hajtás és gyökér lives in the Fotók block (LakitelekRyeBoard: the seven bundles with the measured lengths)
  {
    title: 'Humusz',
    body:
      `Parcellánként egy, az átló mentén vett átlagminta, ezért ez csak irány. ${cap(named(laki.humus.dates[0]))} → ${named(laki.humus.dates[1])} (tarló): ` +
      `${humUp} parcellán nőtt, ${humDown} parcellán csökkent, ${humSame} parcellán alig változott (±0,05 m/m%-on belül). ` +
      `A legnagyobb változás a ${humMaxP.num} parcellán (${HUM_NAMES[humMax]}): ${hu(humMaxP.values[0], 3)} → ${hu(humMaxP.values[1], 3)} m/m%.`,
  },
]

/** "További mérések": the 2026 measurements beside the main ones, told in steps; Szentkirály has a field switch (onion / tomato) */
const FIELDS = [
  { id: 'onion', label: 'Hagyma' },
  { id: 'tomato', label: 'Paradicsom' },
] as const
type Field = (typeof FIELDS)[number]['id']

export default function FurtherMeasuresPage({ site }: { site: 'szentkiraly' | 'lakitelek' }) {
  const phone = useMediaQuery('(max-width: 1024px)') === true
  const [step, setStep] = useState(1)
  const [field, setField] = useState<Field>('onion')
  const isSzk = site === 'szentkiraly' && field === 'onion'
  const isTom = site === 'szentkiraly' && field === 'tomato'
  const isLaki = site === 'lakitelek'
  const chapters = isLaki ? LAKI_CHAPTERS : isTom ? TOMATO_CHAPTERS : SZK_CHAPTERS
  const pickField = (f: Field) => {
    setField(f)
    setStep(1)
  }

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

  /** Kontroll and ásógép over the dates: lines, end labels, a bracket on the last gap and a callout */
  const pairChart = (
    d: { dates: MeasureDate[]; control: number[]; spade: number[] },
    domain: [number, number],
    ticks: number[],
    digits: number,
    callout: { main: string; sub: string },
  ) => {
    const y = lin(domain[0], domain[1], yBot, yTop + FS)
    const last = d.dates.length - 1
    const xs = d.dates.map((_, i) => lin(0, last, X0 + 30, W - (phone ? 110 : 150))(i))
    const lines = [
      { k: 'K', v: d.control, other: d.spade, cls: own.control },
      { k: 'Á', v: d.spade, other: d.control, cls: own.spadeLine },
    ]
    const bx = W - 18
    const yc = y(d.control[last])
    const ys = y(d.spade[last])
    chart = (
      <>
        {grid(ticks, y, ticks.some((t) => !Number.isInteger(t)) ? 1 : 0)}
        {lines.map((l, li) => {
          // The higher end label goes above its point, the lower one below
          const up = l.v[last] === l.other[last] ? li === 0 : l.v[last] > l.other[last]
          return (
            <g key={l.k} className={l.cls}>
              <polyline points={l.v.map((v, i) => `${xs[i]},${y(v)}`).join(' ')} pathLength={1} className={own.line} style={{ animationDelay: `${li * 200}ms` }} />
              {l.v.map((v, i) => <circle key={i} cx={xs[i]} cy={y(v)} r={FS * 0.4} className={own.mark} />)}
              <text x={xs[last] + FS} y={y(l.v[last]) + (up ? -FS * 0.2 : FS * 0.9)} fontSize={FS} className={own.endLabel}>
                {l.k} {hu(l.v[last], digits)}
              </text>
            </g>
          )
        })}
        <path d={`M${bx - 8},${yc} H${bx} V${ys} H${bx - 8}`} className={own.bracket} />
        {d.dates.map((dt, i) => xTick(xs[i], when(dt), i === last))}
      </>
    )
    callouts = <Callout {...box} x={bx} y={(yc + ys) / 2} side="left" dy={FS * 2.2 - (yc + ys) / 2} main={callout.main} sub={callout.sub} delay={1100} />
  }

  if (isSzk && step === 1) {
    const d = szk.bulkDensity
    title = 'Térfogattömeg'
    unit = 'g/cm³ · kisebb = lazább talaj'
    pairChart(d, [1.2, 1.5], [1.2, 1.3, 1.4, 1.5], 2, {
      main: `${hu(d.control[2], 2)} / ${hu(d.spade[2], 2)}`,
      sub: `${when(d.dates[2]).toLowerCase()}: a kontroll tömörebb`,
    })
  }

  if (isTom && step === 1) {
    const d = tom.bulkDensity
    title = 'Térfogattömeg'
    unit = 'g/cm³ · kisebb = lazább talaj · K = kombinátor'
    pairChart(d, [1.1, 1.6], [1.1, 1.2, 1.3, 1.4, 1.5, 1.6], 2, {
      main: `${hu(d.control[2], 2)} / ${hu(d.spade[2], 2)}`,
      sub: `${when(d.dates[2]).toLowerCase()}: a kombinátoros tömörebb`,
    })
  }

  if (isTom && step === 2) {
    const d = tom.humus
    title = 'Humusz'
    unit = `m/m% · ${when(d.dates[0])} → ${when(d.dates[1])}`
    pairChart(d, [1.5, 2.0], [1.5, 1.6, 1.7, 1.8, 1.9, 2.0], 2, {
      main: `${hu(d.control[1], 2)} / ${hu(d.spade[1], 2)}`,
      sub: `${when(d.dates[1]).toLowerCase()}: az ásógépesen több`,
    })
  }

  if (isTom && step === 3) {
    const d = tom.life
    title = 'Talajélet'
    unit = `${d.unit} · ${when(d.dates[0])} → ${when(d.dates[1])}`
    pairChart(d, [300, 650], [300, 400, 500, 600], 0, {
      main: `${r(d.control[1])} / ${r(d.spade[1])}`,
      sub: `${when(d.dates[1]).toLowerCase()}: 2 minta`,
    })
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

  type Parcel = { num: string; role: 'deep' | 'spade' | 'other'; values: number[] }
  /** One row per parcel, first date (ring) → second date (dot) */
  const dumbbell = (parcels: Parcel[], domain: [number, number], ticks: number[], strongAt: (i: number) => boolean, digits = 2) => {
    const x = lin(domain[0], domain[1], X0 + 10, W - (phone ? 24 : 150))
    const rowH = (H - FS * 7.6) / parcels.length
    const ry = (i: number) => FS * 2.2 + rowH * (i + 0.5)
    const node = (
      <>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={FS * 1.6} y2={ry(parcels.length - 1) + rowH / 2} className={own.grid} />
            <text x={x(v)} y={FS * 1.1} fontSize={FS - 1} textAnchor="middle" className={own.axis}>{hu(v, 2)}</text>
          </g>
        ))}
        {parcels.map((p, i) => (
          <g key={p.num} className={`${p.role === 'other' ? own.control : own.spadeLine} ${strongAt(i) ? '' : own.soft}`}>
            <text x={X0 - 14} y={ry(i) + 5} fontSize={FS} textAnchor="end" className={own.rowName}>{p.num.replace('.', '')}</text>
            <line x1={x(p.values[0])} x2={x(p.values[1])} y1={ry(i)} y2={ry(i)} pathLength={1} className={own.line} style={{ animationDelay: `${150 + i * 90}ms` }} />
            <circle cx={x(p.values[0])} cy={ry(i)} r={FS * 0.38} className={own.hollow} />
            <circle cx={x(p.values[1])} cy={ry(i)} r={FS * 0.42} className={own.mark} />
            {!phone && (
              <text x={W - 130} y={ry(i) + 5} fontSize={FS - 1} className={own.rowValue}>
                {hu(p.values[0], digits)} → {hu(p.values[1], digits)}
              </text>
            )}
          </g>
        ))}
      </>
    )
    return { x, ry, node }
  }

  if (isSzk && step === 4) {
    const d = szkLife
    title = 'Talajélet a tábla részein'
    unit = `${d.unit} · ${when(d.dates[0])} → ${when(d.dates[1])}`
    const y = lin(500, 750, yBot, yTop + FS)
    const xa = X0 + (phone ? 60 : 110)
    const xb = W - (phone ? 150 : 250)
    chart = (
      <>
        {grid([500, 550, 600, 650, 700, 750], y, 0)}
        {d.fields.map((f, li) => {
          const [a, b] = f.values
          const endV = (b ?? a) as number
          return (
            <g key={f.id} className={f.role === 'control' ? own.control : own.spadeLine}>
              {a !== null && b !== null && (
                <line x1={xa} y1={y(a)} x2={xb} y2={y(b)} pathLength={1} className={own.line} style={{ animationDelay: `${li * 200}ms` }} />
              )}
              {a !== null && <circle cx={xa} cy={y(a)} r={FS * 0.4} className={own.mark} />}
              {b !== null && <circle cx={xb} cy={y(b)} r={FS * 0.4} className={own.mark} />}
              <text
                x={b !== null ? xb + FS : xa}
                y={b !== null ? y(endV) + 5 : y(endV) - FS}
                fontSize={FS}
                textAnchor={b !== null ? 'start' : 'middle'}
                className={own.endLabel}
              >
                {f.id} {Math.round(endV)}
              </text>
            </g>
          )
        })}
        {xTick(xa, when(d.dates[0]))}
        {xTick(xb, when(d.dates[1]), true)}
      </>
    )
    callouts = (
      <Callout
        {...box}
        x={xb}
        y={y(lifeCtl.values[1] as number)}
        side="left"
        dy={y(735) - y(lifeCtl.values[1] as number)}
        main={`${lifeCtl.id}: kontroll`}
        sub={`${when(d.dates[1]).toLowerCase()}: a legmagasabb`}
        delay={900}
      />
    )
  }

  if (isLaki && step === 3) {
    const d = laki.humus
    title = 'Humusz parcellánként'
    unit = `m/m% · ${when(d.dates[0])} ○ → ● ${when(d.dates[1])} (tarló)`
    const g = dumbbell(d.parcels, [0.42, 0.98], [0.5, 0.7, 0.9], (i) => i === humMax, 3)
    const p = d.parcels[humMax]
    chart = g.node
    callouts = (
      <Callout
        {...box}
        x={(g.x(p.values[0]) + g.x(p.values[1])) / 2}
        y={g.ry(humMax)}
        side="right"
        dy={H - FS * 2.2 - g.ry(humMax)}
        main={`${humDelta[humMax] > 0 ? '+' : ''}${hu(humDelta[humMax], 2)} m/m%`}
        sub={`${humUp} nőtt · ${humDown} csökkent · ${humSame} alig változott`}
        delay={900}
      />
    )
  }

  if (isLaki && step === 1) {
    const d = laki.bulkDensity
    title = 'Térfogattömeg parcellánként'
    unit = `g/cm³ · ${when(d.dates[0])} ○ → ● ${when(d.dates[1])} (tarló)`
    const g = dumbbell(d.parcels, [1.36, 1.52], [1.4, 1.45, 1.5], (i) => Math.abs(lakiDelta[i]) === lakiMaxDelta)
    const big = lakiDelta.findIndex((v) => Math.abs(v) === lakiMaxDelta && v > 0)
    const mark = big >= 0 ? big : 0
    chart = g.node
    callouts = (
      <Callout
        {...box}
        x={(g.x(d.parcels[mark].values[0]) + g.x(d.parcels[mark].values[1])) / 2}
        y={g.ry(mark)}
        side="right"
        dy={H - FS * 2.2 - g.ry(mark)}
        main={`legfeljebb ${hu(lakiMaxDelta / 100, 2)}`}
        sub={`${lakiUp} nőtt · ${lakiDown} csökkent · ${lakiSame} nem változott`}
        delay={900}
      />
    )
  }

  if (isLaki && step === 2) {
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

  const stage = (
    <>
      <div className={own.chartHead}>
        <span className={own.chartTitle}>{title}</span>
        <span className={own.chartUnit}>{unit}</span>
      </div>
      <svg key={`${site}-${field}-${step}`} viewBox={`0 0 ${W} ${H}`} className={own.chart} role="img" aria-label={`${title}. ${chapters[step - 1].body}`}>
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
          <span>{isLaki ? 'Lakitelek' : 'Szentkirály'}</span>
        </div>
        <h3 className={styles.headerTitle}>
          {isLaki ? 'További mérések: a talaj a rozs alatt' : isTom ? 'További mérések: a paradicsomtábla' : 'További mérések: a talaj a hagyma alatt'}
        </h3>
        <div className={styles.seasonRow}>
          <div className={own.metaRow}>
            <SeasonOnly years={[2026]} />
            {!isLaki && (
              <div className={`${switchStyles.switch} ${switchStyles.small}`} role="group" aria-label="Tábla">
                <span className={switchStyles.label} aria-hidden="true">Tábla</span>
                {FIELDS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`${switchStyles.option} ${field === f.id ? switchStyles.active : ''}`}
                    aria-pressed={field === f.id}
                    onClick={() => pickField(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <Story
        label={isLaki ? 'További mérések, Lakitelek' : isTom ? 'További mérések, Szentkirály, paradicsom' : 'További mérések, Szentkirály, hagyma'}
        chapters={chapters}
        step={step}
        onStep={setStep}
        stage={stage}
      />
    </div>
  )
}
