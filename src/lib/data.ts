import type { PhotoItem } from '@/components/shared/PhotoViewer/PhotoViewer'

// Location data for the experiment section
export const locations = {
  szentkiraly: {
    name: 'Szentkirály',
    crop: 'Vöröshagyma (tavaszi)',
    soil: 'Réti csernozjom',
    ka: '28',
    irrigation: '350 mm (150 nap), dobbal',
    period: 'Március – Június',
    measurements: '4 alkalom',
    measurementLabel: 'Penetrométeres mérések száma',
    spade: {
      treatments: [
        'Őszi nehézkultivátor',
        'Tavaszi nehézkultivátor',
        '38WX ásógép (30 cm + 55 cm mélylazítás)',
      ],
    },
    control: {
      treatments: [
        'Őszi nehézkultivátor',
        'Tavaszi nehézkultivátor',
        'Kombinátor',
      ],
    },
    chartData: [
      { month: 'Március', spade: 37, control: 20 },
      { month: 'Április', spade: 33, control: 34 },
      { month: 'Május', spade: 34, control: 33 },
      { month: 'Június', spade: 11, control: 6 },
    ],
    temperatureData: {
      depth1cm: { spade: 17.3, control: 14.3 },
      depth5cm: { spade: 12.1, control: 9.8 },
    },
    evaluations: {
      control: 'A szerkezet egyenletlen, a kultivátorkapák között sekély a laza réteg, a 4. hónapra már 6 cm-től tömörödött a talaj.',
      spade: 'A laza talajszerkezet 3 hónapig stabil maradt, a 4. hónapra 11 cm mélységig még mindig optimális szerkezetű a talaj.',
      summary: 'A tenyészidő során az öntözés hatására erőteljesen tömörödik a talaj.',
    },
    highlight: {
      title: 'Látható különbség',
      text: 'A júniusi helyszíni bejáráson szemmel látható volt: az ásógépezett parcellán jelentősen kevesebb gyom fejlődött, mint a hagyományos művelésű területen.',
    },
    photos: [
      {
        src: '/images/kutatás_pics/Szentkirály/ernő_termal_0307_cut.jpeg',
        alt: 'Szentkirály Hőkamera - Március 7.',
        title: 'Márciusi Hőtérkép (03.07)',
        objectFit: 'contain',
        aspectRatio: '16/9',
        description: 'Hőkamerás felvétel az ásógépezés napjáról (dél körül). "A": Kombinátorozott kontroll (magasabb hőm.). "B": Friss ásógépezés (nedvesebb, hűvösebb). "C-D": Ásógépezés után ~1 órával a laza talaj gyorsan felmelegszik, eléri a kontroll hőmérsékletét. "E": Vetés után a bolygatott felszín újra hűvösebb.',
        overlays: {
          scale: {
            min: 5.0,
            max: 20.0,
            unit: '°C',
            position: 'left',
            gradient: 'linear-gradient(to top, #000000, #008080, #ffff00, #ff0000)'
          },
          points: [
            { x: 23, y: 38, label: 'A', value: 'átl. hőm. 18.5°C', alwaysVisible: true },
            { x: 29, y: 50, label: 'B', value: 'átl. hőm. 6.5°C', alwaysVisible: true },
            { x: 50, y: 50, label: 'C', value: 'átl. hőm. 15.8°C', alwaysVisible: true },
            { x: 83, y: 48, label: 'D', value: 'átl. hőm. 16.5°C', alwaysVisible: true },
            { x: 96, y: 60, label: 'E', value: 'átl. hőm. 10.1°C', alwaysVisible: true }
          ]
        },
        watermark: {
          lines: ['szoftver: Pix4D', 'fotó: DJI MAVIC 3 Thermal']
        }
      },
      {
        src: '/images/kutatás_pics/Szentkirály/erno_hagyma.jpg',
        alt: 'Szentkirály Hagyma',
        title: 'Június - Hagymaállomány',
        description: 'Az ábrán a jól fejlett hagyma állományt látjuk. A gépnyomtól balra az ásógépezett, jobbra a kontroll, kultivátorozott és kombinátorozott felület. Jól látszik, hogy az ásógépezés gyomszabályozó hatása sokkal erőteljesebb, a gyomírtószer hatóanyagának aktiválódásakor a magról kelő gyomok éppen optimális fejlettségi állapotban voltak.',
        type: 'image' as const
      }
    ] as PhotoItem[]
  },
  kecskemet: {
    name: 'Kecskemét-Borbás',
    crop: 'Ipari paradicsom',
    soil: 'Réti csernozjom',
    ka: '28',
    irrigation: '400 mm (120 nap), lineárral',
    period: 'Május – Június',
    measurements: '2 alkalom',
    measurementLabel: 'Penetrométeres mérések száma',
    spade: {
      treatments: [
        'Őszi szántás (28 cm)',
        'Simítózás',
        'Ásóborona',
        '40SX mélyásógép (45 cm)',
      ],
    },
    control: {
      treatments: [
        'Őszi szántás (28 cm)',
        'Simítózás',
        'Ásóborona',
      ],
    },
    chartData: [
      { month: 'Május', spade: 40, control: 33 },
      { month: 'Június', spade: 35, control: 29 },
    ],
    evaluations: {
      control: 'Az ásóborona hatása kedvező, de az optimálisan laza talajszerkezet mélysége mindkét hónapban elmaradt az ásógéppel elért eredménytől.',
      spade: 'Az optimálisan laza talajszerkezet 2 hónap után is 30 cm-t meghaladó mélységig maradt fent.',
      summary: 'A tenyészidő során az öntözés hatására erőteljesen tömörödik a talaj.',
    },
    highlight: {
      title: 'Szembetűnő növekedési különbség',
      text: 'A júniusi fotón jól látható: a kép bal oldalára eső sorok a kontroll, a középső és a tőle jobbra eső sorok az ásógépezett parcellán fejlődtek. A lombtömeg és a hajtáshossz átlagosan 20%-kal nagyobb az ásógépezett területen.',
    },
    photos: [
      {
        src: '/images/kutatás_pics/kecskemet_borbas/01_ortho_cut.jpeg',
        alt: 'Kecskemét Összehasonlítás',
        title: 'Ortofotó és Hőtérkép Összehasonlítás (05.16)',
        description: 'A képen szereplő, felső 11 m széles ásógépezve volt, az alatta lévő kontroll csak ásóboronázva. A drónos légifelvételen jól látszik, hogy a lazább szerkezetű, ásógépezett felület már felszáradt, mert gyorsabban felmelegedett, az alsó, kontroll sáv ugyanakkor még nedves.',
        type: 'comparison' as const,
        leftSrc: '/images/kutatás_pics/kecskemet_borbas/01_ortho_cut.jpeg',
        rightSrc: '/images/kutatás_pics/kecskemet_borbas/02_termal_cut.jpeg',
        leftLabel: 'Ortofotó',
        rightLabel: 'Hőkamera',
        overlays: {
          scale: {
            min: 11.7,
            max: 24.2,
            unit: '°C',
            gradient: 'linear-gradient(to top, #000000, #008080, #ffff00, #ff0000)'
          },
          points: [
            { x: 30, y: 75, label: 'Kontroll (ásóborona)', value: 'átl. hőmérséklet 13.2°C', alwaysVisible: true },
            { x: 55, y: 25, label: 'Ásógépezett (Imants - 40SX)', value: 'átl. hőmérséklet 20.1°C', alwaysVisible: true }
          ]
        },
        leftOverlays: {},
        watermark: {
          lines: ['szoftver: Pix4D', 'fotó: DJI MAVIC 3 Thermal']
        }
      },
      {
        src: '/images/kutatás_pics/kecskemet_borbas/ásógépezett_0619_cut_orto.jpeg',
        alt: 'Kecskemét Összehasonlítás 2',
        title: 'Ortofotó és TGI index Összehasonlítás (06.19)',
        description: 'A képen szereplő felső 11 m széles felület ásógépezve volt, az alsó 11 m széles csak ásóboronázva. Mindkét parcellán 9 sor ipari paradicsom volt. Szemmel is jó látható, hogy a felső mezőben nagyobb a lombfelület borítottság mint az alsóban. Az alkalmazott térinformatikai szoftver szerint a kontroll mezőben 35,9%-os az ásógépezett mezőben 41,5%-os a levélfelület borítás. Látható tehát, hogy az ásógépezett területen gyorsabb ütemben fejlődnek a növények.',
        type: 'comparison' as const,
        leftSrc: '/images/kutatás_pics/kecskemet_borbas/ásógépezett_0619_cut_orto.jpeg',
        rightSrc: '/images/kutatás_pics/kecskemet_borbas/ásógépezett_0619_tgi_cut.jpeg',
        leftLabel: 'Ortofotó',
        rightLabel: 'TGI Index',
        overlays: {
          points: [
            { x: 50, y: 25, label: 'Ásógépezett (9 sor)', value: 'levélfelület borítás: 41,5%', hideRing: true, alwaysVisible: true },
            { x: 50, y: 75, label: 'Kontroll (9 sor)', value: 'levélfelület borítás: 35,9%', hideRing: true, alwaysVisible: true }
          ],
          lines: [{ y: 50, alwaysVisible: true }]
        },
        leftOverlays: {},
        watermark: {
          lines: ['szoftver: Pix4D', 'fotó: DJI MAVIC 3 Thermal']
        }
      },
      {
        src: '/images/kutatás_pics/kecskemet_borbas/paradicsom_sáringer.webp',
        alt: 'Kecskemét Paradicsom Állapot',
        title: 'Paradicsom állapot (06.19)',
        description: 'A júniusi fotón jól látható: a kép bal oldalára eső sorok a kontroll, a középső és a tőle jobbra eső sorok az ásógépezett parcellán fejlődtek. A lombtömeg és a hajtáshossz átlagosan 15%-kal nagyobb az ásógépezett területen.',
        type: 'comparison' as const,
        leftSrc: '/images/kutatás_pics/kecskemet_borbas/paradicsom_sáringer.webp',
        rightSrc: '/images/kutatás_pics/kecskemet_borbas/paradicsom_sáringer.webp',
        leftLabel: 'Kontroll',
        rightLabel: 'Ásógépezett',
        overlays: {
          verticalLines: [
            { x: 50, style: 'dashed' as const }
          ],
          arrows: [
            {
              x: 37,
              y: 25,
              direction: 'left' as const,
              label: 'Kontroll'
            },
            {
              x: 67,
              y: 25,
              direction: 'right' as const,
              label: 'Ásógépezett',
              subLabel: 'Lombtömeg és hajtáshossz\nátlagosan +15%'
            }
          ]
        },
        leftOverlays: {}
      },
    ] as PhotoItem[]
  },
  lakitelek: {
    name: 'Lakitelek',
    crop: 'Ipari paradicsom',
    soil: 'Humuszos homok',
    ka: '27',
    irrigation: '450 mm (120 nap), lineárral',
    period: 'Május – Augusztus',
    measurements: '3 alkalom',
    measurementLabel: 'Penetrométeres mérések száma',
    treatmentCount: '7 különböző kombináció',
    parcels: [
      {
        num: 'I.',
        treatment: 'Mélyásógép',
        shortName: 'mély.ág',
        may: 31,
        jun: 35,
        aug: 32,
        rating: 95,
        description: 'A legmélyebben lazító és az egyik legtartósabb technológia.',
        good: true
      },
      {
        num: 'II.',
        treatment: 'Lazítás + Ásógép',
        shortName: 'laz+ág',
        may: 35,
        jun: 36,
        aug: 19,
        rating: 80,
        description: 'Kevésbé egyenletes és kevésbé tartós.',
        good: false
      },
      {
        num: 'III.',
        treatment: 'Ásógép',
        shortName: 'ág',
        may: 23,
        jun: 20,
        aug: 19,
        rating: 80,
        description: 'Egyenletes és tartós, de itt nem elég mély a lazított réteg.',
        good: true
      },
      {
        num: 'IV.',
        treatment: 'Lazítás + Szántás + Kombinátor',
        shortName: 'laz+sz+komb',
        may: 31,
        jun: 29,
        aug: 28,
        rating: 90,
        description: 'Egyenletes és tartós, a tömörödés üteme folyamatos.',
        good: true
      },
      {
        num: 'V.',
        treatment: 'Szántás + Kombinátor',
        shortName: 'sz+komb',
        may: 32,
        jun: 32,
        aug: 19,
        rating: 80,
        description: 'Egyenletes és megfelelően mély, de nem tartós.',
        good: false
      },
      {
        num: 'VI.',
        treatment: 'Lazítás + Szántás + Ásógép',
        shortName: 'laz+sz+ág',
        may: 36,
        jun: 30,
        aug: 30,
        rating: 95,
        description: 'Egyenletes, megfelelően mély és tartós.',
        good: true
      },
      {
        num: 'VII.',
        treatment: 'Szántás + Ásógép',
        shortName: 'sz+ág',
        may: 31,
        jun: 31,
        aug: 31,
        rating: 95,
        description: 'Egyenletes, megfelelően mély és tartós.',
        good: true
      },
    ],
    conclusions: {
      summary: 'Ezen a talajon önmagában csak a mélyásógép javasolható. A kombinációk közül a szántott és normál mélységben ásógépezett variációk bizonyultak a legtartósabbnak.',
      bestResults: ['I.', 'VI.', 'VII.'],
    },
    photos: [
      {
        src: '/images/kutatás_pics/Lakitelek/Lakitelek_0502_orto.jpeg',
        alt: 'Ortofotó és Hőtérkép Összehasonlítás (05.02)',
        title: 'Ortofotó és Hőtérkép Összehasonlítás (05.02)',
        description: 'A fotó közvetlenül a talajművelési kombinációk befejezése után készült.',
        type: 'comparison' as const,
        leftSrc: '/images/kutatás_pics/Lakitelek/Lakitelek_0502_orto.jpeg',
        rightSrc: '/images/kutatás_pics/Lakitelek/Lakitelek_0502_otermal.jpeg',
        leftLabel: 'Ortofotó',
        rightLabel: 'Hőtérkép',
        leftDescription: 'A fotó közvetlenül a talajművelési kombinációk befejezése után készült. A II. és III.-es parcella felülete ásógépezett, a IV.-es V.-ös parcellák ásógép nélküliek. Az ábrán jól látszik, hogy az ásógépezett felület homogén, felszíne rögös, szabályosan csipkézett, a légifotón kifejezetten szerkezetesnek tűnik. A nem ásógépezett felület heterogén, szerkezet nélküli, a homok talaj felülete, szél által befújt, sima, a homokszemek a talaj felületén a szél hatására elmozudltak.',
        rightDescription: 'Ugyanezen 4 kezelés hőtérképén jól látszik, h az ásógépezett talajfelszín hőmérséklete homogén, egyenletes, hőmérséklete a nem ásógépezet felülethez képest alacsonyabb, mivel ez a felület nedvesebb. A nem ásógépezett felület hőmérséklete heterogén, a felület több helyen száraz, ezeken a foltokon gyorsabban melegszik fel.',
        overlays: {
          scale: {
            min: 11.0,
            max: 24.0,
            unit: '°C',
            gradient: 'linear-gradient(to top, #000000, #008080, #ffff00, #ff0000)'
          },
          points: [
            { x: 5, y: 25, label: 'I.', value: '', hideRing: true, alwaysVisible: true },
            { x: 28, y: 40, label: 'II. - III.', value: '', hideRing: true, alwaysVisible: true },
            { x: 55, y: 55, label: 'IV. - V.', value: '', hideRing: true, alwaysVisible: true },
            { x: 80, y: 70, label: 'VI. - VII.', value: '', hideRing: true, alwaysVisible: true },
            { x: 8, y: 50, label: 'Ásógépezett felület (átl.)', value: '16.8°C' },
            { x: 30, y: 70, label: 'Vízborított / Nedves talaj', value: '12.0°C' },
            { x: 55, y: 15, label: 'Száraz, szerkezet nélküli homok', value: '20.2°C' },
          ],
          lines: [
            { y: 32, xStart: 0, xEnd: 17, color: '#d4a84b', alwaysVisible: true },
            { y: 45, xStart: 17, xEnd: 40, color: '#d4a84b', alwaysVisible: true },
            { y: 61, xStart: 40, xEnd: 68, color: '#d4a84b', alwaysVisible: true },
            { y: 73, xStart: 68, xEnd: 100, color: '#d4a84b', alwaysVisible: true },
          ]
        },
        leftOverlays: {},
        watermark: {
          lines: ['szoftver: Pix4D', 'fotó: DJI MAVIC 3 Thermal']
        }
      }
    ] as PhotoItem[]
  },
}

