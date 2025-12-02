'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import ApplicationModes from '@/components/solution/ApplicationModes'
import { benefits, machineTypes } from '@/lib/data'
import styles from '@/components/solution/Solution.module.css'

export default function MegoldasPage() {
  return (
    <section className={`section ${styles.sectionSolution}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader number="02" title="A Megoldás" light />
        </motion.div>

        <motion.div
          className={styles.solutionIntro}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className={styles.solutionHeadline}>
            Lazítás <em>forgatás nélkül</em>
          </h3>
          <p className={styles.solutionDesc}>
            Az Imants ásógép holland fejlesztésű, dupla rotoros talajművelő eszköz. Nem fordítja meg a talajrétegeket — lazít, kever, de <strong>megőrzi a talaj természetes szerkezetét</strong>.
          </p>
        </motion.div>

        <motion.div
          className={styles.machineShowcase}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.machineImage}>
            <div className={styles.machinePlaceholder}>
              <span className={styles.placeholderText}>IMANTS 40SX</span>
              <span className={styles.placeholderSub}>Mélyásógép</span>
            </div>
          </div>
          <div className={styles.machineSpecs}>
            <div className={styles.specGroup}>
              <h4>Működési elv</h4>
              <div className={styles.specDiagram}>
                <div className={`${styles.rotor} ${styles.rotorFront}`}>
                  <span className={styles.rotorLabel}>Első rotor</span>
                  <span className={styles.rotorDepth}>30-50 cm</span>
                  <span className={styles.rotorTask}>Alapművelés</span>
                </div>
                <div className={`${styles.rotor} ${styles.rotorBack}`}>
                  <span className={styles.rotorLabel}>Hátsó rotor</span>
                  <span className={styles.rotorDepth}>6-8 cm</span>
                  <span className={styles.rotorTask}>Egyengetés</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className={styles.benefit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div className={styles.benefitIcon}>✓</div>
              <div className={styles.benefitContent}>
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.machineTypes}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className={styles.typesTitle}>Vizsgált géptípusok</h3>
          <div className={styles.typesGrid}>
            {machineTypes.map((type, index) => (
              <motion.div
                key={index}
                className={`${styles.typeCard} ${type.featured ? styles.typeCardFeatured : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.typeBadge}>{type.badge}</div>
                <h4 className={styles.typeName}>{type.name}</h4>
                <p className={styles.typeDepth}>{type.depth}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Alkalmazási módok szekció */}
        <ApplicationModes />

        {/* CTA a kísérlethez */}
        <motion.div
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className={styles.ctaText}>
            De melyik alkalmazási mód a legjobb? Ezt vizsgáltuk három helyszínen, hét különböző kezeléssel.
          </p>
          <Link href="/kiserlet" className={styles.ctaButton}>
            <span>Tovább a kísérletekre</span>
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
