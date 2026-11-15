import { bilingual } from '@/lib/i18n/config'

/** Interface text of the shared scroll layout (rail, section bar, contents sheet, next-section button) – ticket 025 */
export const SCROLL_TEXT = bilingual(
  {
    years: 'évek',
    onlyYear: (y: number) => `Csak ${y}-ben mértünk`,
    oneYearStays: 'Legalább egy év mindig látszik',
    contents: 'Tartalom',
    contentsNow: 'Tartalom — most:',
    close: 'Bezárás',
    scrollTo: 'Görgess ehhez:',
    scrollDown: 'Görgess lejjebb',
    next: 'Tovább',
  },
  {
    years: 'years',
    onlyYear: (y: number) => `Measured in ${y} only`,
    oneYearStays: 'At least one year always stays visible',
    contents: 'Contents',
    contentsNow: 'Contents — now:',
    close: 'Close',
    scrollTo: 'Scroll to:',
    scrollDown: 'Scroll down',
    next: 'Next',
  },
)
