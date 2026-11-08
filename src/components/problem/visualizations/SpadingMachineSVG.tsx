'use client'

import { FADE, METAL, clamp01, easeIn, easeInOut, easeOut, f2, makeAttrSetter } from './soilAnimation'
import SoilLayers, { DepthScale, GONE, REST, type Scene } from './SoilLayers'
import hl from './SoilHighlight.module.css'

/*
 * Spaded soil profile. Once by itself when it scrolls into view, then on request (small play button), an Imants spading machine passes (ticket 001):
 * drawn after the OperationPrinciple video (public/videos/Andornak.mp4), mirrored because it travels to the
 * right here, the spade rotor in front and the driven tine roller behind it. Every pass ends on the static
 * picture, which is also the server render and the reduced-motion view. Played by SoilLayers (clods move in groups).
 */

const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return Math.round((x - Math.floor(x)) * 10000) / 10000
}

// Generate organic clod shape (irregular polygon)
// Same function as HeavyCultivatorSVG for consistency
const generateClodPath = (cx: number, cy: number, r: number, seed: number) => {
    const points = []
    const numPoints = 8 + Math.floor(seededRandom(seed) * 4) // 8-12 points
    const angleStep = (Math.PI * 2) / numPoints

    for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep
        const rVar = r * (0.8 + seededRandom(seed + i) * 0.3)
        const px = cx + Math.cos(angle) * rVar
        const py = cy + Math.sin(angle) * rVar
        points.push(`${px.toFixed(2)},${py.toFixed(2)}`) // fixed precision: server and browser Math.sin/cos may differ in the last digits
    }
    return `M${points.join(' L')} Z`
}

interface ClodProps {
    id: string
    cx: number
    cy: number
    path: string
    delay: number
    variantIndex: number
    isDark: boolean // Track if it's from dark or light palette
    worked: boolean // in the spaded layer: thrown by the rotor during the animation
}

// Shared Palette - High Contrast
const darkPalette = ['#3E2723', '#5D4037', '#795548']
const lightPalette = ['#BCAAA4', '#D7CCC8', '#F5F5F5']
const skyColor = '#90CAF9'
const soilBgColor = '#A1887F'

