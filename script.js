/**
 * Ásógépes Talajművelés - Marketing Weboldal
 * JavaScript funkciók
 * Enhanced with micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initLocationTabs();
    initSmoothScroll();
    initScrollAnimations();
    initNavHighlight();
    initChartAnimations();
    initSoilInfographic();

    // New enhanced interactions
    initProblemSectionAnimations();
    initWaterParticles();
    initStatDigitAnimation();
    initSoilCardInteraction();
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

/**
 * ============================================
 * ENHANCED MICRO-INTERACTIONS
 * Problem Section Animations
 * ============================================
 */

/**
 * Initialize Problem Section Entry Animations
 */
function initProblemSectionAnimations() {
    const problemSection = document.querySelector('.section-problem');
    if (!problemSection) return;

    // Observe when section comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                triggerProblemAnimations();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(problemSection);
}

/**
 * Trigger all problem section animations
 */
function triggerProblemAnimations() {
    // Animate stat block
    const statBlock = document.querySelector('.problem-stat-block');
    if (statBlock) {
        statBlock.style.opacity = '1';
        statBlock.style.transform = 'translateY(0)';
    }

    // Re-trigger info card animations
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        card.style.animationDelay = `${0.2 + index * 0.15}s`;
        card.style.animationPlayState = 'running';
    });
}

/**
 * Animate statistic digits with spring physics
 */
function initStatDigitAnimation() {
    const statElement = document.getElementById('irrigationStat');
    if (!statElement) return;

    const text = statElement.textContent;

    // Wrap each character in a span
    statElement.innerHTML = text.split('').map((char, index) => {
        if (char === '-') {
            return `<span class="stat-digit" style="animation-delay: ${0.3 + index * 0.05}s">${char}</span>`;
        }
        return `<span class="stat-digit" style="animation-delay: ${0.1 + index * 0.08}s">${char}</span>`;
    }).join('');

    // Observe and trigger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const digits = entry.target.querySelectorAll('.stat-digit');
                digits.forEach(digit => {
                    digit.style.animationPlayState = 'running';
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statElement);
}

/**
 * Create and animate water droplet particles
 */
function initWaterParticles() {
    const skyContainer = document.getElementById('skyParticles');
    if (!skyContainer) return;

    // Create initial water drops
    function createWaterDrop() {
        const drop = document.createElement('div');
        drop.className = 'water-drop';

        // Random position
        drop.style.left = `${Math.random() * 100}%`;

        // Random animation delay and duration
        const delay = Math.random() * 2;
        const duration = 1.5 + Math.random() * 1;
        drop.style.animationDelay = `${delay}s`;
        drop.style.animationDuration = `${duration}s`;

        skyContainer.appendChild(drop);

        // Remove after animation
        setTimeout(() => {
            drop.remove();
        }, (delay + duration) * 1000);
    }

    // Create drops at intervals
    let dropInterval;

    const startDrops = () => {
        // Initial burst
        for (let i = 0; i < 5; i++) {
            setTimeout(createWaterDrop, i * 200);
        }

        // Continuous drops
        dropInterval = setInterval(() => {
            if (Math.random() > 0.3) {
                createWaterDrop();
            }
        }, 400);
    };

    // Only run when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startDrops();
            } else {
                clearInterval(dropInterval);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(skyContainer);
}

/**
 * Enhanced Soil Card Interaction with State Toggle
 */
function initSoilCardInteraction() {
    const soilCard = document.getElementById('soilCard');
    const toggleBtn = document.getElementById('soilToggleBtnNew');
    const cardTitle = document.querySelector('.soil-card-title');
    const rootZoneValue = document.getElementById('rootZoneValue');
    const waterValue = document.getElementById('waterValue');

    if (!soilCard || !toggleBtn) return;

    let isHealthy = false;

    const states = {
        compacted: {
            title: 'Tömörödött talaj (Eketalp)',
            buttonText: 'Javítás',
            rootZone: 'Sekély (25cm)',
            water: 'Pangóvíz',
            rootZoneClass: '',
            waterClass: ''
        },
        healthy: {
            title: 'Egészséges talaj',
            buttonText: 'Tömörítés',
            rootZone: 'Mély (45cm)',
            water: 'Átjárható',
            rootZoneClass: 'good',
            waterClass: 'good'
        }
    };

    toggleBtn.addEventListener('click', () => {
        isHealthy = !isHealthy;
        const state = isHealthy ? states.healthy : states.compacted;

        // Button press animation
        toggleBtn.style.transform = 'scale(0.92)';
        setTimeout(() => {
            toggleBtn.style.transform = 'scale(1)';
        }, 150);

        // Toggle state class with transition
        soilCard.classList.toggle('state-healthy', isHealthy);
        soilCard.classList.toggle('state-compacted', !isHealthy);

        // Update content with fade transition
        cardTitle.style.opacity = '0';
        rootZoneValue.style.opacity = '0';
        waterValue.style.opacity = '0';

        setTimeout(() => {
            cardTitle.textContent = state.title;
            toggleBtn.querySelector('span').textContent = state.buttonText;
            rootZoneValue.textContent = state.rootZone;
            waterValue.textContent = state.water;

            rootZoneValue.className = `soil-stat-value ${state.rootZoneClass}`;
            waterValue.className = `soil-stat-value ${state.waterClass}`;

            cardTitle.style.opacity = '1';
            rootZoneValue.style.opacity = '1';
            waterValue.style.opacity = '1';
        }, 200);

        // Re-trigger plant animations
        restartPlantAnimation(isHealthy);
    });

    // Layer hover interactions
    const layers = document.querySelectorAll('.soil-layer-hover');
    const caption = document.querySelector('.soil-card-caption');

    const layerInfo = {
        sky: 'Légkör: Az öntözővíz felülről érkezik',
        topsoil: 'Felső talajréteg: Itt fejlődnek a gyökerek',
        subsoil: 'Altalaj: Vízzáró eketalp réteg'
    };

    layers.forEach(layer => {
        layer.addEventListener('mouseenter', () => {
            const info = layerInfo[layer.dataset.layer];
            if (caption && info) {
                caption.textContent = info;
                caption.style.fontWeight = '600';
            }
        });

        layer.addEventListener('mouseleave', () => {
            if (caption) {
                caption.textContent = 'Kattints a rétegekre a részletekért';
                caption.style.fontWeight = '400';
            }
        });
    });
}

/**
 * Restart plant animation based on state
 */
function restartPlantAnimation(isHealthy) {
    const plantStem = document.querySelector('.plant-stem');
    const leaves = document.querySelectorAll('.leaf');
    const roots = document.querySelectorAll('.root-path');

    if (!plantStem) return;

    // Reset animations
    plantStem.style.animation = 'none';
    leaves.forEach(leaf => leaf.style.animation = 'none');
    roots.forEach(root => root.style.animation = 'none');

    // Force reflow
    void plantStem.offsetWidth;

    // Re-apply animations with appropriate state
    if (isHealthy) {
        plantStem.style.animation = 'stemGrow 1s ease-out forwards';
        leaves.forEach((leaf, i) => {
            leaf.style.animation = `leafGrow 0.5s ease-out ${0.8 + i * 0.2}s forwards`;
        });
        roots.forEach((root, i) => {
            root.style.animation = `rootGrow 1.5s ease-out ${0.5 + i * 0.2}s forwards`;
        });
    } else {
        plantStem.style.animation = 'stemShrink 0.6s ease forwards';
        leaves.forEach(leaf => {
            leaf.style.animation = 'leafWilt 0.6s ease forwards';
        });
        roots.forEach(root => {
            root.style.animation = 'rootShrink 0.6s ease forwards';
        });
    }
}

/**
 * Add magnetic hover effect to info cards
 */
function initMagneticCards() {
    const cards = document.querySelectorAll('.info-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            card.style.transform = `
                translateY(-4px)
                translateX(4px)
                rotateX(${deltaY * -3}deg)
                rotateY(${deltaX * 3}deg)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) translateX(0) rotateX(0) rotateY(0)';
        });
    });
}

