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
            <span className={styles.itemName}>Neumann János Egyetem</span>
            <span className={styles.itemDetail}>Kertészeti és Vidékfejlesztési Kar</span>
          </div>
          <div className={styles.footerDivider}></div>
          <div className={styles.footerItem}>
            <span className={styles.itemName}>Agroskill Kft.</span>
            <span className={styles.itemDetail}>Szentkirály</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
