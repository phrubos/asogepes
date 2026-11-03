import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

/**
 * Social share card (1200×630) for a page: an AI-generated background
 * (fal.ai FLUX.2, `src/lib/og/bg/*.jpg`, illustration only — no research data)
 * with the page title set in Fraunces / Inter. The text is rendered here, not by
 * the image model, so Hungarian accents (ő, ű) are always correct.
 * The built-in next/og font is Latin-only, hence the bundled TTFs (OFL).
 */
export const ogSize = { width: 1200, height: 630 }
export const ogContentType = 'image/png'

const dir = join(process.cwd(), 'src/lib/og')

export type OgBackground = 'home' | 'problema' | 'technologia' | 'kutatas'

interface OgOptions {
  background: OgBackground
  eyebrow: string
  title: string
  subtitle: string
}

export async function renderOgImage({ background, eyebrow, title, subtitle }: OgOptions) {
  const [bg, fraunces, inter, interSemi] = await Promise.all([
    readFile(join(dir, 'bg', `${background}.jpg`)),
    readFile(join(dir, 'fonts', 'Fraunces-SemiBold.ttf')),
    readFile(join(dir, 'fonts', 'Inter-Regular.ttf')),
    readFile(join(dir, 'fonts', 'Inter-SemiBold.ttf')),
  ])
  const bgSrc = `data:image/jpeg;base64,${bg.toString('base64')}`

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#1A1612' }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={bgSrc} width={1200} height={630} style={{ position: 'absolute', inset: 0, objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(26,22,18,0.94) 0%, rgba(26,22,18,0.84) 50%, rgba(26,22,18,0.3) 78%, rgba(26,22,18,0.05) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 72px',
            width: 760,
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#D4A84B',
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Fraunces',
              fontSize: 68,
              lineHeight: 1.08,
              color: '#F5F0E8',
              marginBottom: 24,
            }}
          >
            {title}
          </div>
          <div style={{ display: 'flex', fontFamily: 'Inter', fontSize: 27, lineHeight: 1.4, color: '#E8E0D4' }}>
            {subtitle}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 40,
              fontFamily: 'Inter',
              fontSize: 20,
              color: '#E8C87A',
            }}
          >
            <div style={{ width: 48, height: 3, background: '#D4A84B', marginRight: 16 }} />
            Neumann János Egyetem × Agroskill Kft.
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 600, style: 'normal' },
        { name: 'Inter', data: inter, weight: 400, style: 'normal' },
        { name: 'Inter', data: interSemi, weight: 600, style: 'normal' },
      ],
    },
  )
}
