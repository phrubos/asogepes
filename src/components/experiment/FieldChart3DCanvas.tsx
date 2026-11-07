'use client'

import { useState, useEffect, useRef, type CSSProperties } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Info, X } from 'lucide-react'

interface ParcelData {
    num: string
    treatment: string
    shortName: string
    /** One value per measurement date; the 2025 data uses may / jun / aug */
    values?: number[]
    may?: number
    jun?: number
    aug?: number
    rating?: number
    description?: string
    good?: boolean
}

interface FieldChart3DCanvasProps {
    parcels: ParcelData[]
    conclusions?: {
        summary: string
        bestResults: string[]
    }
    isFullscreen?: boolean
    /** Label of each measurement date (default: Május, Június, Augusztus) */
    monthLabels?: string[]
    /** Machine models after the names (known for 2025 only) */
    showMachines?: boolean
}

/*
 * "Rizotron" view (ticket 004): the field is a cut-out soil block with a glass front. The surface
 * carries plants and parcel signs, the cylinders hang from the surface into the soil, and their
 * colour says where the loose layer ends (<= 10 cm red, 10-25 cm yellow, > 25 cm green). A fixed,
 * schematic penetrometer at the left edge explains what the length means: the depth where the
 * probe reaches 20 bar. It is pushed in once when the chart opens.
 */

const DEFAULT_MONTHS = ['Május', 'Június', 'Augusztus']

type Zone = 'red' | 'yellow' | 'green'
const ZONE_HEX: Record<Zone, number> = { red: 0xd0563f, yellow: 0xe2b93b, green: 0x74ad5c }
const ZONE_CSS: Record<Zone, string> = { red: '#d0563f', yellow: '#e2b93b', green: '#74ad5c' }
const ZONE_TEXT: Record<Zone, string> = {
    red: '10 cm-en belül tömör',
    yellow: '10–25 cm között tömörödik',
    green: '25 cm alatt is laza',
}
const zoneOf = (cm: number): Zone => (cm <= 10 ? 'red' : cm <= 25 ? 'yellow' : 'green')
const fmtCm = (v: number) => (Math.round(v * 10) / 10).toString().replace('.', ',')

const S = 0.1          // scene units per cm
const BLOCK_CM = 56    // depth of the soil block
const SPACING = 4.5    // parcel spacing
const MONTH_Z = [1.1, -0.6, -2.3]
const Z_FRONT = 2.2
const Z_BACK = -3.4
const CYL_R = 0.4
const PEN_CM = 30      // where the schematic probe rests
const GAUGE_MAX = 20   // bar
const PSI_PER_BAR = 14.5038

interface Selection { p: number; m: number }

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
}

function canvasTexture(c: HTMLCanvasElement) {
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
}

interface LabelOpts {
    w?: number; h?: number; bg?: string | null; border?: string; color?: string; subColor?: string
    size?: number; sub?: number; scale?: number; font?: string
}
function makeLabel(lines: string[], o: LabelOpts = {}) {
    const w = o.w ?? 256, h = o.h ?? 96, size = o.size ?? 34, sub = o.sub ?? 22, scale = o.scale ?? 1.6
    const font = o.font ?? 'Inter, system-ui, sans-serif'
    const c = document.createElement('canvas')
    c.width = w * 2
    c.height = h * 2
    const x = c.getContext('2d')!
    x.scale(2, 2)
    if (o.bg !== null) {
        rrect(x, 3, 3, w - 6, h - 6, 14)
        x.fillStyle = o.bg ?? 'rgba(20,17,14,0.92)'
        x.fill()
        x.lineWidth = 2
        x.strokeStyle = o.border ?? 'rgba(255,255,255,0.18)'
        x.stroke()
    }
    x.textAlign = 'center'
    x.textBaseline = 'middle'
    const sizes = lines.map((_, i) => (i === 0 ? size : sub))
    const total = sizes.reduce((a, b) => a + b * 1.2, 0)
    let y = h / 2 - total / 2
    lines.forEach((t, i) => {
        x.font = `${i === 0 ? 600 : 500} ${sizes[i]}px ${font}`
        x.fillStyle = i === 0 ? (o.color ?? '#f3ece2') : (o.subColor ?? '#b5a99a')
        y += sizes[i] * 0.6
        x.fillText(t, w / 2, y)
        y += sizes[i] * 0.6
    })
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: canvasTexture(c), depthWrite: false }))
    sp.scale.set(scale, (scale * h) / w, 1)
    sp.renderOrder = 10
    return sp
}

