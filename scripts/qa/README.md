# QA-szkriptek (Playwright, Chromium)

Mindegyik production buildön fut:

```bash
bash scripts/qa/stop-server.sh 3100     # a régi QA-szerver leállítása (különben régi build-ID-vel válaszol)
NEXT_DIST_DIR=.next-qa npm run build && NEXT_DIST_DIR=.next-qa npx next start -p 3100
```

A QA-build a `.next-qa` mappába kerül és a 3100-as porton fut, így nem ütközik egy futó `npm run dev`-vel (az a `.next`-et használja, 3000-es port).

| Szkript | Mit ellenőriz | Kilépési kód |
|---|---|---|
| `node scripts/qa/clip-check.js [url] [--sizes=390x844,...] [--pages=/,/kutatas] [--show=8]` | Levágott szöveg: viewporton kívül vagy egy `overflow: hidden/clip` ős részben levágja (görgethető ős és teljesen elrejtett tartalom kivétel). Alapméretek: 360, 390, 1440×900, 1536×864, 1366×768. | 1, ha van levágott elem |
| `node scripts/qa/type-check.js [url]` | Folyószöveg medián ≥ 15 px, minden HTML-szöveg ≥ 12 px (SVG kivétel) | 1 hibánál |
| `node scripts/qa/hero-check.js [url]` | A főoldal címe látható: blokkolt videóval ≤ 3 s, lassított 4G mobilon ≤ 4 s (0 `.mp4` kérés), lassított asztalin ≤ 3 s | 1 hibánál |
| `node scripts/qa/nav-check.js [url]` | SSR: minden oldal HTML-jében van `<h1>`, nincs Suspense-sablon mögött; nincs teljes képernyős réteg; menü → új oldal ≤ 1 s; `?section=` deep link | 1 hibánál |
| `node scripts/qa/perf.js [url]` | FCP / LCP / CLS / TBT / bájtok, mobil (lassított 4G, 4× CPU) és asztali | csak riport |
| `node scripts/qa/shots.js <outDir> [url]` | Viewport-lépésenkénti képernyőképek + konzolhibák | csak riport |

Git Bash alatt a `--pages=/…` argumentumot az MSYS útvonallá alakítja: `MSYS_NO_PATHCONV=1 node scripts/qa/clip-check.js … --pages=/kutatas`. A `--show=N` oldalanként N levágott elemet ír ki (alapérték 8).
