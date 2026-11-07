/*
 * Shared pieces of the soil-profile animations (ticket 001): easing, an attribute writer that skips
 * unchanged values, and the machine palette. The animations write SVG attributes directly in a
 * requestAnimationFrame loop; React only renders the finished (static) picture.
 */

/** The finished picture fades into the compact soil before the machine starts. */
export const FADE = 0.6

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
export const easeIn = (p: number) => p * p * p
const bezier = (x1: number, y1: number, x2: number, y2: number) => (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 8; i++) {
        const f = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3 - x
        const d = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t
        if (Math.abs(d) < 1e-6) break
        t = Math.min(1, Math.max(0, t - f / d))
    }
    return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3
}
export const easeOut = bezier(0.23, 1, 0.32, 1)
export const easeInOut = bezier(0.65, 0, 0.35, 1)

/** Fixed precision: server and browser Math.sin/cos may differ in the last digits. */
export const f2 = (v: number) => v.toFixed(2)

/** setAttribute that only writes when the value changes (most clods are at rest in most frames). */
export const makeAttrSetter = () => {
    const cache = new Map<Element, Record<string, string>>()
    return (node: Element, attr: string, val: string) => {
        let m = cache.get(node)
        if (!m) { m = {}; cache.set(node, m) }
        if (m[attr] !== val) { m[attr] = val; node.setAttribute(attr, val) }
    }
}

/** Warm steel, after the machines in the OperationPrinciple video. */
export const METAL = {
    body: '#8f877c', edge: '#3f382f', hi: '#c9c1b3', plate: '#ddd6c9', hub: '#e7e1d6', disc: '#746c61',
    drum: '#3a332c', drumIn: '#4d453b', tine: '#ecdfc6', line: 'rgba(0,0,0,0.4)',
}
