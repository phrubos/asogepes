import { ogContentType, ogSize, renderOgImage } from '@/lib/og/renderOgImage'

export const alt = 'Kertészeti kísérleti parcellák – Kutatás'
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    background: 'kutatas',
    eyebrow: 'Kutatás',
    title: 'Szentkirály, Kecskemét, Lakitelek',
    subtitle: '3 helyszín · 7 kezelés · 6 hónap terepi mérés',
  })
}
