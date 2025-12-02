# Probléma Oldal Tartalom Újratervezése - Implementációs Terv

## Összefoglaló

Ez a terv a Probléma oldal (`/problema`) teljes tartalom-újratervezését tartalmazza. A cél, hogy az oldal pontosan bemutassa a kutatás kontextusát (öntözéses kertészeti termesztés kihívásai) és előkészítse a látogatót a Megoldás → Kísérletek → Eredmények logikai folyamra.

## Fázisok Áttekintése

1. **Előkészítés és Adatgyűjtés** (~1 óra)
2. **data.ts Frissítése** (~30 perc)
3. **Tab 1 Implementáció** (~2 óra)
4. **Tab 2 Implementáció** (~1.5 óra)
5. **Vizuális Finomítás és Tesztelés** (~1 óra)

**Becsült összidő:** ~6 óra

---

## Fázis 1: Előkészítés és Adatgyűjtés

**Cél:** Összegyűjteni minden szükséges adatot és szöveget a szakdolgozatból, megtervezni az új tartalom struktúráját.

### 1.1 Szakdolgozat Adatok Kinyerése

- [ ] Penetrométer adatok gyűjtése
  - [ ] Szentkirály: 13. ábra (március: 35cm, június: 5cm)
  - [ ] Kecskemét: 15. ábra (május: 40cm, június: 35cm és 27cm)
  - [ ] Lakitelek: 9. ábra (I. parcella, VII. parcella értékek)

- [ ] Talajhőmérséklet adatok
  - [ ] Szentkirály: 14. ábra
  - [ ] Kecskemét: 16. ábra
  - [ ] Átlag hőmérséklet különbségek (2-4°C)

- [ ] Öntözési adatok
  - [ ] Kecskemét-Borbás: 400 mm, 5-6 nap (17. oldal, 3.1.9.1)
  - [ ] Szentkirály: 350 mm, 6-7 nap (17. oldal, 3.1.9.2)
  - [ ] Lakitelek: 450 mm, 4-5 nap (17. oldal, 3.1.9.3)

- [ ] Problémaleírások
  - [ ] Talajdegradáció (4. oldal, Bevezetés)
  - [ ] Forgatás hatásai (6-7. oldal, 2.3.2-2.3.3)
  - [ ] Biológiai élet károsodása (7. oldal)

### 1.2 Szövegek Megfogalmazása

- [ ] Tab 1 bevezető szöveg megírása (magyar)
- [ ] 3 kihívás kártya szövegének megírása
- [ ] Központi kérdés megfogalmazása
- [ ] Tab 2 consequence kártyák szövegeinek megírása
- [ ] Lezárás szövegének megírása

### 1.3 Backup Készítése

- [ ] Jelenlegi `src/app/problema/page.tsx` mentése
- [ ] Jelenlegi `src/lib/data.ts` (consequences rész) mentése
- [ ] Git commit: "backup: problema page before redesign"

---

## Fázis 2: data.ts Frissítése

**Cél:** Frissíteni a `src/lib/data.ts` fájlban a `consequences` adatstruktúrát az új tartalommal.

### 2.1 Consequences Adatstruktúra Módosítása

- [ ] Megnyitni `src/lib/data.ts`

- [ ] Új adatmezők hozzáadása:
```typescript
export const consequences = [
  {
    title: string,
    description: string,
    icon: string,
    dataBadge?: string,  // ÚJ: pl. "35cm → 5cm"
    source?: string       // ÚJ: pl. "Szakdolgozat 13. ábra"
  }
]
```

- [ ] Régi consequences tartalom cseréje:

**Kártya 1: Gyors tömörödés**
```typescript
- [ ] {
  title: 'Gyors tömörödés',
  description: 'Szántott talajon 30 nap alatt 20-50%-os szerkezetromlás intenzív öntözés mellett',
  icon: 'compress',
  dataBadge: 'Szentkirály: 35cm → 5cm',
  source: '13. ábra, 32. oldal'
}
```

**Kártya 2: Biológiai élet**
```typescript
- [ ] {
  title: 'Biológiai élet károsodása',
  description: 'A forgatás során az aerob és anaerob rétegek felcserélése károsítja a talajéletet',
  icon: 'activity',
  dataBadge: 'Széntartalom oxidálódása',
  source: '7. oldal'
}
```

**Kártya 3: Felmelegedés**
```typescript
- [ ] {
  title: 'Lassú tavaszi felmelegedés',
  description: 'Tömör talajszerkezet → késleltetett növényfejlődés. 2025 hideg tavaszán kritikus volt.',
  icon: 'thermometer',
  dataBadge: '2-4°C különbség',
  source: '14., 16. ábra'
}
```

