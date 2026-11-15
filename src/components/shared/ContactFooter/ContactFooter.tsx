'use client'

import { useId, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Link2, Mail, MapPin, Phone } from 'lucide-react'
import { CONTACTS, type PartnerContact, type SocialKind } from '@/lib/contact'
import { PARTNERS, type Partner } from '@/lib/partners'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { PAGE_PATHS, bilingual, pageFromPath, type Locale, type PageKey } from '@/lib/i18n/config'
import styles from './ContactFooter.module.css'

const TEXT = bilingual(
  {
    pages: { home: 'Főoldal', problem: 'Probléma', technology: 'Technológia', research: 'Kutatás' } as Record<PageKey, string>,
    pagesTitle: 'Oldalak',
    contact: 'Kapcsolat',
    behind: 'A kutatás mögött',
    route: 'Útvonal',
    mapNewTab: ' (térkép, új lapon)',
    newTab: 'új lapon',
    socials: 'a közösségi oldalakon',
    legal: '© 2026 Neumann János Egyetem × Agroskill Kft.',
    since: 'Ásógépes talajművelés, 2025-től',
  },
  {
    pages: { home: 'Home', problem: 'Problem', technology: 'Technology', research: 'Research' },
    pagesTitle: 'Pages',
    contact: 'Contact',
    behind: 'Behind the research',
    route: 'Directions',
    mapNewTab: ' (map, opens in a new tab)',
    newTab: 'opens in a new tab',
    socials: 'on social media',
    legal: '© 2026 John von Neumann University × Agroskill Kft.',
    since: 'Spading-machine tillage, since 2025',
  },
)

const PAGE_ORDER: PageKey[] = ['home', 'problem', 'technology', 'research']

const titleOf = (c: PartnerContact, locale: Locale) => (locale === 'en' ? c.titleEn : c.title)
const addressOf = (c: PartnerContact, locale: Locale) =>
  c.address ? (locale === 'en' ? c.address.labelEn : c.address.label) : undefined

/** Filled social marks with the symbol cut out (an SVG mask), all in currentColor so they share the
   muted footer tone and turn gold on hover; lucide 0.400 has no TikTok icon, so all four are drawn here */
const SOCIAL_CUTOUTS: Record<SocialKind, { base: ReactNode; cut: ReactNode }> = {
  facebook: {
    base: <circle cx="12" cy="12" r="10" />,
    cut: <path d="M16 7.5h-1.8a2.7 2.7 0 0 0-2.7 2.7V23M8.8 13.2h6.4" fill="none" strokeWidth={2.6} />,
  },
  youtube: {
    base: <rect x="1.5" y="5" width="21" height="14" rx="4.5" />,
    cut: <path d="M10 9v6l5.2-3z" stroke="none" />,
  },
  instagram: {
    base: <rect x="2" y="2" width="20" height="20" rx="6" />,
    cut: (
      <>
        <circle cx="12" cy="12" r="4.2" fill="none" strokeWidth={2.2} />
        <circle cx="17.2" cy="6.8" r="1.3" stroke="none" />
      </>
    ),
  },
  tiktok: {
    base: <rect x="2" y="2" width="20" height="20" rx="6" />,
    cut: <path d="M13.4 6v8.6a2.7 2.7 0 1 1-2.7-2.7M13.4 6c.3 1.9 1.7 3.3 3.8 3.5" fill="none" strokeWidth={2.2} strokeLinecap="round" />,
  },
}

function SocialIcon({ kind }: { kind: SocialKind }) {
  const maskId = useId()
  const { base, cut } = SOCIAL_CUTOUTS[kind]
  return (
    <svg className={styles.icon} width={16} height={16} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <mask id={maskId}>
        <g fill="#fff">{base}</g>
        <g fill="#000" stroke="#000">{cut}</g>
      </mask>
      <rect width="24" height="24" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  )
}

function partnerOf(c: PartnerContact): Partner | undefined {
  return PARTNERS.find((p) => p.name === c.partner)
}

/** Logo at its own aspect ratio: the height comes from the class, the width follows (never stretched) */
function Logo({ partner, className, alt = '' }: { partner: Partner; className: string; alt?: string }) {
  return (
    <Image
      src={partner.logo}
      alt={alt}
      width={partner.width}
      height={partner.height}
      unoptimized
      className={className}
    />
  )
}

