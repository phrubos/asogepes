# 023 · Kapcsolat lábléc az oldalvégeken és a főoldalon

**Státusz:** kész (egyetemi adatok pótlandók) · **Létrehozva:** 2026-11-14 · **Méret:** M

## Cél

A lap végén a látogató megtudja, kihez forduljon: a gépről, bemutatóról és ajánlatról az Agroskillhez, a kutatásról az egyetemhez. Eddig csak a két logó és a „© 2026” állt ott.

## Hatókör

- Új közös komponens: `shared/ContactFooter` (+ adatok: `lib/contact.ts`).
- `shared/PageEnd` (a /problema, /technologia, /kutatas vége): a partner-aláírás helyett a kapcsolat lábléc; a „Tovább” kártya marad.
- `layout/Footer` (főoldal): a logósor helyett ugyanez a lábléc.
- Asztali (>1024 px): négy hasáb (A kutatás mögött: logók egymás alatt · Oldalak · Agroskill · NJE KVK), alul © sor.
- Telefon/tablet (≤1024 px): „Kapcsolat” címke, két lenyitható partnersor (Agroskill nyitva), oldalak két hasábban, alul logók és ©.

## Nem nyúlunk hozzá

- A „Tovább” kártya a tartalmi oldalak végén.
- A partnerlogók fájljai és arányai (`lib/partners.ts`).

## Döntések

- 2026-11-14: az Agroskill e-mailje `kis.pal@agroskill.hu` maradhat (felhasználó; kivétel a „nincs személynév” szabály alól).
- 2026-11-14: az egyetemi adatok még nincsenek meg: csak a ténylegesen ismert adat (kvk.nje.hu, Kecskemét) jelenik meg, helykitöltő nem kerül élesbe.
- 2026-11-14: az óriás „Ásógép” szóvédjegy és a mottó kimaradt (felhasználói megjegyzés a canvason; a mottó a főoldal hero-ját ismételné).
- 2026-11-14: UX-átnézés (`ux-heuristics`, 6,5 → 9/10): arany mono hasábcímek, kiemelt telefonszám, ikonok a sorok elején, „Útvonal ↗” Google Maps link, aktuális oldal jelölve, kattintható logók, © 60%-os fehér.
- 2026-11-13: telefon/tablet (≤1024 px) új elrendezés, A változat „Gyorsgombok” (`.superdesign/design_iterations/footer_mobil_1.html`; felhasználó: túl zsúfolt, az oldallista nem kell): partnerenként logó + szerep, arany hívógomb, E-mail / Útvonal gomb, web + ikon-only közösségi linkek; lenyitható sorok, oldallista, ismételt logósor és a második ©-sor kimaradt. 390 px-en 732 → 461 px. Asztali változatlan (box + számított stílus dump egyezik).
- Logók: mindig fix magasság + `align-self: flex-start` (a mockupban a flex oszlop szélességre nyújtotta az Agroskill logót).

## Változatok (csak új vizuális blokknál)

- Első kör (3 változat, mind elvetve): https://claude.ai/artifact/CQWz1RCGC8veWXQ16FBvoT
- Második kör, canvas (5 változat): https://claude.ai/artifact/TzHp3HmzUbJ5gqfqYUSbtN · **választott: 5 · Hasábos lábléc** (SOAR-irány, szóvédjegy nélkül, UX-javításokkal)

## Nyitott kérdések

- [ ] Egyetemi telefonszám, e-mail és cím (helykitöltő helyett; a `lib/contact.ts`-ben kell kitölteni).
- [ ] Szerepcímke a személyes e-mail mellé (pl. „értékesítés”)? — opcionális.

## Kész, ha

- [x] Asztalin (1440, 1366 px) a /problema, /technologia, /kutatas végén és a főoldal alján a négy hasáb látszik; a logók torzítás nélkül (NJE 655:113, Agroskill 551:120 arány ±2%).
- [x] Az aktuális oldal az Oldalak listában `aria-current="page"`, a főoldalon a „Főoldal”.
- [x] 390 és 360 px-en: „Kapcsolat” címke, az Agroskill sor nyitva, az NJE sor koppintásra és Enter/Space-re nyílik (`aria-expanded` vált); minden koppintható elem ≥ 44 px.
- [x] `layout-check.js` zöld (20 px gutter, balra igazított címek), `mobile-check.js` zöld.
- [ ] `type-check.js` és `clip-check.js` zöld: **részben**: `clip-check` csak a 006-os térképfeliratokon piros; `type-check` a főoldalon piros (heurisztika, lásd Eredmény).
- [x] `token-check.js` nem jelez új egyedi értéket.
- [x] `npx tsc --noEmit` és `npm run lint` hibamentes.
- [x] Szemmel: képernyőkép 390 és 1440 px-en, egyezik a canvas 5-ös változatával.

## Eredmény

2026-11-14, dev szerveren mérve (checker: KÉSZ, vizuális pontszám 8/10).

- Új: `shared/ContactFooter` (+ `lib/contact.ts`), bekötve a `PageEnd`-be (/problema, /technologia, /kutatas) és a főoldali `Footer`-be; a régi logósor és a © sor CSS-e törölve.
- Logóarány: NJE 5,77–5,80 (fájl 5,80), Agroskill 4,59 (fájl 4,59), minden szélességen.
- `aria-current` az aktuális oldalon mind a 4 oldalon; 390/360 px: Agroskill nyitva, NJE kattintásra, Enterre és Space-re nyílik, 0 db 44 px alatti célpont.
- `layout-check`, `mobile-check`, `token-check`, `tsc` (src), `lint` zöld. `clip-check`: csak a /kutatas térképfeliratai (006, ismert). `type-check` a főoldalon piros: a főoldalon csak 3 elem számít törzsszövegnek, ebből kettő a 12 px-es © sor; a checker szerint heurisztikai műtermék, valódi olvashatósági hiba nincs (12 px alatti szöveg 0).
- A checker kozmetikai észrevételei után: a hasábok tartalomszélesek, egyenlő közzel (`space-between`), az „Útvonal ↗” a cím alá került.
- 2026-11-14, felhasználói visszajelzés („túl hangsúlyos, nem különül el”) után halkítva: a lábléc saját, teljes szélességű sötét sáv (ugyanaz, mint a főoldali lábléc), a hasábcímek és ikonok 50%-os fehérek (arany csak az aktív oldal pontja), telefonszám 16 px / 500, közösségi linkek sima szövegként. `layout-check`, `mobile-check`, `token-check` zöld; előtte–utána képek: `$TEMP/eu/`.
- 2026-11-14, függönyhatás (felhasználó kérte): asztalon (>1024 px, mozgás engedélyezve) a „Tovább” kártya sávja felcsúszik a helyben álló lábléc fölött; `PageEnd` `.lid` + `position: sticky` lábléc. Ehhez a `globals.css`-ben a `body` `overflow-x: hidden` → `clip` (a hidden a body-t görgetőkonténerré tette, a sticky nem működött). A sáv tetején 2×`--space-4xl` átmenet (éles határ volt). `layout-check`, `mobile-check`, `token-check`, `motion-check` zöld.
- 2026-11-14: a közösségi linkek kis (16 px) kitöltött ikont kaptak a szó előtt (kivágott jel, SVG mask, halvány fehér, hoverre arany), kör és keret nélkül, 2×2 rácsban (felhasználó kérte).
- Asztalin a DOM a telefonos sorrendet követi (elérhetőségek elöl), ezért a Tab sorrendje eltér a látott hasábsorrendtől.
