/* ============================================
   SORIYA.SYS — PORTFOLIO V2
   interactions.js — Mouse, Terminal, Theme & Micro-interactions
   ============================================ */

const Interactions = {
    reducedMotion: false,
    isTouch: false,

    /* ===== INITIALIZE ALL ===== */
    init() {
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

        this.initCursorGlow();
        this.initMagneticButtons();
        this.initCardTilt();
        this.initNavigation();
        this.initThemeToggle();
        this.initTerminal();
        this.initCopyEmail();
        this.initFloatingHUD();
        this.initHamburger();
        this.initSmoothScroll();
    },

    /* ===== CURSOR GLOW ===== */
    initCursorGlow() {
        if (this.reducedMotion || this.isTouch) return;

        const glow = document.getElementById('cursor-glow');
        if (!glow) return;

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            glow.style.opacity = '0.4';
        });

        document.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });

        // Smooth follow with lerp
        const update = () => {
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
            requestAnimationFrame(update);
        };
        update();
    },

    /* ===== MAGNETIC BUTTONS ===== */
    initMagneticButtons() {
        if (this.reducedMotion || this.isTouch) return;

        const buttons = document.querySelectorAll('[data-magnetic]');
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const strength = 0.25;
                btn.style.transform = `translate(${x * strength}px, ${y * strength}px) translateY(-2px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    },

    /* ===== CARD TILT ===== */
    initCardTilt() {
        if (this.reducedMotion || this.isTouch) return;

        const cards = document.querySelectorAll('[data-tilt]');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    },

    /* ===== NAVIGATION: ACTIVE SECTION + INDICATOR ===== */
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[data-section]');
        const indicator = document.getElementById('nav-indicator');

        // Active section tracking
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.dataset.section;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.dataset.section === id);
                    });
                    this.moveNavIndicator(id);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -40% 0px'
        });

        sections.forEach(s => observer.observe(s));
    },

    moveNavIndicator(sectionId) {
        const indicator = document.getElementById('nav-indicator');
        const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (!indicator || !activeLink) return;

        const nav = document.querySelector('.nav');
        const navRect = nav.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        indicator.style.width = linkRect.width + 'px';
        indicator.style.left = (linkRect.left - navRect.left) + 'px';
        indicator.classList.add('visible');
    },

    /* ===== SMOOTH SCROLL ===== */
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href.length < 2) return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPos = target.offsetTop - navHeight - 20;
                    window.scrollTo({
                        top: targetPos,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navLinks = document.getElementById('nav-links');
                    const hamburger = document.getElementById('nav-hamburger');
                    if (navLinks && navLinks.classList.contains('open')) {
                        navLinks.classList.remove('open');
                        hamburger.classList.remove('open');
                        hamburger.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });
    },

    /* ===== THEME TOGGLE ===== */
    initThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) return;

        // Load saved theme
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        toggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';

            // Smooth transition
            document.documentElement.style.transition = 'background 0.4s ease, color 0.4s ease';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('portfolio-theme', next);

            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 500);
        });
    },

    /* ===== DEVELOPER TERMINAL ===== */
    initTerminal() {
        const input = document.getElementById('terminal-input');
        const output = document.getElementById('terminal-output');
        const prompt = document.getElementById('terminal-prompt');
        if (!input || !output) return;
        const translatedPrompt = DataLoader.translations?.translations?.terminal?.prompt;
        if (prompt && translatedPrompt) prompt.textContent = translatedPrompt;
        const translatedPlaceholder = DataLoader.translations?.translations?.terminal?.placeholder;
        if (translatedPlaceholder) input.placeholder = translatedPlaceholder;

        const settings = DataLoader.data.settings;
        if (!settings || !settings.terminalCommands) return;
        const commands = settings.terminalCommands;

        // Welcome message — translated when available.
        const welcome = DataLoader.translations?.translations?.terminal?.welcome || 'Study space ready. Type "help" for a few useful notes.';
        this.terminalPrint(output, welcome, 'response');

        // Input handler
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim().toLowerCase();
                if (cmd) {
                    this.terminalExecute(cmd, output, commands);
                }
                input.value = '';
            }
        });

        // Click anywhere in terminal focuses input
        const terminalBody = document.getElementById('terminal-body');
        if (terminalBody) {
            terminalBody.addEventListener('click', () => {
                input.focus();
            });
        }

        // Quick command buttons
        document.querySelectorAll('.terminal-cmd-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const cmd = btn.dataset.cmd;
                this.terminalExecute(cmd, output, commands);
                input.focus();
            });
        });

        // Show/hide cursor based on focus
        const cursor = document.getElementById('terminal-cursor');
        if (cursor) {
            input.addEventListener('focus', () => cursor.style.display = 'none');
            input.addEventListener('blur', () => cursor.style.display = 'block');
        }
    },

    terminalExecute(cmd, outputEl, commands) {
        // Print command
        this.terminalPrint(outputEl, cmd, 'command');

        // Execute
        if (cmd === 'clear') {
            outputEl.innerHTML = '';
            return;
        }

        const response = commands[cmd];
        if (response) {
            // Type out response lines
            response.forEach((line, i) => {
                setTimeout(() => {
                    this.terminalPrint(outputEl, line, 'response');
                }, i * 200);
            });
        } else {
            this.terminalPrint(outputEl, `No note found for: ${cmd}. Type 'help' for available commands.`, 'response');
        }
    },

    terminalPrint(outputEl, text, type) {
        const line = document.createElement('div');
        line.className = `terminal-output-line ${type}`;
        line.textContent = text;
        outputEl.appendChild(line);

        // Auto-scroll
        const terminalBody = document.getElementById('terminal-body');
        if (terminalBody) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    },

    /* ===== COPY EMAIL / CONTACT ===== */
    initCopyEmail() {
        const btn = document.getElementById('contact-email-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const email = btn.dataset.email || '';
            if (!email) return;

            // Copy to clipboard
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    this.showToast(DataLoader.translations?.translations?.contact?.copied || 'Email copied to clipboard!');
                }).catch(() => {
                    this.fallbackCopy(email);
                });
            } else {
                this.fallbackCopy(email);
            }
        });
    },

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            this.showToast(DataLoader.translations?.translations?.contact?.copied || 'Email copied to clipboard!');
        } catch (err) {
            this.showToast('Copy failed — please copy manually');
        }
        document.body.removeChild(textarea);
    },

    /* ===== TOAST NOTIFICATION ===== */
    showToast(message) {
        const toast = document.getElementById('toast');
        const text = document.getElementById('toast-text');
        if (!toast || !text) return;

        text.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },

    /* ===== FLOATING HUD TOGGLE ===== */
    initFloatingHUD() {
        const hud = document.getElementById('floating-hud');
        const toggle = document.getElementById('floating-hud-toggle');
        if (!hud || !toggle) return;

        // Load saved state
        const saved = localStorage.getItem('portfolio-hud');
        if (saved === 'collapsed') {
            hud.classList.add('collapsed');
        }

        toggle.addEventListener('click', () => {
            hud.classList.toggle('collapsed');
            localStorage.setItem('portfolio-hud',
                hud.classList.contains('collapsed') ? 'collapsed' : 'expanded');
        });

        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    },

    /* ===== HAMBURGER MENU ===== */
    initHamburger() {
        const hamburger = document.getElementById('nav-hamburger');
        const navLinks = document.getElementById('nav-links');
        if (!hamburger || !navLinks) return;

        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('menu-open', isOpen);
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
                hamburger.focus();
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    hamburger.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    }
};
