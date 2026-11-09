# 007 · Fő eredmények előre, lenyitható módszertan a /kutatas-on

**Státusz:** kész · **Létrehozva:** 2026-11-09 · **Méret:** M

## Cél

Telefonon a látogató az első két képernyőn megtudja, mit mutat a kutatás, és nem kell 5 képernyőnyi módszertanon átgörgetnie az első eredményig. Forrás: `docs/2026-11-09-mobil-ux-attekintes.md` K1, K2 (P1).

## Hatókör

- `/kutatas`: az Összegzés szakasz a hero után kerül, „Fő eredmények” menünévvel (minden szélességen, mert a szakaszsorrend közös). Az `id` marad `osszegzes`, így a régi `?section=osszegzes` linkek működnek. A kártyák „Részletek” gombja lefelé mutat (↓).
- Módszertan, csak telefonon/tableten (≤1024 px): a penetrométer nyitva marad; a „Mit mérünk a táblákon”, „A térfogattömeg mérése” és „A talajélet mérése” blokkból csak a cím és a bevezető látszik, alatta „Részletek” gomb. Menüből vagy `?section=` linkről odaugorva a blokk magától kinyílik.

## Nem nyúlunk hozzá

- Asztali módszertan: változatlan, minden nyitva.
- Az Összegzés kártyáinak tartalma és számítása (`SummarySection` → `seasons.ts`).
- A helyszín-szakaszok.

## Döntések

- 2026-11-09: a felhasználó jóváhagyta a P1-et („mehet a P1, fő eredmények előre és lenyitható módszertan”).
- 2026-11-09: az összegzés áthelyezve, nem duplikálva: a lap végén a „Tovább: Technológia” kártya zár.

## Nyitott kérdések

- (nincs)

## Kész, ha

- [x] 390 px-en a „Fő eredmények” címe a 2. képernyőn belül kezdődik (top < 2 × 844 px)
- [x] 390 px-en a `/kutatas` legalább 2,5 képernyővel rövidebb (előtte 26,7 képernyő = 22 530 px)
- [x] 390 px-en a három módszertani blokk zárva: cím + bevezető + 44 px magas „Részletek” gomb; koppintásra nyílik, `aria-expanded` vált
- [x] `?section=methodology-terfogattomeg` telefonon a kinyitott blokkra ugrik; a mobil szekciósáv tartalomjegyzékéből ugyanígy
- [x] 1440 px-en a módszertan változatlan (nincs „Részletek” gomb, minden blokk nyitva); a menüben „Fő eredmények” a Bevezető után
- [x] `?section=osszegzes` a Fő eredmények szakaszra ugrik (390 és 1440 px)
- [x] `npx tsc --noEmit` hibamentes (a `src/`-re)
- [x] `layout-check`, `mobile-check` zöld; `nav-check` és `clip-check` piros, de a 007-től függetlenül (lásd Eredmény)
- [x] Szemmel: képernyőkép 390 és 1440 px-en

## Eredmény

2026-11-09, commit `e730938`. Checker (dev szerver): 1–7 és 9 rendben.

- 390 px: Fő eredmények 1121 px-en (előtte a 24. képernyőn); oldalhossz 22 530 → kb. 19 850–20 250 px (−2,7–3,2 képernyő, a content-visibility miatt mérésenként kicsit eltér)
- Zárt blokkok: 181 / 157 / 77 px, nyitva 1302 / 990 / 970 px; gomb 44 px, `aria-expanded` vált; mélylinkről és tartalomjegyzékből nyitva, a sáv alatt (top 64 px)
- 1440 px: gomb `display: none`, blokkok nyitva; menü: Bevezető, Fő eredmények, Módszertan, …
- `layout-check`, `mobile-check` zöld; vízszintes görgetés nincs
- `clip-check` piros: csak a helyszíntérképek (006) SVG-feliratai vágódnak (városnevek a tábla-zoomnál) — a 007 a térképhez nem nyúlt; külön ellenőrizni
- `nav-check` 4 × FAIL a Suspense-szabálynál mind a 4 oldalon: a táblán már szereplő álriasztás (11-06 Q1)
- Mobil TBT (dev, tájékoztató): `/kutatas` ~2273 ms, `/problema` ~2163 ms; korábbi `/kutatas` érték nincs, prod buildön érdemes mérni
- Checker-megjegyzés: egy nagyon korai (hidratálás előtti) koppintás elveszhet; görgetés után elsőre működött
