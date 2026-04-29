gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   HERO CANVAS FRAME-BY-FRAME SCROLL ANIMATION
   ═══════════════════════════════════════════ */

const canvas = document.getElementById('heroCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const frameCount = 211;
const frames = [];
let loadedCount = 0;

function preloadFrames() {
    if (!canvas) return;
    const threshold = 10;
    let thresholdReached = false;
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = `frames/frame_${String(i).padStart(4, '0')}.jpg`;
        img.onload = () => {
            loadedCount++;
            updateLoadingProgress(loadedCount, frameCount);
            if (loadedCount === 1) drawFrame(0);
            if (!thresholdReached && loadedCount >= threshold) {
                thresholdReached = true;
                setTimeout(hideLoadingScreen, 100);
            }
        };
        img.onerror = () => { loadedCount++; updateLoadingProgress(loadedCount, frameCount); };
        frames.push(img);
    }
}

function setCanvasSize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawFrame(index) {
    if (!canvas || !ctx) return;
    const img = frames[index];
    if (!img || !img.complete || !img.naturalWidth) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const x = (canvas.width - img.naturalWidth * scale) / 2;
    const y = (canvas.height - img.naturalHeight * scale) / 2;
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
}

function updateLoadingProgress(loaded, total) {
    const pct = Math.round((loaded / total) * 100);
    const bar = document.getElementById('loaderBar');
    const txt = document.getElementById('loaderText');
    if (bar) bar.style.width = pct + '%';
    if (txt) txt.textContent = `OPTIMIZING ASSETS ${pct}%`;
}

function hideLoadingScreen() {
    const loader = document.getElementById('frameLoader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => { loader.style.display = 'none'; }, 500);
    }
}

/* ═══════════════════════════════════════════
   COUNTER ANIMATION
   ═══════════════════════════════════════════ */
function initCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                const target = parseInt(el.getAttribute('data-target'));
                const suffix = el.textContent.includes('%') ? '%' : '+';
                let current = 0;
                const step = Math.max(1, Math.floor(target / 50));
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(timer); }
                    el.textContent = current + suffix;
                }, 30);
            }
        });
    });
}

/* ═══════════════════════════════════════════
   FILTER TABS
   ═══════════════════════════════════════════ */
function initFilters() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.port-card');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.getAttribute('data-filter');
            cards.forEach(card => {
                const cat = card.getAttribute('data-category');
                if (filter === 'all' || filter === cat) {
                    card.style.display = 'block';
                    gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
                } else {
                    gsap.to(card, { opacity: 0, y: 20, duration: 0.3, onComplete: () => { card.style.display = 'none'; } });
                }
            });
        });
    });
}

/* ═══════════════════════════════════════════
   GSAP SCROLL ANIMATIONS — ALL SECTIONS
   ═══════════════════════════════════════════ */
