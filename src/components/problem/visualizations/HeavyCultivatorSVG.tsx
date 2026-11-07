'use client'

import { useCallback, useId, useMemo, useRef } from 'react'
import { useInView } from 'framer-motion'
import { FADE, METAL, around, clamp01, easeIn, easeInOut, easeOut, f2, makeAttrSetter } from './soilAnimation'
import { useSoilPlayback } from './useSoilPlayback'
import SoilPlayButton from './SoilPlayButton'
import ui from './SoilPlayButton.module.css'
import hl from './SoilHighlight.module.css'

/*
 * Heavy-cultivated soil profile, seen from the front: the three U shapes are three tine tracks side by side.
 * On request (small play button) the cultivator comes towards us through the section plane once (ticket 001):
 * the compact soil in the tracks breaks and the crumbs rise, the ridges between them stay, and the yellow
 * edge of the tracks is drawn in at the end. The finished picture is the server render and the reduced-motion view.
 */

const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return Math.round((x - Math.floor(x)) * 10000) / 10000
}

// Generate organic clod shape (irregular polygon)
// Smooth but not perfect circle
const generateClodPath = (cx: number, cy: number, r: number, seed: number) => {
    const points = []
    const numPoints = 8 + Math.floor(seededRandom(seed) * 4) // 8-12 points for smoother organic feel
    const angleStep = (Math.PI * 2) / numPoints

    for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep
        // Reduced variance for "clod" look vs "shard" look
        // 0.8 to 1.1 range
        const rVar = r * (0.8 + seededRandom(seed + i) * 0.3)
        const px = cx + Math.cos(angle) * rVar
        const py = cy + Math.sin(angle) * rVar
        points.push(`${px.toFixed(2)},${py.toFixed(2)}`) // fixed precision: server and browser Math.sin/cos may differ in the last digits
    }
    // Return smooth bezier curve approximation or simple polygon?
    // Start with polygon but higher vertex count looks rounded enough at small scales
    // For "flat design" sometimes slightly rounded corners are nice, but straight lines work too.
    return `M${points.join(' L')} Z`
}

interface ClodProps {
    id: string
    type: 'outline' | 'support' | 'fill'
    cx: number
    cy: number
    path: string // Store path d
    delay: number
    variantIndex?: number
}

const U_CENTERS = [50, 150, 250]
const SURF = 45
const U_BOTTOM = 125

// The compact soil inside the future tine tracks (shown only during the animation)
const buildCompact = () => {
    const items: { cx: number; cy: number; path: string; fill: string }[] = []
    const dark = ['#3E2723', '#5D4037', '#795548']
    let seed = 9191
    for (let y = 50; y < 120; y += 9) for (let x = 0; x <= 300; x += 9) {
        const jx = x + (seededRandom(seed++) - 0.5) * 6
        const jy = y + (seededRandom(seed++) - 0.5) * 6
        const yy = Math.min(jy, U_BOTTOM - 11)
        if (!(yy >= SURF && yy < U_BOTTOM - 10 && U_CENTERS.some((c) => Math.abs(jx - c) < 25))) { seed += 2; continue }
        const rr = seededRandom(seed++)
        const v = rr > 0.6 ? 0 : rr > 0.3 ? 1 : 2
        const r = [9, 7.5, 6.5][v] + seededRandom(seed++) * 1.5
        items.push({ cx: jx, cy: jy, path: generateClodPath(jx, jy, r, seed++), fill: dark[v] })
    }
    return items
}

// ---- Timeline (s): crossfade, a still moment, the approach, crossing the plane, then the yellow U ----
const APPROACH_AT = FADE + 0.8
const APPROACH = 1.8
const CROSS = APPROACH_AT + APPROACH
const U_AT = CROSS + 0.75
const DURATION = U_AT + 1.3
const Z0 = 0.8 // how far behind the section plane the machine starts (perspective)

