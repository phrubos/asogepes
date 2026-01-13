// ModelSection.tsx - Redesign Layout
import { useState } from 'react'
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
  const [isHovered, setIsHovered] = useState(false)
  const [isInView, setIsInView] = useState(false)

  const handleChartClick = () => {
    const element = document.getElementById('experiment-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
          onClick={handleChartClick}
        >
          {/* Left: Info */}
          <div className={styles.resultsInfo}>
            <div className={styles.resultsHeader}>
              <MapPin size={24} /> Kísérleti eredmények
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoList}>
                {/* Location */}
                <div className={styles.infoItem}>
                  <div className={styles.infoIconBox}><MapPin size={18} /></div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Helyszín</span>
                    <span className={styles.infoValue}>Szentkirály</span>
                  </div>
                </div>

                {/* Culture */}
                <div className={styles.infoItem}>
                  <div className={styles.infoIconBox}><Leaf size={18} /></div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Kultúra</span>
                    <span className={styles.infoValue}>{modelId === '38wx' ? 'Vöröshagyma' : 'Ipari paradicsom'}</span>
                  </div>
                </div>

                {/* Duration */}
                <div className={styles.infoItem}>
                  <div className={styles.infoIconBox}><Calendar size={18} /></div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Időszak</span>
                    <span className={styles.infoValue}>{modelId === '38wx' ? 'Márc-Jún (4 hónap)' : 'Máj-Aug (4 hónap)'}</span>
                  </div>
                </div>
              </div>

              <div className={styles.quoteBox}>
                <p className={styles.quoteText}>
                  {modelId === '38sx' && "Lazítással, szántással alkalmazva 95%-os hatékonyság."}
                  {modelId === '38wx' && "Optimális talajszerkezet fenntartás 3 hónapon túl."}
                  {modelId === '40sx' && "Kedvezően laza talajszerkezet 40 cm mélységig"}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Chart and Link Side-by-Side */}
          <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <div className={styles.chartHeaderLeft}>
                <BarChart3 size={24} /> Mérési Adatok
              </div>
            </div>

            <div
              className={styles.chartContainer}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div
                className={styles.chartVisual}
                initial="hidden"
                animate={isHovered ? "static" : (isInView ? "floating" : "hidden")}
                onViewportEnter={() => setIsInView(true)}
                viewport={{ once: true, margin: "-50px" }}
              >
                {[0.3, 0.5, 0.7, 1].map((targetScale, i) => (
                  <div key={i} className={styles.barContainer}>
                    <motion.div
                      className={`${styles.bar} ${i === 3 ? styles.gold : styles.gray}`}
                      variants={{
                        hidden: { height: '10%' },
                        floating: {
                          height: [`${targetScale * 40}%`, `${targetScale * 90}%`, `${targetScale * 30}%`, `${targetScale * 80}%`],
                          transition: {
                            duration: 2 + i * 0.5,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut"
                          }
                        },
                        static: {
                          height: `${targetScale * 80}%`,
                          transition: { duration: 0.5, ease: "easeOut" }
                        }
                      }}
                    />
                  </div>
                ))}
              </motion.div>

              <div className={styles.detailsLink}>
                Részletek <ArrowRight size={16} />
              </div>
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
          { src: '/images/38SX.png', alt: '38SX Nagy szériás ásógép' },
          { src: '/images/38WX.png', alt: '38WX Lazítókéses ásógép' },
          { src: '/images/40SX.png', alt: '40SX Mélyásógép' }
        ]}
        initialIndex={modelId === '38sx' ? 0 : modelId === '38wx' ? 1 : 2}
      />
    </section>
  )
}
