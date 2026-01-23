'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gauge, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import ImageLightbox from '@/components/ui/ImageLightbox/ImageLightbox'
import styles from './MethodologyPage.module.css'

export default function MethodologyPage() {
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
              <h1 className={styles.title}>A penetrométeres mérés</h1>
              <span className={styles.badge}>Módszertan</span>
            </div>
          </div>

          <p className={styles.description}>
            A készülék acél szondatüskéjét kézi erővel, függőlegesen a talajba szúrjuk, egyenletesen haladva.
            A fogantyú közepén elhelyezett manométer mutatja a talaj ellenállását a szonda csúcsánál.
            A talaj szerkezete <strong>20 bar nyomásig</strong> tekinthető optimálisnak, tömörödésmentesnek.
          </p>

          <div className={styles.dashboardContainer}>
            <div className={styles.measurementDashboard}>
              <div className={styles.scaleBar}>
                <div className={styles.scaleOptimal}>
                  <span className={styles.scaleLabel}>Optimális</span>
                  <span className={styles.scaleValue}>0-20 bar</span>
                </div>
                <div className={styles.scaleCompacted}>
                  <span className={styles.scaleLabel}>Tömörödött</span>
                  <span className={styles.scaleValue}>&gt;20 bar</span>
                </div>
              </div>

              <div
                className={styles.manometerWrapper}
                onClick={() => setLightboxImage('/images/manometer_200_v2.png')}
                style={{ cursor: 'pointer' }}
              >
                <Image
                  src="/images/manometer_200_v2.png"
                  alt="Manométer"
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
            onClick={() => setLightboxImage('/images/penetrometer_rotated_view.png')}
            style={{ cursor: 'pointer' }}
          >
            <Image
              src="/images/penetrometer_rotated_view.png"
              alt="Penetrométer"
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
          alt="Nagyított kép"
        />
      </div>
    </div>
  )
}
