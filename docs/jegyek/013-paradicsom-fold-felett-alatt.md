# 013 · Szentkirály paradicsom: „Föld felett, föld alatt” fotóblokk

**Státusz:** kész · **Létrehozva:** 2026-11-10 · **Méret:** M

## Cél

A paradicsomtábla grafikonja alatt a látogató egy pillantással látja, mit jelent a lazább talaj. Föld felett ugyanaz a kutató áll a két parcellán egy léptékben: a kombinátoroson térdig, az ásógépesen combig ér a lomb. Föld alatt a két kiásott tő gyökere látszik: ritka és durva, illetve sűrű hajszálgyökér-háló. A kettő között a mért hajtáshossz (+38 %, 65 → 90 cm) és egy sematikus nagyító.

## Hatókör

- Új `experiment/pages/AboveBelowGround.tsx` + `.module.css`, a `SzentkiralyTomatoPage` grafikonja alatt.
- Asztali nézet: három oszlop (fotó | gerinc 204 px | fotó). Lombvonalak az egész soron át, a „+38 %” doboz a két vonal között. TALAJSZINT sáv, alatta a gyökérpár, középen a nagyító (SVG-hurok, csak képernyőn és mozgás engedélyezésekor: `useLoopActive`).
- Telefon és tablet (≤1024 px): két oszlop. A gerinc tartalma a sora alá kerül; a gyökércímkék a fotó alján, teljes szélességben.
- Belépő animáció csak asztalin, `prefers-reduced-motion: no-preference` mellett: a gyökér „kiásódik” (clip-path), a vonalak kirajzolódnak.
- `FurtherMeasuresPage.tsx`: a paradicsom léptetőből kikerül a Hajtáshossz lépés (4 → 3: Térfogattömeg, Humusz, Talajélet), mert a szám innentől ebben a blokkban él. A Fő eredmények összegzésében marad.
- Fotók: `public/images/kutatás_pics/Szentkirály/paradicsom/` (WebP, EXIF nélkül).
  - `kutato-kombinator.webp`, `kutato-asogep.webp`: 800×1300. Egy léptékre igazítva (fejtető és pólószegély egy vonalban), a fények a két kép átlagához húzva.
  - `gyoker-*.webp`: 900×922, a mérőszalagnál kettévágva.
- Forrás: Drive „Ásógép-2026 › Képek-VD-ip_paradicsom”: `20260702_115928` (kombinátor), `20260702_115538` (ásógép), `20260702_120938` (gyökérpár). Terv: https://claude.ai/artifact/5F1kvCN4yCWuqe5SjKAoPj (C változat).

## Nem nyúlunk hozzá

- A paradicsom Timeline grafikonja, a többi helyszín.

## Döntések

- 2026-11-10 (felhasználó): a C változat, középső gerinccel.
- 2026-11-10 (felhasználó): azonos kameraszögű fotópár; a horizont mindkét képen a kutató hasa magasságában van.
- 2026-11-10 (felhasználó): a Hajtáshossz lépés kikerül a „További mérések” léptetőből (nincs duplikáció).
- A kutató nevét nem írjuk ki, a földtulajdonost sem.
- Őszinte szöveg: a 65/90 cm hajtáshossz, nem lombmagasság, ezért a fotón nincs cm-skála. A gyökér szemrevételezés (egy növénypár), gyökértömeget nem mértünk.

## Nyitott kérdések

- (nincs)

## Kész, ha

- [x] 1440 px: a blokk a paradicsom grafikonja alatt van; a két fotó egy magas, a két lombvonal a teljes soron át fut, a „+38 %” doboz a vonalak közé esik.
- [x] 390 px: két oszlop, nincs vízszintes görgetés, a címkék nem lógnak ki és nem takarják a vonalakat; a cím 20 px-en kezdődik (`layout-check.js`).
- [x] A „További mérések › Paradicsom” léptető 3 lépéses (nincs Hajtáshossz).
- [x] Nincs 12 px alatti szöveg (`type-check.js`); `prefers-reduced-motion` mellett nincs animáció (`motion-check.js`).
- [x] `npx tsc --noEmit` hibamentes (a `.next-qa` elavult típusai nem számítanak); `npm run lint` 0 hiba.
- [x] Szemmel: képernyőkép 390 és 1440 px-en.

## Eredmény

- A checker (2026-11-10) minden pontot rendben talált:
  - 1440 px: a két fotó 399×648 px, a vonalak a teljes soron át futnak (x 339–1341), a „+38 %” doboz 10–10 px-re van a két vonaltól.
  - 390 és 360 px: nincs vízszintes görgetés, a címkék a fotón belül vannak, és nem fedik a vonalakat.
  - A léptető 3 lépéses; nincs 12 px alatti szöveg; reduced motion mellett nincs animáció; 0 konzolhiba.
- Utána, felhasználói kérésre:
  - A dátumcímke csak „Július”.
  - A gyökérfotókon a pont + szaggatott vonal helyett gyűrű és hozzá tapadó címke került (az arany dupla gyűrű a nagyító keretét idézi; „Az arany kör nagyítva…”), majd vissza a szaggatott vonal: a nagyító pereméről az arany gyűrűig egyben fut (JS méri a gyökérsoron át), sötét sávval alatta; az arany gyűrű lejjebb, a hajszálgyökereken (63 %, 63 %).
- Megjegyzés: a kártyán belüli cím 390 px-en 37 px-en kezdődik (20 px gutter + 16 px kártyapadding + keret), ugyanúgy, mint a szomszédos kártyáké.
- Mérési megjegyzés: a `content-visibility: auto` szakaszban ugrásszerű görgetésnél az IntersectionObserver nem jelez; valódi görgetésnél a belépő animáció és a nagyító hurka fut (10 animáció).
