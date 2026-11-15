'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Navigation.module.css'
import LanguageSwitch from './LanguageSwitch'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { PAGE_PATHS, pageFromPath, bilingual, type PageKey } from '@/lib/i18n/config'

const navItems: { page: PageKey; label: { hu: string; en: string } }[] = [
  { page: 'home', label: { hu: 'Főoldal', en: 'Home' } },
  { page: 'problem', label: { hu: 'Probléma', en: 'Problem' } },
  { page: 'technology', label: { hu: 'Technológia', en: 'Technology' } },
  { page: 'research', label: { hu: 'Kutatás', en: 'Research' } },
]

/** Clicking the menu item of the page you are on scrolls it back to the top */
const RESET_EVENT: Partial<Record<PageKey, string>> = {
  problem: 'reset-problem-scroll',
  technology: 'reset-technology-scroll',
  research: 'reset-research-scroll',
}

const TEXT = bilingual(
  { main: 'Fő navigáció', mobile: 'Mobil navigáció', open: 'Menü megnyitása', close: 'Menü bezárása' },
  { main: 'Main navigation', mobile: 'Mobile navigation', open: 'Open menu', close: 'Close menu' },
)

/** Layout width of the sliding underline; its visible width comes from scaleX */
const INDICATOR_BASE = 100

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const lang = useLocale()
  const t = TEXT[lang]
  const currentPage = pageFromPath(pathname)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Find active index based on pathname
  useEffect(() => {
    const index = navItems.findIndex(item => item.page === pageFromPath(pathname))
    setActiveIndex(index) // -1 off the menu (e.g. the 404 page): no item underlined
    setScrolled(false) // Reset scrolled state on route change
  }, [pathname])

  // Update indicator position
  useEffect(() => {
    const updateIndicator = () => {
      if (!navRef.current || !mounted) return
      const targetIndex = hoverIndex !== null ? hoverIndex : activeIndex
      if (targetIndex < 0) {
        setIndicatorStyle(prev => ({ ...prev, width: 0 }))
        return
      }
      const links = navRef.current.querySelectorAll('a')
      const activeLink = links[targetIndex] as HTMLElement

      if (activeLink) {
        const navRect = navRef.current.getBoundingClientRect()
        const linkRect = activeLink.getBoundingClientRect()

        // Measure padding to underline only the text
        const computedStyle = window.getComputedStyle(activeLink)
        const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0
        const paddingRight = parseFloat(computedStyle.paddingRight) || 0

        setIndicatorStyle({
          left: (linkRect.left - navRect.left) + paddingLeft,
          width: linkRect.width - (paddingLeft + paddingRight),
        })
      }
    }
    if (mounted) {
      updateIndicator()
      window.addEventListener('resize', updateIndicator)
    }
    return () => window.removeEventListener('resize', updateIndicator)
  }, [activeIndex, hoverIndex, mounted, lang])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    const handleCustomScroll = (e: Event) => {
      const customEvent = e as CustomEvent
      setScrolled(customEvent.detail.scrollTop > 50)
    }

    if (mounted) {
      handleScroll()
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('book-scroll', handleCustomScroll)
    }
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('book-scroll', handleCustomScroll)
    }
  }, [mounted])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mounted) {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    return () => {
      if (mounted) {
        document.body.style.overflow = ''
      }
    }
  }, [mobileMenuOpen, mounted])

  return (
    <header className={`${styles.header} ${mounted && scrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerInner}>
        {/* Desktop Navigation */}
        <nav className={styles.nav} ref={navRef} aria-label={t.main}>
          {/* Sliding Indicator - only render after mount. A 100px line moved by x and stretched by
              scaleX (transform only), so hovering the menu never re-lays out the header */}
          {mounted && (
            <motion.div
              className={styles.indicator}
              style={{ originX: 0 }}
              animate={{
                x: indicatorStyle.left,
                scaleX: indicatorStyle.width / INDICATOR_BASE,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            />
          )}

          {navItems.map((item, index) => (
            <Link
              key={item.page}
              href={PAGE_PATHS[item.page][lang]}
              className={`${styles.navLink} ${currentPage === item.page ? styles.active : ''}`}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={() => {
                // clicking the page you are on scrolls it back to the top
                const reset = RESET_EVENT[item.page]
                if (currentPage === item.page && reset) window.dispatchEvent(new CustomEvent(reset))
              }}
              aria-current={currentPage === item.page ? 'page' : undefined}
            >
              {item.label[lang]}
            </Link>
          ))}
          <span className={styles.divider} aria-hidden="true" />
          <LanguageSwitch />
        </nav>

        {/* Mobile Toggle */}
        <button
          className={styles.menuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? t.close : t.open}
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

      {/* Mobile Menu - only render after mount */}
      {mounted && (
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                className={styles.mobileOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                onClick={() => setMobileMenuOpen(false)}
              />
              {/* closing is quicker than opening and has no stagger (ticket 021) */}
              <motion.nav
                className={styles.mobileNav}
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                animate={{ clipPath: 'inset(0 0 0% 0)' }}
                exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                aria-label={t.mobile}
              >
                <div className={styles.mobileNavInner}>
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.page}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10, transition: { duration: 0.12 } }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        href={PAGE_PATHS[item.page][lang]}
                        className={`${styles.mobileLink} ${currentPage === item.page ? styles.mobileActive : ''}`}
                        onClick={() => {
                          setMobileMenuOpen(false)
                        }}
                        aria-current={currentPage === item.page ? 'page' : undefined}
                      >
                        <span className={styles.mobileLinkNumber}>
                          {String(index).padStart(2, '0')}
                        </span>
                        <span className={styles.mobileLinkText}>{item.label[lang]}</span>
                        {currentPage === item.page && (
                          <motion.span
                            className={styles.mobileActiveMark}
                            layoutId="mobileActive"
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    className={styles.mobileLang}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.12 } }}
                    transition={{ delay: 0.1 + navItems.length * 0.05 }}
                  >
                    <LanguageSwitch variant="row" />
                  </motion.div>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      )}
    </header>
  )
}
