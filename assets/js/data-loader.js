/* ============================================
   SORIYA.SYS — PORTFOLIO V2
   data-loader.js — JSON Data Loading & DOM Population
   ============================================ */

const resolvePortfolioPath = (path) => {
    const base = window.PORTFOLIO_BASE || './';
    return `${base}${path.replace(/^\.\//, '').replace(/^\//, '')}`;
};

const DataLoader = {
    data: {},
    translations: {},

    /* ===== LOAD ALL JSON FILES ===== */
    async loadAll() {
        const files = [
            'data/profile.json',
            'data/skills.json',
            'data/projects.json',
            'data/journey.json',
            'data/achievements.json',
            'data/traits.json',
            'data/social.json',
            'data/settings.json'
        ];

        const keys = ['profile', 'skills', 'projects', 'journey', 'achievements', 'traits', 'social', 'settings'];

        try {
            const responses = await Promise.all(
                files.map(f => fetch(resolvePortfolioPath(f)).then(r => {
                    if (!r.ok) throw new Error(`Failed to load ${f}`);
                    return r.json();
                }))
            );

            responses.forEach((data, i) => {
                this.data[keys[i]] = data;
            });

            // Load translations
            await this.loadTranslations('en');

            return true;
        } catch (err) {
            console.error('DataLoader error:', err);
            return false;
        }
    },

    /* ===== LOAD TRANSLATIONS ===== */
    async loadTranslations(lang) {
        try {
            const res = await fetch(resolvePortfolioPath(`data/${lang}.json`));
            if (!res.ok) throw new Error(`Failed to load ${lang}.json`);
            this.translations = await res.json();
            this.currentLang = lang;
        } catch (err) {
            console.error('Translation load error:', err);
            // Fallback to English
            if (lang !== 'en') {
                const res = await fetch(resolvePortfolioPath('data/en.json'));
                this.translations = await res.json();
                this.currentLang = 'en';
            }
        }
    },

    /* ===== POPULATE ALL CONTENT ===== */
    populateAll() {
        this.populateProfile();
        this.populateSkills();
        this.populateProjects();
        this.populateJourney();
        this.populateAchievements();
        this.populateTraits();
        this.populateSocial();
        this.populateSettings();
        this.applyTranslations();
    },

    /* ===== PROFILE ===== */
    populateProfile() {
        const p = this.data.profile;
        if (!p) return;

        // Hero
        const heroName = document.getElementById('hero-name');
        if (heroName) heroName.textContent = p.name;

        const heroRole = document.querySelector('.hero-role');
        if (heroRole) heroRole.textContent = '';

        const heroDesc = document.getElementById('hero-desc');
        if (heroDesc) heroDesc.textContent = p.description;

        // Hero tags
        const heroTags = document.getElementById('hero-tags');
        if (heroTags && p.heroTags) {
            heroTags.innerHTML = p.heroTags.map(t =>
                `<span class="hero-tag">${t}</span>`
            ).join('');
        }

        // Profile meta
        const profileMeta = document.getElementById('profile-meta');
        if (profileMeta) profileMeta.textContent = `< ${p.role} />`;

        // Profile image
        this.loadProfileImage(p.profileImage, p.profileAlt || p.name);

        // About
        const aboutIntro = document.getElementById('about-intro');
        if (aboutIntro) aboutIntro.textContent = p.aboutIntro;

        const aboutParagraph = document.getElementById('about-paragraph');
        if (aboutParagraph) aboutParagraph.textContent = p.aboutText;

        // About cards
        const aboutCards = document.getElementById('about-cards');
        if (aboutCards && p.aboutCards) {
            aboutCards.innerHTML = p.aboutCards.map((c, i) => `
                <div class="about-card stagger-item" data-stagger="${i}">
                    <div class="about-card-label">${c.label}</div>
                    <div class="about-card-value">${c.value}</div>
                </div>
            `).join('');
        }

        // Dev card
        const devCardBody = document.getElementById('dev-card-body');
        if (devCardBody && p.developerCard) {
            devCardBody.innerHTML = p.developerCard.fields.map(f => `
                <div class="dev-card-field">
                    <span class="dev-card-field-label">${f.label}</span>
                    <span class="dev-card-field-value">${f.value}</span>
                </div>
            `).join('');
        }

        const devCardInitials = document.getElementById('dev-card-initials');
        if (devCardInitials) devCardInitials.textContent = p.initials || 'SM';

        // Contact subtitle
        const contactSubtitle = document.getElementById('contact-subtitle');
        if (contactSubtitle) contactSubtitle.textContent = p.description;

        // Footer year
        const footerYear = document.getElementById('footer-year');
        if (footerYear) footerYear.textContent = new Date().getFullYear();
    },

    /* ===== PROFILE IMAGE LOADER ===== */
    loadProfileImage(url, altText) {
        const img = document.getElementById('profile-image');
        const placeholder = document.getElementById('profile-placeholder');
        if (!img || !placeholder) return;

        if (!url) {
            // No URL — show placeholder
            img.style.display = 'none';
            placeholder.style.display = 'flex';
            return;
        }

        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = url;
            img.alt = altText || 'Profile';
            img.style.display = 'block';
            placeholder.style.display = 'none';
        };
        tempImg.onerror = () => {
            // URL failed — show placeholder
            img.style.display = 'none';
            placeholder.style.display = 'flex';
        };
        tempImg.src = url;
    },

    /* ===== SKILLS ===== */
    populateSkills() {
        const s = this.data.skills;
        if (!s) return;

        const grid = document.getElementById('skills-grid');
        if (!grid) return;

        grid.innerHTML = s.skills.map((skill, i) => `
            <div class="skill-card stagger-item" data-stagger="${i}">
                <div class="skill-icon">${skill.icon}</div>
                <div class="skill-name">${skill.name}</div>
                <div class="skill-category">${skill.category}</div>
                <div class="skill-status" data-status="${skill.status}">
                    <span class="skill-status-dot"></span>
                    ${skill.status}
                </div>
                <div class="skill-desc">${skill.description}</div>
            </div>
        `).join('');
    },

    /* ===== PROJECTS ===== */
    populateProjects() {
        const p = this.data.projects;
        if (!p) return;

        const grid = document.getElementById('projects-grid');
        if (!grid) return;

        const publicProjects = p.projects.filter(project => project.public !== false);

        grid.innerHTML = publicProjects.map((project, i) => {
            const imageHtml = project.image
                ? `<div class="project-image-wrapper" data-project-image="${i}">
                    <div class="project-image-placeholder">
                        <span class="ph-icon">◈</span>
                        <span class="ph-text">LOADING...</span>
                    </div>
                  </div>`
                : `<div class="project-image-wrapper">
                    <div class="project-image-placeholder">
                        <span class="ph-icon">◈</span>
                        <span class="ph-text" data-i18n="imageFallback.unavailable">IMAGE UNAVAILABLE</span>
                        <span class="ph-sub" data-i18n="imageFallback.offline">VISUAL DATA OFFLINE</span>
                    </div>
                  </div>`;

            const statusBadge = project.status
                ? `<span class="project-status-badge" data-status="${project.status}">${project.status}</span>`
                : '';

            const techTags = (project.technologies || []).map(t =>
                `<span class="project-tech-tag">${t}</span>`
            ).join('');

            const demoBtn = project.demo
                ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="project-link project-link--demo">
                    <span data-i18n="projects.liveDemo">LIVE DEMO</span> ↗
                  </a>`
                : '';

            const githubBtn = project.github
                ? `<a href="${project.github}" target="_blank" rel="noopener" class="project-link project-link--github">
                    <span data-i18n="projects.github">GITHUB</span> ↗
                  </a>`
                : '';

                        const adminBtn = project.admin
                                ? `<a href="${project.admin}" target="_blank" rel="noopener noreferrer" class="project-link project-link--github">
                                        Admin Demo ↗
                                    </a>`
                                : '';

            return `
                <article class="project-card stagger-item" data-stagger="${i}">
                    ${imageHtml}
                    ${statusBadge}
                    <div class="project-image-overlay"></div>
                    <div class="project-info">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        ${project.purpose ? `<p class="project-detail"><strong>Purpose:</strong> ${project.purpose}</p>` : ''}
                        ${project.contribution ? `<p class="project-detail"><strong>My contribution:</strong> ${project.contribution}</p>` : ''}
                        <div class="project-tech">${techTags}</div>
                        ${project.features?.length ? `<div class="project-detail"><strong>Key features:</strong> ${project.features.join(' • ')}</div>` : ''}
                        ${project.learning ? `<p class="project-detail"><strong>What I learned:</strong> ${project.learning}</p>` : ''}
                        <div class="project-links">
                            ${demoBtn}
                            ${adminBtn}
                            ${githubBtn}
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        // Load project images asynchronously
        publicProjects.forEach((project, i) => {
            if (project.image) {
                this.loadProjectImage(i, project.image, project.title);
            }
        });
    },

    loadProjectImage(index, url, altText) {
        const wrapper = document.querySelector(`[data-project-image="${index}"]`);
        if (!wrapper) return;

        const tempImg = new Image();
        tempImg.onload = () => {
            wrapper.innerHTML = `
                <img class="project-image" src="${url}" alt="${altText || 'Project'} project screenshot by Soriya Mut" loading="lazy">
                <div class="project-image-overlay"></div>
            `;
        };
        tempImg.onerror = () => {
            wrapper.innerHTML = `
                <div class="project-image-placeholder">
                    <span class="ph-icon">◈</span>
                    <span class="ph-text" data-i18n="imageFallback.unavailable">IMAGE UNAVAILABLE</span>
                    <span class="ph-sub" data-i18n="imageFallback.offline">VISUAL DATA OFFLINE</span>
                </div>
            `;
        };
        tempImg.src = url;
    },

    /* ===== JOURNEY / TIMELINE ===== */
    populateJourney() {
        const j = this.data.journey;
        if (!j) return;

        const timeline = document.getElementById('timeline');
        if (!timeline) return;

        const items = j.timeline.map((item, i) => `
            <div class="timeline-item ${item.current ? 'current' : ''}" data-timeline-item="${i}">
                <div class="timeline-node"></div>
                <div class="timeline-year">${item.year}</div>
                <div class="timeline-card">
                    <h3 class="timeline-title">${item.title}</h3>
                    <div class="timeline-subtitle">${item.subtitle}</div>
                    <p class="timeline-description">${item.description}</p>
                </div>
            </div>
        `).join('');

        timeline.innerHTML = `<div class="timeline-line" id="timeline-line"></div>${items}`;
    },

    /* ===== ACHIEVEMENTS ===== */
    populateAchievements() {
        const a = this.data.achievements;
        if (!a) return;

        const content = document.getElementById('achievements-content');
        if (!content) return;

        if (!a.achievements || a.achievements.length === 0) {
            content.innerHTML = `
                <div class="achievements-empty">
                    <div class="achievements-empty-text" data-i18n="achievements.empty">${a.emptyMessage || 'MORE MILESTONES LOADING...'}</div>
                    <div class="achievements-loading">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
        } else {
            content.innerHTML = `<div class="achievements-grid">` +
                a.achievements.map((ach, i) => `
                    <div class="achievement-card stagger-item" data-stagger="${i}">
                        <div class="achievement-icon">${ach.icon || '★'}</div>
                        <h3 class="achievement-title">${ach.title}</h3>
                        <div class="achievement-date">${ach.date || ''}</div>
                        <p class="achievement-desc">${ach.description || ''}</p>
                    </div>
                `).join('') + `</div>`;
        }
    },

    /* ===== TRAITS ===== */
    populateTraits() {
        const t = this.data.traits;
        if (!t) return;

        const grid = document.getElementById('traits-grid');
        if (!grid) return;

        grid.innerHTML = t.traits.map((trait, i) => `
            <div class="trait-card stagger-item" data-stagger="${i}">
                <span class="trait-icon">${trait.icon}</span>
                <h3 class="trait-title">${trait.title}</h3>
                <p class="trait-description">${trait.description}</p>
            </div>
        `).join('');
    },

    /* ===== SOCIAL / CONTACT ===== */
    populateSocial() {
        const s = this.data.social;
        if (!s) return;

        const socialsContainer = document.getElementById('contact-socials');
        if (socialsContainer) {
            socialsContainer.innerHTML = s.socials.map(social => {
                const iconSvg = this.getSocialIcon(social.icon);
                const hasUrl = social.url && social.url.length > 0;
                return `
                    <a href="${hasUrl ? social.url : '#'}" ${hasUrl ? 'target="_blank" rel="noopener"' : ''}
                       class="social-link ${hasUrl ? '' : 'disabled'}"
                       aria-label="${social.label}" title="${social.label}">
                        ${iconSvg}
                    </a>
                `;
            }).join('');
        }

        // Contact description and email action
        const contactSubtitle = document.getElementById('contact-subtitle');
        if (contactSubtitle && s.contactText) {
            contactSubtitle.textContent = s.contactText;
        }

        const emailBtn = document.getElementById('contact-email-btn');
        if (emailBtn) {
            emailBtn.dataset.email = s.email || '';
        }
    },

    getSocialIcon(name) {
        const icons = {
            github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
            linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
            telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.173-.18 3.149-2.888 3.207-3.131.007-.032.01-.15-.056-.212s-.164-.041-.235-.024c-.1.024-1.695 1.076-4.786 3.158-.453.311-.863.463-1.23.453-.405-.01-1.184-.229-1.762-.418-.71-.23-1.27-.352-1.222-.743.025-.207.3-.418.823-.635 3.224-1.405 5.373-2.335 6.448-2.788 3.068-1.276 3.708-1.499 4.124-1.506z"/></svg>',
            twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
            facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
            email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
            default: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>'
        };
        return icons[name] || icons.default;
    },

    /* ===== SETTINGS (HUD, Terminal, etc) ===== */
    populateSettings() {
        const s = this.data.settings;
        if (!s) return;

        // System HUD section
        const syshudGrid = document.getElementById('syshud-grid');
        if (syshudGrid && s.systemHudData) {
            syshudGrid.innerHTML = s.systemHudData.items.map(item => `
                <div class="syshud-item">
                    <div class="syshud-item-label">${item.label}</div>
                    <div class="syshud-item-value">${item.value}</div>
                    <div class="syshud-item-bar"></div>
                </div>
            `).join('');
        }

        // Floating HUD
        const hudTitle = document.getElementById('floating-hud-title');
        if (hudTitle && s.hudData?.title) hudTitle.textContent = s.hudData.title;

        const hudBody = document.getElementById('floating-hud-body');
        if (hudBody && s.hudData) {
            hudBody.innerHTML = s.hudData.items.map(item => `
                <div class="floating-hud-item">
                    <span class="floating-hud-item-label">${item.label}</span>
                    <span class="floating-hud-item-value">${item.value}</span>
                </div>
            `).join('');
        }
    },

    /* ===== APPLY TRANSLATIONS ===== */
    async applyTranslations() {
        if (!this.translations || !this.translations.translations) return;

        const t = this.translations.translations;

        // Update all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const value = this.getNestedValue(t, key);
            if (value) {
                el.textContent = value;
            }
        });

        // Update placeholder translations
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            const value = this.getNestedValue(t, key);
            if (value) {
                el.placeholder = value;
            }
        });

    },

    getNestedValue(obj, path) {
        return path.split('.').reduce((acc, part) => {
            return acc && acc[part] !== undefined ? acc[part] : null;
        }, obj);
    },

};
