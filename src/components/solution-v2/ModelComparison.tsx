'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import styles from './SolutionNew.module.css'

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
    <div style={{ marginTop: 'var(--space-3xl)' }}>
       <div className={styles.blueprintHeader} style={{ marginBottom: 'var(--space-xl)' }}>
        <div className={styles.blueprintTitle}>
          Modellválaszték
        </div>
        <span className={styles.blueprintBadge}>FLEET OVERVIEW</span>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: 'var(--space-2xl)'
      }}>
        {models.map((model, idx) => (
          <motion.div 
            key={model.id}
            className={styles.blueprintContainer}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.2 }}
            style={{ padding: '0', overflow: 'hidden' }}
          >
            <div style={{ 
              height: '240px', 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-lg)'
            }}>
              <div className={styles.modelImageWrapper}>
                <Image
                  src={model.image}
                  alt={model.name}
                  width={400}
                  height={300}
                  className={styles.modelImage}
                  style={{ 
                    objectFit: 'contain', 
                  }}
                />
              </div>
            </div>
            
            <div style={{ padding: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
                <div>
                  <h3 style={{ color: 'var(--color-white)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '4px' }}>{model.name}</h3>
                  <span style={{ color: 'var(--color-gold)', fontSize: '0.875rem', fontFamily: 'monospace' }}>{model.type}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Munkamélység</div>
                  <div style={{ color: 'var(--color-white)', fontWeight: '700' }}>{model.depth}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--space-lg)' }}>
                <div style={{ marginBottom: 'var(--space-md)' }}>
                   <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Teljesítmény igény</span>
                   <div style={{ color: 'var(--color-white)', fontWeight: '600' }}>{model.power}</div>
                </div>
                
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Főbb jellemzők</span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {model.features.map(feat => (
                      <li key={feat} style={{ 
                        color: 'rgba(255,255,255,0.8)', 
                        fontSize: '0.875rem', 
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ width: '4px', height: '4px', background: 'var(--color-gold)', borderRadius: '50%' }} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
