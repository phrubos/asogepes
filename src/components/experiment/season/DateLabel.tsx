import type { MeasureDate } from '@/lib/seasons'
import { monthLower, monthName } from '@/lib/months'

/** The month of a measurement, written out: "Április" (no eleje / közepe / vége, client decision 2026-11-08). */
export default function DateLabel({ date }: { date: MeasureDate }) {
  return <span>{monthName(date)}</span>
}

export function dateText(date: MeasureDate): string {
  return monthLower(date)
}
