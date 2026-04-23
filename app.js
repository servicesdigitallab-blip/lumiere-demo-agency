gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   HERO CANVAS FRAME-BY-FRAME SCROLL ANIMATION
   ═══════════════════════════════════════════ */

const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
const frameCount = 211; // Extracted at 15fps from 14s video
const frames = [];
let loadedCount = 0;

// Preload frames with ultra-fast initial burst
function preloadFrames() {
    const threshold = 10; // Show site almost immediately after 10 frames
    let thresholdReached = false;

    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = `frames/frame_${String(i).padStart(4, '0')}.jpg`;
        img.onload = () => {
            loadedCount++;
            updateLoadingProgress(loadedCount, frameCount);
            
            if (loadedCount === 1) drawFrame(0);

            // Fast Loading: Handoff to main site
            if (!thresholdReached && loadedCount >= threshold) {
                thresholdReached = true;
                setTimeout(hideLoadingScreen, 100);
            }
        };
        img.onerror = () => {
            loadedCount++;
            updateLoadingProgress(loadedCount, frameCount);
        };
        frames.push(img);
    }
}

// Set canvas to fill viewport
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Draw a specific frame index on the canvas with "cover" fit
function drawFrame(index) {
    const img = frames[index];
    if (!img || !img.complete || !img.naturalWidth) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cover fit calculation (like object-fit: cover)
    const scale = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight
    );
    const x = (canvas.width - img.naturalWidth * scale) / 2;
    const y = (canvas.height - img.naturalHeight * scale) / 2;

    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
}

// Loading Screen Progress
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
   HOVER & TILT EFFECTS
   ═══════════════════════════════════════════ */

// 3D Tilt Effect on Cards (Portfolio etc)
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        gsap.to(card, { rotationX: rotateX, rotationY: rotateY, transformPerspective: 1000, ease: 'power1.out', duration: 0.4 });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, ease: 'power3.out', duration: 0.6 });
    });
});

/* ═══════════════════════════════════════════
   PREMIUM CARD ANIMATIONS (Vanilla Port)
   ═══════════════════════════════════════════ */

// BorderGlow for Features
document.querySelectorAll('.border-glow-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        
        let kx = Infinity, ky = Infinity;
        if (dx !== 0) kx = cx / Math.abs(dx);
        if (dy !== 0) ky = cy / Math.abs(dy);
        const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
        
        let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;
        
        card.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
        card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    });
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--edge-proximity', 0);
    });
});

// Premium Process Cards 3D Hover
document.querySelectorAll('.premium-process-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 12;
        const rotateX = -((y - centerY) / centerY) * 12;
        
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        card.style.setProperty('--rx', `${rotateX}deg`);
        card.style.setProperty('--ry', `${rotateY}deg`);
    });
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', `0deg`);
        card.style.setProperty('--ry', `0deg`);
    });
});

/* ═══════════════════════════════════════════
   GENERATE 30 REVIEWS
   ═══════════════════════════════════════════ */

