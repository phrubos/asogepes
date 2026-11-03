'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { szentkiralyGrowth, type GrowthMeasure, type Range } from '@/lib/seasons'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import SeasonOnly from '../season/SeasonOnly'
import Story from '../story/Story'
import Callout from '../story/Callout'
import { cap, named, namedIn, short } from '../story/dates'
import storyStyles from '../story/Story.module.css'
// Same page frame as the onion field's loose-layer block
import styles from './SzentkirályTimelinePage.module.css'
import own from './SzentkiralyGrowthPage.module.css'

const site = szentkiralyGrowth
const season = site.seasons[site.seasons.length - 1]
const first = season.dates[0]
const second = season.dates[season.dates.length - 1]
const { catchUp } = season

const fmt = ([a, b]: Range) => (a === b ? String(a) : `${a}–${b}`)
const when = short
const ratio = first.spade.bulb / first.control.bulb

type PlantId = 'c1' | 'a1' | 'c2' | 'a2'
const PLANTS: { id: PlantId; col: 0 | 1; row: 'c' | 'a'; m: GrowthMeasure }[] = [
  { id: 'c1', col: 0, row: 'c', m: first.control },
  { id: 'a1', col: 0, row: 'a', m: first.spade },
  { id: 'c2', col: 1, row: 'c', m: second.control },
  { id: 'a2', col: 1, row: 'a', m: second.spade },
]
const ALL = PLANTS.map((p) => p.id)

/* What each chapter lights up: b = bulbs, l = leaves */
const FOCUS: { b: PlantId[]; l: PlantId[] }[] = [
  { b: ['c1', 'a1'], l: [] },
  { b: [], l: ['c1', 'a1'] },
  { b: ['c2', 'a2'], l: ['c2', 'a2'] },
  { b: ['a1', 'c2'], l: ['a1', 'c2'] },
  { b: ALL, l: ALL },
]

const CHAPTERS = [
  {
    title: `${cap(named(first.date))}: a fej`,
    body: `Ugyanazon a napon az ásógépes hagyma feje ${first.spade.bulb} mm, a kontrollé ${first.control.bulb} mm: ${ratio > 2 ? 'több mint kétszer akkora' : `${ratio.toFixed(1).replace('.', ',')}-szer akkora`} átmérő.`,
  },
  {
    title: `${cap(named(first.date))}: a levelek`,
    body: `Az ásógépes hagymán több és hosszabb levél nőtt: ${fmt(first.spade.leafCount)} levél, ${fmt(first.spade.leafLength)} cm. A kontrollon ${fmt(first.control.leafCount)} levél, ${fmt(first.control.leafLength)} cm.`,
  },
  {
    title: cap(named(second.date)),
    body: `Egy hónappal később mindkét hagyma nőtt. Az ásógépes feje ${second.spade.bulb} mm, a kontrollé ${second.control.bulb} mm.`,
  },
  {
    title: 'Egy hónap előny',
    body: `A ${catchUp.mm} mm-es fejet az ásógépes parcellán ${namedIn(catchUp.spadeDate)} mértük, a kontrollon csak ${namedIn(catchUp.controlDate)}.`,
  },
  {
    title: 'Összkép',
    body: 'Az ásógépes hagyma kb. egy hónappal előrébb jár: mindkét felvételen nagyobb a feje, több és hosszabb a levele.',
  },
]

/** Drawing sizes; phones get a narrower drawing so the type stays at least 12px */
function geometry(phone: boolean) {
  const g = phone ? 0.6 : 1
  return phone
    ? { W: 400, H: 410, FS: 17, cols: [140, 310], soil: { c: 150, a: 352 }, strip: 58, g, nameY: 22, valueY: 48 }
    : { W: 680, H: 530, FS: 17, cols: [250, 530], soil: { c: 250, a: 490 }, strip: 40, g, nameY: 27, valueY: 27 }
}

