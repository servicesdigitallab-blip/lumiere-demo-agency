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
   SWIPER INITIALIZATION
   ═══════════════════════════════════════════ */
let portSwiper;
let testiSwiper;
function initSwiper() {
    if(document.querySelector('.port-swiper')){
        portSwiper = new Swiper('.port-swiper', {
            slidesPerView: 1.2,
            spaceBetween: 20,
            mousewheel: {
                forceToAxis: true,
            },
            navigation: {
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
            },
            breakpoints: {
                640: { slidesPerView: 2.2, spaceBetween: 20 },
                1024: { slidesPerView: 4.2, spaceBetween: 20 }
            }
        });
    }

    if(document.querySelector('.testi-slider')){
        initMagTestimonials();
        testiSwiper = new Swiper('.testi-slider', {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.testi-next',
                prevEl: '.testi-prev',
            },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 20 }
            }
        });
    }
}

/* ═══════════════════════════════════════════
   DYNAMIC REVIEWS
   ═══════════════════════════════════════════ */
/* ═══════════════════════════════════════════
   TESTIMONIAL SYSTEM (MAGAZINE STYLE)
   ═══════════════════════════════════════════ */
const magReviews = [
    {
        name: "Priya Mehta",
        location: "MUMBAI, INDIA",
        quote: "Demo Interior turned our ideas into a beautiful reality. Every corner reflects elegance and functionality. Their attention to detail is truly world-class.",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Vikram Sharma",
        location: "DELHI, INDIA",
        quote: "They truly understood our vision for a minimalist office environment. The project was delivered ahead of schedule and exceeded every expectation.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Ananya Joshi",
        location: "BANGALORE, INDIA",
        quote: "World-class quality. The 3D renders were identical to the final result. The execution was absolutely flawless and the team was a joy to work with.",
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80"
    }
];

let activeMagIndex = 0;

function initMagTestimonials() {
    const prevBtn = document.getElementById('mag-prev');
    const nextBtn = document.getElementById('mag-next');
    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', () => {
        activeMagIndex = (activeMagIndex - 1 + magReviews.length) % magReviews.length;
        updateMagReview();
    });

    nextBtn.addEventListener('click', () => {
        activeMagIndex = (activeMagIndex + 1) % magReviews.length;
        updateMagReview();
    });
}

function updateMagReview() {
    const review = magReviews[activeMagIndex];
    const container = document.getElementById('testi-mag-container');
    
    gsap.to(container, {
        opacity: 0, x: -30, duration: 0.5, onComplete: () => {
            document.getElementById('mag-active-quote').textContent = `"${review.quote}"`;
            document.getElementById('mag-active-img').src = review.img;
            document.getElementById('mag-active-name').textContent = review.name;
            document.getElementById('mag-active-location').textContent = review.location;
            
            gsap.to(container, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' });
        }
    });
}

/* ═══════════════════════════════════════════
   COUNTER ANIMATION
   ═══════════════════════════════════════════ */
function initCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            toggleActions: "play reverse play reverse",
            onEnter: () => animateCounter(el),
            onEnterBack: () => animateCounter(el),
            onLeave: () => resetCounter(el),
            onLeaveBack: () => resetCounter(el)
        });
    });
}

function animateCounter(el) {
    if (el._timer) clearInterval(el._timer);
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '+';
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    el._timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(el._timer); }
        el.textContent = current + suffix;
    }, 40);
}

function resetCounter(el) {
    if (el._timer) clearInterval(el._timer);
    const suffix = el.getAttribute('data-suffix') || '+';
    el.textContent = "0" + suffix;
}

/* ═══════════════════════════════════════════
   FILTER TABS
   ═══════════════════════════════════════════ */
function initFilters() {
    const tabs = document.querySelectorAll('.filter-tab');
    const slides = document.querySelectorAll('.swiper-slide.port-card');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.getAttribute('data-filter');
            
            slides.forEach(slide => {
                const cat = slide.getAttribute('data-category');
                if (filter === 'all' || filter === cat) {
                    slide.style.display = '';
                    gsap.fromTo(slide, { opacity: 0, scale:0.8 }, { opacity: 1, scale:1, duration: 0.4 });
                } else {
                    slide.style.display = 'none';
                }
            });
            if(portSwiper) portSwiper.update();
        });
    });
}

/* ═══════════════════════════════════════════
   GSAP SCROLL ANIMATIONS — ALL SECTIONS
   ═══════════════════════════════════════════ */
