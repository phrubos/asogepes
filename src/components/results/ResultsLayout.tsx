'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, X, Droplets, Thermometer, Layers, Sprout, 
  Target, Lightbulb, TrendingUp, Wind 
} from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedNumber from '@/components/ui/AnimatedNumber'
import { treatmentComparison } from '@/lib/data'
import styles from './ResultsNew.module.css'

// Fő megállapítások adatai
const findings = [
  {
    number: '01',
    title: 'Tartósabb lazaság',
    description: 'Az ásógépezett parcellák <strong>5-10 cm-rel mélyebben</strong> maradtak lazák a teljes tenyészidőszak alatt, még 400-450 mm öntözővíz után is.',
    badge: '5-10 cm',
    icon: Layers,
  },
  {
    number: '02',
    title: 'Gyorsabb felmelegedés',
    description: 'A tavaszi mérések során az ásógépezett talaj <strong>2-4°C-kal melegebb</strong> volt — hideg tavaszon ez különösen fontos.',
    badge: '+2-4°C',
    icon: Thermometer,
  },
  {
    number: '03',
    title: 'Jobb vízgazdálkodás',
    description: 'A víz <strong>egyenletesebben oszlott el</strong> a talajszelvényben, mélyebb rétegekbe is lejutott az ásógépezett parcellákban.',
    badge: 'Egyenletes',
    icon: Droplets,
  },
  {
    number: '04',
    title: 'Látható növényfejlődés',
    description: 'A paradicsom és hagyma állományok <strong>szemmel láthatóan fejlettebbek</strong> voltak az ásógépezett területeken.',
    badge: 'Vizuális',
    icon: Sprout,
  },
]

// Statisztikák
const stats = [
  { number: 3, label: 'Helyszín' },
  { number: 7, label: 'Kezelés' },
  { number: 4, label: 'Hónap' },
  { number: 450, label: 'mm öntözés' },
]

// Ajánlások
const recommendations = [
  {
    icon: Droplets,
    title: 'Öntözéses kultúrák',
    text: 'Paradicsom, hagyma, paprika — ahol gyakori öntözés tömöríti a talajt',
  },
  {
    icon: Layers,
    title: 'Eketalp problémák',
    text: 'Ahol a szántás tömör réteget hozott létre 25-30 cm mélyen',
  },
  {
    icon: Thermometer,
    title: 'Hideg tavaszon',
    text: 'Gyorsabb felmelegedés = korábbi ültetés, jobb kelés',
  },
  {
    icon: Sprout,
    title: 'Igényes növények',
    text: 'Mély gyökérzetű, talajigényes kertészeti kultúrák',
  },
]