// Key findings for results section
export const findings = [
  {
    number: '01',
    title: 'Tartósabb lazaság',
    text: 'Az ásógépezett parcellák 5-10 cm-rel mélyebben maradtak lazák a teljes tenyészidőszak alatt, még 400-450 mm öntözővíz kijuttatása után is.',
  },
  {
    number: '02',
    title: 'Gyorsabb felmelegedés',
    text: 'A tavaszi mérések során az ásógépezett talaj 2-4°C-kal melegebb volt — a 2025-ös hideg tavasz miatt ez különösen fontos volt.',
  },
  {
    number: '03',
    title: 'Jobb vízgazdálkodás',
    text: 'Az ásógépezett parcellákban a víz egyenletesebben oszlott el a talajszelvényben, mélyebb rétegekbe is lejutott.',
  },
  {
    number: '04',
    title: 'Látható növényfejlődés',
    text: 'A paradicsom és hagyma állományok szemmel láthatóan fejlettebbek voltak az ásógépezett területeken.',
  },
]

// Hero statistics
export const heroStats = [
  { number: '3', label: 'Helyszín', sublabel: 'Szentkirály · Kecskemét · Lakitelek' },
  { number: '9', label: 'Kezelés kombináció', sublabel: 'Különböző művelési módok' },
  { number: '6', label: 'Hónap', sublabel: 'Március – Augusztus' },
]

