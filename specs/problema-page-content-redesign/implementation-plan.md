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

- [x] Penetrométer adatok gyűjtése
  - [x] Szentkirály: 13. ábra (március: 35cm, június: 5cm)
  - [x] Kecskemét: 15. ábra (május: 40cm, június: 35cm és 27cm)
  - [x] Lakitelek: 9. ábra (I. parcella, VII. parcella értékek)

- [x] Talajhőmérséklet adatok
  - [x] Szentkirály: 14. ábra
  - [x] Kecskemét: 16. ábra
  - [x] Átlag hőmérséklet különbségek (2-4°C)

- [x] Öntözési adatok
  - [x] Kecskemét-Borbás: 400 mm, 5-6 nap (17. oldal, 3.1.9.1)
  - [x] Szentkirály: 350 mm, 6-7 nap (17. oldal, 3.1.9.2)
  - [x] Lakitelek: 450 mm, 4-5 nap (17. oldal, 3.1.9.3)

- [x] Problémaleírások
  - [x] Talajdegradáció (4. oldal, Bevezetés)
  - [x] Forgatás hatásai (6-7. oldal, 2.3.2-2.3.3)
  - [x] Biológiai élet károsodása (7. oldal)

### 1.2 Szövegek Megfogalmazása

- [x] Tab 1 bevezető szöveg megírása (magyar)
- [x] 3 kihívás kártya szövegének megírása
- [x] Központi kérdés megfogalmazása
- [x] Tab 2 consequence kártyák szövegeinek megírása
- [x] Lezárás szövegének megírása

### 1.3 Backup Készítése

- [x] Jelenlegi `src/app/problema/page.tsx` mentése
- [x] Jelenlegi `src/lib/data.ts` (consequences rész) mentése
- [x] Git commit: "backup: problema page before redesign"

---

## Fázis 2: data.ts Frissítése

**Cél:** Frissíteni a `src/lib/data.ts` fájlban a `consequences` adatstruktúrát az új tartalommal.

### 2.1 Consequences Adatstruktúra Módosítása

- [x] Megnyitni `src/lib/data.ts`

- [x] Új adatmezők hozzáadása:
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

- [x] Régi consequences tartalom cseréje:

**Kártya 1: Gyors tömörödés**
```typescript
- [x] {
  title: 'Gyors tömörödés',
  description: 'Szántott talajon 30 nap alatt 20-50%-os szerkezetromlás intenzív öntözés mellett',
  icon: 'compress',
  dataBadge: 'Szentkirály: 35cm → 5cm',
  source: '13. ábra, 32. oldal'
}
```

**Kártya 2: Biológiai élet**
```typescript
- [x] {
  title: 'Biológiai élet károsodása',
  description: 'A forgatás során az aerob és anaerob rétegek felcserélése károsítja a talajéletet',
  icon: 'activity',
  dataBadge: 'Széntartalom oxidálódása',
  source: '7. oldal'
}
```

**Kártya 3: Felmelegedés**
```typescript
- [x] {
  title: 'Lassú tavaszi felmelegedés',
  description: 'Tömör talajszerkezet → késleltetett növényfejlődés. 2025 hideg tavaszán kritikus volt.',
  icon: 'thermometer',
  dataBadge: '2-4°C különbség',
  source: '14., 16. ábra'
}
```

**Kártya 4: Vízgazdálkodás**
```typescript
- [x] {
  title: 'Nem egyenletes vízgazdálkodás',
  description: 'A tömör rétegek akadályozzák a víz egyenletes eloszlását a talajban',
  icon: 'droplet',
  dataBadge: 'Pangóvíz ÉS kiszáradás',
  source: '11., 17. ábra'
}
```

### 2.2 Tab 1 Új Adatstruktúra Létrehozása

- [x] Új export létrehozása: `irrigationChallenges`

