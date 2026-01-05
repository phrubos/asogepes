'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
        camera.position.set(0, 12, 20)
        camera.lookAt(0, 0, 0)

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)
        container.appendChild(renderer.domElement)
        rendererRef.current = renderer

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.maxPolarAngle = Math.PI / 2 - 0.1
        controls.minPolarAngle = 0.3

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xfff5e6, 1.0)
        directionalLight.position.set(15, 25, 10)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        const fillLight = new THREE.DirectionalLight(0x8ec8ff, 0.3)
        fillLight.position.set(-10, 10, -10)
        scene.add(fillLight)

        // Create procedural soil texture with optional variation
        const createSoilTexture = (variation: number = 0) => {
            const canvas = document.createElement('canvas')
            canvas.width = 512
            canvas.height = 512
            const ctx = canvas.getContext('2d')!

            // Base soil color - rich brown with slight variation per parcel
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
                    // Small stones/pebbles
                    ctx.fillStyle = `rgba(100, 85, 70, ${Math.random() * 0.5})`
                }
                
                ctx.beginPath()
                ctx.ellipse(x, y, size, size * 0.7, Math.random() * Math.PI, 0, Math.PI * 2)
                ctx.fill()
            }

            // Add furrow lines (plowed field effect)
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

            // Add some organic matter / darker spots
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * 512
                const y = Math.random() * 512
                const radius = Math.random() * 15 + 5
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
                gradient.addColorStop(0, 'rgba(25, 15, 8, 0.4)')
                gradient.addColorStop(1, 'rgba(25, 15, 8, 0)')
                ctx.fillStyle = gradient
                ctx.beginPath()
                ctx.arc(x, y, radius, 0, Math.PI * 2)
                ctx.fill()
            }

            return new THREE.CanvasTexture(canvas)
        }

        const soilTexture = createSoilTexture()
        soilTexture.wrapS = THREE.RepeatWrapping
        soilTexture.wrapT = THREE.RepeatWrapping
        soilTexture.repeat.set(4, 4)

        // Ground plane with soil texture
        const groundGeometry = new THREE.PlaneGeometry(35, 20)
        const groundMaterial = new THREE.MeshStandardMaterial({
            map: soilTexture,
            roughness: 0.95,
            metalness: 0.0,
            bumpMap: soilTexture,
            bumpScale: 0.05
        })
        const ground = new THREE.Mesh(groundGeometry, groundMaterial)
        ground.rotation.x = -Math.PI / 2
        ground.position.y = 0
        ground.receiveShadow = true
        scene.add(ground)

        // Colors matching 2D design
        // Green: rgba(129, 199, 132) / rgba(74, 103, 65) from 2D
        // Gold: #d4a84b / rgba(212, 168, 75) from 2D
        const looseColor = 0x81C784 // Matching 2D green
        const looseColorDark = 0x4a6741 // Darker green base

        // Calculate spacing
        const spacingX = 4.5
        const parcelWidth = 3.8
        const parcelDepth = 8
        const totalWidth = (parcels.length - 1) * spacingX
        const startX = -totalWidth / 2

        // Create individual parcel ground strips
        parcels.forEach((parcel, index) => {
            const xPos = startX + index * spacingX
            const isBest = conclusions?.bestResults.includes(parcel.num) || false

            // Create individual parcel soil strip with slightly different shade
            const parcelSoilTexture = createSoilTexture(index)
            parcelSoilTexture.wrapS = THREE.RepeatWrapping
            parcelSoilTexture.wrapT = THREE.RepeatWrapping
            parcelSoilTexture.repeat.set(1, 2)

            const parcelGeometry = new THREE.PlaneGeometry(parcelWidth, parcelDepth)
            const parcelMaterial = new THREE.MeshStandardMaterial({
                map: parcelSoilTexture,
                roughness: 0.9,
                metalness: 0.0,
                bumpMap: parcelSoilTexture,
                bumpScale: 0.03
            })
            const parcelGround = new THREE.Mesh(parcelGeometry, parcelMaterial)
            parcelGround.rotation.x = -Math.PI / 2
            parcelGround.position.set(xPos, 0.02, 0)
            parcelGround.receiveShadow = true
            scene.add(parcelGround)

            // Add border/edge around each parcel (like a furrow between parcels)
            const borderGeometry = new THREE.PlaneGeometry(parcelWidth + 0.3, parcelDepth + 0.3)
            const borderMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a0f08,
                roughness: 1.0,
                metalness: 0.0
            })
            const border = new THREE.Mesh(borderGeometry, borderMaterial)
            border.rotation.x = -Math.PI / 2
            border.position.set(xPos, 0.01, 0)
            scene.add(border)

            // Add raised edge markers (like small ridges between parcels)
            if (index < parcels.length - 1) {
                const ridgeGeometry = new THREE.BoxGeometry(0.15, 0.08, parcelDepth)
                const ridgeMaterial = new THREE.MeshStandardMaterial({
                    color: 0x2d1a0d,
                    roughness: 0.95
                })
                const ridge = new THREE.Mesh(ridgeGeometry, ridgeMaterial)
                ridge.position.set(xPos + spacingX / 2, 0.04, 0)
                scene.add(ridge)
            }

            // Month positions (Z axis)
            const months = [
                { value: parcel.may, z: -2, label: 'Máj' },
                { value: parcel.jun, z: 0, label: 'Jún' },
                { value: parcel.aug, z: 2, label: 'Aug' }
            ]

            months.forEach(({ value, z }) => {
                const height = value * 0.12
                
                // Create cylinder matching 2D green gradient
                const geometry = new THREE.CylinderGeometry(0.4, 0.4, height, 32)
                const material = new THREE.MeshStandardMaterial({ 
                    color: looseColor,
                    metalness: 0.1,
                    roughness: 0.6,
                    emissive: looseColorDark,
                    emissiveIntensity: 0.2
                })
                const cylinder = new THREE.Mesh(geometry, material)
                cylinder.position.set(xPos, height / 2, z)
                cylinder.castShadow = true
                scene.add(cylinder)

                // Add a subtle ring at the base matching 2D style
                const ringGeometry = new THREE.RingGeometry(0.42, 0.52, 32)
                const ringMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0x81C784,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.5
                })
                const ring = new THREE.Mesh(ringGeometry, ringMaterial)
                ring.rotation.x = -Math.PI / 2
                ring.position.set(xPos, 0.03, z)
                scene.add(ring)

                // Value label matching 2D design
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
                sprite.position.set(xPos, height + 1, z)
                sprite.scale.set(1.8, 0.9, 1)
                scene.add(sprite)
            })

            // Parcel number label matching 2D badge style
            const numCanvas = document.createElement('canvas')
            const numCtx = numCanvas.getContext('2d')!
            numCanvas.width = 96
            numCanvas.height = 56
            
            // Rounded rect background matching 2D parcelBadge
            numCtx.fillStyle = isBest ? 'rgba(212, 168, 75, 0.25)' : 'rgba(255, 255, 255, 0.08)'
            numCtx.roundRect(4, 4, 88, 48, 8)
            numCtx.fill()
            
            // Border
            numCtx.strokeStyle = isBest ? 'rgba(212, 168, 75, 0.5)' : 'rgba(255, 255, 255, 0.12)'
            numCtx.lineWidth = 1
            numCtx.roundRect(4, 4, 88, 48, 8)
            numCtx.stroke()
            
            // Text - gold for best, white for others
            numCtx.fillStyle = isBest ? '#d4a84b' : 'rgba(255, 255, 255, 0.9)'
            numCtx.font = 'bold 28px system-ui, sans-serif'
            numCtx.textAlign = 'center'
            numCtx.textBaseline = 'middle'
            numCtx.fillText(parcel.num, 48, 28)

            const numTexture = new THREE.CanvasTexture(numCanvas)
            const numSpriteMaterial = new THREE.SpriteMaterial({ map: numTexture })
            const numSprite = new THREE.Sprite(numSpriteMaterial)
            numSprite.position.set(xPos, 1, -5)
            numSprite.scale.set(2, 2, 1)
            scene.add(numSprite)

            // Best result badge matching 2D gold style
            if (isBest) {
                const starCanvas = document.createElement('canvas')
                const starCtx = starCanvas.getContext('2d')!
                starCanvas.width = 96
                starCanvas.height = 48
                
                // Badge background matching 2D gold accent
                starCtx.fillStyle = 'rgba(212, 168, 75, 0.2)'
                starCtx.roundRect(4, 4, 88, 40, 8)
                starCtx.fill()
                
                // Border
                starCtx.strokeStyle = 'rgba(212, 168, 75, 0.4)'
                starCtx.lineWidth = 1
                starCtx.roundRect(4, 4, 88, 40, 8)
                starCtx.stroke()
                
                // Text in gold
                starCtx.fillStyle = '#d4a84b'
                starCtx.font = 'bold 16px system-ui, sans-serif'
                starCtx.textAlign = 'center'
                starCtx.textBaseline = 'middle'
                starCtx.fillText('★ 95%', 48, 24)

                const starTexture = new THREE.CanvasTexture(starCanvas)
                const starSpriteMaterial = new THREE.SpriteMaterial({ map: starTexture })
                const starSprite = new THREE.Sprite(starSpriteMaterial)
                starSprite.position.set(xPos, 8, 0)
                starSprite.scale.set(2, 1, 1)
                scene.add(starSprite)
            }

            // Treatment name label - full name instead of abbreviation
            const nameCanvas = document.createElement('canvas')
            const nameCtx = nameCanvas.getContext('2d')!
            nameCanvas.width = 320
            nameCanvas.height = 56
            
            // Background matching 2D style
            nameCtx.fillStyle = 'rgba(30, 27, 24, 0.9)'
            nameCtx.roundRect(8, 4, 304, 48, 8)
            nameCtx.fill()
            
            // Border
            nameCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
            nameCtx.lineWidth = 1
            nameCtx.roundRect(8, 4, 304, 48, 8)
            nameCtx.stroke()
            
            // Text - full treatment name
            nameCtx.fillStyle = 'rgba(255, 255, 255, 0.7)'
            nameCtx.font = '14px system-ui, sans-serif'
            nameCtx.textAlign = 'center'
            nameCtx.textBaseline = 'middle'
            nameCtx.fillText(parcel.treatment, 160, 28)

            const nameTexture = new THREE.CanvasTexture(nameCanvas)
            const nameSpriteMaterial = new THREE.SpriteMaterial({ map: nameTexture })
            const nameSprite = new THREE.Sprite(nameSpriteMaterial)
            nameSprite.position.set(xPos, 0.8, 5.5)
            nameSprite.scale.set(4, 0.7, 1)
            scene.add(nameSprite)
        })

        // Month labels matching 2D monthButton style
        const monthLabels = ['Május', 'Június', 'Augusztus']
        const monthZPositions = [-2, 0, 2]
        monthLabels.forEach((label, i) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            canvas.width = 160
            canvas.height = 56
            
            // Background matching 2D monthActive style with gold accent
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
            sprite.position.set(startX - 4, 1.2, monthZPositions[i])
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

        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return
            const newWidth = containerRef.current.clientWidth
            const newHeight = containerRef.current.clientHeight
            camera.aspect = newWidth / newHeight
            camera.updateProjectionMatrix()
            renderer.setSize(newWidth, newHeight)
        }
        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', handleResize)
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
        <div style={{ position: 'relative', width: '100%', height: '700px', borderRadius: '12px', overflow: 'hidden' }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            
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
                    <span>Laza talaj (optimális)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', marginTop: '8px' }}>
                    <span style={{ color: '#d4a84b', fontSize: '14px' }}>★</span>
                    <span>Legjobb eredmény (95%)</span>
                </div>
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', color: 'rgba(255, 255, 255, 0.4)', fontSize: '11px' }}>
                    Bal klikk: Forgatás | Jobb klikk: Mozgatás | Görgő: Zoom
                </div>
            </div>
        </div>
    )
}
