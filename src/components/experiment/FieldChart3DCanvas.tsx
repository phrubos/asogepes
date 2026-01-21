'use client'

import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Rotate3d, Info, X, Eye, EyeOff } from 'lucide-react'

interface ParcelData {
    num: string
    treatment: string
    shortName: string
    may: number
    jun: number
    aug: number
    rating: number
    description: string
    good: boolean
}

interface FieldChart3DCanvasProps {
    parcels: ParcelData[]
    conclusions?: {
        summary: string
        bestResults: string[]
    }
    isFullscreen?: boolean
}

export default function FieldChart3DCanvas({ parcels, conclusions, isFullscreen = false }: FieldChart3DCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const keysPressed = useRef<{ [key: string]: boolean }>({})
    const [showInfo, setShowInfo] = useState(false)

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const width = container.clientWidth
        const height = container.clientHeight

        // Scene - matching 2D design dark brown background
        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#1a1714')

        // Camera - Zoomed out, looking from above-front
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)

        // Adjust camera based on fullscreen mode
        if (isFullscreen) {
            // Zoomed IN for fullscreen details, but ensuring Roman numerals are visible
            camera.position.set(0, 12, 17)
        } else {
            // Default zoomed out view - corrected to prevent clipping
            camera.position.set(0, 16, 26)
        }

        camera.lookAt(0, 0, 0) // Look at center

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)
        container.appendChild(renderer.domElement)
        rendererRef.current = renderer

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.maxPolarAngle = Math.PI / 2 - 0.05 // Don't go below ground
        controls.minPolarAngle = 0.3

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xfff5e6, 1.0)
        directionalLight.position.set(15, 25, 10)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        const fillLight = new THREE.DirectionalLight(0x8ec8ff, 0.4)
        fillLight.position.set(-10, -10, -10) // Light from below to illuminate depth
        scene.add(fillLight)

        // Create procedural soil texture
        const createSoilTexture = (variation: number = 0) => {
            const canvas = document.createElement('canvas')
            canvas.width = 512
            canvas.height = 512
            const ctx = canvas.getContext('2d')!

            // Base soil color - rich brown
            const baseColors = ['#3d2817', '#3a2515', '#402a19', '#352213', '#3c2716']
            ctx.fillStyle = baseColors[variation % baseColors.length]
            ctx.fillRect(0, 0, 512, 512)

            // Add soil texture variation
            for (let i = 0; i < 8000; i++) {
                const x = Math.random() * 512
                const y = Math.random() * 512
                const size = Math.random() * 4 + 1
                const shade = Math.random()

                if (shade < 0.3) {
                    ctx.fillStyle = `rgba(61, 40, 23, ${Math.random() * 0.8})`
                } else if (shade < 0.6) {
                    ctx.fillStyle = `rgba(79, 55, 35, ${Math.random() * 0.6})`
                } else if (shade < 0.85) {
                    ctx.fillStyle = `rgba(45, 30, 15, ${Math.random() * 0.7})`
                } else {
                    ctx.fillStyle = `rgba(100, 85, 70, ${Math.random() * 0.5})`
                }

                ctx.beginPath()
                ctx.ellipse(x, y, size, size * 0.7, Math.random() * Math.PI, 0, Math.PI * 2)
                ctx.fill()
            }

            // Furrows
            ctx.strokeStyle = 'rgba(30, 20, 10, 0.4)'
            ctx.lineWidth = 2
            for (let i = 0; i < 512; i += 16) {
                ctx.beginPath()
                ctx.moveTo(0, i + Math.random() * 4)
                for (let x = 0; x < 512; x += 20) {
                    ctx.lineTo(x, i + Math.sin(x * 0.05) * 2 + Math.random() * 2)
                }
                ctx.stroke()
            }

            return new THREE.CanvasTexture(canvas)
        }

        const soilTexture = createSoilTexture()
        soilTexture.wrapS = THREE.RepeatWrapping
        soilTexture.wrapT = THREE.RepeatWrapping
        soilTexture.repeat.set(4, 4)

        // transparent ground plane - The "Surface"
        const groundGeometry = new THREE.PlaneGeometry(35, 18) // Increased depth to cover back area
        const groundMaterial = new THREE.MeshStandardMaterial({
            map: soilTexture,
            roughness: 0.95,
            metalness: 0.0,
            bumpMap: soilTexture,
            bumpScale: 0.05,
            transparent: true,
            opacity: 0.25, // Semi-transparent to see depth
            side: THREE.DoubleSide
        })
        const ground = new THREE.Mesh(groundGeometry, groundMaterial)
        ground.rotation.x = -Math.PI / 2
        ground.position.y = 0
        ground.position.z = -4 // Shifted further back to provide background behind parcels
        ground.receiveShadow = true
        scene.add(ground)

        // Colors matching 2D design
        const looseColor = 0x81C784
        const looseColorDark = 0x4a6741

        // Helper to get machine type text
        const getMachineType = (parcelNum: string, treatment: string) => {
            if (treatment.toLowerCase().includes('ásógép')) {
                if (parcelNum === 'I.') return ' (40SX)'
                if (['II.', 'III.', 'VI.', 'VII.'].includes(parcelNum)) return ' (38SX)'
            }
            return ''
        }

        // Calculate spacing
        const spacingX = 4.5
        const parcelWidth = 3.8
        const parcelDepth = 8
        const totalWidth = (parcels.length - 1) * spacingX
        const startX = -totalWidth / 2

        // Create individual parcels
        parcels.forEach((parcel, index) => {
            const xPos = startX + index * spacingX
            const isBest = conclusions?.bestResults.includes(parcel.num) || false

            const parcelSoilTexture = createSoilTexture(index)
            parcelSoilTexture.wrapS = THREE.RepeatWrapping
            parcelSoilTexture.wrapT = THREE.RepeatWrapping
            parcelSoilTexture.repeat.set(1, 2)

            // Transparent Parcel Strip
            const parcelGeometry = new THREE.PlaneGeometry(parcelWidth, parcelDepth)
            const parcelMaterial = new THREE.MeshStandardMaterial({
                map: parcelSoilTexture,
                roughness: 0.9,
                metalness: 0.0,
                bumpMap: parcelSoilTexture,
                bumpScale: 0.03,
                transparent: true,
                opacity: 0.35, // Slightly more visible than background
                side: THREE.DoubleSide
            })
            const parcelGround = new THREE.Mesh(parcelGeometry, parcelMaterial)
            parcelGround.rotation.x = -Math.PI / 2
            // Parcel Ground - Shifted North
            parcelGround.position.set(xPos, 0.01, -5)
            scene.add(parcelGround)

            // Add border/edge around each parcel
            const borderGeometry = new THREE.PlaneGeometry(parcelWidth + 0.3, parcelDepth + 0.3)
            const borderMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a0f08,
                roughness: 1.0,
                metalness: 0.0,
                transparent: true,
                opacity: 0.2
            })
            const border = new THREE.Mesh(borderGeometry, borderMaterial)
            border.rotation.x = -Math.PI / 2
            border.position.set(xPos, 0.005, -5)
            scene.add(border)

            // Edge markers (ridges)
            if (index < parcels.length - 1) {
                const ridgeGeometry = new THREE.BoxGeometry(0.15, 0.05, parcelDepth)
                const ridgeMaterial = new THREE.MeshStandardMaterial({
                    color: 0x2d1a0d,
                    roughness: 0.95,
                    transparent: true,
                    opacity: 0.4
                })
                const ridge = new THREE.Mesh(ridgeGeometry, ridgeMaterial)
                ridge.position.set(xPos + spacingX / 2, 0.02, -5)
                scene.add(ridge)
            }

            // Month positions (Z axis) - Inverted: May closest to user (+Z) -> Shifted North by 5 (-3, -5, -7)
            const months = [
                { value: parcel.may, z: -3, label: 'Máj' },  // +2 - 5 = -3
                { value: parcel.jun, z: -5, label: 'Jún' },  // 0 - 5 = -5
                { value: parcel.aug, z: -7, label: 'Aug' }   // -2 - 5 = -7
            ]

            months.forEach(({ value, z }) => {
                const height = value * 0.12 // Height is magnitude

                // Create cylinder - Going UP
                const geometry = new THREE.CylinderGeometry(0.4, 0.4, height, 32)
                const material = new THREE.MeshStandardMaterial({
                    color: looseColor,
                    metalness: 0.1,
                    roughness: 0.6,
                    emissive: looseColorDark,
                    emissiveIntensity: 0.2
                })
                const cylinder = new THREE.Mesh(geometry, material)
                // Position: Center is at height/2
                cylinder.position.set(xPos, height / 2, z)
                cylinder.castShadow = true
                scene.add(cylinder)

                // Add a subtle ring at the TOP
                const ringGeometry = new THREE.RingGeometry(0.42, 0.52, 32)
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0x81C784,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.5
                })
                const ring = new THREE.Mesh(ringGeometry, ringMaterial)
                ring.rotation.x = -Math.PI / 2
                ring.position.set(xPos, 0.05, z)
                scene.add(ring)

                // Value label - At the BOTTOM
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')!
                canvas.width = 96
                canvas.height = 48

                // Background matching 2D tooltip style
                ctx.fillStyle = 'rgba(30, 27, 24, 0.95)'
                ctx.roundRect(4, 4, 88, 40, 8)
                ctx.fill()

                // Border matching 2D
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
                ctx.lineWidth = 1
                ctx.roundRect(4, 4, 88, 40, 8)
                ctx.stroke()

                // Text
                ctx.fillStyle = '#ffffff'
                ctx.font = 'bold 22px system-ui, sans-serif'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(`${Math.round(value)} cm`, 48, 24)

                const texture = new THREE.CanvasTexture(canvas)
                const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
                const sprite = new THREE.Sprite(spriteMaterial)
                // Position: Above the bar
                sprite.position.set(xPos, height + 1, z)
                sprite.scale.set(1.8, 0.9, 1)
                scene.add(sprite)
            })

            // Parcel number label
            const numCanvas = document.createElement('canvas')
            const numCtx = numCanvas.getContext('2d')!
            numCanvas.width = 96
            numCanvas.height = 56

            // Rounded rect background
            numCtx.fillStyle = isBest ? 'rgba(212, 168, 75, 0.25)' : 'rgba(255, 255, 255, 0.08)'
            numCtx.roundRect(4, 4, 88, 48, 8)
            numCtx.fill()
            numCtx.strokeStyle = isBest ? 'rgba(212, 168, 75, 0.5)' : 'rgba(255, 255, 255, 0.12)'
            numCtx.lineWidth = 1
            numCtx.roundRect(4, 4, 88, 48, 8)
            numCtx.stroke()
            numCtx.fillStyle = isBest ? '#d4a84b' : 'rgba(255, 255, 255, 0.9)'
            numCtx.font = 'bold 28px system-ui, sans-serif'
            numCtx.textAlign = 'center'
            numCtx.textBaseline = 'middle'
            numCtx.fillText(parcel.num, 48, 28)

            const numTexture = new THREE.CanvasTexture(numCanvas)
            const numSpriteMaterial = new THREE.SpriteMaterial({ map: numTexture })
            const numSprite = new THREE.Sprite(numSpriteMaterial)
            // Position: Forward, outside soil - Leaning off into the void
            // Moved much closer from Z=13 to Z=7
            numSprite.position.set(xPos, 0, 7)
            numSprite.scale.set(2, 2, 1)
            scene.add(numSprite)

            // Best result badge
            if (isBest) {
                const starCanvas = document.createElement('canvas')
                const starCtx = starCanvas.getContext('2d')!
                starCanvas.width = 96
                starCanvas.height = 48
                starCtx.fillStyle = '#d4a84b'
                starCtx.font = 'bold 24px system-ui, sans-serif'
                starCtx.textAlign = 'center'
                starCtx.textBaseline = 'middle'
                starCtx.fillText('★', 48, 24)
                const starTexture = new THREE.CanvasTexture(starCanvas)
                const starSpriteMaterial = new THREE.SpriteMaterial({ map: starTexture })
                const starSprite = new THREE.Sprite(starSpriteMaterial)
                starSprite.position.set(xPos, 3, -5) // Floating above center shifted
                starSprite.scale.set(2, 1, 1)
                scene.add(starSprite)
            }

            // Treatment name label
            const nameCanvas = document.createElement('canvas')
            const nameCtx = nameCanvas.getContext('2d')!
            // Aspect ratio will be set by sprite scale (3.8 x 1.7)
            // Resolution: high density
            nameCanvas.width = 760
            nameCanvas.height = 340

            // Special styling for I., VI., VII.
            const isHighlighted = ['I.', 'VI.', 'VII.'].includes(parcel.num)

            // Draw Background
            if (isHighlighted) {
                nameCtx.fillStyle = 'rgba(212, 168, 75, 0.25)' // Gold hint background
                nameCtx.roundRect(8, 8, 744, 324, 24)
                nameCtx.fill()
                nameCtx.strokeStyle = 'rgba(212, 168, 75, 0.6)'
                nameCtx.lineWidth = 6
                nameCtx.roundRect(8, 8, 744, 324, 24)
                nameCtx.stroke()
                nameCtx.fillStyle = '#d4a84b' // Gold text
            } else {
                // High contrast dark background
                nameCtx.fillStyle = 'rgba(15, 12, 10, 1.0)' // Fully opaque dark
                nameCtx.roundRect(8, 8, 744, 324, 24)
                nameCtx.fill()
                nameCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)' // Brighter border
                nameCtx.lineWidth = 6
                nameCtx.roundRect(8, 8, 744, 324, 24)
                nameCtx.stroke()
                nameCtx.fillStyle = '#ffffff' // Pure white text
            }

            // Text Configuration
            nameCtx.textAlign = 'center'
            nameCtx.textBaseline = 'middle'

            // Text Processing splitting by " + "
            const machineType = getMachineType(parcel.num, parcel.treatment)
            const fullText = parcel.treatment + machineType
            // Split by " + " but keep the plus signs or just split? 
            // User requested separating machines. replacing " + " with newline effectively
            // But we need to handle the " + " character itself. 
            // Strategy: "Lazítás + Ásógép" -> ["Lazítás", "+ Ásógép"] for clarity? 
            // Or just lines. Let's do Lines.

            let lines = fullText.split(' + ')
            if (lines.length > 1) {
                // Add the plus back to subsequent lines for clarity
                for (let i = 1; i < lines.length; i++) {
                    lines[i] = '+ ' + lines[i]
                }
            }

            // Font sizing based on line count - Maximized
            const baseFontSize = lines.length > 2 ? 60 : 72 // Significantly larger (was 48/56)
            nameCtx.font = `bold ${baseFontSize}px system-ui, sans-serif`
            const lineHeight = baseFontSize * 1.25

            // Calculate total text height
            const totalTextHeight = lines.length * lineHeight
            const startY = (340 - totalTextHeight) / 2 + (lineHeight / 2) // Vertically centered

            lines.forEach((line, i) => {
                nameCtx.fillText(line, 380, startY + (i * lineHeight))
            })

            const nameTexture = new THREE.CanvasTexture(nameCanvas)
            const nameSpriteMaterial = new THREE.SpriteMaterial({ map: nameTexture })
            const nameSprite = new THREE.Sprite(nameSpriteMaterial)

            // Position: 
            // Width: 3.8 (match parcel)
            // Height: 1.7 (proportional to canvas 760/340 = 2.23 -> 3.8 / 2.23 = 1.7)
            nameSprite.position.set(xPos, 1.2, 2.5)
            nameSprite.scale.set(3.8, 1.7, 1)
            scene.add(nameSprite)
        })

        // Month labels - Inverted Z
        // Shifted North by 5 units, but March/April pulled back South to fill space
        // Month labels - Compact depth
        const monthLabels = ['Május', 'Június', 'Augusztus'] // March/April removed as requested implicitly by "not so deep"
        const monthZPositions = [-3, -5, -7]
        monthLabels.forEach((label, i) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            canvas.width = 160
            canvas.height = 56

            // Background matching 2D monthActive style with gold accent
            // Slightly different opacity/style for months without data? 
            // Keeping uniform for now as requested "badge-t"
            ctx.fillStyle = 'rgba(212, 168, 75, 0.15)'
            ctx.roundRect(4, 4, 152, 48, 24)
            ctx.fill()

            // Border matching 2D
            ctx.strokeStyle = 'rgba(212, 168, 75, 0.3)'
            ctx.lineWidth = 1
            ctx.roundRect(4, 4, 152, 48, 24)
            ctx.stroke()

            // Gold text matching 2D monthActive
            ctx.fillStyle = '#d4a84b'
            ctx.font = '500 20px system-ui, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(label, 80, 28)

            const texture = new THREE.CanvasTexture(canvas)
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
            const sprite = new THREE.Sprite(spriteMaterial)
            // Position: Left side, slightly above surface
            sprite.position.set(startX - 4, 0.5, monthZPositions[i])
            sprite.scale.set(2.8, 1, 1)
            scene.add(sprite)
        })



        // Movement Speed
        const MOVEMENT_SPEED = 0.5

        const handleKeyDown = (e: KeyboardEvent) => {
            keysPressed.current[e.key.toLowerCase()] = true
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current[e.key.toLowerCase()] = false
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        // Animation loop
        let animationId: number
        const animate = () => {
            animationId = requestAnimationFrame(animate)

            // Handle Movement
            if (keysPressed.current['w'] || keysPressed.current['a'] || keysPressed.current['s'] || keysPressed.current['d']) {
                // Get Forward Vector (projected on XZ plane)
                const forward = new THREE.Vector3()
                camera.getWorldDirection(forward)
                forward.y = 0
                forward.normalize()

                // Get Right Vector
                const right = new THREE.Vector3()
                right.crossVectors(forward, camera.up).normalize()

                const moveVector = new THREE.Vector3()

                if (keysPressed.current['w']) moveVector.add(forward)
                if (keysPressed.current['s']) moveVector.sub(forward)
                if (keysPressed.current['d']) moveVector.add(right)
                if (keysPressed.current['a']) moveVector.sub(right)

                if (moveVector.length() > 0) {
                    moveVector.normalize().multiplyScalar(MOVEMENT_SPEED)
                    camera.position.add(moveVector)
                    controls.target.add(moveVector)
                }
            }

            controls.update()
            renderer.render(scene, camera)
        }
        animate()

        // Handle resize with ResizeObserver
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === container) {
                    const newWidth = entry.contentRect.width
                    const newHeight = entry.contentRect.height
                    camera.aspect = newWidth / newHeight
                    camera.updateProjectionMatrix()
                    renderer.setSize(newWidth, newHeight)
                }
            }
        })
        resizeObserver.observe(container)

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            cancelAnimationFrame(animationId)
            resizeObserver.disconnect()
            controls.dispose()
            renderer.dispose()
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [parcels, conclusions, isFullscreen])

    // Prevent page scroll when mouse is over the 3D canvas
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const preventScroll = (e: WheelEvent) => {
            e.preventDefault()
            e.stopPropagation()
        }

        container.addEventListener('wheel', preventScroll, { passive: false })

        return () => {
            container.removeEventListener('wheel', preventScroll)
        }
    }, [])


    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px', borderRadius: '12px', overflow: 'hidden' }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

            {/* Rotation Indicator - Top Right */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                pointerEvents: 'none',
                zIndex: 10,
                background: 'rgba(26, 23, 20, 0.8)',
                backdropFilter: 'blur(4px)',
                padding: '10px',
                borderRadius: '50%',
                border: '1px solid rgba(212, 168, 75, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}>
                <Rotate3d size={24} color="#d4a84b" style={{ opacity: 0.9 }} />
            </div>

            {/* Info Toggle Button - Top Left */}
            <button
                onClick={() => setShowInfo(!showInfo)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 20,
                    background: 'rgba(26, 23, 20, 0.8)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(212, 168, 75, 0.3)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d4a84b',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}
                title={showInfo ? "Rejtsd el az információkat" : "Mutasd az információkat"}
            >
                {showInfo ? <X size={20} /> : <Info size={20} />}
            </button>

            {/* Machine Toggle Button REMOVED */}

            {/* Legend overlay matching 2D design - Toggled */}
            {showInfo && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    pointerEvents: 'none',
                    zIndex: 10,
                    background: 'rgba(26, 23, 20, 0.9)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>
                        <span style={{ width: '16px', height: '16px', background: 'linear-gradient(180deg, rgba(129, 199, 132, 0.8) 0%, rgba(74, 103, 65, 0.9) 100%)', borderRadius: '4px', display: 'inline-block' }}></span>
                        <span>Optimális szerkezetű talaj mélysége</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', marginTop: '8px' }}>
                        <span style={{ color: '#d4a84b', fontSize: '14px' }}>★</span>
                        <span>Legnagyobb hatékonyság</span>
                    </div>
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', color: 'rgba(255, 255, 255, 0.4)', fontSize: '11px' }}>
                        WASD: Mozgás | Bal klikk: Forgatás | Jobb klikk: Mozgatás | Görgő: Zoom
                    </div>
                </div>
            )}
        </div>
    )
}