**Kártya 4: Vízgazdálkodás**
```typescript
- [ ] {
  title: 'Nem egyenletes vízgazdálkodás',
  description: 'A tömör rétegek akadályozzák a víz egyenletes eloszlását a talajban',
  icon: 'droplet',
  dataBadge: 'Pangóvíz ÉS kiszáradás',
  source: '11., 17. ábra'
}
```

### 2.2 Tab 1 Új Adatstruktúra Létrehozása

- [ ] Új export létrehozása: `irrigationChallenges`

```typescript
- [ ] export const irrigationChallenges = [
  {
    title: 'Gyakori öntözés',
    description: 'Intenzív öntözéses kertészeti kultúrákban 4-7 naponként szükséges öntözés',
    icon: 'droplet',
    data: '4-7 naponta',
  },
  {
    title: 'Nagy gépek súlya',
    description: 'Nehéz öntözőgépek és traktorok taposása tömöríti a talajt',
    icon: 'weight',
    data: 'Folyamatos igénybevétel',
  },
  {
    title: 'Talajszerkezet romlása',
    description: 'A szerkezet fokozatosan romlik a termesztési ciklus során',
    icon: 'layers',
    data: '20-50% romlás',
  },
]
```

### 2.3 Statisztikák Exportálása

- [ ] Új export: `problemStatistics`

```typescript
- [ ] export const problemStatistics = {
  irrigation: {
    min: 350,
    max: 450,
    unit: 'mm',
    label: 'Öntözővíz / szezon',
  },
  frequency: {
    min: 4,
    max: 7,
    unit: 'nap',
    label: 'Öntözési gyakoriság',
  },
}
```

### 2.4 Mentés és Ellenőrzés

- [ ] Fájl mentése
- [ ] TypeScript hibák ellenőrzése
- [ ] Git commit: "feat: update data structure for problema page redesign"

---

## Fázis 3: Tab 1 Implementáció - "Öntözéses Termesztés Kihívása"

**Cél:** Az első tab teljes újraírása az új tartalommal.

### 3.1 Komponens Struktúra Előkészítése

- [ ] Megnyitni `src/app/problema/page.tsx`

- [ ] Import statements frissítése:
```typescript
- [ ] import { consequences, irrigationChallenges, problemStatistics } from '@/lib/data'
- [ ] import { Droplet, Weight, Layers, AlertTriangle } from 'lucide-react'
```

### 3.2 Statisztika Kiemelés Komponens

- [ ] A `problemContent` div-en belül új szekció:

```typescript
- [ ] <div className={styles.statHighlight}>
  <div className={styles.statNumber}>
    {problemStatistics.irrigation.min}-{problemStatistics.irrigation.max}
    <span className={styles.statUnit}>{problemStatistics.irrigation.unit}</span>
  </div>
  <div className={styles.statLabel}>
    {problemStatistics.irrigation.label}
  </div>
</div>
```

### 3.3 Bevezető Szöveg

- [ ] Statisztika után bevezető bekezdés:

```typescript
- [ ] <p className={styles.contextIntro}>
  Intenzív öntözéses kertészeti kultúrákban (paradicsom, hagyma)
  a talaj <strong>gyorsan tömörödik</strong> a nagy mennyiségű
  víz hatására. A kérdés: hogyan őrizzük meg a talaj kedvező
  szerkezetét a teljes termesztési ciklus alatt?
</p>
```

### 3.4 Kihívás Kártyák (3 db)

- [ ] PainGrid helyett új ChallengeGrid:

```typescript
- [ ] <div className={styles.challengeGrid}>
  {irrigationChallenges.map((challenge, index) => (
    <motion.div
      key={index}
      className={styles.challengeCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className={styles.challengeIcon}>
        {/* Icon komponens dinamikus renderelése */}
      </div>
      <h4 className={styles.challengeTitle}>{challenge.title}</h4>
      <p className={styles.challengeDescription}>{challenge.description}</p>
      <div className={styles.challengeData}>{challenge.data}</div>
    </motion.div>
  ))}
</div>
```

### 3.5 Központi Kérdés Kiemelés

- [ ] Kihívás kártyák után blockquote:

```typescript
- [ ] <blockquote className={styles.centralQuestion}>
  „A kérdés: Melyik művelési módszer tudja <strong>LEGJOBBAN</strong>
  megőrizni a talaj laza szerkezetét egy teljes termesztési ciklus alatt?"
</blockquote>
```

