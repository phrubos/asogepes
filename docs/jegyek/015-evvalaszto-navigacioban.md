# 015 · Évválasztó a navigációban, helyszínenként (25 / 26)

**Státusz:** kész · **Létrehozva:** 2026-11-10 · **Méret:** L

## Cél

A /kutatas oldalon minden helyszín mellett két apró gomb (2025, 2026): egyik, másik vagy mindkettő. A helyszín tartalma és menüpontjai ehhez szűkülnek. A Lakitelek 2026-os fotóblokk betöltés közben ugyanazt a talaj-töltőt mutatja, mint a 2025-ös fotónézegető.

## Hatókör

- Új `experiment/season/YearFilter.tsx`: helyszínenkénti évválasztás (`?evad-szk`, `?evad-kb`, `?evad-lk`; egy év vagy `2025,2026`; alapból mindkettő; legalább egy év mindig marad). `FixedSeason`: egy blokk egy évre rögzítve; a blokk `setYear`-je az adott évre szűkít.
- `*CombinedPage.tsx`: blokkonként a mért évek. Kétéves blokk mindkét évvel: egymás alatt, évcímkével (`YearDivider`). Egyéves blokk: csak ha az éve be van kapcsolva. Helyszín adatok és Talajélet (2025–2026) egyszer jelenik meg.
- `shared/ScrollLayout`: a sínen a helyszín sorszáma mellett, jobbra a 25 / 26 gombok (a név nem törik); a menüpontok szűkülnek. Telefonon a Tartalom lapon a helyszín sorában.
- Helyszín adatok: az ÉV-kapcsoló helyett ugyanaz a többválasztós gomb (telefonon ez a fő vezérlő).
- `LakitelekRyeBoard`: `SoilLoader` a csempéken, a nagy nézetben és az összképen, amíg a kép tölt.

## Nem nyúlunk hozzá

- Fő eredmények, hero, főoldal (felhasználói döntés: csak a helyszínek tartalma szűkül).

## Döntések

- 2026-11-10 (felhasználó): a vászon B változata (évek a helyszínek mellett, helyszínenként); csak a Kutatás oldal szűkül; a helyszínnév nem törhet a gombok miatt (Kecskemét-Borbás).
- ~~A gombok a sorszám sorában, jobbra~~ — elvetve (felhasználó, 11-10): nem látszott, melyik helyszínhez tartoznak.
- 2026-11-10 (felhasználó): a vászon „Évek a sínen” táblájáról az **A**: teljes évszám (2025 / 2026) a helyszínnév alatt, balra igazítva; Kecskemét: zárt 2025 + „csak 2025”. A névtől 8 px, a következő helyszíntől 20 px. Telefonon a Tartalom lapon a név sorában 25 / 26 marad (44 px).
- 2026-11-10 (felhasználó, később): mégis kicsi 25 / 26 a név **mellett, egy sorban**, „csak 2025” felirat nélkül; kétsoros névnél (Kecskemét-Borbás) ~~a név magasságának felénél~~ a név első sorában, ugyanazon az alapvonalon, mint egysoros névnél (felhasználó 11-10 később). A kiválasztott, még kikapcsolható gomb hoverre világosabb arany (`--color-gold-light`); a zárolt (utolsó választott év, egyéves helyszín) nem reagál. 240 px-es sínen a SZENTKIRÁLY + két gomb kifér (1 px tartalék).
- Hover: a gombok a névvel együtt csúsznak 4 px-et (0,3 s), az aktív helyszínnél nem; a gombok 22 px szélesek, 6 px-re a névtől, így hover közben is a sínen belül maradnak (jobb szél 236 / 240 px).
- ~~Évelválasztó alatt (mindkét év) a blokk saját „Év: 2025” címkéje nem jelenik meg~~ — felülírva (felhasználó, 11-10 később): két jelölés ugyanarra (arany pirula a vonalon vs. „Év: 2026” a jelvény mellett) következetlen volt, és a pirula kapcsolónak látszott (K3).
- **Évjelölés szabálya** (11-10): az év mindig a helyszín-jelvény melletti „hol + mikor” sorban áll, egyféle stílusban (arany mono szöveg, 0.9375rem, nem pirula; az „Év:” csak felolvasónak). Mindkét év esetén a blokk mindkét példánya a saját évét írja ki ott, a két példányt felirat nélküli, két végén elhalványuló hajszálvonal választja el (`SiteBlocks`). Pirula = kapcsoló (sín 25/26, ÉV-kapcsoló); ami nem kattintható, az szöveg. A „másik év ↑” link csak akkor jelenik meg, ha a másik év rejtve van.
- **Blokkfejléc minden szélességen** (11-10): felirat (asztalon jelvény + év, telefonon csak az év) → 8 px → fehér cím → tartalom (16 px telefonon, 28 px asztalon). Korábban telefonon az év a cím alatt állt, a Helyszín adatokban és Lakiteleknél fölötte. A Tábla-kapcsoló (További mérések) kontroll: a cím alá került, 16 px-re.
- A Fotók blokk neve „Egyéb fotók” (menü, felső sáv, és új fehér cím a blokkban); telefonon a fejléc már nem rejtett, csak a jelvény. A fotó arany felirata telefonon 1.375rem, mint a 2026-os rozstábla címe, 16 px-re az „Egyéb fotók”-tól (a `PhotoViewer` ::before/::after térkitöltője telefonon ki, az 19 px-et adott hozzá).
- Az oldal végi partnerlogók (`PageEnd`) telefonon középen, mint a főoldal láblécében (felhasználó 11-10; kivétel a balra igazítás alól, CLAUDE.md).
- A rozs összképe a 2025-ös fotónézegetőben nyílik (`PhotoViewerModal`, `content` mező): X, oldalpanel, nagyítás, töltő; telefonon a nézegető X-e a képernyő sarkában (a panel blur-je elvitte).

