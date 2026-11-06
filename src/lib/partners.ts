/**
 * The two partners behind the research, with their own logos (light versions, for dark backgrounds).
 * Used by the home footer, the content page ends and the share images. The logos are the partners'
 * own marks: never recolour or crop them; the site's earth palette stays everywhere else.
 */
export interface Partner {
  name: string
  /** Read out with the logo (the logo already shows it visually) */
  detail: string
  href: string
  logo: string
  /** Intrinsic size of the logo file, for the aspect ratio */
  width: number
  height: number
}

export const PARTNERS: Partner[] = [
  {
    name: 'Neumann János Egyetem',
    detail: 'Kertészeti és Vidékfejlesztési Kar',
    href: 'https://kvk.nje.hu/',
    // kvk.nje.hu/img/logo-kvk.nje.hu.svg with the dark text set to the site's white (#FDFCFA)
    logo: '/images/partners/nje-kvk.svg',
    width: 655,
    height: 113,
  },
  {
    name: 'Agroskill Kft.',
    detail: 'Szentkirály',
    href: 'https://www.agroskill.hu/',
    // agroskill.hu header logo, trimmed to its edges
    logo: '/images/partners/agroskill.png',
    width: 551,
    height: 120,
  },
]
