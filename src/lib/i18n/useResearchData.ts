'use client'

import { useLocale } from './LocaleProvider'
import { RESEARCH_EN } from './research-en'
import type { Locale } from './config'

/** The research data object in the page language: the Hungarian original, or its English overlay (research-en.ts). */
export function researchData<T>(base: T, locale: Locale): T {
  return locale === 'en' ? ((RESEARCH_EN.get(base) as T | undefined) ?? base) : base
}

export function useResearchData<T>(base: T): T {
  return researchData(base, useLocale())
}