const HeavyCultivatorSVG = () => {
    // Draws the edge of the tine tracks once, when half of the profile is on screen
    const svgRef = useRef<SVGSVGElement>(null)
    const inView = useInView(svgRef, { once: true, amount: 0.5 })
    const uid = useId().replace(/:/g, '')
    // High Contrast Palette for Dark Website
    const darkPalette = [
        '#3E2723', // Deep Brown (retained for strongest contrast)
        '#5D4037', // Earthy Dark
        '#795548'  // lighter Brown
    ]

    // Much lighter "Light" palette to pop against dark background
    const lightPalette = [
        '#BCAAA4', // Rosy Beige
        '#D7CCC8', // Light Tan
        '#F5F5F5'  // Bone White (High brightness)
    ]

    const skyColor = '#90CAF9' // Brighter Blue
    const soilBgColor = '#A1887F' // Medium-Light Brown (Provides contrast for both dark and light clods)

    const clods = useMemo(() => {
        const items: ClodProps[] = []
        let seed = 4444
        const width = 300
        const soilSurface = 45
        const maxDepth = 145

        // U-Shapes Config
        const uCenters = [50, 150, 250]
        const uOuterWidth = 96
        const uInnerWidth = 50
        const uBottom = 125 // Slightly deeper as requested (was 115)

        const getZone = (x: number, y: number): 'outline' | 'inside' | 'outside' => {
            for (const center of uCenters) {
                const dx = Math.abs(x - center)
                const dy = y - soilSurface
                if (dy < 0) continue
                // Zone logic typically stops around uBottom
                // We want "outline" logic to potentially continue for the walls, but below uBottom is "outside" (bedrock/compact)
                // actually if we want "dark clods" everywhere below, 'outside' is fine if we handle it.

                if (dx < uInnerWidth / 2 && y < uBottom - 10) return 'inside'

                const inOuter = dx < uOuterWidth / 2
                const inInner = dx < uInnerWidth / 2
                // Bottom curve of the U
                const isBottom = (y > uBottom - 15 && y < uBottom + 10 && dx < uOuterWidth / 2)

                if ((inOuter && !inInner) || isBottom) return 'outline'
            }
            return 'outside'
        }

        // 1. RIDGES (Outline + Support)
        // We use the "Dark Palette" here.
        // 3 Variants:
        // - Large: r=8-10, Color 0
        // - Med:   r=6-7, Color 1
        // - Small: r=4-5, Color 2
        for (let y = soilSurface; y < maxDepth + 10; y += 8.3) { // Start at soilSurface to fill top gap
            for (let x = -10; x < width + 10; x += 8.3) {
                const zone = getZone(x, y)
                if (zone === 'inside') continue // handled in next pass

                // Scale jitter
                const jx = x + (seededRandom(seed++) - 0.5) * 8
                const jy = y + (seededRandom(seed++) - 0.5) * 8

                // Skip if below maxDepth (visually bounded)
                if (jy > maxDepth + 5) continue;

                // Randomly select one of the 3 dark variants
                // Bias towards Larger ones in Outline?
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

                // CRITICAL UPDATE: emphasize boundary
                // If we are in the Outline zone AND near the inner edge (the interface with the track),
                // Force the Largest, Darkest variant (0).
                if (zone === 'outline') {
                    // Check distance to nearest center
                    for (const center of uCenters) {
                        const dx = Math.abs(x - center)
                        // Inner width is 50 -> Boundary is 25.
                        // If we are between 25 and 38 (the immediate wall), force BIG/DARK.
                        if (dx >= 25 && dx <= 38 && y < uBottom + 5) {
                            variant = 0 // Force Largest/Darkest
                            r = 10 + seededRandom(seed++) * 1.5 // Ensure it's big substantial rocks
                            break
                        }
                    }
                }

                // USER REQUEST: Only the bottom of the "pits" (U-patterns) should be the darkest clods
                // Check if we are physically below a U-shape
                for (const center of uCenters) {
                    const dx = Math.abs(x - center)
                    // If we are somewhat aligned with the pit (width 50) and at the bottom depth
                    if (dx < uInnerWidth / 2 + 5 && y >= uBottom - 5 && y <= uBottom + 20) {
                        variant = 0; // Force Largest/Darkest
                        r = 10 + seededRandom(seed++) * 1.5;
                        break;
                    }
                }

                // Removed forced "large dark" block for y >= uBottom to allow natural mixed texture
                // similar to SpadingMachine bottom layer.

                if (zone === 'outline' && variant === 2) {
                    // Upgrade small ones in outer shell to medium occasionally
                    if (seededRandom(seed++) > 0.5) variant = 1
                }

                const path = generateClodPath(jx, jy, r, seed++)

                items.push({
                    id: `ridge-${items.length}`,
                    type: 'outline', // we reuse this label for darks
                    cx: jx, cy: jy, path,
                    delay: items.length * 0.001,
                    // Store variant index for coloring
                    variantIndex: variant
                })
            }
        }

        // 2. TRACKS (Fill)
        // We use the "Light Palette" here.
        // 3 Variants:
        // - Large: r=4.5-5.5, Color 0
        // - Med:   r=3.5-4.5, Color 1
        // - Small: r=2-3.5, Color 2
        for (let y = soilSurface; y < uBottom - 5; y += 6) { // Start at soilSurface
            for (let x = 10; x < width - 10; x += 6) {
                const jx = x + (seededRandom(seed++) - 0.5) * 4
                const jy = y + (seededRandom(seed++) - 0.5) * 4

                if (getZone(jx, jy) === 'inside') {
                    const rRand = seededRandom(seed++)
                    let variant = 0
                    let r = 4

                    if (rRand > 0.7) {
                        variant = 0
                        r = 4.5 + seededRandom(seed++) * 1
                    } else if (rRand > 0.3) {
                        variant = 1
                        r = 3.5 + seededRandom(seed++) * 1
                    } else {
                        variant = 2
                        r = 2 + seededRandom(seed++) * 1.5
                    }

                    const path = generateClodPath(jx, jy, r, seed++)

                    items.push({
                        id: `fill-${items.length}`,
                        type: 'fill', cx: jx, cy: jy, path,
                        delay: 0.2 + items.length * 0.001,
                        variantIndex: variant
                    })
                }
            }
        }

        return items.sort((a, b) => a.cy - b.cy)

    }, [])

    const compact = useMemo(buildCompact, [])

    const setup = useCallback((svg: SVGSVGElement) => {
        const sky = svg.querySelector('[data-sky]')!, under = svg.querySelector('[data-under]')!
        const uGroup = svg.querySelector<SVGGElement>('[data-u]')!
        const uPaths = Array.from(uGroup.querySelectorAll('path'))
        const fillNodes = Array.from(svg.querySelectorAll('[data-fill]'))
        const compactNodes = Array.from(svg.querySelectorAll('[data-compact]'))
        const fills = clods.filter((c) => c.type === 'fill').map((c, i) => ({
            n: fillNodes[i],
            cx: c.cx,
            cy: c.cy,
            tl: CROSS + 0.04 + clamp01((U_BOTTOM - c.cy) / 80) * 0.32 + (seededRandom(i * 3.7 + 1) - 0.5) * 0.1, // deeper ones first
            heave: 5 * clamp01(1 - (c.cy - SURF) / 60),
        }))
        const soil = compact.map((c, i) => ({ n: compactNodes[i], cx: c.cx, cy: c.cy, tb: CROSS - 0.06 + clamp01((U_BOTTOM - c.cy) / 80) * 0.25 }))
        const set = makeAttrSetter()
        uPaths.forEach((u) => { u.style.transition = 'none' }) // the CSS draw-in would lag behind the frames

        return (t: number) => {
            // perspective: z > 0 behind the section plane, 0 on it, < 0 in front of it (towards the viewer)
            const z = (Z0 * (CROSS - t)) / APPROACH
            const s = 1 / (1 + Math.max(-0.6, z))
            const tf = `translate(150,70) scale(${s.toFixed(4)}) translate(-150,-70)`
            const vis = clamp01((t - APPROACH_AT) / 0.6) * (1 - clamp01((t - CROSS - 0.12) / 0.5))
            const ghost = z > 0 ? 0.3 + 0.7 * clamp01(1 - z / 0.12) : 1 // inside the soil block it shows ghosted, on the plane fully
            set(sky, 'transform', tf); set(under, 'transform', tf)
            set(sky, 'opacity', vis.toFixed(2)); set(under, 'opacity', (vis * ghost).toFixed(2))
            if (t < FADE) { // crossfade from the finished profile to the compact soil
                const p = easeInOut(t / FADE)
                fills.forEach((c) => { set(c.n, 'opacity', (1 - p).toFixed(2)); set(c.n, 'transform', '') })
                soil.forEach((c) => { set(c.n, 'opacity', p.toFixed(2)); set(c.n, 'transform', '') })
                uGroup.style.opacity = (1 - p).toFixed(2)
                uPaths.forEach((u) => { u.style.strokeDashoffset = '0'; u.style.opacity = '1' })
                return
            }
            fills.forEach((c) => {
                if (t < c.tl) { set(c.n, 'opacity', '0'); return }
                const p = clamp01((t - c.tl) / 0.55), e = easeOut(p)
                set(c.n, 'opacity', p >= 1 ? '1' : Math.min(1, p * 3).toFixed(2))
                set(c.n, 'transform', p >= 1 ? '' : around(c.cx, c.cy, 0, (1 - e) * 10 - c.heave * Math.sin(Math.PI * p), 0.5 + 0.5 * e))
            })
            soil.forEach((c) => {
                const p = clamp01((t - c.tb) / 0.3), e = easeIn(p)
                if (p >= 1) { set(c.n, 'opacity', '0'); return }
                set(c.n, 'opacity', (1 - p).toFixed(2))
                set(c.n, 'transform', p <= 0 ? '' : around(c.cx, c.cy, 0, -2 * e, 1 - 0.4 * e))
            })
            uGroup.style.opacity = '1'
            uPaths.forEach((u, i) => {
                const p = easeInOut(clamp01((t - U_AT - i * 0.15) / 0.9))
                u.style.strokeDashoffset = (1 - p).toFixed(3)
                u.style.opacity = p > 0 ? '1' : '0' // the round cap would show a dot before the line starts
            })
        }
    }, [clods, compact])

    const { state, toggle, showButton } = useSoilPlayback(svgRef, DURATION, setup)

    return (
        <div className={ui.frame}>
            <svg ref={svgRef} viewBox="0 0 300 150" className={ui.svg} preserveAspectRatio="xMidYMid slice">
                <defs>
                    <clipPath id={`${uid}sky`}><rect x="-200" y="-300" width="700" height="345" /></clipPath>
                    <clipPath id={`${uid}soil`}><rect x="-200" y="45" width="700" height="400" /></clipPath>
                    {/* the cultivator from the front: one beam, three rigid tines with winged points reaching the U bottom */}
                    <g id={`${uid}machine`}>
                        <rect x="6" y="6" width="288" height="11" rx="2" fill={METAL.body} stroke={METAL.line} strokeWidth={0.8} />
                        <rect x="8" y="7.5" width="284" height="2.4" rx="1" fill={METAL.hi} opacity={0.85} />
                        {U_CENTERS.map((c) => (
                            <g key={c}>
                                <path d={`M${c - 3.6},16 L${c + 3.6},16 L${c + 3.6},106 L${c - 3.6},106 Z`} fill={METAL.body} stroke={METAL.line} strokeWidth={0.8} />
                                <rect x={c - 2.4} y="18" width="1.6" height="86" fill={METAL.hi} opacity={0.85} />
                                <rect x={c - 9} y="3" width="18" height="17" rx="2" fill={METAL.disc} stroke={METAL.line} strokeWidth={0.8} />
                                <circle cx={c - 4.5} cy="11.5" r="1.4" fill={METAL.edge} />
                                <circle cx={c + 4.5} cy="11.5" r="1.4" fill={METAL.edge} />
                                <path d={`M${c - 3.6},103 L${c + 3.6},103 L${c + 17},117 L${c + 4},120.5 L${c},124 L${c - 4},120.5 L${c - 17},117 Z`} fill={METAL.plate} stroke={METAL.line} strokeWidth={0.8} strokeLinejoin="round" />
                                <circle cx={c} cy="109" r="1.4" fill={METAL.edge} />
                            </g>
                        ))}
                    </g>
                </defs>

                {/* Flat Sky */}
                <rect x="0" y="0" width="300" height="45" fill={skyColor} />

                {/* Flat Soil Background */}
                <rect x="0" y="45" width="300" height="105" fill={soilBgColor} />

                {/* Particles: the finished profile */}
                {clods.map((item) => (
                    <path
                        key={item.id}
                        d={item.path}
                        fill={item.type === 'outline' ? darkPalette[item.variantIndex!] : lightPalette[item.variantIndex!]}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth={0.8}
                        data-fill={item.type === 'fill' ? '' : undefined}
                    />
                ))}

                {/* Compact soil in the tracks before the pass; hidden in the finished picture */}
                <g>
                    {compact.map((c, i) => (
                        <path key={i} d={c.path} fill={c.fill} stroke="rgba(0,0,0,0.3)" strokeWidth={0.8} opacity={0} data-compact="" />
                    ))}
                </g>

                {/* Edge of the loosened tine tracks: inside loose, the walls around them stay compact */}
                <g className={`${hl.walls} ${inView ? hl.drawn : ''}`} aria-hidden="true" data-u="">
                    {U_CENTERS.map((c) => (
                        <path key={c} pathLength={1} d={`M${c - 25},47 L${c - 25},106 Q${c - 25},124 ${c},124 Q${c + 25},124 ${c + 25},106 L${c + 25},47`} />
                    ))}
                </g>

                {/* The machine: above ground solid, inside the soil block ghosted until it reaches the plane */}
                <g clipPath={`url(#${uid}sky)`}><use href={`#${uid}machine`} opacity={0} data-sky="" /></g>
                <g clipPath={`url(#${uid}soil)`}><use href={`#${uid}machine`} opacity={0} data-under="" /></g>

                {/* Depth Scale */}
                <g style={{ pointerEvents: 'none' }}>
                    <line x1="292" y1="45" x2="292" y2="115" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="4,3" />
                    <rect x="268" y="32" width="28" height="14" rx="3" fill="rgba(0,0,0,0.3)" />
                    <text x="282" y="43" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle">0 cm</text>

                    {/* 30cm label moved to align with U-pattern bottom (approx 20-22cm visual depth before compaction starts) */}
                    <rect x="250" y="108" width="46" height="14" rx="3" fill="rgba(0,0,0,0.4)" />
                    <text x="273" y="119" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle">30 cm</text>
                </g>
            </svg>

            {showButton && <SoilPlayButton state={state} onClick={toggle} />}
        </div>
    )
}

export default HeavyCultivatorSVG
