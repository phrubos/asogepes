# 022 · Adatkezelési tájékoztató

**Státusz:** parkolva (2026-11-13, felhasználó: „egyelőre hagyjuk”) · **Létrehozva:** 2026-11-13 · **Méret:** S

## Cél

Egy rövid, érthető `/adatkezeles` oldal, ami elmondja, hogy az oldal nem használ sütit és analitikát, és csak a tárhely szervernaplója keletkezik. Elérhető a főoldal láblécéből és a három tartalmi oldal végéről.

## Hatókör

- Új oldal: `src/app/adatkezeles/page.tsx` + `page.module.css` (a 404-es oldal stílusában, sötét földszín, egy szövegoszlop).
- Link: `layout/Footer` (főoldal) és `shared/PageEnd` (tartalmi oldalak), saját halk sávban a partnerlogók alatt.
- `app/sitemap.ts`: az oldal bekerült (priority 0.2).
- Asztali és mobil.

## Nem nyúlunk hozzá

- Cookie-banner nem kell (kódellenőrzés 2026-11-13: nincs süti, analitika, külső beágyazás, Google Fonts kérés; élesen nincs `Set-Cookie`).
- A menü változatlan, a tájékoztató nem menüpont.

## Döntések

- 2026-11-13 (felhasználó): az adatkezelő az **Agroskill Kft.**; a link a főoldal láblécében és az oldalvégeken legyen.
- 2026-11-13: cégadatok az agroskill.hu adatvédelmi szabályzatából: „Agroskill Kereskedelmi és Szolgáltató Kft.”, székhely 6031 Szentkirály, Rákóczi utca 42., Cg. 03-09-131072, adószám 26153263-2-03. (A kapcsolat oldalon más cím szerepel: Ipartelep útja 6. Ez a telephely, a tájékoztatóba a székhely kell.)
- 2026-11-13: tárhely Vercel Inc. (adatfeldolgozó, EU–USA DPF + általános szerződési feltételek); naplómegőrzés Hobby 1 óra, Pro 1 nap → „legfeljebb 1 nap”.
- 2026-11-13 (felhasználó a képernyőképen: „valami nem tetszik”): az első változatban a link a partnersorban állt (mintha harmadik partner lenne), a főoldalon pedig üres térben lógott. Javítva: saját alsó sáv, hajszálvonal, közel a logókhoz.

- 2026-11-13 (felhasználó): az alsó sávban „Készítette: Hrubos Péter” áll a link mellett. A „© … ” helyett ez került be, mert a © jogtulajdont jelöl, a tartalom pedig a partnereké.

- 2026-11-13 (felhasználó): **egyelőre hagyjuk** a tájékoztatót és a készítői sort. A link és az oldal kikerült; a kész vázlat a `022-vazlat/` mappában van (`page.tsx.txt`, `page.module.css.txt`; visszaállításhoz `src/app/adatkezeles/page.tsx` és `page.module.css` néven, plusz a link a `Footer`-be és a `PageEnd`-be, és a sitemap-sor). Helyette az alsó sávban csak „© 2026” áll.

## Nyitott kérdések

- [ ] Melyik e-mail-cím legyen az adatkezelő kapcsolata? (az agroskill.hu-n csak személyes címek vannak; jó lenne egy általános, pl. info@). Addig az oldalon „[kitöltendő]” áll → **élesbe így nem mehet**.
- [ ] A megrendelő jóváhagyja-e a szöveget (cégnév, székhely, „legfeljebb 1 nap” megőrzés — ez a Vercel csomagtól függ; Observability Plus esetén 30 nap).
- [ ] A Vercel postacíme (440 N Barranca Ave #4133, Covina, CA 91723) a Vercel tájékoztatójának összefoglalójából jön, kézzel ellenőrizendő.
- [ ] Van-e az Agroskillnek kijelölt adatvédelmi tisztviselője? (A 2018-as szabályzatukat a Value Data Solutions Kft. készítette; ha van DPO, az elérhetősége is bekerül.)

## Kész, ha

- [x] `/adatkezeles` 200, `<h1>` „Adatkezelési tájékoztató”, nincs konzolhiba
- [x] Link a főoldal láblécében és a /problema, /technologia, /kutatas végén; tap target ≥ 44 px
- [x] `clip-check` /adatkezeles 5 szélességen 0; `layout-check`, `mobile-check`, `type-check`, `token-check` zöld
- [ ] Nincs „[kitöltendő]” az oldalon (e-mail megadva)
- [ ] Checker a végleges szöveggel; szemmel 390 és 1440 px

## Eredmény

(kitöltés a végén)
