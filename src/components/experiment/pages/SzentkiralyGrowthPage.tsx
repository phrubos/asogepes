'use client'

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { MapPin, Maximize2 } from 'lucide-react'
import { szentkiralyGrowth, type GrowthMeasure, type MeasureDate, type Range } from '@/lib/seasons'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import type { Locale } from '@/lib/i18n/config'
import { researchData } from '@/lib/i18n/useResearchData'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { PhotoViewerModal } from '@/components/shared/PhotoViewer/PhotoViewerModal'
import SeasonOnly from '../season/SeasonOnly'
import Story from '../story/Story'
import { cap, named, namedIn, short } from '../story/dates'
// Same page frame as the onion field's loose-layer block
import styles from './SzentkirályTimelinePage.module.css'
import own from './SzentkiralyGrowthPage.module.css'
import PhotoCredit from '@/components/ui/PhotoCredit/PhotoCredit'

const site = szentkiralyGrowth
const season = site.seasons[site.seasons.length - 1]
const first = season.dates[0]
const second = season.dates[season.dates.length - 1]
const { catchUp } = season

const fmt = ([a, b]: Range) => (a === b ? String(a) : `${a}–${b}`)
const ratio = first.spade.bulb / first.control.bulb

/** Every text of the block in one language (dates and figures from seasons.ts) */
function copy(locale: Locale) {
  const en = locale === 'en'
  const sh = (d: MeasureDate) => short(d, locale)
  const nm = (d: MeasureDate) => named(d, locale)
  const nIn = (d: MeasureDate) => namedIn(d, locale)
  const leaves = (m: GrowthMeasure) => `${fmt(m.leafCount)} ${en ? 'leaves' : 'levél'} · ${fmt(m.leafLength)} cm`
  const dates = researchData(szentkiralyGrowth, locale).seasons[site.seasons.length - 1].dates
  return {
    en,
    leaves,
    M1: sh(first.date).toUpperCase(),
    M2: sh(second.date).toUpperCase(),
    chapters: en
      ? [
          {
            title: cap(nm(first.date)),
            body: `Onions lifted on the same day. The spaded bulb is ${first.spade.bulb} mm, the control ${first.control.bulb} mm: ${ratio > 2 ? 'more than twice' : `${ratio.toFixed(1)} times`} the diameter, and the foliage is fuller too.`,
          },
          {
            title: cap(nm(second.date)),
            body: `A month later both onions had grown: the control bulb is ${second.control.bulb} mm, the spaded one ${second.spade.bulb} mm.`,
          },
          {
            title: 'A month ahead',
            body: `The control reached the ${catchUp.mm} mm bulb only ${nIn(catchUp.controlDate)}; the spaded onion already had it ${nIn(catchUp.spadeDate)}.`,
          },
          { title: 'Overview', body: 'The four measured bulbs on one scale. At both dates the spaded onion is a step ahead.' },
        ]
      : [
          {
            title: cap(nm(first.date)),
            body: `Ugyanazon a napon felszedett hagymák. Az ásógépes fej ${first.spade.bulb} mm, a kontrollé ${first.control.bulb} mm: ${ratio > 2 ? 'több mint kétszeres' : `${ratio.toFixed(1).replace('.', ',')}-szeres`} átmérő, és dúsabb a lomb is.`,
          },
          {
            title: cap(nm(second.date)),
            body: `Egy hónappal később mindkét hagyma nőtt: a kontroll feje ${second.control.bulb} mm, az ásógépesé ${second.spade.bulb} mm.`,
          },
          {
            title: 'Egy hónap előny',
            body: `A kontroll csak ${nIn(catchUp.controlDate)} érte el azt a ${catchUp.mm} mm-es fejet, amelyet az ásógépes hagyma már ${nIn(catchUp.spadeDate)} hozott.`,
          },
          { title: 'Összkép', body: 'A négy mért fej egy mércén. Az ásógépes hagyma mindkét időpontban egy lépéssel előrébb jár.' },
        ],
    labels: en
      ? [
          `${sh(first.date)}: control bulb ${first.control.bulb} mm, spaded ${first.spade.bulb} mm (field photo)`,
          `${sh(second.date)}: control bulb ${second.control.bulb} mm, spaded ${second.spade.bulb} mm (field photo)`,
          `The control bulb in ${nm(catchUp.controlDate)} and the spaded bulb in ${nm(catchUp.spadeDate)} side by side: both ${catchUp.mm} mm`,
          `Four circles to scale: control ${first.control.bulb} and ${second.control.bulb} mm, spading machine ${first.spade.bulb} and ${second.spade.bulb} mm`,
        ]
      : [
          `${sh(first.date)}: kontroll fej ${first.control.bulb} mm, ásógépes ${first.spade.bulb} mm (terepi fotó)`,
          `${sh(second.date)}: kontroll fej ${second.control.bulb} mm, ásógépes ${second.spade.bulb} mm (terepi fotó)`,
          `A kontroll ${nm(catchUp.controlDate)}i és az ásógépes ${nm(catchUp.spadeDate)}i feje egymás mellett: mindkettő ${catchUp.mm} mm`,
          `Négy kör léptékhelyesen: kontroll ${first.control.bulb} és ${second.control.bulb} mm, ásógép ${first.spade.bulb} és ${second.spade.bulb} mm`,
        ],
    captions: en
      ? [
          'A real field photo, rotated: bulbs at the bottom, leaves pointing up. The measuring tape separates the two plots.',
          '',
          'The two photos are at the same scale (the measuring tape is the same size in both), so the bulbs can be compared directly.',
          'The diameter of each circle is proportional to the measured bulb diameter.',
        ]
      : [
          'Valódi terepi fotó, elforgatva: a fejek alul, a levelek fölfelé. A két parcellát a mérőszalag választja el.',
          '',
          'A két fotó azonos léptékű (a mérőszalag mindkettőn ugyanakkora), így a fejek közvetlenül összevethetők.',
          'A körök átmérője arányos a mért fejátmérővel.',
        ],
    /** both field photos, day by day: "Fotók: Szentkirály, 2026. június 26. és július 22." */
    credit: en
      ? `Szentkirály, ${dates[0].photoDate.replace(/ \d{4}$/, '')} and ${dates[dates.length - 1].photoDate}`
      : `Szentkirály, ${first.photoDate} és ${second.photoDate.replace(/^\d+\. /, '')}`,
    photos: [first, second].map((d, i) => ({
      src: d.photo,
      alt: en
        ? `Lifted onions, Szentkirály, ${nm(d.date)} ${season.year}: control on the left, spaded plot on the right, measuring tape in the middle`
        : `Felszedett vöröshagymák, Szentkirály, ${season.year}. ${nm(d.date)}: balra a kontroll, jobbra az ásógépes parcella, középen mérőszalag`,
      title: en ? `Onion, ${nm(d.date)}` : `Vöröshagyma, ${nm(d.date)}`,
      credit: `Szentkirály, ${dates[i === 0 ? 0 : dates.length - 1].photoDate}`,
      description: en
        ? `Left, the control (bulb Ø ${d.control.bulb} mm, ${leaves(d.control)}); right, the spaded plot (bulb Ø ${d.spade.bulb} mm, ${leaves(d.spade)}). The photo is rotated by 90°: bulbs at the bottom.`
        : `Balra a kontroll (fej Ø ${d.control.bulb} mm, ${leaves(d.control)}), jobbra az ásógépes parcella (fej Ø ${d.spade.bulb} mm, ${leaves(d.spade)}). A fotó 90°-kal elforgatva: a fejek alul.`,
    })),
    control: en ? 'CONTROL' : 'KONTROLL',
    spade: en ? 'SPADING M.' : 'ÁSÓGÉP',
    earlier: en ? 'a month earlier' : 'egy hónappal korábban',
    later: en ? 'a month later' : 'egy hónappal később',
    sameBulb: en ? '= the same bulb, a month earlier' : '= ugyanaz a fej, egy hónappal korábban',
    ahead: en ? '≈ 1 month ahead' : '≈ 1 hónap előny',
    slider: en ? `Time slider: between ${nm(first.date)} and ${nm(second.date)}` : `Idő-csúszka: ${nm(first.date)} és ${nm(second.date)} között`,
    drag: en
      ? `Drag the gold line on the image: left of it the ${nm(first.date)} state, right of it ${nm(second.date)}.`
      : `Húzd az arany vonalat a képen: tőle balra a ${nm(first.date)}i, jobbra a ${nm(second.date)}i állapot.`,
    full: en ? 'Full photo' : 'Teljes fotó',
    title: en ? 'The spaded onion is a month ahead' : 'Az ásógépes hagyma egy hónappal előrébb jár',
    story: en ? 'Onion growth, step by step' : 'A hagyma fejlődése lépésenként',
    named: nm,
    short: sh,
  }
}

