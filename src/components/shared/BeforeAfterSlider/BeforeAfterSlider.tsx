'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react'
import styles from './BeforeAfterSlider.module.css'

interface ThermalOverlay {
    scale?: {
        min: number
        max: number
        unit: string
        gradient?: string
        right?: number // Optional right position override
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
        xStart?: number // Percentage
        xEnd?: number   // Percentage
        color?: string
        alwaysVisible?: boolean
        hasArrows?: boolean
    }[]
    verticalLines?: {
        x: number
        label?: string
        style?: 'dashed' | 'solid'
        alwaysVisible?: boolean
    }[]
    arrows?: {
        x: number
        y: number
        direction: 'left' | 'right' | 'down' | 'none'
        label?: string
        subLabel?: string
        alwaysVisible?: boolean
    }[]
}

interface BeforeAfterSliderProps {
    leftImage: string
    rightImage: string
    leftLabel?: string
    rightLabel?: string
    altLeft: string
    altRight: string
    overlays?: ThermalOverlay
    leftOverlays?: ThermalOverlay
    watermark?: {
        lines: string[]
    }
    onSliderChange?: (position: number) => void
    onLoad?: () => void
    objectFit?: React.CSSProperties['objectFit']
    sizes?: string
    initialSliderPosition?: number
    interactionEnabled?: boolean
}

