'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Expand, Maximize2, Minimize2, X } from 'lucide-react'
import { lakitelekRye2026 as rye, lakitelekSoil2026, lakitelekSeasons } from '@/lib/seasons'
import s from './LakitelekRyeBoard.module.css'

type Filter = 'all' | 'spade' | 'other'
type Parcel = (typeof rye.parcels)[number]

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Mind' },
  { id: 'spade', label: 'Ásógéppel' },
  { id: 'other', label: 'Ásógép nélkül' },
]
const ROLE = { deep: 'mélyásógép', spade: 'ásógéppel', other: 'ásógép nélkül' } as const

const { shoot, root } = lakitelekSoil2026.rye
const maxShoot = Math.max(...shoot)
/* May (2nd measurement) depth of the loose layer, from the main chart's data */
const loose = lakitelekSeasons.seasons.find((x) => x.year === 2026)?.parcels.map((p) => p.values[1]) ?? []
const cm = (v: number | undefined) => (v === undefined ? '–' : String(v).replace('.', ','))

const fits = (p: Parcel, f: Filter) => f === 'all' || (f === 'spade' ? p.role !== 'other' : p.role === 'other')
const spadeish = (p: Parcel) => p.role !== 'other'

/**
 * Lakitelek › Fotók, 2026: the seven rye bundles of May side by side on one scale, the soil line at
 * the root crown, the measured shoot/root under each, and a card for the chosen parcel.
 * A filter dims the parcels that don't fit; the choice jumps to the first one that does.
 */
