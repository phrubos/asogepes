# 018 · Asztali fejezetritmus mindhárom tartalmi oldalon

**Státusz:** elvetve (visszaállítva) · **Létrehozva:** 2026-11-11 · **Méret:** M

## Cél

Asztalon a fejezetek közti térközt a szerkezet adja, ne a tartalom hossza: ne legyenek 400–800 px-es, változó üres sávok a /problema, /technologia és /kutatas fejezetei előtt.

## Hatókör

- Csak asztal (≥1025 px); a telefonos nézet (≤1024 px) változatlan.
- `shared/ScrollLayout/ScrollLayout.module.css`: csak a hero tölt ki egy képernyőt; a többi fejezet tartalommagas, nincs függőleges középre igazítás; fejezetek között kb. 200 px.
- `problem/ProblemNew.module.css`, `solution-v2/sections/sections.module.css`, `experiment/sections/sections.module.css`: a belső `scrollSection` / `combinedSection` 100vh-s minimuma és középre igazítása ki; alfejezetek között 96 px.
- `solution-v2/pages/ModelsCombinedPage.module.css`: a modellkártyák (38SX, 38WX, 40SX) nem képernyőnyiek.
- Utána (017, 2. lépés): /technologia egyszeri belépő.

## Nem nyúlunk hozzá

- A hero szekciók (egy képernyő marad), a blokkok belseje, színek, betűk.
- A /kutatas helyszínblokkjai (`CombinedPage .section`): a grafikonok kitöltik a magasságukat.

## Döntések

- 2026-11-11 (felhasználó): „igen csináld”: a 100vh-s kényszer ki asztalon, a térközt a szerkezet adja.

## Kész, ha

- [ ] 1440 px: fejezetek előtt nincs 300 px-nél nagyobb üres sáv a /problema és /technologia oldalon; a fejezetszünet nagyobb, mint az alfejezetek közti.
- [ ] A grafikonok, a 3D kép és a fotók magassága nem lesz 0 (1440 és 1366 px).
- [ ] `layout-check`, `mobile-check`, `nav-check`, `clip-check` zöld; telefonos térközök változatlanok.
- [ ] `npx tsc --noEmit` hibamentes; előtte–utána képek 1440 px-en.

## Eredmény

- 2026-11-11: kipróbálva, majd a felhasználó kérésére teljesen visszaállítva a 018 előtti állapotra.
- Mért javulás (1440 px): a fejezetek előtti üres sáv 650–790 px helyett 230–390 px lett, a grafikonok magassága nem változott.
- Miért nem jó így:
  - A képernyőnyi blokkok nélkül egy fejezet nem tölti ki a képernyőt, a következő fejezet alja belelóg (/problema, kultivátor).
  - Ugrás után kell még egyet görgetni, hogy a blokk jól álljon (öntözés és tömörödés).
  - /technologia: a 40SX-re kattintva a fölötte lévő 38WX adatai vibráltak a lap tetején.
- Tanulság: asztalon a blokkok képernyőnyiek, erre épül a navigáció és a `content-visibility`. A térközt ezen belül, blokkonként kell igazítani, nem a 100vh-s minimum kivételével.

