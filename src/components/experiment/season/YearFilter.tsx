'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { SeasonContext } from './SeasonContext'

export type SiteId = 'szentkiraly' | 'kecskemet' | 'lakitelek'

interface YearFilterState {
  /** every year measured at each site */
  all: Record<SiteId, number[]>
  /** the chosen years per site (never empty) */
  selected: Record<SiteId, number[]>
  /** turns one year on or off; the last chosen year of a site stays on */
  toggle: (site: SiteId, year: number) => void
  /** chooses one year only */
  only: (site: SiteId, year: number) => void
}

const YearFilterContext = createContext<YearFilterState | null>(null)

const PARAMS: Record<SiteId, string> = { szentkiraly: 'evad-szk', kecskemet: 'evad-kb', lakitelek: 'evad-lk' }

/**
 * Which years /kutatas shows, per site (ticket 015): 2025, 2026 or both, set by the 25 / 26 chips
 * beside each site in the rail, in the phone's contents sheet and in Helyszín adatok.
 * Kept in `?evad-szk=2025` / `?evad-lk=2025,2026` (old single-year links still work); all years
 * when the param is missing. The server render and the first client render show all years, the
 * URL is read after mount so hydration never mismatches.
 */
export function YearFilterProvider({ all, children }: { all: Record<SiteId, number[]>; children: ReactNode }) {
  const [selected, setSelected] = useState<Record<SiteId, number[]>>(all)

  useEffect(() => {
    const params = new URL(window.location.href).searchParams
    const legacy = params.get('evad')
    const next = { ...all }
    ;(Object.keys(all) as SiteId[]).forEach((site) => {
      const raw = params.get(PARAMS[site]) ?? legacy
      if (!raw) return
      const ys = raw.split(',').map(Number).filter((y) => all[site].includes(y))
      if (ys.length) next[site] = ys
    })
    setSelected(next)
  }, [all])

  const write = useCallback(
    (site: SiteId, ys: number[]) => {
      setSelected((cur) => ({ ...cur, [site]: ys }))
      const url = new URL(window.location.href)
      url.searchParams.delete('evad')
      if (ys.length === all[site].length) url.searchParams.delete(PARAMS[site])
      else url.searchParams.set(PARAMS[site], ys.join(','))
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
    },
    [all],
  )

  const toggle = useCallback(
    (site: SiteId, year: number) => {
      const cur = selected[site]
      const next = cur.includes(year) ? cur.filter((y) => y !== year) : [...cur, year].sort()
      if (next.length) write(site, next)
    },
    [selected, write],
  )
  const only = useCallback((site: SiteId, year: number) => write(site, [year]), [write])

  const value = useMemo(() => ({ all, selected, toggle, only }), [all, selected, toggle, only])
  return <YearFilterContext.Provider value={value}>{children}</YearFilterContext.Provider>
}

export function useYearFilter(): YearFilterState {
  const ctx = useContext(YearFilterContext)
  if (!ctx) throw new Error('useYearFilter must be used inside <YearFilterProvider>')
  return ctx
}

/** A block pinned to one season; its own year controls (e.g. YearBridge) narrow the site to that year */
export function FixedSeason({ site, year, divided, children }: { site: SiteId; year: number; divided?: boolean; children: ReactNode }) {
  const { only, all } = useYearFilter()
  const siteYears = all[site]
  const value = useMemo(
    () => ({ year, years: [year], setYear: (y: number) => only(site, y), divided, siteYears }),
    [site, year, only, divided, siteYears],
  )
  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>
}
