import type { MeasureDate } from '@/lib/seasons'
import { monthLower, monthName } from '@/lib/months'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import type { Locale } from '@/lib/i18n/config'

/** The month of a measurement, written out: "Április" (no eleje / közepe / vége, client decision 2026-11-08). */
export default function DateLabel({ date }: { date: MeasureDate }) {
  return <span>{monthName(date, useLocale())}</span>
}

/** In a sentence: "április" / "April" */
export function dateText(date: MeasureDate, locale: Locale = 'hu'): string {
  return monthLower(date, locale)
}
