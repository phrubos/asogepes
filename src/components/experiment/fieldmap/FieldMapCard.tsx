'use client'

import { useEffect, useRef } from 'react'
import {
  project, UNITS_PER_METRE as M, GRID, gridToMap, HU_BORDER, DUNA, TISZA, TOWNS, SITE_DOTS, coordLabel,
  type LonLat, type MapField,
} from '@/lib/field-maps'
import { SCROLL_TARGET_EVENT } from '@/components/shared/ScrollLayout/ScrollLayout'
import styles from './FieldMapCard.module.css'

/*
 * "Helyszín adatok" field map (ticket 006): a squared paper scrap with a map that zooms in three steps,
 * Duna–Tisza köze → Kecskemét környéke → the field(s). The first two views are the same on every site
 * (all three sites show, the current one is the pin); the last view is fitted to the site's fields, so
 * its scale follows the subject (50 m for Lakitelek, 500 m for the two Szentkirály fields 2.3 km apart).
 * The SVG is driven imperatively (viewBox per frame), so labels are sized in px for the view they belong
 * to and stay crisp. The paper itself never animates: a rotated, drop-shadowed element blurs while it moves.
 */

type Pt = [number, number]
type SiteKey = keyof typeof SITE_DOTS
const NS = 'http://www.w3.org/2000/svg'
const pathOf = (pts: LonLat[], close = false) =>
  'M' + pts.map((p) => project(p).map((v) => v.toFixed(2)).join(',')).join('L') + (close ? 'Z' : '')

// Torn edges: deterministic, so server and client render the same clip-path
const TORN = (() => {
  let seed = 7
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
  const pts: string[] = []
  const edge = (f: (t: number, d: number) => string, n: number, depth: number) => {
    for (let i = 0; i <= n; i++) pts.push(f(i / n, depth * rnd()))
  }
  edge((t, d) => `${(t * 100).toFixed(2)}% ${d.toFixed(2)}px`, 34, 5)
  edge((t, d) => `calc(100% - ${d.toFixed(2)}px) ${(t * 100).toFixed(2)}%`, 40, 4)
  edge((t, d) => `${(100 - t * 100).toFixed(2)}% calc(100% - ${(d * 1.8).toFixed(2)}px)`, 34, 5)
  edge((t, d) => `${d.toFixed(2)}px ${(100 - t * 100).toFixed(2)}%`, 40, 4)
  return `polygon(${pts.join(',')})`
})()

// One scale bar for every zoom level: the largest 1–2–5 step that fits in 120 px
const STEPS = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000]

// The other sites as dim rings on the regional view, with a label placed clear of its neighbours
const SITE_NAMES: Record<SiteKey, string> = { lakitelek: 'Lakitelek', szentkiraly: 'Szentkirály', kecskemetBorbas: 'Kecskemét-Borbás' }
const DIM_LABEL: Record<SiteKey, 'below' | 'aboveLeft'> = { lakitelek: 'below', szentkiraly: 'below', kecskemetBorbas: 'aboveLeft' }
// The current site's pin label, placed where the regional view has room for it
const PIN_LABEL: Record<SiteKey, 'above' | 'right' | 'left'> = { lakitelek: 'above', szentkiraly: 'right', kecskemetBorbas: 'left' }

interface Props {
  site: SiteKey
  title: string
  fields: MapField[]
  /** Fields not in use in the selected season: drawn dashed and dim */
  inactive?: string[]
  /** Colour key for strip fields (ásógéppel művelt / ásógép nélkül) */
  showKey?: boolean
}

