'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ContactFooter from '@/components/shared/ContactFooter/ContactFooter'
import SoilHorizon from '@/components/shared/SoilGround/SoilGround'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { SCROLL_TEXT } from '@/components/shared/ScrollLayout/strings'
import styles from './PageEnd.module.css'

export interface PageEndNext {
  href: string
  /** Small gold word above the title, e.g. 'Következő oldal' */
  kicker: string
  title: string
  text: string
}

/**
 * The end of a content page: where to go next, and whom to contact (ticket 023).
 * Rendered by ScrollLayout after the last section (not a section, so not in the side nav).
 */
export default function PageEnd({ next }: { next: PageEndNext }) {
  const t = SCROLL_TEXT[useLocale()]
  return (
    <div className={styles.pageEnd}>
      {/* The lid: it slides up over the contact footer, which stays put (curtain reveal) */}
      <div className={styles.lid}>
        <nav aria-label={t.next} className={styles.nextWrap}>
          <Link href={next.href} className={styles.next}>
            <span className={styles.kicker}>{next.kicker}</span>
            <span className={styles.title}>{next.title}</span>
            <span className={styles.text}>{next.text}</span>
            <ArrowRight className={styles.arrow} size={22} aria-hidden="true" />
          </Link>
        </nav>
      </div>

      <footer className={styles.contact}>
        <SoilHorizon />
        <div className={styles.contactInner}>
          <ContactFooter />
        </div>
      </footer>
    </div>
  )
}
