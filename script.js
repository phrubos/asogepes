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
 * Scroll-ra megjelenő animációk - Enhanced
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Staggered animation delay
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');

                    // Ha chart container, animáljuk a chartokat
                    if (entry.target.querySelector('.chart-bar') ||
                        entry.target.querySelector('.row-bar')) {
                        animateCharts(entry.target);
                    }
                }, delay);

                // Csak egyszer animálunk
                observer.unobserve(entry.target);
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

    animatedElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        // Staggered delays for sibling elements
        if (el.classList.contains('consequence-card') ||
            el.classList.contains('benefit') ||
            el.classList.contains('finding')) {
            el.dataset.delay = (index % 4) * 100;
        }
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
 * Parallax effekt a hero szekcióban - Enhanced
 */
let ticking = false;
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax();
            ticking = false;
        });

        ticking = true;
    }
});

function updateParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const scrolled = lastScrollY;
    const heroHeight = hero.offsetHeight;

    if (scrolled < heroHeight) {
        // Smoother parallax with easing
        const parallaxValue = scrolled * 0.5;
        const opacityValue = Math.max(0, 1 - (scrolled / heroHeight) * 0.3);

        hero.style.setProperty('--parallax', `${parallaxValue}px`);

        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = opacityValue;
        }
    }
}

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
 * Interaktív talajréteg vizualizáció - Enhanced
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

        // Add loading state animation
        toggleBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            toggleBtn.style.transform = 'scale(1)';
        }, 150);

        infographic.classList.toggle('ploughed', isPloughed);

        const currentTexts = isPloughed ? texts.ploughed : texts.natural;

        // Smooth text transitions
        stateTitle.style.opacity = '0';
        caption.style.opacity = '0';

        setTimeout(() => {
            stateTitle.textContent = currentTexts.title;
            btnText.textContent = currentTexts.button;
            caption.textContent = currentTexts.caption;

            stateTitle.style.opacity = '1';
            caption.style.opacity = '1';

            // Frissítsük a leírásokat is
            if (aerobicDesc) aerobicDesc.textContent = currentTexts.aerobicDesc;
            if (anaerobicDesc) anaerobicDesc.textContent = currentTexts.anaerobicDesc;
        }, 200);
    });
}

/**
 * Enhanced chart bar hover interactions
 */
function initChartInteractions() {
    const chartBars = document.querySelectorAll('.chart-bar, .row-bar');

    chartBars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('row-bar')
                ? 'scaleX(1.02)'
                : 'scaleY(1.02)';
            this.style.filter = 'brightness(1.1)';
        });

        bar.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('row-bar')
                ? 'scaleX(1)'
                : 'scaleY(1)';
            this.style.filter = 'brightness(1)';
        });
    });
}

// Initialize chart interactions
document.addEventListener('DOMContentLoaded', () => {
    initChartInteractions();
});
