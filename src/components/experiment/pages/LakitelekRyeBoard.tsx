'use client'

import { useEffect, useRef, useState } from 'react'
import Image, { type ImageProps } from 'next/image'
import { ChevronLeft, ChevronRight, Expand, Maximize2, Minimize2 } from 'lucide-react'
import { PhotoViewerModal } from '@/components/shared/PhotoViewer/PhotoViewerModal'
import { lakitelekRye2026 as RYE, lakitelekSoil2026, lakitelekSeasons } from '@/lib/seasons'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import type { Locale } from '@/lib/i18n/config'
import { useResearchData } from '@/lib/i18n/useResearchData'
import SoilLoader from '@/components/ui/SoilLoader'
import s from './LakitelekRyeBoard.module.css'
import PhotoCredit from '@/components/ui/PhotoCredit/PhotoCredit'

const rye = RYE
type Filter = 'all' | 'spade' | 'other'
type Parcel = (typeof rye.parcels)[number]

const FILTERS: { id: Filter; label: Record<Locale, string> }[] = [
  { id: 'all', label: { hu: 'Mind', en: 'All' } },
  { id: 'spade', label: { hu: 'Ásógéppel', en: 'With spading machine' } },
  { id: 'other', label: { hu: 'Ásógép nélkül', en: 'Without spading machine' } },
]
const ROLES = {
  hu: { deep: 'mélyásógép', spade: 'ásógéppel', other: 'ásógép nélkül' },
  en: { deep: 'deep spading machine', spade: 'spading machine', other: 'no spading machine' },
} as const

const TEXT = {
  hu: {
    plot: (n: string) => `${n} parcella`,
    title: 'Rozs a hét parcellában, májusban',
    leadA: 'Parcellánként egy kiásott mintacsomó, a májusi talajmérés napján. A kalászolás mind a hét parcellán a végén jár',
    leadB: '(BBCH 59 körül). A talajszint fölött a hajtás, alatta a gyökércsomó.',
    allSeven: 'Mind a hét egy képen',
    original: 'eredeti fotó, mért értékekkel',
    filterBy: 'Szűrés kezelés szerint',
    count: (n: number, all: boolean) => (all ? '7 parcella' : `${n} parcella választható`),
    legend: 'talajszint · fölötte hajtás, alatta gyökér · húzd oldalra',
    closeAlt: (n: string) => `A ${n} parcella mintacsomója közelről, a kalásztól a gyökérig`,
    prev: 'Előző parcella',
    next: 'Következő parcella',
    seven: 'Mind a hét',
    above: 'Föld felett',
    shootM: 'hajtás, mért',
    soil: 'TALAJSZINT',
    below: 'Föld alatt',
    rootM: 'gyökér, mért',
    loose: 'laza réteg',
    tileAria: (n: string, t: string, sh: number, ro: number) => `${n} parcella, ${t}: hajtás ${sh} cm, gyökér ${ro} cm`,
    zoomAria: (n: string) => `A ${n} parcella nagyítva`,
    up: '↑ hajtás',
    down: '↓ gyökér',
    nums: 'hajtás / gyökér, mért',
    method:
      'A hét közeli fotót a zsák szélessége alapján egy léptékre igazítottuk, a gyökérnyakak egy vonalba kerültek. A fotók ferde szögből készültek, ezért a hajtás hossza a képen csak közelítő: a pontos érték a mért szám. Parcellánként egy mintacsomót ástunk ki; a bokor sűrűségét szemrevételezéssel becsültük.',
    shoot: 'hajtás',
    root: 'gyökér',
    ovAlt: 'Hét kiásott rozs-mintacsomó fehér zsákokon, balról jobbra az I–VII. parcella, középen mérőszalag',
    ovDesc:
      'Az eredeti fotó: egy kép, egy lépték, középen mérőszalag.\n\nArany vonal: talajszint (gyökérnyak); szaggatott: hajtás; fehér: gyökér. A számok mért hosszak; a fotó ferde szögű, ezért a vonalak hossza csak irány.',
  },
  en: {
    plot: (n: string) => `Plot ${n.replace('.', '')}`,
    title: 'Rye on the seven plots, in May',
    leadA: 'One dug-up sample bunch per plot, on the day of the May soil measurement. Heading was ending on all seven plots',
    leadB: '(around BBCH 59). Above the soil line the shoot, below it the root ball.',
    allSeven: 'All seven in one image',
    original: 'original photo, with measured values',
    filterBy: 'Filter by treatment',
    count: (n: number, all: boolean) => (all ? '7 plots' : `${n} plots to choose from`),
    legend: 'soil line · shoot above, roots below · swipe sideways',
    closeAlt: (n: string) => `Close-up of the sample bunch from plot ${n.replace('.', '')}, from ear to root`,
    prev: 'Previous plot',
    next: 'Next plot',
    seven: 'All seven',
    above: 'Above ground',
    shootM: 'shoot, measured',
    soil: 'SOIL LEVEL',
    below: 'Below ground',
    rootM: 'root, measured',
    loose: 'loose layer',
    tileAria: (n: string, t: string, sh: number, ro: number) => `Plot ${n.replace('.', '')}, ${t}: shoot ${sh} cm, root ${ro} cm`,
    zoomAria: (n: string) => `Plot ${n.replace('.', '')} enlarged`,
    up: '↑ shoot',
    down: '↓ root',
    nums: 'shoot / root, measured',
    method:
      'The seven close-ups were brought to one scale by the width of the sack, with the root crowns on one line. The photos were taken at an angle, so the shoot length in the image is only approximate: the exact value is the measured figure. We dug up one sample bunch per plot; bunch density was estimated by eye.',
    shoot: 'shoot',
    root: 'root',
    ovAlt: 'Seven dug-up rye bunches on white sacks, plots I–VII from left to right, measuring tape in the middle',
    ovDesc:
      'The original photo: one image, one scale, measuring tape in the middle.\n\nGold line: soil level (root crown); dashed: shoot; white: root. The figures are measured lengths; the photo is taken at an angle, so the length of the lines only shows a direction.',
  },
}

