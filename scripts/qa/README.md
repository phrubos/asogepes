# QA-szkriptek (Playwright, Chromium)

Mindegyik production buildön fut:

```bash
bash scripts/qa/stop-server.sh          # a régi szerver leállítása (különben régi build-ID-vel válaszol)
npm run build && npx next start -p 3000 # külön terminálban / háttérben
```

| Szkript | Mit ellenőriz | Kilépési kód |
|---|---|---|
| `node scripts/qa/clip-check.js [url] [--sizes=390x844,...] [--pages=/,/kutatas]` | Levágott szöveg: viewporton kívül vagy egy `overflow: hidden/clip` ős részben levágja (görgethető ős és teljesen elrejtett tartalom kivétel). Alapméretek: 360, 390, 1440×900, 1536×864, 1366×768. | 1, ha van levágott elem |
| `node scripts/qa/type-check.js [url]` | Folyószöveg medián ≥ 15 px, minden HTML-szöveg ≥ 12 px (SVG kivétel) | 1 hibánál |
| `node scripts/qa/hero-check.js [url]` | A főoldal címe látható: blokkolt videóval ≤ 3 s, lassított 4G mobilon ≤ 4 s (0 `.mp4` kérés), lassított asztalin ≤ 3 s | 1 hibánál |
| `node scripts/qa/perf.js [url]` | FCP / LCP / CLS / TBT / bájtok, mobil (lassított 4G, 4× CPU) és asztali | csak riport |
| `node scripts/qa/shots.js <outDir> [url]` | Viewport-lépésenkénti képernyőképek + konzolhibák | csak riport |
