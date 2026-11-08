# 005 · A térfogattömeg mérése (Módszertan)

**Státusz:** kész · **Létrehozva:** 2026-11-08 · **Méret:** M

## Cél

A `/kutatas` Módszertan része röviden és egyértelműen elmondja, hogyan mérjük a térfogattömeget: hengeres, bolygatatlan mintavétel 10–15 cm mélyről, szárítás, mérés. A lakiteleki fotókból lépésenként léptethető, prémium hatású képsor lesz, mellette egy kis metszetrajz mutatja, ami a fotón nem látszik: hol van a henger a talajban.

## Hatókör

- Új blokk a Módszertanban a „Mért jellemzők” és a „Talajélet mérése” közé: `methodology-terfogattomeg`, a menüben „Térfogattömeg mérése”.
- Asztali (≥1025 px) és mobil (≤1024 px) nézet egyaránt; mindkettő a meglévő Módszertan-blokkok kereteit használja (`SzentkirályTimelinePage` fejléc, `MethodologyBlocks.module.css`).
- A „Mért jellemzők” kártyán a Térfogattömeg sora pontosabb lesz („hengeres minta 10–15 cm-ről, a pontok átlaga”).

## Nem nyúlunk hozzá

- A penetrométer- és a talajélet-blokk, a helyszíni oldalak térfogattömeg-adatai (`FurtherMeasuresPage`, `seasons.ts`).
- Nem lesz videó, motion graphic vagy montázs (felhasználói döntés, 2026-11-08).
- A megrendelőnek nem teszünk fel további kérdéseket: mélység, hengerszám, szárítási hőmérséklet úgy kerül a szövegbe, ahogy itt áll.

## Döntések

- 2026-11-08 (felhasználó): a lépésenkénti fotóváltó és a metszetrajz a szemléltetés; a videót és a többi változatot elvetette.
- 2026-11-08 (felhasználó): a mérés nem havi; annyiszor mérünk, ahányszor az adatok mutatják (szezononként 2–3 mérésnap).
- 2026-11-08 (felhasználó): a szöveg a lehető legtömörebb, de egyértelmű legyen. A képek egységes fényt, színt és élességet kapnak, prémium hatásúak legyenek, de illeszkedjenek a mostani designba.
- A módszer forrása: ISO 11272:2017 (core method) és az MSZ-08-0205:1978. A 100 cm³-es henger neve Kopecky-henger; az oldalon csak „100 cm³-es acélhenger” szerepel, a szakszó nem.
- 2026-11-08 (felhasználó): „mehet a 005”. Menet közben kérte: kell egy „Újra” gomb, mint a Probléma oldali szelvény-animációkon; és rákérdezett, jó-e az elrendezés.
- 2026-11-08: az első asztali elrendezésben (kép + lépéssor balra; szám, szöveg, rajz, megjegyzés jobbra) a jobb hasáb magasabb lett, a lépéssor alatt üres sáv maradt, a rajz pedig a változó hosszú szöveg alatt lebegett. Új rács: felső sor fotó ↔ metszetrajz (valós ↔ sematikus, egy magasságban), második sor lépéssor ↔ lépésszöveg, alul a megjegyzés teljes szélességben. A fotóról lekerült a „2 / 5 · Henger” felirat, mert a lépéssor és a nagy szám már mutatta.
- 2026-11-08: az „Újra” a meglévő `SoilPlayButton` (állapot: `done`) a fotó bal felső sarkában; akkor jelenik meg, ha az automatikus lejátszás véget ért vagy a látogató maga léptetett. Visszaugrik az 1. lépésre, és újra végigjátssza (csökkentett mozgásnál csak az 1. lépésre ugrik).
- 2026-11-08: telefonon a lépésnevek is látszanak (12 px), nem csak a számok; 360 px-en is kiférnek.
- 2026-11-08 (felhasználó): a lépésszöveg a rajz alatt gyenge volt; a választott irány a „magyarázó kártya”: a jobb hasáb egyetlen kártya (fent „04 / 05”, cím, szöveg; szaggatott vonal alatt a metszetrajz), a fotó és a lépéssor teljes magasságában; lépésváltáskor a szöveg beúszik, az arany keret felvillan (csökkentett mozgásnál egyik sem). A nagy arany sorszám helyére a kis „04 / 05” felirat került.
- 2026-11-08 (felhasználó): mobilon a kártya a fotó alatt szinte láthatatlan volt → előbb léptető nyilak kerültek a kártya jobb felső sarkába, majd (felhasználói kérdésre, hogy így sem látszik egyszerre a két animáció) közös „színpad” lett: ≤600 px-en a fotó (3:2, a `-square` vágás megszűnt) és alatta a metszetrajz egy keretben, mindkettő lapozható; 601–1024 px-en a kettő egymás mellett. Alatta lépéssor, majd a szöveg a nyilakkal. A rajz alja 20 cm-nél véget ér (viewBox 360×228). Telefonon a laborkártyán nincs ikonsor (a szöveg elmondja), csak a képlet.
- Kidolgozott példa: Lakitelek, 2026. április eleje (a fotók napja, 04-06), a 7 parcella átlaga: 1,43 g/cm³, vagyis „143 g ÷ 100 cm³”. Az értéket a kód a `lakitelekSoil2026.bulkDensity` adatból számolja, nincs beírva.

