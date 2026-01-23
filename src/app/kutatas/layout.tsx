'use client'

import { useEffect } from 'react'

export default function KutatasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Hide footer on this page since we're using fullscreen book layout
  useEffect(() => {
    const footer = document.querySelector('footer')
    const pageNav = document.querySelector('[data-page-navigation]')
    const scrollProgress = document.querySelector('[data-scroll-progress]')

    if (footer) footer.style.display = 'none'
    if (pageNav) (pageNav as HTMLElement).style.display = 'none'
    if (scrollProgress) (scrollProgress as HTMLElement).style.display = 'none'

    return () => {
      if (footer) footer.style.display = ''
      if (pageNav) (pageNav as HTMLElement).style.display = ''
      if (scrollProgress) (scrollProgress as HTMLElement).style.display = ''
    }
  }, [])

  return <>{children}</>
}
