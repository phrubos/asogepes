import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PARTNERS } from '@/lib/partners'
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
        {PARTNERS.map((p) => (
          <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer" className={styles.partner}>
            <Image
              src={p.logo}
              alt={`${p.name} – ${p.detail}`}
              width={p.width}
              height={p.height}
              unoptimized
              className={styles.partnerLogo}
            />
          </a>
        ))}
      </div>
    </div>
  )
}