/** Szentkirály onion, 2026: four plants (kontroll / ásógép × two dates), told in five steps */
export default function SzentkiralyGrowthPage() {
  const phone = useMediaQuery('(max-width: 1024px)') === true
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const grown = inView || reduced
  const [step, setStep] = useState(1)

  const G = geometry(phone)
  const PX = 2.3 * G.g
  const shape = (id: PlantId) => {
    const p = PLANTS.find((x) => x.id === id)!
    const x = G.cols[p.col]
    const soil = G.soil[p.row]
    const rx = p.m.bulb * 0.6 * G.g
    const ry = p.m.bulb * 0.48 * G.g
    const cy = soil - ry * 0.8
    const top = cy - ry * 0.85
    return { ...p, x, soil, rx, ry, cy, top, tip: top - p.m.leafLength[1] * PX }
  }
  const S = Object.fromEntries(ALL.map((id) => [id, shape(id)])) as Record<PlantId, ReturnType<typeof shape>>
  const focus = FOCUS[step - 1]
  const op = (lit: PlantId[], near: PlantId[], id: PlantId) => (lit.includes(id) ? 1 : near.includes(id) ? 0.4 : 0.13)
  const linked = step >= 4

  // The "one month" arrow: from the spade bulb at the first date to the control bulb at the second
  const a = S.a1
  const c = S.c2
  const p0 = { x: a.x + a.rx + G.FS * 0.6, y: a.cy - a.ry * 0.3 }
  const p3 = { x: c.x - c.rx - G.FS * 0.7, y: c.cy + c.ry * 0.5 }
  const p1 = { x: p0.x + (p3.x - p0.x) * 0.5, y: p0.y }
  const p2 = { x: p3.x - (p3.x - p0.x) * 0.15, y: p3.y + (p0.y - p3.y) * 0.35 }
  const arrow = `M${p0.x.toFixed(1)},${p0.y.toFixed(1)} C${p1.x.toFixed(1)},${p1.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)} ${p3.x.toFixed(1)},${p3.y.toFixed(1)}`
  const dl = Math.hypot(p3.x - p2.x, p3.y - p2.y)
  const ux = (p3.x - p2.x) / dl
  const uy = (p3.y - p2.y) / dl
  const hl = G.FS * 0.9
  const head = `M${(p3.x - ux * hl - uy * hl * 0.6).toFixed(1)},${(p3.y - uy * hl + ux * hl * 0.6).toFixed(1)} L${p3.x.toFixed(1)},${p3.y.toFixed(1)} L${(p3.x - ux * hl + uy * hl * 0.6).toFixed(1)},${(p3.y - uy * hl - ux * hl * 0.6).toFixed(1)}`
  const mid = {
    x: 0.125 * p0.x + 0.375 * p1.x + 0.375 * p2.x + 0.125 * p3.x,
    y: 0.125 * p0.y + 0.375 * p1.y + 0.375 * p2.y + 0.125 * p3.y,
  }

  const box = { fs: G.FS, w: G.W, h: G.H }
  const callouts = [
    [
      <Callout key="c" {...box} x={S.c1.x + S.c1.rx} y={S.c1.cy} side="right" dy={-G.FS * 2} main={`Ø ${first.control.bulb} mm`} sub="kontroll" grey />,
      <Callout key="a" {...box} x={S.a1.x + S.a1.rx} y={S.a1.cy} side="right" dy={-G.FS * 1.5} main={`Ø ${first.spade.bulb} mm`} sub={ratio > 2 ? 'több mint kétszeres átmérő' : 'ásógép'} delay={410} />,
    ],
    [
      <Callout key="c" {...box} x={S.c1.x} y={S.c1.tip} side="right" dy={G.FS} main={`${fmt(first.control.leafCount)} levél`} sub={`${fmt(first.control.leafLength)} cm hosszú`} grey />,
      <Callout key="a" {...box} x={S.a1.x} y={S.a1.top - first.spade.leafLength[1] * PX * 0.7} side="right" main={`${fmt(first.spade.leafCount)} levél`} sub={`${fmt(first.spade.leafLength)} cm hosszú`} delay={410} />,
    ],
    [
      <Callout key="c" {...box} x={S.c2.x - S.c2.rx} y={S.c2.cy} side="left" dy={-G.FS * 2} main={`Ø ${second.control.bulb} mm`} sub={`${fmt(second.control.leafCount)} levél · ${fmt(second.control.leafLength)} cm`} grey />,
      <Callout key="a" {...box} x={S.a2.x - S.a2.rx} y={S.a2.cy} side="left" dy={-G.FS * 2} main={`Ø ${second.spade.bulb} mm`} sub={`${fmt(second.spade.leafCount)} levél · ${fmt(second.spade.leafLength)} cm`} delay={410} />,
    ],
    [<Callout key="m" {...box} x={mid.x} y={mid.y} side="right" dy={G.FS * 3.2} main="≈ 1 hónap" sub={`ugyanaz a ${catchUp.mm} mm-es fej`} delay={900} />],
    [],
  ][step - 1]

  const stage = (
    <svg
      viewBox={`0 0 ${G.W} ${G.H}`}
      className={own.stage}
      role="img"
      aria-label={`Vöröshagyma 2026. ${when(first.date)}: kontroll fej ${first.control.bulb} mm, ásógépes ${first.spade.bulb} mm. ${when(second.date)}: kontroll ${second.control.bulb} mm, ásógépes ${second.spade.bulb} mm.`}
    >
      {/* Date columns */}
      {[first, second].map((d, i) => (
        <text
          key={d.id}
          x={G.cols[i]}
          y={G.FS * 1.4}
          fontSize={G.FS}
          textAnchor="middle"
          className={`${own.colHead} ${(i === 0 ? step <= 2 || step === 4 : step >= 3) && step < 5 ? own.colHeadOn : ''}`}
        >
          {when(d.date)}
        </text>
      ))}
      {!phone && (
        <text x={(G.cols[0] + G.cols[1]) / 2} y={G.FS * 1.4} fontSize={G.FS} textAnchor="middle" className={own.colGap}>
          + 1 hónap →
        </text>
      )}

      {/* Two rows of soil */}
      {(['c', 'a'] as const).map((row) => (
        <g key={row}>
          <rect x={-2} y={G.soil[row]} width={G.W + 4} height={G.strip} className={own.soil} />
          <line x1={-2} x2={G.W + 2} y1={G.soil[row]} y2={G.soil[row]} className={own.soilLine} />
          <text x={4} y={G.soil[row] + G.nameY} fontSize={G.FS} className={`${own.rowName} ${row === 'a' ? own.nameSpade : own.nameControl}`}>
            {row === 'a' ? 'ÁSÓGÉP' : 'KONTROLL'}
          </text>
        </g>
      ))}

      {ALL.map((id, pi) => {
        const p = S[id]
        const spade = p.row === 'a'
        const n = p.m.leafCount[1]
        const extra = (n - p.m.leafCount[0]) / 2
        const mid = (n - 1) / 2
        return (
          <g key={id}>
            <g className={storyStyles.focus} style={{ opacity: op(focus.l, focus.b, id) }}>
              {Array.from({ length: n }, (_, i) => {
                const t = mid ? Math.abs(i - mid) / mid : 0
                const cm = p.m.leafLength[1] - (p.m.leafLength[1] - p.m.leafLength[0]) * t
                const ang = n > 1 ? -50 + (100 * i) / (n - 1) : 0
                const faded = i < extra || i >= n - extra
                return (
                  <path
                    key={i}
                    d="M0,0 C-5,-30 -4,-72 0,-100 C4,-72 5,-30 0,0 Z"
                    className={`${own.leaf} ${spade ? own.leafSpade : own.leafControl}`}
                    style={{
                      transform: `translate(${p.x}px, ${p.top.toFixed(1)}px) rotate(${ang.toFixed(1)}deg) scale(${1.3 * G.g}, ${grown ? ((cm * PX) / 100).toFixed(3) : 0})`,
                      opacity: faded ? 0.3 : 0.92,
                      transitionDelay: `${pi * 120 + i * 25}ms`,
                    }}
                  />
                )
              })}
            </g>
            <g className={storyStyles.focus} style={{ opacity: op(focus.b, focus.l, id) }}>
              <g className={own.bulbGrow} style={{ transform: grown ? 'scale(1)' : 'scale(0)', transitionDelay: `${pi * 120}ms` }}>
                <ellipse cx={p.x} cy={p.cy} rx={p.rx} ry={p.ry} className={spade ? own.bulbSpade : own.bulbControl} />
                <path
                  d={`M${p.x - p.rx * 0.62},${p.cy} Q${p.x},${p.cy - p.ry * 1.1} ${p.x + p.rx * 0.62},${p.cy} M${p.x - p.rx * 0.36},${p.cy + 2} Q${p.x},${p.cy - p.ry * 0.7} ${p.x + p.rx * 0.36},${p.cy + 2}`}
                  className={own.bulbRings}
                />
              </g>
              <text x={p.x} y={p.soil + G.valueY} fontSize={G.FS} textAnchor="middle" className={own.bulbValue}>
                Ø {p.m.bulb} mm
              </text>
            </g>
          </g>
        )
      })}

      {/* The same head size, one month apart */}
      <g className={storyStyles.focus} style={{ opacity: linked ? 1 : 0 }} aria-hidden="true">
        {[S.a1, S.c2].map((p) => (
          <ellipse key={p.id} cx={p.x} cy={p.cy} rx={p.rx + G.FS * 0.6} ry={p.ry + G.FS * 0.6} className={own.ring} />
        ))}
      </g>
      <path d={arrow} pathLength={1} className={`${own.arrow} ${linked ? own.arrowOn : ''}`} aria-hidden="true" />
      <path d={head} className={`${own.arrowHead} ${linked ? own.arrowHeadOn : ''}`} aria-hidden="true" />

      <g key={step}>{callouts}</g>
    </svg>
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
          <span>Szentkirály</span>
        </div>
        <h3 className={styles.headerTitle}>Az ásógépes hagyma egy hónappal előrébb jár</h3>
        <div className={styles.seasonRow}>
          <SeasonOnly years={site.seasons.map((s) => s.year)} />
        </div>
      </motion.div>

      <div ref={ref}>
        <Story
          label="A hagyma fejlődése lépésenként"
          chapters={CHAPTERS}
          step={step}
          onStep={setStep}
          stage={stage}
          footer={<p className={own.note}>{season.rangeNote}</p>}
        />
      </div>
    </div>
  )
}
