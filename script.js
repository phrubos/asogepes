/**
 * Ásógépes Talajművelés - Marketing Weboldal
 * JavaScript funkciók
 */

document.addEventListener('DOMContentLoaded', () => {
    initLocationTabs();
    initSmoothScroll();
    initScrollAnimations();
    initNavHighlight();
    initChartAnimations();
    initSoilInfographic();
});

/**
 * Helyszín fülek kezelése
 */
function initLocationTabs() {
    const tabs = document.querySelectorAll('.location-tab');
    const contents = document.querySelectorAll('.location-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetLocation = tab.dataset.location;

            // Aktív tab váltása
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Tartalom váltása
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetLocation) {
                    content.classList.add('active');
                    // Animáció újraindítása az új tartalomban
                    animateCharts(content);
                }
            });
        });
    });
}

/**
 * Smooth scroll navigációhoz
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-ra megjelenő animációk
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Ha chart container, animáljuk a chartokat
                if (entry.target.querySelector('.chart-bar') ||
                    entry.target.querySelector('.row-bar')) {
                    animateCharts(entry.target);
                }
            }
        });
    }, observerOptions);

    // Animálandó elemek
    const animatedElements = document.querySelectorAll(
        '.section-header, .problem-main, .problem-visual, .consequence-card, ' +
        '.solution-intro, .machine-showcase, .benefit, .type-card, ' +
        '.location-header, .treatment-comparison, .results-preview, ' +
        '.location-highlight, .lakitelek-parcels, .lakitelek-chart, ' +
        '.finding, .comparison-visual, .conclusion'
    );

    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

/**
 * Navigáció kiemelése görgetéskor
 */
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/**
 * Chart animációk
 */
function initChartAnimations() {
    // Kezdeti animáció az aktív tabhoz
    const activeContent = document.querySelector('.location-content.active');
    if (activeContent) {
        setTimeout(() => animateCharts(activeContent), 500);
    }
}

/**
 * Chartok animálása egy containeren belül
 */
function animateCharts(container) {
    // Oszlopos chartok
    const bars = container.querySelectorAll('.chart-bar');
    bars.forEach((bar, index) => {
        bar.style.setProperty('--delay', `${index * 0.1}s`);
        bar.classList.remove('animated');
        void bar.offsetWidth; // Force reflow
        bar.classList.add('animated');
    });

    // Vízszintes chartok (Lakitelek)
    const rowBars = container.querySelectorAll('.row-bar');
    rowBars.forEach((bar, index) => {
        bar.style.setProperty('--delay', `${index * 0.05}s`);
        bar.classList.remove('animated');
        void bar.offsetWidth; // Force reflow
        bar.classList.add('animated');
    });
}

/**
 * Navigáció háttérszín változtatása görgetéskor
 */
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

/**
 * Parallax effekt a hero szekcióban
 */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const scrolled = window.scrollY;
    const heroHeight = hero.offsetHeight;

    if (scrolled < heroHeight) {
        const parallaxValue = scrolled * 0.4;
        hero.style.setProperty('--parallax', `${parallaxValue}px`);
    }
});

/**
 * Számok animálása
 */
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number, .finding-number');

    numbers.forEach(num => {
        const target = parseInt(num.textContent);
        if (isNaN(target)) return;

        let current = 0;
        const increment = target / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            num.textContent = Math.floor(current).toString().padStart(2, '0');
        }, 30);
    });
}

// Intersection Observer a számok animálásához
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

/**
 * Interaktív talajréteg vizualizáció
 */
function initSoilInfographic() {
    const infographic = document.querySelector('.soil-infographic');
    const toggleBtn = document.getElementById('soilToggleBtn');
    const stateTitle = document.querySelector('.soil-state-title');
    const caption = document.getElementById('soilCaption');
    const btnText = toggleBtn?.querySelector('.btn-text');
    const aerobicDesc = document.querySelector('.soil-aerobic .layer-desc');
    const anaerobicDesc = document.querySelector('.soil-anaerobic .layer-desc');

    if (!infographic || !toggleBtn) return;

    let isPloughed = false;

    const texts = {
        natural: {
            title: 'Természetes állapot',
            button: 'Szántás',
            caption: 'Természetes állapot: egészséges talajélet, átjárható rétegek.',
            aerobicDesc: 'Élő, oxigéndús, morzsalékos.',
            anaerobicDesc: 'Tömör, oxigénszegény.'
        },
        ploughed: {
            title: 'Szántás után',
            button: 'Visszaállítás',
            caption: 'A szántás megfordítja a rétegeket: a biológiai élet elpusztul, vízzáró réteg keletkezik.',
            aerobicDesc: 'Eltemetve, oxigénhiányos.',
            anaerobicDesc: 'Felszínre kerülve kiszárad.'
        }
    };

    toggleBtn.addEventListener('click', () => {
        isPloughed = !isPloughed;

        infographic.classList.toggle('ploughed', isPloughed);

        const currentTexts = isPloughed ? texts.ploughed : texts.natural;

        stateTitle.textContent = currentTexts.title;
        btnText.textContent = currentTexts.button;
        caption.textContent = currentTexts.caption;

        // Frissítsük a leírásokat is
        if (aerobicDesc) aerobicDesc.textContent = currentTexts.aerobicDesc;
        if (anaerobicDesc) anaerobicDesc.textContent = currentTexts.anaerobicDesc;
    });
}
