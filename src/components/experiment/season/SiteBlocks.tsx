'use client'

import { Fragment, type CSSProperties, type ReactElement } from 'react'
import { FixedSeason, useYearFilter, type SiteId } from './YearFilter'
import styles from './SiteBlocks.module.css'

export interface SiteBlock {
  id: string
  component: ReactElement
  /** the seasons this block has */
  years: number[]
  /** one block for all chosen years (Helyszín adatok, Talajélet 2025–2026), at the latest chosen year */
  once?: boolean
  /** the block's height on phones, the placeholder size while it is not rendered yet */
  phoneHeight?: number
}

/**
 * The blocks of one site, narrowed to the years chosen for it (ticket 015): a block without a chosen
 * year is left out; a season block with both years chosen is shown once per year, under a year divider.
 */
export default function SiteBlocks({ site, blocks, sectionClass }: { site: SiteId; blocks: SiteBlock[]; sectionClass: string }) {
  const { selected } = useYearFilter()
  const chosen = selected[site]
  return (
    <>
      {blocks.map((b) => {
        const ys = b.years.filter((y) => chosen.includes(y))
        if (!ys.length) return null
        const style = b.phoneHeight ? ({ '--phone-h': `${b.phoneHeight}px` } as CSSProperties) : undefined
        const each = b.once ? [ys[ys.length - 1]] : ys
        return (
          <div key={b.id} id={b.id} className={sectionClass} style={style}>
            {each.map((y) => (
              <Fragment key={y}>
                {each.length > 1 && (
                  <div className={styles.divider} role="separator" aria-label={`${y}`}>
                    <span className={styles.year}>{y}</span>
                  </div>
                )}
                <FixedSeason site={site} year={y} divided={each.length > 1}>
                  {b.component}
                </FixedSeason>
              </Fragment>
            ))}
          </div>
        )
      })}
    </>
  )
}