// Initialize magnetic cards effect
document.addEventListener('DOMContentLoaded', () => {
    initMagneticCards();
});

/**
 * Soil particle effect (floating soil particles)
 */
function createSoilParticles() {
    const vizContainer = document.getElementById('soilVizContainer');
    if (!vizContainer) return;

    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${2 + Math.random() * 3}px;
            height: ${2 + Math.random() * 3}px;
            background: rgba(139, 115, 85, ${0.3 + Math.random() * 0.4});
            border-radius: 50%;
            bottom: ${30 + Math.random() * 30}%;
            left: ${Math.random() * 100}%;
            pointer-events: none;
            animation: floatParticle ${3 + Math.random() * 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;

        vizContainer.appendChild(particle);

        // Remove after some time
        setTimeout(() => particle.remove(), 10000);
    }

    // Create particles periodically
    setInterval(() => {
        if (Math.random() > 0.6) {
            createParticle();
        }
    }, 800);
}

// Add floating particle keyframes
const floatParticleStyle = document.createElement('style');
floatParticleStyle.textContent = `
    @keyframes floatParticle {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.6;
        }
        50% {
            transform: translateY(-20px) translateX(${Math.random() > 0.5 ? '' : '-'}10px);
            opacity: 0.3;
        }
    }
`;
document.head.appendChild(floatParticleStyle);

// Initialize soil particles when visible
document.addEventListener('DOMContentLoaded', () => {
    const vizContainer = document.getElementById('soilVizContainer');
    if (vizContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    createSoilParticles();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(vizContainer);
    }
});
