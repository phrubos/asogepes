'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface SeasonState {
  /** Selected season; the whole research page follows it */
  year: number
  years: number[]
  setYear: (year: number) => void
}

const SeasonContext = createContext<SeasonState | null>(null)

const PARAM = 'evad'

/**
 * One season choice for the whole /kutatas page, kept in `?evad=` next to `?section=`.
 * The server render and the first client render use the latest year; the URL is read after
 * mount so hydration never mismatches.
 */
export function SeasonProvider({ years, children }: { years: number[]; children: ReactNode }) {
  const latest = years[years.length - 1]
  const [year, setYearState] = useState(latest)

  useEffect(() => {
    const fromUrl = Number(new URL(window.location.href).searchParams.get(PARAM))
    if (years.includes(fromUrl)) setYearState(fromUrl)
  }, [years])

  const setYear = useCallback(
    (next: number) => {
      setYearState(next)
      const url = new URL(window.location.href)
      if (next === latest) url.searchParams.delete(PARAM)
      else url.searchParams.set(PARAM, String(next))
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
    },
    [latest],
  )

  const value = useMemo(() => ({ year, years, setYear }), [year, years, setYear])
  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>
}

export function useSeason(): SeasonState {
  const ctx = useContext(SeasonContext)
  if (!ctx) throw new Error('useSeason must be used inside <SeasonProvider>')
  return ctx
}
