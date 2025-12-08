'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Folder, Play, HelpCircle, Sparkles } from 'lucide-react'
import styles from './HubFolder.module.css'

type HoveredOption = 'operation' | 'models' | 'guide' | null
type ModelId = '38sx' | '38wx' | '40sx'
type DemoState = 'idle' | 'hub' | 'operation' | 'models' | 'guide'

interface HubFolderProps {
  onScrollToOperation: () => void
  onScrollToModel: (modelId: ModelId) => void
  onScrollToGuide: () => void
}

const modelData = [
  { id: '38sx' as ModelId, name: '38SX', type: 'Nagy szériás', tag: 'Standard', color: 'brown' },
  { id: '38wx' as ModelId, name: '38WX', type: 'Lazítókéses', tag: 'Hybrid', color: 'green' },
  { id: '40sx' as ModelId, name: '40SX', type: 'Mélyásógép', tag: 'Deep', color: 'blue' },
]

// Demo sequence - simulates user interaction with dynamic, snappy timing
const DEMO_SEQUENCE: { state: DemoState; duration: number }[] = [
  { state: 'idle', duration: 400 },
  { state: 'hub', duration: 900 },
  { state: 'operation', duration: 1600 },
  { state: 'hub', duration: 700 },
  { state: 'models', duration: 1800 },
  { state: 'hub', duration: 700 },
  { state: 'guide', duration: 1600 },
  { state: 'hub', duration: 600 },
]

