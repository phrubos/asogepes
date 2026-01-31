'use client'

import styles from './ThermalOverlays.module.css'
import { ArrowLeft, ArrowRight } from 'lucide-react'

// Reuse the interface from your project
export interface ThermalOverlayData {
    scale?: {
        min: number
        max: number
        unit: string
        gradient?: string
        position?: 'left' | 'right'
    }
    points?: {
        x: number // percentage
        y: number // percentage
        label: string
        value: string
        hideRing?: boolean
        alwaysVisible?: boolean
    }[]
    lines?: {
        y: number
        label?: string
        xStart?: number
        xEnd?: number
        color?: string
        alwaysVisible?: boolean
    }[]
    arrows?: {
        x: number
        y: number
        direction: 'left' | 'right'
        label: string
        subLabel?: string
        alwaysVisible?: boolean
    }[]
}

interface ThermalOverlaysProps {
    overlays: ThermalOverlayData
}

export default function ThermalOverlays({ overlays }: ThermalOverlaysProps) {
    if (!overlays) return null

    return (
        <div className={styles.overlayContainer}>
            {/* Points */}
            {overlays.points?.map((point, idx) => (
                <div
                    key={idx}
                    className={styles.thermalPoint}
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                    {!point.hideRing && (
                        <div className={styles.pointRing}>
                            <span className={styles.pointInnerLabel}>{point.label}</span>
                        </div>
                    )}
                    {point.value && (
                        <div className={styles.pointLabel}>
                            <span className={styles.pointValue}>{point.value}</span>
                        </div>
                    )}
                </div>
            ))}

            {/* Lines */}
            {overlays.lines?.map((line, idx) => (
                <div
                    key={`line-${idx}`}
                    className={styles.overlayLine}
                    style={{
                        top: `${line.y}%`,
                        left: line.xStart !== undefined ? `${line.xStart}%` : 0,
                        width: line.xEnd !== undefined && line.xStart !== undefined
                            ? `${line.xEnd - line.xStart}%`
                            : (line.xEnd !== undefined ? `${line.xEnd}%` : '100%'),
                        borderColor: line.color || 'rgba(255, 255, 255, 1)'
                    }}
                >
                    {line.label && <span className={styles.overlayLineLabel}>{line.label}</span>}
                </div>
            ))}

            {/* Scale */}
            {overlays.scale && (
                <div
                    className={styles.thermalScale}
                    style={{
                        right: overlays.scale.position === 'left' ? 'auto' : '20px',
                        left: overlays.scale.position === 'left' ? '20px' : 'auto'
                    }}
                >
                    <div className={styles.scaleMax}>
                        <span className={styles.scaleValue}>{overlays.scale.max}{overlays.scale.unit}</span>
                        <div className={styles.scaleMarker} />
                    </div>
                    <div
                        className={styles.scaleBar}
                        style={overlays.scale.gradient ? { background: overlays.scale.gradient } : undefined}
                    />
                    <div className={styles.scaleMin}>
                        <span className={styles.scaleValue}>{overlays.scale.min}{overlays.scale.unit}</span>
                        <div className={styles.scaleMarker} />
                    </div>
                </div>
            )}

            {/* Arrows */}
            {overlays.arrows?.map((arrow, idx) => (
                <div
                    key={`arrow-${idx}`}
                    className={`${styles.overlayArrow} ${arrow.direction === 'left' ? styles.arrowLeft : styles.arrowRight}`}
                    style={{ left: `${arrow.x}%`, top: `${arrow.y}%` }}
                >
                    <div className={styles.arrowLabelGroup}>
                        <span className={styles.arrowLabel}>{arrow.label}</span>
                        {arrow.subLabel && <span className={styles.arrowSubLabel}>{arrow.subLabel}</span>}
                    </div>
                    {arrow.direction === 'left' ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                </div>
            ))}
        </div>
    )
}