## Terv

### 1. Képek (kész az előkészítés, ellenőrzés a jegy indulásakor)

Forrás: Drive „Képek-Univ-Lakitelek”, a 112410–112650 sorozat (10 kép). Négy lépés, négy kép:

| Lépés | Forrásfájl | Mit mutat |
|---|---|---|
| 1 | `20260406_112412.jpg` | a gödör, a henger ráhelyezve |
| 2 | `20260406_112454.jpg` | a henger beverve, egy szintben a gödör aljával |
| 3 | `20260406_112547.jpg` | a henger körül kiásott föld |
| 4 | `20260406_112650.jpg` | lezárva a gödör szélén, lent a kerek lyuk |

Feldolgozás (`scripts/images/grade-terfogattomeg.py`, OpenCV + NumPy, a repóba kerül):
- **Igazítás:** a kék csavarhúzó nyele a földben marad, ez a rögzített pont. A 4. kép készült legközelebbről, ezért az a referencia, a többit ehhez nagyítjuk (×1,21–1,38). Így a képek egymásba úsznak, és a nyél, a gödör és a henger helye nem ugrál.
- **Egységesítés:** a négy kép LAB-átlagát és -szórását a közös átlaghoz igazítjuk (fényerő, fehéregyensúly).
- **Szín:** a zöldek 22 %-kal tompábbak, a kép +4 ponttal melegebb, a kék nyél telítettsége 40 %-kal kisebb. A földszín-paletta marad, ne „kék csavarhúzós” legyen a kép.
- **Élesség és tónus:** finom helyi kontraszt (CLAHE 1,4, 60 %-os keverés), enyhe S-görbe, a fehér kupak csúcsfényei tompítva, unsharp mask, finom sarokvignetta, ami a sötét oldalháttérbe vezet át.
- **Kivágás:** asztalra `-wide` (3:2, 1800 px), telefonra `-square` (1:1, 1080 px), minden lépésen ugyanaz a téglalap. JPG, minőség 84, progresszív; a `next/image` AVIF/WebP-t ad belőle.
- **Hely:** `public/images/kutatás_pics/Lakitelek/terfogattomeg/terfogattomeg-{1-asas,2-beveres,3-kiemeles,4-lezaras}-{wide,square}.jpg`.

### 2. Adat (`src/lib/methodology.ts`)

- `BULK_DENSITY_STEPS`: 5 elem, mindegyikben `title`, `text`, `image?` (az 5. lépésnek, a labornak nincs fotója), `alt`.
- `BULK_DENSITY_EXAMPLE`: hely, időpont, parcellaszám, átlag (a `lakitelekSoil2026.bulkDensity` első oszlopából), és a „gramm” érték = átlag × 100.
- A `MEASURED_PROPERTIES` Térfogattömeg `how` mezője: „hengeres minta 10–15 cm-ről, a pontok átlaga”.

### 3. Szöveg (végleges vázlat)

**Cím:** A térfogattömeg mérése
**Bevezető:** Megmutatja, mennyire tömör a talaj: hány gramm száraz föld van egy köbcentiméterben. Kisebb szám = lazább talaj.

1. **Gödör.** 10–15 cm mélyre ásunk, ahol a talaj tömörödni kezd.
2. **Henger.** A 100 cm³-es, két végén nyitott acélhengert függőlegesen a gödör aljába nyomjuk, amíg a pereme egy szintbe kerül a talajjal.
3. **Kiemelés.** Körülássuk, és a földdel együtt egyben emeljük ki. A kilógó földet a peremnél levágjuk, így pontosan 100 cm³ marad benne.
4. **Lezárás.** Mindkét végére kupak kerül, rá a mérési pont jele, és mehet a laborba.
5. **Labor.** 105 °C-on kiszárítjuk és lemérjük. A száraz tömeg osztva 100 cm³-rel: ez a térfogattömeg.