const buildClods = (): ClodProps[] => {
    const items: ClodProps[] = []
    let seed = 7777 // Different seed
    const width = 300
    // max depth is same visual scale
    const soilSurface = 45
    const maxDepth = 145

    // Depth zones:
    // 0-30cm scale corresponds to 45y to 145y (100 units = 30cm)
    // Pure light zone: 0-12cm -> y = 45 to 85
    // Transition zone: 12-20cm -> y = 85 to 112 (gradual dark clod introduction)
    // Pure dark zone: 20-30cm -> y = 112 to 145
    const transitionStart = 85
    const transitionEnd = 112

    // 1. TOP LAYER (0-20 cm) -> Small Light Clods with gradual dark mixing
    for (let y = soilSurface; y < transitionEnd; y += 7) {
        for (let x = -10; x < width + 10; x += 7) {
            // Jitter
            const jx = x + (seededRandom(seed++) - 0.5) * 6
            const jy = y + (seededRandom(seed++) - 0.5) * 6

            // Calculate transition progress (0 = pure light, 1 = transition end)
            let darkProbability = 0
            let darkSizeMultiplier = 0.5

            if (jy >= transitionStart && jy < transitionEnd) {
                // In transition zone: gradually increase dark clod probability
                const progress = (jy - transitionStart) / (transitionEnd - transitionStart)
                darkProbability = progress * 0.6 // Max 60% dark at transition end
                darkSizeMultiplier = 0.5 + progress * 0.5 // Size grows from 50% to 100%
            }

            // Decide if this clod should be dark (in transition zone)
            const shouldBeDark = seededRandom(seed++) < darkProbability

            if (shouldBeDark) {
                // Dark clod in transition zone (smaller than bottom layer)
                const rRand = seededRandom(seed++)
                let variant = 2
                let r = 4

                if (rRand > 0.7) {
                    variant = 1 // Medium dark
                    r = (5 + seededRandom(seed++) * 1.5) * darkSizeMultiplier
                } else {
                    variant = 2 // Small dark
                    r = (4 + seededRandom(seed++) * 1) * darkSizeMultiplier
                }

                const path = generateClodPath(jx, jy, r, seed++)

                items.push({
                    id: `trans-dark-${items.length}`,
                    cx: jx, cy: jy, path,
                    delay: 0.1 + items.length * 0.0005,
                    variantIndex: variant,
                    isDark: true,
                    worked: true
                })
            } else {
                // Light clod (normal behavior)
                const rRand = seededRandom(seed++)
                let variant = 2
                let r = 3

                // USER REQUEST: Force small clods at the very surface line to ensure good fill
                // "kicsit kevesebbet" -> Reduced range from +8 to +5 effectively ensuring only the very top row is forced small
                if (y < soilSurface + 5) {
                    variant = 2 // Small Light specifically requested
                    r = 3 + seededRandom(seed++) * 1.2
                } else if (rRand > 0.8) {
                    variant = 0 // Large Light
                    r = 4.5 + seededRandom(seed++) * 1
                } else if (rRand > 0.4) {
                    variant = 1 // Medium Light
                    r = 3.5 + seededRandom(seed++) * 1
                } else {
                    variant = 2 // Small Light
                    r = 2.5 + seededRandom(seed++) * 1.5
                }

                const path = generateClodPath(jx, jy, r, seed++)

                items.push({
                    id: `top-${items.length}`,
                    cx: jx, cy: jy, path,
                    delay: 0.1 + items.length * 0.0005,
                    variantIndex: variant,
                    isDark: false,
                    worked: true
                })
            }
        }
    }

    // 2. BOTTOM LAYER (> 20 cm) -> Large Dark Clods with some light mixing at top
    for (let y = transitionEnd; y < maxDepth; y += 10) {
        for (let x = -10; x < width + 10; x += 10) {
            const jx = x + (seededRandom(seed++) - 0.5) * 8
            const jy = y + (seededRandom(seed++) - 0.5) * 8

            // Near the transition, add occasional smaller/lighter clods
            const distFromTransition = jy - transitionEnd
            const lightProbability = Math.max(0, 0.3 - distFromTransition * 0.015)
            const addLightClod = seededRandom(seed++) < lightProbability

            if (addLightClod) {
                // Add a light clod for smoother transition
                const variant = seededRandom(seed++) > 0.5 ? 0 : 1
                const r = 3 + seededRandom(seed++) * 1.5

                const path = generateClodPath(jx, jy, r, seed++)

                items.push({
                    id: `bottom-light-${items.length}`,
                    cx: jx, cy: jy, path,
                    delay: items.length * 0.001,
                    variantIndex: variant,
                    isDark: false,
                    worked: false
                })
            }

            // Always add dark clod
            const rRand = seededRandom(seed++)
            let variant = 0
            let r = 8

            if (rRand > 0.6) {
                variant = 0 // Large
                r = 9 + seededRandom(seed++) * 2
            } else if (rRand > 0.3) {
                variant = 1 // Med
                r = 7 + seededRandom(seed++) * 1.5
            } else {
                variant = 2 // Small
                r = 5 + seededRandom(seed++) * 1.5
            }

            const path = generateClodPath(jx, jy, r, seed++)

            items.push({
                id: `bottom-${items.length}`,
                cx: jx, cy: jy, path,
                delay: items.length * 0.001,
                variantIndex: variant,
                isDark: true,
                worked: false
            })
        }
    }

    return items.sort((a, b) => a.cy - b.cy)

}

