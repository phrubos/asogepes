'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView, type AnimationPlaybackControls } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './PenetrometerExplainer.module.css'

/*
 * How a penetrometer reading becomes the "cm" value on the research charts: the probe goes down,
 * the resistance curve is drawn with it, and where it passes 20 bar that depth is the loose layer.
 * Plays once when it scrolls into view (an explanation, seen rarely); reduced motion shows the end state.
 * The curve is illustrative, not measured data.
 */

// Illustrative resistance (bar) against depth (0 = surface, 1 = bottom of the drawing)
const CURVE: [number, number][] = [
  [0, 3], [0.15, 5], [0.3, 8], [0.42, 11], [0.5, 14], [0.58, 20], [0.66, 26], [0.78, 31], [0.9, 34], [1, 35],
]
const CROSS = 0.58 // depth where the curve passes 20 bar

const TOP = 44
const H = 190
const CHART_L = 176
const CHART_R = 344
const MAX_BAR = 40
const bx = (bar: number) => CHART_L + ((CHART_R - CHART_L) * bar) / MAX_BAR
const dy = (d: number) => TOP + H * d

function barAt(d: number) {
  for (let i = 1; i < CURVE.length; i++) {
    const [d0, b0] = CURVE[i - 1]
    const [d1, b1] = CURVE[i]
    if (d <= d1) return b0 + ((b1 - b0) * (d - d0)) / (d1 - d0)
  }
  return CURVE[CURVE.length - 1][1]
}

