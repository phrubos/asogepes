'use client'

import { usePathname } from 'next/navigation'
import ContactFooter from '@/components/shared/ContactFooter/ContactFooter'
import SoilHorizon from '@/components/shared/SoilGround/SoilGround'
import { pageFromPath } from '@/lib/i18n/config'
import styles from './Footer.module.css'

/** Home page footer: the contact footer (ticket 023); the content pages show it in their PageEnd */
export default function Footer() {
  const pathname = usePathname()

  // Show footer only on the home page (either language)
  if (pageFromPath(pathname) !== 'home') return null

  return (
    <footer className={styles.footer}>
      <SoilHorizon />
      <div className={styles.inner}>
        <ContactFooter />
      </div>
    </footer>
  )
}
