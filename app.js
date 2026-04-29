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
   SCROLL REVEAL OBSERVER
   ═══════════════════════════════════════════ */

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════
   COUNTER ANIMATION
   ═══════════════════════════════════════════ */

function initCounters() {
    const counters = document.querySelectorAll('.stat-num');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.getAttribute('data-target'));
                const suffix = entry.target.textContent.includes('%') ? '%' : '+';
                let current = 0;
                const step = Math.max(1, Math.floor(target / 60));
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = current + suffix;
                }, 25);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
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
                    gsap.fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
                } else {
                    gsap.to(card, { opacity: 0, y: 20, duration: 0.3, onComplete: () => { card.style.display = 'none'; } });
                }
            });
        });
    });
}

/* ═══════════════════════════════════════════
   GSAP SCROLL ANIMATIONS
   ═══════════════════════════════════════════ */

function initGSAPAnimations() {
    // Portfolio cards stagger
    gsap.utils.toArray('.port-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 90%' },
            y: 60, opacity: 0, scale: 0.92, duration: 0.8, delay: i * 0.1,
            ease: 'back.out(1.4)'
        });
    });

    // Stats bar items
    gsap.from('.stat-item', {
        scrollTrigger: { trigger: '.stats-bar', start: 'top 85%' },
        y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out'
    });

    // Why cards
    gsap.utils.toArray('.why-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 90%' },
            y: 50, opacity: 0, rotationX: -15, duration: 0.8, delay: i * 0.1,
            ease: 'power4.out'
        });
    });

    // Process steps
    gsap.from('.process-step', {
        scrollTrigger: { trigger: '.process-steps', start: 'top 85%' },
        y: 30, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out'
    });

    // Process image parallax
    const processImg = document.querySelector('.process-image img');
    if (processImg) {
        gsap.fromTo(processImg, { y: 40 }, {
            y: -40, ease: 'none',
            scrollTrigger: { trigger: '.process-image', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
        });
    }

    // Testimonial cards
    gsap.utils.toArray('.testi-card-new').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 90%' },
            x: 80, opacity: 0, duration: 0.9, delay: i * 0.15, ease: 'expo.out'
        });
    });

    // Testimonial featured image
    const testiFeatured = document.querySelector('.testi-featured img');
    if (testiFeatured) {
        gsap.fromTo(testiFeatured, { scale: 1.1 }, {
            scale: 1, ease: 'none',
            scrollTrigger: { trigger: '.testi-featured', start: 'top bottom', end: 'bottom top', scrub: 2 }
        });
    }

    // Insight cards
    gsap.utils.toArray('.insight-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 90%' },
            y: 60, opacity: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out'
        });
    });

    // CTA banner
    gsap.from('.cta-banner', {
        scrollTrigger: { trigger: '.cta-banner', start: 'top 85%' },
        scale: 0.9, opacity: 0, duration: 1, ease: 'power4.out'
    });

    // Contact layout
    gsap.from('.contact-left', {
        scrollTrigger: { trigger: '.contact-layout', start: 'top 80%' },
        x: -60, opacity: 0, duration: 1, ease: 'power4.out'
    });
    gsap.from('.contact-right', {
        scrollTrigger: { trigger: '.contact-layout', start: 'top 80%' },
        x: 60, opacity: 0, duration: 1, delay: 0.2, ease: 'power4.out'
    });

    // Trust bar items
    gsap.from('.trust-item', {
        scrollTrigger: { trigger: '.trust-bar', start: 'top 85%' },
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out'
    });

    // Title text animations
    document.querySelectorAll('.title-lg, .title-xl').forEach(title => {
        gsap.from(title, {
            scrollTrigger: { trigger: title, start: 'top 90%' },
            y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
        });
    });

    // Label animations
    document.querySelectorAll('.label-sm').forEach(label => {
        gsap.from(label, {
            scrollTrigger: { trigger: label, start: 'top 92%' },
            x: -20, opacity: 0, duration: 0.5, ease: 'power2.out'
        });
    });
}

/* ═══════════════════════════════════════════
   HOVER EFFECTS
   ═══════════════════════════════════════════ */

function initHoverEffects() {
    // Port card tilt
    document.querySelectorAll('.port-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, { rotationY: x * 8, rotationX: -y * 8, transformPerspective: 800, duration: 0.3, ease: 'power1.out' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power3.out' });
        });
    });

    // Button magnetic effect
    document.querySelectorAll('.btn-dark, .btn-gold-circle, .btn-outline').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.15, y: y * 0.15, duration: 0.3, ease: 'power2.out' });
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

    if (document.getElementById('hero')) {
        ScrollTrigger.create({
            trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: 1,
            onUpdate: (self) => {
                const frameIndex = Math.min(Math.floor(self.progress * (frameCount - 1)), frameCount - 1);
                drawFrame(frameIndex);
            }
        });
        window.addEventListener('resize', () => {
            setCanvasSize();
            const hero = document.getElementById('hero');
            if (hero) {
                const heroHeight = hero.scrollHeight - window.innerHeight;
                const progress = Math.min(window.scrollY / heroHeight, 1);
                const frameIndex = Math.min(Math.floor(progress * (frameCount - 1)), frameCount - 1);
                drawFrame(frameIndex);
            }
        });
    }

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const h = document.querySelector('header');
        if (h) {
            if (window.scrollY > 50) h.classList.add('scrolled');
            else h.classList.remove('scrolled');
        }
    });

    // Init all systems
    initScrollReveal();
    initCounters();
    initFilters();
    initGSAPAnimations();
    initHoverEffects();

    // Smooth scroll for nav
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        });
    });
});
