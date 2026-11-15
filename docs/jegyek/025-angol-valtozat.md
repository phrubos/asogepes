# 025 · Angol változat: váz, nyelvváltó, közös keret

**Státusz:** folyamatban · **Létrehozva:** 2026-11-14 · **Méret:** L (a teljes fordítás 4 jegyben: 025–028)

## Cél

Az oldal teljes, szakmailag pontos angol változata saját címeken (`/en`, `/en/problem`, `/en/technology`, `/en/research`), amit a Google angolul indexel, és ami továbbküldhető egy külföldi kollégának. A fejlécben HU/EN kapcsoló.

## Hatókör

- **025 (ez):** nyelvi váz és útvonalak, nyelvváltó, közös keret (menü, mobil szekciósáv, oldalvég, kapcsolat-lábléc, 404, `ScrollLayout` feliratai), metaadatok, hreflang, sitemap, OG-képek, főoldal (Hero), szójegyzék.
- **026:** `/problema` → `/en/problem`
- **027:** `/technologia` → `/en/technology`
- **028:** `/kutatas` → `/en/research` (a legnagyobb: `data.ts`, `seasons.ts`, `methodology.ts`, `field-maps.ts`, helyszínoldalak)
- Asztali és mobil nézet egyaránt.

## Nem nyúlunk hozzá

- A magyar címek és a magyar oldal kinézete változatlan (`/`, `/problema`, `/technologia`, `/kutatas`).
- A `?section=` azonosítók (már most angolok) mindkét nyelven ugyanazok.
- Nincs automatikus átirányítás böngészőnyelv alapján (a keresők és a megosztott linkek miatt rossz gyakorlat).

## Döntések

- 2026-11-14: nyelvváltó = mockup **B (Gördülő betűk), zászlóval** a földgömb helyett (felhasználó). Mockup: https://claude.ai/artifact/FFQd8aKHxRQJzFMVGJdJbc
- 2026-11-14: lábléc-kapcsoló nem kell, csak a fejlécben (felhasználó).
- 2026-11-14: a technikai irányt a felhasználó Claude-ra bízta („a legprofibb irányt”). Claude döntései:
  - **Nyelv az URL-ben.** Magyar előtag nélkül (a meglévő címek maradnak), angol `/en` alatt, angol útvonalnevekkel. A kapcsoló egy link a másik nyelvű párra (megtartja a `?section=` paramétert); nincs localStorage-állapot.
  - **Két gyökér-layout route groupokkal** (`app/(hu)`, `app/(en)`), így az `<html lang>` már a szerver HTML-ben helyes, minden oldal statikus marad, nincs middleware. Nyelvváltáskor teljes oldalbetöltés történik, ez itt elfogadható.
  - **Saját, függőség nélküli szótár:** a szövegek a komponens mellett maradnak `{ hu, en }` párban; a TypeScript kikényszeríti, hogy az angolban minden kulcs meglegyen. Nincs `next-intl`: nem kell middleware, és a magyar szöveg ott marad, ahol eddig kereste a csapat.
  - **Számok:** angolul tizedespont (`formatNumber(value, locale)`); a szövegbe írt számokat kézzel fordítjuk.
  - **SEO:** `alternates.languages` (hu, en, x-default → hu) minden oldalon, kétnyelvű sitemap, `og:locale` en_GB, angol OG-képek.
  - **Brit angol**, szakszavak a [szójegyzék](../forditas/szojegyzek.md) szerint.

## Változatok

- Mockup: https://claude.ai/artifact/FFQd8aKHxRQJzFMVGJdJbc · választott: B · módosítás: magyar lobogó / Union Jack a földgömb helyett

## Nyitott kérdések

- [ ] A szójegyzék ⚑ sorai (38SX/38WX típusnevek, „víztelítettség”) – a kutatók erősítsék meg; addig a jelölt fordítás áll.

## Kész, ha

- [ ] `/en`, `/en/problem`, `/en/technology`, `/en/research` 200-zal válaszol, a szerver HTML-ben `<html lang="en">`; a magyar oldalakon `lang="hu"`
- [ ] A kapcsoló a párra visz, a `?section=` megmarad (pl. `/kutatas?section=lakitelek` ↔ `/en/research?section=lakitelek`)
- [ ] Minden oldal `<head>`-jében `hreflang` hu / en / x-default; a `sitemap.xml` mindkét nyelvet felsorolja
- [ ] Angolul a menü, a mobil szekciósáv és tartalomlap, az oldalvég, a kapcsolat-lábléc, a 404 és a főoldal szövege angol
- [ ] A magyar oldalak kinézete változatlan (`style-diff.js` a 4 oldalon, 390/1440)
- [ ] `npx tsc --noEmit` hibamentes; `layout-check`, `nav-check`, `token-check`, `mobile-check` zöld
- [ ] Szemmel: képernyőkép 390 és 1440 px-en mindkét nyelven

## Eredmény

**Checker, 025 (2026-11-14): RÉSZBEN.** Rendben volt: a 8 útvonal és a `lang`, a hreflang, a canonical, az `og:locale`, a sitemap, a kapcsoló desktopon és telefonon (a `?section=` megmarad), a nav pirula 48,4 px, a tsc, valamint a layout-, mobile- és token-check. Vizuális pontszám: kapcsoló 8/10, angol főoldal 8/10.

Javítva a checker után:
- **404 angolul:** `app/(en)/en/[...rest]` + `en/not-found.tsx`. Az `/en/…` alatt az angol keret és angol szöveg jelenik meg `lang="en"`-nel, a magyar oldalra mutató sorral. A böngészőfül címe itt az alapcím, mert a not-found metaadatát React 18 mellett a Next nem írja ki.
- **Hero kártyafelirat:** rövidebb lett („Szentkirály · loose layer, end of season”), 1440 px-en sem törik.

Nyitott:
- `style-diff` baseline nélkül nem futott. Helyette a magyar főoldalt szemmel néztük meg 390 és 1440 px-en.
- A clip-check a magyar `/kutatas` SVG-térképfeliratain piros (16 elem). Ezt a 025 nem érinti, valószínűleg régi hiba.
- A nav-checkben a menü → Kutatás 1760 ms-ig tartott a dev szerveren; ezt production buildben érdemes újramérni.
