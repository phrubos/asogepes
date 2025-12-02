'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn } from 'lucide-react'
import Image from 'next/image'
import ImageModal from '@/components/ui/ImageModal'
import styles from './ConsequenceImage.module.css'

export default function ConsequenceImage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <motion.div
        className={styles.imageCard}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={styles.imageWrapper}>
          <Image
            src="/images/kovetkezmeny.png"
            alt="A Tömör Talaj Következményei - Infografika"
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className={styles.overlay}>
            <div className={styles.zoomIcon}>
              <ZoomIn size={32} />
            </div>
            <span className={styles.zoomText}>Kattints a nagyításhoz</span>
          </div>
        </div>
        <p className={styles.caption}>
          A tömör talaj következményei — interaktív infografika
        </p>
      </motion.div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        src="/images/kovetkezmeny.png"
        alt="A Tömör Talaj Következményei - Infografika"
      />
    </>
  )
}