export default function BeforeAfterSlider({
    leftImage,
    rightImage,
    leftLabel = 'Before',
    rightLabel = 'After',
    altLeft,
    altRight,
    overlays,
    leftOverlays,
    watermark,
    onSliderChange,
    onLoad,
    objectFit,
    sizes = '100vw',
    initialSliderPosition = 50,
    interactionEnabled = true
}: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(initialSliderPosition) // Percentage of container
    const [isDragging, setIsDragging] = useState(false)
    const loadedImagesRef = useRef(new Set<string>())

    const handleImageLoaded = useCallback((src: string) => {
        if (!onLoad) return

        loadedImagesRef.current.add(src)
        // Check if both current images are loaded
        if (loadedImagesRef.current.has(leftImage) && loadedImagesRef.current.has(rightImage)) {
            onLoad()
        }
    }, [leftImage, rightImage, onLoad])

    // Reset loaded state when images change
    useEffect(() => {
        loadedImagesRef.current.clear()
    }, [leftImage, rightImage])

    // Notify parent of slider position changes
    useEffect(() => {
        if (onSliderChange) {
            onSliderChange(sliderPosition)
        }
    }, [sliderPosition, onSliderChange])
    const containerRef = useRef<HTMLDivElement>(null)
    const [imageRatio, setImageRatio] = useState<number | null>(null)
    const [containerRect, setContainerRect] = useState<{ width: number; height: number } | null>(null)
    const shouldPreventClick = useRef(false)

    // Monitor container size
    useEffect(() => {
        if (!containerRef.current) return

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerRect({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                })
            }
        })

        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current || !interactionEnabled) {
            console.log('[BeforeAfterSlider] handleMove ignored:', { container: !!containerRef.current, interactionEnabled })
            return
        }

        shouldPreventClick.current = true

        const rect = containerRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100))

        console.log('[BeforeAfterSlider] Handling move:', { percent })
        setSliderPosition(percent)
    }, [interactionEnabled])

    const onMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        console.log('[BeforeAfterSlider] onMouseDown:', { interactionEnabled })
        if (!interactionEnabled) return
        setIsDragging(true)
    }, [interactionEnabled])

    const onMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return
        handleMove(e.clientX)
    }, [isDragging, handleMove])

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX)
    }, [handleMove])

    // Global event listeners (same as before)
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsDragging(false)

            // Prevent subsequent click event which causes modal closing
            // This happens when mouseup occurs on the overlay (common ancestor)
            const preventClick = (clickEvent: MouseEvent) => {
                clickEvent.stopPropagation()
                clickEvent.stopImmediatePropagation()
                clickEvent.preventDefault()
                window.removeEventListener('click', preventClick, true)
            }

            // Add capture listener to catch the click before it bubbles
            window.addEventListener('click', preventClick, true)

            // Cleanup in case click doesn't fire (e.g. context menu or other interruption)
            setTimeout(() => window.removeEventListener('click', preventClick, true), 50)
        }

        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                handleMove(e.clientX)
            }
        }

        if (isDragging) {
            window.addEventListener('mouseup', handleGlobalMouseUp)
            window.addEventListener('mousemove', handleGlobalMouseMove)
        }

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp)
            window.removeEventListener('mousemove', handleGlobalMouseMove)
        }
    }, [isDragging, handleMove])

    // Handle Image Load to get Aspect Ratio
    const handleImageLoad = (e: any) => {
        const { naturalWidth, naturalHeight } = e.target
        if (naturalWidth && naturalHeight) {
            setImageRatio(naturalWidth / naturalHeight)
        }
    }

    // Calculate Content Wrapper Layout (Cover vs Contain)
    const wrapperStyle = useMemo(() => {
        if (!imageRatio || !containerRect) return { width: '100%', height: '100%' }

        const containerRatio = containerRect.width / containerRect.height

        let style: React.CSSProperties = {
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
        }

        const isCover = objectFit !== 'contain' // Default to cover

        if (isCover) {
            // COVER LOGIC
            if (containerRatio > imageRatio) {
                // Container wider -> Fit Width, Crop Height (Vertical overflow)
                style.width = '100%'
                style.height = 'auto'
                style.aspectRatio = `${imageRatio}`
            } else {
                // Container taller -> Fit Height, Crop Width (Horizontal overflow)
                style.height = '100%'
                style.width = 'auto'
                style.aspectRatio = `${imageRatio}`
            }
        } else {
            // CONTAIN LOGIC
            if (containerRatio > imageRatio) {
                // Container wider -> Fit Height (pillarbox)
                style.height = '100%'
                style.width = 'auto'
                style.aspectRatio = `${imageRatio}`
            } else {
                // Container taller -> Fit Width (letterbox)
                style.width = '100%'
                style.height = 'auto'
                style.aspectRatio = `${imageRatio}`
            }
        }

        return style
    }, [imageRatio, containerRect, objectFit])


    // Calculate Clip Path for Left Image
    const leftClipPath = useMemo(() => {
        if (!containerRect || !imageRatio) return `inset(0 ${100 - sliderPosition}% 0 0)`

        const containerW = containerRect.width
        const containerH = containerRect.height
        const containerRatio = containerW / containerH

        let wrapperW, wrapperH

        const isCover = objectFit !== 'contain'

        // Determine Wrapper Dimensions based on logic above
        if (isCover) {
            if (containerRatio > imageRatio) {
                wrapperW = containerW
                wrapperH = containerW / imageRatio
            } else {
                wrapperH = containerH
                wrapperW = containerH * imageRatio
            }
        } else {
            // CONTAIN
            if (containerRatio > imageRatio) {
                // Fit Height
                wrapperH = containerH
                wrapperW = containerH * imageRatio
            } else {
                // Fit Width
                wrapperW = containerW
                wrapperH = containerW / imageRatio
            }
        }

        // Handle X position in pixels (relative to CONTAINER left)
        const handleX = (sliderPosition / 100) * containerW

        // Wrapper Left position (relative to CONTAINER left)
        const wrapperLeft = (containerW - wrapperW) / 2

        // Handle position relative to Wrapper Left
        const handleXInWrapper = handleX - wrapperLeft

        // Clip everything to the RIGHT of this line.
        const insetRightPx = wrapperW - handleXInWrapper
        const insetRightPercent = (insetRightPx / wrapperW) * 100

        return `inset(0 ${Math.max(0, Math.min(100, insetRightPercent))}% 0 0)`

    }, [sliderPosition, containerRect, imageRatio, objectFit])


    return (
        <div
            className={styles.container}
            ref={containerRef}
            style={{
                pointerEvents: interactionEnabled ? 'auto' : 'none',
                touchAction: interactionEnabled ? 'none' : 'auto' // Allow browser defaults (zoom/scroll) when disabled
            }}
            onClick={(e) => {
                if (shouldPreventClick.current) {
                    e.stopPropagation()
                    shouldPreventClick.current = false
                }
            }}
            onMouseDownCapture={() => {
                shouldPreventClick.current = false
            }}
        >
            {/* Content Wrapper covers the container while maintaining aspect ratio */}
            {objectFit !== 'contain' && (
                <>
                    {leftLabel && <div className={`${styles.label} ${styles.labelLeft}`}>{leftLabel}</div>}
                    {rightLabel && <div className={`${styles.label} ${styles.labelRight}`}>{rightLabel}</div>}
                </>
            )}

            {/* Content Wrapper covers the container while maintaining aspect ratio */}
            {/* Note: Labels moved to container for 'cover', inside for 'contain' */}
            <div style={wrapperStyle}>
                {objectFit === 'contain' && (
                    <>
                        {leftLabel && <div className={`${styles.label} ${styles.labelLeft}`}>{leftLabel}</div>}
                        {rightLabel && <div className={`${styles.label} ${styles.labelRight}`}>{rightLabel}</div>}
                    </>
                )}

                {/* Right Image Layer (Background) */}
                <div className={styles.imageWrapper}>
                    <Image
                        src={rightImage}
                        alt={altRight}
                        fill
                        className={styles.rightImage}
                        priority
                        sizes={sizes}
                        onLoad={(e) => {
                            handleImageLoad(e)
                            handleImageLoaded(rightImage)
                        }}
                    />

                    {/* Right Overlays */}
                    {/* Rendered exactly as before, but now inside the ratio-locked wrapper */}
                    {overlays && (
                        <div className={styles.overlayContainer}>
                            {/* Scale moved to HUD layer */}
                            {overlays.points?.map((point, idx) => (
                                !point.alwaysVisible && (
                                    <div
                                        key={idx}
                                        className={styles.thermalPoint}
                                        style={{ left: `${point.x}%`, top: `${point.y}%` }}
                                    >
                                        {point.value && !point.hideRing && (
                                            <div
                                                className={styles.pointRing}
                                                style={{
                                                    opacity: sliderPosition < 45 ? 1 : 0,
                                                    transition: 'opacity 0.3s ease'
                                                }}
                                            />
                                        )}
                                        {!point.value && !point.hideRing && (
                                            <div className={styles.pointRing} />
                                        )}
                                        <div
                                            className={styles.pointLabel}
                                            style={point.value ? {
                                                opacity: sliderPosition < 45 ? 1 : 0,
                                                transition: 'opacity 0.3s ease'
                                            } : undefined}
                                        >
                                            <span className={styles.pointTitle}>{point.label}</span>
                                            {point.value && (
                                                <span
                                                    className={styles.pointValue}
                                                    style={{
                                                        display: 'block'
                                                    }}
                                                >
                                                    {point.value}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            ))}
                            {overlays.lines?.map((line, idx) => (
                                !line.alwaysVisible && (
                                    <div
                                        key={`line-${idx}`}
                                        className={`${styles.overlayLine} ${line.hasArrows ? styles.overlayLineWithArrows : ''}`}
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
                                )
                            ))}
                            {overlays.verticalLines?.map((line, idx) => (
                                <div
                                    key={`vline-${idx}`}
                                    className={`${styles.overlayVerticalLine} ${line.style === 'solid' ? styles.solid : styles.dashed}`}
                                    style={{ left: `${line.x}%` }}
                                >
                                    {line.label && <span className={styles.overlayVerticalLineLabel}>{line.label}</span>}
                                </div>
                            ))}
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
                    )}
                </div>

                {/* Left Image Layer (Foreground, Clipped) */}
                <div
                    className={styles.leftImageContainer}
                    style={{
                        clipPath: leftClipPath,
                        // Reset borders or width issues from CSS module that might conflict
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                >
                    <Image
                        src={leftImage}
                        alt={altLeft}
                        fill
                        className={styles.leftImage}
                        priority
                        sizes={sizes}
                        onLoad={() => handleImageLoaded(leftImage)}
                    />

                    {/* Left Overlays */}
                    {leftOverlays && (
                        <div className={styles.overlayContainer}>
                            {/* Scale moved to HUD layer */}
                            {leftOverlays.points?.map((point, idx) => (
                                <div
                                    key={idx}
                                    className={styles.thermalPoint}
                                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                                >
                                    <div className={styles.pointLabel}>
                                        <span className={styles.pointTitle}>{point.label}</span>
                                        {point.value && <span className={styles.pointValue}>{point.value}</span>}
                                    </div>
                                </div>
                            ))}
                            {leftOverlays.lines?.map((line, idx) => (
                                <div
                                    key={`line-${idx}`}
                                    className={`${styles.overlayLine} ${line.hasArrows ? styles.overlayLineWithArrows : ''}`}
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
                        </div>
                    )}
                </div>

                {/* Watermark inside wrapper for 'contain' mode */}
                {objectFit === 'contain' && watermark && (
                    <div className={styles.watermark}>
                        {watermark.lines.map((line, idx) => (
                            <span key={idx} className={styles.watermarkLine}>{line}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Slider Handle - Stays in Container Space */}
            <div
                className={styles.sliderHandle}
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={onMouseDown}
                onTouchStart={onMouseDown}
                onTouchMove={onTouchMove}
                onTouchEnd={onMouseUp}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.handleButton}>
                    <ChevronLeft size={16} />
                    <ChevronRight size={16} />
                </div>
            </div>

            {/* Static (HUD) Layer - Contains alwaysVisible elements scaled with the image */}
            <div style={wrapperStyle}>
                <div className={styles.staticOverlayContainer}>
                    {/* Parcell Labels and lines from overlays */}
                    {overlays?.points?.map((point, idx) => (
                        point.alwaysVisible && (
                            <div
                                key={`static-point-${idx}`}
                                className={styles.thermalPoint}
                                style={{ left: `${point.x}%`, top: `${point.y}%`, zIndex: 15 }}
                            >
                                {point.value && !point.hideRing && (
                                    <div
                                        className={styles.pointRing}
                                        style={{
                                            opacity: sliderPosition < 45 ? 1 : 0,
                                            transition: 'opacity 0.3s ease'
                                        }}
                                    />
                                )}
                                {!point.value && !point.hideRing && (
                                    <div className={styles.pointRing} />
                                )}
                                <div className={styles.pointLabel}>
                                    <span className={styles.pointTitle}>{point.label}</span>
                                    {/* Values for static points are only shown if slider reveals analysis side */}
                                    {point.value && (
                                        <span
                                            className={styles.pointValue}
                                            style={{
                                                opacity: sliderPosition < 45 ? 1 : 0,
                                                display: sliderPosition < 45 ? 'block' : 'none'
                                            }}
                                        >
                                            {point.value}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    ))}
                    {overlays?.lines?.map((line, idx) => (
                        line.alwaysVisible && (
                            <div
                                key={`static-line-${idx}`}
                                className={`${styles.overlayLine} ${line.hasArrows ? styles.overlayLineWithArrows : ''}`}
                                style={{
                                    top: `${line.y}%`,
                                    left: line.xStart !== undefined ? `${line.xStart}%` : 0,
                                    width: line.xEnd !== undefined && line.xStart !== undefined
                                        ? `${line.xEnd - line.xStart}%`
                                        : (line.xEnd !== undefined ? `${line.xEnd}%` : '100%'),
                                    borderColor: line.color || 'rgba(255, 255, 255, 1)',
                                    zIndex: 14
                                }}
                            >
                                {line.label && <span className={styles.overlayLineLabel}>{line.label}</span>}
                            </div>
                        )
                    ))}
                    {overlays?.verticalLines?.map((line, idx) => (
                        line.alwaysVisible && (
                            <div
                                key={`static-vline-${idx}`}
                                className={`${styles.overlayVerticalLine} ${line.style === 'solid' ? styles.solid : styles.dashed}`}
                                style={{ left: `${line.x}%`, zIndex: 14 }}
                            >
                                {line.label && <span className={styles.overlayVerticalLineLabel}>{line.label}</span>}
                            </div>
                        )
                    ))}
                    {overlays?.arrows?.map((arrow, idx) => (
                        arrow.alwaysVisible && (
                            <div
                                key={`static-arrow-${idx}`}
                                className={`${styles.overlayArrow} ${arrow.direction === 'left' ? styles.arrowLeft : styles.arrowRight}`}
                                style={{ left: `${arrow.x}%`, top: `${arrow.y}%`, zIndex: 16 }}
                            >
                                <div className={styles.arrowLabelGroup}>
                                    <span className={styles.arrowLabel}>{arrow.label}</span>
                                    {arrow.subLabel && <span className={styles.arrowSubLabel}>{arrow.subLabel}</span>}
                                </div>
                                {arrow.direction === 'left' ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                            </div>
                        )
                    ))}
                </div>
            </div>

            {/* HUD Elements - Scales (Positioned relative to viewport, not image) */}
            {overlays?.scale && (
                <div
                    className={styles.thermalScale}
                    style={{
                        opacity: sliderPosition < 45 ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        zIndex: 20, // Ensure on top
                        right: overlays.scale.right !== undefined ? `${overlays.scale.right}px` : undefined
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

            {leftOverlays?.scale && (
                <div
                    className={styles.thermalScale}
                    style={{
                        opacity: sliderPosition > 55 ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        zIndex: 20,
                        left: leftOverlays.scale.right !== undefined ? `${leftOverlays.scale.right}px` : '30px', // Reuse 'right' prop for left distance
                        right: 'auto'
                    }}
                >
                    <div className={styles.scaleMax}>
                        <span className={styles.scaleValue}>{leftOverlays.scale.max}{leftOverlays.scale.unit}</span>
                        <div className={styles.scaleMarker} />
                    </div>
                    <div
                        className={styles.scaleBar}
                        style={leftOverlays.scale.gradient ? { background: leftOverlays.scale.gradient } : undefined}
                    />
                    <div className={styles.scaleMin}>
                        <span className={styles.scaleValue}>{leftOverlays.scale.min}{leftOverlays.scale.unit}</span>
                        <div className={styles.scaleMarker} />
                    </div>
                </div>
            )}

            {objectFit !== 'contain' && watermark && (
                <div className={styles.watermark}>
                    {watermark.lines.map((line, idx) => (
                        <span key={idx} className={styles.watermarkLine}>{line}</span>
                    ))}
                </div>
            )}
        </div>
    )
}
