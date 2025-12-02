# Oldal Navigáció és Vizuális Fejlesztések

## Áttekintés
Ez a feature három fő fejlesztést tartalmaz:
1. Oldalak közötti nyíl navigáció hover effekttel és lapozó animációval
2. Hero szekció háttérkép hozzáadása
3. Következmények infografika integrálása nagyítható modal-lal

---

## 1. Oldal Navigáció Nyilakkal

### Követelmények
- Bal és jobb oldali nyíl gombok az oldalak szélén
- A nyilak **csak hover-re jelennek meg** (fade in/out)
- Kattintásra **lapozó animációval** navigál a következő/előző oldalra
- Az oldalak sorrendje: Főoldal → Probléma → Megoldás → Kísérlet → Eredmények
- Az első oldalon nincs bal nyíl, az utolsón nincs jobb nyíl

### Animáció
- **Page transition**: Slide + fade effekt (Framer Motion)
- A kilépő oldal kiúszik az ellenkező irányba
- A belépő oldal beúszik a nyíl irányából
- Időtartam: 400-500ms, ease-out timing

### Design
- Nyíl ikon: Lucide `ChevronLeft` / `ChevronRight`
- Méret: 48x48px kör alakú gomb
- Háttér: félig átlátszó sötét/világos (oldal témától függően)
- Pozíció: vertikálisan középen, 20-40px távolságra a széltől

---

## 2. Hero Háttérkép

### Követelmények
- Professzionális mezőgazdasági/talaj témájú háttérkép
- A kép a Hero szekció teljes hátterét lefedi
- Overlay gradient a szöveg olvashatóságáért
- Reszponzív: különböző crop mobil/desktop nézethez

### Prompt fájl
- Részletes képgenerálási prompt készítése
- Mentés: `/inputs/hero/hero-image-prompt.md`

---

## 3. Következmények Infografika

### Követelmények
- A `következmény.png` kép beillesztése a Probléma oldalra
- Stílusos keret/kártya design
- **Kattintásra nagyítható** modal megnyitása
- Modal: teljes képernyős overlay sötét háttérrel
- Bezárás: X gomb, Escape billentyű, vagy háttérre kattintás

### Modal Design
- Háttér: rgba(0,0,0,0.9)
- Kép: max 90vw / 90vh, aspect ratio megtartva
- Bezáró gomb: jobb felső sarok
- Animáció: fade + scale in/out

---

## Technikai Megvalósítás

### Új komponensek
- `PageNavigation.tsx` - Nyíl navigáció wrapper
- `PageTransition.tsx` - Animált page wrapper
- `ImageModal.tsx` - Nagyítható kép modal
- `ConsequenceImage.tsx` - Infografika kártya

### Módosítandó fájlok
- `src/app/layout.tsx` - PageNavigation hozzáadása
- `src/app/problema/page.tsx` - Infografika beillesztése
- `src/components/home/Hero.tsx` - Háttérkép hozzáadása
- Minden page komponens - PageTransition wrapper

### Függőségek
- Framer Motion (már telepítve)
- Lucide React (már telepítve)
- next/image a képekhez
