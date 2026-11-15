'use client'

import { createContext, useContext } from 'react'
import type { Locale } from './config'

const LocaleContext = createContext<Locale>('hu')

/** Set once per root layout from the route group ((hu) or (en)); client components read it with useLocale() */
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}
