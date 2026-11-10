# 014 · Lakitelek rozs: hét parcella májusban (Fotók blokk, 2026)

**Státusz:** kész · **Létrehozva:** 2026-11-10 · **Méret:** M

## Cél

A Lakitelek › Fotók blokk 2026-os nézetében a látogató egymás mellett látja a hét parcella rozsát májusban, egy léptékben: fölül a hajtás, alul a gyökércsomó, köztük a talajszint, alattuk a mért hossz. Egy parcellát kiválasztva rövid, szakmailag pontos jellemzést kap. Az eredeti összképen a mért értékek is rajta vannak.

## Hatókör

- Új `experiment/pages/LakitelekRyeBoard.tsx` + `.module.css`; a `LakitelekPhotosPage` 2026-ban ezt mutatja (2025-ben marad a fotónézegető), a fejlécben `SeasonLabel`.
- Adatok és szövegek: `lib/seasons.ts` → `lakitelekRye2026` (a mért hossz a `lakitelekSoil2026.rye`, a laza réteg a fő grafikon májusi értéke).
- Asztali nézet: 7 csempe + jobb oldali tengely (↑ hajtás / TALAJSZINT / ↓ gyökér), szűrő (Mind / Ásógéppel / Ásógép nélkül), részletkártya, összkép-bélyeg → párbeszédablak a jelölt összképpel.
- Telefon és tablet (≤1024 px): a csempesor oldalra görgethető (112 px-es csempék), a tengely helyett jelmagyarázat; az összkép legalább 1040 px széles, oldalra görgethető (a feliratok ≥ 12 px).
- `FurtherMeasuresPage.tsx`: a Lakitelek léptetőből kikerül a „Hajtás és gyökér” lépés (4 → 3), a cím „További mérések: a talaj a rozs alatt”.
- Fotók: `public/images/kutatás_pics/Lakitelek/rozs/` (WebP, EXIF nélkül): `parcella-1…7.webp` (480×1000, a zsák szélességére méretezve, a gyökérnyak a 70,5 %-on), `mind-a-het.webp` (1600×627).
- Forrás: Drive „Képek-Univ-Lakitelek”, `20260519_122008` (összkép), `122113–122151` (parcellánként). Terv: https://claude.ai/artifact/88zU8yM1oMDuoPwkMqdzCe (B változat).

## Nem nyúlunk hozzá

- A 2025-ös fotók, a fő grafikon, a többi helyszín.

## Döntések

- 2026-11-10 (felhasználó): a B változat (tabló a Fotók helyén); a talajszint felirata a jobb oldali tengelyen, sötét alapon.
- 2026-11-10 (felhasználó): szűrésnél csak az aktív parcellák választhatók; ha a kijelölt kiesik, az első aktívra ugrik.
- 2026-11-10 (felhasználó): az összképre rákerülnek a jelölések és a mért értékek; külön összkép-sáv nincs, csak a bélyegből nyíló ablak.
- 2026-11-10 (felhasználó): a dátum csak „május”, a napot nem írjuk ki.
- 2026-11-10 (felhasználó): a kijelölt csempe egérrel fölötte is teli arany keretet kap.
- 2026-11-10 (felhasználó): minden csempén nagyító gomb (az oldal szokásos sarokgombja: Expand ikon, lekerekített sötét négyzet); kattintásra a csempesor helyén nagy nézet, a vászon A változata: balra a fotó, jobbra a talajszint kettéosztja a szöveget (föld felett: hajtás + a bokor; föld alatt: gyökér, laza réteg + a gyökércsomó). Lapozás az aktív parcellák között, „Mind a hét” gombbal vissza.
- Őszinte szöveg: a III. „karcsúbb, ritkább bokor”, mellette a laza réteg májusi és júliusi értéke. A fotó ferde szögű, ezért a mért szám a mérvadó; egy mintacsomó parcellánként, a sűrűség szemrevételezés.

## Nyitott kérdések

- [ ] Kutatóknak: azonos sorhosszról / tőszámmal ásták ki a csomókat? Ha nem, kikerül a „kevesebb szár” (III.) és a „legdúsabb bokor” (VI.).

## Kész, ha

- [x] 1440 px: a blokk a Lakitelek › Fotók helyén van (ÉV 2026); a talajszint-vonal a gyökérnyakaknál fut és a TALAJSZINT címkén megy át; a kijelölt csempe arany keretes (hover alatt is).
- [x] Szűrő: „Ásógép nélkül” → csak IV. és V. kattintható, a kijelölés IV.-re ugrik; „Ásógéppel” → I.-re.
- [x] Összkép: a bélyegből nyílik, a jelölések a helyükön, Esc zárja, a fókusz visszatér.
- [x] 390 px: nincs vízszintes oldalgörgetés, a csempesor magában görgethető; `layout-check.js`, `mobile-check.js` zöld.
- [x] A „További mérések › Lakitelek” léptető 3 lépéses (nincs Hajtás és gyökér).
- [x] Nincs 12 px alatti szöveg (`type-check.js`); `npx tsc --noEmit` hibamentes (a `.next-qa` elavult típusai nem számítanak); lint 0 hiba.
- [x] Szemmel: képernyőkép 390 és 1440 px-en.

## Eredmény

- A checker (2026-11-10) minden pontot rendben talált 1440 px-en:
  - a talajvonal és a TALAJSZINT címke közepe között 0,6 px az eltérés, a nagy nézet két vonala között 0 px;
  - a szűrő a IV.-re, majd az I.-re ugrik;
  - a nagyító gombok 44×44 px-esek, a fókusz visszatér;
  - nincs konzolhiba;
  - a layout-, mobile-, type- és motion-check zöld.
- Két telefonos hibát talált, ezeket javítottam:
  - A nagy nézetben a szöveg melletti vonal 13 px-re esett a fotó talajvonalától. Telefonon ez most semleges elválasztó, a talajszint csak a fotón van.
  - Az összkép „TALAJSZINT” felirata 11,05 px volt, most 12,35 px. (Az SVG-szöveget a type-check nem méri.)
