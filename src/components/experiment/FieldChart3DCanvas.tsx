'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Rotate3d } from 'lucide-react'

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
}

export default function FieldChart3DCanvas({ parcels, conclusions }: FieldChart3DCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

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
        camera.position.set(0, 18, 34)
        camera.lookAt(0, -6, 0) // Look slightly down into the "earth"

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
        const groundGeometry = new THREE.PlaneGeometry(35, 20)
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
        ground.receiveShadow = true
        scene.add(ground)

        // Colors matching 2D design
        const looseColor = 0x81C784
        const looseColorDark = 0x4a6741

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
            parcelGround.position.set(xPos, 0.01, 0)
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
            border.position.set(xPos, 0.005, 0)
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
                ridge.position.set(xPos + spacingX / 2, 0.02, 0)
                scene.add(ridge)
            }

            // Month positions (Z axis) - Inverted: May closest to user (+Z)
            const months = [
                { value: parcel.may, z: 2, label: 'Máj' },  // +2 (Front)
                { value: parcel.jun, z: 0, label: 'Jún' },  // 0
                { value: parcel.aug, z: -2, label: 'Aug' }  // -2 (Back)
            ]

            months.forEach(({ value, z }) => {
                const height = value * 0.12 // Height is magnitude

                // Create cylinder - Going DOWN
                const geometry = new THREE.CylinderGeometry(0.4, 0.4, height, 32)
                const material = new THREE.MeshStandardMaterial({
                    color: looseColor,
                    metalness: 0.1,
                    roughness: 0.6,
                    emissive: looseColorDark,
                    emissiveIntensity: 0.2
                })
                const cylinder = new THREE.Mesh(geometry, material)
                // Position: Center is at -height/2
                cylinder.position.set(xPos, -height / 2, z)
                cylinder.castShadow = true
                scene.add(cylinder)

                // Add a subtle ring at the surface (top of bar)
                const ringGeometry = new THREE.RingGeometry(0.42, 0.52, 32)
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0x81C784,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.5
                })
                const ring = new THREE.Mesh(ringGeometry, ringMaterial)
                ring.rotation.x = -Math.PI / 2
                ring.position.set(xPos, -0.05, z)
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
                // Position: Below the bar
                sprite.position.set(xPos, -height - 1, z)
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
            // Position: Above grid at the back? Or front?
            // Let's put slightly above surface at z=-5 (Back)
            numSprite.position.set(xPos, 1.5, -5)
            numSprite.scale.set(2, 2, 1)
            scene.add(numSprite)

            // Best result badge
            if (isBest) {
                const starCanvas = document.createElement('canvas')
                const starCtx = starCanvas.getContext('2d')!
                starCanvas.width = 96
                starCanvas.height = 48
                starCtx.fillStyle = 'rgba(212, 168, 75, 0.2)'
                starCtx.roundRect(4, 4, 88, 40, 8)
                starCtx.fill()
                starCtx.strokeStyle = 'rgba(212, 168, 75, 0.4)'
                starCtx.lineWidth = 1
                starCtx.roundRect(4, 4, 88, 40, 8)
                starCtx.stroke()
                starCtx.fillStyle = '#d4a84b'
                starCtx.font = 'bold 16px system-ui, sans-serif'
                starCtx.textAlign = 'center'
                starCtx.textBaseline = 'middle'
                starCtx.fillText('★ 95%', 48, 24)
                const starTexture = new THREE.CanvasTexture(starCanvas)
                const starSpriteMaterial = new THREE.SpriteMaterial({ map: starTexture })
                const starSprite = new THREE.Sprite(starSpriteMaterial)
                starSprite.position.set(xPos, 3, 0) // Floating above
                starSprite.scale.set(2, 1, 1)
                scene.add(starSprite)
            }

            // Treatment name label
            const nameCanvas = document.createElement('canvas')
            const nameCtx = nameCanvas.getContext('2d')!
            nameCanvas.width = 420
            nameCanvas.height = 80
            nameCtx.fillStyle = 'rgba(30, 27, 24, 0.9)'
            nameCtx.roundRect(8, 4, 404, 72, 10)
            nameCtx.fill()
            nameCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
            nameCtx.lineWidth = 2
            nameCtx.roundRect(8, 4, 404, 72, 10)
            nameCtx.stroke()
            nameCtx.fillStyle = 'rgba(255, 255, 255, 0.9)'
            nameCtx.font = 'bold 24px system-ui, sans-serif'
            nameCtx.textAlign = 'center'
            nameCtx.textBaseline = 'middle'
            nameCtx.fillText(parcel.treatment, 210, 40)

            const nameTexture = new THREE.CanvasTexture(nameCanvas)
            const nameSpriteMaterial = new THREE.SpriteMaterial({ map: nameTexture })
            const nameSprite = new THREE.Sprite(nameSpriteMaterial)
            // Position: Front, slightly above surface
            nameSprite.position.set(xPos, 1, 6)
            nameSprite.scale.set(4.5, 0.9, 1)
            scene.add(nameSprite)
        })

        // Month labels - Inverted Z
        const monthLabels = ['Március', 'Április', 'Május', 'Június', 'Augusztus']
        // Large gap between April (10) and May (2) to show time jump
        const monthZPositions = [10, 8, 2, 0, -2]
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

        // Animation loop
        let animationId: number
        const animate = () => {
            animationId = requestAnimationFrame(animate)
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
            cancelAnimationFrame(animationId)
            resizeObserver.disconnect()
            controls.dispose()
            renderer.dispose()
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [parcels, conclusions])

    // Prevent page scroll when mouse is over the 3D canvas
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const preventScroll = (e: WheelEvent) => {
            e.preventDefault()
            e.stopPropagation()
        }

        container.addEventListener('wheel', preventScroll, { passive: false })
        return () => container.removeEventListener('wheel', preventScroll)
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

            {/* Legend overlay matching 2D design */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                pointerEvents: 'none',
                zIndex: 10,
                background: 'rgba(26, 23, 20, 0.9)',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
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
                    Bal klikk: Forgatás | Jobb klikk: Mozgatás | Görgő: Zoom
                </div>
            </div>
        </div>
    )
}