export default function LakitelekRyeBoard() {
  const [filter, setFilter] = useState<Filter>('all')
  const [sel, setSel] = useState(0)
  const [overview, setOverview] = useState(false)
  const [zoom, setZoom] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const back = useRef<HTMLButtonElement>(null)
  const zoomBtns = useRef<(HTMLButtonElement | null)[]>([])
  const wasZoom = useRef(false)

  /* the big view takes the focus when it opens; closing returns it to the tile's magnifier */
  useEffect(() => {
    if (zoom) back.current?.focus()
    else if (wasZoom.current) zoomBtns.current[sel]?.focus()
    wasZoom.current = zoom
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom])

  const pickFilter = (f: Filter) => {
    setFilter(f)
    if (!fits(rye.parcels[sel], f)) setSel(rye.parcels.findIndex((p) => fits(p, f)))
  }
  const active = rye.parcels.map((q, i) => (fits(q, filter) ? i : -1)).filter((i) => i >= 0)
  const n = active.length
  const pos = active.indexOf(sel)
  const step = (d: number) => setSel(active[(pos + d + n) % n])
  const p = rye.parcels[sel]

  return (
    <div className={s.board}>
      <div className={s.top}>
        <div className={s.titles}>
          <h3 className={s.title}>Hét parcella rozsa, májusban</h3>
          <p className={s.lead}>
            Parcellánként egy kiásott mintacsomó, a májusi talajmérés napján. A kalászolás mind a hét parcellán a végén jár
            (BBCH 59 körül). A talajszint fölött a hajtás, alatta a gyökércsomó.
          </p>
        </div>
        <button ref={trigger} type="button" className={s.thumb} onClick={() => setOverview(true)}>
          <span className={s.thumbImg}>
            <Image src={`${rye.dir}/${rye.overview.file}`} alt="" fill sizes="150px" />
          </span>
          <span className={s.thumbText}>
            <span className={s.thumbTitle}>Mind a hét egy képen</span>
            <span className={s.thumbSub}>
              eredeti fotó, mért értékekkel <Maximize2 size={12} aria-hidden="true" />
            </span>
          </span>
        </button>
      </div>

      <div className={s.filterRow}>
        <div role="group" aria-label="Szűrés kezelés szerint" className={s.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              className={`${s.filter} ${filter === f.id ? s.filterOn : ''}`}
              onClick={() => pickFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className={s.count}>{filter === 'all' ? '7 parcella' : `${n} parcella választható`}</span>
      </div>

      <p className={s.legend} aria-hidden="true">
        <span className={s.legendLine} /> talajszint · fölötte hajtás, alatta gyökér · húzd oldalra
      </p>

      <div className={s.frame} onKeyDown={(e) => zoom && e.key === 'Escape' && setZoom(false)}>
        {zoom ? (
          /* Big view: the soil line runs from the photo across the text and splits it, above / below ground */
          <div className={s.zoom} aria-live="polite">
            <div className={s.zoomPhoto}>
              <Image
                src={`${rye.dir}/${p.file}`}
                alt={`A ${p.num} parcella mintacsomója közelről, a kalásztól a gyökérig`}
                fill
                loading="eager"
                sizes="(max-width: 1024px) 45vw, 320px"
              />
              <span className={s.zoomSoil} aria-hidden="true" />
            </div>
            <div className={s.zoomHead}>
              <div className={s.cardHead}>
                <span className={`${s.cardKicker} ${spadeish(p) ? s.gold : ''}`}>
                  {p.num} parcella · {ROLE[p.role]}
                </span>
                <span className={s.cardTitle}>{p.treatment}</span>
                <span className={s.cardDetail}>{p.detail}</span>
              </div>
              <div className={s.zoomNav}>
                <button type="button" className={s.navBtn} onClick={() => step(-1)} disabled={n < 2} aria-label="Előző parcella">
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <span className={s.navPos}>
                  {pos + 1} / {n}
                </span>
                <button type="button" className={s.navBtn} onClick={() => step(1)} disabled={n < 2} aria-label="Következő parcella">
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
                <button ref={back} type="button" className={s.back} onClick={() => setZoom(false)}>
                  <Minimize2 size={16} aria-hidden="true" /> Mind a hét
                </button>
              </div>
            </div>
            <div className={s.zoomBody}>
              <div className={s.zAbove}>
                <div className={s.zFigure}>
                  <span className={s.zLabel}>Föld felett</span>
                  <span className={`${s.zNum} ${s.gold}`}>
                    {shoot[sel]}
                    <span className={s.zUnit}> cm</span>
                  </span>
                  <span className={s.zSub}>hajtás, mért</span>
                </div>
                <p className={s.zText}>{p.above}</p>
              </div>
              <div className={s.zSoil} aria-hidden="true">
                <span className={s.zSoilTag}>TALAJSZINT</span>
              </div>
              <div className={s.zBelow}>
                <div className={s.zFigure}>
                  <span className={s.zLabel}>Föld alatt</span>
                  <span className={s.zNum}>
                    {root[sel]}
                    <span className={s.zUnit}> cm</span>
                  </span>
                  <span className={s.zSub}>gyökér, mért</span>
                  <span className={s.zSub}>laza réteg {cm(loose[sel])} cm</span>
                </div>
                <div className={s.zTexts}>
                  <p className={s.zText}>{p.below}</p>
                  {p.note && <p className={s.zNote}>{p.note}</p>}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={s.strip}>
            <span className={s.soil} aria-hidden="true" />
            {rye.parcels.map((q, i) => {
              const ok = fits(q, filter)
              return (
                <div key={q.num} className={`${s.tile} ${i === sel ? s.tileOn : ''}`}>
                  <button
                    type="button"
                    className={s.tileBtn}
                    disabled={!ok}
                    aria-pressed={i === sel}
                    aria-label={`${q.num} parcella, ${q.treatment}: hajtás ${shoot[i]} cm, gyökér ${root[i]} cm`}
                    onClick={() => setSel(i)}
                  >
                    <span className={s.photo}>
                      <Image src={`${rye.dir}/${q.file}`} alt="" fill sizes="(max-width: 1024px) 112px, 160px" />
                    </span>
                    <span className={`${s.name} ${spadeish(q) ? s.gold : ''}`}>
                      {q.num}
                      <span className={s.short}>{q.short}</span>
                    </span>
                    <span className={`${s.bar} ${spadeish(q) ? s.barGold : ''}`} style={{ width: `${Math.round((shoot[i] / maxShoot) * 100)}%` }} />
                    <span className={s.nums}>
                      {shoot[i]} / {root[i]} cm
                    </span>
                  </button>
                  {ok && (
                    <button
                      ref={(el) => {
                        zoomBtns.current[i] = el
                      }}
                      type="button"
                      className={s.zoomBtn}
                      aria-label={`A ${q.num} parcella nagyítva`}
                      onClick={() => {
                        setSel(i)
                        setZoom(true)
                      }}
                    >
                      <span className={s.zoomIcon}>
                        <Expand size={16} aria-hidden="true" />
                      </span>
                    </button>
                  )}
                </div>
              )
            })}
            <div className={s.axis} aria-hidden="true">
              <span className={s.axisUp}>↑ hajtás</span>
              <span className={s.axisSoil}>TALAJSZINT</span>
              <span className={s.axisDown}>↓ gyökér</span>
              <span className={s.axisNums}>hajtás / gyökér, mért</span>
            </div>
          </div>
        )}
      </div>

      {!zoom && (
        <div className={s.card} aria-live="polite">
          <Details i={sel} />
        </div>
      )}

      <p className={s.foot}>
        A hét közeli fotó a zsák szélessége alapján egy léptékre igazítva, a gyökérnyak egy vonalban. A fotók ferde szögből
        készültek, ezért a hajtás hossza a képen csak közelítő: a pontos érték a mért szám. Egy mintacsomó parcellánként; a
        bokor sűrűsége szemrevételezés.
      </p>

      {overview && (
        <Overview
          onClose={() => {
            setOverview(false)
            trigger.current?.focus()
          }}
        />
      )}
    </div>
  )
}

/** Name, treatment, characterisation and the measured values of one parcel (card and big view) */
function Details({ i }: { i: number }) {
  const p = rye.parcels[i]
  return (
    <>
      <div className={s.cardHead}>
        <span className={`${s.cardKicker} ${spadeish(p) ? s.gold : ''}`}>
          {p.num} parcella · {ROLE[p.role]}
        </span>
        <span className={s.cardTitle}>{p.treatment}</span>
        <span className={s.cardDetail}>{p.detail}</span>
      </div>
      <div className={s.cardText}>
        <p>
          {p.above} {p.below}
        </p>
        {p.note && <p className={s.note}>{p.note}</p>}
      </div>
      <dl className={s.values}>
        <div>
          <dt>hajtás</dt>
          <dd className={s.gold}>{shoot[i]} cm</dd>
        </div>
        <div>
          <dt>gyökér</dt>
          <dd>{root[i]} cm</dd>
        </div>
        <div>
          <dt>laza réteg</dt>
          <dd>{cm(loose[i])} cm</dd>
        </div>
      </dl>
    </>
  )
}

/** The original overview photo with the soil line, shoot/root lines and the measured lengths drawn on it */
function Overview({ onClose }: { onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      html.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])
  useEffect(() => {
    if (mounted) close.current?.focus()
  }, [mounted])

  if (!mounted) return null
  const { w, h } = rye.overview
  const soilPts = [rye.soilEdge[0], ...rye.parcels.map((q) => q.crown), rye.soilEdge[1]].map((q) => q.join(',')).join(' ')
  const end = rye.soilEdge[1]

  return createPortal(
    <div className={s.overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rye-overview-title"
        className={s.dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={s.dialogHead}>
          <h4 id="rye-overview-title" className={s.dialogTitle}>
            Mind a hét egy képen · május
          </h4>
          <button ref={close} type="button" className={s.close} onClick={onClose} aria-label="Bezárás">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className={s.scroller} tabIndex={0} aria-label="Az összkép, oldalra görgethető">
          <div className={s.ovBox}>
            <Image
              src={`${rye.dir}/${rye.overview.file}`}
              alt="Hét kiásott rozs-mintacsomó fehér zsákokon, balról jobbra az I–VII. parcella, középen mérőszalag"
              fill
              loading="eager"
              sizes="(max-width: 1100px) 1100px, 1400px"
            />
            <svg
              viewBox={`0 0 ${w} ${h}`}
              className={s.ovSvg}
              role="img"
              aria-label={`Jelölések: talajszint a gyökérnyakaknál, hajtás felfelé, gyökér lefelé, mért hosszal. ${rye.parcels
                .map((q, i) => `${q.num} ${shoot[i]}/${root[i]} cm`)
                .join(', ')}`}
            >
              <polyline points={soilPts} className={s.ovHalo} strokeWidth={7} />
              <polyline points={soilPts} className={s.ovSoil} />
              {rye.parcels.map((q, i) => {
                const [cx, cy] = q.crown
                const [tx, ty] = q.tip
                const [rx, ry] = q.rootEnd
                const top = `↑${shoot[i]} cm`
                const bottom = `${q.num} ↓${root[i]} cm`
                const tw = top.length * 12.2 + 18
                const bw = bottom.length * 12.2 + 18
                const ly = Math.max(ty - 38, 4)
                const gold = spadeish(q)
                return (
                  <g key={q.num}>
                    <line x1={cx} y1={cy} x2={tx} y2={ty} className={s.ovHalo} strokeWidth={6} />
                    <line x1={cx} y1={cy} x2={tx} y2={ty} className={`${s.ovShoot} ${gold ? s.ovGold : ''}`} />
                    <line x1={cx} y1={cy} x2={rx} y2={ry} className={s.ovHalo} strokeWidth={6} />
                    <line x1={cx} y1={cy} x2={rx} y2={ry} className={s.ovRoot} />
                    <circle cx={cx} cy={cy} r={7} className={s.ovDot} />
                    <rect x={tx - tw / 2} y={ly} width={tw} height={30} rx={8} className={`${s.ovTag} ${gold ? s.ovTagGold : ''}`} />
                    <text x={tx} y={ly + 21} textAnchor="middle" className={`${s.ovText} ${gold ? s.ovGoldText : ''}`}>
                      {top}
                    </text>
                    <rect x={rx - bw / 2} y={ry + 12} width={bw} height={30} rx={8} className={s.ovTag} />
                    <text x={rx} y={ry + 33} textAnchor="middle" className={s.ovText}>
                      {bottom}
                    </text>
                  </g>
                )
              })}
              <rect x={end[0] + 8} y={end[1] - 16} width={132} height={32} rx={8} className={`${s.ovTag} ${s.ovTagGold}`} />
              <text x={end[0] + 74} y={end[1] + 6} textAnchor="middle" className={`${s.ovText} ${s.ovGoldText} ${s.ovSmall}`}>
                TALAJSZINT
              </text>
            </svg>
          </div>
        </div>
        <p className={s.dialogNote}>
          Az eredeti fotó: egy kép, egy lépték, középen mérőszalag. Arany vonal: talajszint (gyökérnyak); szaggatott: hajtás;
          fehér: gyökér. A számok mért hosszak; a fotó ferde szögű, ezért a vonalak hossza csak irány.
        </p>
      </div>
    </div>,
    document.body,
  )
}
