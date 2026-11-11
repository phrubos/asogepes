'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import Image from 'next/image'
import { useInView } from 'framer-motion'
import { szentkiralyTomatoSoil as tom } from '@/lib/seasons'
import { useLoopActive } from '@/hooks/useLoopActive'
import { cap, namedIn } from '../story/dates'
import s from './AboveBelowGround.module.css'
import PhotoCredit from '@/components/ui/PhotoCredit/PhotoCredit'

const DIR = '/images/kutatás_pics/Szentkirály/paradicsom'
const shootPct = Math.round((tom.shoot.spade / tom.shoot.control - 1) * 100)

/* Water drops in the loupe: start in a pore, drift to the root hair */
const DROPS = [
  [78, 40, 22, 4, 0], [74, 100, 18, 0, 0.8], [80, 152, 14, 4, 1.6], [80, 203, 16, -7, 2.3],
  [162, 54, -22, 4, 0.4], [160, 118, -25, -4, 1.2], [158, 166, -21, 4, 2], [160, 214, -22, -4, 2.7],
] as const
const GRAINS = [
  [34, 30, 26, 18], [44, 76, 28, 18], [28, 126, 22, 22], [50, 176, 28, 17], [30, 222, 24, 16],
  [200, 30, 30, 19], [212, 88, 24, 21], [192, 138, 27, 17], [214, 186, 22, 22], [190, 226, 28, 14],
  [82, 58, 8, 6], [152, 100, 9, 7], [84, 226, 9, 6],
] as const
const HAIRS = [
  [117, 50, 100, 44], [113, 78, 95, 84], [110, 106, 92, 100], [110, 134, 93, 140], [111, 162, 95, 156],
  [112, 190, 96, 196], [112, 218, 97, 212], [124, 64, 140, 58], [120, 92, 137, 98], [118, 120, 135, 114],
  [119, 148, 136, 154], [121, 176, 137, 170], [120, 204, 138, 210], [117, 232, 133, 226],
] as const

type Leader = { x1: number; y1: number; x2: number; y2: number; w: number; h: number }

/** Desktop: a dashed leader from the loupe's rim to the gold ring, measured across the root row (spine + photo) */
function useLeader(rowRef: RefObject<HTMLDivElement | null>) {
  const [d, setD] = useState<Leader | null>(null)
  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const calc = () => {
      const L = row.querySelector('[data-loupe]')
      const R = row.querySelector('[data-ring]')
      if (!L || !R || window.innerWidth <= 1024) return setD(null)
      const b = row.getBoundingClientRect()
      const l = L.getBoundingClientRect()
      const r = R.getBoundingClientRect()
      const ax = l.left + l.width / 2 - b.left
      const ay = l.top + l.height / 2 - b.top
      const bx = r.left + r.width / 2 - b.left
      const by = r.top + r.height / 2 - b.top
      const len = Math.hypot(bx - ax, by - ay) || 1
      const ux = (bx - ax) / len
      const uy = (by - ay) / len
      const ra = l.width / 2 + 5
      const rb = r.width / 2 + 4
      setD({ x1: ax + ux * ra, y1: ay + uy * ra, x2: bx - ux * rb, y2: by - uy * rb, w: b.width, h: b.height })
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(row)
    return () => ro.disconnect()
  }, [rowRef])
  return d
}

/** Annotation on a root photo: a ring over the spot and a tag hanging from it (gold = the spot the loupe magnifies) */
function Mark({ x, y, label, gold = false }: { x: string; y: string; label: string; gold?: boolean }) {
  return (
    <span className={`${s.mark} ${gold ? s.markGold : ''}`} style={{ left: x, top: y, '--x': x, '--y': y } as React.CSSProperties}>
      <span className={s.ring} data-ring={gold ? '' : undefined} aria-hidden="true" />
      <span className={s.tag}>{label}</span>
    </span>
  )
}

/** Schematic loupe: a root with root hairs between soil grains, water drops moving in */
function Loupe() {
  const ref = useRef<HTMLDivElement>(null)
  const live = useLoopActive(ref)
  return (
    <div ref={ref} data-loupe="" className={`${s.loupe} ${live ? s.live : ''}`}>
      <svg viewBox="0 0 240 240" role="img" aria-label="Sematikus nagyítás: a hajszálgyökerek a talajszemcsék közti pórusokból veszik fel a vizet">
        <rect width="240" height="240" fill="#3D2914" />
        <g fill="#5C4F40" stroke="#6E5D49" strokeWidth="1.5">
          {GRAINS.map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} />)}
        </g>
        <path d="M120 0 C 128 60, 104 120, 116 180 S 112 240, 110 260" fill="none" stroke="#E8D9B8" strokeWidth="7" strokeLinecap="round" />
        <g stroke="#E8D9B8" strokeWidth="1.5" strokeLinecap="round" opacity="0.9">
          {HAIRS.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />)}
        </g>
        <g fill="#D9E4D0">
          {DROPS.map(([cx, cy, dx, dy, d], i) => (
            <circle
              key={i}
              className={s.drop}
              cx={cx}
              cy={cy}
              r="3"
              style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, animationDelay: `${d}s` } as React.CSSProperties}
            />
          ))}
        </g>
        <circle className={s.pulse} r="3.5" fill="#D4A84B" />
        <circle className={s.pulse} r="3.5" fill="#D4A84B" style={{ animationDelay: '1.5s' }} />
      </svg>
    </div>
  )
}

