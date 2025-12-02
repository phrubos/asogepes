'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navigation.module.css'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/problema', label: 'A Probléma' },
    { href: '/megoldas', label: 'Megoldás' },
    { href: '/kiserlet', label: 'Kísérletek' },
    { href: '/eredmenyek', label: 'Eredmények' },
  ]

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.navLogo}>
          <span className={styles.logoIcon}>◈</span>
          Ásógép Kutatás
        </Link>
        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? styles.active : ''}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
