'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { lakitelekSoilLife as site } from '@/lib/seasons'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Story from '../story/Story'
import Callout from '../story/Callout'
import storyStyles from '../story/Story.module.css'
// Same page frame as the other location blocks
import styles from './SzentkirályTimelinePage.module.css'
import own from './LakitelekSoilLifePage.module.css'

const r0 = (v: number) => String(Math.round(v))
const hu2 = (v: number) => v.toFixed(2).replace('.', ',')
const P = site.parcels
const n = site.samples.length
const col = (j: number) => P.map((p) => p.values[j])
const avgs = site.samples.map((_, j) => col(j).reduce((a, b) => a + b, 0) / P.length)
const spreads = site.samples.map((_, j) => ({ lo: Math.min(...col(j)), hi: Math.max(...col(j)) }))

/* Everything the chapters say, computed from the data (nothing typed in by hand) */
const widest = spreads.reduce((b, s, j) => (s.hi - s.lo > spreads[b].hi - spreads[b].lo ? j : b), 0)
const otherSpreads = spreads.filter((_, j) => j !== widest).map((s) => Math.round(s.hi - s.lo))
const avgHi = Math.max(...avgs)
const avgLo = Math.min(...avgs)
const fell = P.filter((p) => p.values[n - 1] < p.values[n - 2]).length
const biggestDrop = P.reduce((b, p, i) => (p.values[n - 2] - p.values[n - 1] > P[b].values[n - 2] - P[b].values[n - 1] ? i : b), 0)
const top = site.samples.map((_, j) => P.reduce((b, p, i) => (p.values[j] > P[b].values[j] ? i : b), 0))
const topCount = new Set(top).size
const deepIndex = P.findIndex((p) => p.role === 'deep')
const deep = deepIndex >= 0 ? P[deepIndex] : null
const deepLow = deep ? site.samples.filter((_, j) => P.filter((p) => p.values[j] < deep.values[j]).length <= 1).length : 0
/** The parcel shown in the first chapter: the spade-only one */
const sample = Math.max(0, P.findIndex((p) => p.name === 'Ásógép'))
/* Fungi : bacteria ratio */
const fbAvgs = site.samples.map((_, j) => P.reduce((a, p) => a + p.fb[j], 0) / P.length)
const fbFell = P.filter((p) => p.fb[n - 1] < p.fb[n - 2]).length
const fbEarly = fbAvgs.slice(0, n - 1)
const lowerDate = (j: number) => `${site.samples[j].date.month} ${site.samples[j].date.third ?? ''}`.trim().toLowerCase()

const CHAPTERS = [
  {
    title: 'Egy pont = egy parcella',
    body: 'Minden pont egy parcella egy mérésnapon (3 minta átlaga). Arany: ásógéppel művelt, karika: mélyásógép, szürke: ásógép nélkül. Több = élénkebb talajélet.',
  },
  {
    title: 'Egy napon belül nagy a különbség',
    body: `${site.samples[widest].iso.slice(0, 4)}, ${lowerDate(widest)}: a legkisebb és a legnagyobb parcella között ${r0(spreads[widest].hi - spreads[widest].lo)} ${site.unit} a különbség. A többi mérésnapon ${Math.min(...otherSpreads)}–${Math.max(...otherSpreads)}.`,
  },
  {
    title: 'Az átlagok közelebb vannak',
    body: `A ${P.length} parcella átlaga mérésnapról mérésnapra legfeljebb ${r0(avgHi - avgLo)}-vel tér el: kevesebbel, mint egy napon belül a parcellák között.`,
  },
  {
    title: fell === P.length ? 'Júliusra mindenhol csökkent' : `Júliusra ${fell} parcellán csökkent`,
    body: `${fell === P.length ? `Mind a ${P.length}` : fell} parcellán kevesebb volt júliusban, a rozs utáni tarlón, mint áprilisban.`,
  },
  {
    title: 'Nincs állandó sorrend',
    body:
      `A legmagasabb érték ${topCount} különböző parcellán volt.` +
      (deep && deepLow === n ? ` A mélyásógépes ${deep.num} parcella mind a ${n} mérésnél az alsó kettő között.` : ''),
  },
  {
    title: 'Gomba és baktérium',
    body:
      `Ennyi gombaszén jut 1 egység baktériumszénre. A ${P.length} parcella átlaga ${hu2(Math.min(...fbEarly))}–${hu2(Math.max(...fbEarly))} volt, ` +
      `júliusban, a tarlón ${hu2(fbAvgs[n - 1])}: ${fbFell === P.length ? `mind a ${P.length}` : fbFell} parcellán kevesebb, mint áprilisban.`,
  },
  {
    title: 'Kövess egy parcellát',
    body: `Válassz parcellát a diagram alatt, és végigkövetheted a ${n} mérésen.`,
  },
]

