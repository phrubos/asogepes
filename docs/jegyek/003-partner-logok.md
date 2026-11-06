# 003 · Partnerlogók és brand-skill

**Státusz:** kész · **Létrehozva:** 2026-11-06 · **Méret:** S

## Cél

A két partner a saját logójával jelenjen meg, ne csak szövegként. Ezzel az oldal a megrendelő (Agroskill) brandjét is hordozza, de a saját földszínes arculata marad. Egy projekt-skill rögzítse a palettát, a betűtípusokat, a logóhasználatot és a hangnemet az oldalon kívüli anyagokhoz (kisfilm, megosztási kép, prezentáció).

## Hatókör

- Főoldali lábléc (`layout/Footer`), a tartalmi oldalak vége (`shared/PageEnd`), a megosztási képek (`lib/og/renderOgImage.tsx`).
- Asztali és mobil nézet.
- Új: `src/lib/partners.ts`, `public/images/partners/`, `.agents/skills/asogepes-brand` (tükör: `.claude/skills/`).

## Nem nyúlunk hozzá

- A paletta (`globals.css`) és a betűtípusok. Az Agroskill színei (navy `#0F344F`, sárga `#FFD90A`) és betűi (Jura, Jockey One) nem kerülnek át az oldalra.
- A főoldali hero „Neumann János Egyetem × Agroskill Kft.” badge-e szöveg marad: a videó fölött a logó túl zajos lenne.

## Döntések

- 2026-11-06: A brandből csak a logó jön át, a színek nem (a felhasználó jóváhagyta: „oké csináld”).
- NJE: a kvk.nje.hu saját SVG-je, a sötét szöveg a site fehérjére (`#FDFCFA`) cserélve. Agroskill: az agroskill.hu fejléclogója, a szélekre vágva, 551×120 PNG.
- 2026-11-06: Világos alapon az Agroskill hivatalos világos logója (`agroskill-light.png`: sötétkék AGRO és fogaskerék, sárga SKILL), doboz nélkül; a sötét lapos megoldást a felhasználó elvetette.
- Optikai egyensúly: az NJE kétsoros felirata miatt kb. 1,3× magasabb (oldalvég 40/30 px, lábléc 52/40, mobil 44/34, OG 50/40).

## Nyitott kérdések

- [ ] Kérjünk az Agroskilltől vektoros (SVG) logót, a sötét és a világos változatot is, és egy szóbeli jóváhagyást a használatra. Az NJE-logó használatát is érdemes az egyetemmel jóváhagyatni.

## Kész, ha

- [x] Lábléc és oldalvég: két logó, linkkel, alt szöveggel, 44 px-es koppintási céllal
- [x] OG-kép: a két logó a szöveges partnersor helyén
- [x] `npx tsc --noEmit` hibamentes (src), eslint tiszta a módosított fájlokon
- [x] `layout-check.js` és `mobile-check.js` zöld a dev szerveren
- [x] Szemmel: képernyőkép 390 és 1440 px-en

## Eredmény

Logók: oldalvég 1440 px-en NJE 231×40, Agroskill 138×30, mindkettő betöltve. 390 px-en mindkettő 20 px-en kezdődik. `layout-check` passed; `mobile-check` 0 rés, 0 átfedés, 0 kis koppintási cél (390 és 360 px, 4 oldal).
