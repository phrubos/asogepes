'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Html, Center } from '@react-three/drei'
import { useMemo, useState } from 'react'
import { Award } from 'lucide-react'
import * as THREE from 'three'

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

interface FieldChart3DProps {
    parcels: ParcelData[]
    conclusions?: {
        summary: string
        bestResults: string[]
    }
}

const ParcelBar = ({
    position,
    value,
    color,
    label,
    heightScale = 0.1
}: {
    position: [number, number, number],
    value: number,
    color: string,
    label: string,
    heightScale?: number
}) => {
    const height = value * heightScale
    // Cylinder geometry: [radiusTop, radiusBottom, height, radialSegments]
    // Position y should be height/2 so it sits on the plane
    return (
        <group position={position}>
            <mesh position={[0, height / 2, 0]}>
                <cylinderGeometry args={[0.3, 0.3, height, 32]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Label on top */}
            <Html position={[0, height + 0.5, 0]} center transform sprite zIndexRange={[100, 0]}>
                <div style={{
                    background: 'rgba(0,0,0,0.7)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '10px',
                    fontFamily: 'sans-serif',
                    whiteSpace: 'nowrap'
                }}>
                    {Math.round(value)}
                </div>
            </Html>
        </group>
    )
}

const MachineryPlaceholder = ({ position, label }: { position: [number, number, number], label: string }) => {
    return (
        <group position={position} rotation={[-Math.PI / 2, 0, 0]}> {/* Flat on ground */}
            <mesh>
                <planeGeometry args={[2.5, 2.5]} />
                <meshBasicMaterial color="#333" side={THREE.DoubleSide} transparent opacity={0.5} />
            </mesh>
            <Html position={[0, 0, 0.1]} transform center rotation={[0, 0, 0]}>
                <div style={{
                    color: 'white',
                    fontSize: '14px',
                    textAlign: 'center',
                    width: '150px',
                    background: 'rgba(0,0,0,0.5)',
                    padding: '4px',
                    borderRadius: '4px'
                }}>
                    <div style={{ opacity: 0.7, marginBottom: '2px' }}>GÉP</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{label}</div>
                </div>
            </Html>
        </group>
    )
}

const ParcelGroup = ({
    parcel,
    position,
    isBest
}: {
    parcel: ParcelData,
    position: [number, number, number],
    isBest: boolean
}) => {
    // 3 Bars: May, Jun, Aug
    // We'll arrange them along Z axis for that parcel strip

    // Colors based on depth? Or fixed? 
    // User image suggests: Green top (loose), Red bottom? Or just Green for good value?
    // User: "Zöld: Laza talaj (optimális), Piros: Tömörödött talaj"
    // The bar represents the DEPTH of loose soil. So the BAR itself is the loose soil.
    // So the bar should be GREEN.
    // Wait, in the 2D chart, there is a "Compacted zone" (red) and "Loose zone" (green).
    // The bar height is total 45cm approx?
    // Let's look at 2D chart logic: 
    // Reference bar (total depth)
    // Compacted zone (red) -> grows from bottom? Or top?
    // IsometricFieldChart says:
    // Compacted zone height = 100 - getBarHeight(value)
    // Loose zone height = getBarHeight(value)
    // So "Loose" is the MEASURED value. The rest up to 45cm is Compacted.

    // In 3D: We should probably show the Loose part as Green cylinder.
    // Maybe show a ghost/transparent Red cylinder on top for the compacted part?
    // Or just show the Green bars as "Result" like the user sketch shows (Simple bars).
    // The user sketch has green bars. And some red ones?
    // Ah, the sketch shows:
    // Parcel 1: Green bar
    // Parcel 2: Red bar?
    // Wait, the user sketch `uploaded_image_1...` shows a graph with Green tops and Red bottoms?
    // No, the sketch is hand drawn.
    // The standard 2D chart (image 0) shows Green bars (value) and Red "rest of space".

    // I will just render the Loose Soil (Value) as a Green Cylinder.
    // And maybe a wireframe or transparent Red cylinder for the theoretical max depth (e.g. 50cm or 60cm)?
    // User said: "Be kellene mutatni mindhárom mérés eredményét" (Show all 3 measurement results).

    const looseColor = "#4ade80" // Green 400
    // const compactedColor = "#f87171" // Red 400

    // Z positions for months
    const zMay = -1.5
    const zJun = 0
    const zAug = 1.5

    return (
        <group position={position}>
            {/* Label I. II. etc */}
            <Text
                position={[0, 0, -3.5]}
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {parcel.num}
            </Text>

            {/* Short Name */}
            <Text
                position={[0, 0, 3.5]}
                fontSize={0.25}
                color="#ccc"
                anchorX="center"
                anchorY="middle"
                rotation={[-Math.PI / 2, 0, 0]}
            >
                {parcel.shortName}
            </Text>

            {/* Machinery Placeholder */}
            <MachineryPlaceholder position={[0, 0, 5.5]} label={parcel.shortName} />

            {/* Best Result Star */}
            {isBest && (
                <Html position={[0, 7, 0]} center>
                    <div style={{ color: '#fbbf24' }}>
                        <Award size={24} fill="currentColor" />
                    </div>
                </Html>
            )}

            <ParcelBar position={[0, 0, zMay]} value={parcel.may} color={looseColor} label="May" />
            <ParcelBar position={[0, 0, zJun]} value={parcel.jun} color={looseColor} label="Jun" />
            <ParcelBar position={[0, 0, zAug]} value={parcel.aug} color={looseColor} label="Aug" />
        </group>
    )
}

