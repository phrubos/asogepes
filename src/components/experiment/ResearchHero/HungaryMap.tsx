'use client'

import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent, type PointerEvent } from 'react'
import { RESEARCH_SITES as HERO_SITES, RESEARCH_YEARS as HERO_YEARS } from '@/lib/seasons'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './HungaryMap.module.css'

// Outline in a 100 x 70 box: lon 16.2–22.71 → x, lat 48.62–45.76 → y
const HUNGARY_PATH =
  'M0 43 L5 27 L2 22 L11 22 L12 12 L20 18 L25 21 L38 18 L40 13 L46 12 L53 9 L55 10 L62 7 L66 1 L71 0 L87 7 L91 5 L99 11 L100 18 L91 23 L83 40 L74 56 L62 61 L52 60 L40 66 L35 70 L22 65 L10 55 L6 52 L3 44 Z'
// Rivers, simplified, through the towns on their banks (same box)
const DUNA_PATH = 'M15 15 L22 20 L29 21 L39 19.5 L42.5 19.5 L45 21 L43.4 27 L42.5 33 L42 40.4 L40.9 48.7 L42.2 56 L42.2 59.7 L39.5 65.5'
const TISZA_PATH = 'M100 12.5 L93.9 12 L80 12.2 L75 16.9 L70 24.5 L61.4 35.5 L59.9 41.4 L60.7 46.7 L60.7 58 L59.9 60.5'
const LENS = { x: 50, y: 38.5, w: 12, h: 7 } // the Kecskemét area on the outline

// The places on the outline, from approximate town centres (lat/lon → the box above);
// Kecskemét-Borbás lies at the edge of Kecskemét. At this scale 1 km is under a pixel.
const toBox = (lat: number, lon: number) => [((lon - 16.2) / 6.51) * 100, ((48.62 - lat) / 2.86) * 70]
const SPOTS: Record<string, number[]> = {
  kecskemet: toBox(46.91, 19.69),
  szentkiraly: toBox(46.92, 19.92),
  lakitelek: toBox(46.88, 20.0),
}

/* Two drawings (desktop: tall card; phone: narrower card). `closed`: the big country; `open`: the country
   smaller with the inset under it. Each is [x, y, scale] of the 100 x 70 box. */
const GEO = {
  desk: {
    W: 540, H: 620, closed: [20, 95, 5], open: [40, 40, 4.6], city: 2.9,
    inset: { x: 48, y: 364, w: 444, h: 182 }, caption: 390,
    pins: { szentkiraly: [300, 436], kecskemet: [140, 454], lakitelek: [410, 456] } as Record<string, number[]>,
    r: 15, name: 16, tag: 13,
    leader: [[330, 323], [355, 350], [355, 482]], callout: { x: 48, w: 444, title: 20, sub: 14 },
  },
  phone: {
    W: 350, H: 460, closed: [12, 62, 3.15], open: [25, 22, 3], city: 4.6,
    inset: { x: 16, y: 236, w: 318, h: 170 }, caption: 260,
    pins: { szentkiraly: [190, 290], kecskemet: [76, 310], lakitelek: [280, 310] } as Record<string, number[]>,
    r: 14, name: 15, tag: 13,
    leader: [[207, 205], [228, 230], [228, 334]], callout: { x: 16, w: 318, title: 17, sub: 14 },
  },
}
const CITIES = [
  { x: 43, y: 27, label: 'Budapest' },
  { x: 83, y: 27, label: 'Debrecen' },
  { x: 31, y: 62, label: 'Pécs', desk: true },
  { x: 22, y: 23, label: 'Győr', desk: true },
]

/* The dashed leader as separate dashes, each appearing in turn from the lens to the end, so it draws
   itself in every browser (a mask animation does not repaint everywhere). [x1, y1, x2, y2, delay s] */