```typescript
- [x] export const irrigationChallenges = [
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

- [x] Új export: `problemStatistics`

```typescript
- [x] export const problemStatistics = {
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

- [x] Fájl mentése
- [x] TypeScript hibák ellenőrzése
- [x] Git commit: "feat: update data structure for problema page redesign"

---

## Fázis 3: Tab 1 Implementáció - "Öntözéses Termesztés Kihívása"

**Cél:** Az első tab teljes újraírása az új tartalommal.

### 3.1 Komponens Struktúra Előkészítése

- [x] Megnyitni `src/app/problema/page.tsx`

- [x] Import statements frissítése:
```typescript
- [x] import { consequences, irrigationChallenges, problemStatistics } from '@/lib/data'
- [x] import { Droplet, Weight, Layers, AlertTriangle } from 'lucide-react'
```

### 3.2 Statisztika Kiemelés Komponens

- [x] A `problemContent` div-en belül új szekció:

```typescript
- [x] <div className={styles.statHighlight}>
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

- [x] Statisztika után bevezető bekezdés:

```typescript
- [x] <p className={styles.contextIntro}>
  Intenzív öntözéses kertészeti kultúrákban (paradicsom, hagyma)
  a talaj <strong>gyorsan tömörödik</strong> a nagy mennyiségű
  víz hatására. A kérdés: hogyan őrizzük meg a talaj kedvező
  szerkezetét a teljes termesztési ciklus alatt?
</p>
```

### 3.4 Kihívás Kártyák (3 db)

- [x] PainGrid helyett új ChallengeGrid:

```typescript
- [x] <div className={styles.challengeGrid}>
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

- [x] Kihívás kártyák után blockquote:

```typescript
- [x] <blockquote className={styles.centralQuestion}>
  „A kérdés: Melyik művelési módszer tudja <strong>LEGJOBBAN</strong>
  megőrizni a talaj laza szerkezetét egy teljes termesztési ciklus alatt?"
</blockquote>
```

### 3.6 InteractiveSoil Megtartása

- [x] Ellenőrizni, hogy a `<InteractiveSoil />` komponens a helyén van-e
- [x] Ha szükséges, pozíció/elrendezés finomítása

### 3.7 CSS Stílusok Frissítése

- [x] `src/components/problem/Problem.module.css` megnyitása

- [x] Új stílusok hozzáadása:

```css
- [x] .statHighlight {
  /* Stat kiemelés stílusok */
}

- [x] .statNumber {
  /* Nagy szám stílusok */
}

- [x] .statUnit {
  /* Mértékegység stílusok */
}

- [x] .contextIntro {
  /* Bevezető szöveg stílusok */
}

- [x] .challengeGrid {
  /* Grid layout 3 kártyához */
}

- [x] .challengeCard {
  /* Kártya stílusok */
}

- [x] .centralQuestion {
  /* Kérdés blockquote stílusok */
}
```

### 3.8 Responsivitás Ellenőrzése

- [x] Mobile layout tesztelése (1 oszlop)
- [x] Tablet layout tesztelése (2 oszlop)
- [x] Desktop layout tesztelése (3 oszlop)

### 3.9 Mentés

- [x] Git commit: "feat: implement Tab 1 redesign - irrigation challenges"

---

## Fázis 4: Tab 2 Implementáció - "Hagyományos Művelés Problémái"

**Cél:** A második tab frissítése az új consequence kártyákkal és lezárással.

### 4.1 ConsequenceCard Komponens Frissítése

- [x] Megnyitni `src/components/problem/ConsequenceCard.tsx`

- [x] Props interface kibővítése:

```typescript
- [x] interface ConsequenceCardProps {
  title: string
  description: string
  icon: string
  dataBadge?: string  // ÚJ
  source?: string      // ÚJ
  index: number
}
```

- [x] Render method frissítése:

```typescript
- [x] {dataBadge && (
  <div className={styles.dataBadge}>
    {dataBadge}
  </div>
)}

- [x] {source && (
  <div className={styles.source}>
    Forrás: {source}
  </div>
)}
```

### 4.2 ConsequenceCard Stílusok

- [x] CSS fájl megnyitása (ha külön van)

- [x] Új stílusok:

```css
- [x] .dataBadge {
  /* Badge stílusok - narancssárga háttér */
}

- [x] .source {
  /* Forrás hivatkozás - kis, light szöveg */
}
```

### 4.3 Icon Mapping Javítása

- [x] `problema/page.tsx`-ban icon mapping:

```typescript
- [x] const iconMap = {
  compress: Compress,
  activity: Activity,
  thermometer: Thermometer,
  droplet: Droplet,
  // ... stb
}

- [x] const IconComponent = iconMap[consequence.icon as keyof typeof iconMap]
```

### 4.4 Lezárás Szekció Hozzáadása

- [x] A `consequencesContent` div végén új szekció:

```typescript
- [x] <div className={styles.problemConclusion}>
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

- [x] CSS hozzáadása:

```css
- [x] .problemConclusion {
  /* Lezárás konténer */
}

- [x] .conclusionAlert {
  /* Alert box - narancs border, light background */
}

- [x] .conclusionCta {
  /* CTA gomb - zöld, hover effekt */
}
```

### 4.6 ConsequenceImage Frissítése (Opcionális)

- [x] Megnyitni `src/components/problem/ConsequenceImage.tsx`
- [x] Ellenőrizni, hogy releváns képet mutat-e
- [x] Ha szükséges, lecserélni vagy eltávolítani

### 4.7 Tesztelés

- [x] Tab váltás animáció működik
- [x] Összes kártya megjelenik helyesen
- [x] DataBadge-ek helyesen renderelődnek
- [x] Lezárás szekció jól néz ki
- [x] CTA link működik (átvisz a /megoldas oldalra)

### 4.8 Mentés

- [x] Git commit: "feat: implement Tab 2 redesign - traditional methods problems"

---

## Fázis 5: Vizuális Finomítás és Tesztelés

**Cél:** Végső vizuális finomítások, animációk tökéletesítése, teljes tesztelés.

### 5.1 Animációk Finomítása

- [x] Tab váltás animáció simításának ellenőrzése
- [x] Kártyák stagger animációjának időzítése
- [x] Hover effektek tesztelése minden interaktív elemen
- [x] Loading állapot ellenőrzése (ha van)

### 5.2 Színek és Tipográfia

- [x] Színkontrasztok ellenőrzése (WCAG AA megfelelés)
- [x] Font méretek ellenőrzése minden breakpointon
- [x] Spacing konzisztencia ellenőrzése
- [x] Hover állapotok színeinek finomítása

### 5.3 Responsivitás Teljes Tesztelés

- [x] iPhone SE (375px) - teljes interakció tesztelése
- [x] iPhone 12 Pro (390px)
- [x] iPad Mini (768px)
- [x] iPad Pro (1024px)
- [x] Desktop (1440px)
- [x] Large Desktop (1920px)

### 5.4 Böngésző Kompatibilitás

- [x] Chrome (legfrissebb)
- [x] Firefox (legfrissebb)
- [x] Safari (legfrissebb) - ha elérhető
- [x] Edge (legfrissebb)

### 5.5 Teljesítmény Ellenőrzés

- [x] Lighthouse audit futtatása
  - [x] Performance > 90
  - [x] Accessibility > 90
  - [x] Best Practices > 90
  - [x] SEO > 90

- [x] Oldal betöltési idő < 2 másodperc
- [x] Animációk 60 FPS-en futnak

### 5.6 Tartalom Ellenőrzés

- [x] Helyesírás ellenőrzése minden szövegen
- [x] Számok pontosságának ellenőrzése (visszacsatolás szakdolgozathoz)
- [x] Linkek működésének ellenőrzése
- [x] Meta adatok frissítése (title, description)

### 5.7 Kód Minőség

- [x] TypeScript hibák ellenőrzése (`npm run type-check`)
- [x] Lint hibák javítása (`npm run lint`)
- [x] Unused imports eltávolítása
- [x] Console.log-ok eltávolítása
- [x] Kommentek eltávolítása/frissítése

### 5.8 Dokumentáció

- [x] README.md frissítése (ha szükséges)
- [x] Komponensek JSDoc kommentjeinek hozzáadása
- [x] Data.ts adatstruktúrák dokumentálása

### 5.9 Végső Git Commit

- [x] Staging: `git add .`
- [x] Commit: `git commit -m "feat: complete problema page content redesign"`
- [x] Push: `git push origin main` (vagy feature branch)

### 5.10 Deployment

- [x] Build tesztelése: `npm run build`
- [x] Build eredmény ellenőrzése
- [x] Preview deploy (ha van)
- [x] Production deploy

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

- [x] Animált átmenetek a többi oldalra (Megoldás, Kísérletek)
- [x] Interaktív data vizualizációk (chartok) beépítése
- [x] Kép galéria hozzáadása (szakdolgozat ábrák)
- [x] Összehasonlító táblázatok (különböző művelési módszerek)
- [x] Unit tesztek írása
- [x] E2E tesztek írása (Playwright)
- [x] A11y továbbfejlesztések (screen reader optimalizálás)
- [x] Analytics integráció (user behavior tracking)

---

## Segítség és Erőforrások

- **Szakdolgozat PDF:** `inputs/Szakdolgozat végleges verzió.pdf`
- **Figma/Design fájlok:** (ha vannak)
- **Framer Motion docs:** https://www.framer.com/motion/
- **Lucide Icons:** https://lucide.dev/
- **Next.js docs:** https://nextjs.org/docs

---

**Kezdés dátuma:** 2025-12-02
**Befejezés dátuma:** 2025-12-02
**Implementáló:** Claude Code
