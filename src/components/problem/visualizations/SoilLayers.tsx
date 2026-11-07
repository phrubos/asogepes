'use client'

/*
 * Plays a soil-profile scene on request (ticket 001). The finished picture is one crisp svg (also the server render
 * and the reduced-motion view). While playing, the moving clods move in small groups, each group its own small svg
 * layer that the GPU moves and fades: the ~1000-path picture is not repainted every frame, which made the
 * per-clod version stutter on phones. The machine, the yellow lines and the depth scale sit in an svg on top.
 */

import { useCallback, useId, useMemo, useRef, type JSX } from 'react'
import { useInView } from 'framer-motion'
import { useSoilPlayback } from './useSoilPlayback'
import SoilPlayButton from './SoilPlayButton'
import ui from './SoilPlayButton.module.css'
import styles from './SoilLayers.module.css'

export interface Clod { path: string; fill: string; cx: number; cy: number }
export type Params = Record<string, number>
export interface Motion { op: number; dx: number; dy: number; s: number }
export interface Group {
    clods: (Clod & { p: Params })[]
    /** Opacity and offset of a group at time t; p = the averaged parameters of its clods. */
    motion: (t: number, p: Params) => Motion
    /** Which layer a clod moves with. */
    cell: (c: Clod) => string
}
export interface Scene {
    sky: string
    soil: string
    duration: number
    /** The finished picture in drawing order; `g` = moves during playback (hidden in the base while playing). */
    base: (Clod & { g?: boolean })[]
    /** Layers drawn on top of the base, in this order (the movers, then the compact soil). */
    groups: Group[]
    Overlay: (props: { uid: string; inView: boolean }) => JSX.Element
    setupOverlay: (svg: SVGSVGElement) => (t: number) => void
}

export const REST: Motion = { op: 1, dx: 0, dy: 0, s: 1 }
export const GONE: Motion = { op: 0, dx: 0, dy: 0, s: 1 }

export const DepthScale = () => (
    <g>
        <line x1="292" y1="45" x2="292" y2="115" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="4,3" />
        <rect x="268" y="32" width="28" height="14" rx="3" fill="rgba(0,0,0,0.3)" />
        <text x="282" y="43" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle">0 cm</text>
        <rect x="250" y="108" width="46" height="14" rx="3" fill="rgba(0,0,0,0.4)" />
        <text x="273" y="119" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle">30 cm</text>
    </g>
)

const PAD = 13 // largest clod radius + stroke

interface Cell { key: string; group: number; clods: Clod[]; p: Params; x0: number; y0: number; w: number; h: number }

const buildCells = (groups: Group[]): Cell[] => {
    const cells: Cell[] = []
    groups.forEach((g, gi) => {
        const map = new Map<string, (Clod & { p: Params })[]>()
        g.clods.forEach((c) => {
            const k = g.cell(c)
            const list = map.get(k)
            if (list) list.push(c)
            else map.set(k, [c])
        })
        map.forEach((list, k) => {
            const p: Params = {}
            Object.keys(list[0].p).forEach((n) => { p[n] = list.reduce((a, c) => a + c.p[n], 0) / list.length })
            const x0 = Math.floor(Math.min(...list.map((c) => c.cx)) - PAD), y0 = Math.floor(Math.min(...list.map((c) => c.cy)) - PAD)
            const x1 = Math.ceil(Math.max(...list.map((c) => c.cx)) + PAD), y1 = Math.ceil(Math.max(...list.map((c) => c.cy)) + PAD)
            cells.push({ key: `${gi}-${k}`, group: gi, clods: list, p, x0, y0, w: x1 - x0, h: y1 - y0 })
        })
    })
    return cells
}