## Nyitott kérdések

- (nincs)

## Kész, ha

- [x] 1440: a sínen Szentkirály és Lakitelek mellett 25 + 26, Kecskemét mellett zárt 25; egyik helyszínnév sem törik a gombok miatt.
- [x] Lakitelek: csak 2025 → eltűnik a „További mérések (2026)” menüpont és blokk, a grafikon és a Fotók 2025-ös; csak 2026 → csak 2026; mindkettő → a grafikon és a Fotók évenként egymás alatt, évcímkével.
- [x] Az utolsó bekapcsolt év nem kapcsolható ki; a választás az URL-ben (`?evad-lk=2025`), újratöltés után megmarad; a régi `?evad-lk=2025` linkek működnek.
- [x] Telefonon (390): a Helyszín adatokban és a Tartalom lapon is van gomb, ≥ 44 px; `layout-check`, `mobile-check`, `type-check`, `nav-check` zöld.
- [x] A rozsfotók betöltése alatt látszik a `SoilLoader`; reduced motion mellett nem forog.
- [x] `npx tsc --noEmit`, lint hibamentes; nincs konzolhiba.

## Eredmény

Checker (2026-11-10, dev szerver): minden „Kész, ha” pont teljesül — szűrés és menüpontok (Lakitelek, Szentkirály, mindkét irány), URL és régi linkek, sín ↔ Helyszín adatok szinkron, 390 px: 44 px gombok, nincs vízszintes görgetés; SoilLoader 314 ms-nál megjelenik, betöltés után eltűnik, reduced motionnél áll; 0 konzolhiba. A checker még a régi (sorszám melletti) gombhelyet mérte; az A változat után újramérve: layout-check, mobile-check, motion-check zöld, a sín 1100–1440 px és 720–900 px magasság között nem csordul túl (a 1366×768-on a menü alja 651 px). A nav-check FAIL-jai a táblán listázott Suspense-álriasztás; az időzítés rendben (Kutatás 694 ms).
Mellékjavítás: a lakiteleki eredménysorok koppintható leírása telefonon 44 px magas (`LakitelekChartPage.module.css`).