const LEAD_START = 2.2
const LEAD_DRAW = 0.6
function dashes(points: number[][], dash = 3, gap = 3): number[][] {
  const segs = points.slice(1).map((b, i) => {
    const a = points[i]
    return { a, b, l: Math.hypot(b[0] - a[0], b[1] - a[1]) }
  })
  const total = segs.reduce((n, s) => n + s.l, 0)
  const at = (t: number) => {
    for (const { a, b, l } of segs) {
      if (t <= l) return [a[0] + ((b[0] - a[0]) * t) / l, a[1] + ((b[1] - a[1]) * t) / l]
      t -= l
    }
    return points[points.length - 1]
  }
  const out: number[][] = []
  for (let d = 0; d < total; d += dash + gap) {
    const [x1, y1] = at(d)
    const [x2, y2] = at(Math.min(d + dash, total))
    out.push([x1, y1, x2, y2, LEAD_START + (LEAD_DRAW * d) / total])
  }
  return out
}

const box = ([x, y, k]: number[]) => `translate(${x}px, ${y}px) scale(${k})`

interface HungaryMapProps {
  onLocationClick?: (locationId: string) => void
}

/**
 * The research hero map. On load the big country draws itself with the three places and a callout.
 * With the mouse on it (or a tap, or keyboard focus on a place) it shrinks and an inset with the places
 * and their seasons grows out of the lens; it goes back when the mouse leaves.
 */
