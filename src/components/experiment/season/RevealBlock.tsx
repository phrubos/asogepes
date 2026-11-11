'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * A /kutatas block with the page's one entrance (ticket 017): it fades in and rises 24 px, once, when
 * its top comes into the lower part of the screen. Charts inside keep their own drawing.
 * Not an IntersectionObserver: inside the content-visibility sections it stays silent after a jump
 * (?section= links, the menu), and the block would stay invisible. A rect check on scroll does not.
 * Everything already above the screen counts as seen. Off under reduced motion; on phones the
 * `mobile-static` class keeps it still.
 */
export default function RevealBlock({
  id,
  className,
  style,
  innerRef,
  children,
  ...data
}: {
  id: string
  className: string
  style?: CSSProperties
  innerRef?: Ref<HTMLDivElement>
  children: ReactNode
  [dataAttr: `data-${string}`]: string | boolean | undefined
}) {
  const reduced = useReducedMotion()
  const own = useRef<HTMLDivElement | null>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (seen) return
    let raf = 0
    const check = () => {
      raf = 0
      const el = own.current
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.88) setSeen(true)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [seen])

  const setRef = (el: HTMLDivElement | null) => {
    own.current = el
    if (typeof innerRef === 'function') innerRef(el)
    else if (innerRef) (innerRef as { current: HTMLDivElement | null }).current = el
  }

  return (
    <motion.div
      ref={setRef}
      id={id}
      className={`${className} mobile-static`}
      style={style}
      {...data}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={seen || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