function soilTexture(w: number, h: number, vertical: boolean) {
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    const x = c.getContext('2d')!
    if (vertical) {
        const g = x.createLinearGradient(0, 0, 0, h)
        g.addColorStop(0, '#3a2716')
        g.addColorStop(0.45, '#4a3420')
        g.addColorStop(1, '#5c4329')
        x.fillStyle = g
    } else {
        x.fillStyle = '#3d2918'
    }
    x.fillRect(0, 0, w, h)
    for (let i = 0; i < (w * h) / 40; i++) {
        const r = Math.random()
        x.fillStyle = r < 0.4 ? 'rgba(30,20,10,0.55)' : r < 0.8 ? 'rgba(110,84,56,0.35)' : 'rgba(170,150,120,0.35)'
        x.beginPath()
        x.ellipse(Math.random() * w, Math.random() * h, Math.random() * 2.4 + 0.5, Math.random() * 1.6 + 0.4, Math.random() * 3, 0, Math.PI * 2)
        x.fill()
    }
    const t = canvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    return t
}

/** Dial after the Imants penetrometer gauge: chrome bezel, colour band, psi outside, bar inside */
function makeGauge(R: number) {
    const N = 512
    const c = document.createElement('canvas')
    c.width = N
    c.height = N
    const tex = canvasTexture(c)
    tex.anisotropy = 8
    const face = new THREE.Mesh(new THREE.CircleGeometry(R * 0.93, 64), new THREE.MeshBasicMaterial({ map: tex }))
    const draw = (bar: number) => {
        const x = c.getContext('2d')!
        const cx = N / 2, cy = N / 2
        const a0 = Math.PI * 0.75, sweep = Math.PI * 1.5
        const ang = (b: number) => a0 + sweep * (b / GAUGE_MAX)
        const at = (a: number, r: number): [number, number] => [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
        x.clearRect(0, 0, N, N)
        x.beginPath(); x.arc(cx, cy, N / 2, 0, Math.PI * 2); x.fillStyle = '#f7f5f0'; x.fill()
        x.lineWidth = 20
        ;([[0, 14, '#3f8f3a'], [14, 18, '#e3c12b'], [18, 20, '#c62828']] as const).forEach(([a, b, col]) => {
            x.strokeStyle = col; x.beginPath(); x.arc(cx, cy, 232, ang(a), ang(b)); x.stroke()
        })
        const psiMax = GAUGE_MAX * PSI_PER_BAR
        x.strokeStyle = '#111'; x.fillStyle = '#111'; x.textAlign = 'center'; x.textBaseline = 'middle'
        for (let p = 0; p <= psiMax; p += 5) {
            const a = ang(p / PSI_PER_BAR), major = p % 50 === 0, mid = p % 10 === 0
            const [x1, y1] = at(a, 214), [x2, y2] = at(a, major ? 190 : mid ? 199 : 205)
            x.lineWidth = major ? 4 : mid ? 2.2 : 1.4
            x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke()
            if (major) { x.font = '500 24px Inter, Arial, sans-serif'; const [tx, ty] = at(a, 166); x.fillText(String(p), tx, ty) }
        }
        x.strokeStyle = '#b3261e'; x.fillStyle = '#b3261e'
        x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, 140, ang(0), ang(GAUGE_MAX)); x.stroke()
        for (let b = 0; b <= GAUGE_MAX; b++) {
            const a = ang(b), major = b % 5 === 0
            const [x1, y1] = at(a, 140), [x2, y2] = at(a, major ? 120 : 129)
            x.lineWidth = major ? 4 : 2
            x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke()
            if (major) { x.font = '600 28px Inter, Arial, sans-serif'; const [tx, ty] = at(a, 96); x.fillText(String(b), tx, ty) }
        }
        x.font = '500 30px Inter, Arial, sans-serif'; x.fillStyle = '#111'; x.fillText('psi', cx, cy - 72)
        x.fillStyle = '#b3261e'; x.fillText('bar', cx, cy - 40)
        x.fillStyle = '#1f6fb2'; x.font = '700 50px Inter, Arial, sans-serif'; x.fillText('imants', cx, cy + 116)
        x.fillStyle = '#111'; x.font = '700 19px Inter, Arial, sans-serif'; x.fillText('PENETROMETER', cx, cy + 150)
        x.font = '700 15px Inter, Arial, sans-serif'; x.fillText('WWW.IMANTS.COM', cx, cy + 178)
        const a = ang(Math.max(0, Math.min(bar, GAUGE_MAX)))
        x.save(); x.translate(cx, cy); x.rotate(a)
        x.fillStyle = '#111'
        x.beginPath(); x.moveTo(205, 0); x.lineTo(0, -6); x.lineTo(-50, -14); x.quadraticCurveTo(-78, 0, -50, 14); x.lineTo(0, 6); x.closePath(); x.fill()
        x.restore()
        x.beginPath(); x.arc(cx, cy, 18, 0, Math.PI * 2); x.fillStyle = '#111'; x.fill()
        x.beginPath(); x.arc(cx - 4, cy - 4, 5, 0, Math.PI * 2); x.fillStyle = '#555'; x.fill()
        tex.needsUpdate = true
    }
    draw(0)
    return { face, draw }
}

