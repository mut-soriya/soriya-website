/* ============================================
   SORIYA.SYS — PORTFOLIO V2
   app.js — Main Application Logic & Boot Sequence
   ============================================ */

const App = {
    /* ===== BOOT SEQUENCE ===== */
    async boot() {
        const bootLoader = document.getElementById('boot-loader');
        const bootLines = document.getElementById('boot-lines');
        const bootBarFill = document.getElementById('boot-bar-fill');

        if (!bootLoader) {
            this.start();
            return;
        }

        // Check if reduced motion - skip boot quickly
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const settings = await this.loadBootSettings();
        const sequence = settings?.bootSequence || [
            'INITIALIZING PORTFOLIO...',
            'LOADING PROFILE...',
            'LOADING PROJECTS...',
            'CONNECTING DEVELOPER MODE...',
            'SYSTEM ONLINE'
        ];

        if (reducedMotion) {
            // Show all lines at once
            bootLines.innerHTML = sequence.map(line =>
                `<div class="boot-line visible">${line} <span class="boot-ok">OK</span></div>`
            ).join('');
            bootBarFill.style.width = '100%';

            setTimeout(() => {
                this.finishBoot(bootLoader);
            }, 300);
            return;
        }

        // Animate boot lines
        const speed = 180; // ms per line
        let current = 0;

        const showNextLine = () => {
            if (current < sequence.length) {
                const line = document.createElement('div');
                line.className = 'boot-line';

                // Mark last line differently
                if (current === sequence.length - 1) {
                    line.innerHTML = `<span style="color: var(--success);">${sequence[current]}</span>`;
                } else {
                    line.innerHTML = `${sequence[current]} <span class="boot-ok">OK</span>`;
                }

                bootLines.appendChild(line);

                // Trigger animation
                requestAnimationFrame(() => {
                    line.classList.add('visible');
                });

                // Update progress bar
                const progress = ((current + 1) / sequence.length) * 100;
                bootBarFill.style.width = progress + '%';

                current++;
                setTimeout(showNextLine, speed);
            } else {
                // Boot complete
                setTimeout(() => {
                    this.finishBoot(bootLoader);
                }, 300);
            }
        };

        showNextLine();
    },

    async loadBootSettings() {
        try {
            const res = await fetch(resolvePortfolioPath('data/settings.json'));
            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    },

    finishBoot(bootLoader) {
        bootLoader.classList.add('hidden');
        // Start the app
        this.start();
    },

    /* ===== START APPLICATION ===== */
    async start() {
        // Load all data
        const success = await DataLoader.loadAll();

        if (success) {
            // Populate content
            DataLoader.populateAll();

            // Initialize animations
            Animations.init();

            // Initialize interactions
            Interactions.init();

            // Hero animations
            this.animateHero();

            // Set initial nav indicator after a delay (for layout to settle)
            setTimeout(() => {
                const activeLink = document.querySelector('.nav-link.active');
                if (activeLink && typeof Interactions.moveNavIndicator === 'function') {
                    Interactions.moveNavIndicator(activeLink.dataset.section);
                }
            }, 500);
        } else {
            // Show error state
            this.showError();
        }
    },

    /* ===== HERO ENTRANCE ANIMATION ===== */
    animateHero() {
        // Reveal hero elements in sequence
        const heroElements = document.querySelectorAll('.hero .reveal');

        heroElements.forEach((el, i) => {
            const delay = parseInt(el.dataset.revealDelay) || (i * 100);
            setTimeout(() => {
                el.classList.add('visible');
            }, delay);
        });

        // Animate hero name with character reveal
        setTimeout(() => {
            Animations.animateHeroName();
        }, 200);
    },

    /* ===== ERROR STATE ===== */
    showError() {
        const main = document.getElementById('main-content');
        if (main) {
            main.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;min-height:80vh;flex-direction:column;gap:16px;text-align:center;padding:24px;">
                    <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--accent-secondary);letter-spacing:2px;">SYSTEM ERROR</div>
                    <h2 style="font-size:1.5rem;font-weight:600;">Failed to load portfolio data</h2>
                    <p style="color:var(--text-secondary);max-width:400px;">Please ensure the website is served from a web server (not opened as a file directly) and all JSON files are present in the data/ directory.</p>
                    <button onclick="location.reload()" style="font-family:var(--font-mono);font-size:0.8rem;padding:12px 24px;border-radius:8px;background:var(--gradient-accent);color:#fff;cursor:pointer;border:none;margin-top:8px;">RETRY</button>
                </div>
            `;
        }
    }
};

/* ===== AUTO-START ON DOM READY ===== */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.boot());
} else {
    App.boot();
}
