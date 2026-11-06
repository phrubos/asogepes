# Jegyek és tábla

Nagyobb feladatokhoz (új funkció, új adat, animáció, több oldalt érintő átalakítás). Képernyőképes apró javításhoz nem kell jegy, ott a `ui-fix-from-screenshot` folyamat megy.

## Hogyan működik

1. **Ötlet** → felkerül a [`tabla.md`](tabla.md)-be egy sorral. Nem kell még jegy.
2. **Jegy** → ha dolgozni akarunk rajta, a `_sablon.md` alapján készül egy `NNN-rovid-nev.md` fájl. Claude kérdez, amíg minden nyitott kérdés el nem dől; a döntések a jegybe kerülnek.
3. **Kész a munkára** → ha a jegyben nincs nyitott kérdés, és a „Kész, ha” lista mérhető. Ezt te jelzed („mehet a 003”).
4. **Folyamatban** → Claude dolgozik rajta.
5. **Ellenőrzés** → a `checker` agent (`.claude/agents/checker.md`) friss kontextussal lefuttatja a QA-szkripteket a dev szerveren, és a „Kész, ha” lista minden pontját számmal igazolja vagy cáfolja.
6. **Kész** → a jegy alján egy rövid „Eredmény” rész (mi változott, mérések), a táblán a státusz frissül. Commit/push csak kérésre.

## Státuszok

`ötlet` · `vár` (rajtunk kívüli dologra: fotók, kutatói válasz) · `kész a munkára` · `folyamatban` · `kész`

## Párhuzamos munka

Csak akkor, ha a jegyek nem nyúlnak ugyanahhoz a fájlhoz (a `ScrollLayout`, a `globals.css` és a közös mobilszabályok szinte mindent érintenek). A tábla „Fájlok” oszlopa ezért van.