const COPY = { hu: copy('hu'), en: copy('en') }

/* Desktop stage drawn on a 792 × 366 grid (the photos' aspect); positions become percentages */
const DW = 792
const DH = 366
const px = (x: number) => `${((x / DW) * 100).toFixed(2)}%`
const py = (y: number) => `${((y / DH) * 100).toFixed(2)}%`

/* Desktop value tags on the photo: x/y = where the tag's pin sits (above the bulbs) */
const TAGS = [
  { step: 1, x: 285, y: 244, m: first.control, grey: true },
  { step: 1, x: 535, y: 244, m: first.spade, grey: false },
  { step: 2, x: 220, y: 226, m: second.control, grey: true },
  { step: 2, x: 584, y: 226, m: second.spade, grey: false },
]

/* The summary: four circles, diameter ∝ measured bulb diameter */
const CIRCLES = (scale: number, at: { cx: number; base: number }[]) =>
  [
    { m: first.control, d: first.date, grey: true, link: false },
    { m: second.control, d: second.date, grey: true, link: true },
    { m: first.spade, d: first.date, grey: false, link: true },
    { m: second.spade, d: second.date, grey: false, link: false },
  ].map((c, i) => ({ ...c, ...at[i], r: (c.m.bulb * scale) / 2 }))

const D_CIRCLES = CIRCLES(2.2, [
  { cx: 130, base: 290 },
  { cx: 296, base: 290 },
  { cx: 504, base: 290 },
  { cx: 680, base: 290 },
])
const PW = 350
const PH = 408
const P_CIRCLES = CIRCLES(1.5, [
  { cx: 96, base: 170 },
  { cx: 250, base: 170 },
  { cx: 96, base: 352 },
  { cx: 250, base: 352 },
])