/** Frame renderer for the group layers: only opacity and transform change, both handled by the compositor. */
const layersRenderer = (root: HTMLElement, scene: Scene, cells: Cell[]) => {
    const base = root.querySelector('[data-base]')!
    const nodes = Array.from(root.querySelectorAll<SVGSVGElement>('[data-cell]'))
    const last = nodes.map(() => '')
    let playing = false
    return (t: number) => {
        if (t >= scene.duration) {
            if (!playing) return
            playing = false
            nodes.forEach((n, i) => { n.style.opacity = '0'; n.style.transform = ''; n.style.willChange = ''; last[i] = '' })
            base.classList.remove(styles.hideMovers)
            return
        }
        if (!playing) {
            playing = true
            nodes.forEach((n) => { n.style.willChange = 'transform, opacity' })
            base.classList.add(styles.hideMovers)
        }
        cells.forEach((c, i) => {
            const m = scene.groups[c.group].motion(t, c.p)
            const op = m.op.toFixed(2)
            const tf = m.dx === 0 && m.dy === 0 && m.s === 1 ? 'none'
                : `translate(${((m.dx / c.w) * 100).toFixed(2)}%,${((m.dy / c.h) * 100).toFixed(2)}%) scale(${m.s.toFixed(3)})`
            const key = op + tf
            if (key === last[i]) return
            last[i] = key
            nodes[i].style.opacity = op
            nodes[i].style.transform = tf
        })
    }
}

export default function SoilLayers({ scene: makeScene }: { scene: () => Scene }) {
    const uid = useId().replace(/:/g, '')
    const stageRef = useRef<HTMLDivElement>(null)
    // draws the yellow lines once, when half of the profile is on screen
    const inView = useInView(stageRef, { once: true, amount: 0.5 })
    const scene = useMemo(makeScene, [makeScene])
    const cells = useMemo(() => buildCells(scene.groups), [scene])

    const setup = useCallback((root: HTMLDivElement) => {
        const overlay = scene.setupOverlay(root.querySelector<SVGSVGElement>('[data-overlay]')!)
        const layers = layersRenderer(root, scene, cells)
        return (t: number) => { overlay(t); layers(t) }
    }, [scene, cells])

    const { state, toggle, showButton } = useSoilPlayback(stageRef, scene.duration, setup)

    return (
        <div ref={stageRef} className={`${ui.frame} ${styles.stage}`}>
            {/* The finished picture */}
            <svg viewBox="0 0 300 150" className={ui.svg} preserveAspectRatio="xMidYMid slice" data-base="">
                <rect x="0" y="0" width="300" height="45" fill={scene.sky} />
                <rect x="0" y="45" width="300" height="105" fill={scene.soil} />
                {scene.base.map((c, i) => (
                    <path key={i} d={c.path} fill={c.fill} stroke="rgba(0,0,0,0.3)" strokeWidth={0.8} data-g={c.g ? '' : undefined} />
                ))}
            </svg>

            {/* The moving clods in groups; hidden except while playing */}
            {cells.map((c) => (
                <svg
                    key={c.key}
                    className={styles.cell}
                    viewBox={`${c.x0} ${c.y0} ${c.w} ${c.h}`}
                    preserveAspectRatio="none"
                    style={{ left: `${c.x0 / 3}%`, top: `${c.y0 / 1.5}%`, width: `${c.w / 3}%`, height: `${c.h / 1.5}%`, opacity: 0 }}
                    aria-hidden="true"
                    data-cell=""
                >
                    {c.clods.map((cl, i) => <path key={i} d={cl.path} fill={cl.fill} stroke="rgba(0,0,0,0.3)" strokeWidth={0.8} />)}
                </svg>
            ))}

            {/* Yellow lines, the machine and the depth scale */}
            <svg viewBox="0 0 300 150" className={styles.overlay} preserveAspectRatio="xMidYMid slice" aria-hidden="true" data-overlay="">
                <scene.Overlay uid={uid} inView={inView} />
            </svg>

            {showButton && <SoilPlayButton state={state} onClick={toggle} />}
        </div>
    )
}
