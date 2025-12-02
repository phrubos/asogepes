'use client'

import { AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/ui/PageTransition'
import PageNavigation from '@/components/ui/PageNavigation'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <PageTransition>
        {children}
        <PageNavigation />
      </PageTransition>
    </AnimatePresence>
  )
}