function ContactRows({ c }: { c: PartnerContact }) {
  const locale = useLocale()
  const t = TEXT[locale]
  return (
    <ul className={styles.rows}>
      {c.phone && (
        <li>
          <a href={c.phone.href} className={`${styles.row} ${styles.phone}`}>
            <Phone size={16} aria-hidden="true" className={styles.icon} />
            {c.phone.label}
          </a>
        </li>
      )}
      {c.email && (
        <li>
          <a href={c.email.href} className={`${styles.row} ${styles.underlined}`}>
            <Mail size={16} aria-hidden="true" className={styles.icon} />
            {c.email.label}
          </a>
        </li>
      )}
      {c.address &&
        (c.address.mapsHref ? (
          <li>
            <a href={c.address.mapsHref} target="_blank" rel="noopener noreferrer" className={styles.row}>
              <MapPin size={16} aria-hidden="true" className={styles.icon} />
              <span className={styles.address}>
                {addressOf(c, locale)}
                <span className={styles.route}>
                  {t.route} <span aria-hidden="true">↗</span>
                  <span className="sr-only">{t.mapNewTab}</span>
                </span>
              </span>
            </a>
          </li>
        ) : (
          <li className={styles.row}>
            <MapPin size={16} aria-hidden="true" className={styles.icon} />
            {addressOf(c, locale)}
          </li>
        ))}
      {c.web && (
        <li>
          <a href={c.web.href} target="_blank" rel="noopener noreferrer" className={`${styles.row} ${styles.underlined}`}>
            <Link2 size={16} aria-hidden="true" className={styles.icon} />
            {c.web.label}
          </a>
        </li>
      )}
      {c.socials && c.socials.length > 0 && (
        <li>
          <ul className={styles.socials} aria-label={`${c.partner} ${t.socials}`}>
            {c.socials.map((s) => (
              <li key={s.kind}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.social}>
                  <SocialIcon kind={s.kind} />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </li>
      )}
    </ul>
  )
}

/** Phone/tablet "soil profile" column of one partner (variant E): logo, role, then the links stacked */
function SoilPartner({ c }: { c: PartnerContact }) {
  const locale = useLocale()
  const t = TEXT[locale]
  const p = partnerOf(c)
  const mapsHref = c.address?.mapsHref
  // the desktop column title minus the partner name ('Gép, bemutató · Agroskill' -> 'Gép, bemutató')
  const role = titleOf(c, locale).split(' · ')[0]
  return (
    <div className={styles.sPartner}>
      {p && (
        <Logo
          partner={p}
          alt={locale === 'en' ? p.nameEn : p.name}
          className={p.name === 'Neumann János Egyetem' ? styles.sLogoNje : styles.sLogoAgro}
        />
      )}
      <span className={styles.sRole}>{role}</span>
      <div className={styles.sStack}>
        {c.phone && (
          <a href={c.phone.href} className={`${styles.sLink} ${styles.sTel}`}>
            {c.phone.label}
          </a>
        )}
        {c.email && (
          <a href={c.email.href} className={styles.sLink} aria-label={`E-mail: ${c.email.label}`}>
            E-mail
          </a>
        )}
        {c.address && !mapsHref && <span className={styles.sLink}>{addressOf(c, locale)}</span>}
        {mapsHref && (
          <a href={mapsHref} target="_blank" rel="noopener noreferrer" className={styles.sLink}>
            {t.route}&nbsp;<span aria-hidden="true">↗</span>
            <span className="sr-only">{t.mapNewTab}</span>
          </a>
        )}
        {c.web && (
          <a href={c.web.href} target="_blank" rel="noopener noreferrer" className={styles.sLink}>
            {c.web.label}
          </a>
        )}
      </div>
    </div>
  )
}

/**
 * Who to contact, at the end of every page (ticket 023, canvas variant 5).
 * Desktop: four columns (partners' logos · pages · Agroskill · NJE KVK) and a © line.
 * <=1024px (variant E, user 2026-11-14): the partners side by side in two short columns, © and socials
 * on one bottom line; the soil background itself is drawn by the footer element (PageEnd, layout/Footer).
 * On phones the desktop columns, pages and logo row are hidden.
 * DOM order is the phone order (contacts first, so focus follows what is read); desktop places the columns by grid area.
 */
export default function ContactFooter() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = TEXT[locale]
  const currentPage = pageFromPath(pathname)
  const soilId = useId()
  const nje = PARTNERS.find((p) => p.name === 'Neumann János Egyetem')
  const agro = PARTNERS.find((p) => p.name === 'Agroskill Kft.')

  return (
    <div className={styles.contact}>
      {CONTACTS.map((c) => (
        <section key={c.partner} className={styles.partner} aria-label={locale === 'en' ? partnerOf(c)?.nameEn ?? c.partner : c.partner}>
          <h2 className={styles.label}>{titleOf(c, locale)}</h2>
          <ContactRows c={c} />
        </section>
      ))}

      <section className={styles.soil} aria-labelledby={soilId}>
        <h2 id={soilId} className="sr-only">{t.contact}</h2>
        <div className={styles.sCols}>
          {CONTACTS.map((c) => (
            <SoilPartner key={c.partner} c={c} />
          ))}
        </div>
        <div className={styles.sBottom}>
          <span className={styles.sLegal}>
            <span aria-hidden="true">© 2026 NJE × Agroskill</span>
            <span className="sr-only">{t.legal}</span>
          </span>
          {CONTACTS.map((c) =>
            c.socials && c.socials.length > 0 ? (
              <ul key={c.partner} className={styles.sSocials} aria-label={`${c.partner} ${t.socials}`}>
                {c.socials.map((sc) => (
                  <li key={sc.kind}>
                    <a href={sc.href} target="_blank" rel="noopener noreferrer" className={styles.sSocial} aria-label={sc.label}>
                      <SocialIcon kind={sc.kind} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null,
          )}
        </div>
      </section>

      <nav aria-label={t.pagesTitle} className={styles.pages}>
        <h2 className={styles.label}>{t.pagesTitle}</h2>
        <ul className={styles.pageList}>
          {PAGE_ORDER.map((page) => {
            const current = currentPage === page
            return (
              <li key={page}>
                <Link href={PAGE_PATHS[page][locale]} aria-current={current ? 'page' : undefined} className={styles.pageLink}>
                  {t.pages[page]}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className={styles.brand}>
        <h2 className={styles.label}>{t.behind}</h2>
        <div className={styles.logos}>
          {[nje, agro].map((p) =>
            p ? (
              <a
                key={p.href}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={
                  locale === 'en'
                    ? `${p.nameEn} – ${p.detailEn} (${t.newTab})`
                    : `${p.name} – ${p.detail} (${t.newTab})`
                }
                className={styles.logoLink}
              >
                <Logo partner={p} className={p === nje ? styles.logoNje : styles.logoAgro} />
              </a>
            ) : null,
          )}
        </div>
      </div>

      <div className={styles.legal}>
        <span>{t.legal}</span>
        <span>{t.since}</span>
      </div>
    </div>
  )
}
