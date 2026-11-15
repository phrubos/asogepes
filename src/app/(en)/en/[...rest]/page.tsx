import { notFound } from 'next/navigation'

// Any unknown /en/… address: the English 404 (en/not-found.tsx, under the English root layout, lang="en")
export default function EnglishCatchAll() {
  notFound()
}
