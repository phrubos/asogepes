'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import styles from './SoilHeroSlider.module.css'
import SliderVisualization from './SliderVisualization'
import HeroContentSlider from './HeroContentSlider'
import NavButtonSlider from './NavButtonSlider'
import { NAV_ITEMS, SoilHeroSliderProps } from './types'

export default function SoilHeroSlider({ onNavigate }: SoilHeroSliderProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [activeNavId, setActiveNavId] = useState<string | null>(null)

  // Scroll for parallax background effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  // Initialize loaded state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Handle slider position change
  const handleSliderChange = useCallback((position: number) => {
    setSliderPosition(position)
  }, [])

  // Handle drag state
  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Handle navigation hover
  const handleNavHover = useCallback((id: string | null) => {
    setActiveNavId(id)
  }, [])

  // Handle navigation click
  const handleNavClick = useCallback((sectionId: string) => {
    onNavigate(sectionId)
  }, [onNavigate])

  // Map nav IDs to section IDs
  const getSectionId = (navId: string) => {
    const mapping: Record<string, string> = {
      compaction: 'compaction',
      cultivator: 'cultivator',
      ploughing: 'ploughing',
    }
    return mapping[navId] || navId
  }

  return (
    <section ref={sectionRef} className={styles.heroSection}>
      {/* Organic Background Layers */}
      <motion.div className={styles.backgroundLayers} style={{ y: backgroundY }}>
        <div className={styles.backgroundGradient} />
        <div className={styles.noiseOverlay} />
        <div className={styles.organicShape} />
        <div className={styles.organicShape} />
        <div className={styles.organicShape} />
      </motion.div>

      {/* Main Content Layout */}
      <div className={styles.contentLayout}>
        {/* Left Column - Hero Content */}
        <div className={styles.leftColumn}>
          <HeroContentSlider
            isLoaded={isLoaded}
            sliderPosition={sliderPosition}
          />
        </div>

        {/* Center Column - Slider Visualization */}
        <div className={styles.centerColumn}>
          <SliderVisualization
            isLoaded={isLoaded}
            sliderPosition={sliderPosition}
            onSliderChange={handleSliderChange}
            isDragging={isDragging}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        </div>

        {/* Right Column - Navigation */}
        <div className={styles.rightColumn}>
          {NAV_ITEMS.map((item, index) => (
            <NavButtonSlider
              key={item.id}
              item={item}
              index={index}
              isActive={activeNavId === item.id}
              onHover={handleNavHover}
              onClick={() => handleNavClick(getSectionId(item.id))}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        <span className={styles.scrollText}>Görgess</span>
        <motion.div
          className={styles.scrollArrowContainer}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  )
}
