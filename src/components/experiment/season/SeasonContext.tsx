'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface SeasonState {
  /** Selected season; every block of one site follows it */
  year: number
  years: number[]
  setYear: (year: number) => void
  /** the block sits under a year divider (both years shown, ticket 015): no own year label */
  divided?: boolean
  /** every year measured at the site (a FixedSeason block has `years: [year]`): decides "másik év" */
  siteYears?: number[]
}

export const SeasonContext = createContext<SeasonState | null>(null)

const PARAM = 'evad'

/**
 * One season choice per site (each site block of /kutatas has its own provider, mobile UX review
 * 11-09 K3: a page-wide choice made Kecskemét say "2026-ban itt nem mértünk" after a switch at
 * Szentkirály). Kept in `?<param>=` next to `?section=`; the old page-wide `?evad=` still works.
 * The server render and the first client render use the latest year; the URL is read after
 * mount so hydration never mismatches.
 */
export function SeasonProvider({ years, param = PARAM, children }: { years: number[]; param?: string; children: ReactNode }) {
  const latest = years[years.length - 1]
  const [year, setYearState] = useState(latest)

  useEffect(() => {
    const params = new URL(window.location.href).searchParams
    const fromUrl = Number(params.get(param) ?? params.get(PARAM))
    if (years.includes(fromUrl)) setYearState(fromUrl)
  }, [years, param])

  const setYear = useCallback(
    (next: number) => {
      setYearState(next)
      const url = new URL(window.location.href)
      if (next === latest) url.searchParams.delete(param)
      else url.searchParams.set(param, String(next))
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
    },
    [latest, param],
  )

  const value = useMemo(() => ({ year, years, setYear }), [year, years, setYear])
  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>
}

export function useSeason(): SeasonState {
  const ctx = useContext(SeasonContext)
  if (!ctx) throw new Error('useSeason must be used inside <SeasonProvider>')
  return ctx
}
