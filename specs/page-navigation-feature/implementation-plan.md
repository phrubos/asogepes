# Implementációs Terv - Oldal Navigáció és Vizuális Fejlesztések

## Fázis 1: Alapkomponensek létrehozása

### 1.1 ImageModal komponens
- [x] `src/components/ui/ImageModal.tsx` létrehozása
- [x] `src/components/ui/ImageModal.module.css` stílusok
- [x] Fade + scale animáció Framer Motion-nel
- [x] Escape és háttér kattintás kezelés
- [x] Bezáró gomb (X ikon)

### 1.2 ConsequenceImage komponens
- [x] `src/components/problem/ConsequenceImage.tsx` létrehozása
- [x] Stílusos kártya design
- [x] Hover effekt (enyhe zoom + árnyék)
- [x] Kattintás kezelés modal megnyitáshoz

---

## Fázis 2: Következmény kép integrálása

### 2.1 Kép másolása
- [x] `következmény.png` másolása `public/images/` mappába

### 2.2 Probléma oldal módosítása
- [x] ConsequenceImage komponens importálása
- [x] Beillesztés a következmények szekció elé/után
- [x] Reszponzív elrendezés

---

## Fázis 3: Hero háttérkép előkészítése

### 3.1 Prompt készítése
- [x] `/inputs/hero/hero-image-prompt.md` létrehozása
- [x] Részletes leírás a képgeneráláshoz
- [x] Stílus és hangulat meghatározása

### 3.2 Hero komponens előkészítése
- [ ] Háttérkép placeholder hozzáadása
- [ ] Overlay gradient beállítása
- [ ] next/image integráció előkészítése

---

## Fázis 4: Oldal navigáció nyilak

### 4.1 PageNavigation komponens
- [x] `src/components/ui/PageNavigation.tsx` létrehozása
- [x] `src/components/ui/PageNavigation.module.css` stílusok
- [x] Bal/jobb nyíl gombok
- [x] Hover fade in/out animáció
- [x] Oldal sorrend logika

### 4.2 Layout integráció
- [x] PageNavigation hozzáadása a layout-hoz
- [x] usePathname() az aktuális oldal detektálásához
- [x] Dinamikus prev/next link generálás

---

## Fázis 5: Lapozó animáció

### 5.1 PageTransition komponens
- [x] `src/components/ui/PageTransition.tsx` létrehozása
- [x] Framer Motion AnimatePresence
- [x] Slide + fade animáció
- [x] Irány-érzékeny animáció (bal/jobb)

### 5.2 Oldalak módosítása
- [x] Minden page.tsx becsomagolása PageTransition-be
- [x] Template.tsx létrehozása az app mappában
- [x] Animáció finomhangolás

---

## Fázis 6: Tesztelés és finomítás

### 6.1 Funkcionális tesztelés
- [ ] Navigáció minden oldalon működik
- [ ] Modal megfelelően nyílik/záródik
- [ ] Animációk simák és konzisztensek

### 6.2 Reszponzív tesztelés
- [ ] Desktop nézet
- [ ] Tablet nézet
- [ ] Mobil nézet (nyilak elrejtése vagy kisebb méret)

---

## Fájl struktúra

```
src/
├── components/
│   ├── ui/
│   │   ├── ImageModal.tsx
│   │   ├── ImageModal.module.css
│   │   ├── PageNavigation.tsx
│   │   ├── PageNavigation.module.css
│   │   ├── PageTransition.tsx
│   │   └── PageTransition.module.css
│   └── problem/
│       ├── ConsequenceImage.tsx
│       └── ConsequenceImage.module.css
├── app/
│   └── template.tsx (page transitions)
public/
└── images/
    └── kovetkezmeny.png
inputs/
└── hero/
    └── hero-image-prompt.md
```
