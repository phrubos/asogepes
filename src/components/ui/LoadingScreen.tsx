'use client'

import { motion, AnimatePresence } from 'framer-motion'
import SoilLoader from './SoilLoader'

interface LoadingScreenProps {
  isLoading: boolean
  message?: string
}

export default function LoadingScreen({
  isLoading,
  message = 'Betöltés...'
}: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            backgroundColor: '#1A1612', // Critical: Hardcoded fallback for dark background
            background: 'var(--color-earth-900, #1A1612)',
          }}
        >
          {/* Background gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(ellipse 80% 50% at 50% 0%, rgba(107, 139, 94, 0.2), transparent),
                radial-gradient(ellipse 60% 40% at 80% 100%, rgba(212, 168, 75, 0.1), transparent)
              `,
              pointerEvents: 'none',
            }}
          />

          {/* Loader */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <SoilLoader size="lg" />
          </motion.div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              fontSize: '0.9rem',
              color: 'rgba(240, 245, 240, 0.6)',
              letterSpacing: '0.05em',
              fontWeight: 500,
            }}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