**Alsó sor:** Táblánként több ponton veszünk mintát, és ezek átlagát közöljük. A szezonban 2–3 mérésnapon ismételjük meg, így látszik, hogyan tömörödik vissza a talaj a művelés után.
**Képaláírás:** Lakitelek, 2026. április 6.

### 4. Felépítés

**Asztali (≥1025 px):** a fejléc (badge „Módszertan”, `Cylinder` ikon, cím, bevezető) után kéthasábos rács `minmax(0, 1.3fr) minmax(0, 1fr)`, 40 px köz.
- **Bal oldal: képkeret.** 3:2, `border-radius: 20px`, 1 px arany szegély (`rgba(212,168,75,.3)`), mint a `.example` kártyán. A négy kép egymáson fekszik (`position: absolute; inset: 0`), az aktív `opacity: 1`. Bal alsó sarokban egy finom sötét átmenetes sávban a lépés száma és neve (pl. „2 / 5 · Henger”). Kattintásra az `ImageLightbox` nyílik a nagy képpel, mint a penetrométernél.
- **Az 5. lépés (labor)** a képkeret helyén egy sötét kártya (`rgba(20,17,14,.6)`) három ikonos lépéssel: henger → 105 °C (`Thermometer`) → mérleg (`Scale`). Alatta nagy Fraunces számmal a képlet: **143 g ÷ 100 cm³ = 1,43 g/cm³**, kis betűvel „Lakitelek, 2026 április eleje, a 7 parcella átlaga”.
- **A kép alatt a lépéssor:** 5 egyforma szélességű gomb, mindegyiken szám és rövid név; az aktív felett arany sáv. Automatikus lejátszásnál ez a sáv tölt fel 5 s alatt.
- **Jobb oldal:** az aktív lépés nagy sorszáma (Fraunces, arany), címe és 1–2 mondatos szövege (`.body` stílus), alatta a **metszetrajz**, legalul az alsó sor és a képaláírás.

**Metszetrajz (`BulkDensityDiagram.tsx`, inline SVG, kb. 360 × 200):** oldalnézetű talajszelvény. Felül a felszín, rajta egy-két fűcsomó; 0–10 cm világosabb, laza réteg, alatta sötétebb, sűrűbb pontozású tömörödő réteg, jobb oldalon cm-skála (0, 10, 15). Bal oldalon a gödör kivágása. A henger lépésenként mozog: (1) a gödör alján áll, (2) beverve, a teteje a gödör aljával egy szintben, a 10–15 cm-es sáv arany szaggatott kerettel kiemelve, (3) mellette kiásva, (4) kiemelve, két kupakkal a felszín fölött, (5) a henger mellett a „100 cm³” felirat. Csak `transform: translateY` és `opacity` animálódik, a hosszabb (≥300 ms) Framer-átmenetek `ease-out`-tal. Színek: a `globals.css` földszínei és az arany.

**Mobil/tablet (≤1024 px):** egy oszlop a közös szabályok szerint (20 px margó, balra igazított cím, 16 px a címtől, 12 px a badge-től).
- A sorrend: fejléc → kép (`-square`, 1:1, teljes szélesség) → lépéssor → lépés szövege → metszetrajz (max. 160 px magas) → alsó sor.
- A lépésgombok ≥44 px magasak. 600 px alatt csak a szám látszik, a név az `aria-label`-ben van.
- A kép vízszintesen húzható (Framer `drag="x"`, 40 px felett lép, vagy gyors pöccintésre). A lightbox telefonon is működik.
- A blokk `mobile-static` a Framer belépéseken, és a `MethodologySection` `phoneHeight` értéke a 390 px-en mért magasság.

### 5. Mozgás

- **Képváltás:** 450 ms-os áttűnés, és az új kép 1,03-ról 1-re lassan nagyít be (`ease-out`, csak a fotón, ikonon nem). A szöveg 8 px-ről csúszik be és úszik be (250 ms).
- **Automatikus lejátszás:** csak akkor indul, ha a blokk látszik (`useLoopActive`), lépésenként 5 s, az 5. lépés után megáll (nem ismétlődik). Bármilyen kattintásra, húzásra vagy billentyűre végleg leáll.
- **Csökkentett mozgás** (`useReducedMotion`): nincs automatikus lejátszás, nagyítás és csúszás, a kép és a szöveg azonnal vált. A metszetrajz a végállapotban áll.
- Nincs `transition: all` olyan elemen, amit a Framer animál.

### 6. Hozzáférhetőség