export default function FieldChart3D({ parcels, conclusions }: FieldChart3DProps) {
    const isBestResult = (num: string): boolean => conclusions?.bestResults.includes(num) || false

    // Calculate spacing
    // We have 7 parcels. Center them.
    // Spacing X = 3 units?
    const spacingX = 3
    const totalWidth = (parcels.length - 1) * spacingX
    const startX = -totalWidth / 2

    return (
        <div style={{ width: '100%', height: '500px', background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
            <Canvas shadows camera={{ position: [0, 8, 15], fov: 45 }}>
                <color attach="background" args={['#1a1a1a']} />

                {/* Lights */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                <directionalLight position={[-5, 5, 5]} intensity={0.5} />

                <OrbitControls
                    enablePan={true}
                    maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below ground
                    minPolarAngle={0.5}
                />

                <Center>
                    <group>
                        {/* Ground / Grid */}
                        <gridHelper args={[30, 30, '#333', '#222']} position={[0, 0.01, 0]} />

                        {/* Parcels */}
                        {parcels.map((parcel, index) => (
                            <ParcelGroup
                                key={parcel.num}
                                parcel={parcel}
                                position={[startX + index * spacingX, 0, 0]}
                                isBest={isBestResult(parcel.num)}
                            />
                        ))}

                        {/* Month Labels (Legend on the side/floor?) */}
                        <group position={[startX - 2, 0, 0]}>
                            <Text position={[0, 0.1, -1.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.3} color="#888">Máj</Text>
                            <Text position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.3} color="#888">Jún</Text>
                            <Text position={[0, 0.1, 1.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.3} color="#888">Aug</Text>
                        </group>
                    </group>
                </Center>
            </Canvas>

            {/* HTML Overlay Legend (Optional, or integrate into canvas) */}
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', pointerEvents: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', fontSize: '12px' }}>
                    <span style={{ width: '12px', height: '12px', background: '#4ade80', borderRadius: '2px' }}></span>
                    <span>Laza talaj mélysége (cm)</span>
                </div>
                <div style={{ marginTop: '4px', color: '#666', fontSize: '10px' }}>
                    Bal klikk: Forgatás | Jobb klikk: Mozgatás | Görgő: Zoom
                </div>
            </div>
        </div>
    )
}