// The compact soil the machine finds (shown only during the animation)
const buildCompact = () => {
    const items: { cx: number; cy: number; path: string; fill: string }[] = []
    let seed = 4242
    for (let y = 50; y < 112; y += 10) for (let x = -10; x < 310; x += 10) {
        const jx = x + (seededRandom(seed++) - 0.5) * 8
        const jy = y + (seededRandom(seed++) - 0.5) * 6
        const rr = seededRandom(seed++)
        const v = rr > 0.6 ? 0 : rr > 0.3 ? 1 : 2
        const r = [9, 7.5, 6][v] + seededRandom(seed++) * 1.5
        items.push({ cx: jx, cy: jy, path: generateClodPath(jx, jy, r, seed++), fill: darkPalette[v] })
    }
    return items
}

// ---- Machine geometry, true scale. The drawn "30 cm" label sits at y = 115, the surface at y = 45. ----
const SURF = 45
const CM = 70 / 30
const R = 40 * CM // spade tip radius (estimate)
const HUB_Y = SURF + 30 * CM - R // tips reach the 30 cm mark, axis 10 cm above ground
const ROLLER_R = 20.3 * CM // 406 mm roller, tine tips
const DRUM_R = ROLLER_R * 0.78
const ROLLER_DY = SURF + 6 * CM - ROLLER_R - HUB_Y // tines work 0-6 cm deep
const GAP = R + ROLLER_R + 10
const START_X = -R - 15
const END_X = 300 + GAP + ROLLER_R + 5
const SPEED = ((4.5 / 3.6) * 100 * CM) / 3 // a third of the real 4.5 km/h, so the spades can be followed
const TIP_RATIO = 1.5 // spade tip speed / travel (estimate; > 1: the rotor pushes itself forward)
const ROLLER_RATIO = 1.1 // the roller turns a little faster than travel

// ---- Timeline (s): crossfade to compact soil, a still moment, the pass, then the yellow line ----
const START = FADE + 1.0
const WORK = (END_X - START_X) / SPEED // ~6.3 s
const LINE_AT = START + WORK + 0.2
const DURATION = LINE_AT + 1.1

const timeAtX = (x: number) => START + (x - START_X) / SPEED
// a clod at depth y is first reached where the spade-tip circle crosses that depth
const reach = (y: number) => { const dy = y - HUB_Y; return dy >= R ? 0 : Math.sqrt(R * R - dy * dy) }

const toPath = (pts: number[][]) => 'M' + pts.map((p) => `${f2(p[0])},${f2(p[1])}`).join(' L') + ' Z'
const gearPath = (teeth: number, ro: number, ri: number) => {
    const pts: number[][] = []
    const pitch = (Math.PI * 2) / teeth
    for (let j = 0; j < teeth; j++) for (const [f, r] of [[0, ri], [0.18, ro], [0.47, ro], [0.65, ri]]) {
        const a = (j + f) * pitch
        pts.push([Math.cos(a) * r, Math.sin(a) * r])
    }
    return toPath(pts)
}
// Spade arm centre line, drawn pointing down. The rotor turns clockwise, so the tip leads clockwise (bends towards -x).
const SWEEP = 1.05
const centre = (u: number) => { const r = R * (0.16 + 0.84 * u), a = SWEEP * u * u; return [-Math.sin(a) * r, Math.cos(a) * r] }
const band = (u0: number, u1: number, w: (t: number) => number, off: (t: number) => number = () => 0, steps = 16) => {
    const a: number[][] = [], b: number[][] = []
    for (let i = 0; i <= steps; i++) {
        const t = i / steps, u = u0 + (u1 - u0) * t
        const [x, y] = centre(u), [x1, y1] = centre(Math.max(0, u - 0.01)), [x2, y2] = centre(Math.min(1, u + 0.01))
        const l = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / l, ny = (x2 - x1) / l
        const o = off(t), hw = w(t)
        a.push([x + nx * (o + hw), y + ny * (o + hw)])
        b.push([x + nx * (o - hw), y + ny * (o - hw)])
    }
    return toPath([...a, ...b.reverse()])
}
const ARM = band(0, 0.8, (t) => R * (0.078 - 0.04 * t))
const ARM_HI = band(0.05, 0.78, () => R * 0.011, (t) => R * (0.045 - 0.025 * t))
const PLATE = band(0.74, 1, (t) => R * 0.058 * (1 - t ** 2.2) + 0.3, () => R * 0.008)
const BOLT = centre(0.8)
const ROTOR_GEAR = gearPath(12, R * 0.2, R * 0.17)
const ROLLER_GEAR = gearPath(12, DRUM_R * 0.42, DRUM_R * 0.36)
const TINE_RINGS: [number, number, string][] = [[DRUM_R + 3, 2.2, '34 10 18 14'], [DRUM_R + 6.5, 1.8, '22 16 40 12'], [ROLLER_R - 0.9, 1.5, '16 22 30 18']]
// the bottom of the loosened layer, across the whole width
const LINE_PATH = 'M6,106 Q43,102 80,106 T154,106 T228,106 T294,106'

