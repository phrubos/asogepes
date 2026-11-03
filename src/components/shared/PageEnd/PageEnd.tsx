import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from './PageEnd.module.css'

export interface PageEndNext {
  href: string
  /** Small gold word above the title, e.g. 'Következő oldal' */
  kicker: string
  title: string
  text: string
}

/**
 * The end of a content page: where to go next, and who is behind the research.
 * Rendered by ScrollLayout after the last section (not a section, so not in the side nav).
 */
export default function PageEnd({ next }: { next: PageEndNext }) {
  return (
    <div className={styles.pageEnd}>
      <nav aria-label="Tovább">
        <Link href={next.href} className={styles.next}>
          <span className={styles.kicker}>{next.kicker}</span>
          <span className={styles.title}>{next.title}</span>
          <span className={styles.text}>{next.text}</span>
          <ArrowRight className={styles.arrow} size={22} aria-hidden="true" />
        </Link>
      </nav>

      <div className={styles.partners}>
        <span className={styles.partnersLabel}>A kutatást végezte</span>
        <a href="https://kvk.nje.hu/" target="_blank" rel="noopener noreferrer" className={styles.partner}>
          <span className={styles.partnerName}>Neumann János Egyetem</span>
          <span className={styles.partnerDetail}>Kertészeti és Vidékfejlesztési Kar</span>
        </a>
        <a href="https://www.agroskill.hu/" target="_blank" rel="noopener noreferrer" className={styles.partner}>
          <span className={styles.partnerName}>Agroskill Kft.</span>
          <span className={styles.partnerDetail}>Szentkirály</span>
        </a>
      </div>
    </div>
  )
}
