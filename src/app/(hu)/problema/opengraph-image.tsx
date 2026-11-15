import { pageOg } from '@/lib/og/pageOg'

const og = pageOg('problem', 'hu')
export const alt = og.alt
export const size = og.size
export const contentType = og.contentType

export default function Image() {
  return og.render()
}