const { shoot, root } = lakitelekSoil2026.rye
const maxShoot = Math.max(...shoot)
/* May (2nd measurement) depth of the loose layer, from the main chart's data */
const loose = lakitelekSeasons.seasons.find((x) => x.year === 2026)?.parcels.map((p) => p.values[1]) ?? []
const cmIn = (locale: Locale) => (v: number | undefined) => (v === undefined ? '–' : locale === 'en' ? String(v) : String(v).replace('.', ','))

const fits = (p: Parcel, f: Filter) => f === 'all' || (f === 'spade' ? p.role !== 'other' : p.role === 'other')
const spadeish = (p: Parcel) => p.role !== 'other'

/** A photo with the site's soil loader over it until it has loaded, like the 2025 photo viewer */
function Photo({ spinner = 'sm', ...props }: ImageProps & { spinner?: 'sm' | 'md' }) {
  const [done, setDone] = useState(false)
  return (
    <>
      {!done && (
        <span className={s.loading} aria-hidden="true">
          <SoilLoader size={spinner} />
        </span>
      )}
      <Image {...props} alt={props.alt} onLoad={() => setDone(true)} />
    </>
  )
}

/**
 * Lakitelek › Egyéb fotók, 2026: the seven rye bundles of May side by side on one scale, the soil line at
 * the root crown, the measured shoot/root under each, and a card for the chosen parcel.
 * A filter dims the parcels that don't fit; the choice jumps to the first one that does.
 */