export default function FieldMapCard({ site, title, fields, inactive = [], showKey = false }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const tagRef = useRef<HTMLSpanElement>(null)
  const scaleLblRef = useRef<HTMLSpanElement>(null)
  const scaleBarRef = useRef<HTMLElement>(null)
  const keyRef = useRef<HTMLUListElement>(null)
  const replayRef = useRef<HTMLButtonElement>(null)
  const inactiveRef = useRef(inactive)
  inactiveRef.current = inactive

  const siteName = SITE_NAMES[site]
  const pinLL = SITE_DOTS[site]
  const multi = fields.length > 1
  const stripCount = fields.find((f) => f.strips)?.strips?.strips.length
  const fieldTag = multi ? 'Táblák' : 'Tábla'

  useEffect(() => {
    if (!mapRef.current || !svgRef.current) return
    const map: HTMLDivElement = mapRef.current, svg: SVGSVGElement = svgRef.current
    // read directly: the shared hook reports false on the first render, which would start the animation
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const P = project(pinLL)

    // field geometry in map units
    const geo = fields.map((f) => {
      if (f.strips) {
        const s = f.strips, A = project(s.start), ang = (s.angleDeg * Math.PI) / 180
        const toWorld = (lx: number, ly: number): Pt => [
          A[0] + (lx * Math.cos(ang) - ly * Math.sin(ang)) * M,
          A[1] + (lx * Math.sin(ang) + ly * Math.cos(ang)) * M,
        ]
        const Wd = s.stripWidth * s.strips.length
        // (room for the numerals is added in px in computeStages)
        const pts = [toWorld(0, 0), toWorld(s.length, 0), toWorld(s.length, Wd), toWorld(0, Wd)]
        return { f, pts, toWorld }
      }
      return { f, pts: (f.outline ?? []).map(project), toWorld: null }
    })

    const size = () => ({ w: map.clientWidth || 1, h: map.clientHeight || 1 })
    type Stage = { c: Pt; w: number; tag: string }
    let STAGES: Stage[] = []
    // the last view: fitted to the fields, with room for the labels under outlined fields
    function computeStages() {
      const xs = geo.flatMap((g) => g.pts.map((p) => p[0])), ys = geo.flatMap((g) => g.pts.map((p) => p[1]))
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys)
      let y1 = Math.max(...ys)
      const { w, h } = size(), aspect = w / h
      const hasLabels = geo.some((g) => g.f.label)
      const pad = hasLabels ? 1.3 : 1.12
      let x0r = x0
      let fw = Math.max(x1 - x0, (y1 - y0) * aspect) * pad
      if (hasLabels) y1 += (42 * fw) / w // two label lines under the lowest field
      // parcel numerals left of the strips: ~36 px of text, whatever the scale
      if (geo.some((g) => g.f.strips)) x0r = x0 - (36 * fw) / w
      fw = Math.max(x1 - x0r, (y1 - y0) * aspect) * pad
      const x0c = x0r
      STAGES = [
        { c: gridToMap(262, 174), w: 176 * GRID, tag: 'Duna–Tisza köze' },
        { c: gridToMap(265.5, 168), w: 44 * GRID, tag: 'Kecskemét környéke' },
        { c: [(x0c + x1) / 2, (y0 + y1) / 2], w: fw, tag: fieldTag },
      ]
    }

    // static layers
    svg.innerHTML = ''
    const el = (tag: string, attrs: Record<string, string | number>, parent: Element, text?: string) => {
      const e = document.createElementNS(NS, tag)
      for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v))
      if (text) e.textContent = text
      parent.appendChild(e)
      return e
    }
    // country outline and rivers: country-scale geometry, culled at field scale (see cull())
    const base = el('g', {}, svg) as SVGGElement
    el('path', { d: pathOf(HU_BORDER, true), class: styles.land, 'vector-effect': 'non-scaling-stroke' }, base)
    el('path', { d: pathOf(DUNA), class: styles.river, 'vector-effect': 'non-scaling-stroke' }, base)
    el('path', { d: pathOf(TISZA), class: styles.river, 'vector-effect': 'non-scaling-stroke' }, base)
    const L0 = el('g', { class: `${styles.lay} ${styles.l0}` }, svg)
    const L1 = el('g', { class: `${styles.lay} ${styles.l1}` }, svg)
    const pin = el('g', { class: styles.pin }, svg)
    const ring = el('circle', { class: styles.pinRing }, pin)
    const core = el('circle', { class: styles.pinCore, 'vector-effect': 'non-scaling-stroke' }, pin)
    const pinLbl = el('text', { class: styles.pinLbl }, pin, siteName)
    const fieldsG = el('g', {}, svg)
    const L2 = el('g', { class: `${styles.lay} ${styles.l2}` }, svg)
    // the link between two fields draws itself once the fields are in, then its distance fades in
    const linkG = el('g', {}, svg)
    let link: { line: Element; lbl: Element; x1: number; y1: number; x2: number; y2: number } | null = null
    let linkState: 'off' | 'drawing' | 'on' = 'off'
    let linkRaf = 0, linkTimer = 0

    const boxOf = (s: Stage) => {
      const { w, h } = size()
      const bh = s.w / (w / h)
      return [s.c[0] - s.w / 2, s.c[1] - bh / 2, s.w, bh]
    }
    const upp = (box: number[]) => box[2] / size().w // map units per px

    function buildLayers() {
      computeStages()
      const u0 = upp(boxOf(STAGES[0])), u1 = upp(boxOf(STAGES[1])), u2 = upp(boxOf(STAGES[2]))
      const narrow = size().w < 420
      ;[L0, L1, L2, fieldsG, linkG].forEach((g) => (g.innerHTML = ''))
      link = null; linkState = 'off'; cancelAnimationFrame(linkRaf); clearTimeout(linkTimer)

      // 1. wide view: cities, rivers, the frame we zoom into next
      const big: [string, LonLat, 'start' | 'end'][] = [
        ['Budapest', TOWNS.budapest, 'start'], ['Kecskemét', TOWNS.kecskemet, 'end'], ['Szeged', TOWNS.szeged, 'start'],
        ['Cegléd', TOWNS.cegled, 'end'], ['Szolnok', TOWNS.szolnok, 'start'],
      ]
      for (const [n, ll, anc] of big) {
        const [x, y] = project(ll)
        const cap = n === 'Budapest'
        el('circle', { cx: x, cy: y, r: (cap ? 4 : 3) * u0, class: cap ? styles.dot : styles.town }, L0)
        el('text', { x: x + (anc === 'start' ? 8 : -8) * u0, y: y + 4 * u0, 'font-size': (cap ? 13 : 12) * u0, 'text-anchor': anc, class: cap ? styles.lbl : styles.townLbl }, L0, n)
      }
      const dl = project([18.92, 46.75]), tl = project([20.21, 46.45])
      el('text', { x: dl[0] - 8 * u0, y: dl[1], 'font-size': 13 * u0, 'text-anchor': 'end', class: styles.riverLbl }, L0, 'Duna')
      el('text', { x: tl[0] + 8 * u0, y: tl[1], 'font-size': 13 * u0, class: styles.riverLbl }, L0, 'Tisza')
      const z = boxOf(STAGES[1])
      el('rect', { x: z[0], y: z[1], width: z[2], height: z[3], class: styles.zoomFrame, 'stroke-dasharray': `${4 * u0} ${3 * u0}`, 'vector-effect': 'non-scaling-stroke' }, L0)

      // 2. Kecskemét környéke: Kecskemét, small towns, the Tisza, the other research sites dimmed
      const kc = project(TOWNS.kecskemet)
      el('rect', { x: kc[0] - 4 * u1, y: kc[1] - 4 * u1, width: 8 * u1, height: 8 * u1, class: styles.dot }, L1)
      el('text', { x: kc[0], y: kc[1] + 20 * u1, 'font-size': 13 * u1, 'text-anchor': 'middle', class: styles.lbl }, L1, 'Kecskemét')
      for (const [n, ll] of [['Nagykőrös', TOWNS.nagykoros], ['Tiszakécske', TOWNS.tiszakecske]] as [string, LonLat][]) {
        const [x, y] = project(ll)
        el('circle', { cx: x, cy: y, r: 2.5 * u1, class: styles.town }, L1)
        if (n === 'Tiszakécske' && narrow) continue // no room right of the Tisza on phones
        el('text', { x: x + 6 * u1, y: y + 4 * u1, 'font-size': 12 * u1, class: styles.townLbl }, L1, n)
      }
      const tz = project([20.085, 46.99])
      el('text', { x: tz[0] + 8 * u1, y: tz[1], 'font-size': 13 * u1, class: styles.riverLbl }, L1, 'Tisza')
      for (const key of Object.keys(SITE_DOTS) as SiteKey[]) {
        if (key === site) continue
        const [x, y] = project(SITE_DOTS[key])
        el('circle', { cx: x, cy: y, r: 4.5 * u1, class: styles.siteDim }, L1)
        el('text', DIM_LABEL[key] === 'below'
          ? { x, y: y + 19 * u1, 'font-size': 12 * u1, 'text-anchor': 'middle', class: styles.townLbl }
          : { x: x - 4 * u1, y: y - 10 * u1, 'font-size': 12 * u1, 'text-anchor': 'end', class: styles.townLbl }, L1, SITE_NAMES[key])
      }

      // 3. the fields; two outlined fields get a dashed link with their distance (Szentkirály: 2.3 km)
      const outlined = geo.filter((g) => !g.f.strips && g.pts.length)
      if (outlined.length === 2) {
        const [c1, c2] = outlined.map((g) => g.pts.reduce<Pt>((a, p) => [a[0] + p[0] / g.pts.length, a[1] + p[1] / g.pts.length], [0, 0]))
        const r = outlined.map((g, k) => Math.max(...g.pts.map((p) => Math.hypot(p[0] - [c1, c2][k][0], p[1] - [c1, c2][k][1]))))
        const d = Math.hypot(c2[0] - c1[0], c2[1] - c1[1]), ux = (c2[0] - c1[0]) / d, uy = (c2[1] - c1[1]) / d
        const a = r[0] * 0.8 + 8 * u2, b = d - r[1] * 0.8 - 8 * u2
        const lx1 = c1[0] + ux * a, ly1 = c1[1] + uy * a
        const line = el('line', { x1: lx1, y1: ly1, x2: lx1, y2: ly1, class: styles.link, 'stroke-dasharray': `${5 * u2} ${4 * u2}`, 'vector-effect': 'non-scaling-stroke' }, linkG)
        const km = (d / M / 1000).toFixed(1).replace('.', ',')
        const lbl = el('text', { x: (c1[0] + c2[0]) / 2 + 8 * u2, y: (c1[1] + c2[1]) / 2 + 4 * u2, 'font-size': 12 * u2, class: styles.linkLbl, 'stroke-width': 4 * u2 }, linkG, `${km} km`)
        link = { line, lbl, x1: lx1, y1: ly1, x2: c1[0] + ux * b, y2: c1[1] + uy * b }
      }
      let i = 0
      for (const g of geo) {
        const off = inactiveRef.current.includes(g.f.id)
        const s = g.f.strips
        if (s && g.toWorld) {
          // strips a little narrower than their width so the paper shows between them
          const W = s.stripWidth, N = s.strips.length, GAP = 2.4
          const tight = (W * M) / u2 < 17 // strips closer than a 12 px line: label first, middle, last
          s.strips.forEach((st, k) => {
            const y0 = k * W + GAP / 2, y1 = (k + 1) * W - GAP / 2
            const pts = [g.toWorld!(0, y0), g.toWorld!(s.length, y0), g.toWorld!(s.length, y1), g.toWorld!(0, y1)]
            el('polygon', { points: pts.map((p) => p.join(',')).join(' '), class: `${styles.strip} ${st.spade ? styles.spade : styles.plain}`, style: `--i:${i++}`, 'vector-effect': 'non-scaling-stroke' }, fieldsG)
            if (tight && ![0, Math.floor(N / 2), N - 1].includes(k)) return
            const [nx, ny] = g.toWorld!(-7, (k + 0.5) * W)
            el('text', { x: nx, y: ny + 4.5 * u2, 'font-size': 13 * u2, 'text-anchor': 'end', class: styles.num }, L2, st.label)
          })
          continue
        }
        el('polygon', { points: g.pts.map((p) => p.join(',')).join(' '), 'data-field': g.f.id, class: `${styles.strip} ${styles.field} ${off ? styles.fieldOff : ''}`, style: `--i:${i++}`, 'vector-effect': 'non-scaling-stroke' }, fieldsG)
        if (g.f.label) {
          const cx = g.pts.reduce((a, p) => a + p[0], 0) / g.pts.length, by = Math.max(...g.pts.map((p) => p[1]))
          const lg = el('g', { 'data-field': g.f.id, class: off ? styles.fieldOff : '' }, L2)
          el('text', { x: cx, y: by + 18 * u2, 'font-size': 13 * u2, 'text-anchor': 'middle', class: styles.fieldLbl }, lg, g.f.label)
          if (g.f.sub) el('text', { x: cx, y: by + 36 * u2, 'font-size': 12 * u2, 'text-anchor': 'middle', class: styles.townLbl }, lg, g.f.sub)
        }
      }
    }

    // At field scale the country outline, the rivers and the wide-view labels are ~1000× the frame in px
    // (the labels' font sizes too). Phones rasterise them anyway and run out of GPU memory: the map stays
    // half drawn and other blocks of the page go blank. Take whatever is out of sight out of the render tree.
    const cull = (box: number[]) => {
      const w = box[2] / GRID // grid units across the frame (stage widths: 176, 44, then ≈ 0.3–3)
      base.style.display = w < 6 ? 'none' : ''
      base.style.opacity = w < 12 ? String(Math.max(0, (w - 6) / 6)) : ''
      ;(L0 as SVGGElement).style.display = w < 30 ? 'none' : ''
      ;(L1 as SVGGElement).style.display = w < 6 ? 'none' : ''
    }

    function sizePin(box: number[]) {
      cull(box)
      const u = upp(box)
      // scale bar
      const mPerPx = u / M
      const step = STEPS.filter((m) => m / mPerPx <= 120).pop() ?? STEPS[0]
      if (scaleBarRef.current) scaleBarRef.current.style.width = `${(step / mPerPx).toFixed(1)}px`
      if (scaleLblRef.current) scaleLblRef.current.textContent = step >= 1000 ? `${step / 1000} km` : `${step} m`
      for (const c of [ring, core]) { c.setAttribute('cx', String(P[0])); c.setAttribute('cy', String(P[1])); c.setAttribute('r', String(6 * u)) }
      ring.setAttribute('stroke-width', String(1.5 * u))
      // The wide view labels above the pin; the regional view uses the side with room. The label glides
      // between the two with the zoom (labelMix 0 → 1), always middle-anchored so nothing jumps.
      pinLbl.setAttribute('text-anchor', 'middle')
      pinLbl.setAttribute('font-size', String(14 * u))
      if (!labelPx) labelPx = (pinLbl as SVGTextElement).getComputedTextLength() / u // text width in px, constant across zooms
      let side = PIN_LABEL[site]
      if (side !== 'above' && STAGES[1]) {
        // a narrow map may have no room beside the pin in the regional view: then the label stays above
        const b1 = boxOf(STAGES[1]), u1 = upp(b1)
        const room = side === 'left' ? (P[0] - b1[0]) / u1 : (b1[0] + b1[2] - P[0]) / u1
        if (room < 12 + labelPx + 8) side = 'above'
      }
      const to = side === 'above' ? [0, -14] : [(side === 'right' ? 1 : -1) * (12 + labelPx / 2), 5]
      const dx = to[0] * labelMix, dy = -14 + (to[1] + 14) * labelMix
      pinLbl.setAttribute('x', String(P[0] + dx * u)); pinLbl.setAttribute('y', String(P[1] + dy * u))
    }
    let labelMix = 0, labelPx = 0

    let stage = 0, animating = false, raf = 0
    let timers: number[] = []
    const svgClass = (extra = '') => svg.setAttribute('class', `${styles.svg} ${extra}`)
    const setStage = (i: number) => {
      labelMix = i >= 1 ? 1 : 0
      stage = i
      svgClass(styles[`s${i}` as 's0'])
      if (tagRef.current) tagRef.current.textContent = STAGES[i].tag
    }
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)) }
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    function zoom(from: number[], to: number[], ms: number, onFrame: (b: number[], t: number) => void, done: () => void) {
      const t0 = performance.now()
      animating = true
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / ms), e = ease(t)
        // log-interpolated width: the zoom feels even over a 500× change
        const w = Math.exp(Math.log(from[2]) + (Math.log(to[2]) - Math.log(from[2])) * e)
        const k = (from[2] - w) / (from[2] - to[2])
        const fc = [from[0] + from[2] / 2, from[1] + from[3] / 2], tc = [to[0] + to[2] / 2, to[1] + to[3] / 2]
        const cx = fc[0] + (tc[0] - fc[0]) * k, cy = fc[1] + (tc[1] - fc[1]) * k, h = w * (from[3] / from[2])
        const b = [cx - w / 2, cy - h / 2, w, h]
        svg.setAttribute('viewBox', b.join(' '))
        onFrame(b, t)
        if (t < 1) raf = requestAnimationFrame(step)
        else { animating = false; done() }
      }
      raf = requestAnimationFrame(step)
    }
    const stop = () => {
      timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); animating = false
      cancelAnimationFrame(linkRaf); clearTimeout(linkTimer)
    }

    const setLink = (k: number) => {
      if (!link) return
      link.line.setAttribute('x2', String(link.x1 + (link.x2 - link.x1) * k))
      link.line.setAttribute('y2', String(link.y1 + (link.y2 - link.y1) * k))
    }
    /** instant: show the finished link (reduced motion, a repeat visit, a resize) */
    const showLink = (on: boolean, instant: boolean) => {
      if (!link) return
      if (!on) {
        cancelAnimationFrame(linkRaf); clearTimeout(linkTimer); linkState = 'off'
        setLink(0); link.lbl.classList.remove(styles.linkLblOn)
        return
      }
      if (linkState !== 'off') return
      if (instant) { linkState = 'on'; setLink(1); link.lbl.classList.add(styles.linkLblOn); return }
      linkState = 'drawing'
      // after the fields have faded in: draw the line (0.7 s), then the distance
      linkTimer = window.setTimeout(() => {
        const t0 = performance.now()
        const step = (now: number) => {
          const t = Math.min(1, (now - t0) / 700)
          setLink(1 - Math.pow(1 - t, 3))
          if (t < 1) linkRaf = requestAnimationFrame(step)
          else { linkState = 'on'; link?.lbl.classList.add(styles.linkLblOn) }
        }
        linkRaf = requestAnimationFrame(step)
      }, 500)
    }
    const showFields = (on: boolean, instant = false) => {
      fieldsG.classList.toggle(styles.stripsOn, on)
      keyRef.current?.classList.toggle(styles.keyOn, on)
      showLink(on, instant)
    }

    function finish(instant = true) {
      const b2 = boxOf(STAGES[2])
      svg.setAttribute('viewBox', b2.join(' '))
      sizePin(b2)
      setStage(2)
      pin.classList.remove(styles.drop)
      ;(pin as SVGElement).style.opacity = '0'
      showFields(true, instant)
    }

    const storeKey = `fieldmap-played:${site}`
    function play() {
      stop()
      buildLayers()
      const b0 = boxOf(STAGES[0]), b1 = boxOf(STAGES[1]), b2 = boxOf(STAGES[2])
      setStage(0)
      svg.setAttribute('viewBox', b0.join(' '))
      sizePin(b0)
      ;(pin as SVGElement).style.opacity = '1'
      pin.classList.remove(styles.drop)
      showFields(false)
      // labels leave as the zoom starts and arrive near its end: they never slide across the frame edge
      const layerAt = (from: number, to: number, t: number) =>
        svgClass(t < 0.12 ? styles[`s${from}` as 's0'] : t > 0.72 ? styles[`s${to}` as 's0'] : '')
      // ≈ 6.3 s: wide view 2.4 s (pin at 0.6 s), zoom 1.1 s, hold 0.9 s, zoom 1.4 s, fields 0.5 s
      later(() => pin.classList.add(styles.drop), 600)
      later(() => {
        zoom(b0, b1, 1100, (b, t) => {
          labelMix = ease(t); sizePin(b); layerAt(0, 1, t)
          if (t > 0.5 && tagRef.current) tagRef.current.textContent = STAGES[1].tag
        }, () => {
          setStage(1)
          later(() => {
            zoom(b1, b2, 1400, (b, t) => {
              sizePin(b)
              layerAt(1, 2, t)
              // the pin stays until the fields arrive, so the map is never empty mid-zoom
              ;(pin as SVGElement).style.opacity = String(Math.max(0, Math.min(1, (0.8 - t) / 0.2)))
              if (t > 0.6) { showFields(true); if (tagRef.current) tagRef.current.textContent = STAGES[2].tag }
            }, () => {
              finish(false)
              try { sessionStorage.setItem(storeKey, '1') } catch { /* private mode: replays next time */ }
            })
          }, 900)
        })
      }, 2400)
    }

    buildLayers()
    let played = false
    try { played = sessionStorage.getItem(storeKey) === '1' } catch { /* storage blocked */ }

    let io: IntersectionObserver | null = null
    // wait in the wide view (no pin, so the block is never empty) and play once the map is in view
    function arm() {
      stop(); io?.disconnect()
      buildLayers()
      const b0 = boxOf(STAGES[0]); setStage(0); svg.setAttribute('viewBox', b0.join(' ')); sizePin(b0)
      pin.classList.remove(styles.drop)
      showFields(false)
      io = new IntersectionObserver((es) => {
        if (es.some((e) => e.isIntersecting)) { io?.disconnect(); play() }
      }, { threshold: 0.35 })
      io.observe(map)
    }
    if (reduce || played) finish()
    else arm()

    // Any jump to this site (side navigation, contents sheet, the Bevezető map, a ?section= link) plays
    // the map again on arrival; scrolling there by hand plays it the first time in a session.
    const onJump = (e: Event) => {
      const target = document.getElementById(String((e as CustomEvent).detail))
      if (target?.contains(map) && !reduce) arm()
    }
    window.addEventListener(SCROLL_TARGET_EVENT, onJump)

    const onReplay = () => (reduce ? finish() : play())
    const replayBtn = replayRef.current
    replayBtn?.addEventListener('click', onReplay)

    // keep labels at their px size when the column width changes
    let lastW = map.clientWidth
    const ro = new ResizeObserver(() => {
      if (animating || map.clientWidth === lastW) return
      lastW = map.clientWidth
      buildLayers()
      const b = boxOf(STAGES[stage]); svg.setAttribute('viewBox', b.join(' ')); sizePin(b)
      if (stage === 2) showFields(true, true)
    })
    ro.observe(map)

    return () => {
      stop(); io?.disconnect(); ro.disconnect()
      replayBtn?.removeEventListener('click', onReplay)
      window.removeEventListener(SCROLL_TARGET_EVENT, onJump)
    }
  }, [site, fields, siteName, pinLL, fieldTag])

  // season switch: dim the fields not in use that year, without replaying the animation
  const inactiveKey = inactive.join(',')
  useEffect(() => {
    svgRef.current?.querySelectorAll<SVGElement>('[data-field]').forEach((e) => {
      e.classList.toggle(styles.fieldOff, inactiveKey.split(',').includes(e.dataset.field ?? ''))
    })
  }, [inactiveKey])

  const what = stripCount ? `a ${stripCount} parcellás kísérleti táblára` : multi ? `a ${fields.length} kísérleti táblára` : 'a kísérleti táblára'

  return (
    <div className={styles.card}>
      <div className={styles.wrap}>
        <span className={styles.tape} aria-hidden="true" />
        <div className={styles.paper} style={{ clipPath: TORN }}>
          <div className={styles.head}>
            <span className={styles.title}>{title}</span>
            <button ref={replayRef} className={styles.replay} type="button" aria-label="Térkép-animáció újrajátszása" title="Újrajátszás">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" />
              </svg>
            </button>
          </div>
          <div className={styles.meta}>
            <span className={styles.stageTag} ref={tagRef}>Duna–Tisza köze</span>
            <span className={styles.coord}>{coordLabel(pinLL)}</span>
          </div>
          <div className={styles.map} ref={mapRef}>
            <svg
              ref={svgRef}
              className={styles.svg}
              role="img"
              aria-label={`Térkép: a Duna–Tisza közéről ráközelít ${siteName} környékére, majd ${what}.`}
            />
          </div>
          <div className={styles.foot}>
            <div className={styles.furniture}>
              <svg className={styles.north} viewBox="0 0 14 30" role="img" aria-label="Észak felfelé">
                <text x="7" y="8" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="currentColor">É</text>
                <path d="M7 11 L12 29 L7 25 Z" fill="currentColor" />
                <path d="M7 11 L2 29 L7 25 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
              </svg>
              <span className={styles.scale} aria-hidden="true">
                <span ref={scaleLblRef}>20 km</span>
                <i ref={scaleBarRef} />
              </span>
            </div>
            {showKey && (
              <ul className={styles.key} ref={keyRef} aria-label="Jelmagyarázat">
                <li><i className={styles.keySpade} aria-hidden="true" />ásógéppel művelt</li>
                <li><i className={styles.keyPlain} aria-hidden="true" />ásógép nélkül</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