export default function PenetrometerExplainer() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [p, setP] = useState(0)
  const controls = useRef<AnimationPlaybackControls | null>(null)

  const play = () => {
    controls.current?.stop()
    if (reduced) {
      setP(1)
      return
    }
    setP(0)
    controls.current = animate(0, 1, { duration: 2.6, ease: [0.45, 0, 0.55, 1], onUpdate: setP })
  }

  useEffect(() => {
    if (inView) play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced])

  useEffect(() => () => controls.current?.stop(), [])

  const bar = barAt(p)
  const over = bar >= 20
  const reached = p >= CROSS
  const tipY = dy(p)

  // Curve drawn down to the current depth
  const pts: string[] = []
  for (const [d, b] of CURVE) {
    if (d > p) break
    pts.push(`${bx(b).toFixed(1)},${dy(d).toFixed(1)}`)
  }
  pts.push(`${bx(bar).toFixed(1)},${tipY.toFixed(1)}`)

  // Gauge needle: -120° at 0 bar, +120° at 40 bar
  const needle = -120 + (240 * Math.min(bar, MAX_BAR)) / MAX_BAR
  const gaugeY = TOP - 22 // the gauge stays above the surface; only the rod goes deeper

  return (
    <div ref={ref} className={styles.wrap}>
      <svg viewBox="0 0 360 260" className={styles.svg} role="img"
        aria-label="Szemléltető ábra: a szonda lefelé halad, az ellenállás a tömör rétegben átlépi a 20 bart; ennek a mélysége a laza réteg vastagsága">
        <defs>
          <clipPath id="pen-soil"><rect x="16" y={TOP} width="120" height={H} rx="4" /></clipPath>
        </defs>

        {/* soil column: loose above the crossing depth, compact below */}
        <g clipPath="url(#pen-soil)">
          <rect x="16" y={TOP} width="120" height={H} fill="#4A3726" />
          <rect x="16" y={TOP} width="120" height={H * CROSS} fill="#8A6A4A" />
          {[0.08, 0.2, 0.33, 0.45].map((d, i) => (
            <circle key={i} cx={30 + ((i * 37) % 96)} cy={dy(d)} r="2.4" fill="#2A1D13" opacity="0.5" />
          ))}
        </g>
        <line x1="10" y1={TOP} x2="142" y2={TOP} stroke="#F5F0E8" strokeOpacity="0.5" strokeWidth="1.5" />

        {/* probe with handle and gauge */}
        <line x1="76" y1={gaugeY + 14} x2="76" y2={tipY} stroke="#C9C1B4" strokeWidth="4" strokeLinecap="round" />
        <polygon points={`72,${tipY - 6} 80,${tipY - 6} 76,${tipY + 4}`} fill="#C9C1B4" />
        <line x1="50" y1={gaugeY} x2="102" y2={gaugeY} stroke="#C9C1B4" strokeWidth="5" strokeLinecap="round" />
        <circle cx="76" cy={gaugeY} r="13" fill="#2D251E" stroke="#C9C1B4" strokeWidth="2" />
        <line x1="76" y1={gaugeY} x2="76" y2={gaugeY - 9} stroke={over ? '#E07A5F' : '#D4A84B'} strokeWidth="2.2"
          strokeLinecap="round" transform={`rotate(${needle} 76 ${gaugeY})`} />

        {/* chart: resistance against depth */}
        <line x1={CHART_L} y1={TOP} x2={CHART_L} y2={TOP + H} stroke="#F5F0E8" strokeOpacity="0.35" />
        <line x1={CHART_L} y1={TOP} x2={CHART_R} y2={TOP} stroke="#F5F0E8" strokeOpacity="0.35" />
        <rect x={bx(20)} y={TOP} width={CHART_R - bx(20)} height={H} fill="#C45C3E" opacity="0.1" />
        <line x1={bx(20)} y1={TOP} x2={bx(20)} y2={TOP + H} stroke="#E07A5F" strokeDasharray="4 4" strokeWidth="1.5" />
        <text x={CHART_L} y={TOP - 10} className={styles.axis} textAnchor="middle">0</text>
        <text x={bx(20)} y={TOP - 10} className={styles.axis} textAnchor="middle">20 bar</text>
        <text x={CHART_R} y={TOP - 10} className={styles.axis} textAnchor="end">40</text>
        <polyline points={pts.join(' ')} fill="none" stroke="#D4A84B" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={bx(bar)} cy={tipY} r="4.5" fill={over ? '#E07A5F' : '#D4A84B'} />

        {/* the crossing: this depth is the value on the charts */}
        <g opacity={reached ? 1 : 0} className={styles.cross}>
          <line x1="16" y1={dy(CROSS)} x2={CHART_R} y2={dy(CROSS)} stroke="#F5F0E8" strokeWidth="1.5" strokeDasharray="2 4" />
          <line x1="150" y1={TOP} x2="150" y2={dy(CROSS)} stroke="#F2C94C" strokeWidth="2" />
          <polyline points={`145,${TOP + 6} 150,${TOP} 155,${TOP + 6}`} fill="none" stroke="#F2C94C" strokeWidth="2" />
          <polyline points={`145,${dy(CROSS) - 6} 150,${dy(CROSS)} 155,${dy(CROSS) - 6}`} fill="none" stroke="#F2C94C" strokeWidth="2" />
        </g>
      </svg>

      <div className={styles.text}>
        <h3 className={styles.heading}>Hogyan lesz a mérésből cm-érték?</h3>
        <p className={styles.p}>
          Ahogy a szonda lefelé halad, a manométer egyre nagyobb ellenállást mutat. Ahol a görbe
          átlépi a <strong>20 bart</strong>, ott kezdődik a tömör réteg.
        </p>
        <p className={`${styles.p} ${styles.result} ${reached ? styles.resultOn : ''}`}>
          <span className={styles.bracket} aria-hidden="true" />
          Az addig mért mélység a <strong>laza réteg vastagsága</strong>: ez a cm-érték szerepel a
          helyszínek grafikonjain. Minél nagyobb, annál mélyebben laza a talaj.
        </p>
        <div className={styles.footer}>
          <button type="button" className={styles.replay} onClick={play}>
            <RotateCcw size={16} aria-hidden="true" /> Újra
          </button>
          <span className={styles.note}>Szemléltető görbe, nem mért adat.</span>
        </div>
      </div>
    </div>
  )
}
