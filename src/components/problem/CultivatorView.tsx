'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Layers, Sprout, Grid3X3, Shovel } from 'lucide-react'
import TiltCard from '@/components/ui/TiltCard'
import ImageLightbox from '@/components/ui/ImageLightbox/ImageLightbox'
import HeavyCultivatorSVG from './visualizations/HeavyCultivatorSVG'
import styles from './ProblemNew.module.css'

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  // Round to avoid hydration mismatches from floating point precision
  return Math.round((x - Math.floor(x)) * 10000) / 10000
}

const cultivatorProblems = [
  {
    title: 'Szármaradványok a felszínen',
    description: 'A nehézkultivátor nem tudja bedolgozni a növényi maradványokat a talajba.',
    icon: 'layers',
  },
  {
    title: 'Lassú és részleges csírázás',
    description: 'A gyomnövények csírázása a tarlóhántás után lassú és részleges.',
    icon: 'sprout',
  },
  {
    title: 'Egyenletlen lazítás',
    description: 'A lazítás képe egyenletlen, főként a kapák nyomában laza csak megfelelő mértékben.',
    icon: 'grid',
  },
  {
    title: 'Kombinátoros ültetés szükséges',
    description: 'Ültetésre csak kombinátoros művelés után alkalmas.',
    icon: 'shovel',
  },
]

const comparisonData = {
  cultivator: {
    title: 'Nehézkultivátor talaj',
    items: [
      'A szármaradványok elégtelen beforgatása',
      'A lazítás egyenletlen, főként a kapák nyomában történik',
      'Ültetésre közvetlenül nem alkalmas',
    ],
  },
  spade: {
    title: 'Ásógépezett talaj',
    items: [
      'A szármaradványok a felszín alá kerülnek',
      'Egyenletesen laza szelvény alakul ki',
      'A vetés és ültetés rögtön kezdődhet',
    ],
  },
}

interface ClodProps {
  cx: number
  cy: number
  rx: number
  ry: number
  type?: 'tiny' | 'small' | 'medium' | 'large' | 'huge'
  delay?: number
  opacity?: number
}

const Clod = ({ cx, cy, rx, ry, type = 'medium', delay = 0, opacity = 1 }: ClodProps) => {
  const colors: Record<string, string> = {
    tiny: '#D7CCC8',
    small: '#BCAAA4',
    medium: '#A1887F',
    large: '#8D6E63',
    huge: '#6D4C41',
  }

  return (
    <motion.ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={colors[type]}
      fillOpacity={opacity}
      stroke={type === 'large' || type === 'huge' ? '#5D4037' : 'none'}
      strokeWidth={type === 'large' || type === 'huge' ? 0.5 : 0}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: delay,
        type: "spring",
        stiffness: 150,
        damping: 20
      }}
    />
  )
}

const DepthMarkers = () => (
  <g style={{ pointerEvents: 'none' }}>
    <line x1="292" y1="45" x2="292" y2="145" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeDasharray="4,3" />
    <rect x="268" y="32" width="28" height="14" rx="3" fill="rgba(62, 39, 35, 0.85)" />
    <text x="282" y="43" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle">0 cm</text>
    <text x="287" y="148" fill="rgba(255, 255, 255, 0.95)" fontSize="9" fontWeight="600" textAnchor="end" style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.8)' }}>30 cm</text>
  </g>
)





const SpadeVisual = () => {
  const clods = useMemo(() => {
    const data: { cx: number; cy: number; rx: number; ry: number; type: ClodProps['type']; id: string }[] = []
    const rows = 5
    const cols = 12
    let seed = 1000
    const surfaceY = 45
    const minPadding = 8

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const xBase = (c / cols) * 275 + 15

        const rand = seededRandom(seed++)
        let type: ClodProps['type'] = 'medium'
        let size = 5

        if (rand < 0.45) { type = 'tiny'; size = 2 + seededRandom(seed++) * 1.5 }
        else if (rand < 0.75) { type = 'small'; size = 3 + seededRandom(seed++) * 2 }
        else if (rand < 0.92) { type = 'medium'; size = 5 + seededRandom(seed++) * 2 }
        else { type = 'large'; size = 7 + seededRandom(seed++) * 2 }

        const ry = size * 0.8
        const minCy = surfaceY + ry + minPadding
        const maxCy = 140 - ry
        const yBase = minCy + (r / rows) * (maxCy - minCy)

        const cx = xBase + (seededRandom(seed++) * 10 - 5)
        const cy = yBase + (seededRandom(seed++) * 6 - 3)

        data.push({ cx, cy: Math.max(cy, minCy), rx: size, ry, type, id: `${r}-${c}` })
      }
    }
    return data
  }, [])

  return (
    <svg viewBox="0 0 300 150" className={styles.soilSvg}>
      <defs>
        <linearGradient id="spadeSoilGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="100%" stopColor="#6D4C41" />
        </linearGradient>
      </defs>

      <motion.rect
        x="0" y="45" width="300" height="105"
        fill="url(#spadeSoilGradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {clods.map((clod, i) => (
        <Clod
          key={clod.id}
          {...clod}
          delay={i * 0.008}
        />
      ))}

      <motion.line
        x1="0" y1="45" x2="300" y2="45"
        stroke="#A1887F"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />

      <DepthMarkers />
    </svg>
  )
}

