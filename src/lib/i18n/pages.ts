import { bilingual, type Locale, type PageKey } from './config'
import type { OgBackground } from '@/lib/og/renderOgImage'

interface PageText {
  title: string
  description: string
  og: { alt: string; eyebrow: string; title: string; subtitle: string }
}

/** <title>, meta description and share-card text of every page, in both languages (ticket 025) */
export const PAGE_TEXT: Record<PageKey, Record<Locale, PageText>> = {
  home: bilingual<PageText>(
    {
      title: 'Ásógépes Talajművelés | Tudományos kutatás 2025 óta',
      description:
        'Tudományos kutatás a szántóföldi ásógép talajszerkezetre gyakorolt hatásáról, öntözött kertészeti kultúrákban. Neumann János Egyetem × Agroskill Kft. együttműködés.',
      og: {
        alt: 'Ásógépes talajművelés – tudományos kutatás',
        eyebrow: 'Tudományos kutatás 2025 óta',
        title: 'Ásógépes talajművelés',
        subtitle: 'Lazítás forgatás nélkül, öntözött kertészeti kultúrákban',
      },
    },
    {
      title: 'Spading-Machine Tillage | Field research since 2025',
      description:
        'Field research on how a spading machine affects soil structure in irrigated horticultural crops. A collaboration between John von Neumann University and Agroskill Kft.',
      og: {
        alt: 'Spading-machine tillage – field research',
        eyebrow: 'Field research since 2025',
        title: 'Spading-machine tillage',
        subtitle: 'Loosening without inversion in irrigated horticultural crops',
      },
    },
  ),
  problem: bilingual<PageText>(
    {
      title: 'Probléma | Ásógépes Talajművelés',
      description:
        'Miért nem elég a hagyományos szántás? Ismerd meg a talajtömörödés és a forgatásos művelés hátrányait.',
      og: {
        alt: 'Repedezett, tömörödött talaj – A probléma',
        eyebrow: 'A probléma',
        title: 'Talajtömörödés és eketalp',
        subtitle: 'Miért nem elég a hagyományos szántás és a kultivátoros művelés?',
      },
    },
    {
      title: 'The Problem | Spading-Machine Tillage',
      description:
        'Why is conventional ploughing not enough? Learn about soil compaction and the drawbacks of inversion tillage.',
      og: {
        alt: 'Cracked, compacted soil – The problem',
        eyebrow: 'The problem',
        title: 'Soil compaction and the plough pan',
        subtitle: 'Why conventional ploughing and cultivator tillage fall short',
      },
    },
  ),
  technology: bilingual<PageText>(
    {
      title: 'Technológia | Ásógépes Talajművelés',
      description:
        'Az Imants ásógép működési elve és modelljei. Lazítás forgatás nélkül — a talaj természetes rétegződésének megőrzése.',
      og: {
        alt: 'Frissen lazított, morzsalékos talaj – Technológia',
        eyebrow: 'Technológia',
        title: 'Az ásógép működése',
        subtitle: 'Lazítás forgatás nélkül, a talaj természetes rétegződésének megőrzésével',
      },
    },
    {
      title: 'Technology | Spading-Machine Tillage',
      description:
        'How the Imants spading machine works, and its models. Loosening without inversion, preserving the natural layering of the soil.',
      og: {
        alt: 'Freshly loosened, crumbly soil – Technology',
        eyebrow: 'Technology',
        title: 'How the spading machine works',
        subtitle: 'Loosening without inversion, preserving the natural layering of the soil',
      },
    },
  ),
  research: bilingual<PageText>(
    {
      title: 'Kutatás | Ásógépes Talajművelés',
      description:
        '3 helyszín, 7 kezelési mód, 6 hónap — tudományos igényességgel vizsgáltuk az ásógép hatását a talajszerkezetre.',
      og: {
        alt: 'Kertészeti kísérleti parcellák – Kutatás',
        eyebrow: 'Kutatás',
        title: 'Szentkirály, Kecskemét, Lakitelek',
        subtitle: '3 helyszín · 7 kezelés · 6 hónap terepi mérés',
      },
    },
    {
      title: 'Research | Spading-Machine Tillage',
      description:
        '3 sites, 7 treatments, 6 months: a rigorous field study of how the spading machine affects soil structure.',
      og: {
        alt: 'Horticultural trial plots – Research',
        eyebrow: 'Research',
        title: 'Szentkirály, Kecskemét, Lakitelek',
        subtitle: '3 sites · 7 treatments · 6 months of field measurements',
      },
    },
  ),
}

/** Background image of each page's share card */
export const OG_BACKGROUND: Record<PageKey, OgBackground> = {
  home: 'home',
  problem: 'problema',
  technology: 'technologia',
  research: 'kutatas',
}