function initAnimations() {

    // ── PORTFOLIO CARDS: Stagger Rise ──
    gsap.from('.port-card', {
        scrollTrigger: { trigger: '.port-grid', start: 'top 88%', once: true },
        y: 80, opacity: 0, scale: 0.9, duration: 0.9, stagger: 0.15,
        ease: 'back.out(1.4)'
    });

    // ── STATS BAR: Slide Up ──
    gsap.from('.stat-item', {
        scrollTrigger: { trigger: '.stats-bar', start: 'top 88%', once: true },
        y: 50, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out'
    });

    // ── WHY CARDS: Rotate In ──
    gsap.from('.why-card', {
        scrollTrigger: { trigger: '.why-grid', start: 'top 88%', once: true },
        y: 60, opacity: 0, rotationX: -20, duration: 0.9, stagger: 0.12,
        ease: 'power4.out'
    });

    // ── PROCESS LEFT: Slide from Left ──
    gsap.from('.process-left', {
        scrollTrigger: { trigger: '.process-layout', start: 'top 85%', once: true },
        x: -80, opacity: 0, duration: 1, ease: 'power4.out'
    });

    // ── PROCESS STEPS: Stagger Down ──
    gsap.from('.process-step', {
        scrollTrigger: { trigger: '.process-steps', start: 'top 88%', once: true },
        y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out'
    });

    // ── PROCESS IMAGE: Scale Up ──
    gsap.from('.process-image', {
        scrollTrigger: { trigger: '.process-image', start: 'top 90%', once: true },
        scale: 0.85, opacity: 0, duration: 1, ease: 'power3.out'
    });

    // ── PROCESS IMAGE: Parallax ──
    const processImg = document.querySelector('.process-image img');
    if (processImg) {
        gsap.fromTo(processImg, { y: 30 }, {
            y: -30, ease: 'none',
            scrollTrigger: { trigger: '.process-image', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
        });
    }

    // ── TESTIMONIAL FEATURED: Slide Left ──
    gsap.from('.testi-featured', {
        scrollTrigger: { trigger: '.testi-layout', start: 'top 85%', once: true },
        x: -60, opacity: 0, duration: 1, ease: 'power4.out'
    });

    // ── TESTIMONIAL CARDS: Slide Right ──
    gsap.from('.testi-card-new', {
        scrollTrigger: { trigger: '.testi-cards-col', start: 'top 88%', once: true },
        x: 80, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'expo.out'
    });

    // ── TESTIMONIAL IMAGE ZOOM ──
    const testiFeatImg = document.querySelector('.testi-featured img');
    if (testiFeatImg) {
        gsap.fromTo(testiFeatImg, { scale: 1.15 }, {
            scale: 1, ease: 'none',
            scrollTrigger: { trigger: '.testi-featured', start: 'top bottom', end: 'bottom top', scrub: 2 }
        });
    }

    // ── INSIGHT CARDS: Stagger Up ──
    gsap.from('.insight-card', {
        scrollTrigger: { trigger: '.insights-grid', start: 'top 88%', once: true },
        y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out'
    });

    // ── CTA BANNER: Scale In ──
    gsap.from('.cta-banner', {
        scrollTrigger: { trigger: '.cta-banner', start: 'top 88%', once: true },
        scale: 0.88, opacity: 0, duration: 1, ease: 'power4.out'
    });

    // ── CONTACT FORM: Split Slide ──
    gsap.from('.contact-left', {
        scrollTrigger: { trigger: '.contact-layout', start: 'top 85%', once: true },
        x: -60, opacity: 0, duration: 1, ease: 'power4.out'
    });
    gsap.from('.contact-right', {
        scrollTrigger: { trigger: '.contact-layout', start: 'top 85%', once: true },
        x: 60, opacity: 0, duration: 1, delay: 0.2, ease: 'power4.out'
    });

    // ── TRUST BAR: Rise ──
    gsap.from('.trust-item', {
        scrollTrigger: { trigger: '.trust-bar', start: 'top 90%', once: true },
        y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out'
    });

    // ── ALL TITLES: Slide Up ──
    document.querySelectorAll('.title-lg, .title-xl').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            y: 30, opacity: 0, duration: 0.7, ease: 'power3.out'
        });
    });

    // ── LABELS: Slide In ──
    document.querySelectorAll('.label-sm').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 94%', once: true },
            x: -20, opacity: 0, duration: 0.5, ease: 'power2.out'
        });
    });
}

/* ═══════════════════════════════════════════
   HOVER EFFECTS
   ═══════════════════════════════════════════ */
function initHoverEffects() {
    // Card tilt
    document.querySelectorAll('.port-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, { rotationY: x * 8, rotationX: -y * 8, transformPerspective: 800, duration: 0.3 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power3.out' });
        });
    });

    // Magnetic buttons
    document.querySelectorAll('.btn-dark, .btn-gold-circle, .btn-outline, .btn-header').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.15, y: y * 0.15, duration: 0.3 });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
        });
    });
}

/* ═══════════════════════════════════════════
   INIT ON LOAD
   ═══════════════════════════════════════════ */
window.addEventListener('load', () => {
    setCanvasSize();
    preloadFrames();

    // Hero scroll → frame scrub
    if (document.getElementById('hero')) {
        ScrollTrigger.create({
            trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: 1,
            onUpdate: (self) => {
                const fi = Math.min(Math.floor(self.progress * (frameCount - 1)), frameCount - 1);
                drawFrame(fi);
            }
        });
        window.addEventListener('resize', () => {
            setCanvasSize();
            const hero = document.getElementById('hero');
            if (hero) {
                const hh = hero.scrollHeight - window.innerHeight;
                const p = Math.min(window.scrollY / hh, 1);
                drawFrame(Math.min(Math.floor(p * (frameCount - 1)), frameCount - 1));
            }
        });
    }

    // Scrolled header
    window.addEventListener('scroll', () => {
        const h = document.querySelector('header');
        if (h) { window.scrollY > 50 ? h.classList.add('scrolled') : h.classList.remove('scrolled'); }
    });

    // Init all
    initCounters();
    initFilters();
    initAnimations();
    initHoverEffects();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const t = document.querySelector(this.getAttribute('href'));
            if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
        });
    });
});
