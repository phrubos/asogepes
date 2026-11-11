---
name: asogepes-brand
description: The look and voice of the Ásógépes Talajművelés research site (Neumann János Egyetem × Agroskill Kft.) for anything made outside the page code — share/OG images, kisfilm/cinematic videos, posters, slides or PDF summaries for the client, social posts — and for new UI that needs colours, fonts, partner logos or Hungarian copy. Use whenever an output must look and sound like this site or carry the partners' logos.
---

# Ásógépes brand

One research site, two partners. The site has its own earth-tone identity; the partners appear only through their own logos. Never repaint the site in a partner's colours.

## Colours (source of truth: `src/app/globals.css`)

| Role | Token | Hex |
|---|---|---|
| Dark background | `--color-earth-900` / `--bg-book-dark` | `#1A1612` / `#1F1A16` |
| Light background | `--color-cream` | `#F5F0E8` |
| Text on dark | `--color-white` / `--color-cream-dark` | `#FDFCFA` / `#E8E0D4` |
| Text on light | `--color-earth-900` / `--color-earth-600` | `#1A1612` / `#4A3F33` |
| Accent (kickers, lines, highlights) | `--color-gold` / `--color-gold-light` | `#D4A84B` / `#E8C87A` |
| Plants, "good" result | `--color-green` / `--color-green-light` | `#4A6741` / `#6B8B5E` |
| Warning, compaction, "bad" result | `--color-accent` | `#C45C3E` |
| Soil | `--color-soil` | `#3D2914` |

- No blue or indigo anywhere, charts included. Gold is the only accent; use it sparingly (a kicker, a 3px line, one highlighted number).
- Dark scenes are the default for films and share images; cream for print and documents.

## Type

- Display: **Fraunces** (semibold, tight leading ~1.08) for titles and big numbers.
- Body: **Inter** (regular / semibold). Small caps-style kickers: Inter semibold, uppercase, letter-spacing ~0.12em, gold.
- On the web the fonts come from `next/font` (`--font-fraunces`, `--font-inter`). Outside the browser (next/og, video renders) use the bundled TTFs in `src/lib/og/fonts/` — they cover ő/ű.
- Nothing below 12px on screen; body at least 15px.

## Partner logos (`src/lib/partners.ts`, files in `public/images/partners/`)

- `nje-kvk.svg` — Neumann János Egyetem, Kertészeti és Vidékfejlesztési Kar. Light version (orange `#F59B3F` + white) for dark backgrounds. For a light background use `nje-kvk-dark.svg` (the original, dark text `#222527`).
- `agroskill.png` — Agroskill Kft. White "AGRO" + yellow "SKILL", navy/yellow mark in a white gear. Dark backgrounds only.
- `agroskill-light.png` — Agroskill's own light version (navy `#0F344F` "AGRO" and gear, yellow "SKILL"), as on agroskill.hu. Use it on cream and white, straight on the surface: no dark chip or box behind it (user decision, 2026-11-06).
- Order: NJE first, then Agroskill, separated by a thin gold line. The NJE mark has two text lines, so set it ~1.3× the Agroskill height (40px / 30px on page ends, 50 / 40 on 1200×630 images).
- Don't recolour, crop, outline or animate the logos. Alt text: "Neumann János Egyetem – Kertészeti és Vidékfejlesztési Kar", "Agroskill Kft. – Szentkirály".
- Agroskill's own palette (navy `#0F344F`, yellow `#FFD90A`) and fonts (Jura, Jockey One) stay inside their logo. Don't use them for the site, charts or text.
- In text: "Neumann János Egyetem × Agroskill Kft." (with ×, as in the hero badge and the share images).

## Voice (Hungarian)

- Calm, scientific, concrete: a measured number beats an adjective. "A talaj nem …" style short claims, then the evidence.
- The research runs **2025 onwards** ("2025 óta"), not just 2025.
- Numbers come from `src/lib/data.ts` and the location pages (`experiment/pages/*`); never invent or round them differently. AI-generated images and footage are illustration only and never stand in for measured results.
- Address on the site: informal "te" in UI copy and calls to action ("Fedezd fel", "Válassz témát", "Ismerd meg"), never "Ön" (user decision, 2026-11-11); no sales pitch. Agroskill's own warm "Ön" tone and their Funkciógarancia belong to their channels, not to the research pages; quote them only in a clearly marked contact or partner block.
- Correct accents always (ő, ű, á); technical words as on the site: ásógép, talajtömörödés, eketalp, penetrométer, lazítás forgatás nélkül.

## Site icon

- `src/app/icon.svg` (favicon) and `src/app/apple-icon.tsx` (180px): the Fraunces "A" in cream `#F5F0E8` on an earth-900 tile, the acute accent drawn as a gold `#D4A84B` blade, so it reads "Á". The letter is the outlined glyph (no font needed). Reuse this mark for small avatars; don't redraw it (user choice, 2026-11-07).

## Imagery

- Real field photos from `public/images/kutatás_pics` first. Warm, low sun, soil texture visible; no stock-like people shots.
- Machine names exactly: Imants 38SX, 38WX, 40SX.

## Checklist before handing something over

1. Only palette colours above (no blue), gold used once or twice.
2. Fraunces titles, Inter text, accents render correctly.
3. Both partner logos present where the partners are named, correct order and variant for the background.
4. Every number traceable to `data.ts` or a location page.
5. Production link, if any: https://neumann-agroskill.vercel.app
