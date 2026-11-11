# 021 · Mozgás finomítása: átmenet-tokenek, húzható tartalomjegyzék, gyorsabb zárás

**Státusz:** kész · **Létrehozva:** 2026-11-11 · **Méret:** M

## Cél

A mozgás „fizikai” legyen: onnan induljon, ahol a látogató hozzányúlt, és a zárás gyorsabb legyen a nyitásnál. Ma a Framer-oldal rendben van (egy fő görbe: `[0.22, 1, 0.36, 1]`, 26×), de a CSS-ben 107 különböző `transition` van, nagyrészt sima `ease`-zel, 4 helyen `transition: all`.

## Hatókör

- Átmenet-tokenek a `globals.css`-ben (`--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`, `--dur-fast: 150ms`, `--dur-base: 220ms`), és a CSS-modulok ezekre állnak át; a `transition: all` megszűnik.
- Telefonos tartalomjegyzék-lap (`shared/ScrollLayout/MobileSectionBar`): lefelé húzással zárható (drag + sebességküszöb); a zárás gyorsabb (~180 ms) a nyitásnál.
- Mobilmenü: a zárás gyorsabb a nyitásnál.
- A lenyíló és felugró elemek a gombjuk felől nyílnak (`transform-origin`).

## Nem nyúlunk hozzá

- A belépő animációk tartalma (017: `RevealBlock`), a `prefers-reduced-motion` viselkedés.

## Nyitott kérdések

- [ ] A tartalomjegyzék-lap felfelé húzva nyíljon-e teljes magasságra?

## Kész, ha

- [ ] `transition: all` 0 db a `src/`-ben; a CSS `transition` értékek ≤ 20 különböző.
- [ ] 390 px-en a tartalomjegyzék-lap 80 px-nél hosszabb vagy gyors lefelé húzásra bezárul; rövid húzásra visszaugrik.
- [ ] `motion-check.js` és `touch-check.js` zöld.

## Eredmény

Kész 2026-11-11, egy eltéréssel. A `checker` ellenőrizte a dev szerveren.

- **Tokenek** (`globals.css`): `--ease-out` (a Framer-görbe), `--dur-fast` 150 ms, `--dur-base` 250 ms, `--dur-slow` 400 ms. A `--transition-*` ezekre épül.
  - Kódátalakítással 41 CSS-modul, 129 deklaráció került át: 82 + 102 + 28 rész használja a három tokent.
- **`transition: all`:** 0 db. Mind az 5 a halott `experiment/BookLayout`-ban volt, ezt az `experiment/pages/HeroPage.tsx`-szel együtt töröltük.
- **Eltérés:** a különböző időzítések száma 104 → 28, a cél ≤ 20 volt.
  - A maradék a „Nem nyúlunk hozzá” alá eső koreográfia: belépők `var(--e)`-vel, 0,6–1,4 s-os és késleltetett megjelenések, vonalrajzolás, `visibility 0s`.
  - A ≤ 20-hoz ezeket is át kellene írni, ami láthatóan megváltoztatná a belépőket.
- **Tartalomjegyzék-lap:** a fejléc tapad, fogantyút kapott, és onnan húzható. 80 px-nél hosszabb vagy 500 px/s-nál gyorsabb húzásra bezárul; 40 és 79 px-es lassú húzásra visszaugrik.
  - A zárás 0,18 s, gyorsulva.
  - A lista görgetése, a bezárás gomb és a pontok koppintása változatlanul működik.
- **Mobilmenü:** a zárás 0,2 s, a menüpontok 0,12 s alatt, lépcsőzés nélkül tűnnek el (nyitáskor 0,4 s, lépcsőzve).
- **`transform-origin`:** nincs gombról nyíló felugró elem; a skálázó animációk belépők, ezért itt nem kellett módosítani.
- **Ellenőrzés:** motion/touch/layout/mobile/type-check zöld, `tsc` és lint hibamentes.
  - A clip-check csak az ismert /kutatas térképfeliratokon bukik.
