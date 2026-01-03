'use client'

import { useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SOIL_LAYERS, ANIMATION, IsometricBlockProps } from './types'

export default function IsometricBlock({
  isLoaded,
  mousePosition,
  openDrawers,
  activeLayer,
  onLayerClick,
  onLayerHover,
}: IsometricBlockProps) {
  // Calculate subtle rotation based on mouse position
  const rotation = useMemo(() => {
    const intensity = 8 // subtle rotation
    return {
      x: mousePosition.normalizedY * intensity * -1,
      y: mousePosition.normalizedX * intensity,
    }
  }, [mousePosition])

  // Check if drawer is open
  const isDrawerOpen = useCallback(
    (layerId: string) => {
      return openDrawers.some((d) => d.layerId === layerId && d.isOpen)
    },
    [openDrawers]
  )

  // Cube dimensions
  const cubeWidth = 220
  const cubeDepth = 160
  const layerHeight = 70
  const totalHeight = layerHeight * SOIL_LAYERS.length

  return (
    <motion.div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        height: '450px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Depth Scale on the left */}
      <motion.div
        style={{
          position: 'absolute',
          left: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          height: `${totalHeight + 40}px`,
          zIndex: 5,
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        {[0, 15, 35, 55, 80].map((depth, i) => (
          <div
            key={depth}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: i === 4 ? '0' : '1',
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                color: 'rgba(245, 240, 232, 0.4)',
                whiteSpace: 'nowrap',
                width: '40px',
                textAlign: 'right',
              }}
            >
              {depth} cm
            </span>
            <div
              style={{
                width: '15px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.4))',
              }}
            />
          </div>
        ))}
      </motion.div>

      {/* 3D Scene Container */}
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${-25 + rotation.x}deg) rotateY(${-40 + rotation.y}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Isometric Cube made of layers */}
        <div
          style={{
            position: 'relative',
            transformStyle: 'preserve-3d',
            width: `${cubeWidth}px`,
            height: `${totalHeight}px`,
          }}
        >
          {SOIL_LAYERS.map((layer, index) => {
            const isOpen = isDrawerOpen(layer.id)
            const isActive = activeLayer === layer.id
            const yPos = index * layerHeight
            const pullDistance = isOpen ? 80 : 0

            return (
              <motion.div
                key={layer.id}
                style={{
                  position: 'absolute',
                  top: `${yPos}px`,
                  left: 0,
                  width: `${cubeWidth}px`,
                  height: `${layerHeight}px`,
                  transformStyle: 'preserve-3d',
                  cursor: 'pointer',
                  zIndex: isOpen || isActive ? 10 : SOIL_LAYERS.length - index,
                }}
                animate={{
                  z: pullDistance,
                  x: pullDistance * 0.5,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 25,
                }}
                onClick={() => onLayerClick(layer.id)}
                onMouseEnter={() => onLayerHover(layer.id)}
                onMouseLeave={() => onLayerHover(null)}
                whileHover={{ scale: 1.02 }}
              >
                {/* TOP FACE */}
                <div
                  style={{
                    position: 'absolute',
                    width: `${cubeWidth}px`,
                    height: `${cubeDepth}px`,
                    background: `linear-gradient(135deg, ${layer.color} 0%, ${layer.darkColor} 100%)`,
                    transform: `rotateX(90deg) translateZ(0px)`,
                    transformOrigin: 'bottom',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    borderLeft: '1px solid rgba(255,255,255,0.05)',
                  }}
                />

                {/* FRONT FACE */}
                <div
                  style={{
                    position: 'absolute',
                    width: `${cubeWidth}px`,
                    height: `${layerHeight}px`,
                    background: `linear-gradient(180deg, ${layer.color} 0%, ${layer.darkColor} 100%)`,
                    transform: `translateZ(${cubeDepth / 2}px)`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 16px',
                    borderTop: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: isActive ? `0 0 20px ${layer.color}60` : 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.6rem',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '4px',
                    }}
                  >
                    {layer.depth.start}-{layer.depth.end} cm
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    {layer.name}
                  </span>

                  {/* Pull handle indicator */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '30px',
                      height: '3px',
                      background: isActive ? 'rgba(201, 162, 39, 0.8)' : 'rgba(255,255,255,0.2)',
                      borderRadius: '2px',
                      transition: 'background 0.2s ease',
                    }}
                  />
                </div>

                {/* RIGHT FACE */}
                <div
                  style={{
                    position: 'absolute',
                    width: `${cubeDepth}px`,
                    height: `${layerHeight}px`,
                    background: `linear-gradient(180deg, ${layer.sideColor} 0%, ${layer.darkColor} 100%)`,
                    transform: `rotateY(90deg) translateZ(${cubeWidth - cubeDepth / 2}px)`,
                    transformOrigin: 'left',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                  }}
                />

                {/* BOTTOM FACE (visible only for top layer) */}
                {index === 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      width: `${cubeWidth}px`,
                      height: `${cubeDepth}px`,
                      background: layer.darkColor,
                      transform: `rotateX(-90deg) translateZ(${layerHeight}px)`,
                      transformOrigin: 'top',
                    }}
                  />
                )}

                {/* Problem Label - appears when drawer is open */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '-130px',
                        transform: 'translateY(-50%) translateZ(80px)',
                        padding: '10px 16px',
                        background: '#C9A227',
                        color: '#1a1614',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                        zIndex: 100,
                      }}
                      initial={{ opacity: 0, x: -20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.9 }}
                      transition={{ delay: 0.15 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 9v4m0 4h.01M12 3L2 21h20L12 3z" />
                        </svg>
                        {layer.problemDetails[0]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Glow effect when active or open */}
                {(isActive || isOpen) && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: '-5px',
                      background: `radial-gradient(ellipse at center, ${layer.color}40, transparent 70%)`,
                      pointerEvents: 'none',
                      transformStyle: 'preserve-3d',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.div>
            )
          })}

          {/* Shadow under the cube */}
          <div
            style={{
              position: 'absolute',
              bottom: '-30px',
              left: '50%',
              width: `${cubeWidth + 40}px`,
              height: `${cubeDepth + 20}px`,
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)',
              transform: 'translateX(-50%) rotateX(90deg)',
              transformOrigin: 'top',
              pointerEvents: 'none',
            }}
          />
        </div>
      </motion.div>

      {/* Active Layer Info Panel */}
      <AnimatePresence>
        {activeLayer && !openDrawers.some(d => d.layerId === activeLayer && d.isOpen) && (
          <LayerInfoPanel
            layer={SOIL_LAYERS.find((l) => l.id === activeLayer)!}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Layer Info Panel Component
function LayerInfoPanel({ layer }: { layer: typeof SOIL_LAYERS[0] }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '16px 24px',
        background: 'rgba(26, 22, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(201, 162, 39, 0.25)',
        borderRadius: '12px',
        minWidth: '280px',
        zIndex: 30,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            background: layer.color,
            borderRadius: '6px',
          }}
        />
        <div>
          <h4 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: '1rem',
            fontWeight: 600,
            color: '#F5F0E8',
            margin: 0,
          }}>
            {layer.name}
          </h4>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: 'rgba(245, 240, 232, 0.5)',
          }}>
            {layer.depth.start}-{layer.depth.end} cm
          </span>
        </div>
      </div>

      <p style={{
        fontSize: '0.8rem',
        color: 'rgba(245, 240, 232, 0.7)',
        margin: 0,
      }}>
        Kattints a kihúzáshoz
      </p>
    </motion.div>
  )
}