// Animációs variánsok
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function ResultsLayout() {
  const [hoveredFinding, setHoveredFinding] = useState<number | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  return (
    <section className={styles.sectionResults}>
      <div className="container">
        {/* Hero */}
        <div className={styles.hero}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader number="04" title="Eredmények" light />
          </motion.div>
          
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {['Mit', 'találtunk?'].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
              >
                {word}{' '}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <strong>4 hónap</strong>, <strong>3 helyszín</strong>, <strong>7 kezelési mód</strong> — 
            az adatok egyértelműen beszélnek.
          </motion.p>
        </div>

        {/* Fő megállapítások */}
        <div className={styles.findingsSection}>
          <motion.p 
            className={styles.sectionTitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Fő Megállapítások
          </motion.p>
          
          <motion.div 
            className={styles.findingsGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {findings.map((finding, index) => {
              const IconComponent = finding.icon
              return (
                <motion.div
                  key={finding.number}
                  className={styles.findingCard}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredFinding(index)}
                  onMouseLeave={() => setHoveredFinding(null)}
                  whileHover={{ y: -8 }}
                >
                  <div className={styles.findingHeader}>
                    <span className={styles.findingNumber}>{finding.number}</span>
                    <motion.div 
                      className={styles.findingIcon}
                      animate={{ 
                        scale: hoveredFinding === index ? 1.1 : 1,
                        rotate: hoveredFinding === index ? -5 : 0
                      }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <IconComponent size={28} />
                    </motion.div>
                  </div>
                  
                  <h3 className={styles.findingTitle}>{finding.title}</h3>
                  <p 
                    className={styles.findingDescription}
                    dangerouslySetInnerHTML={{ __html: finding.description }}
                  />
                  
                  <motion.span 
                    className={styles.findingBadge}
                    animate={{
                      boxShadow: hoveredFinding === index 
                        ? '0 0 20px rgba(212, 168, 75, 0.3)' 
                        : '0 0 0 rgba(212, 168, 75, 0)'
                    }}
                  >
                    {finding.badge}
                  </motion.span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Összehasonlító táblázat */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <motion.h2 
              className={styles.tableMainTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Művelési Módszerek Összehasonlítása
            </motion.h2>
            <motion.p 
              className={styles.tableSubtitle}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Lakitelek kísérlet eredményei alapján (450 mm öntözés után)
            </motion.p>
          </div>

          <motion.div 
            className={styles.tableWrapper}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kezelés</th>
                  <th>Kezdeti</th>
                  <th>Végső</th>
                  <th>Változás</th>
                  <th>Stabil?</th>
                </tr>
              </thead>
              <tbody>
                {treatmentComparison.map((row, index) => {
                  const isBest = row.treatment.includes('Szántás + Ásógép')
                  return (
                    <motion.tr
                      key={index}
                      className={isBest ? styles.rowBest : ''}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      onMouseEnter={() => setHoveredRow(index)}
                      onMouseLeave={() => setHoveredRow(null)}
                      animate={{
                        backgroundColor: hoveredRow === index 
                          ? 'rgba(212, 168, 75, 0.08)' 
                          : 'transparent'
                      }}
                    >
                      <td>
                        <div className={styles.treatmentCell}>
                          {isBest && <span className={styles.bestStar}>★</span>}
                          {row.treatment}
                        </div>
                      </td>
                      <td>{row.initial} cm</td>
                      <td>{row.final} cm</td>
                      <td className={row.stable ? styles.changeGood : styles.changeBad}>
                        {row.change > 0 ? '+' : ''}{row.change} cm
                      </td>
                      <td>
                        {row.stable ? (
                          <Check size={18} className={styles.iconGood} />
                        ) : (
                          <X size={18} className={styles.iconBad} />
                        )}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </motion.div>
        </div>

        {/* Statisztikák */}
        <div className={styles.statsSection}>
          <motion.div 
            className={styles.statsGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className={styles.statCard}
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <AnimatedNumber 
                  value={stat.number} 
                  className={styles.statNumber}
                  duration={1500}
                  delay={index * 100}
                />
                <span className={styles.statLabel}>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Ajánlások */}
        <div className={styles.recommendationsSection}>
          <div className={styles.recHeader}>
            <Lightbulb size={28} className={styles.recHeaderIcon} />
            <h2 className={styles.recTitle}>Mikor ajánlott az ásógép?</h2>
          </div>
          
          <motion.div 
            className={styles.recGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon
              return (
                <motion.div 
                  key={rec.title}
                  className={styles.recCard}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                >
                  <div className={styles.recIcon}>
                    <IconComponent size={28} />
                  </div>
                  <h4 className={styles.recCardTitle}>{rec.title}</h4>
                  <p className={styles.recCardText}>{rec.text}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Végső következtetés */}
        <div className={styles.conclusionSection}>
          <motion.div 
            className={styles.conclusionContent}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <blockquote className={styles.conclusionQuote}>
              <motion.span 
                className={styles.quoteMarkLeft}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 0.3, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                "
              </motion.span>
              A mélyásógép és a szántás+ásógép kombináció adta a legstabilabb, 
              legegyenletesebb eredményt a teljes tenyészidőszak alatt.
              <motion.span 
                className={styles.quoteMarkRight}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 0.3, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                "
              </motion.span>
            </blockquote>
            
            <p className={styles.conclusionText}>
              A kutatás igazolta: az ásógépes talajművelés hatékonyan csökkenti a tömörödést, 
              javítja a vízgazdálkodást, és elősegíti a növények fejlődését. 
              Különösen ajánlott <strong>igényes kertészeti kultúrákhoz</strong> és{' '}
              <strong>öntözéses gazdálkodáshoz</strong>.
            </p>
            
            <motion.div 
              className={styles.finalBadge}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <Target size={18} />
              <span>Neumann János Egyetem × Agroskill Kft. — 2025</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
