/* ============================================
   SORIYA.SYS — PORTFOLIO V2
   animations.js — Background, Scroll & Visual Animations
   ============================================ */

const Animations = {
    particles: [],
    particleCanvas: null,
    particleCtx: null,
    animationId: null,
    mouseX: 0,
    mouseY: 0,
    reducedMotion: false,

    /* ===== INITIALIZE ALL ===== */
    init() {
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!this.reducedMotion) {
            this.initBackgroundParticles();
            this.initProfileParticles();
        }

        this.initScrollReveal();
        this.initScrollProgress();
        this.initTimelineAnimation();
        this.initNavScroll();
    },

    /* ===== BACKGROUND PARTICLES (Canvas) ===== */
    initBackgroundParticles() {
        this.particleCanvas = document.getElementById('bg-particles');
        if (!this.particleCanvas) return;

        this.particleCtx = this.particleCanvas.getContext('2d');
        this.resizeCanvas();

        // Create particles
        const count = Math.min(60, Math.floor(window.innerWidth / 25));
        this.particles = [];

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.particleCanvas.width,
                y: Math.random() * this.particleCanvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.4 + 0.1,
                hue: Math.random() > 0.5 ? 265 : 185 // purple or cyan
            });
        }

        // Start animation
        this.animateParticles();

        // Resize handler
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.resizeCanvas();
            }, 200);
        });

        // Mouse parallax for background
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            this.mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        });
    },

    resizeCanvas() {
        if (!this.particleCanvas) return;
        const dpr = window.devicePixelRatio || 1;
        this.particleCanvas.width = window.innerWidth * dpr;
        this.particleCanvas.height = window.innerHeight * dpr;
        this.particleCanvas.style.width = window.innerWidth + 'px';
        this.particleCanvas.style.height = window.innerHeight + 'px';
        // Reset transform before scaling; otherwise every resize compounds the scale.
        this.particleCtx.setTransform(1, 0, 0, 1, 0, 0);
        this.particleCtx.scale(dpr, dpr);
    },

    animateParticles() {
        if (!this.particleCtx || this.reducedMotion) return;

        const w = window.innerWidth;
        const h = window.innerHeight;

        this.particleCtx.clearRect(0, 0, w, h);

        this.particles.forEach((p, i) => {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Mouse parallax
            p.x += this.mouseX * 0.01;
            p.y += this.mouseY * 0.01;

            // Wrap around
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            // Draw particle
            this.particleCtx.beginPath();
            this.particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.particleCtx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.opacity})`;
            this.particleCtx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    this.particleCtx.beginPath();
                    this.particleCtx.moveTo(p.x, p.y);
                    this.particleCtx.lineTo(p2.x, p2.y);
                    this.particleCtx.strokeStyle = `hsla(${p.hue}, 80%, 60%, ${(1 - dist / 120) * 0.08})`;
                    this.particleCtx.lineWidth = 0.5;
                    this.particleCtx.stroke();
                }
            }
        });

        this.animationId = requestAnimationFrame(() => this.animateParticles());
    },

    /* ===== PROFILE PARTICLES ===== */
    initProfileParticles() {
        const container = document.getElementById('profile-particles');
        if (!container) return;

        const count = 8;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('span');
            particle.className = 'profile-particle';
            // A tiny mix of stars, study dots, and playful pencil marks.
            particle.textContent = i % 4 === 0 ? '✦' : (i % 5 === 0 ? '·' : '');

            const startX = Math.random() * 100;
            const startY = 80 + Math.random() * 20;
            const tx = (Math.random() - 0.5) * 40;
            const ty = -(60 + Math.random() * 40);
            const delay = Math.random() * 4;
            const duration = 3 + Math.random() * 3;

            particle.style.left = startX + '%';
            particle.style.top = startY + '%';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.animationDelay = delay + 's';
            particle.style.animationDuration = duration + 's';

            container.appendChild(particle);
        }
    },

    /* ===== SCROLL REVEAL (IntersectionObserver) ===== */
    initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        if (reveals.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Don't unobserve - allow re-trigger for elements that scroll back
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(el => observer.observe(el));

        // Staggered items
        this.initStaggerReveal();
    },

    initStaggerReveal() {
        const staggerContainers = document.querySelectorAll('.skills-grid, .projects-grid, .traits-grid, .achievements-grid, .about-cards');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.stagger-item');
                    items.forEach((item, i) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, i * 80);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        staggerContainers.forEach(c => observer.observe(c));
    },

    /* ===== TIMELINE ANIMATION ===== */
    initTimelineAnimation() {
        const timeline = document.getElementById('timeline');
        if (!timeline) return;

        const line = document.getElementById('timeline-line');
        const items = document.querySelectorAll('.timeline-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate the line
                    if (line) {
                        const rect = timeline.getBoundingClientRect();
                        const visibleHeight = Math.min(window.innerHeight - rect.top, rect.height);
                        const percent = Math.max(0, Math.min(1, visibleHeight / rect.height));
                        line.style.height = (percent * 100) + '%';
                    }

                    // Activate items in view
                    items.forEach(item => {
                        const itemRect = item.getBoundingClientRect();
                        if (itemRect.top < window.innerHeight * 0.8) {
                            item.classList.add('visible', 'active');
                        }
                    });
                }
            });
        }, {
            threshold: 0,
            rootMargin: '0px 0px -100px 0px'
        });

        observer.observe(timeline);

        // Also update on scroll for line growth
        window.addEventListener('scroll', () => {
            if (!line) return;
            const rect = timeline.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const total = rect.height;
                const scrolled = Math.min(window.innerHeight - rect.top, total);
                const percent = Math.max(0, Math.min(1, scrolled / total));
                line.style.height = (percent * 100) + '%';
            }
        }, { passive: true });
    },

    /* ===== SCROLL PROGRESS BAR ===== */
    initScrollProgress() {
        const bar = document.getElementById('scroll-progress');
        if (!bar) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = (scrollTop / docHeight) * 100;
            bar.style.width = percent + '%';
        }, { passive: true });
    },

    /* ===== NAV SCROLL EFFECT ===== */
    initNavScroll() {
        const nav = document.getElementById('nav');
        if (!nav) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    },

    /* ===== HERO NAME ANIMATION ===== */
    animateHeroName() {
        const name = document.getElementById('hero-name');
        if (!name) return;

        // Character-by-character reveal
        const text = name.textContent;
        name.textContent = '';
        name.classList.add('animate');

        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                name.textContent += text[i];
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    },

    /* ===== REVEAL HERO ELEMENTS ===== */
    revealHero() {
        const heroElements = document.querySelectorAll('.hero .reveal');
        heroElements.forEach(el => {
            el.classList.add('visible');
        });
    }
};
