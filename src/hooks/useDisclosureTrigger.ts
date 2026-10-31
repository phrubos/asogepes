'use client'

import { useRef } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

interface DisclosureTriggerOptions {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

/**
 * Props for an element that opens on mouse hover, and toggles on tap, click-by-touch, Enter or Space.
 * Hover only reacts to a real mouse, so a tap on a touch laptop never opens (hover) and closes (click) at once.
 */
export function useDisclosureTrigger({ isOpen, onOpen, onClose }: DisclosureTriggerOptions) {
  const lastPointer = useRef<string>('')
  const toggle = () => (isOpen ? onClose() : onOpen())

  return {
    hover: {
      onPointerEnter: (e: PointerEvent) => { if (e.pointerType === 'mouse') onOpen() },
      onPointerLeave: (e: PointerEvent) => { if (e.pointerType === 'mouse') onClose() },
    },
    trigger: {
      role: 'button' as const,
      tabIndex: 0,
      'aria-expanded': isOpen,
      onPointerDown: (e: PointerEvent) => { lastPointer.current = e.pointerType },
      onClick: () => {
        // a mouse already opened it by hovering
        if (lastPointer.current === 'mouse') return
        toggle()
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggle()
        } else if (e.key === 'Escape' && isOpen) {
          onClose()
        }
      },
    },
  }
}
