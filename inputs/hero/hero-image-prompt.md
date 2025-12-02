# Hero Háttérkép - Képgenerálási Prompt

## Cél
Professzionális, modern mezőgazdasági háttérkép az Ásógép Kutatás weboldalhoz, amely vizuálisan kommunikálja a talajművelési innováció lényegét.

---

## Fő Prompt

```
A stunning aerial view of Hungarian agricultural farmland at golden hour, showing a dramatic contrast between two adjacent fields. On the left side, dry cracked compacted soil with struggling crops. On the right side, lush healthy green crops thriving in well-aerated loose soil. A modern red spading machine (Imants) is working on the border between the two fields, creating a clear visual transformation. Soft warm sunlight casting long shadows, dust particles floating in the air catching the light. Professional agricultural photography style, cinematic composition, ultra high resolution, 16:9 aspect ratio, shallow depth of field on the horizon.
```

---

## Alternatív Promptok

### Verzió A - Közelkép a talajra
```
Close-up macro photography of rich dark Hungarian soil being cultivated by a spading machine, showing the beautiful texture of freshly loosened earth. Visible soil layers, organic matter, and small roots. Golden hour lighting from the side creating dramatic shadows and highlights. Shallow depth of field, professional agricultural documentation style, warm earth tones, 16:9 cinematic crop.
```

### Verzió B - Panoráma tájkép
```
Breathtaking panoramic view of the Great Hungarian Plain (Alföld) at sunrise, vast agricultural fields stretching to the horizon. A lone modern farming machine working in the distance, creating a trail of freshly cultivated soil. Dramatic sky with soft clouds painted in orange and gold. Minimalist composition emphasizing the scale and beauty of sustainable farming. Professional landscape photography, ultra-wide angle, high dynamic range.
```

### Verzió C - Absztrakt talajrétegek
```
Artistic cross-section illustration of healthy soil layers, showing the difference between compacted and aerated soil. On one side: dense packed layers with shallow roots. On the other side: loose porous soil with deep thriving root systems. Scientific yet beautiful visualization, earth tones palette (browns, oranges, greens), subtle texture, modern infographic style with photorealistic elements, 16:9 format.
```

---

## Stílus Irányelvek

### Színpaletta
- **Domináns**: Meleg földszínek (barna, terrakotta, okker)
- **Kiegészítő**: Élénk zöld (egészséges növények)
- **Akcentus**: Arany napfény, kék ég
- **Kerülendő**: Túl telített színek, neon árnyalatok

### Hangulat
- Professzionális és megbízható
- Természetes és organikus
- Innovatív és modern
- Reményteli és pozitív

### Technikai követelmények
- **Felbontás**: Minimum 3840x2160 (4K)
- **Képarány**: 16:9 (hero szekció)
- **Formátum**: PNG vagy WebP (tömörítés nélkül)
- **Fájlméret**: Max 2-3 MB (optimalizálás után)

---

## Kompozíciós szempontok

### Szöveg elhelyezés
A kép bal oldalán vagy közepén legyen "lélegző" terület, ahol a hero szöveg (cím, alcím, statisztikák) jól olvasható lesz. A fő vizuális elem (gép, tájkép) inkább a jobb oldalon vagy a háttérben helyezkedjen el.

### Overlay kompatibilitás
A képnek működnie kell egy sötét gradient overlay-jel:
```css
background: linear-gradient(
  135deg,
  rgba(62, 39, 35, 0.85) 0%,
  rgba(62, 39, 35, 0.6) 50%,
  rgba(62, 39, 35, 0.4) 100%
);
```

### Reszponzív crop
- **Desktop**: Teljes szélesség, fókusz középen-jobbra
- **Tablet**: Közép crop, vertikálisabb
- **Mobil**: Felső harmad crop, ég és horizont

---

## Referencia képek leírása

1. **Professzionális mezőgazdasági fotók** - National Geographic stílus
2. **Modern farm gépek akcióban** - John Deere, CLAAS marketing anyagok
3. **Magyar Alföld tájképek** - Arany óra, végtelen horizontok
4. **Talaj textúra fotók** - Makró felvételek frissen művelt földről

---

## Negatív promptok (kerülendő elemek)

```
ugly, blurry, low quality, oversaturated, cartoon, illustration, drawing, painting, watermark, text, logo, people faces, animals, buildings, urban elements, winter, snow, rain, storm, night, dark, gloomy
```

---

## Felhasználás

A generált kép a weboldal Hero szekciójában jelenik meg háttérként:
- Teljes viewport szélesség
- Fix vagy parallax scroll effekt
- Overlay gradient a szöveg olvashatóságáért
- Lazy loading optimalizáció

A kép célja, hogy első pillantásra kommunikálja:
> "Ez egy professzionális kutatási projekt a modern, fenntartható talajművelésről"
