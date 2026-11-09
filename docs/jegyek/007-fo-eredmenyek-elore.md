# 007 · Fő eredmények előre, lenyitható módszertan a /kutatas-on

**Státusz:** folyamatban · **Létrehozva:** 2026-11-09 · **Méret:** M

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

- [ ] 390 px-en a „Fő eredmények” címe a 2. képernyőn belül kezdődik (top < 2 × 844 px)
- [ ] 390 px-en a `/kutatas` legalább 2,5 képernyővel rövidebb (előtte 26,7 képernyő = 22 530 px)
- [ ] 390 px-en a három módszertani blokk zárva: cím + bevezető + 44 px magas „Részletek” gomb; koppintásra nyílik, `aria-expanded` vált
- [ ] `?section=methodology-terfogattomeg` telefonon a kinyitott blokkra ugrik; a mobil szekciósáv tartalomjegyzékéből ugyanígy
- [ ] 1440 px-en a módszertan változatlan (nincs „Részletek” gomb, minden blokk nyitva); a menüben „Fő eredmények” a Bevezető után
- [ ] `?section=osszegzes` a Fő eredmények szakaszra ugrik (390 és 1440 px)
- [ ] `npx tsc --noEmit` hibamentes (a `src/`-re)
- [ ] `layout-check`, `mobile-check`, `nav-check`, `clip-check` (a `/kutatas`-ra) zöld
- [ ] Szemmel: képernyőkép 390 és 1440 px-en

## Eredmény

(kitöltés a végén)