### 3.6 InteractiveSoil Megtartása

- [ ] Ellenőrizni, hogy a `<InteractiveSoil />` komponens a helyén van-e
- [ ] Ha szükséges, pozíció/elrendezés finomítása

### 3.7 CSS Stílusok Frissítése

- [ ] `src/components/problem/Problem.module.css` megnyitása

- [ ] Új stílusok hozzáadása:

```css
- [ ] .statHighlight {
  /* Stat kiemelés stílusok */
}

- [ ] .statNumber {
  /* Nagy szám stílusok */
}

- [ ] .statUnit {
  /* Mértékegység stílusok */
}

- [ ] .contextIntro {
  /* Bevezető szöveg stílusok */
}

- [ ] .challengeGrid {
  /* Grid layout 3 kártyához */
}

- [ ] .challengeCard {
  /* Kártya stílusok */
}

- [ ] .centralQuestion {
  /* Kérdés blockquote stílusok */
}
```

### 3.8 Responsivitás Ellenőrzése

- [ ] Mobile layout tesztelése (1 oszlop)
- [ ] Tablet layout tesztelése (2 oszlop)
- [ ] Desktop layout tesztelése (3 oszlop)

### 3.9 Mentés

- [ ] Git commit: "feat: implement Tab 1 redesign - irrigation challenges"

---

## Fázis 4: Tab 2 Implementáció - "Hagyományos Művelés Problémái"

**Cél:** A második tab frissítése az új consequence kártyákkal és lezárással.

### 4.1 ConsequenceCard Komponens Frissítése

- [ ] Megnyitni `src/components/problem/ConsequenceCard.tsx`

- [ ] Props interface kibővítése:

```typescript
- [ ] interface ConsequenceCardProps {
  title: string
  description: string
  icon: string
  dataBadge?: string  // ÚJ
  source?: string      // ÚJ
  index: number
}
```

- [ ] Render method frissítése:

```typescript
- [ ] {dataBadge && (
  <div className={styles.dataBadge}>
    {dataBadge}
  </div>
)}

- [ ] {source && (
  <div className={styles.source}>
    Forrás: {source}
  </div>
)}
```

### 4.2 ConsequenceCard Stílusok

- [ ] CSS fájl megnyitása (ha külön van)

- [ ] Új stílusok:

```css
- [ ] .dataBadge {
  /* Badge stílusok - narancssárga háttér */
}

- [ ] .source {
  /* Forrás hivatkozás - kis, light szöveg */
}
```

### 4.3 Icon Mapping Javítása

- [ ] `problema/page.tsx`-ban icon mapping:

```typescript
- [ ] const iconMap = {
  compress: Compress,
  activity: Activity,
  thermometer: Thermometer,
  droplet: Droplet,
  // ... stb
}

- [ ] const IconComponent = iconMap[consequence.icon as keyof typeof iconMap]
```

### 4.4 Lezárás Szekció Hozzáadása

- [ ] A `consequencesContent` div végén új szekció:

```typescript
- [ ] <div className={styles.problemConclusion}>
  <div className={styles.conclusionAlert}>
    <AlertTriangle size={24} color="#F57C00" />
    <p>
      <strong>Ezért kellett megvizsgálni:</strong> Különböző
      művelési módszerek (szántás, kultivátor, ásógép, lazítás)
      hogyan hatnak a talaj szerkezetének változására egy teljes
      termesztési ciklus alatt.
    </p>
  </div>

  <Link href="/megoldas" className={styles.conclusionCta}>
    <span>Tovább a megoldásra</span>
    <ArrowRight size={20} />
  </Link>
</div>
```

### 4.5 Lezárás Stílusok

- [ ] CSS hozzáadása:

```css
- [ ] .problemConclusion {
  /* Lezárás konténer */
}

- [ ] .conclusionAlert {
  /* Alert box - narancs border, light background */
}

- [ ] .conclusionCta {
  /* CTA gomb - zöld, hover effekt */
}
```

### 4.6 ConsequenceImage Frissítése (Opcionális)

- [ ] Megnyitni `src/components/problem/ConsequenceImage.tsx`
- [ ] Ellenőrizni, hogy releváns képet mutat-e
- [ ] Ha szükséges, lecserélni vagy eltávolítani

### 4.7 Tesztelés

- [ ] Tab váltás animáció működik
- [ ] Összes kártya megjelenik helyesen
- [ ] DataBadge-ek helyesen renderelődnek
- [ ] Lezárás szekció jól néz ki
- [ ] CTA link működik (átvisz a /megoldas oldalra)