- A lépéssor `role="tablist"`, a gombok `role="tab"` és `aria-selected`, a szöveges panel `role="tabpanel"`. Bal/jobb nyíllal lehet lépni, `Home`/`End` az első/utolsó lépés.
- Minden képnek magyar `alt` szövege van (mit mutat a lépés). A metszetrajz `role="img"` és `aria-label` (pl. „Metszet: a henger 10–15 cm mélyen a talajban”).
- Automatikus lejátszás közben az élő régió `aria-live="off"`, kézi lépésnél `polite`.

### 7. Teljesítmény

- Csak az 1. kép töltődik a blokk betöltésekor, a többi `loading="lazy"`. Amikor a blokk a nézet közelébe ér, a 2–4. kép előtöltődik, hogy a váltás ne villanjon.
- `sizes`: asztalon `(min-width: 1025px) 50vw`, telefonon `100vw`; telefonon a `-square`, asztalon a `-wide` kép jön (`getImageProps` + `<picture>`, mint a `home/Hero`-ban).
- Mivel a blokk a `/kutatas` elején, a Módszertanban van, a változás után mobil TBT-t kell mérni (`perf.js`).

## Fájlok

`src/components/experiment/pages/BulkDensityMethodPage.tsx` + `.module.css` (új), `src/components/experiment/pages/BulkDensityDiagram.tsx` (új), `src/components/experiment/sections/MethodologySection.tsx`, `src/components/experiment/ResearchScrollLayout.tsx` (menüpont), `src/lib/methodology.ts`, `public/images/kutatás_pics/Lakitelek/terfogattomeg/*` (8 kép), `scripts/images/grade-terfogattomeg.py`.

## Nyitott kérdések

- [x] Jóváhagyás: „mehet a 005” (2026-11-08).

## Kész, ha

- [ ] A `/kutatas?section=methodology-terfogattomeg` mélylink a blokkra ugrik, és a menüben ott van a „Térfogattömeg mérése” — `nav-check.js` zöld.
- [ ] 1440 px-en a kép és a jobb oldali szöveg egy képernyőn elfér (a blokk magassága ≤ 900 px); 390 px-en egy oszlop, a cím 20 px-ről indul — `layout-check.js` zöld.
- [ ] Mind az 5 lépés elérhető kattintással, koppintással, húzással (telefon) és nyilakkal; a lépésgombok ≥44 px — `touch-check.js`, `mobile-check.js` zöld.
- [ ] Csökkentett mozgásnál nincs automatikus lejátszás és nincs nagyítás/csúszás — `motion-check.js` zöld.
- [ ] Nincs 12 px alatti szöveg, a szövegtörzs ≥15 px — `type-check.js` zöld; nincs levágott szöveg 360/390/1440 px-en — `clip-check.js` zöld.
- [ ] A kidolgozott példa értéke a `lakitelekSoil2026` adatból jön (1,43 g/cm³), nincs beégetve.
- [ ] A 4 kép váltásakor a csavarhúzó nyele ±2 %-on belül ugyanott van (szemmel, képernyőképpel).
- [ ] Mobil TBT a `perf.js`-ben nem rosszabb 10 %-nál többel, mint előtte; CLS 0.
- [ ] `npx tsc --noEmit` és `npm run lint` hibamentes.
- [ ] Szemmel: képernyőkép 390 és 1440 px-en, mind az 5 lépésről.

## Eredmény

- Új: `BulkDensityMethodPage` (fotóváltó, laborkártya, magyarázó kártya, Újra), `BulkDensityDiagram` (SVG metszet), 8 egységesített fotó, `scripts/images/grade-terfogattomeg.py`; adat a `methodology.ts`-ben (a példa 1,43 g/cm³ a `lakitelekSoil2026`-ból számolva).
- Checker (11-08, a kártya előtti rácson): minden mérhető pont rendben; 1440 px-en 831 px magas blokk, 390 px-en egy oszlop 20 px-ről; lépésgombok ≥57 px; autoplay, Újra, lightbox, csökkentett mozgás rendben; type/clip/layout/mobile-check zöld; mobil TBT ~1783 ms, CLS 0. Nav-check: ismert Suspense-álriasztás + két zajos dev-szerveres menükésés, nem a blokk miatt.
- A magyarázó kártya után saját ellenőrzés: layout-, mobile-, type-, clip-check zöld; 1440 px-en a blokk 774 px; billentyű, húzás, Újra, lightbox rendben; `phoneHeight` 1130.
- Mobil színpad (11-08): 390 px-en fotó + rajz + lépéssor 535 px (egy képernyő); 768 px-en egymás mellett 274 px; a laborkártya sehol nem lóg ki; húzás a rajzon is léptet; layout-, mobile-, clip-check zöld; `phoneHeight` 940.
