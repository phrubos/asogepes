/**
 * Contact details of the two partners, shown by shared/ContactFooter (page ends and the home footer).
 * Only real data goes here: a field left out is simply not shown (the university's phone, e-mail and
 * address are still missing, ticket 023). The Agroskill e-mail may stay a personal address (user, 2026-11-14).
 */
export interface ContactLink {
  label: string
  href: string
}

export type SocialKind = 'facebook' | 'youtube' | 'instagram' | 'tiktok'

export interface PartnerContact {
  /** Must match a PARTNERS name in lib/partners.ts (the logo comes from there) */
  partner: string
  /** Column title on desktop, e.g. 'Gép, bemutató · Agroskill' */
  title: string
  /** Short role under the logo in the phone accordion */
  role: string
  /** English column title (ticket 025) */
  titleEn: string
  phone?: ContactLink
  email?: ContactLink
  /** labelEn: the same address for an English reader (country added) */
  address?: { label: string; labelEn: string; mapsHref?: string }
  web?: ContactLink
  socials?: { kind: SocialKind; label: string; href: string }[]
}

export const CONTACTS: PartnerContact[] = [
  {
    partner: 'Agroskill Kft.',
    title: 'Gép, bemutató · Agroskill',
    role: 'Gép, bemutató, ajánlat',
    titleEn: 'Machines, demos · Agroskill',
    phone: { label: '+36 30 349 7789', href: 'tel:+36303497789' },
    email: { label: 'kis.pal@agroskill.hu', href: 'mailto:kis.pal@agroskill.hu' },
    address: {
      label: 'Ipartelep útja 6., 6031 Szentkirály',
      labelEn: 'Ipartelep útja 6, 6031 Szentkirály, Hungary',
      mapsHref: 'https://www.google.com/maps/search/?api=1&query=Ipartelep+%C3%BAtja+6+6031+Szentkir%C3%A1ly',
    },
    web: { label: 'agroskill.hu', href: 'https://www.agroskill.hu/' },
    socials: [
      { kind: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/agroskillkft' },
      { kind: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@agroskillkft' },
      { kind: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/agroskill.kft' },
      { kind: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@agroskillkft' },
    ],
  },
  {
    partner: 'Neumann János Egyetem',
    title: 'Kutatás · NJE KVK',
    role: 'Kutatás, mérések',
    titleEn: 'Research · NJE University',
    address: { label: 'Kecskemét', labelEn: 'Kecskemét, Hungary' },
    web: { label: 'kvk.nje.hu', href: 'https://kvk.nje.hu/' },
  },
]
