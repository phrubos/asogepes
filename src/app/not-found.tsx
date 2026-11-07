import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from './not-found.module.css'

export const metadata: Metadata = {
  title: 'Az oldal nem található | Ásógépes Talajművelés',
}

const LINKS = [
  { href: '/kutatas', title: 'Kutatás', text: '3 helyszín, mért eredmények 2025 óta' },
  { href: '/problema', title: 'Probléma', text: 'Talajtömörödés és eketalp' },
  { href: '/technologia', title: 'Technológia', text: 'Az ásógép működése és modelljei' },
]

export default function NotFound() {
  return (
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
      </div>
    </main>
  )
}
