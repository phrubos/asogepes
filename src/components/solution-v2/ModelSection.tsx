'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  MapPin,
  Leaf,
  Droplets,
  Calendar,
  CheckCircle2,
  Lightbulb,
  Ruler,
  Gauge,
  Wrench,
  BarChart3,
  ArrowRight
} from 'lucide-react'
import { modelDetails } from '@/lib/data'
import styles from './ModelSection.module.css'

type ModelId = '38sx' | '38wx' | '40sx'

interface ModelSectionProps {
  modelId: ModelId
  onOpenModal?: () => void
}

// Preview data for the field card
const fieldPreviewData = {
  '38sx': {
    location: 'Lakitelek',
    description: 'III. és VII. parcella eredményei ipari paradicsom kultúrában.',
    crop: 'Ipari paradicsom',
    irrigation: '450 mm',
    period: 'Máj-Aug',
    chartData: { spade: 20, control: 32, unit: 'cm', label: 'Aug.' },
    resultHighlight: '-1 cm',
    resultText: 'legjobb stabilitás'
  },
  '38wx': {
    location: 'Szentkirály',
    description: 'Vöröshagyma kultúra 4 hónapos mérési időszak.',
    crop: 'Vöröshagyma',
    irrigation: '350 mm',
    period: 'Márc-Jún',
    chartData: { spade: 17, control: 5, unit: 'cm', label: 'Jún.' },
    resultHighlight: '17 cm',
    resultText: 'lazaság megmaradt'
  },
  '40sx': {
    location: 'Kecskemét-Borbás',
    description: 'Ipari paradicsom 45 cm mélységű műveléssel.',
    crop: 'Ipari paradicsom',
    irrigation: '400 mm',
    period: 'Máj-Jún',
    chartData: { spade: 37, control: 27, unit: 'cm', label: 'Jún.' },
    resultHighlight: '+10 cm',
    resultText: 'ásógép javára'
  }
}

// Highlight data
const highlightData = {
  '38sx': {
    title: 'Legjobb stabilitás',
    text: 'A szántás + ásógép kombináció (VII. parcella) adta a legjobb stabilitást (-1 cm változás), míg az önálló ásógép is kiváló eredményt hozott.'
  },
  '38wx': {
    title: 'Látható különbség',
    text: 'A júniusi helyszíni bejáráson szemmel látható volt: az ásógépezett parcellán jelentősen kevesebb gyom fejlődött, mint a hagyományos művelésű területen.'
  },
  '40sx': {
    title: 'Szembetűnő növekedési különbség',
    text: 'A júniusi fotón jól látható: az ásógépezett sorok paradicsomjai nagyobbak és fejlettebbek, mint a hagyományos művelésű terület növényei.'
  }
}

export default function ModelSection({ modelId, onOpenModal }: ModelSectionProps) {
  const model = modelDetails[modelId]
  const fieldPreview = fieldPreviewData[modelId]
  const highlight = highlightData[modelId]

  return (
    <section className={styles.section}>
      {/* Section Header */}
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.titleRow}>
          <h2 className={styles.modelName}>{model.name}</h2>
          <span className={styles.typeBadge}>{model.type}</span>
        </div>
        <span className={styles.typeEn}>{model.typeEn}</span>
      </motion.div>

      {/* Specs Layout: Image + Specs Card */}
      <div className={styles.specsLayout}>
        {/* Machine Image */}
        <motion.div
          className={styles.imageWrapper}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Image
            src={model.image}
            alt={`${model.name} - ${model.type}`}
            width={450}
            height={350}
            className={styles.machineImage}
          />
        </motion.div>

        {/* Specs Card */}
        <motion.div
          className={styles.specsCard}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className={styles.specsTitle}>
            <Wrench size={18} />
            Műszaki Adatok
          </h3>

          <div className={styles.specRow}>
            <div className={styles.specIcon}>
              <Ruler size={20} />
            </div>
            <div className={styles.specInfo}>
              <span className={styles.specLabel}>Munkamélység</span>
              <span className={styles.specValue}>{model.specs.depth}</span>
            </div>
          </div>

          <div className={styles.specRow}>
            <div className={styles.specIcon}>
              <Gauge size={20} />
            </div>
            <div className={styles.specInfo}>
              <span className={styles.specLabel}>Teljesítmény igény</span>
              <span className={styles.specValue}>{model.specs.power}</span>
            </div>
          </div>

          <div className={styles.featuresSection}>
            <span className={styles.featuresLabel}>Főbb jellemzők</span>
            <ul className={styles.featuresList}>
              {model.specs.features.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <CheckCircle2 size={14} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Field Results Card (Clickable) */}
      <motion.div
        className={styles.fieldCard}
        onClick={onOpenModal}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ y: -4 }}
      >
        <div className={styles.fieldCardSection}>
          <h4 className={styles.fieldCardTitle}>
            <MapPin size={18} />
            Terep Eredmények
          </h4>
          <p className={styles.fieldCardPreview}>
            {fieldPreview.location} kísérlet: {fieldPreview.description}
          </p>
          <div className={styles.fieldCardMeta}>
            <span className={styles.metaTag}>
              <Leaf size={12} />
              {fieldPreview.crop}
            </span>
            <span className={styles.metaTag}>
              <Droplets size={12} />
              {fieldPreview.irrigation}
            </span>
            <span className={styles.metaTag}>
              <Calendar size={12} />
              {fieldPreview.period}
            </span>
          </div>
          <span className={styles.fieldCardCta}>
            Részletek megtekintése
            <ArrowRight size={16} />
          </span>
        </div>

        <div className={styles.fieldCardSection}>
          <h4 className={styles.fieldCardTitle}>
            <BarChart3 size={18} />
            Mérési Adatok
          </h4>
          <div className={styles.miniChartWrapper}>
            <span className={styles.miniChartLabel}>{fieldPreview.chartData.label}</span>
            <div className={styles.miniChart}>
              <div className={styles.miniBarGroup}>
                <div
                  className={`${styles.miniBar} ${styles.gold}`}
                  style={{ height: `${(fieldPreview.chartData.spade / 40) * 100}%` }}
                />
                <span className={styles.miniBarValue}>{fieldPreview.chartData.spade}</span>
                <span className={styles.miniBarLabel}>Ásógép</span>
              </div>
              <div className={styles.miniBarGroup}>
                <div
                  className={`${styles.miniBar} ${styles.gray}`}
                  style={{ height: `${(fieldPreview.chartData.control / 40) * 100}%` }}
                />
                <span className={styles.miniBarValue}>{fieldPreview.chartData.control}</span>
                <span className={styles.miniBarLabel}>Kontroll</span>
              </div>
            </div>
            <span className={styles.miniChartUnit}>{fieldPreview.chartData.unit}</span>
          </div>
          <p className={styles.fieldCardResult}>
            <strong>{fieldPreview.resultHighlight}</strong> {fieldPreview.resultText}
          </p>
        </div>
      </motion.div>

      {/* Highlight Box */}
      <motion.div
        className={styles.highlightBox}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className={styles.highlightIcon}>
          <Lightbulb size={24} />
        </div>
        <div className={styles.highlightContent}>
          <h4 className={styles.highlightTitle}>{highlight.title}</h4>
          <p className={styles.highlightText}>{highlight.text}</p>
        </div>
      </motion.div>
    </section>
  )
}
