import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from '../../not-found.module.css'

export const metadata: Metadata = {
  title: 'Page not found | Spading-Machine Tillage',
}

const LINKS = [
  { href: '/en/research', title: 'Research', text: '3 sites, measured results since 2025' },
  { href: '/en/problem', title: 'Problem', text: 'Soil compaction and the plough pan' },
  { href: '/en/technology', title: 'Technology', text: 'How the spading machine works, and its models' },
]

/** English 404 (ticket 025); the Hungarian one is app/global-not-found.tsx */
export default function EnglishNotFound() {
  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.inner}>
        <span className={styles.kicker}>404 – page not found</span>
        <h1 className={styles.title}>This page could not be found</h1>
        <p className={styles.text}>
          The address may be mistyped, or the page has moved. Every part of the research is reachable from here:
        </p>

        <Link href="/en" className={styles.home}>
          Back to the home page
        </Link>

        <nav aria-label="Pages" className={styles.links}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.link}>
              <span className={styles.linkTitle}>{l.title}</span>
              <span className={styles.linkText}>{l.text}</span>
              <ArrowRight className={styles.arrow} size={20} aria-hidden="true" />
            </Link>
          ))}
        </nav>

        <p className={styles.english} lang="hu">
          Az oldal nem található. <Link href="/">Tovább a magyar oldalra</Link>
        </p>
      </div>
    </main>
  )
}