/**
 * "Föld felett, föld alatt": the same researcher in both plots on one scale (canopy height read on the body),
 * the measured shoot length between them, and below the soil line the dug-up root pair of the same day.
 */
export default function AboveBelowGround() {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const rootRow = useRef<HTMLDivElement>(null)
  const leader = useLeader(rootRow)

  return (
    <section ref={ref} className={`${s.card} ${seen ? s.seen : ''}`} aria-labelledby="fold-felett-cim">
      <div className={s.head}>
        <h4 id="fold-felett-cim" className={s.title}>Föld felett, föld alatt</h4>
      </div>

      <div className={s.colHeads} aria-hidden="true">
        <span>KOMBINÁTOR</span>
        <span />
        <span className={s.gold}>ÁSÓGÉP</span>
      </div>

      {/* Above ground */}
      <div className={s.photoRow}>
        <figure className={`${s.photo} ${s.left}`}>
          <Image src={`${DIR}/kutato-kombinator.webp`} alt="Kutató a kombinátoros parcellán: a paradicsom lombja a térdéig ér" fill sizes="(max-width: 1024px) 50vw, 400px" />
          <span className={`${s.pill} ${s.pillKnee}`}>térdig</span>
        </figure>
        <div className={s.spine}>
          <span className={s.kicker}>FÖLD FELETT</span>
          <p className={s.spineText}>Ugyanaz a kutató, ugyanakkora távolságból és kameramagasságból, egy léptékben. A lomb teteje a testén olvasható le.</p>
        </div>
        <figure className={`${s.photo} ${s.right}`}>
          <Image src={`${DIR}/kutato-asogep.webp`} alt="Ugyanaz a kutató az ásógépes parcellán: a lomb a combjáig ér, a mérőléc eltűnik benne" fill sizes="(max-width: 1024px) 50vw, 400px" />
          <span className={`${s.pill} ${s.pillThigh}`}>combig</span>
        </figure>
        <div className={`${s.line} ${s.lineSpade}`} aria-hidden="true" />
        <div className={`${s.line} ${s.lineControl}`} aria-hidden="true" />
        <div className={s.result}>
          <span className={s.resultNum}>+{shootPct} %</span>
          <span className={s.resultSub}>hajtás: {tom.shoot.control} → {tom.shoot.spade} cm</span>
        </div>
      </div>

      <div className={s.soilLine}>
        <span className={s.kicker}>TALAJSZINT</span>
        <span className={s.cause}><span className={s.kicker}>OK:</span> lazább talaj ↑</span>
      </div>

      {/* Below ground */}
      <div ref={rootRow} className={s.rootRow}>
        <figure className={`${s.root} ${s.left}`}>
          <div className={s.dig}>
            <Image src={`${DIR}/gyoker-kombinator.webp`} alt="A kombinátoros tő ritka, durva gyökérzete; a jobb szélén 0–30 cm-es mérőszalag" fill sizes="(max-width: 1024px) 50vw, 400px" />
          </div>
          <span className={s.scale}>mérce: 0–30 cm →</span>
          <Mark x="50%" y="58%" label="ritka, durva gyökerek" />
        </figure>
        <div className={`${s.spine} ${s.spineRoots}`}>
          <span className={s.kicker}>EZÉRT: DÚSABB GYÖKÉR</span>
          <Loupe />
          <p className={s.loupeText}>Az arany kör nagyítva, sematikusan: a hajszálgyökér a pórusokból veszi fel a vizet. Több finom gyökér, több elért pórus.</p>
        </div>
        <figure className={`${s.root} ${s.right}`}>
          <div className={s.dig}>
            <Image src={`${DIR}/gyoker-asogep.webp`} alt="Az ásógépes tő sűrű hajszálgyökér-hálója" fill sizes="(max-width: 1024px) 50vw, 400px" />
          </div>
          <Mark x="63%" y="63%" label="sűrű hajszálgyökér-háló" gold />
        </figure>
        {leader && (
          // Each dash drawn like the rings: gold core with a thin dark edge
          <svg className={s.leader} viewBox={`0 0 ${leader.w} ${leader.h}`} aria-hidden="true">
            <line x1={leader.x1} y1={leader.y1} x2={leader.x2} y2={leader.y2} className={s.leaderHalo} />
            <line x1={leader.x1} y1={leader.y1} x2={leader.x2} y2={leader.y2} className={s.leaderLine} />
          </svg>
        )}
      </div>

      <p className={s.note}>
        Sematikus rajz. Hajtáshossz: mért adat, {namedIn(tom.shoot.date)}. Gyökér: szemrevételezéssel, egy kiásott növénypáron; gyökértömeget nem mértünk.
        <PhotoCredit plural>Szentkirály, 2026. július 2.</PhotoCredit>
      </p>
      <span className="sr-only">{cap(namedIn(tom.shoot.date))} az ásógépes parcellán {tom.shoot.spade} cm, a kombinátoroson {tom.shoot.control} cm volt a paradicsom hajtása.</span>
    </section>
  )
}
