'use client'

import type { ReactNode } from 'react'
import styles from './PhotoCredit.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'

/**
 * Where and when a photo was taken, in one form across the site: "Fotó: Lakitelek, 2026. április 6."
 * A span (block), so it can close a caption paragraph.
 */
export default function PhotoCredit({ children, plural = false, className }: { children: ReactNode; plural?: boolean; className?: string }) {
  const en = useLocale() === 'en'
  // the leading space keeps "…mértünk. Fotók:" apart for screen readers when it closes a paragraph
  return (
    <>
      {' '}
      <span className={className ? `${styles.credit} ${className}` : styles.credit}>
        {plural ? (en ? 'Photos' : 'Fotók') : en ? 'Photo' : 'Fotó'}: {children}
      </span>
    </>
  )
}