### 4.8 Mentés

- [ ] Git commit: "feat: implement Tab 2 redesign - traditional methods problems"

---

## Fázis 5: Vizuális Finomítás és Tesztelés

**Cél:** Végső vizuális finomítások, animációk tökéletesítése, teljes tesztelés.

### 5.1 Animációk Finomítása

- [ ] Tab váltás animáció simításának ellenőrzése
- [ ] Kártyák stagger animációjának időzítése
- [ ] Hover effektek tesztelése minden interaktív elemen
- [ ] Loading állapot ellenőrzése (ha van)

### 5.2 Színek és Tipográfia

- [ ] Színkontrasztok ellenőrzése (WCAG AA megfelelés)
- [ ] Font méretek ellenőrzése minden breakpointon
- [ ] Spacing konzisztencia ellenőrzése
- [ ] Hover állapotok színeinek finomítása

### 5.3 Responsivitás Teljes Tesztelés

- [ ] iPhone SE (375px) - teljes interakció tesztelése
- [ ] iPhone 12 Pro (390px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1440px)
- [ ] Large Desktop (1920px)

### 5.4 Böngésző Kompatibilitás

- [ ] Chrome (legfrissebb)
- [ ] Firefox (legfrissebb)
- [ ] Safari (legfrissebb) - ha elérhető
- [ ] Edge (legfrissebb)

### 5.5 Teljesítmény Ellenőrzés

- [ ] Lighthouse audit futtatása
  - [ ] Performance > 90
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90

- [ ] Oldal betöltési idő < 2 másodperc
- [ ] Animációk 60 FPS-en futnak

### 5.6 Tartalom Ellenőrzés

- [ ] Helyesírás ellenőrzése minden szövegen
- [ ] Számok pontosságának ellenőrzése (visszacsatolás szakdolgozathoz)
- [ ] Linkek működésének ellenőrzése
- [ ] Meta adatok frissítése (title, description)

### 5.7 Kód Minőség

- [ ] TypeScript hibák ellenőrzése (`npm run type-check`)
- [ ] Lint hibák javítása (`npm run lint`)
- [ ] Unused imports eltávolítása
- [ ] Console.log-ok eltávolítása
- [ ] Kommentek eltávolítása/frissítése

### 5.8 Dokumentáció

- [ ] README.md frissítése (ha szükséges)
- [ ] Komponensek JSDoc kommentjeinek hozzáadása
- [ ] Data.ts adatstruktúrák dokumentálása

### 5.9 Végső Git Commit

- [ ] Staging: `git add .`
- [ ] Commit: `git commit -m "feat: complete problema page content redesign"`
- [ ] Push: `git push origin main` (vagy feature branch)

### 5.10 Deployment

- [ ] Build tesztelése: `npm run build`
- [ ] Build eredmény ellenőrzése
- [ ] Preview deploy (ha van)
- [ ] Production deploy

---

## Rollback Terv

Ha probléma merül fel:

1. [ ] Git revert használata az utolsó működő commit-ra
2. [ ] Backup fájlok visszaállítása (Fázis 1.3)
3. [ ] Dependencies tisztítása: `rm -rf node_modules && npm install`
4. [ ] Cache ürítése: `npm run clean` (ha van ilyen script)

---

## Következő Lépések (Scope-on kívül)

Ezek a feladatok NEM részei ennek az implementációnak, de jövőbeli fejlesztési lehetőségek:

- [ ] Animált átmenetek a többi oldalra (Megoldás, Kísérletek)
- [ ] Interaktív data vizualizációk (chartok) beépítése
- [ ] Kép galéria hozzáadása (szakdolgozat ábrák)
- [ ] Összehasonlító táblázatok (különböző művelési módszerek)
- [ ] Unit tesztek írása
- [ ] E2E tesztek írása (Playwright)
- [ ] A11y továbbfejlesztések (screen reader optimalizálás)
- [ ] Analytics integráció (user behavior tracking)

---

## Segítség és Erőforrások

- **Szakdolgozat PDF:** `inputs/Szakdolgozat végleges verzió.pdf`
- **Figma/Design fájlok:** (ha vannak)
- **Framer Motion docs:** https://www.framer.com/motion/
- **Lucide Icons:** https://lucide.dev/
- **Next.js docs:** https://nextjs.org/docs

---

**Kezdés dátuma:** _________________
**Befejezés dátuma:** _________________
**Implementáló:** _________________