function makePenetrometer() {
    const g = new THREE.Group()
    const steel = new THREE.MeshStandardMaterial({ color: 0xcfccc6, metalness: 0.7, roughness: 0.3 })
    const chrome = new THREE.MeshStandardMaterial({ color: 0xe6e6e6, metalness: 0.75, roughness: 0.22 })
    const brass = new THREE.MeshStandardMaterial({ color: 0xc19a3e, metalness: 0.7, roughness: 0.35 })
    const dark = new THREE.MeshStandardMaterial({ color: 0x2f2b27, metalness: 0.4, roughness: 0.5 })
    const ROD = 4.8, R = 0.85
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, ROD, 12), steel)
    rod.position.y = ROD / 2 + 0.2
    g.add(rod)
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 16), steel)
    cone.rotation.x = Math.PI
    cone.position.y = 0.11
    g.add(cone)
    const fit = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.3, 6), brass)
    fit.position.y = ROD + 0.35
    g.add(fit)
    const gy = ROD + 0.5 + R
    const caseM = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.3, 48), chrome)
    caseM.rotation.x = Math.PI / 2
    caseM.position.y = gy
    g.add(caseM)
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(R * 0.96, 0.06, 12, 64), chrome)
    bezel.position.set(0, gy, 0.15)
    g.add(bezel)
    const gauge = makeGauge(R)
    gauge.face.position.set(0, gy, 0.152)
    g.add(gauge.face)
    // T-handle left to right, so the T faces the viewer
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 12), steel)
    stem.position.y = gy + R + 0.17
    g.add(stem)
    const hy = gy + R + 0.38
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 2.2, 12), steel)
    bar.rotation.z = Math.PI / 2
    bar.position.y = hy
    g.add(bar)
    ;[-1, 1].forEach((s) => {
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.6, 16), dark)
        grip.rotation.z = Math.PI / 2
        grip.position.set(s * 0.82, hy, 0)
        g.add(grip)
    })
    return { group: g, draw: gauge.draw }
}

