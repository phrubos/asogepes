'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import styles from './Navigation.module.css'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const navRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Főoldal' },
    { href: '/problema', label: 'Probléma' },
    { href: '/megoldas', label: 'Megoldás' },
    { href: '/kiserlet', label: 'Kísérletek' },
    { href: '/eredmenyek', label: 'Eredmények' },
  ]

  // Find active index based on pathname
  useEffect(() => {
    const index = navItems.findIndex(item => item.href === pathname)
    setActiveIndex(index >= 0 ? index : 0)
  }, [pathname])

  // Update indicator position
  useEffect(() => {
    const updateIndicator = () => {
      if (!navRef.current) return
      const targetIndex = hoverIndex !== null ? hoverIndex : activeIndex
      const links = navRef.current.querySelectorAll('a')
      const activeLink = links[targetIndex] as HTMLElement
      if (activeLink) {
        const navRect = navRef.current.getBoundingClientRect()
        const linkRect = activeLink.getBoundingClientRect()
        setIndicatorStyle({
          left: linkRect.left - navRect.left,
          width: linkRect.width,
        })
      }
    }
    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [activeIndex, hoverIndex])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  // Dark pages need light text
  const isDarkPage = pathname === '/' || pathname === '/megoldas' || pathname === '/eredmenyek'

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${isDarkPage && !scrolled ? styles.onDark : ''}`}>
      <div className={styles.headerInner}>
        {/* Desktop Navigation */}
        <nav className={styles.nav} ref={navRef} aria-label="Fő navigáció">
          {/* Sliding Indicator */}
          <motion.div
            className={styles.indicator}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          className={styles.menuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Menü bezárása' : 'Menü megnyitása'}
          aria-expanded={mobileMenuOpen}
        >
          <motion.div
            className={styles.menuIcon}
            animate={mobileMenuOpen ? 'open' : 'closed'}
          >
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 6 },
              }}
            />
            <motion.span
              variants={{
                closed: { opacity: 1, x: 0 },
                open: { opacity: 0, x: 10 },
              }}
            />
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -6 },
              }}
            />
          </motion.div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className={styles.mobileOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              className={styles.mobileNav}
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              exit={{ clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Mobil navigáció"
            >
              <div className={styles.mobileNavInner}>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={`${styles.mobileLink} ${pathname === item.href ? styles.mobileActive : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      <span className={styles.mobileLinkNumber}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={styles.mobileLinkText}>{item.label}</span>
                      {pathname === item.href && (
                        <motion.span
                          className={styles.mobileActiveMark}
                          layoutId="mobileActive"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
