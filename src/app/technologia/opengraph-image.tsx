import { ogContentType, ogSize, renderOgImage } from '@/lib/og/renderOgImage'

export const alt = 'Frissen lazított, morzsalékos talaj – Technológia'
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    background: 'technologia',
    eyebrow: 'Technológia',
    title: 'Az ásógép működése',
    subtitle: 'Lazítás forgatás nélkül, a talaj természetes rétegződésének megőrzésével',
  })
}
