'use client'

import { usePathname } from 'next/navigation'
import styles from './Footer.module.css'

export default function Footer() {
  const pathname = usePathname()

  // Show footer only on the homepage
  if (pathname !== '/') return null

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerItem}>
            <a
              href="https://kvk.nje.hu/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <span className={styles.itemName}>Neumann János Egyetem</span>
              <span className={styles.itemDetail}>Kertészeti és Vidékfejlesztési Kar</span>
            </a>
          </div>
          <div className={styles.footerDivider}></div>
          <div className={styles.footerItem}>
            <a
              href="https://www.agroskill.hu/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <span className={styles.itemName}>Agroskill Kft.</span>
              <span className={styles.itemDetail}>Szentkirály</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