function Photo({ src, sizes }: { src: string; sizes: string }) {
  return <Image src={src} alt="" fill sizes={sizes} className={own.photo} />
}

function Summary({ w, h, circles, arc, head, children, monthOf }: {
  monthOf: (d: MeasureDate) => string
  w: number
  h: number
  circles: ReturnType<typeof CIRCLES>
  arc: string
  head: string
  children: ReactNode
}) {
  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`} className={own.sumSvg} aria-hidden="true">
        {circles.map((c, i) => (
          <circle
            key={i}
            cx={c.cx}
            cy={c.base - c.r}
            r={c.r - 1}
            className={`${own.circle} ${c.grey ? own.circleControl : own.circleSpade} ${c.link ? own.circleLink : ''}`}
            style={{ '--d': `${i * 0.12}s` } as CSSProperties}
          />
        ))}
        <path d={arc} pathLength={1} className={own.arc} />
        <path d={head} pathLength={1} className={`${own.arc} ${own.arcHead}`} />
      </svg>
      {circles.map((c, i) => (
        <span
          key={i}
          className={own.circleLabel}
          style={{ left: `${(c.cx / w) * 100}%`, top: `calc(${(c.base / h) * 100}% + 8px)`, '--d': `${i * 0.12}s` } as CSSProperties}
        >
          <b className={c.grey ? own.valControl : own.valSpade}>Ø {c.m.bulb} mm</b>
          <span>{monthOf(c.d)}</span>
        </span>
      ))}
      {children}
    </>
  )
}

/** Szentkirály onion, 2026: the two field photos (June, July) and the measured bulbs, told in four steps */
export default function SzentkiralyGrowthPage() {
  const c = COPY[useLocale()]
  const { leaves, M1, M2 } = c
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const revealed = inView || reduced
  const [step, setStep] = useState(1)
  // Time slider on step 2: 0 = June, 100 = July
  const [w, setW] = useState(0)
  const [drag, setDrag] = useState(false)
  const [viewer, setViewer] = useState<number | null>(null)
  const [viewerUsed, setViewerUsed] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => clearTimeout(timer.current), [])

  const onStep = (s: number) => {
    clearTimeout(timer.current)
    setStep(s)
    setDrag(false)
    if (s === 2) {
      // Entering July: the slider sweeps from June to July by itself, then the reader can drag it back
      if (reduced) setW(100)
      else {
        setW(0)
        timer.current = setTimeout(() => setW(100), 150)
      }
    }
  }

  const july = w > 50
  // The gold line: June to its left, July to its right (time runs left to right)
  const line = 100 - w
  const instant = drag || reduced

  // Step 2: drag (or click / tap) on the photo itself; keys on the handle
  // Mouse: a press jumps there. Touch: only a tap or a sideways drag moves it, so a scroll that starts
  // on the photo leaves it alone (the browser cancels the pointer when it scrolls: touch-action pan-y)
  const press = useRef<{ x: number; touch: boolean } | null>(null)
  const posAt = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    return Math.round(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)))
  }
  const onScrubDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    clearTimeout(timer.current)
    const touch = e.pointerType !== 'mouse'
    press.current = { x: e.clientX, touch }
    e.currentTarget.setPointerCapture(e.pointerId)
    if (!touch) setW(100 - posAt(e))
  }
  const onScrubMove = (e: PointerEvent<HTMLDivElement>) => {
    const p = press.current
    if (!p || (p.touch && Math.abs(e.clientX - p.x) < 6 && !drag)) return
    setDrag(true)
    setW(100 - posAt(e))
  }
  const onScrubUp = (e: PointerEvent<HTMLDivElement>) => {
    const p = press.current
    if (p?.touch && !drag) setW(100 - posAt(e))
    onScrubEnd()
  }
  const onScrubEnd = () => {
    press.current = null
    setDrag(false)
  }
  const onHandleKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowLeft: line - 5, ArrowDown: line - 5, ArrowRight: line + 5, ArrowUp: line + 5, PageDown: line - 25, PageUp: line + 25, Home: 0, End: 100 }
    if (!(e.key in keys)) return
    e.preventDefault()
    clearTimeout(timer.current)
    setW(100 - Math.min(100, Math.max(0, keys[e.key])))
  }
  // Inside the swipeable Story: keep the scrubbing touches away from its swipe handler
  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation()
  const scrub = step === 2 && (
    <div
      className={own.scrub}
      onPointerDown={onScrubDown}
      onPointerMove={onScrubMove}
      onPointerUp={onScrubUp}
      onPointerCancel={onScrubEnd}
      onLostPointerCapture={onScrubEnd}
      onTouchStart={stop}
      onTouchEnd={stop}
    >
      <span
        className={`${own.handle} ${instant ? own.instant : ''}`}
        style={{ left: `${line}%` }}
        role="slider"
        tabIndex={0}
        aria-label={c.slider}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={line}
        aria-valuetext={july ? c.short(second.date) : c.short(first.date)}
        onKeyDown={onHandleKey}
      >
        <span className={own.knob} aria-hidden="true">‹ ›</span>
        <span className={`${own.month} ${own.monthL}`} aria-hidden="true">{M1}</span>
        <span className={`${own.month} ${own.monthR}`} aria-hidden="true">{M2}</span>
      </span>
    </div>
  )

  const julClip = step === 2 ? `inset(0 0 0 ${100 - w}%)` : step === 3 ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)'
  const on = (cond: boolean) => (cond ? own.on : '')
  const photoIndex = step === 2 && july ? 1 : 0

  // Phone: one box per plot; which photo and values each box shows
  const pK = step === 1 || (step === 2 && !july) ? { d: first, sub: leaves(first.control), m: first.control } : { d: second, sub: step === 3 ? c.later : leaves(second.control), m: second.control }
  const pA = step === 3 ? { d: first, sub: c.earlier, m: first.spade } : step === 2 && july ? { d: second, sub: leaves(second.spade), m: second.spade } : { d: first, sub: leaves(first.spade), m: first.spade }

  const desktop = (
    <div className={`${own.stage} ${own.desktop} ${on(revealed)}`} data-step={step}>
      <span className={own.a11y} role="img" aria-label={c.labels[step - 1]} />
      <div className={`${own.layer} ${own.reveal} ${on(step <= 2)}`}>
        <Photo src={first.photo} sizes="(max-width: 1024px) 100vw, 1000px" />
      </div>
      <div className={`${own.layer} ${own.wipe} ${on(step === 2)} ${instant ? own.instant : ''}`} style={{ clipPath: julClip }}>
        <Photo src={second.photo} sizes="(max-width: 1024px) 100vw, 1000px" />
      </div>

      <div className={`${own.overlay} ${own.fade} ${on(step <= 2 && revealed)}`}>
        <span className={`${own.plot} ${own.plotControl}`} style={{ left: 16 }}>{c.control}</span>
        <span className={`${own.plot} ${own.plotSpade}`} style={{ right: 16 }}>{c.spade}</span>
      </div>

      {TAGS.map((t, i) => (
        <span
          key={i}
          className={`${own.tag} ${t.grey ? own.tagControl : own.tagSpade} ${on(revealed && step === t.step && (step !== 2 || w > 90))}`}
          style={{ left: px(t.x), top: py(t.y), '--d': `${(i % 2) * 0.15 + 0.35}s` } as CSSProperties}
        >
          <span className={own.tagBox}>
            <b>Ø {t.m.bulb} mm</b>
            <span>{leaves(t.m)}</span>
          </span>
          <span className={own.pin} />
        </span>
      ))}

      {scrub}

      {/* Step 3: the July control next to the June spade plot, zoomed on the bulb row */}
      <div className={`${own.split} ${on(step === 3)}`}>
        <div className={`${own.half} ${own.halfL}`}>
          <div className={own.halfImg} style={{ left: 0, transformOrigin: `${px(220)} ${py(259)}` }}>
            <Photo src={second.photo} sizes="(max-width: 1024px) 100vw, 1000px" />
          </div>
          <span className={own.band} style={{ left: '7.6%', top: '60.66%', width: '89.6%', height: '20.22%' }} />
          <span className={own.halfTag} style={{ left: 14 }}>
            <span>{c.control} · {M2}</span>
            <b>Ø {second.control.bulb} mm</b>
          </span>
        </div>
        <div className={`${own.half} ${own.halfR}`}>
          <div className={own.halfImg} style={{ left: 'calc(-100% - 2px)', transformOrigin: `${px(534)} ${py(278)}` }}>
            <Photo src={first.photo} sizes="(max-width: 1024px) 100vw, 1000px" />
          </div>
          <span className={own.band} style={{ left: '3.54%', top: '65.85%', width: '63.29%', height: '20.22%' }} />
          <span className={`${own.halfTag} ${own.halfTagSpade}`} style={{ right: 14 }}>
            <span>{c.spade} · {M1}</span>
            <b>Ø {first.spade.bulb} mm</b>
          </span>
        </div>
        <span className={own.badge} style={{ top: 22 }}>= {c.earlier}</span>
      </div>

      {/* Step 4: what is left of the old drawing, four bulbs to scale */}
      <div className={`${own.sum} ${on(step === 4)}`}>
        <Summary w={DW} h={DH} circles={D_CIRCLES} arc="M 504 172 C 470 70, 330 70, 296 172" head="M 288 162 L 296 174 L 306 164" monthOf={c.named}>
          <span className={`${own.sumHead} ${own.valControl}`} style={{ left: px(32), top: py(24) }}>{c.control}</span>
          <span className={`${own.sumHead} ${own.valSpade}`} style={{ left: px(440), top: py(24) }}>{c.spade}</span>
          <span className={own.sumRule} style={{ top: py(290) }} />
          <span className={own.sumBadge} style={{ left: px(400), top: py(46), transform: 'translateX(-50%)' }}>{c.ahead}</span>
        </Summary>
      </div>
    </div>
  )

  const box = (kind: 'k' | 'a') => {
    const k = kind === 'k'
    const v = k ? pK : pA
    const zoom = step === 3 && (k ? 'jul' : 'jun')
    return (
      <div className={`${own.box} ${k ? '' : own.boxSpade}`}>
        <div
          className={`${own.boxImg} ${on(k ? step <= 2 : step <= 3)} ${zoom === 'jun' ? own.zoomed : ''}`}
          style={{ left: k ? 0 : '-100%', top: '-46%', transformOrigin: k ? '25% 74.92%' : '67.43% 75.85%' }}
        >
          <Photo src={first.photo} sizes="200vw" />
        </div>
        <div
          className={`${own.boxImg} ${own.wipe} ${on(k ? step === 2 || step === 3 : step === 2)} ${zoom === 'jul' ? own.zoomed : ''} ${instant ? own.instant : ''}`}
          style={{ left: k ? 0 : '-100%', top: '-40%', transformOrigin: '27.86% 70.59%', clipPath: julClip }}
        >
          <Photo src={second.photo} sizes="200vw" />
        </div>
        <span className={`${own.band} ${own.fade} ${on(step === 3)}`} style={{ left: '4.6%', right: '4.6%', top: k ? '58%' : '60%', height: '32%' }} />
        <span className={`${own.boxTag} ${k ? '' : own.boxTagSpade}`}>
          <span>{k ? c.control : c.spade} · {c.short(v.d.date).toUpperCase()}</span>
          <b>Ø {v.m.bulb} mm</b>
          <span>{v.sub}</span>
        </span>
      </div>
    )
  }

  const phone = (
    <div className={`${own.phone} ${on(revealed)}`} data-step={step}>
      <span className={own.a11y} role="img" aria-label={c.labels[step - 1]} />
      <div className={`${own.boxes} ${own.reveal} ${on(step <= 3)} ${step === 3 ? own.cmp : ''}`}>
        {box('k')}
        {box('a')}
        <span className={`${own.badge} ${own.badgePhone} ${on(step === 3)}`}>{c.sameBulb}</span>
        {scrub}
      </div>
      <div className={`${own.sum} ${own.sumPhone} ${on(step === 4)}`}>
        <Summary w={PW} h={PH} circles={P_CIRCLES} arc="M 112 266 C 130 200, 160 150, 204 132" head="M 192 126 L 205 131 L 197 142" monthOf={c.named}>
          <span className={`${own.sumHead} ${own.valControl}`} style={{ left: 14, top: 12 }}>{c.control}</span>
          <span className={`${own.sumHead} ${own.valSpade}`} style={{ left: 14, top: `${(232 / PH) * 100}%` }}>{c.spade}</span>
          <span className={own.sumRule} style={{ top: `${(170 / PH) * 100}%` }} />
          <span className={own.sumRule} style={{ top: `${(352 / PH) * 100}%` }} />
          <span className={own.sumBadge} style={{ right: 12, top: 8 }}>{c.ahead}</span>
        </Summary>
      </div>
    </div>
  )

  const footer = (
    <div className={own.footer}>
      {step === 2 ? (
        <p className={own.caption}>
          {c.drag}
          <PhotoCredit plural>{c.credit}</PhotoCredit>
        </p>
      ) : (
        <p className={own.caption}>
          {c.captions[step - 1]}
          <PhotoCredit plural>{c.credit}</PhotoCredit>
        </p>
      )}
      {step <= 3 && (
        <button
          type="button"
          className={own.full}
          onClick={() => {
            setViewerUsed(true)
            setViewer(photoIndex)
          }}
        >
          <Maximize2 size={16} aria-hidden="true" />
          {c.full}
        </button>
      )}
    </div>
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
        <div className={styles.seasonRow}>
          <SeasonOnly years={site.seasons.map((s) => s.year)} />
        </div>
        <h3 className={styles.headerTitle}>{c.title}</h3>
      </motion.div>

      <div ref={ref}>
        <Story
          label={c.story}
          chapters={c.chapters}
          step={step}
          onStep={onStep}
          stage={
            <>
              {desktop}
              {phone}
            </>
          }
          footer={footer}
        />
      </div>

      {viewerUsed && (
        <PhotoViewerModal
          isOpen={viewer !== null}
          onClose={() => setViewer(null)}
          currentImage={c.photos[viewer ?? 0]}
          currentIndex={viewer ?? 0}
          totalItems={c.photos.length}
          onNext={() => setViewer((i) => ((i ?? 0) + 1) % c.photos.length)}
          onPrev={() => setViewer((i) => ((i ?? 0) + c.photos.length - 1) % c.photos.length)}
        />
      )}
    </div>
  )
}
