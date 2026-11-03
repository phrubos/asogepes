import type { MeasureDate } from '@/lib/seasons'
import styles from './DateLabel.module.css'

const MONTHS: Record<string, string> = {
  'JAN.': 'január', 'FEBR.': 'február', 'MÁRC.': 'március', 'ÁPR.': 'április', 'MÁJ.': 'május', 'JÚN.': 'június',
  'JÚL.': 'július', 'AUG.': 'augusztus', 'SZEPT.': 'szeptember', 'OKT.': 'október', 'NOV.': 'november', 'DEC.': 'december',
}

/** Month plus the third of the month (eleje / közepe / vége) in a smaller gold word. */
/** `stack`: on phones and tablets the third goes on its own line (narrow columns). */
export default function DateLabel({ date, stack }: { date: MeasureDate; stack?: boolean }) {
  const full = (MONTHS[date.month] ?? date.month) + (date.third ? ' ' + date.third : '')
  return (
    <span aria-label={full}>
      <span aria-hidden="true">{date.month}</span>
      {date.third && <span className={`${styles.third} ${stack ? styles.stack : ''}`} aria-hidden="true">{date.third}</span>}
    </span>
  )
}

export function dateText(date: MeasureDate): string {
  return date.month.toLowerCase() + (date.third ? ' ' + date.third : '')
}
