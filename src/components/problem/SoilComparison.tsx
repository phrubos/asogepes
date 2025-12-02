'use client'

import { motion } from 'framer-motion'
import styles from './SoilComparison.module.css'

export default function SoilComparison() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Talajszelvény Összehasonlítás</h3>
      <p className={styles.subtitle}>Szántott vs. ásógépezett talaj szerkezete</p>
      
      <div className={styles.comparison}>
        {/* Szántott talaj */}
        <motion.div 
          className={styles.side}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.label}>
            <span className={styles.labelBad}>Szántott talaj</span>
          </div>
          <div className={styles.soilProfile}>
            {/* Placeholder ábra helye */}
            <div className={styles.placeholder}>
              <div className={styles.layer} style={{ height: '25%', background: 'linear-gradient(180deg, #8B7355 0%, #6B5344 100%)' }}>
                <span className={styles.layerLabel}>Művelt réteg</span>
                <span className={styles.layerDepth}>0-25 cm</span>
              </div>
              <div className={styles.compactedLayer}>
                <span className={styles.compactedLabel}>⚠️ EKETALP</span>
                <span className={styles.compactedNote}>20+ bar nyomás</span>
              </div>
              <div className={styles.layer} style={{ height: '60%', background: 'linear-gradient(180deg, #5D4037 0%, #4E342E 100%)' }}>
                <span className={styles.layerLabel}>Tömör altalaj</span>
                <span className={styles.layerDepth}>30+ cm</span>
                <div className={styles.blockedRoots}>
                  <span>↓ Gyökerek nem jutnak át</span>
                </div>
              </div>
            </div>
            
            {/* Ide jön majd a valódi ábra */}
            <div className={styles.imageSlot}>
              <span className={styles.imageSlotText}>📊 Ábra helye</span>
              <span className={styles.imageSlotNote}>Szakdolgozat 13. ábra alapján</span>
            </div>
          </div>
          
          <div className={styles.problems}>
            <div className={styles.problemItem}>❌ Eketalp akadályozza a gyökereket</div>
            <div className={styles.problemItem}>❌ Víz nem jut mélyebb rétegekbe</div>
            <div className={styles.problemItem}>❌ Talajélet károsodik</div>
          </div>
        </motion.div>

        {/* VS divider */}
        <div className={styles.divider}>
          <span className={styles.vs}>VS</span>
        </div>

        {/* Ásógépezett talaj */}
        <motion.div 
          className={styles.side}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.label}>
            <span className={styles.labelGood}>Ásógépezett talaj</span>
          </div>
          <div className={styles.soilProfile}>
            {/* Placeholder ábra helye */}
            <div className={styles.placeholder}>
              <div className={styles.layer} style={{ height: '85%', background: 'linear-gradient(180deg, #8B7355 0%, #6D5C4D 50%, #5D4F42 100%)' }}>
                <span className={styles.layerLabel}>Egyenletesen lazított</span>
                <span className={styles.layerDepth}>0-45 cm</span>
                <div className={styles.healthyRoots}>
                  <span>✓ Gyökerek szabadon fejlődnek</span>
                </div>
              </div>
            </div>
            
            {/* Ide jön majd a valódi ábra */}
            <div className={styles.imageSlot}>
              <span className={styles.imageSlotText}>📊 Ábra helye</span>
              <span className={styles.imageSlotNote}>Szakdolgozat alapján</span>
            </div>
          </div>
          
          <div className={styles.benefits}>
            <div className={styles.benefitItem}>✅ Nincs tömör réteg</div>
            <div className={styles.benefitItem}>✅ Víz egyenletesen oszlik el</div>
            <div className={styles.benefitItem}>✅ Talajélet megmarad</div>
          </div>
        </motion.div>
      </div>
      
      <div className={styles.caption}>
        <strong>Forrás:</strong> Szakdolgozat 13. ábra, 32. oldal — Penetrométeres mérések alapján
      </div>
    </div>
  )
}