export default function FieldChart3DCanvas({ parcels, conclusions, isFullscreen = false, monthLabels = DEFAULT_MONTHS, showMachines = true }: FieldChart3DCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const keysPressed = useRef<{ [key: string]: boolean }>({})
    const [showInfo, setShowInfo] = useState(false)
    // nothing selected at first: the card would cover the model on phones; it appears on tap
    const [sel, setSel] = useState<Selection | null>(null)
    const selectRef = useRef<(s: Selection | null) => void>(() => {})

    const valuesOf = (p: ParcelData) => (p.values ?? [p.may ?? 0, p.jun ?? 0, p.aug ?? 0]).slice(0, 3)

    useEffect(() => {
        if (!containerRef.current) return
        const container = containerRef.current
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#161310')

        const camera = new THREE.PerspectiveCamera(40, container.clientWidth / Math.max(1, container.clientHeight), 0.5, 150)
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        container.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.08
        controls.minPolarAngle = 0.25
        controls.maxPolarAngle = 2.3 // a little below the surface: peeking at the cylinders from under
        controls.minDistance = 6
        controls.maxDistance = 70

        const placeCamera = () => {
            const aspect = container.clientWidth / Math.max(1, container.clientHeight)
            // fit the width: block + depth scale + date labels (~37 units) fill ~85% of the view (user, 2026-11-07)
            const halfW = 18.5
            const fit = halfW / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect) / 0.85
            const dist = Math.min(68, Math.max(24, fit)) * (isFullscreen ? 0.92 : 1)
            const t = new THREE.Vector3(-0.6, -1.8, -0.6)
            const dir = new THREE.Vector3(-6.5, 3.6, 27).sub(t).normalize()
            camera.position.copy(t).addScaledVector(dir, dist)
            controls.target.copy(t)
            controls.update()
        }

        // lights (r155+ physical intensities)
        scene.add(new THREE.HemisphereLight(0xfff1dc, 0x2a1e14, 1.9))
        const sun = new THREE.DirectionalLight(0xfff3e0, 2.8)
        sun.position.set(8, 20, 14)
        scene.add(sun)
        const under = new THREE.DirectionalLight(0xffd9a8, 1.1)
        under.position.set(-6, -12, 10)
        scene.add(under)

        const nP = parcels.length
        const startX = -((nP - 1) * SPACING) / 2
        const W = (nP - 1) * SPACING + 4.4
        const xL = -W / 2, xR = W / 2, yB = -BLOCK_CM * S
        const depth = Z_FRONT - Z_BACK
        const zMid = (Z_FRONT + Z_BACK) / 2

        // back wall, floor and side walls: soil profile
        const wallTex = soilTexture(1024, 256, true)
        const back = new THREE.Mesh(new THREE.PlaneGeometry(W, BLOCK_CM * S), new THREE.MeshStandardMaterial({ map: wallTex, roughness: 1 }))
        back.position.set(0, yB / 2, Z_BACK)
        scene.add(back)
        const floorTex = soilTexture(512, 128, false)
        floorTex.repeat.set(3, 1)
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, depth), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 1, color: 0x8c7a66 }))
        floor.rotation.x = -Math.PI / 2
        floor.position.set(0, yB, zMid)
        scene.add(floor)
        ;[xL, xR].forEach((x) => {
            const side = new THREE.Mesh(
                new THREE.PlaneGeometry(depth, BLOCK_CM * S),
                new THREE.MeshStandardMaterial({ map: wallTex, roughness: 1, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false })
            )
            side.rotation.y = Math.PI / 2
            side.position.set(x, yB / 2, zMid)
            scene.add(side)
        })

        // soil grains inside the block: the "you are looking into soil" cue
        const nG = 4200
        const gPos = new Float32Array(nG * 3), gCol = new Float32Array(nG * 3)
        const tmpC = new THREE.Color()
        for (let i = 0; i < nG; i++) {
            gPos[i * 3] = xL + Math.random() * W
            gPos[i * 3 + 1] = yB + Math.random() * -yB
            gPos[i * 3 + 2] = Z_BACK + Math.random() * depth
            tmpC.setHSL(0.08, 0.35 + Math.random() * 0.2, 0.22 + Math.random() * 0.18)
            gCol[i * 3] = tmpC.r; gCol[i * 3 + 1] = tmpC.g; gCol[i * 3 + 2] = tmpC.b
        }
        const gGeo = new THREE.BufferGeometry()
        gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3))
        gGeo.setAttribute('color', new THREE.BufferAttribute(gCol, 3))
        scene.add(new THREE.Points(gGeo, new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false })))

        // glass front and the block's edges
        const glass = new THREE.Mesh(
            new THREE.PlaneGeometry(W, BLOCK_CM * S),
            new THREE.MeshBasicMaterial({ color: 0xdfe8d8, transparent: true, opacity: 0.045, depthWrite: false, side: THREE.DoubleSide })
        )
        glass.position.set(0, yB / 2, Z_FRONT)
        scene.add(glass)
        const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.BoxGeometry(W, BLOCK_CM * S, depth)),
            new THREE.LineBasicMaterial({ color: 0xd4a84b, transparent: true, opacity: 0.35 })
        )
        edges.position.set(0, yB / 2, zMid)
        scene.add(edges)

        // surface: opaque, pushed back in depth so the rings on it never flicker
        const topTex = soilTexture(512, 512, false)
        topTex.repeat.set(6, 1.2)
        const top = new THREE.Mesh(
            new THREE.PlaneGeometry(W, depth),
            new THREE.MeshStandardMaterial({ map: topTex, roughness: 1, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })
        )
        top.rotation.x = -Math.PI / 2
        top.position.set(0, 0, zMid)
        scene.add(top)
        const surfLine = new THREE.Mesh(new THREE.BoxGeometry(W + 0.02, 0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0x9fcf7a }))
        surfLine.position.set(0, 0, Z_FRONT)
        scene.add(surfLine)

        // crop on the surface
        const blade = new THREE.ConeGeometry(0.035, 0.55, 3)
        blade.translate(0, 0.27, 0)
        const nB = 1700
        const plants = new THREE.InstancedMesh(blade, new THREE.MeshStandardMaterial({ color: 0x6e9a45, roughness: 0.8 }), nB)
        const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), p3 = new THREE.Vector3()
        for (let i = 0; i < nB; i++) {
            p3.set(xL + 0.2 + Math.random() * (W - 0.4), 0, Z_BACK + 0.15 + Math.random() * (depth - 0.3))
            e.set((Math.random() - 0.5) * 0.5, Math.random() * 6, (Math.random() - 0.5) * 0.5)
            q.setFromEuler(e)
            sc.set(1, 0.6 + Math.random() * 0.8, 1)
            m4.compose(p3, q, sc)
            plants.setMatrixAt(i, m4)
        }
        scene.add(plants)

        // depth scale with the colour zones, boundary lines at 10 and 25 cm
        const rx = xL - 0.7
        ;([[0, 10, ZONE_HEX.red], [10, 25, ZONE_HEX.yellow], [25, BLOCK_CM, ZONE_HEX.green]] as const).forEach(([a, b, col]) => {
            const seg = new THREE.Mesh(new THREE.BoxGeometry(0.28, (b - a) * S, 0.12), new THREE.MeshBasicMaterial({ color: col }))
            seg.position.set(rx, -((a + b) / 2) * S, Z_FRONT)
            scene.add(seg)
        })
        ;[0, 10, 25, 50].forEach((cm) => {
            const l = makeLabel([cm === 0 ? 'felszín' : `${cm} cm`], { w: 200, h: 64, bg: null, size: 34, scale: 1.8 })
            l.position.set(rx - 1.15, -cm * S, Z_FRONT)
            scene.add(l)
        })
        ;([[10, ZONE_HEX.red], [25, ZONE_HEX.yellow]] as const).forEach(([cm, col]) => {
            const front = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(xL, -cm * S, Z_FRONT), new THREE.Vector3(xR, -cm * S, Z_FRONT)]),
                new THREE.LineDashedMaterial({ color: col, dashSize: 0.25, gapSize: 0.18, transparent: true, opacity: 0.7 })
            )
            front.computeLineDistances()
            scene.add(front)
            scene.add(new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(xL, -cm * S, Z_BACK + 0.01), new THREE.Vector3(xR, -cm * S, Z_BACK + 0.01)]),
                new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.35 })
            ))
        })

        const machineOf = (num: string, treatment: string) => {
            if (!showMachines || !treatment.toLowerCase().includes('ásógép')) return ''
            if (num === 'I.') return ' (40SX)'
            if (['II.', 'III.', 'VI.', 'VII.'].includes(num)) return ' (38SX)'
            return ''
        }

        // parcels
        const pickables: THREE.Mesh[] = []
        parcels.forEach((parcel, i) => {
            const x = startX + i * SPACING
            const best = conclusions?.bestResults.includes(parcel.num) ?? false
            if (i < nP - 1) {
                const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, depth), new THREE.MeshStandardMaterial({ color: 0x2b1b0e }))
                ridge.position.set(x + SPACING / 2, 0.03, zMid)
                scene.add(ridge)
            }
            // parcel sign on a stake at the back
            const sz = Z_BACK + 0.25
            const stake = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.3, 0.08), new THREE.MeshStandardMaterial({ color: 0x8a6a45 }))
            stake.position.set(x, 0.65, sz)
            scene.add(stake)
            const words = (parcel.treatment + machineOf(parcel.num, parcel.treatment)).split(' + ')
            const lines = [
                parcel.num + (best ? ' ★' : ''),
                words.length > 2 ? words.slice(0, 2).join(' + ') + ' +' : words.join(' + '),
                ...(words.length > 2 ? [words.slice(2).join(' + ')] : []),
            ]
            const sign = makeLabel(lines, {
                w: 300, h: words.length > 2 ? 150 : 120, size: 40, sub: 21, scale: 3.4,
                color: best ? '#d4a84b' : '#f3ece2',
                border: best ? 'rgba(212,168,75,0.7)' : 'rgba(255,255,255,0.2)',
                bg: 'rgba(30,25,20,0.95)',
                font: 'Fraunces, Georgia, serif',
            })
            sign.position.set(x, 1.3 + (words.length > 2 ? 0.85 : 0.68), sz)
            scene.add(sign)

            valuesOf(parcel).forEach((cm, m) => {
                const cz = MONTH_Z[m]
                const h = Math.max(0.05, cm * S)
                const zone = zoneOf(cm)
                const mat = new THREE.MeshStandardMaterial({ color: ZONE_HEX[zone], roughness: 0.45, metalness: 0.05, emissive: ZONE_HEX[zone], emissiveIntensity: 0.08 })
                // open-ended: a cap in the surface plane would flicker against it; the dark plate closes the bottom
                const cyl = new THREE.Mesh(new THREE.CylinderGeometry(CYL_R, CYL_R, h, 36, 1, true), mat)
                cyl.position.set(x, -h / 2, cz)
                cyl.userData = { p: i, m }
                scene.add(cyl)
                pickables.push(cyl)
                const plate = new THREE.Mesh(new THREE.CylinderGeometry(CYL_R * 1.45, CYL_R * 1.45, 0.06, 36), new THREE.MeshStandardMaterial({ color: 0x2a1d12, roughness: 1 }))
                plate.position.set(x, -h - 0.03, cz)
                scene.add(plate)
                const ring = new THREE.Mesh(
                    new THREE.RingGeometry(CYL_R * 1.05, CYL_R * 1.3, 36),
                    new THREE.MeshBasicMaterial({ color: ZONE_HEX[zone], side: THREE.DoubleSide, transparent: true, opacity: 0.85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })
                )
                ring.rotation.x = -Math.PI / 2
                ring.position.set(x, 0.03, cz)
                ring.renderOrder = 2
                scene.add(ring)
                const tag = makeLabel([`${fmtCm(cm)} cm`], { w: 170, h: 60, size: 32, scale: 1.25, border: ZONE_CSS[zone] })
                tag.position.set(x, -h - 0.45, cz)
                scene.add(tag)
            })
        })

        // measurement dates on the right edge
        monthLabels.slice(0, 3).forEach((label, m) => {
            const l = makeLabel([label], { w: 220, h: 64, size: 28, scale: 2.1, color: '#d4a84b', border: 'rgba(212,168,75,0.4)', bg: 'rgba(212,168,75,0.12)' })
            l.position.set(xR + 1.5, 0.3, MONTH_Z[m])
            scene.add(l)
        })

        // schematic penetrometer at the left edge, pushed in once when the chart opens
        const pen = makePenetrometer()
        const penRestY = -PEN_CM * S
        pen.group.position.set(xL + 0.85, reduced ? penRestY : 0, Z_FRONT - 0.3)
        pen.draw(reduced ? GAUGE_MAX : 0)
        scene.add(pen.group)
        let intro: { t0: number; dur: number } | null = reduced ? null : { t0: performance.now() + 600, dur: 2200 }

        // selection: highlight one cylinder, the card shows its value
        selectRef.current = (s) => {
            pickables.forEach((c) => {
                const on = !!s && c.userData.p === s.p && c.userData.m === s.m
                ;(c.material as THREE.MeshStandardMaterial).emissiveIntensity = on ? 0.45 : 0.08
            })
            setSel(s)
        }
        setSel(null)

        const ray = new THREE.Raycaster()
        const ndc = new THREE.Vector2()
        const pick = (ev: PointerEvent) => {
            const r = renderer.domElement.getBoundingClientRect()
            ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1)
            ray.setFromCamera(ndc, camera)
            const hit = ray.intersectObjects(pickables, false)
            return hit.length ? (hit[0].object as THREE.Mesh) : null
        }
        let down: [number, number] | null = null
        const onDown = (ev: PointerEvent) => { down = [ev.clientX, ev.clientY] }
        const onUp = (ev: PointerEvent) => {
            if (!down || Math.hypot(ev.clientX - down[0], ev.clientY - down[1]) > 6) return
            const hit = pick(ev)
            // a tap beside the cylinders closes the card
            selectRef.current(hit ? (hit.userData as Selection) : null)
        }
        const onMove = (ev: PointerEvent) => {
            if (ev.pointerType === 'mouse') renderer.domElement.style.cursor = pick(ev) ? 'pointer' : 'grab'
        }
        renderer.domElement.addEventListener('pointerdown', onDown)
        renderer.domElement.addEventListener('pointerup', onUp)
        renderer.domElement.addEventListener('pointermove', onMove)

        placeCamera()

        // WASD movement
        const MOVEMENT_SPEED = 0.5
        const handleKeyDown = (ev: KeyboardEvent) => { keysPressed.current[ev.key.toLowerCase()] = true }
        const handleKeyUp = (ev: KeyboardEvent) => { keysPressed.current[ev.key.toLowerCase()] = false }
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        const forward = new THREE.Vector3(), right = new THREE.Vector3(), move = new THREE.Vector3()

        let animationId = 0
        const animate = () => {
            animationId = requestAnimationFrame(animate)
            const k = keysPressed.current
            if (k['w'] || k['a'] || k['s'] || k['d']) {
                camera.getWorldDirection(forward)
                forward.y = 0
                forward.normalize()
                right.crossVectors(forward, camera.up).normalize()
                move.set(0, 0, 0)
                if (k['w']) move.add(forward)
                if (k['s']) move.sub(forward)
                if (k['d']) move.add(right)
                if (k['a']) move.sub(right)
                if (move.lengthSq() > 0) {
                    move.normalize().multiplyScalar(MOVEMENT_SPEED)
                    camera.position.add(move)
                    controls.target.add(move)
                }
            }
            if (intro) {
                const t = Math.max(0, Math.min(1, (performance.now() - intro.t0) / intro.dur))
                const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
                pen.group.position.y = penRestY * ease
                // resistance stays low in the loose layer and climbs steeply at the end
                pen.draw(GAUGE_MAX * Math.pow(ease, 3))
                if (t >= 1) intro = null
            }
            controls.update()
            renderer.render(scene, camera)
        }
        animate()

        const resizeObserver = new ResizeObserver(() => {
            const w = container.clientWidth, h = container.clientHeight
            if (!w || !h) return
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h)
        })
        resizeObserver.observe(container)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            renderer.domElement.removeEventListener('pointerdown', onDown)
            renderer.domElement.removeEventListener('pointerup', onUp)
            renderer.domElement.removeEventListener('pointermove', onMove)
            cancelAnimationFrame(animationId)
            resizeObserver.disconnect()
            controls.dispose()
            scene.traverse((o) => {
                const mesh = o as THREE.Mesh
                if (mesh.geometry) mesh.geometry.dispose()
                const mats = mesh.material ? ([] as THREE.Material[]).concat(mesh.material) : []
                mats.forEach((mt) => {
                    const map = (mt as THREE.MeshBasicMaterial).map
                    if (map) map.dispose()
                    mt.dispose()
                })
            })
            renderer.dispose()
            if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parcels, conclusions, isFullscreen, monthLabels, showMachines])

    // Prevent page scroll when the wheel is used over the 3D canvas
    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const preventScroll = (ev: WheelEvent) => {
            ev.preventDefault()
            ev.stopPropagation()
        }
        container.addEventListener('wheel', preventScroll, { passive: false })
        return () => container.removeEventListener('wheel', preventScroll)
    }, [])

    const selParcel = sel ? parcels[sel.p] : undefined
    const selValue = sel && selParcel ? valuesOf(selParcel)[sel.m] : undefined
    const selZone = selValue !== undefined ? zoneOf(selValue) : 'green'

    const panel: CSSProperties = {
        background: 'rgba(26, 23, 20, 0.88)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px', borderRadius: '12px', overflow: 'hidden' }}>
            {/* absolute: a % height resolves to 0 when the embedding parent has no fixed height */}
            <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

            {/* Selected cylinder */}
            {/* Tapped cylinder: a slim strip at the bottom, hidden while the legend is open */}
            {sel && selParcel && selValue !== undefined && !showInfo && (
                <div
                    aria-live="polite"
                    style={{ ...panel, position: 'absolute', bottom: '16px', left: '16px', right: '16px', marginInline: 'auto', zIndex: 10, padding: '8px 14px', maxWidth: '460px', pointerEvents: 'none', display: 'grid', gap: '2px' }}
                >
                    <span style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 600, fontSize: '15px', color: '#f3ece2' }}>
                        {selParcel.num} parcella · {monthLabels[sel.m]} <span style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontWeight: 400, fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>· {selParcel.treatment}</span>
                    </span>
                    <span style={{ fontSize: '14px', color: '#f3ece2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: ZONE_CSS[selZone], flex: 'none' }} />
                        Laza réteg: {fmtCm(selValue)} cm · {ZONE_TEXT[selZone]}
                    </span>
                </div>
            )}

            {/* Info toggle - hidden in fullscreen (the page header has the legend) */}
            {!isFullscreen && (
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    aria-label={showInfo ? 'Jelmagyarázat elrejtése' : 'Jelmagyarázat mutatása'}
                    aria-expanded={showInfo}
                    style={{
                        position: 'absolute', top: '16px', left: '16px', zIndex: 20,
                        background: 'rgba(26, 23, 20, 0.8)', border: '1px solid rgba(212, 168, 75, 0.3)', borderRadius: '50%',
                        width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#d4a84b', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    {showInfo ? <X size={20} /> : <Info size={20} />}
                </button>
            )}

            {/* Legend */}
            {(!isFullscreen && showInfo) && (
                <div style={{ ...panel, position: 'absolute', bottom: '16px', left: '16px', right: '16px', maxWidth: '420px', pointerEvents: 'none', zIndex: 10, padding: '12px 16px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', display: 'grid', gap: '8px' }}>
                    <span>A henger a felszíntől a tömör rétegig ér: ott éri el a penetrométer a 20 bart.</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
                        {(['red', 'yellow', 'green'] as Zone[]).map((z) => (
                            <span key={z} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: ZONE_CSS[z] }} />
                                {z === 'red' ? '≤ 10 cm' : z === 'yellow' ? '10–25 cm' : '> 25 cm'}
                            </span>
                        ))}
                        {(conclusions?.bestResults.length ?? 0) > 0 && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ color: '#d4a84b' }}>★</span> Legnagyobb hatékonyság
                            </span>
                        )}
                    </div>
                    <span style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                        Bal klikk: forgatás · Jobb klikk: mozgatás · Görgő: zoom · Kattintás egy hengerre: érték
                    </span>
                </div>
            )}
        </div>
    )
}