/** Lakitelek, soil life on one timeline across the seasons, told in six steps */
export default function LakitelekSoilLifePage() {
  const phone = useMediaQuery('(max-width: 1024px)') === true
  const [step, setStep] = useState(1)
  const [sel, setSel] = useState<number | null>(null)
  const last = CHAPTERS.length
  const FB = last - 1
  const fbMode = step === FB
  const onStep = (s: number) => {
    setSel(null)
    setStep(s)
  }
  const pick = (i: number) => {
    setStep(last)
    setSel(step === last && sel === i ? null : i)
  }

  // Phones get a narrower drawing so the type stays at least 12px
  const W = phone ? 430 : 680
  const FS = phone ? 17 : 15
  const PH = phone ? 300 : 320
  const yTop = FS * 3.2
  const yBot = yTop + PH
  const tickY = yBot + FS + 10
  const H = tickY + (FS + 3) * 2 + 8
  const X0 = phone ? 56 : 64
  const X1 = W - (phone ? 30 : 44)
  const t0 = Date.parse('2025-03-01')
  const t1 = Date.parse('2026-11-01')
  const X = (iso: string) => X0 + ((Date.parse(iso) - t0) / (t1 - t0)) * (X1 - X0)
  const Yc = (v: number) => yBot - ((v - 150) / (650 - 150)) * PH
  const Yf = (v: number) => yBot - ((v - 0.3) / (1.3 - 0.3)) * PH
  const Y = Yc
  const xs = site.samples.map((s) => X(s.iso))
  const jitter = phone ? 6 : 9
  const at = (i: number, j: number) => ({ x: xs[j] + (i - 3) * jitter, y: fbMode ? Yf(P[i].fb[j]) : Yc(P[i].values[j]) })
  const bracketX = (j: number) => xs[j] + jitter * 3 + 12

  const traced = step === last ? sel : step === 5 && deep ? deepIndex : null
  const lit = (i: number, j: number) => {
    switch (step) {
      case 1: return i === sample && j === 0 ? 1 : 0.14
      case 2: return j === widest ? 1 : 0.2
      case 3: return 0.2
      case 4: return j >= n - 2 ? 1 : 0.12
      case 5: return i === deepIndex || top[j] === i ? 1 : 0.16
      case FB: return j >= n - 2 ? 1 : 0.4
      default: return sel === null || sel === i ? 1 : 0.18
    }
  }

  // phones: callouts stay inside the plot, above the date labels (they ran into ÁPR. / JÚL.)
  const box = { fs: FS, w: W, h: phone ? yBot + 4 : H }
  const ws = spreads[widest]
  const wsMid = (Y(ws.hi) + Y(ws.lo)) / 2
  const d0 = at(biggestDrop, n - 2)
  const d1 = at(biggestDrop, n - 1)
  const callout = [
    <Callout key="1" {...box} x={at(sample, 0).x} y={at(sample, 0).y} side="right" dy={-FS * 4} main={`${r0(P[sample].values[0])} ${site.unit}`} sub={`${P[sample].num} parcella, ${lowerDate(0)}`} />,
    <Callout key="2" {...box} x={bracketX(widest)} y={wsMid} side="left" dy={Y(ws.hi) - wsMid} main={`${r0(ws.hi - ws.lo)} ${site.unit}`} sub="a legkisebb és a legnagyobb parcella között" />,
    <Callout key="3" {...box} x={W - 16} y={(Y(avgHi) + Y(avgLo)) / 2} side="left" dy={FS * 6} main={`legfeljebb ${r0(avgHi - avgLo)}`} sub={`a ${n} mérésnap átlaga között`} delay={800} />,
    <Callout key="4" {...box} x={(d0.x + d1.x) / 2} y={(d0.y + d1.y) / 2} side="left" dy={-FS * (phone ? 4 : 6)} main={`${fell} / ${P.length} parcella`} sub="kevesebb júliusban, a rozs utáni tarlón" delay={700} />,
    deep ? <Callout key="5" {...box} x={at(deepIndex, 1).x} y={at(deepIndex, 1).y} side="right" dy={-FS * 6} main={`${deep.num} mélyásógép`} sub={`mind a ${n} mérésnél az alsó kettő között`} delay={600} /> : null,
    null,
    null,
  ][step - 1]

  const bands = site.seasons.map((s, i) => {
    const a = i === 0 ? X0 - 8 : X(`${s.year}-01-01`)
    const b = i === site.seasons.length - 1 ? X1 + 8 : X(`${site.seasons[i + 1].year}-01-01`)
    return { ...s, x: a, w: b - a }
  })

  const stage = (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={own.chart}
      role="img"
      aria-label={`Élő mikrobiális szén Lakiteleken, ${P.length} parcella, ${n} mérésnap. Átlagok: ${avgs.map(r0).join(', ')} ${site.unit}; gomba : baktérium arány: ${fbAvgs.map(hu2).join(', ')}.`}
    >
      {bands.map((b, i) => (
        <g key={b.year}>
          <rect x={b.x} y={0} width={b.w} height={yBot + 6} className={i % 2 ? own.bandAlt : own.band} />
          <text x={b.x + 10} y={FS * 1.3} fontSize={FS} className={own.bandYear}>{b.year}</text>
          <text x={b.x + 10} y={FS * 2.5} fontSize={FS - 1} className={own.bandCrop}>{b.crop}</text>
        </g>
      ))}
      {(fbMode ? [0.4, 0.6, 0.8, 1, 1.2] : [200, 300, 400, 500, 600]).map((v) => {
        const y = fbMode ? Yf(v) : Yc(v)
        return (
          <g key={v}>
            <line x1={X0 - 10} x2={W - 4} y1={y} y2={y} className={own.grid} />
            <text x={X0 - 16} y={y + 4} fontSize={FS - 1} textAnchor="end" className={own.axis}>{fbMode ? v.toFixed(1).replace('.', ',') : v}</text>
          </g>
        )
      })}
      <text x={4} y={Y(650) + 4} fontSize={FS - 1} className={own.axisUnit}>{fbMode ? 'gomba : baktérium' : site.unit}</text>

      {/* Lowest–highest parcel at each date */}
      <g className={storyStyles.focus} style={{ opacity: step === 2 ? 1 : 0 }} aria-hidden="true">
        {spreads.map((s, j) => {
          const x = bracketX(j)
          const on = j === widest
          return (
            <g key={j} className={on ? own.bracketOn : own.bracket}>
              <path d={`M${x - 7},${Y(s.hi)} H${x} V${Y(s.lo)} H${x - 7}`} />
              {!on && (
                <text x={x + 5} y={(Y(s.hi) + Y(s.lo)) / 2 + 4} fontSize={FS - 1}>{r0(s.hi - s.lo)}</text>
              )}
            </g>
          )
        })}
      </g>

      {/* The mean of the parcels at each date */}
      <polyline
        points={avgs.map((a, j) => `${xs[j].toFixed(1)},${Y(a).toFixed(1)}`).join(' ')}
        pathLength={1}
        className={`${own.avgLine} ${step >= 3 ? own.drawn : ''}`}
        style={{ opacity: step === 3 ? 1 : step > 3 && !fbMode ? 0.3 : 0 }}
      />

      {/* Fungi : bacteria, the mean of the parcels at each date */}
      {fbMode && (
        <g key="fb" aria-hidden="true">
          <polyline points={fbAvgs.map((a, j) => `${xs[j].toFixed(1)},${Yf(a).toFixed(1)}`).join(' ')} pathLength={1} className={`${own.avgLine} ${own.drawn}`} />
          {fbAvgs.map((a, j) => (
            <text
              key={j}
              x={j === n - 1 ? xs[j] + jitter * 3 + FS : xs[j]}
              y={j === n - 1 ? Yf(a) + 5 : Yf(a) - 14}
              fontSize={FS - 1}
              textAnchor={j === n - 1 ? 'start' : 'middle'}
              className={`${own.label} ${own.labelIn}`}
              style={{ animationDelay: `${200 + j * 120}ms` }}
            >
              {hu2(a)}
            </text>
          ))}
        </g>
      )}
      <g className={storyStyles.focus} style={{ opacity: step === 3 ? 1 : 0 }} aria-hidden="true">
        {avgs.map((a, j) => (
          <g key={j}>
            <circle cx={xs[j]} cy={Y(a)} r={4.5} className={own.avgDot} />
            <text x={xs[j]} y={Y(a) - 12} fontSize={FS - 1} textAnchor="middle" className={own.label}>{r0(a)}</text>
          </g>
        ))}
        <path d={`M${W - 24},${Y(avgHi)} H${W - 16} V${Y(avgLo)} H${W - 24}`} className={own.gap} />
      </g>

      {/* April → July, one line per parcel; drawn again each time the chapter opens */}
      {step === 4 && (
        <g className={own.drops} aria-hidden="true">
          {P.map((p, i) => {
            const a = at(i, n - 2)
            const b = at(i, n - 1)
            return (
              <line
                key={p.num}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                pathLength={1}
                className={`${own.drop} ${p.role === 'other' ? own.dropOther : ''}`}
                style={{ animationDelay: `${150 + i * 90}ms` }}
              />
            )
          })}
        </g>
      )}

      {P.map((p, i) =>
        p.values.map((_, j) => {
          const a = at(i, j)
          return (
            <circle
              key={`${p.num}-${j}`}
              cx={a.x}
              cy={a.y}
              r={phone ? 5.5 : 6.5}
              className={`${own.dot} ${own[p.role]} ${storyStyles.focus}`}
              style={{ opacity: lit(i, j) }}
            />
          )
        })
      )}

      {traced !== null && (
        <g key={`trace-${step}-${traced}`} aria-hidden="true">
          <polyline
            points={P[traced].values.map((_, j) => `${at(traced, j).x.toFixed(1)},${at(traced, j).y.toFixed(1)}`).join(' ')}
            pathLength={1}
            className={`${own.trace} ${P[traced].role === 'other' ? own.traceOther : ''}`}
          />
          {step === last &&
            P[traced].values.map((v, j) => (
              <text key={j} x={at(traced, j).x} y={at(traced, j).y - 14} fontSize={FS} textAnchor="middle" className={`${own.label} ${own.labelIn}`} style={{ animationDelay: `${300 + j * 120}ms` }}>
                {r0(v)}
              </text>
            ))}
        </g>
      )}

      {step === 5 && (
        <g aria-hidden="true">
          {top.map((i, j) => (
            <text key={j} x={at(i, j).x} y={at(i, j).y - 14} fontSize={FS} textAnchor="middle" className={`${own.label} ${own.labelGold} ${own.labelIn}`} style={{ animationDelay: `${200 + j * 120}ms` }}>
              {P[i].num.replace('.', '')}
            </text>
          ))}
        </g>
      )}

      <g key={step}>{callout}</g>

      {site.samples.map((s, j) => (
        <g key={s.iso}>
          <line x1={xs[j]} x2={xs[j]} y1={yBot + 2} y2={yBot + 9} className={own.tickMark} />
          <text x={xs[j]} y={tickY} fontSize={FS - 1} textAnchor="middle" className={own.tickDate}>{s.date.month}</text>
          <text x={xs[j]} y={tickY + FS + 3} fontSize={FS - 1} textAnchor="middle" className={own.tickThird}>{s.date.third}</text>
          {s.flag && (
            <text x={xs[j]} y={tickY + (FS + 3) * 2} fontSize={FS - 1} textAnchor="middle" className={own.tickFlag}>{s.flag}</text>
          )}
        </g>
      ))}
    </svg>
  )

  const footer = (
    <>
      <div className={own.picker} role="group" aria-label="Parcella kiemelése">
        <span className={own.pickerLabel}>Parcella</span>
        {P.map((p, i) => {
          const on = step === last && sel === i
          return (
            <button
              key={p.num}
              type="button"
              className={`${own.pick} ${on ? own.pickOn : ''}`}
              aria-pressed={on}
              aria-label={`${p.num} ${p.name}`}
              onClick={() => pick(i)}
            >
              {p.num.replace('.', '')}
            </button>
          )
        })}
        <span className={own.pickName} aria-live="polite">
          {step === last && sel !== null ? P[sel].name : ''}
        </span>
      </div>
      <ul className={own.legend}>
        <li><span className={`${own.key} ${own.spade}`} />ásógéppel</li>
        <li><span className={`${own.key} ${own.deep}`} />mélyásógép</li>
        <li><span className={`${own.key} ${own.other}`} />ásógép nélkül</li>
        <li className={own.note}>{site.note}</li>
      </ul>
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
          <span>Lakitelek</span>
        </div>
        <h3 className={styles.headerTitle}>Talajélet: mérésről mérésre ingadozik</h3>
        <p className={own.lead}>{site.lead}</p>
      </motion.div>

      <Story label="Talajélet lépésenként" chapters={CHAPTERS} step={step} onStep={onStep} stage={stage} footer={footer} />
    </div>
  )
}