export default function LakitelekRyeBoard() {
  const locale = useLocale()
  const t = TEXT[locale]
  const ROLE = ROLES[locale]
  const cm = cmIn(locale)
  const rye = useResearchData(RYE)
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
          <h3 className={s.title}>{t.title}</h3>
          <p className={s.lead}>
            {t.leadA} {t.leadB}
          </p>
        </div>
        <button ref={trigger} type="button" className={s.thumb} onClick={() => setOverview(true)}>
          <span className={s.thumbImg}>
            <Image src={`${rye.dir}/${rye.overview.file}`} alt="" fill sizes="150px" />
          </span>
          <span className={s.thumbText}>
            <span className={s.thumbTitle}>{t.allSeven}</span>
            <span className={s.thumbSub}>
              {t.original} <Maximize2 size={12} aria-hidden="true" />
            </span>
          </span>
        </button>
      </div>

      <div className={s.filterRow}>
        <div role="group" aria-label={t.filterBy} className={s.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              className={`${s.filter} ${filter === f.id ? s.filterOn : ''}`}
              onClick={() => pickFilter(f.id)}
            >
              {f.label[locale]}
            </button>
          ))}
        </div>
        <span className={s.count}>{t.count(n, filter === 'all')}</span>
      </div>

      <p className={s.legend} aria-hidden="true">
        <span className={s.legendLine} /> {t.legend}
      </p>

      <div className={s.frame} onKeyDown={(e) => zoom && e.key === 'Escape' && setZoom(false)}>
        {zoom ? (
          /* Big view: the soil line runs from the photo across the text and splits it, above / below ground */
          <div className={s.zoom} aria-live="polite">
            <div className={s.zoomPhoto}>
              <Photo
                key={p.file}
                spinner="md"
                src={`${rye.dir}/${p.file}`}
                alt={t.closeAlt(p.num)}
                fill
                loading="eager"
                sizes="(max-width: 1024px) 45vw, 320px"
              />
              <span className={s.zoomSoil} aria-hidden="true" />
            </div>
            <div className={s.zoomHead}>
              <div className={s.cardHead}>
                <span className={`${s.cardKicker} ${spadeish(p) ? s.gold : ''}`}>
                  {t.plot(p.num)} · {ROLE[p.role]}
                </span>
                <span className={s.cardTitle}>{p.treatment}</span>
                <span className={s.cardDetail}>{p.detail}</span>
              </div>
              <div className={s.zoomNav}>
                <button type="button" className={s.navBtn} onClick={() => step(-1)} disabled={n < 2} aria-label={t.prev}>
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <span className={s.navPos}>
                  {pos + 1} / {n}
                </span>
                <button type="button" className={s.navBtn} onClick={() => step(1)} disabled={n < 2} aria-label={t.next}>
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
                <button ref={back} type="button" className={s.back} onClick={() => setZoom(false)}>
                  <Minimize2 size={16} aria-hidden="true" /> {t.seven}
                </button>
              </div>
            </div>
            <div className={s.zoomBody}>
              <div className={s.zAbove}>
                <div className={s.zFigure}>
                  <span className={s.zLabel}>{t.above}</span>
                  <span className={`${s.zNum} ${s.gold}`}>
                    {shoot[sel]}
                    <span className={s.zUnit}> cm</span>
                  </span>
                  <span className={s.zSub}>{t.shootM}</span>
                </div>
                <p className={s.zText}>{p.above}</p>
              </div>
              <div className={s.zSoil} aria-hidden="true">
                <span className={s.zSoilTag}>{t.soil}</span>
              </div>
              <div className={s.zBelow}>
                <div className={s.zFigure}>
                  <span className={s.zLabel}>{t.below}</span>
                  <span className={s.zNum}>
                    {root[sel]}
                    <span className={s.zUnit}> cm</span>
                  </span>
                  <span className={s.zSub}>{t.rootM}</span>
                  <span className={s.zSub}>{t.loose} {cm(loose[sel])} cm</span>
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
                    aria-label={t.tileAria(q.num, q.treatment, shoot[i], root[i])}
                    onClick={() => setSel(i)}
                  >
                    <span className={s.photo}>
                      <Photo src={`${rye.dir}/${q.file}`} alt="" fill sizes="(max-width: 1024px) 112px, 160px" />
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
                      aria-label={t.zoomAria(q.num)}
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
              <span className={s.axisUp}>{t.up}</span>
              <span className={s.axisSoil}>{t.soil}</span>
              <span className={s.axisDown}>{t.down}</span>
              <span className={s.axisNums}>{t.nums}</span>
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
        {t.method}
        <PhotoCredit plural>Lakitelek, {rye.photoDate}</PhotoCredit>
      </p>

      {overview && (
        <PhotoViewerModal
          isOpen
          onClose={() => {
            setOverview(false)
            trigger.current?.focus()
          }}
          currentImage={overviewItem(locale)}
          currentIndex={0}
          totalItems={1}
          onNext={() => {}}
          onPrev={() => {}}
        />
      )}
    </div>
  )
}

/** Name, treatment, characterisation and the measured values of one parcel (card and big view) */
function Details({ i }: { i: number }) {
  const locale = useLocale()
  const t = TEXT[locale]
  const ROLE = ROLES[locale]
  const cm = cmIn(locale)
  const p = useResearchData(RYE).parcels[i]
  return (
    <>
      <div className={s.cardHead}>
        <span className={`${s.cardKicker} ${spadeish(p) ? s.gold : ''}`}>
          {t.plot(p.num)} · {ROLE[p.role]}
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
          <dt>{t.shoot}</dt>
          <dd className={s.gold}>{shoot[i]} cm</dd>
        </div>
        <div>
          <dt>{t.root}</dt>
          <dd>{root[i]} cm</dd>
        </div>
        <div>
          <dt>{t.loose}</dt>
          <dd>{cm(loose[i])} cm</dd>
        </div>
      </dl>
    </>
  )
}

