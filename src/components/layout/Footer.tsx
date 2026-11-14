'use client'

import { usePathname } from 'next/navigation'
import ContactFooter from '@/components/shared/ContactFooter/ContactFooter'
import styles from './Footer.module.css'

/** Home page footer: the contact footer (ticket 023); the content pages show it in their PageEnd */
export default function Footer() {
  const pathname = usePathname()

  // Show footer only on the homepage
  if (pathname !== '/') return null

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <ContactFooter />
      </div>
    </footer>
  )
}
