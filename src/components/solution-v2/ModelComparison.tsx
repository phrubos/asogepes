'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import TiltCard from '@/components/ui/TiltCard'
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
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>Modellválaszték</h3>
        <span className={styles.badge}>FLEET OVERVIEW</span>
      </div>

      <motion.div 
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {models.map((model) => (
          <motion.div key={model.id} variants={itemVariants}>
            <TiltCard
              tiltAmount={8}
              glowColor="rgba(212, 168, 75, 0.15)"
              scale={1.02}
              className={styles.card}
            >
              <article 
                className={styles.cardInner}
                onMouseEnter={() => setHoveredModel(model.id)}
                onMouseLeave={() => setHoveredModel(null)}
              >
                <div className={styles.imageContainer}>
                  <motion.div 
                    className={styles.imageWrapper}
                    animate={hoveredModel === model.id ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={model.image}
                      alt={model.name}
                      width={400}
                      height={300}
                      className={styles.image}
                    />
                  </motion.div>
                </div>
                
                <div className={styles.content}>
                  <div className={styles.infoHeader}>
                    <div className={styles.infoMain}>
                      <h4 className={styles.modelName}>{model.name}</h4>
                      <span className={styles.modelType}>{model.type}</span>
                    </div>
                    <motion.div 
                      className={styles.depthInfo}
                      animate={hoveredModel === model.id ? { 
                        backgroundColor: 'rgba(212, 168, 75, 0.2)',
                        borderColor: 'var(--color-gold)'
                      } : {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className={styles.depthLabel}>Munkamélység</span>
                      <span className={styles.depthValue}>{model.depth}</span>
                    </motion.div>
                  </div>

                  <div className={styles.specs}>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Teljesítmény igény</span>
                      <span className={styles.specValue}>{model.power}</span>
                    </div>
                    
                    <div className={styles.features}>
                      <span className={styles.featuresLabel}>Főbb jellemzők</span>
                      <ul className={styles.featuresList}>
                        {model.features.map((feat, idx) => (
                          <motion.li 
                            key={feat} 
                            className={styles.featureItem}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                          >
                            <motion.span 
                              className={styles.featureDot}
                              animate={hoveredModel === model.id ? {
                                backgroundColor: 'var(--color-gold)',
                                scale: 1.3
                              } : {
                                backgroundColor: 'rgba(212, 168, 75, 0.5)',
                                scale: 1
                              }}
                              transition={{ duration: 0.2 }}
                            />
                            {feat}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
