'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { useInView } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export type PlayState = 'idle' | 'playing' | 'done'

/**
 * Plays a soil-profile animation once, on request. The finished picture is what React renders, so
 * stopping (by the button, by scrolling away or by turning on reduced motion) jumps back to it.
 * `setup` receives the svg once and returns the frame renderer `render(t)`, t in seconds, 0..duration.
 */
export function useSoilPlayback(
    svgRef: RefObject<SVGSVGElement | null>,
    duration: number,
    setup: (svg: SVGSVGElement) => (t: number) => void,
) {
    const reduced = useReducedMotion()
    const inView = useInView(svgRef, { margin: '100px' })
    const [state, setState] = useState<PlayState>('idle')
    const rafRef = useRef(0)
    const renderRef = useRef<((t: number) => void) | null>(null)
    const setupRef = useRef(setup)
    setupRef.current = setup

    const getRender = useCallback(() => {
        if (!renderRef.current && svgRef.current) renderRef.current = setupRef.current(svgRef.current)
        return renderRef.current
    }, [svgRef])

    const stop = useCallback(() => {
        cancelAnimationFrame(rafRef.current)
        renderRef.current?.(duration)
        setState((s) => (s === 'playing' ? 'done' : s))
    }, [duration])

    const play = useCallback(() => {
        const render = getRender()
        if (!render) return
        cancelAnimationFrame(rafRef.current)
        let t = 0
        let last = performance.now()
        render(0)
        setState('playing')
        const tick = (now: number) => {
            t += Math.min(0.1, (now - last) / 1000)
            last = now
            render(Math.min(t, duration))
            if (t < duration) rafRef.current = requestAnimationFrame(tick)
            else setState('done')
        }
        rafRef.current = requestAnimationFrame(tick)
    }, [duration, getRender])

    const toggle = useCallback(() => (state === 'playing' ? stop() : play()), [state, stop, play])

    useEffect(() => {
        if (state === 'playing' && (!inView || reduced)) stop()
    }, [state, inView, reduced, stop])

    useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

    return { state, toggle, showButton: !reduced }
}
