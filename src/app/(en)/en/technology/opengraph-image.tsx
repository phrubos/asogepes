import { pageOg } from '@/lib/og/pageOg'

const og = pageOg('technology', 'en')
export const alt = og.alt
export const size = og.size
export const contentType = og.contentType

export default function Image() {
  return og.render()
}
