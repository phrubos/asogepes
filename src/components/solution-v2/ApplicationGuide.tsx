'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, type Variants } from 'framer-motion'
import { Shovel, Layers, Combine, Star, ChevronRight, ChevronsDown } from 'lucide-react'
import styles from './ApplicationGuide.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual, localize, pagePath } from '@/lib/i18n/config'

const TEXT = bilingual(
  {
    when: 'Mikor ajánlott?',
    soil: 'Milyen talajra?',
    durability: 'Szerkezet tartossága',
    seeTrial: 'Lásd a kísérletben',
    badge: 'ALKALMAZÁSI ÚTMUTATÓ',
    title: 'Melyik módszert válasszam?',
    subtitleA: 'Az ásógép önállóan és más művelőeszközökkel kombinálva is használható —',
    subtitleB: 'a talaj állapota határozza meg a legjobb stratégiát.',
  },
  {
    when: 'When is it recommended?',
    soil: 'Which soil?',
    durability: 'Durability of structure',
    seeTrial: 'See it in the trial',
    badge: 'APPLICATION GUIDE',
    title: 'Which method should I choose?',
    subtitleA: 'The spading machine can be used on its own or combined with other implements;',
    subtitleB: 'the condition of the soil determines the best strategy.',
  },
)

interface ApplicationMode {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  when: string
  soilType: string
  rating: number
  isBest: boolean
  color: string
  /** English copy (ticket 027) */
  en: Pick<ApplicationMode, 'title' | 'subtitle' | 'when' | 'soilType'>
}

const applicationModes: ApplicationMode[] = [
  {
    id: 'solo',
    title: 'Ásógép',
    subtitle: 'Csak ásógép, más eszköz nélkül',
    icon: <Shovel size={32} />,
    when: 'Első alkalmazás, jó szerkezetű talaj',
    soilType: 'Laza szerkezetű talajok',
    en: { title: 'Spading machine', subtitle: 'Spading machine only, no other implement', when: 'First application, well-structured soil', soilType: 'Light, loose soils' },
    rating: 4,
    isBest: false,
    color: '#8B7355'
  },
  {
    id: 'with-loosening',
    title: 'Lazítás + Ásógép',
    subtitle: 'Mélylazítás után ásógép',
    icon: <Layers size={32} />,
    when: 'Tömör, eketalpas talaj',
    soilType: 'Középkötött, kötött talajok',
    en: { title: 'Subsoiling + spading machine', subtitle: 'Spading machine after subsoiling', when: 'Compacted soil with a plough pan', soilType: 'Medium and heavy soils' },
    rating: 3,
    isBest: false,
    color: '#6B8B6B'
  },
  {
    id: 'deep-spading',
    title: 'Mélyásógép',
    subtitle: 'Csak mélyásógép, más eszköz nélkül',
    icon: <ChevronsDown size={32} />,
    when: 'Intenzíven öntözött, nagy gyökértömegű kultúrák',
    soilType: 'Középkötött, kötött talaj',
    en: { title: 'Deep spading machine', subtitle: 'Deep spading machine only, no other implement', when: 'Intensively irrigated crops with a large root mass', soilType: 'Medium and heavy soils' },
    rating: 5,
    isBest: false,
    color: '#CD853F'
  },
  {
    id: 'with-ploughing',
    title: 'Lazítás + Szántás + Ásógép',
    subtitle: 'Lazítás és őszi szántás után tavaszi ásógép',
    icon: <Combine size={32} />,
    when: 'Ősszel nagy tömegű szármaradvány vagy szervestrágya',
    soilType: 'Bármely talajtípus',
    en: { title: 'Subsoiling + ploughing + spading machine', subtitle: 'Spring spading after subsoiling and autumn ploughing', when: 'Large amounts of crop residue or manure in autumn', soilType: 'Any soil type' },
    rating: 5,
    isBest: false,
    color: '#D4A84B' // gold (was blue-grey; no blue on the site)
  }
]

// One card per application mode. Hover is a 3px lift + shadow (CSS); the "see it in the trial" link
// is always visible, so nothing the reader needs is hidden behind hover.
function ModeCard({
  mode,
  cardVariants,
  isInView
}: {
  mode: ApplicationMode
  cardVariants: Variants
  isInView: boolean
}) {
  const locale = useLocale()
  const t = TEXT[locale]
  return (
    <motion.article
      className={`${styles.card} ${mode.isBest ? styles.bestCard : ''}`}
      variants={cardVariants}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
    >
      {mode.isBest && (
        <motion.div
          className={styles.bestBadge}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <Star size={14} fill="currentColor" aria-hidden="true" />
          <span>LEGJOBB</span>
        </motion.div>
      )}

      <div className={styles.iconContainer}>
        <div
          className={styles.iconWrapper}
          style={{ backgroundColor: `${mode.color}20`, borderColor: `${mode.color}40`, color: mode.color }}
        >
          {mode.icon}
        </div>
      </div>

      <h3 className={styles.cardTitle}>{mode.title}</h3>
      <p className={styles.cardSubtitle}>{mode.subtitle}</p>

      <div className={styles.infoGrid}>
        {[
          { label: t.when, value: mode.when },
          { label: t.soil, value: mode.soilType }
        ].map((info) => (
          <div key={info.label} className={styles.infoItem}>
            <span className={styles.infoLabel}>{info.label}</span>
            <span className={styles.infoValue}>{info.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.ratingRow}>
        <span className={styles.ratingLabel}>{t.durability}</span>
        <div className={styles.stars} role="img" aria-label={`${mode.rating} / 5`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              aria-hidden="true"
              className={star <= mode.rating ? styles.starFilled : styles.starEmpty}
              fill={star <= mode.rating ? 'currentColor' : 'none'}
            />
          ))}
        </div>
      </div>

      <Link href={pagePath('research', locale, 'lakitelek')} className={styles.cta}>
        <span>{t.seeTrial}</span>
        <ChevronRight size={16} aria-hidden="true" />
      </Link>
    </motion.article>
  )
}

export default function ApplicationGuide() {
  const locale = useLocale()
  const t = TEXT[locale]
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // The four cards arrive together: they are alternatives, not a sequence
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <section ref={sectionRef} className={styles.section}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.badge}>{t.badge}</span>
        <h2 className={styles.title}>{t.title}</h2>
        <p className={styles.subtitle}>
          {t.subtitleA}
          {' '}{t.subtitleB}
        </p>
      </motion.div>

      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {applicationModes.map((row) => localize(row, locale)).map((mode) => (
          <ModeCard key={mode.id} mode={mode} cardVariants={cardVariants} isInView={isInView} />
        ))}
      </motion.div>


    </section>
  )
}
