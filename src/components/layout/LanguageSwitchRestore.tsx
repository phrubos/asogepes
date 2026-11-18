'use client'

import { useEffect } from 'react'
import { restorePosition } from '@/lib/i18n/switchPosition'

/** After a HU / EN switch: lands on the same reading position, without a trip to the top (see switchPosition.ts) */
export default function LanguageSwitchRestore() {
  useEffect(() => {
    restorePosition()
  }, [])
  return null
}
