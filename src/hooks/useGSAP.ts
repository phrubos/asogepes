'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Check if device prefers reduced motion
export function usePrefersReducedMotion() {
  const prefersReducedMotion = useRef(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mediaQuery.matches
    
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  return prefersReducedMotion
}

// Check if mobile device
export function useIsMobile() {
  const isMobile = useRef(false)
  
  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = window.innerWidth < 768
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

// ScrollTrigger hook with cleanup
interface ScrollTriggerConfig {
  trigger: string | Element
  start?: string
  end?: string
  scrub?: boolean | number
  pin?: boolean | string
  markers?: boolean
  onEnter?: () => void
  onLeave?: () => void
  onEnterBack?: () => void
  onLeaveBack?: () => void
  toggleActions?: string
}

export function useScrollTrigger(
  animationCallback: (tl: gsap.core.Timeline, trigger: Element) => void,
  config: ScrollTriggerConfig,
  deps: any[] = []
) {
  const triggerRef = useRef<ScrollTrigger | null>(null)
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = typeof config.trigger === 'string' 
        ? document.querySelector(config.trigger) 
        : config.trigger
        
      if (!trigger) return
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: config.start || 'top center',
          end: config.end || 'bottom center',
          scrub: config.scrub ?? false,
          pin: config.pin ?? false,
          markers: config.markers ?? false,
          onEnter: config.onEnter,
          onLeave: config.onLeave,
          onEnterBack: config.onEnterBack,
          onLeaveBack: config.onLeaveBack,
          toggleActions: config.toggleActions || 'play none none reverse',
        }
      })
      
      animationCallback(tl, trigger)
    })
    
    return () => ctx.revert()
  }, deps)
  
  return triggerRef
}

// Parallax hook
interface ParallaxConfig {
  speed?: number
  direction?: 'vertical' | 'horizontal'
  scrub?: boolean | number
}

export function useParallax(
  elementRef: React.RefObject<HTMLElement>,
  config: ParallaxConfig = {}
) {
  const { speed = 0.5, direction = 'vertical', scrub = true } = config
  
  useEffect(() => {
    if (!elementRef.current) return
    
    const ctx = gsap.context(() => {
      const movement = direction === 'vertical' 
        ? { y: `${speed * 100}%` }
        : { x: `${speed * 100}%` }
      
      gsap.to(elementRef.current, {
        ...movement,
        ease: 'none',
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub,
        }
      })
    })
    
    return () => ctx.revert()
  }, [speed, direction, scrub])
}

// Text split animation (free alternative to SplitText)
export function useSplitTextAnimation(
  elementRef: React.RefObject<HTMLElement>,
  config: {
    type?: 'chars' | 'words' | 'lines'
    stagger?: number
    duration?: number
    delay?: number
    ease?: string
    scrollTrigger?: boolean
  } = {}
) {
  const {
    type = 'chars',
    stagger = 0.03,
    duration = 0.6,
    delay = 0,
    ease = 'power3.out',
    scrollTrigger = true
  } = config
  
  useEffect(() => {
    if (!elementRef.current) return
    
    const element = elementRef.current
    const originalText = element.textContent || ''
    
    // Split text into spans
    let items: string[] = []
    if (type === 'chars') {
      items = originalText.split('')
    } else if (type === 'words') {
      items = originalText.split(' ')
    } else {
      items = originalText.split('\n')
    }
    
    // Create wrapper spans
    element.innerHTML = items.map((item, i) => {
      const content = type === 'words' && i < items.length - 1 ? item + ' ' : item
      return `<span class="split-item" style="display:inline-block;opacity:0;transform:translateY(20px)">${content === ' ' ? '&nbsp;' : content}</span>`
    }).join('')
    
    const splitItems = element.querySelectorAll('.split-item')
    
    const ctx = gsap.context(() => {
      const animation = {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        delay,
        ease,
      }
      
      if (scrollTrigger) {
        gsap.to(splitItems, {
          ...animation,
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        })
      } else {
        gsap.to(splitItems, animation)
      }
    })
    
    return () => {
      ctx.revert()
      element.textContent = originalText
    }
  }, [type, stagger, duration, delay, ease, scrollTrigger])
}

// Horizontal scroll section hook
export function useHorizontalScroll(
  containerRef: React.RefObject<HTMLElement>,
  config: {
    ease?: string
    snap?: boolean | number | number[]
    pinSpacing?: boolean
  } = {}
) {
  const { ease = 'none', snap = false, pinSpacing = true } = config
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const container = containerRef.current
    const scrollWidth = container.scrollWidth - container.clientWidth
    
    const ctx = gsap.context(() => {
      const scrollTriggerConfig: ScrollTrigger.Vars = {
        trigger: container,
        start: 'top top',
        end: `+=${scrollWidth}`,
        pin: true,
        scrub: 1,
        pinSpacing,
        anticipatePin: 1,
      }
      
      if (snap) {
        scrollTriggerConfig.snap = {
          snapTo: typeof snap === 'number' ? 1 / snap : snap as number[],
          duration: 0.3,
          ease: 'power2.inOut'
        }
      }
      
      gsap.to(container, {
        x: -scrollWidth,
        ease,
        scrollTrigger: scrollTriggerConfig
      })
    })
    
    return () => ctx.revert()
  }, [ease, snap, pinSpacing])
}

// Image reveal animation
export function useImageReveal(
  elementRef: React.RefObject<HTMLElement>,
  config: {
    direction?: 'left' | 'right' | 'top' | 'bottom'
    duration?: number
    ease?: string
  } = {}
) {
  const { direction = 'bottom', duration = 1.2, ease = 'power3.inOut' } = config
  
  useEffect(() => {
    if (!elementRef.current) return
    
    const element = elementRef.current
    
    // Set initial clip-path based on direction
    const clipPaths: Record<string, { from: string; to: string }> = {
      left: { from: 'inset(0 100% 0 0)', to: 'inset(0 0% 0 0)' },
      right: { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0%)' },
      top: { from: 'inset(100% 0 0 0)', to: 'inset(0% 0 0 0)' },
      bottom: { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0% 0)' },
    }
    
    const ctx = gsap.context(() => {
      gsap.fromTo(element,
        { clipPath: clipPaths[direction].from },
        {
          clipPath: clipPaths[direction].to,
          duration,
          ease,
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      )
    })
    
    return () => ctx.revert()
  }, [direction, duration, ease])
}

// Counter animation
export function useCounterAnimation(
  elementRef: React.RefObject<HTMLElement>,
  endValue: number,
  config: {
    duration?: number
    delay?: number
    ease?: string
    prefix?: string
    suffix?: string
    decimals?: number
  } = {}
) {
  const {
    duration = 2,
    delay = 0,
    ease = 'power2.out',
    prefix = '',
    suffix = '',
    decimals = 0
  } = config
  
  useEffect(() => {
    if (!elementRef.current) return
    
    const element = elementRef.current
    const counter = { value: 0 }
    
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        value: endValue,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          element.textContent = `${prefix}${counter.value.toFixed(decimals)}${suffix}`
        }
      })
    })
    
    return () => ctx.revert()
  }, [endValue, duration, delay, ease, prefix, suffix, decimals])
}

export { gsap, ScrollTrigger }
