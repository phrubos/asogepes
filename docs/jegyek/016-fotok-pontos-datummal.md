# 016 · Minden kutatási fotó alatt hely és pontos dátum

**Státusz:** kész · **Létrehozva:** 2026-11-10 · **Méret:** M

## Cél

Minden fotónál egy formában látszik, hol és mikor készült: „Fotó: Lakitelek, 2025. május 2.” (a térfogattömeg-blokk mintájára). A látogató a napig tudja, mikor készült a kép.

## Hatókör

- Új közös komponens: `ui/PhotoCredit` (0,8125rem, halvány fehér, blokk; „Fotó:” / „Fotók:”).
- `shared/PhotoViewer` (oldal és teljes nézet): új `credit` mező a `PhotoItem`-en, a leírás alatt.
- `lib/data.ts` 2025-ös fotói: a dátum a címből a creditbe kerül, évvel.
- `SzentkiralyGrowthPage` (hagyma, 2026. jún. 26. és júl. 22.), `AboveBelowGround` (paradicsom, 2026. júl. 2.; a „Július” címke kikerül), `LakitelekRyeBoard` (rozs, 2026. máj. 19.), `BulkDensityMethodPage` (a saját credit helyett a közös).
- Asztali és mobil.

## Nem nyúlunk hozzá

- Mérési dátumok a grafikonokon és a szövegekben (hónap, a 11-08-i döntés szerint).
- Termék- és illusztrációs fotók (`/technologia`, `/problema`, főoldal).

## Döntések

- 2026-11-10 (felhasználó): ahol tudjuk, minden fotónál pontos dátum, közös formában (felülírja a 013/014 „csak hónap” döntését a fotók dátumára).
- Dátumforrás: a Drive-fájlnevek (2026), a meglévő címek és leírások (2025).

## Nyitott kérdések

- [ ] Szentkirály 2025 hagymaállomány (`erno_hagyma.jpg`): a nap nem ismert (az EXIF dátum 2025-11-05, ez mentési dátum), ezért „2025. június”. Kutatóktól: melyik napon készült?

## Kész, ha

- [x] Minden kutatási fotóblokk és a teljes nézet alatt ott a „Fotó(k): hely, dátum” sor, azonos stílusban (0,8125rem = 13 px).
- [x] A címekben nincs kétszer a dátum (pl. „…, 06. 19-én” kikerült).
- [x] 390 px: a credit nem lóg ki, nincs vízszintes görgetés; `layout-check.js` és `type-check.js` zöld.
- [x] `npx tsc --noEmit` hibamentes (a `.next-qa` elavult típusai nem számítanak).
- [x] Szemmel: képernyőkép 390 és 1440 px-en.

## Eredmény

- A checker (2026-11-10) minden pontot rendben talált: mind a 14 creditet megtalálta, mindegyik 13 px és rgba(255,255,255,0.55); 390 px-en 0 vízszintes túlnyúlás, a creditek jobb széle 353–370 px; 0 konzolhiba; `layout-check` és `type-check` zöld.
- Utána: a credit elé szóköz került, hogy a felolvasó ne olvassa egybe a bekezdés végével („…mértünk.Fotók:”).