const reviewsWrapper = document.getElementById('reviews-wrapper');
if (reviewsWrapper) {
    const clients = [
        { name: "Eleanor Vance", loc: "Manhattan, NY", tag: "Penthouse Design", quote: "Lumière transformed our penthouse into a <span>cinematic sanctuary</span>. The attention to detail and 8K visualizations were simply breathtaking." },
        { name: "Julian Sterling", loc: "London, UK", tag: "Corporate HQ", quote: "The absolute pinnacle of <span>modern luxury</span>. Their ability to source rare materials globally made our headquarters an architectural masterpiece." },
        { name: "Marcus Thorne", loc: "Dubai, UAE", tag: "Luxury Villa", quote: "They don't just design rooms; they <span>engineer experiences</span>. The moody, minimalist aesthetic is unmatched in the industry." },
        { name: "Sophia Aris", loc: "Paris, FR", tag: "Boutique Hotel", quote: "From the first concept to the final reveal, the process was <span>seamless</span>. The bespoke furniture curation gave our hotel a unique soul." },
        { name: "Alexander Rossi", loc: "Milan, IT", tag: "Private Estate", quote: "Uncompromising quality and <span>visionary design</span>. The lighting choreography completely redefined the atmosphere of our gallery." }
    ];

    let html = '';
    for (let i = 0; i < 30; i++) {
        const c = clients[i % clients.length];
        html += `
            <div class="swiper-slide">
                <div class="testi-card">
                    <div class="testi-project-tag">${c.tag}</div>
                    <div class="card-rating">★★★★★</div>
                    <p class="testi-quote">${c.quote}</p>
                    <div class="testi-author">
                        <div class="t-avatar"><img src="https://i.pravatar.cc/150?img=${(i % 70) + 1}" alt="Client"></div>
                        <div class="t-info">
                            <div class="location"><span>✦</span> ${c.loc}</div>
                            <h4>${c.name}</h4>
                            <div class="verified"><span class="verified-icon">✔</span> Verified Partnership</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    reviewsWrapper.innerHTML = html;

    new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 32,
        loop: true,
        grabCursor: true,
        autoplay: { delay: 4000, disableOnInteraction: false },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
}

/* ═══════════════════════════════════════════
   TEXT SPLITTING FOR GSAP
   ═══════════════════════════════════════════ */

function splitText(selector) {
    document.querySelectorAll(selector).forEach(el => {
        if (el.classList.contains('split-done')) return;
        const text = el.innerText;
        el.innerHTML = '';
        text.split(' ').forEach(word => {
            if (word.trim() === '') return;
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.overflow = 'visible';
            wordSpan.style.marginRight = '0.25em';
            wordSpan.style.verticalAlign = 'top';
            const charSpan = document.createElement('span');
            charSpan.style.display = 'inline-block';
            charSpan.innerText = word;
            charSpan.classList.add('split-word');
            wordSpan.appendChild(charSpan);
            el.appendChild(wordSpan);
        });
        el.classList.add('split-done');
    });
}

/* ═══════════════════════════════════════════
   INIT ALL ANIMATIONS ON LOAD
   ═══════════════════════════════════════════ */

window.addEventListener('load', () => {
    // Init Canvas
    setCanvasSize();
    preloadFrames();

    // HERO SCROLL → FRAME SCRUB
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
            const frameIndex = Math.min(
                Math.floor(self.progress * (frameCount - 1)),
                frameCount - 1
            );
            drawFrame(frameIndex);
        }
    });

    window.addEventListener('resize', () => {
        setCanvasSize();
        // Redraw current frame on resize
        const hero = document.getElementById('hero');
        const heroHeight = hero.scrollHeight - window.innerHeight;
        const progress = Math.min(window.scrollY / heroHeight, 1);
        const frameIndex = Math.min(Math.floor(progress * (frameCount - 1)), frameCount - 1);
        drawFrame(frameIndex);
    });

    // Split Text for title animations
    splitText('.gsap-title');

    // Scroll Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) document.querySelector('header').classList.add('scrolled');
        else document.querySelector('header').classList.remove('scrolled');
    });

    // SERVICES SECTION ANIMATIONS
    // Gold line grows on scroll
    gsap.to('.gold-line', {
        width: '80px',
        duration: 1,
        scrollTrigger: { trigger: '.services-luxury-section', start: 'top 80%' }
    });

    // Service columns stagger in (Fixing opacity to ensure it's visible)
    gsap.from('.service-col', {
        y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.services-row', start: 'top 85%' }
    });

    // Service separator lines
    gsap.from('.service-sep', {
        scaleY: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.services-row', start: 'top 85%' }
    });

    // Features cards
    gsap.utils.toArray('.features-grid').forEach(grid => {
        gsap.from(grid.querySelectorAll('.border-glow-card'), {
            y: 60, opacity: 0, duration: 0.8, stagger: 0.1,
            scrollTrigger: { trigger: grid, start: 'top 85%' }
        });
    });

    // Process cards
    gsap.from('.premium-process-card', {
        y: 60, opacity: 0, duration: 0.8, stagger: 0.1,
        scrollTrigger: { trigger: '.process-cards', start: 'top 85%' }
    });

    // Portfolio items
    gsap.from('.port-item', {
        scale: 0.95, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.port-grid', start: 'top 85%' }
    });

    // Title Reveals
    document.querySelectorAll('.gsap-title').forEach(title => {
        gsap.from(title.querySelectorAll('.split-word'), {
            y: 50, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out',
            scrollTrigger: { trigger: title, start: 'top 90%' }
        });
    });

    // Smooth Scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
            }
        });
    });
});