export default function HungaryMap({ onLocationClick }: HungaryMapProps) {
  const phoneQuery = useMediaQuery('(max-width: 1024px)')
  const phone = phoneQuery === true
  const reducedMotion = useReducedMotion()
  const g = phone ? GEO.phone : GEO.desk

  const [active, setActive] = useState<string | null>(null)
  const [over, setOver] = useState(false) // mouse on the map
  const [pinned, setPinned] = useState(false) // opened by a tap
  const [focused, setFocused] = useState(false) // keyboard focus on a place
  const open = over || pinned || focused
  const hl = open ? active : null
  const site = HERO_SITES.find((s) => s.id === hl)

  // The entrance plays once, when the map is on screen (and only once the phone/desktop drawing is known)
  const ref = useRef<HTMLDivElement>(null)
  const [play, setPlay] = useState(false)
  useEffect(() => {
    if (play || phoneQuery === null || !ref.current) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPlay(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [play, phoneQuery])
  const stage = reducedMotion ? styles.still : play ? '' : styles.wait

  // Geometry of the lens on the open map, and where the inset starts from (the lens on the closed map)
  const [ox, oy, ok] = g.open
  const [cx, cy, ck] = g.closed
  const lensX = ox + LENS.x * ok
  const lensY = oy + (LENS.y + LENS.h) * ok
  const grow = (LENS.w * ck) / g.inset.w
  const zoomFrom = `translate(${cx + LENS.x * ck - g.inset.x * grow}px, ${cy + (LENS.y + LENS.h / 2) * ck - (g.inset.y + g.inset.h / 2) * grow}px) scale(${grow})`
  const vars = { '--map-closed': box(g.closed), '--map-open': box(g.open), '--zoom-from': zoomFrom } as CSSProperties
  const [endX, endY] = g.leader[g.leader.length - 1]

  const go = (id: string) => onLocationClick?.(id)
  const onKey = (id: string) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      go(id)
    }
  }
  const isPlace = (e: { target: EventTarget }) => !!(e.target as Element).closest('[role="button"]')
  const onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') setOver(true)
  }
  const onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    setOver(false)
    setActive(null)
  }
  // Touch: a tap on the map opens or closes it; a tap on a place goes to its section
  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' || isPlace(e)) return
    setPinned((p) => !p)
    setActive(null)
  }
  const onFocus = () => setFocused(true)
  const onBlur = (e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setFocused(false)
      setActive(null)
    }
  }

  const yearsText = `${HERO_YEARS.join(' és ')}, ${HERO_YEARS.length === 2 ? 'két' : HERO_YEARS.length} tenyészidő`

  return (
    <div
      ref={ref}
      className={`${styles.map} ${phone ? styles.mapPhone : ''} ${open ? styles.open : ''} ${stage}`}
      style={vars}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerUp}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <svg
        viewBox={`0 0 ${g.W} ${g.H}`}
        className={styles.svg}
        role="group"
        aria-label="Magyarország: a három kísérleti helyszín Kecskemét környékén, a Duna–Tisza közén"
      >
        <defs>
          <pattern id="heroMapDots" width="3.4" height="3.4" patternUnits="userSpaceOnUse">
            <circle cx="1.7" cy="1.7" r="0.24" fill="rgba(212, 168, 75, 0.2)" />
          </pattern>
          <radialGradient id="heroMapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212, 168, 75, 0.12)" />
            <stop offset="100%" stopColor="rgba(212, 168, 75, 0)" />
          </radialGradient>
        </defs>

        {/* The country: big when closed, smaller when open */}
        <g className={styles.land}>
          <path d={HUNGARY_PATH} fill="url(#heroMapDots)" className={styles.fill} />
          <path d={DUNA_PATH} pathLength={1} className={styles.river} />
          <path d={TISZA_PATH} pathLength={1} className={styles.river} />
          <path d={HUNGARY_PATH} pathLength={1} className={styles.outline} />
          <g className={styles.late}>
            <g className={styles.cities} fontSize={g.city}>
              {CITIES.filter((c) => !phone || !c.desk).map((c) => (
                <g key={c.label}>
                  <circle cx={c.x} cy={c.y} r={0.6} />
                  <text x={c.x + 1.5} y={c.y + 1}>{c.label}</text>
                </g>
              ))}
            </g>
            <g className={`${styles.riverNames} ${phone ? styles.closedOnly : ''}`} fontSize={g.city * 0.9}>
              <text x={37.6} y={45} textAnchor="end">Duna</text>
              <text x={67.5} y={29.5}>Tisza</text>
            </g>
            <text
              x={phone ? 49 : 50.6}
              y={55.5}
              textAnchor="middle"
              fontSize={g.city * 0.72}
              letterSpacing={g.city * 0.1}
              className={`${styles.region} ${styles.closedOnly}`}
            >
              DUNA–TISZA KÖZE
            </text>
          </g>
          <rect x={LENS.x} y={LENS.y} width={LENS.w} height={LENS.h} rx={1.2} className={styles.lens} />
          {HERO_SITES.map((s, i) => (
            <circle
              key={s.id}
              cx={SPOTS[s.id][0]}
              cy={SPOTS[s.id][1]}
              r={hl === s.id ? 1.5 : 0.95}
              className={`${styles.spot} ${hl === s.id ? styles.spotOn : ''} ${hl && hl !== s.id ? styles.spotDim : ''}`}
              style={{ animationDelay: `${1.75 + i * 0.1}s` }}
            />
          ))}
        </g>

        {/* Closed: a leader from the places to the line under the map, then the callout */}
        <g className={styles.closedOnly} aria-hidden="true">
          {dashes(g.leader).map(([x1, y1, x2, y2, delay], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className={styles.dash} style={{ animationDelay: `${delay}s` }} />
          ))}
          <circle cx={endX} cy={endY} r={3} className={styles.leadEnd} />
          <g className={styles.callout}>
            <line x1={g.callout.x} y1={endY} x2={g.callout.x + g.callout.w} y2={endY} className={styles.calloutRule} />
            <text x={g.callout.x} y={endY + g.callout.title + 12} fontSize={g.callout.title} className={styles.calloutTitle}>
              {HERO_SITES.length} helyszín <tspan className={styles.calloutDot}>·</tspan> Kecskemét környékén
            </text>
            <text x={g.callout.x} y={endY + g.callout.title + 12 + g.callout.sub + 10} fontSize={g.callout.sub} className={styles.calloutSub}>
              {yearsText}
            </text>
          </g>
        </g>

        {/* Open: the lens lines, and the inset grown out of the lens */}
        <g className={styles.lensLines}>
          <line x1={lensX} y1={lensY} x2={g.inset.x} y2={g.inset.y} className={styles.lensLine} />
          <line x1={lensX + LENS.w * ok} y1={lensY} x2={g.inset.x + g.inset.w} y2={g.inset.y} className={styles.lensLine} />
        </g>
        <g className={styles.zoom}>
          <rect x={g.inset.x} y={g.inset.y} width={g.inset.w} height={g.inset.h} rx={16} className={styles.inset} />
          <circle cx={g.inset.x + g.inset.w / 2} cy={g.inset.y + g.inset.h / 2} r={g.inset.h} fill="url(#heroMapGlow)" />
          <text x={g.inset.x + 18} y={g.caption} className={styles.caption}>KECSKEMÉT KÖRNYÉKE</text>

          {HERO_SITES.map((s) => {
            const [x, y] = g.pins[s.id]
            const on = hl === s.id
            const twoLines = phone && s.name.includes('-')
            const nameY = y + g.r + 22
            const tagY = nameY + (twoLines ? 30 : 12)
            const tagW = 30
            const tagsX = x - (HERO_YEARS.length * (tagW + 4) - 4) / 2
            return (
              <g
                key={s.id}
                role="button"
                tabIndex={0}
                aria-label={`${s.name}: ${s.tip}. Ugrás a szakaszhoz`}
                className={`${styles.pin} ${hl && !on ? styles.pinDim : ''}`}
                onMouseEnter={() => setActive(s.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(s.id)}
                onBlur={() => setActive(null)}
                onClick={() => go(s.id)}
                onKeyDown={onKey(s.id)}
              >
                <circle cx={x} cy={y} r={g.r * 2.1} className={styles.hit} />
                <circle cx={x} cy={y} r={g.r + 7} className={`${styles.ring} ${on ? styles.ringOn : ''}`} />
                <circle cx={x} cy={y} r={g.r} className={styles.dot} />
                <text x={x} y={y + 5} textAnchor="middle" className={styles.num}>{s.n}</text>
                {twoLines ? (
                  <text x={x} y={nameY} textAnchor="middle" fontSize={g.name} className={styles.name}>
                    <tspan x={x}>{s.name.split('-')[0]}-</tspan>
                    <tspan x={x} dy={g.name + 2}>{s.name.split('-')[1]}</tspan>
                  </text>
                ) : (
                  <text x={x} y={nameY} textAnchor="middle" fontSize={g.name} className={styles.name}>{s.name}</text>
                )}
                {HERO_YEARS.map((yr, i) => {
                  const has = s.years.includes(yr)
                  const tx = tagsX + i * (tagW + 4)
                  return (
                    <g key={yr}>
                      <rect x={tx + 0.5} y={tagY + 0.5} width={tagW - 1} height={19} rx={5} className={has ? styles.tag : styles.tagOff} />
                      <text x={tx + tagW / 2} y={tagY + 14} textAnchor="middle" fontSize={g.tag} className={has ? styles.tagText : styles.tagTextOff}>
                        {String(yr).slice(2)}
                      </text>
                    </g>
                  )
                })}
              </g>
            )
          })}
        </g>
      </svg>

      <div className={styles.footer}>
        {!open ? (
          <span className={styles.hint}>
            <span className={styles.hintIcon} aria-hidden="true">+</span>
            {phone ? 'Koppints a helyszínekért' : 'Vidd fölé az egeret a helyszínekért'}
          </span>
        ) : site ? (
          <span key={site.id} className={styles.tip}>
            <strong>{site.name}:</strong> {site.tip}
          </span>
        ) : (
          <span className={`${styles.legend} ${styles.tip}`}>
            <span><i className={styles.keyOn} />mért évad</span>
            <span><i className={styles.keyOff} />nem mért</span>
          </span>
        )}
        {!phone && <span className={styles.country}>Magyarország</span>}
      </div>
    </div>
  )
}
