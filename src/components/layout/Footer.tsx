'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { PARTNERS } from '@/lib/partners'
import styles from './Footer.module.css'

export default function Footer() {
  const pathname = usePathname()

  // Show footer only on the homepage
  if (pathname !== '/') return null

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          {PARTNERS.map((p, i) => (
            <Fragment key={p.href}>
              {i > 0 && <div className={styles.footerDivider} aria-hidden="true"></div>}
              <a href={p.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                <Image
                  src={p.logo}
                  alt={`${p.name} – ${p.detail}`}
                  width={p.width}
                  height={p.height}
                  unoptimized
                  className={styles.logo}
                />
              </a>
            </Fragment>
          ))}
        </div>
        <small className={styles.copyright}>© 2026</small>
      </div>
    </footer>
  )
}
