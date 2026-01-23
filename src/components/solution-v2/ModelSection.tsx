// ModelSection.tsx - Redesign Layout
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Wrench,
  Ruler,
  Gauge,
  CheckCircle2,
  ZoomIn,
  ArrowRight,
  MapPin,
  Leaf,
  Droplets,
  Calendar,
  BarChart3
} from 'lucide-react'
import { modelDetails } from '@/lib/data'
import ImageLightbox from '@/components/ui/ImageLightbox'
import styles from './ModelSection.module.css'

type ModelId = '38sx' | '38wx' | '40sx'

interface ModelSectionProps {
  modelId: ModelId
}

export default function ModelSection({ modelId }: ModelSectionProps) {
  const model = modelDetails[modelId]
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const experimentDescriptions: Record<ModelId, string> = {
    '38wx': 'Szentkirály kísérleti hely: vöröshagyma kultúra, 4 hónapos mérési időszak.',
    '38sx': 'Lakitelek kísérleti hely: III. és VII. parcella eredményei, ipari paradicsom kultúrában.',
    '40sx': 'Kecskemét-Borbás kísérleti hely: ipari paradicsom kultúra, 45 cm mélységű műveléssel.'
  }

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
        </div>
      </motion.div>

      <div className={styles.mainLayout}>
        {/* Top Row: Image (Left) + Specs (Right) */}
        <div className={styles.topRow}>

          {/* Image Card */}
          <motion.div
            className={styles.imageCard}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => setLightboxOpen(true)}
          >
            <Image
              src={model.image}
              alt={`${model.name} ${model.type}`}
              width={800}
              height={600}
              className={styles.machineImage}
              priority
            />
            <div className={styles.zoomIndicator}><ZoomIn size={18} /></div>
          </motion.div>

          {/* Specs Panel */}
          <motion.div
            className={styles.specsPanel}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.panelHeader}>
              <Wrench size={24} color="var(--color-gold)" /> Műszaki Adatok
            </div>

            <div className={styles.specsBoxContainer}>
              {/* Depth */}
              <div className={styles.specRow}>
                <div className={styles.specIconBox}><Ruler size={24} /></div>
                <div className={styles.specContent}>
                  <span className={styles.specLabel}>Munkamélység</span>
                  <span className={styles.specValue}>{model.specs.depth}</span>
                </div>
              </div>

              {/* Power */}
              <div className={styles.specRow}>
                <div className={styles.specIconBox}><Gauge size={24} /></div>
                <div className={styles.specContent}>
                  <span className={styles.specLabel}>Teljesítmény Igény</span>
                  <span className={styles.specValue}>{model.specs.power}</span>
                </div>
              </div>
            </div>

            <div className={styles.featuresList}>
              <div className={styles.featuresTitle}>Főbb Jellemzők</div>
              {model.specs.features.map((feature, idx) => (
                <div key={idx} className={styles.featureItem}>
                  <CheckCircle2 size={16} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Results/Chart Card */}
        <motion.div
          className={styles.resultsCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        // Click removed from container
        >
          {/* Left: Info ... */}
          <div className={styles.resultsInfo}>
            {/* ... content ... */}
            <div>
              <div className={styles.resultsHeader}>
                <MapPin size={20} /> Kísérleti eredmények
              </div>
              <div className={styles.resultsDesc}>
                {experimentDescriptions[modelId]}
              </div>
              <div className={styles.tagsRow}>
                <span className={styles.resultTag}><Leaf /> {modelId === '38wx' ? 'Vöröshagyma' : 'Ipari paradicsom'}</span>
                <span className={styles.resultTag}><Calendar /> {modelId === '38wx' ? 'Márc-Jún' : 'Máj-Aug'}</span>
              </div>
            </div>
            {/* No link here */}
          </div>

          {/* Right: Chart and Link Side-by-Side */}
          <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <BarChart3 size={20} /> Mérési Adatok
            </div>

            <div className={styles.chartRow}>
              <Link href="/kutatas?section=lakitelek" style={{ display: 'block' }}>
                <motion.div
                  className={styles.chartVisual}
                  whileHover="hover"
                  initial="initial"
                >
                  {/* Simplified Visual Bars - Dynamic Abstract Icon */}
                  <div className={styles.axisY} />
                  <div className={styles.axisX} />
                  <div className={styles.abstractBars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${styles.bar} ${styles.animBar} ${i % 2 === 0 ? styles.barGold : styles.barLight}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </Link>

              <Link href="/kutatas?section=lakitelek" className={styles.detailsLink}>
                Részletek <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        src={model.image}
        alt={`${model.name} - ${model.type}`}
        images={[
          { src: '/images/38SX_new.jpeg', alt: '38SX Nagy szériás ásógép' },
          { src: '/images/38WX_new.jpeg', alt: '38WX Lazítókéses ásógép' },
          { src: '/images/40SX_new.jpeg', alt: '40SX Mélyásógép' }
        ]}
        initialIndex={modelId === '38sx' ? 0 : modelId === '38wx' ? 1 : 2}
      />
    </section>
  )
}