// Tab 1: A Tömörödés Problémája
export const compactionChallenges = [
  {
    title: 'Gyakori öntözés hatása',
    description: 'Ennyi öntözővizet kell a talajfelszínnek elnyelnie és mélyebbre szivárogtatnia egy öntözési szezonban, bármely átlagos kertészeti kultúrában.',
    icon: 'droplet',
  },
  {
    title: 'Szerkezetromlás üteme',
    description: 'A tárcsázott vagy kombinátorozott talajon már 30 nap alatt jelentős szerkezetromlás mérhető intenzív öntözés mellett.',
    icon: 'arrow-down-narrow-wide',
  },
]

// Tab 2: Miért nem elég a szántás?
export const ploughingProblems = [
  {
    title: 'Eketalp képződés',
    description: 'A szántás 25-30 cm mélységben tömör réteget (eketalpat) gyúr, ami akadályozza a gyökerek és a víz mélyebb behatolását.',
    icon: 'arrow-down-to-line',
    dataBadge: '20+ bar nyomás',
    source: 'Szakdolgozat 7. oldal',
  },
  {
    title: 'Rétegek felcserélése',
    description: 'A forgatás során az aerob (oxigéndús) és anaerob (oxigénszegény) rétegek felcserélődnek, ami károsítja a talajéletet.',
    icon: 'shuffle',
    dataBadge: 'Talajélet károsodás',
    source: 'Szakdolgozat 7. oldal',
  },
  {
    title: 'Széntartalom oxidálódása',
    description: 'A forgatás hatására a mélyebb rétegek szerves anyaga a felszínre kerül és gyorsabban oxidálódik, csökkentve a humusztartalmat.',
    icon: 'trending-up',
    dataBadge: 'Humusz veszteség',
    source: 'Szakdolgozat 7. oldal',
  },
  {
    title: 'Rögösebb talajfelszín és lassabb felmelegedés',
    description: 'A rögösebb és nehezebben elmunkálható talajfelszín megnehezíti a precíz magvetést és palántaültetést, ezen felül tavasszal lassabban és egyenetlenül melegszik fel az ilyen talajfelszín, lassítva a vetett vagy ültetett kultúrnövények csírázását, kezdeti vegetatív fejlődését.',
    icon: 'thermometer',
    dataBadge: '2-4°C különbség',
    source: '14., 16. ábra',
  },
]

