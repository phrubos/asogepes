'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gauge } from 'lucide-react'
import Image from 'next/image'
import ImageLightbox from '@/components/ui/ImageLightbox/ImageLightbox'
import styles from './MethodologyPage.module.css'
import PenetrometerExplainer from '../PenetrometerExplainer'
import { useLocale } from '@/lib/i18n/LocaleProvider'

export default function MethodologyPage() {
  const en = useLocale() === 'en'
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  return (
    <div className={styles.methodologyPage}>
      <div className={styles.content}>
        {/* Left Column - Text */}
        <motion.div
          className={styles.textColumn}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <Gauge size={28} />
            </div>
            <div>
              <h2 className={styles.title}>{en ? 'Penetrometer measurement' : 'A penetrométeres mérés'}</h2>
              <span className={styles.badge}>{en ? 'Methodology' : 'Módszertan'}</span>
            </div>
          </div>

          <p className={styles.description}>
            {en ? (
              <>
                The steel probe of the instrument is pushed vertically into the soil by hand, at a steady pace. The pressure
                gauge in the middle of the handle shows the soil resistance at the tip of the probe. Up to{' '}
                <strong>20 bar</strong> the soil structure is considered optimal, free of compaction.
              </>
            ) : (
              <>
                A készülék acél szondatüskéjét kézi erővel, függőlegesen a talajba szúrjuk, egyenletesen haladva.
                A fogantyú közepén elhelyezett manométer mutatja a talaj ellenállását a szonda csúcsánál.
                A talaj szerkezete <strong>20 bar nyomásig</strong> tekinthető optimálisnak, tömörödésmentesnek.
              </>
            )}
          </p>

          <div className={styles.dashboardContainer}>
            <div className={styles.measurementDashboard}>
              <div className={styles.scaleBar}>
                <div className={styles.scaleOptimal}>
                  <span className={styles.scaleLabel}>{en ? 'Optimal' : 'Optimális'}</span>
                  <span className={styles.scaleValue}>0-20 bar</span>
                </div>
                <div className={styles.scaleCompacted}>
                  <span className={styles.scaleLabel}>{en ? 'Compacted' : 'Tömörödött'}</span>
                  <span className={styles.scaleValue}>&gt;20 bar</span>
                </div>
              </div>

              <div
                className={styles.manometerWrapper}
                onClick={() => setLightboxImage('/images/manometer_200_v2.jpg')}
                style={{ cursor: 'pointer' }}
              >
                <Image
                  src="/images/manometer_200_v2.jpg"
                  alt={en ? 'Pressure gauge' : 'Manométer'}
                  fill
                  className={styles.manometerImage}
                  sizes="140px"
                />
              </div>
            </div>


          </div>
        </motion.div>

        {/* Right Column - Image Placeholder */}
        <motion.div
          className={styles.imageColumn}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            className={styles.imageWrapper}
            onClick={() => setLightboxImage('/images/penetrometer_rotated_view.jpg')}
            style={{ cursor: 'pointer' }}
          >
            <Image
              src="/images/penetrometer_rotated_view.jpg"
              alt={en ? 'Penetrometer' : 'Penetrométer'}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 450px"
              priority
            />
          </div>
        </motion.div>

        <ImageLightbox
          isOpen={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
          src={lightboxImage || ''}
          alt={en ? 'Enlarged image' : 'Nagyított kép'}
        />
      </div>

      <div className={styles.explainer}>
        <PenetrometerExplainer />
      </div>
    </div>
  )
}