const Gear = ({ d, ri }: { d: string; ri: number }) => (
    <>
        <path d={d} fill={METAL.hub} stroke={METAL.edge} strokeWidth={0.9} strokeLinejoin="round" />
        <circle r={f2(ri * 0.62)} fill="none" stroke={METAL.edge} strokeWidth={0.7} opacity={0.6} />
        {[0, 1, 2, 3].map((k) => {
            const a = (k * Math.PI) / 2 + Math.PI / 4
            return <circle key={k} cx={f2(Math.cos(a) * ri * 0.4)} cy={f2(Math.sin(a) * ri * 0.4)} r={f2(ri * 0.08)} fill={METAL.edge} />
        })}
        <circle r={f2(ri * 0.13)} fill={METAL.edge} />
    </>
)

/** The machine (spade rotor in front, tine roller behind), parked off the right edge; moved by the frame renderer. */
export const SpaderMachine = ({ uid }: { uid: string }) => (
    <>
        <defs>
            <g id={`${uid}spade`}>
                <path d={ARM} fill={METAL.body} stroke={METAL.line} strokeWidth={0.8} strokeLinejoin="round" />
                <path d={ARM_HI} fill={METAL.hi} opacity={0.85} />
                <path d={PLATE} fill={METAL.plate} stroke={METAL.line} strokeWidth={0.8} strokeLinejoin="round" />
                <circle cx={f2(BOLT[0])} cy={f2(BOLT[1])} r={1.5} fill={METAL.edge} />
            </g>
        </defs>
        {/* The machine; parked off the right edge in the finished picture */}
        <g data-machine="" transform={`translate(${f2(END_X)},${f2(HUB_Y)})`}>
            <g transform={`translate(${f2(-GAP)},${f2(ROLLER_DY)})`}>
                <g data-roller="">
                    <circle r={f2(DRUM_R)} fill={METAL.drum} stroke={METAL.edge} strokeWidth={1.2} />
                    <circle r={f2(DRUM_R * 0.8)} fill="none" stroke={METAL.drumIn} strokeWidth={f2(DRUM_R * 0.22)} />
                    {TINE_RINGS.map(([r, w, dash]) => (
                        <circle key={r} r={f2(r)} fill="none" stroke={METAL.tine} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" />
                    ))}
                    <Gear d={ROLLER_GEAR} ri={DRUM_R * 0.36} />
                </g>
            </g>
            <g data-rotor="">
                <circle r={f2(R * 0.3)} fill={METAL.disc} stroke={METAL.line} strokeWidth={0.8} />
                {[0, 1, 2, 3, 4, 5].map((k) => <use key={k} href={`#${uid}spade`} transform={`rotate(${k * 60})`} />)}
                <Gear d={ROTOR_GEAR} ri={R * 0.17} />
            </g>
        </g>
    </>
)