// Legacy alias for backward compatibility
export const irrigationChallenges = compactionChallenges

// Problem statistics
export const problemStatistics = {
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

// Consequences data
export const consequences = [
  {
    title: 'Gyors tömörödés',
    description: 'Szántott talajon 30 nap alatt 20-50%-os szerkezetromlás intenzív öntözés mellett',
    icon: 'compress',
    dataBadge: 'Szentkirály: 35cm → 5cm',
    source: '13. ábra, 32. oldal',
  },
  {
    title: 'Biológiai élet károsodása',
    description: 'A forgatás során az aerob és anaerob rétegek felcserélése károsítja a talajéletet',
    icon: 'activity',
    dataBadge: 'Széntartalom oxidálódása',
    source: '7. oldal',
  },
  {
    title: 'Lassú tavaszi felmelegedés',
    description: 'Tömör talajszerkezet → késleltetett növényfejlődés. 2025 hideg tavaszán kritikus volt.',
    icon: 'thermometer',
    dataBadge: '2-4°C különbség',
    source: '14., 16. ábra',
  },
  {
    title: 'Nem egyenletes vízgazdálkodás',
    description: 'A tömör rétegek akadályozzák a víz egyenletes eloszlását a talajban',
    icon: 'droplet',
    dataBadge: 'Pangóvíz ÉS kiszáradás',
    source: '11., 17. ábra',
  },
]

// Benefits data
export const benefits = [
  { title: 'Nincs eketalp', description: 'Nem gyúr tömör réteget a művelt zóna alá' },
  { title: 'Megmarad a talajélet', description: 'A mikroorganizmusok a helyükön maradnak' },
  { title: 'Gyorsabb felmelegedés', description: 'Nagyobb pórustérfogat = jobb hővezetés' },
  { title: 'Egyenletes felszín', description: 'Nincs barázda, azonnal vethető' },
]

// Machine types
export const machineTypes = [
  { badge: 'Nagy szériás', name: '38SX', depth: '15-35 cm munkamélység', featured: false },
  { badge: 'Lazítókéses', name: '38WX', depth: '35 cm + 55 cm lazítás', featured: false },
  { badge: 'Mélyásógép', name: '40SX', depth: '20-50 cm munkamélység', featured: true },
]

// Alkalmazási módok - ásógép önmagában vs. kombinációban
export const applicationModes = [
  {
    id: 'solo',
    title: 'Önálló ásógép',
    description: 'Csak ásógéppel végzett művelés, más eszköz nélkül',
    when: 'Jó szerkezetű, nem túl tömör talajokon',
    depth: '30-45 cm',
    result: 'Stabil lazaság (-2 cm változás)',
    examples: ['Lakitelek I. parcella (Mélyásógép)', 'Lakitelek III. parcella (Ásógép 30cm)'],
    rating: 4,
    icon: 'spade',
  },
  {
    id: 'with-loosening',
    title: 'Lazítás + Ásógép',
    description: 'Előzetes mélylazítás után ásógépes művelés',
    when: 'Nagyon tömör, mély eketalpas talajokon',
    depth: '55 cm lazítás + 30 cm ásógép',
    result: 'Nagyobb kezdeti lazaság, de gyorsabb tömörödés (-7 cm)',
    examples: ['Lakitelek II. parcella', 'Szentkirály 38WX kezelés'],
    rating: 3,
    icon: 'layers',
  },
  {
    id: 'with-ploughing',
    title: 'Szántás + Ásógép',
    description: 'Őszi szántás után tavaszi ásógépes művelés',
    when: 'Hagyományos gazdálkodásba illeszkedve',
    depth: '28 cm szántás + 25 cm ásógép',
    result: 'Legjobb stabilitás (-1 cm változás)',
    examples: ['Lakitelek VII. parcella', 'Kecskemét-Borbás kezelés'],
    rating: 5,
    icon: 'combine',
  },
]

// Összehasonlító táblázat a kísérletekből
export const treatmentComparison = [
  { treatment: 'Mélyásógép (40 cm)', initial: 33, final: 31, change: -2, stable: true },
  { treatment: 'Ásógép (30 cm)', initial: 22, final: 20, change: -2, stable: true },
  { treatment: 'Szántás + Ásógép', initial: 32, final: 31, change: -1, stable: true },
  { treatment: 'Lazítás + Ásógép', initial: 35, final: 28, change: -7, stable: false },
  { treatment: 'Lazítás + Szántás + Kombinátor', initial: 35, final: 28, change: -7, stable: false },
  { treatment: 'Csak szántás + Kombinátor', initial: 28, final: 32, change: 4, stable: true },
]

// Model details for the Solution page - organized by machine model
export const modelDetails = {
  '38sx': {
    id: '38sx',
    name: '38SX',
    type: 'Nagy szériás',
    typeEn: 'Standard Spader',
    image: '/images/38SX_new.jpeg',
    specs: {
      depth: '15-35 cm',
      power: '90-150 LE',
      features: ['Kompakt felépítés', 'Költséghatékony', 'Könnyű karbantartás']
    },
    fieldApplication: {
      location: 'Lakitelek',
      parcels: 'III., VII. parcella',
      crop: 'Ipari paradicsom',
      soil: 'Humuszos homok',
      ka: '27',
      irrigation: '450 mm',
      period: 'Május – Augusztus',
      treatments: [
        {
          parcel: 'III.',
          description: 'Ásógép (30 cm) önállóan',
          initial: 22,
          final: 20,
          change: -2,
          stable: true,
          best: false
        },
        {
          parcel: 'VII.',
          description: 'Szántás + Ásógép (25 cm)',
          initial: 32,
          final: 31,
          change: -1,
          stable: true,
          best: true
        }
      ],
      highlight: {
        title: 'Legjobb stabilitás',
        text: 'A szántás + ásógép kombináció (VII. parcella) adta a legjobb stabilitást (-1 cm változás), míg az önálló ásógép is kiváló eredményt hozott.'
      }
    }
  },
  '38wx': {
    id: '38wx',
    name: '38WX',
    type: 'Lazítókéses',
    typeEn: 'Spader with Subsoiler',
    image: '/images/38WX_new.jpeg',
    specs: {
      depth: '15-35 cm + 55 cm mélylazítás',
      power: '90-150 LE',
      features: ['Altalaj lazítás és ásógépezés egy menetben', 'Duplarotoros kivitelben is elérhető', 'Hidraulikus akkumulátor a precízebb talajkövetés érdekében']
    },
    fieldApplication: {
      location: 'Szentkirály',
      crop: 'Vöröshagyma',
      soil: 'Réti csernozjom',
      ka: '28',
      irrigation: '350 mm (150 nap)',
      period: 'Március – Június',
      measurements: '4 alkalom',
      spadeTreatments: [
        'Őszi nehézkultivátor',
        'Tavaszi nehézkultivátor',
        '38WX ásógép (30 cm + 55 cm mélylazítás)'
      ],
      controlTreatments: [
        'Őszi nehézkultivátor',
        'Tavaszi nehézkultivátor',
        'Kombinátor'
      ],
      chartData: [
        { month: 'Március', spade: 37, control: 20 },
        { month: 'Április', spade: 33, control: 34 },
        { month: 'Május', spade: 34, control: 33 },
        { month: 'Június', spade: 11, control: 6 }
      ],
      highlight: {
        title: 'Látható különbség',
        text: 'A júniusi helyszíni bejáráson szemmel látható volt: az ásógépezett parcellán jelentősen kevesebb gyom fejlődött, mint a hagyományos művelésű területen.'
      }
    }
  },
  '40sx': {
    id: '40sx',
    name: '40SX',
    type: 'Mélyásógép',
    typeEn: 'Heavy Duty Spader',
    image: '/images/40SX_new.jpeg',
    specs: {
      depth: '20-50 cm',
      power: '110-160 LE',
      features: ['Egyenletes lazítás 50 cm mélységig', 'Duplarotoros kivitelben is elérhető', 'Kifejezetten kertészeti kultúrák számára fejlesztve (mély magágy)']
    },
    fieldApplication: {
      locations: [
        {
          name: 'Kecskemét-Borbás',
          crop: 'Ipari paradicsom',
          soil: 'Réti csernozjom',
          ka: '28',
          irrigation: '400 mm (120 nap)',
          period: 'Május – Június',
          spadeTreatments: [
            'Őszi szántás (28 cm)',
            'Simítózás',
            'Ásóborona',
            '40SX mélyásógép (45 cm)'
          ],
          chartData: [
            { month: 'Május', spade: 40, control: 33 },
            { month: 'Június', spade: 35, control: 29 }
          ],
          callout: {
            number: '6 cm',
            text: 'különbség júniusban az ásógépezett parcella javára'
          }
        },
        {
          name: 'Lakitelek I. parcella',
          crop: 'Ipari paradicsom',
          soil: 'Humuszos homok',
          ka: '27',
          irrigation: '450 mm',
          period: 'Május – Augusztus',
          treatment: 'Mélyásógép (40 cm) önállóan',
          initial: 33,
          final: 31,
          change: -2,
          stable: true
        }
      ],
      highlight: {
        title: 'Szembetűnő növekedési különbség',
        text: 'A júniusi fotón jól látható: az ásógépezett sorok paradicsomjai nagyobbak és fejlettebbek, mint a hagyományos művelésű terület növényei.'
      }
    }
  }
}