function initAnimations() {

    // Helper for repeating animations on scroll
    const ta = "play reverse play reverse";

    // ── PORTFOLIO CARDS: Stagger Rise ──
    gsap.from('.port-card', {
        scrollTrigger: { trigger: '.port-slider', start: 'top 88%', toggleActions: ta },
        y: 100, opacity: 0, scale: 0.8, duration: 0.8, stagger: 0.1,
        ease: 'back.out(1.5)'
    });

    // ── STATS BANNER ──
    gsap.from('.stats-banner', {
        scrollTrigger: { trigger: '.stats-banner', start: 'top 85%', toggleActions: ta },
        scale: 0.9, opacity: 0, duration: 1, ease: 'power4.out'
    });

    // ── STATS BAR: Slide Up ──
    gsap.from('.stat-item', {
        scrollTrigger: { trigger: '.stats-row', start: 'top 88%', toggleActions: ta },
        y: 50, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(2)'
    });



    // ── ULTIMATE PROCESS: Full Screen Reveals ──
    document.querySelectorAll('.process-step-full').forEach((step, i) => {
        const content = step.querySelector('.process-content-premium');
        const img = step.querySelector('.process-bg-img img');

        gsap.from(content, {
            scrollTrigger: { trigger: step, start: 'top 60%', toggleActions: ta },
            x: -100, opacity: 0, duration: 1.5, ease: 'power4.out'
        });

        gsap.fromTo(img, { scale: 1.2, opacity: 0.3 }, {
            scrollTrigger: { trigger: step, start: 'top bottom', end: 'bottom top', scrub: true },
            scale: 1, opacity: 0.6, ease: 'none'
        });
    });

    // ── MAGAZINE TESTIMONIALS: Slide Reveal ──
    gsap.from('.testi-magazine', {
        scrollTrigger: { trigger: '.testi-section', start: 'top 80%', toggleActions: ta },
        y: 60, opacity: 0, duration: 1.2, ease: 'power4.out'
    });

    // Removed testi-card animation to prevent opacity bug
    // Removed blog card animation to prevent opacity bug
    // ── CTA BANNER: Slide Up ──
    gsap.from('.cta-banner', {
        scrollTrigger: { trigger: '.cta-banner', start: 'top 88%', toggleActions: ta },
        y: 100, opacity: 0, duration: 1, ease: 'power4.out'
    });

    // ── CONTACT FORM: Split Slide ──
    gsap.from('.contact-left', {
        scrollTrigger: { trigger: '.contact-layout', start: 'top 85%', toggleActions: ta },
        x: -100, opacity: 0, duration: 1, ease: 'power4.out'
    });
    gsap.from('.contact-right', {
        scrollTrigger: { trigger: '.contact-layout', start: 'top 85%', toggleActions: ta },
        x: 100, opacity: 0, duration: 1, delay: 0.2, ease: 'power4.out'
    });

    // ── TRUST BAR: Pop In ──
    gsap.from('.trust-item', {
        scrollTrigger: { trigger: '.trust-bar', start: 'top 90%', toggleActions: ta },
        scale: 0.5, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(2)'
    });

    // ── ALL TITLES: Typewriter / Slide Up ──
    document.querySelectorAll('.title-lg, .title-xl').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: ta },
            y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
        });
    });

    // ── LABELS: Slide In from Left ──
    document.querySelectorAll('.label-sm').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 94%', toggleActions: ta },
            x: -30, opacity: 0, duration: 0.6, ease: 'power2.out'
        });
    });
}

/* ═══════════════════════════════════════════
   HOVER EFFECTS
   ═══════════════════════════════════════════ */
function initHoverEffects() {
    // Magnetic buttons
    document.querySelectorAll('.btn-dark, .btn-gold-circle, .btn-outline, .btn-header').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3 });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
        });
    });
}

/* ═══════════════════════════════════════════
   LIGHTBOX FUNCTIONALITY
   ═══════════════════════════════════════════ */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    if(!lightbox || !lightboxImg) return;

    // Select images from portfolio, blog, and process
    const images = document.querySelectorAll('.port-card img, .blog-card-img img, .process-image img, .testi-big-img img');
    
    images.forEach(img => {
        img.addEventListener('click', (e) => {
            lightboxImg.src = e.target.src;
            lightbox.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
        setTimeout(() => lightboxImg.src = '', 300);
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            setTimeout(() => lightboxImg.src = '', 300);
        }
    });
}

/* ═══════════════════════════════════════════
   INIT ON LOAD
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
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

    // Header Load Animation
    gsap.from('.premium-header', { y: -100, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 });

    // Scrolled header
    window.addEventListener('scroll', () => {
        const h = document.querySelector('.premium-header');
        if (h) { window.scrollY > 50 ? h.classList.add('scrolled') : h.classList.remove('scrolled'); }
    });

    // Init all
    initSwiper();
    initCounters();
    initFilters();
    initAnimations();
    initHoverEffects();
    initLightbox();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const t = document.querySelector(targetId);
            if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
        });
    });

    // Explore All Projects Button
    const exploreBtn = document.getElementById('btn-explore-all');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const allFilter = document.querySelector('.filter-tab[data-filter="all"]');
            if (allFilter) allFilter.click();
            // Scroll to portfolio section smoothly
            const t = document.querySelector('#portfolio');
            if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
        });
    }
});
