import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Detailed drawing of the app/icon.svg spade, full-bleed (iOS rounds the corners itself)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8C87A"/><stop offset="1" stop-color="#C99A3A"/></linearGradient></defs>
  <rect width="64" height="64" fill="url(#g)"/>
  <path d="M0 48 Q16 45.5 32 47 T64 46 V64 H0 Z" fill="#B98A2E"/>
  <path d="M0 56 Q18 54 34 55.5 T64 55 V64 H0 Z" fill="#9C7024"/>
  <circle cx="50" cy="42.5" r="1.6" fill="#9C7024"/><circle cx="55" cy="39.5" r="1.1" fill="#9C7024"/>
  <g transform="rotate(28 32 34)">
    <path fill-rule="evenodd" fill="#1A1612" d="M27 4H37A5 5 0 0 1 37 14H27A5 5 0 0 1 27 4Z M28 7.3H36A1.7 1.7 0 0 1 36 10.7H28A1.7 1.7 0 0 1 28 7.3Z"/>
    <rect x="30" y="13" width="4" height="18.5" fill="#1A1612"/>
    <path d="M29 30 H35 L36.5 35 H27.5 Z" fill="#1A1612"/>
    <rect x="19" y="34" width="26" height="3.6" rx="1.8" fill="#1A1612"/>
    <path d="M20.5 37 H43.5 V49 Q43.5 55.5 32 62 Q20.5 55.5 20.5 49 Z" fill="#1A1612"/>
    <path d="M32 37 H43.5 V49 Q43.5 55.5 32 62 Z" fill="#3D3229"/>
    <path d="M23.2 39.5 V49 Q23.2 53.6 29.5 57.6" fill="none" stroke="#F5F0E8" stroke-opacity=".4" stroke-width="1.2" stroke-linecap="round"/>
  </g>
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
