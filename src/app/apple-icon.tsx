import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Same mark as app/icon.svg, full-bleed (iOS rounds the corners itself)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="0" fill="#1A1612"/>
  <path transform="translate(13.23 53) scale(0.02571 -0.02571)" d="M348 569H939L944 465H341ZM465 46Q465 25 450.5 12.5Q436 0 404 0H90Q59 0 44.0 12.5Q29 25 29 46Q29 61 37.5 71.5Q46 82 68 93L101 106Q131 121 147.5 145.0Q164 169 183 230L503 1208Q516 1252 510.0 1271.5Q504 1291 469 1303Q441 1312 430.0 1324.5Q419 1337 419 1355Q419 1376 434.0 1388.0Q449 1400 481 1400H969Q1001 1400 1016.0 1388.0Q1031 1376 1031 1355Q1031 1336 1019.5 1324.0Q1008 1312 983 1304Q956 1296 951.0 1281.0Q946 1266 957 1232L1297 207Q1313 157 1331.0 133.5Q1349 110 1382 100Q1411 89 1421.0 77.0Q1431 65 1431 46Q1431 25 1416.0 12.5Q1401 0 1369 0H928Q897 0 882.0 12.5Q867 25 867 46Q867 64 877.5 75.0Q888 86 910 93L967 105Q993 113 992.0 131.0Q991 149 979 188L625 1280L658 1300L315 246Q302 205 302.0 178.5Q302 152 318.5 135.5Q335 119 369 105L423 92Q443 84 454.0 74.0Q465 64 465 46Z" fill="#F5F0E8"/>
  <path d="M31.5 15 L41.5 4.5 Q44.5 2 47 4.5 Q48.5 6.5 46 8.5 L33.5 16 Z" fill="#D4A84B"/>
</svg>`

export default function AppleIcon() {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`}
        width={180}
        height={180}
        alt=""
      />
    ),
    size,
  )
}
