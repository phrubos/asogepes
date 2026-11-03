import { ogContentType, ogSize, renderOgImage } from '@/lib/og/renderOgImage'

export const alt = 'Repedezett, tömörödött talaj – A probléma'
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    background: 'problema',
    eyebrow: 'A probléma',
    title: 'Talajtömörödés és eketalp',
    subtitle: 'Miért nem elég a hagyományos szántás és a kultivátoros művelés?',
  })
}
