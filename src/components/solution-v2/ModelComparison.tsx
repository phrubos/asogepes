'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import styles from './ModelComparison.module.css'

const models = [
  {
    id: '40sx',
    name: '40SX Series',
    image: '/images/40SX.png',
    type: 'Heavy Duty Spader',
    depth: '20-50 cm',
    power: '100-250 LE',
    features: ['Dupla rotor', 'Automata kenés', 'Kővédelem']
  },
  {
    id: '38sx',
    name: '38SX Series',
    image: '/images/38SX.png',
    type: 'Standard Spader',
    depth: '15-35 cm',
    power: '80-150 LE',
    features: ['Kompakt felépítés', 'Költséghatékony', 'Könnyű karbantartás']
  }
]

export default function ModelComparison() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>Modellválaszték</h3>
        <span className={styles.badge}>FLEET OVERVIEW</span>
      </div>

      <div className={styles.grid}>
        {models.map((model, idx) => (
          <motion.article 
            key={model.id}
            className={styles.card}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
          >
            <div className={styles.imageContainer}>
              <div className={styles.imageWrapper}>
                <Image
                  src={model.image}
                  alt={model.name}
                  width={400}
                  height={300}
                  className={styles.image}
                />
              </div>
            </div>
            
            <div className={styles.content}>
              <div className={styles.infoHeader}>
                <div className={styles.infoMain}>
                  <h4 className={styles.modelName}>{model.name}</h4>
                  <span className={styles.modelType}>{model.type}</span>
                </div>
                <div className={styles.depthInfo}>
                  <span className={styles.depthLabel}>Munkamélység</span>
                  <span className={styles.depthValue}>{model.depth}</span>
                </div>
              </div>

              <div className={styles.specs}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Teljesítmény igény</span>
                  <span className={styles.specValue}>{model.power}</span>
                </div>
                
                <div className={styles.features}>
                  <span className={styles.featuresLabel}>Főbb jellemzők</span>
                  <ul className={styles.featuresList}>
                    {model.features.map(feat => (
                      <li key={feat} className={styles.featureItem}>
                        <span className={styles.featureDot} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
