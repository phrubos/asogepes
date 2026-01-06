'use client'

import { useState } from 'react'
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
  ArrowRight,
  ZoomIn
} from 'lucide-react'
import { modelDetails } from '@/lib/data'
import ImageLightbox from '@/components/ui/ImageLightbox'
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
    irrigation: '450mm',
    period: 'Máj-Aug',
    chartData: { spade: 20, control: 32, unit: 'cm', label: 'Aug.' },
    resultHighlight: '-1 cm',
    resultText: 'legjobb stabilitás'
  },
  '38wx': {
    location: 'Szentkirály',
    description: 'Vöröshagyma kultúra 4 hónapos mérési időszak.',
    crop: 'Vöröshagyma',
    irrigation: '350mm',
    period: 'Márc-Jún',
    chartData: { spade: 17, control: 5, unit: 'cm', label: 'Jún.' },
    resultHighlight: '17 cm',
    resultText: 'lazaság megmaradt'
  },
  '40sx': {
    location: 'Kecskemét-Borbás',
    description: 'Ipari paradicsom 45 cm mélységű műveléssel.',
    crop: 'Ipari paradicsom',
    irrigation: '400mm',
    period: 'Máj-Jún',
    chartData: { spade: 37, control: 27, unit: 'cm', label: 'Jún.' },
    resultHighlight: '+10cm',
    resultText: 'ásógép javára'
  }
}

// Highlight data
const highlightData = {
  '38sx': {
    title: 'Legjobb stabilitás',
    text: 'A szántás + ásógép kombináció (VII. parcella) adta a legjobb stabilitást.'
  },
  '38wx': {
    title: 'Látható különbség',
    text: 'Jelentősen kevesebb gyom fejlődött az ásógépezett területen.'
  },
  '40sx': {
    title: 'Fejlettebb növények',
    text: 'Az ásógépezett sorok paradicsomjai látványosan nagyobbak voltak.'
  }
}

export default function ModelSection({ modelId, onOpenModal }: ModelSectionProps) {
  const model = modelDetails[modelId]
  const fieldPreview = fieldPreviewData[modelId]
  const highlight = highlightData[modelId]
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <section className={styles.compactSection}>
      {/* Header */}
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.titleRow}>
          <h2 className={styles.modelName}>{model.name}</h2>
          <span className={styles.typeBadge}>{model.type}</span>
          <span className={styles.typeEn}>{model.typeEn}</span>
        </div>
      </motion.div>

      {/* 2-Column Grid */}
      <div className={styles.compactGrid}>

        {/* Left Column: Visuals & Highlight */}
        <div className={styles.leftColumn}>
          <motion.div
            className={styles.imageWrapper}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => setLightboxOpen(true)}
          >
            <Image
              src={model.image}
              alt={`${model.name} - ${model.type}`}
              width={500}
              height={400} // Aspect ratio reference
              className={styles.machineImage}
            />
            <div className={styles.zoomIndicator}>
              <ZoomIn size={14} /> Nagyítás
            </div>
          </motion.div>

          <motion.div
            className={styles.highlightBox}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.highlightIcon}>
              <Lightbulb size={20} />
            </div>
            <div>
              <h4 className={styles.highlightTitle}>{highlight.title}</h4>
              <p className={styles.highlightText}>{highlight.text}</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Specs & Data */}
        <div className={styles.rightColumn}>

          {/* Field Results - Top priority context */}
          <motion.div
            className={styles.fieldCard}
            onClick={onOpenModal}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className={styles.fieldCardSection}>
              <h4 className={styles.fieldCardTitle}>
                <MapPin size={16} />
                Terep Eredmények: {fieldPreview.location}
              </h4>
              <p className={styles.fieldCardPreview}>{fieldPreview.description}</p>

              <div className={styles.fieldCardMeta}>
                <span className={styles.metaTag}><Leaf />{fieldPreview.crop}</span>
                <span className={styles.metaTag}><Droplets />{fieldPreview.irrigation}</span>
                <span className={styles.metaTag}><Calendar />{fieldPreview.period}</span>
              </div>

              <p className={styles.fieldCardResult}>
                <strong>{fieldPreview.resultHighlight}</strong> {fieldPreview.resultText}
              </p>
            </div>

            <div className={styles.fieldCardSection} style={{ alignItems: 'flex-end' }}>
              <div className={styles.miniChartWrapper}>
                <span className={styles.miniChartLabel}>{fieldPreview.chartData.label}</span>
                <div className={styles.miniChart}>
                  <div className={styles.miniBarGroup}>
                    <motion.div
                      className={`${styles.miniBar} ${styles.gold}`}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(fieldPreview.chartData.spade / 40) * 100}%` }}
                    />
                    <span className={styles.miniBarValue}>{fieldPreview.chartData.spade}</span>
                  </div>
                  <div className={styles.miniBarGroup}>
                    <motion.div
                      className={`${styles.miniBar} ${styles.gray}`}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(fieldPreview.chartData.control / 40) * 100}%` }}
                    />
                    <span className={styles.miniBarValue}>{fieldPreview.chartData.control}</span>
                  </div>
                </div>
                <span className={styles.miniChartUnit}>{fieldPreview.chartData.unit}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Részletek <ArrowRight size={14} />
              </div>
            </div>
          </motion.div>

          {/* Specs - Compact */}
          <motion.div
            className={styles.specsCompact}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className={styles.specsTitle}>
              <Wrench size={16} /> Műszaki Adatok
            </h3>

            <div className={styles.specsGrid}>
              <div className={styles.specRowCompact}>
                <div className={styles.specIconCompact}><Ruler size={18} /></div>
                <div className={styles.specInfoCompact}>
                  <span className={styles.specLabel}>Munkamélység</span>
                  <span className={styles.specValue}>{model.specs.depth}</span>
                </div>
              </div>
              <div className={styles.specRowCompact}>
                <div className={styles.specIconCompact}><Gauge size={18} /></div>
                <div className={styles.specInfoCompact}>
                  <span className={styles.specLabel}>Teljesítmény</span>
                  <span className={styles.specValue}>{model.specs.power}</span>
                </div>
              </div>
            </div>

            <div className={styles.featuresGrid}>
              {model.specs.features.map((feature, idx) => (
                <div key={idx} className={styles.featureItem}>
                  <CheckCircle2 size={12} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        src={model.image}
        alt={`${model.name} - ${model.type}`}
        images={[
          { src: '/images/38SX.png', alt: '38SX Nagy szériás ásógép' },
          { src: '/images/38WX.png', alt: '38WX Lazítókéses ásógép' },
          { src: '/images/40SX.png', alt: '40SX Mélyásógép' }
        ]}
        initialIndex={modelId === '38sx' ? 0 : modelId === '38wx' ? 1 : 2}
      />
    </section>
  )
}