export default function HubFolder({ onScrollToOperation, onScrollToModel, onScrollToGuide }: HubFolderProps) {
  const [hoveredOption, setHoveredOption] = useState<HoveredOption>(null)
  const [isHubHovered, setIsHubHovered] = useState(false)
  const [hoveredMiniFolder, setHoveredMiniFolder] = useState<string | null>(null)
  
  // Demo animation state
  const [demoState, setDemoState] = useState<DemoState>('idle')
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const demoTimeoutRef = useRef<NodeJS.Timeout>()
  const resumeTimeoutRef = useRef<NodeJS.Timeout>()
  const sequenceIndexRef = useRef(0)

  // Run demo sequence when not interacting
  useEffect(() => {
    if (isUserInteracting) return

    const runNextStep = () => {
      const step = DEMO_SEQUENCE[sequenceIndexRef.current]
      setDemoState(step.state)
      
      demoTimeoutRef.current = setTimeout(() => {
        sequenceIndexRef.current = (sequenceIndexRef.current + 1) % DEMO_SEQUENCE.length
        runNextStep()
      }, step.duration)
    }

    runNextStep()

    return () => {
      if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current)
    }
  }, [isUserInteracting])

  // Stop demo when user interacts
  const handleUserInteractionStart = useCallback(() => {
    setIsUserInteracting(true)
    setDemoState('idle')
    if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current)
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
  }, [])

  // Resume demo after user stops interacting
  const handleUserInteractionEnd = useCallback(() => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false)
      sequenceIndexRef.current = 0
    }, 3000) // Resume demo 3 seconds after user stops
  }, [])

  // Keep nav visible when hovering over nav buttons
  const handleNavMouseEnter = useCallback((type: HoveredOption) => {
    setHoveredOption(type)
  }, [])

  const handleNavMouseLeave = useCallback(() => {
    setHoveredOption(null)
  }, [])

  // Animation variants - snappier for dynamic demo
  const hubVariants = {
    initial: { scale: 1, y: 0 },
    hover: {
      scale: 1.05,
      y: -15,
      transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }
    }
  }

  const frontVariants = {
    initial: { rotateY: 0, x: 0 },
    hover: {
      rotateY: -12,
      x: 20,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const sheetVariants = {
    initial: { x: -8, y: -5 },
    hover: {
      x: -25,
      y: -15,
      rotate: -2,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const sheet2Variants = {
    initial: { x: -4, y: -2 },
    hover: {
      x: -15,
      y: -8,
      rotate: -1,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const tabVariants = {
    initial: { y: 0 },
    hover: {
      y: -5,
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const navButtonVariants = {
    hidden: { opacity: 0, x: 30, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1]
      }
    }),
    exit: {
      opacity: 0,
      x: 30,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  }

  const navButtonLeftVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1]
      }
    },
    exit: {
      opacity: 0,
      x: -30,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  }

  const navButtonBottomVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.85, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1]
      }
    },
    exit: {
      opacity: 0,
      y: 40,
      scale: 0.85,
      rotateX: -15,
      transition: { duration: 0.25 }
    }
  }

  const connectionVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 0.25, ease: 'easeOut' }
    },
    exit: {
      scaleX: 0,
      opacity: 0,
      transition: { duration: 0.15 }
    }
  }

  // Compute effective states (user interaction overrides demo)
  const effectiveHubHovered = isUserInteracting ? isHubHovered : (demoState === 'hub' || demoState === 'operation' || demoState === 'models' || demoState === 'guide')
  const effectiveHoveredOption = isUserInteracting ? hoveredOption : (demoState === 'operation' ? 'operation' : demoState === 'models' ? 'models' : demoState === 'guide' ? 'guide' : null)

  return (
    <div 
      className={`${styles.hubScene} ${effectiveHoveredOption ? styles.hubSceneActive : ''}`}
      onMouseEnter={handleUserInteractionStart}
      onMouseLeave={handleUserInteractionEnd}
    >
      {/* Background Glow */}
      <div className={styles.hubGlow} />
      
      {/* Animated Particles */}
      <div className={styles.particles}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.particle} style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
      </div>

      {/* Connection Lines - SVG Bezier Curves */}
      <AnimatePresence>
        {effectiveHoveredOption === 'operation' && (
          <motion.svg 
            className={`${styles.connectionSvg} ${styles.connectionSvgLeft}`}
            viewBox="0 0 100 60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.path
              d="M100,30 Q60,30 50,15 Q40,0 0,30"
              className={styles.connectionPath}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ pathLength: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.circle
              cx="0"
              cy="30"
              r="4"
              className={styles.connectionDot}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ delay: 0.35, duration: 0.2 }}
            />
          </motion.svg>
        )}
        {effectiveHoveredOption === 'models' && (
          <motion.svg
            className={`${styles.connectionSvg} ${styles.connectionSvgRight}`}
            viewBox="0 0 100 60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.path
              d="M0,30 Q40,30 50,15 Q60,0 100,30"
              className={styles.connectionPath}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ pathLength: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.circle
              cx="100"
              cy="30"
              r="4"
              className={styles.connectionDot}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ delay: 0.35, duration: 0.2 }}
            />
          </motion.svg>
        )}
        {effectiveHoveredOption === 'guide' && (
          <motion.svg
            className={`${styles.connectionSvg} ${styles.connectionSvgLeftLower}`}
            viewBox="0 0 100 60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.path
              d="M100,30 Q60,30 50,45 Q40,60 0,30"
              className={styles.connectionPath}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ pathLength: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.circle
              cx="0"
              cy="30"
              r="4"
              className={styles.connectionDot}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ delay: 0.35, duration: 0.2 }}
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Nav Folders: Operation (left side) */}
      <AnimatePresence>
        {effectiveHoveredOption === 'operation' && (
          <motion.div 
            className={`${styles.navGroup} ${styles.navLeft}`}
            onMouseEnter={() => handleNavMouseEnter('operation')}
            onMouseLeave={handleNavMouseLeave}
          >
            <motion.button
              className={`${styles.miniFolder} ${styles.miniFolderGreen} ${hoveredMiniFolder && hoveredMiniFolder !== 'operation' ? styles.miniFolderDimmed : ''}`}
              variants={navButtonLeftVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={onScrollToOperation}
              onMouseEnter={() => setHoveredMiniFolder('operation')}
              onMouseLeave={() => setHoveredMiniFolder(null)}
              whileHover={{ scale: 1.08, y: -10 }}
            >
              <div className={`${styles.miniFolderTab} ${styles.miniFolderTabGreen}`}>
                Elv
              </div>
              <div className={styles.miniFolderBack} />
              <div className={styles.miniFolderSheets}>
                <div className={styles.miniSheet} />
              </div>
              <div className={styles.miniFolderFront}>
                <div className={styles.miniFolderIcon}>
                  <Play size={24} />
                </div>
                <span className={styles.miniFolderLabel}>Működési elv</span>
                <span className={styles.miniFolderDesc}>Animáció megtekintése</span>
              </div>
              <div className={styles.miniFolderGlowGreen} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Folders: Models (right side) */}
      <AnimatePresence>
        {effectiveHoveredOption === 'models' && (
          <motion.div 
            className={`${styles.navGroup} ${styles.navRight}`}
            onMouseEnter={() => handleNavMouseEnter('models')}
            onMouseLeave={handleNavMouseLeave}
          >
            {modelData.map((model, index) => (
              <motion.button
                key={model.id}
                className={`${styles.miniFolder} ${styles[`miniFolder${model.color.charAt(0).toUpperCase() + model.color.slice(1)}`]} ${hoveredMiniFolder && hoveredMiniFolder !== model.id ? styles.miniFolderDimmed : ''}`}
                variants={navButtonVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => onScrollToModel(model.id)}
                onMouseEnter={() => setHoveredMiniFolder(model.id)}
                onMouseLeave={() => setHoveredMiniFolder(null)}
                whileHover={{ scale: 1.08, y: -10 }}
              >
                <div className={`${styles.miniFolderTab} ${styles[`miniFolderTab${model.color.charAt(0).toUpperCase() + model.color.slice(1)}`]}`}>
                  {model.tag}
                </div>
                <div className={styles.miniFolderBack} />
                <div className={styles.miniFolderSheets}>
                  <div className={styles.miniSheet} />
                </div>
                <div className={styles.miniFolderFront}>
                  <div className={styles.miniFolderImageWrap}>
                    <img 
                      src={`/images/${model.name}.png`} 
                      alt={model.name}
                      className={styles.miniFolderImage}
                    />
                  </div>
                  <span className={styles.miniFolderLabel}>{model.name}</span>
                  <span className={styles.miniFolderDesc}>{model.type}</span>
                </div>
                <div className={`${styles.miniFolderGlow} ${styles[`miniFolderGlow${model.color.charAt(0).toUpperCase() + model.color.slice(1)}`]}`} />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Folder: Guide (left side, lower) */}
      <AnimatePresence>
        {effectiveHoveredOption === 'guide' && (
          <motion.div
            className={`${styles.navGroup} ${styles.navLeftLower}`}
            onMouseEnter={() => handleNavMouseEnter('guide')}
            onMouseLeave={handleNavMouseLeave}
          >
            <motion.button
              className={`${styles.miniFolder} ${styles.miniFolderPurple} ${hoveredMiniFolder && hoveredMiniFolder !== 'guide' ? styles.miniFolderDimmed : ''}`}
              variants={navButtonLeftVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={onScrollToGuide}
              onMouseEnter={() => setHoveredMiniFolder('guide')}
              onMouseLeave={() => setHoveredMiniFolder(null)}
              whileHover={{ scale: 1.08, y: -10 }}
            >
              <div className={`${styles.miniFolderTab} ${styles.miniFolderTabPurple}`}>
                Guide
              </div>
              <div className={styles.miniFolderBack} />
              <div className={styles.miniFolderSheets}>
                <div className={styles.miniSheet} />
              </div>
              <div className={styles.miniFolderFront}>
                <div className={styles.miniFolderIcon}>
                  <Sparkles size={24} />
                </div>
                <span className={styles.miniFolderLabel}>Módszer választó</span>
                <span className={styles.miniFolderDesc}>Melyik a legjobb?</span>
              </div>
              <div className={styles.miniFolderGlowPurple} />
              {/* Floating sparkles */}
              <motion.div
                className={styles.floatingSparkles}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Sparkles size={12} />
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Hub Folder */}
      <motion.div
        className={`${styles.hubFolder} ${effectiveHoveredOption ? styles.hubFolderActive : ''}`}
        variants={hubVariants}
        initial="initial"
        animate={effectiveHubHovered ? "hover" : "initial"}
        onMouseEnter={() => setIsHubHovered(true)}
        onMouseLeave={() => setIsHubHovered(false)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Tab */}
        <motion.div 
          className={styles.hubTab}
          variants={tabVariants}
          animate={effectiveHubHovered ? "hover" : "initial"}
        >
          Navigáció
        </motion.div>

        {/* Back */}
        <div className={styles.hubBack} />

        {/* Sheets */}
        <div className={styles.hubSheets}>
          <motion.div 
            className={styles.hubSheet} 
            variants={sheetVariants}
            animate={effectiveHubHovered ? "hover" : "initial"}
          />
          <motion.div 
            className={styles.hubSheet} 
            variants={sheet2Variants}
            animate={effectiveHubHovered ? "hover" : "initial"}
          />
        </div>

        {/* Front */}
        <motion.div
          className={styles.hubFront}
          variants={frontVariants}
          animate={effectiveHubHovered ? "hover" : "initial"}
        >
          {/* Shine sweep effect */}
          <div className={styles.shine} />
          <div className={styles.hubContent}>
            {/* Header */}
            <div className={styles.hubHeader}>
              <h3 className={styles.hubTitle}>Technológia</h3>
              <span className={styles.hubSubtitle}>Válasszon témát</span>
            </div>

            {/* Options */}
            <div className={styles.hubOptions}>
              {/* Option 1: Működési elv */}
              <div 
                className={`${styles.hubOption} ${effectiveHoveredOption === 'operation' ? styles.hubOptionActive : ''}`}
                onMouseEnter={() => handleNavMouseEnter('operation')}
                onMouseLeave={handleNavMouseLeave}
              >
                <div className={styles.optionIcon}>
                  <Settings size={18} />
                </div>
                <div className={styles.optionText}>
                  <span className={styles.optionTitle}>Működési elv</span>
                  <span className={styles.optionDesc}>Hogyan működik?</span>
                </div>
                <span className={styles.optionCount}>1</span>
              </div>

              {/* Option 2: Modellek */}
              <div
                className={`${styles.hubOption} ${effectiveHoveredOption === 'models' ? styles.hubOptionActive : ''}`}
                onMouseEnter={() => handleNavMouseEnter('models')}
                onMouseLeave={handleNavMouseLeave}
              >
                <div className={styles.optionIcon}>
                  <Folder size={18} />
                </div>
                <div className={styles.optionText}>
                  <span className={styles.optionTitle}>Modellek</span>
                  <span className={styles.optionDesc}>Imants típusok</span>
                </div>
                <span className={styles.optionCount}>3</span>
              </div>

              {/* Option 3: Módszer választó */}
              <div
                className={`${styles.hubOption} ${effectiveHoveredOption === 'guide' ? styles.hubOptionActive : ''}`}
                onMouseEnter={() => handleNavMouseEnter('guide')}
                onMouseLeave={handleNavMouseLeave}
              >
                <div className={styles.optionIcon}>
                  <HelpCircle size={18} />
                </div>
                <div className={styles.optionText}>
                  <span className={styles.optionTitle}>Útmutató</span>
                  <span className={styles.optionDesc}>Melyik módszert?</span>
                </div>
                <span className={styles.optionCount}>1</span>
              </div>
            </div>

            {/* Footer */}
            <div className={styles.hubFooter}>
              <span className={styles.hubMeta}>IMANTS Tech</span>
              <span className={styles.hubVersion}>v2.0</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
