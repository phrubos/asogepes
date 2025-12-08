'use client'

import { useEffect, useRef } from 'react'
import styles from './SpadeAnimation.module.css'

export default function SpadeAnimation() {
  const grassLayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate grass blades
    const grassLayer = grassLayerRef.current
    if (!grassLayer || grassLayer.children.length > 0) return

    for (let i = 0; i < 70; i++) {
      const blade = document.createElement('div')
      blade.className = styles.grassBlade
      blade.style.left = `${(i * 1.43) + Math.random() * 0.5}%`
      blade.style.height = `${7 + Math.random() * 10}px`
      blade.style.transform = `rotate(${-6 + Math.random() * 12}deg)`
      blade.style.opacity = `${0.5 + Math.random() * 0.4}`
      grassLayer.appendChild(blade)
    }
  }, [])

  return (
    <div className={styles.animationContainer}>
      {/* Soil texture */}
      <div className={styles.soilTexture} />

      {/* Surface line */}
      <div className={styles.surfaceLine} />

      {/* Grass layer */}
      <div className={styles.grassLayer} ref={grassLayerRef} />

      {/* Loosened soil effect */}
      <div className={styles.loosenedSoilContainer}>
        <div className={styles.loosenedArea}>
          <div className={styles.loosenedLines} />
        </div>
        {/* Wave ripple effects */}
        <div className={styles.soilWaves}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.soilWave} style={{ '--wave-index': i } as React.CSSProperties} />
          ))}
        </div>
        {/* Processing energy glow */}
        <div className={styles.processingGlow} />
      </div>

      {/* Cleared grass overlay */}
      <div className={styles.clearedOverlay} />

      {/* Machine assembly */}
      <div className={styles.machineAssembly}>
        {/* Connection bar */}
        <div className={styles.connectionBar} />

        {/* Spade Rotor */}
        <div className={styles.spadeRotor}>
          <div className={styles.rotorHousing}>
            <span className={styles.brandLabel}>IMANTS</span>
            <div className={styles.brandAccent} />
          </div>
          <div className={styles.rotorDisc}>
            <div className={styles.rotorCenter} />
          </div>
          <div className={styles.spadeArms}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.spadeArm} style={{ '--arm-index': i } as React.CSSProperties}>
                <div className={styles.armShaft} />
                <div className={styles.spadeBlade} />
              </div>
            ))}
          </div>
          {/* Particles - enhanced visibility */}
          <div className={styles.particles}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className={styles.particle} style={{ '--particle-index': i } as React.CSSProperties} />
            ))}
          </div>
        </div>

        {/* Smoothing Roller */}
        <div className={styles.smoothingRoller}>
          <div className={styles.rollerFrame} />
          <div className={styles.rollerSupport} />
          <div className={styles.rollerWheel}>
            <div className={styles.rollerHub} />
          </div>
        </div>
      </div>

      {/* Info labels */}
      <div className={styles.infoLabels}>
        <div className={`${styles.infoLabel} ${styles.label1}`}>
          <span className={styles.labelNumber}>1</span>
          Lazító ásókanál
        </div>
        <div className={`${styles.infoLabel} ${styles.label2}`}>
          <span className={styles.labelNumber}>2</span>
          Simító henger
        </div>
        <div className={`${styles.infoLabel} ${styles.label3}`}>
          <span className={styles.directionArrow}>
            <span className={styles.arrowLine} />
          </span>
          Haladási irány
        </div>
      </div>
    </div>
  )
}
