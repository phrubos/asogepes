import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import RootDocument from '@/components/layout/RootDocument'
import { SITE_URL } from '@/lib/site'
import styles from './not-found.module.css'

// One 404 for both languages (two root layouts, ticket 025): Hungarian first, an English way out below
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Az oldal nem található · Page not found | Ásógépes Talajművelés',
}

const LINKS = [
  { href: '/kutatas', title: 'Kutatás', text: '3 helyszín, mért eredmények 2025 óta' },
  { href: '/problema', title: 'Probléma', text: 'Talajtömörödés és eketalp' },
  { href: '/technologia', title: 'Technológia', text: 'Az ásógép működése és modelljei' },
]

export default function GlobalNotFound() {
  return (
    <RootDocument locale="hu">
      <main id="main-content" className={styles.page}>
        <div className={styles.inner}>
          <span className={styles.kicker}>404 – nincs ilyen oldal</span>
          <h1 className={styles.title}>Ez az oldal nem található</h1>
          <p className={styles.text}>
            A cím elírás lehet, vagy az oldal közben máshová került. A kutatás minden része elérhető innen:
          </p>

          <Link href="/" className={styles.home}>
            Vissza a főoldalra
          </Link>

          <nav aria-label="Oldalak" className={styles.links}>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={styles.link}>
                <span className={styles.linkTitle}>{l.title}</span>
                <span className={styles.linkText}>{l.text}</span>
                <ArrowRight className={styles.arrow} size={20} aria-hidden="true" />
              </Link>
            ))}
          </nav>

          <p className={styles.english} lang="en">
            Page not found. <Link href="/en">Go to the English site</Link>
          </p>
        </div>
      </main>
    </RootDocument>
  )
}