export default function CultivatorView() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const iconMap: Record<string, React.ReactNode> = {
    layers: <Layers size={24} />,
    sprout: <Sprout size={24} />,
    grid: <Grid3X3 size={24} />,
    shovel: <Shovel size={24} />,
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div className={styles.cultivatorIntro} variants={itemVariants}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <span className={styles.pillBadge}>Nehézkultivátor korlátai</span>
        </div>
        <div className={styles.cultivatorGrid}>
          <div className={styles.cultivatorImageWrapper}>
            <motion.div
              className={styles.cultivatorImageContainer}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsLightboxOpen(true)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src="/images/premium_cultivator_courtyard.png"
                alt="Nehézkultivátor"
                className={styles.cultivatorImage}
                loading="lazy"
              />
              <div className={styles.imageOverlay}>
                <div className={styles.imageLabels}>
                  <span className={styles.imageLabel}>25-30 cm mély árkok</span>
                </div>
              </div>
            </motion.div>
          </div>

          <ImageLightbox
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            src="/images/premium_cultivator_courtyard.png"
            alt="Nehézkultivátor"
          />

          <div className={styles.cultivatorText}>


            <p className={styles.introText}>
              A nehézkultivátor jól lazít, de <strong>nem tudja bedolgozni a szármaradványokat</strong>.
              Az árvakelés és a gyomnövények magjai a felszín közelében maradnak.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div className={styles.problemsSection} variants={itemVariants}>
        <h3 className={styles.problemsTitle}>Kiemelhető problémák</h3>
        <div className={styles.problemsGrid}>
          {cultivatorProblems.map((problem, index) => (
            <motion.div key={index} variants={itemVariants} style={{ height: '100%' }}>
              <TiltCard
                tiltAmount={3}
                glowColor="rgba(212, 168, 75, 0.15)"
                className={styles.problemCard}
              >
                <div
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    padding: '1.5rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <motion.div
                    className={styles.problemIcon}
                    animate={hoveredCard === index
                      ? { scale: 1.05, backgroundColor: 'var(--color-gold)', color: 'var(--color-earth-900)' }
                      : { scale: 1, backgroundColor: 'rgba(212, 168, 75, 0.15)', color: 'var(--color-gold)' }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    {iconMap[problem.icon]}
                  </motion.div>
                  <h4 className={styles.problemCardTitle}>{problem.title}</h4>
                  <p className={styles.problemCardDesc}>{problem.description}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div className={styles.soilComparisonSection} variants={itemVariants}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Layers className={styles.iconGold} size={24} strokeWidth={1.5} />
          <h3 className={styles.comparisonTitle} style={{ margin: 0 }}>
            Talajszelvény összehasonlítás
          </h3>
        </div>

        <div className={styles.soilProfilesContainer}>
          <motion.div
            className={styles.soilProfile}
            whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className={`${styles.soilProfileHeader} ${styles.negativeHeader}`}>
              <X size={16} strokeWidth={2.5} />
              <span>Nehézkultivátor szelvény</span>
            </div>

            <div className={styles.soilProfileVisual} style={{ cursor: 'default' }}>
              <HeavyCultivatorSVG />

              <div className={styles.soilProfileCaption}>
                <p>
                  <strong>Sematikus ábrázolás:</strong> A kapa nyomában (25-30 cm mélyen) apró morzsás talaj gyűlik össze.
                  A sorközökben <em>nagy, tömör rögök</em> maradnak megmunkálatlanul.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.soilProfile}
            whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(107, 139, 94, 0.25)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className={`${styles.soilProfileHeader} ${styles.positiveHeader}`}>
              <Check size={16} strokeWidth={2.5} />
              <span>Ásógépezett szelvény</span>
            </div>

            <div className={styles.soilProfileVisual} style={{ cursor: 'default' }}>
              <SpadeVisual />

              <div className={styles.soilProfileCaption}>
                <p>
                  <strong>Sematikus ábrázolás:</strong> Egyenletes, 3-4 különböző méretű, dominánsan apró rögből álló szerkezet.
                  A szelvény teljes szélességében átmunkált.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className={styles.comparisonTableSection} variants={itemVariants}>
        <div className={styles.comparisonCards}>
          <div className={`${styles.comparisonCard} ${styles.comparisonNegative}`}>
            <div className={styles.comparisonCardHeader}>
              <h4>Nehézkultivátor</h4>
            </div>
            <ul className={styles.comparisonList}>
              {comparisonData.cultivator.items.map((item, i) => (
                <li key={i}><X size={14} className={styles.iconNegative} strokeWidth={3} /> {item}</li>
              ))}
            </ul>
          </div>

          <div className={`${styles.comparisonCard} ${styles.comparisonPositive}`}>
            <div className={styles.comparisonCardHeader}>
              <h4>Ásógép</h4>
            </div>
            <ul className={styles.comparisonList}>
              {comparisonData.spade.items.map((item, i) => (
                <li key={i}><Check size={14} className={styles.iconPositive} strokeWidth={3} /> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
