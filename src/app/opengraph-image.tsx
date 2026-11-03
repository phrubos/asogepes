import { ogContentType, ogSize, renderOgImage } from '@/lib/og/renderOgImage'

export const alt = 'Ásógépes talajművelés – tudományos kutatás'
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    background: 'home',
    eyebrow: 'Tudományos kutatás 2025 óta',
    title: 'Ásógépes talajművelés',
    subtitle: 'Lazítás forgatás nélkül, öntözött kertészeti kultúrákban',
  })
}
