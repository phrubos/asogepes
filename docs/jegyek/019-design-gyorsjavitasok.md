# 019 · Design gyorsjavítások a „7 szabály” audit alapján

**Státusz:** kész · **Létrehozva:** 2026-11-11 · **Méret:** M

## Cél

Az oldal kinézete változatlan marad, de eltűnnek azok a hibák, amelyek „összerakott” hatást keltenek: gépenként más monospace betű, palettán kívüli színek (kék, rikító narancs/piros), angol címkék, angolos nagybetűzés, vegyes megszólítás, kétféle jelvény, szétesett hero-címek, általános marketing-pontok a 38SX-nél.

Forrás: UI/UX audit 2026-11-11 (a „7 things every good UI has” videó szempontjai szerint; összesítés: 69 betűméret, 45 lekerekítés, 75 árnyék, 328 beírt szín, a `--font-mono` nincs definiálva).

## Hatókör

1. **Monospace betű:** a `--font-mono` változó definiálása `next/font`-tal (JetBrains Mono, `app/layout.tsx`); a beégetett `'JetBrains Mono', 'SF Mono'` listák is erre mutatnak. Eddig 89 deklaráció a böngésző alapértelmezett monospace betűjét kapta (Windows: Consolas, Mac: Menlo/Courier).
2. **Szín, címke, nagybetűzés, megszólítás**
   - A 40SX címke kék helyett földszínt kap (`lib/technology-data.ts`, `solution-v2/HubFolder.module.css`); a STANDARD/HYBRID/DEEP címke magyar.
   - Az alkalmazási útmutató kékesszürke ikonja (`#5A7A8B`) földszín lesz (`solution-v2/ApplicationGuide.tsx`).
   - A /problema hero szalagjai a Material-sárga, -narancs és -piros helyett a palettából kapnak színt, megtartva a fokozást: arany → okker → terrakotta (`problem/sections/ProblemHeroSection.tsx`).
   - A magyar helyesírás szerint: „Műszaki adatok”, „Teljesítményigény”, „Főbb jellemzők”, „Öntözés és tömörödés”, „Fotó részletei”, a SEO-címben „Tudományos kutatás”. A márkanév („Ásógépes Talajművelés”) és a kezelésnevek („Lazítás + Ásógép”) maradnak.
   - Tegező megszólítás mindenhol: „Ismerd meg…”, „Válassz témát”.
3. **Egy jelvénystílus:** Inter, 0.75rem, 600-as vastagság, 0.1em ritkítás, nagybetű, arany. A monospace-es `PageBadge`, `ApplicationGuide .badge`, `OperationPrinciple .badge` is erre áll át. A monospace a számoké és a dátumoké marad.
4. **38SX „Főbb jellemzők”:** a meglévő tényekből (önállóan és szántás után is használták; Lakitelek 2025, ipari paradicsom, III. és VII. parcella). A csillagok maradnak (a 008 jegyben a megrendelőtől vár).
5. **Hero-címek:** a /problema és a /technologia `<h1>` 1280–1536 px-en 4 sorra esett szét (`el` / `a` egyedül). Asztalon két sor legyen, a betűméret az oszlop szélességéhez igazodjon.

Asztali és mobil nézet egyaránt (a betű, a szín és a szöveg mindkettőn látszik; a 5. pont csak asztali).

## Nem nyúlunk hozzá

- Az arany kiemelő szín mennyisége (2026-11-09-én kipróbálva és visszaállítva, a régi a jó).
- Az asztali, képernyő-magas blokkok (018: elvetve).
- A „Szerkezet tartóssága” csillagok (008, a megrendelőre vár).
- Tokenek összevonása (020), mozgás (021).

## Döntések

- 2026-11-11 (felhasználó): a megszólítás tegező (a táblán eddig „vár (döntésre)”).
- 2026-11-11 (felhasználó): a 38SX pontjai a meglévő adatokból készülnek, nem találunk ki gépadatot.
- 2026-11-11: a jelvény betűje az Inter (12 szabály már így szólt, 3 monospace-es volt).

## Nyitott kérdések

Nincs.

## Kész, ha

- [ ] A `--font-mono` definiálva van; 1440 px-en a /kutatas hónap-csipjein és a `PageBadge`-en a számolt betű JetBrains Mono, illetve Inter (`getComputedStyle`).
- [ ] Nincs kék vagy kékesszürke (`#6B7A8B`, `#4a5a6b`, `#5A7A8B`), illetve Material-sárga, -narancs és -piros (`#FDD835`, `#FB8C00`, `#E53935`) a `src/`-ben.
- [ ] Nincs látható „Standard / Hybrid / Deep”, „Műszaki Adatok”, „Teljesítmény Igény”, „Főbb Jellemzők”, „Ismerje”, „Válasszon” felirat.
- [ ] A jelvények (`PageBadge`, `pillBadge`, `headerBadge`, `ApplicationGuide`/`OperationPrinciple .badge`) számolt `font-family`-je azonos (Inter).
- [ ] A /problema és a /technologia `<h1>` 1280, 1366, 1440, 1536 és 1920 px-en pontosan 2 sor.
- [ ] `npx tsc --noEmit` és `npm run lint` hibamentes.
- [ ] `clip-check.js`, `type-check.js`, `layout-check.js` zöld (dev szerveren).
- [ ] Szemmel: képernyőkép 390 és 1440 px-en a három hero-ról és a 38SX kártyáról.

## Eredmény

Kész 2026-11-11, a `checker` két körben ellenőrizte a dev szerveren.

- **Betű:** a JetBrains Mono a `next/font`-ból jön (`--font-mono`, előtöltés nélkül). A /kutatas évcsipjei JetBrains Monóval, a jelvények Interrel jelennek meg.
- **Színek:** a 6 palettán kívüli kód 0-szor fordul elő a `src/`-ben. A 40SX címke agyagbarna, az útmutató 4. módja arany, a /problema szalagjai arany → okker → terrakotta.
- **Szöveg:** Alap / Kombinált / Mély, magyaros nagybetűzés. A „Standard / Hybrid / Deep”, a „Műszaki Adatok” és a magázó szövegek sehol nem jelennek meg. A tegezés a brand skillbe is bekerült.
- **Jelvények:** mind Inter, 600-as vastagság, 0.1em ritkítás (PageBadge, pillBadge, headerBadge, ApplicationGuide/OperationPrinciple).
- **38SX:** két tényszerű pont: „Önállóan és szántás után is használható”, és a lakiteleki 2025-ös vizsgálat (III. és VII. parcella). A csillagok a 008-ra várnak.
- **Hero-címek:** a betűméret a hasábhoz igazodik. /problema: `3.4vw` (1025–1279 px között `3vw`), `max-width` 520 px. /technologia: `3.15vw`.
  - A h1 1025, 1280, 1366, 1440, 1536, 1920 és 2560 px-en is 2 sor; előtte 1280–1536 px között 3–4 sor volt.
  - 1680 px fölött a betűméret változatlanul 56 px.
- **Ellenőrzés:** `tsc` és lint hibamentes, layout/type-check zöld.
  - A clip-check csak a /kutatas `FieldMapCard` térkép városfeliratain bukik („clipped-x by svg”). Ezt a jegy nem érintette, ismert hiba.
  - Képernyőképek 390 és 1440 px-en: a hero-k és a 38SX kártya rendben.