/** The overview in the site's photo viewer (as the 2025 photos): title and legend in its side panel */
const overviewItem = (locale: Locale) => ({
  src: `${rye.dir}/${rye.overview.file}`,
  alt: TEXT[locale].ovAlt,
  title: TEXT[locale].allSeven,
  credit: `Lakitelek, ${locale === 'en' ? '19 May 2026' : rye.photoDate}`,
  description: TEXT[locale].ovDesc,
  content: (onLoad: () => void) => <OverviewFigure onLoad={onLoad} />,
})

/** The original overview photo with the soil line, shoot/root lines and the measured lengths drawn on it */
function OverviewFigure({ onLoad }: { onLoad: () => void }) {
  const locale = useLocale()
  const box = useRef<HTMLDivElement>(null)
  // labels never below 12 px: when the picture is drawn narrower, the labels grow in picture units
  const [k, setK] = useState(1)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const wpx = e.contentRect.width
      if (wpx > 0) setK(Math.max(1, (12.4 * rye.overview.w) / (19 * wpx)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { w, h } = rye.overview
  const soilPts = [rye.soilEdge[0], ...rye.parcels.map((q) => q.crown), rye.soilEdge[1]].map((q) => q.join(',')).join(' ')
  const end = rye.soilEdge[1]
  const fs = 19 * k
  const th = 30 * k

  return (
    <div className={s.ovFit}>
      <div ref={box} className={s.ovBox}>
        <Image
          src={`${rye.dir}/${rye.overview.file}`}
          alt={TEXT[useLocale()].ovAlt}
          fill
          priority
          draggable={false}
          sizes="(max-width: 1024px) 1100px, 1400px"
          onLoad={onLoad}
        />
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className={s.ovSvg}
          role="img"
          aria-label={`${locale === 'en' ? 'Markings: soil level at the root crowns, shoot upwards, root downwards, with measured lengths.' : 'Jelölések: talajszint a gyökérnyakaknál, hajtás felfelé, gyökér lefelé, mért hosszal.'} ${rye.parcels
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
            const tw = (top.length * 12.2 + 18) * k
            const bw = (bottom.length * 12.2 + 18) * k
            const ly = Math.max(ty - 8 - th, 4)
            const gold = spadeish(q)
            return (
              <g key={q.num}>
                <line x1={cx} y1={cy} x2={tx} y2={ty} className={s.ovHalo} strokeWidth={6} />
                <line x1={cx} y1={cy} x2={tx} y2={ty} className={`${s.ovShoot} ${gold ? s.ovGold : ''}`} />
                <line x1={cx} y1={cy} x2={rx} y2={ry} className={s.ovHalo} strokeWidth={6} />
                <line x1={cx} y1={cy} x2={rx} y2={ry} className={s.ovRoot} />
                <circle cx={cx} cy={cy} r={7} className={s.ovDot} />
                <rect x={tx - tw / 2} y={ly} width={tw} height={th} rx={8} className={`${s.ovTag} ${gold ? s.ovTagGold : ''}`} />
                <text x={tx} y={ly + th * 0.7} textAnchor="middle" fontSize={fs} className={`${s.ovText} ${gold ? s.ovGoldText : ''}`}>
                  {top}
                </text>
                <rect x={rx - bw / 2} y={ry + 12} width={bw} height={th} rx={8} className={s.ovTag} />
                <text x={rx} y={ry + 12 + th * 0.7} textAnchor="middle" fontSize={fs} className={s.ovText}>
                  {bottom}
                </text>
              </g>
            )
          })}
          <rect x={end[0] - 132 * k - 8} y={end[1] - 16 * k - 40} width={132 * k} height={32 * k} rx={8} className={`${s.ovTag} ${s.ovTagGold}`} />
          <text x={end[0] - 66 * k - 8} y={end[1] + 6 * k - 40} textAnchor="middle" fontSize={fs} className={`${s.ovText} ${s.ovGoldText} ${s.ovSmall}`}>
            {TEXT[locale].soil}
          </text>
        </svg>
      </div>
    </div>
  )
}
