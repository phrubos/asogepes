'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { counterpartPath, type Locale } from '@/lib/i18n/config'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { savePosition } from '@/lib/i18n/switchPosition'
import styles from './LanguageSwitch.module.css'

/** Hungarian tricolour, 3:2 */
function FlagHu() {
  return (
    <svg width="20" height="14" viewBox="0 0 3 2" preserveAspectRatio="none" focusable="false">
      <rect width="3" height="2" fill="#436F4D" />
      <rect width="3" height="1.333" fill="#FFFFFF" />
      <rect width="3" height="0.667" fill="#CD2A3E" />
    </svg>
  )
}

/** Union Jack, simplified to 20×14 */
function FlagUk({ id }: { id: string }) {
  return (
    <svg width="20" height="14" viewBox="0 0 60 30" preserveAspectRatio="none" focusable="false">
      <clipPath id={id}>
        <path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 60,30M60,0 0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0,0 60,30M60,0 0,30" clipPath={`url(#${id})`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0v30M0,15h60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0v30M0,15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
}

/** Flag + code; both roll up together, the second letter a beat later (mockup B) */
function Roller({ id }: { id: string }) {
  return (
    <>
      <span className={styles.flag} aria-hidden="true">
        <span className={styles.track}>
          <FlagHu />
          <FlagUk id={id} />
        </span>
      </span>
      <span className={styles.code} aria-hidden="true">
        <span className={styles.col}>
          <span className={styles.track}>
            <span>H</span>
            <span>E</span>
          </span>
        </span>
        <span className={styles.col}>
          <span className={styles.track}>
            <span>U</span>
            <span>N</span>
          </span>
        </span>
      </span>
    </>
  )
}

/** Wait for the roll before leaving, so the switch is seen to answer (the other language is a full page load) */
const ROLL_MS = 320

/**
 * HU / EN switch (ticket 025, mockup B "Gördülő betűk"): a link to the same page in the other language.
 * The query (`?section=`) and hash come along, so a deep link lands on the same section.
 * `inline`: compact button in the desktop menu; `row`: full-width row at the foot of the phone menu.
 */
export default function LanguageSwitch({ variant = 'inline' }: { variant?: 'inline' | 'row' }) {
  const locale = useLocale()
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const [leaving, setLeaving] = useState(false)
  const target: Locale = locale === 'en' ? 'hu' : 'en'
  const href = counterpartPath(pathname)
  // the switch shows the language it is rolling to while the next page loads
  const en = leaving ? target === 'en' : locale === 'en'
  const label = target === 'en' ? 'Switch to English' : 'Váltás magyarra'

  // back button: a page restored from the back-forward cache must not keep the rolled-over state
  useEffect(() => {
    const reset = () => setLeaving(false)
    window.addEventListener('pageshow', reset)
    return () => window.removeEventListener('pageshow', reset)
  }, [])

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const full = href + window.location.search + window.location.hash
    e.currentTarget.href = full
    // new tab / window: let the browser open the updated href
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    setLeaving(true)
    savePosition(new URL(full, window.location.href).pathname)
    window.setTimeout(() => window.location.assign(full), reduced ? 0 : ROLL_MS)
  }

  const common = {
    href,
    hrefLang: target,
    lang: target,
    onClick,
    'aria-label': label,
  }

  if (variant === 'row') {
    return (
      <a {...common} className={`${styles.row} ${en ? styles.en : ''}`}>
        <span className={styles.word} aria-hidden="true">
          <span className={styles.track}>
            <span>Nyelv</span>
            <span>Language</span>
          </span>
        </span>
        <span className={styles.chip}>
          <Roller id="uk-flag-row" />
        </span>
      </a>
    )
  }

  return (
    <a {...common} className={`${styles.inline} ${en ? styles.en : ''}`}>
      <Roller id="uk-flag-inline" />
    </a>
  )
}
