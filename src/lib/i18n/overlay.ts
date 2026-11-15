/**
 * English overlays for nested research data (lib/seasons.ts, lib/methodology.ts, lib/data.ts):
 * the Hungarian object stays the source of numbers, the overlay only carries the English strings,
 * in the same shape (arrays matched by index). Used through `useResearchData` (research-en.ts).
 */

export type Overlay<T> = T extends readonly (infer U)[]
  ? readonly (Overlay<U> | undefined)[]
  : T extends object
    ? { [K in keyof T]?: Overlay<T[K]> }
    : T

/** Deep merge: plain objects key by key, arrays index by index, everything else replaced. */
export function overlay<T>(base: T, over: Overlay<T> | undefined): T {
  if (over === undefined) return base
  if (Array.isArray(base)) {
    const o = over as readonly unknown[]
    return base.map((item, i) => overlay(item, o[i] as never)) as T
  }
  if (base && typeof base === 'object' && !isReactElement(base)) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const [k, v] of Object.entries(over as Record<string, unknown>)) {
      out[k] = overlay((base as Record<string, unknown>)[k], v as never)
    }
    return out as T
  }
  return over as T
}

function isReactElement(v: object): boolean {
  return '$$typeof' in v
}