/** The pass as a scene for SoilLayers: the spaded layer is thrown up behind the rotor, the compact soil breaks in front of it. */
const spaderScene = (): Scene => {
    const clods = buildClods()
    const fill = (c: ClodProps) => (c.isDark ? darkPalette[c.variantIndex] : lightPalette[c.variantIndex])
    const worked = clods.filter((c) => c.worked).map((c, i) => ({
        path: c.path, fill: fill(c), cx: c.cx, cy: c.cy,
        p: {
            tl: timeAtX(c.cx + 10) + (seededRandom(i * 7.13 + 3) - 0.5) * 0.12, // lands behind the rotor
            ts: timeAtX(c.cx + GAP - ROLLER_R * 0.5), // the roller tines press it back
            sw: 3.5 * clamp01(1 - (c.cy - SURF) / 67), // the loosened layer swells, the roller settles it
        },
    }))
    const compact = buildCompact().map((c) => ({ ...c, p: { tb: timeAtX(c.cx - reach(Math.min(c.cy, SURF + 30 * CM - 1))) } }))

    return {
        sky: skyColor,
        soil: soilBgColor,
        duration: DURATION,
        base: clods.map((c) => ({ path: c.path, fill: fill(c), cx: c.cx, cy: c.cy, g: c.worked })),
        groups: [
            {
                clods: worked,
                cell: (c) => `${Math.floor((c.cx + 20) / 12)}:${Math.floor((c.cy - 41) / 23)}`,
                motion: (t, { tl, ts, sw }) => {
                    if (t < FADE) return { ...REST, op: 1 - easeInOut(t / FADE) } // the finished picture fades out
                    if (t < tl) return GONE
                    const p = clamp01((t - tl) / 0.5), e = easeOut(p)
                    const q = easeOut(clamp01((t - ts) / 0.32))
                    if (p >= 1 && q >= 1) return REST
                    return {
                        op: p >= 1 ? 1 : Math.min(1, p * 3),
                        dx: (1 - e) * 22,
                        dy: (1 - e) * 4 - sw * e - 10 * Math.sin(Math.PI * p) + sw * q,
                        s: 0.5 + 0.5 * e,
                    }
                },
            },
            {
                clods: compact,
                cell: (c) => `${Math.floor((c.cx + 20) / 20)}:${Math.floor((c.cy - 45) / 21)}`,
                motion: (t, { tb }) => {
                    if (t < FADE) return { ...REST, op: easeInOut(t / FADE) } // ... into the compact soil
                    const p = clamp01((t - tb) / 0.26), e = easeIn(p)
                    if (p >= 1) return GONE
                    return p <= 0 ? REST : { op: 1 - p, dx: 0, dy: 2 * e, s: 1 - 0.4 * e }
                },
            },
        ],
        Overlay: ({ uid, inView }) => (
            <>
                {/* Bottom of the loosened layer: loose above it across the whole width */}
                <g className={`${hl.walls} ${inView ? hl.drawn : ''}`}>
                    <path pathLength={1} d={LINE_PATH} data-line="" />
                </g>
                <SpaderMachine uid={uid} />
                <DepthScale />
            </>
        ),
        setupOverlay: (svg) => {
            const machine = svg.querySelector('[data-machine]')!, rotor = svg.querySelector('[data-rotor]')!, roller = svg.querySelector('[data-roller]')!
            const line = svg.querySelector<SVGPathElement>('[data-line]')!
            const set = makeAttrSetter()
            line.style.transition = 'none' // the CSS draw-in would lag behind the frames
            return (t) => {
                const x = START_X + SPEED * Math.min(WORK, Math.max(0, t - START)), travel = x - START_X
                set(machine, 'transform', `translate(${f2(x)},${f2(HUB_Y)})`)
                set(rotor, 'transform', `rotate(${((travel * TIP_RATIO / R) * 57.2958).toFixed(1)})`)
                set(roller, 'transform', `rotate(${((travel * ROLLER_RATIO / ROLLER_R) * 57.2958).toFixed(1)})`)
                const lp = easeInOut(clamp01((t - LINE_AT) / 1.0))
                line.style.strokeDashoffset = t < FADE ? '0' : (1 - lp).toFixed(3)
                line.style.opacity = t < FADE ? (1 - easeInOut(t / FADE)).toFixed(2) : lp > 0 ? '1' : '0'
            }
        },
    }
}

const SpadingMachineSVG = () => <SoilLayers scene={spaderScene} />

export default SpadingMachineSVG
