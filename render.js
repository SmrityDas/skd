/* ============================================================
   RSV LAB — RENDER ENGINE
   ============================================================
   
   This script reads window.SITE (from content.js) and builds
   the entire page. You should not need to edit this file for
   content changes — only content.js needs editing.
   
   What it does:
     1. Verifies content.js loaded successfully
     2. Reads each section from SITE
     3. Builds HTML strings from the data
     4. Injects them into containers by ID
   
   Safety features:
     • Missing fields are skipped (never crashes)
     • Empty sections hide themselves
     • All user content is HTML-escaped
     • External links get rel="noopener" automatically
   
   ============================================================ */

(function render() {
    "use strict";

    /* ============================================================
       HELPERS — short utility functions used everywhere below
       ============================================================ */

    /* getElementById shorthand */
    const $ = id => document.getElementById(id);

    /* has(v) → returns true if v is a non-empty array, string, or value.
       Used to check "does this section have content?" */
    const has = v => Array.isArray(v)
        ? v.length > 0
        : (v !== undefined && v !== null && v !== '');

    /* esc(s) → escapes special HTML characters so user content
       can never break the page or inject scripts.
       Example: "<script>" becomes "&lt;script&gt;" */
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[c]));

    /* hideSection(id) → finds the closest <section> ancestor
       of the given ID and hides it. Used when a section's
       data array is empty. */
    const hideSection = id => {
        const el = $(id);
        if (el) {
            const sec = el.closest('section');
            if (sec) sec.style.display = 'none';
        }
    };

    /* ============================================================
       STEP 1 — Verify that content.js actually loaded
       ============================================================
       If window.SITE is missing, something went wrong with loading
       content.js. Show a visible banner so the failure is obvious. */
    const S = window.SITE;
    if (!S) {
        console.error('[RSV Lab] window.SITE is undefined. content.js did not load.');
        const banner = document.createElement('div');
        banner.textContent = 'Content failed to load — content.js was not found.';
        banner.style.cssText =
            'position:fixed;top:0;left:0;right:0;background:#fee2e2;color:#991b1b;' +
            'padding:14px;text-align:center;font-family:sans-serif;font-size:0.9rem;z-index:9999;';
        document.body.prepend(banner);
        return;
    }

    /* ============================================================
       SECTION A — HEADER (logo, nav, social icons)
       ============================================================ */

    /* ----- Logo ----- */
    const shortName = (S.shortName || S.labName || 'Lab').trim();
    const parts = shortName.split(/\s+/);
    const logoEl = $('nav-logo');
    if (logoEl) {
        /* Optional image */
        const logoImg = S.logo
            ? `<img src="${esc(S.logo)}" alt="" loading="lazy" onerror="this.style.display='none'">`
            : '';

        /* First word orange, rest purple */
        logoEl.innerHTML = logoImg
            + `<span>${esc(parts[0] || '')}</span>`
            + (parts.length > 1
                ? ` <span class="purple">${esc(parts.slice(1).join(' '))}</span>`
                : '');
    }

    /* ----- Nav links + partner pill ----- */
    const navLinksEl = $('nav-links');
    if (navLinksEl) {
        /* Every { label, href } in S.nav becomes an <a> */
        let html = (S.nav || [])
            .map(n => `<a href="${esc(n.href)}">${esc(n.label)}</a>`)
            .join('');

        /* Partner pill appended after nav links */
        if (S.partnerLabUrl) {
            html += `<a href="${esc(S.partnerLabUrl)}" target="_blank" rel="noopener" class="partner-pill">`
                  + `<i class="fas fa-flask"></i> ${esc(S.partnerLabText || 'Partner')}</a>`;
        }

        navLinksEl.innerHTML = html;
    }

    /* ----- Social icons row ----- */
    const navIconsEl = $('nav-icons');
    if (navIconsEl) {
        navIconsEl.innerHTML = [
            S.github   ? `<a href="${esc(S.github)}"   target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>`   : '',
            S.facebook ? `<a href="${esc(S.facebook)}" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook"></i></a>` : '',
            S.youtube  ? `<a href="${esc(S.youtube)}"  target="_blank" rel="noopener" aria-label="YouTube"><i class="fab fa-youtube"></i></a>` : '',
            S.linkedin ? `<a href="${esc(S.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>` : '',
        ].join('');
    }

    /* ============================================================
       SECTION B — HERO (title, subtitle, badge, CTAs, chips)
       ============================================================ */

    /* Browser tab title */
    if (S.labName) {
        document.title = `${S.labName} | ${S.tagline || ''}`.trim();
    }

    /* Big hero title — part 1 plain, part 2 purple */
    const heroTitleEl = $('hero-title');
    if (heroTitleEl) {
        heroTitleEl.innerHTML =
            `${esc(S.taglinePart1 || '')} ` +
            (S.taglinePart2 ? `<span class="purple">${esc(S.taglinePart2)}</span>` : '');
    }

    /* Hero paragraph */
    const heroSubEl = $('hero-subtitle');
    if (heroSubEl) heroSubEl.textContent = S.description || '';

    /* Founder badge (avatar + text) */
    const heroBadgeEl = $('hero-badge');
    if (heroBadgeEl) {
        const name = S.founderName || '';
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Lab')}&background=FF8C00&color=fff&size=56`;
        heroBadgeEl.innerHTML =
            `<img src="${avatarUrl}" alt="${esc(name)}" loading="lazy">` +
            `${esc(S.heroBadge || (name ? `Founded by ${name}` : ''))}`;
    }

    /* Two CTA buttons */
    const heroCtasEl = $('hero-ctas');
    if (heroCtasEl) {
        let html = '';
        if (S.heroCtaPrimary) {
            html += `<a href="${esc(S.heroCtaPrimary.href)}" class="btn btn-primary">`
                  + `${esc(S.heroCtaPrimary.label)} <i class="fas fa-arrow-right"></i></a>`;
        }
        if (S.heroCtaSecondary) {
            html += `<a href="${esc(S.heroCtaSecondary.href)}" target="_blank" rel="noopener" class="btn btn-secondary">`
                  + `<i class="fab fa-github"></i> ${esc(S.heroCtaSecondary.label)}</a>`;
        }
        heroCtasEl.innerHTML = html;
    }

    /* Highlight chips */
    const heroHighlightsEl = $('hero-highlights');
    if (heroHighlightsEl && has(S.heroHighlights)) {
        heroHighlightsEl.innerHTML = S.heroHighlights.map(h =>
            `<span class="hero-highlight"><i class="fas ${esc(h.icon)}"></i> ${esc(h.label)}</span>`
        ).join('');
    }
   
       /* ============================================================
       NOTICE BOARD — update + deadline pills
       ============================================================
       
       Renders the two notice pills above the hero title.
       Each pill: pulsing dot + label + message + optional date.
       If a link is present, the whole pill becomes clickable.
       
       Behaviour when data is missing:
         • S.topNotices missing      → hide the whole bar
         • update & deadline both null → hide the whole bar
         • update null only          → show deadline only
         • deadline null only        → show update only
       ============================================================ */

    const topNoticesEl = $('top-notices');
    if (topNoticesEl) {
        /* If content.js has no topNotices block, hide the empty div */
        if (!S.topNotices) {
            topNoticesEl.style.display = 'none';
        } else {
            /* ---- Helper: build one pill ---- */
            const buildNotice = (item, variant) => {
                if (!item) return '';

                /* Append "— date" if a date is present */
                const datePart = item.date
                    ? ` <span class="notice-date">— ${esc(item.date)}</span>`
                    : '';

                /* Inner content of the pill */
                const inner =
                    `<span class="notice-dot"></span>` +
                    `<span class="notice-label">${esc(item.label || '')}</span>` +
                    `<span class="notice-text">${esc(item.text || '')}${datePart}</span>`;

                /* If a link exists → render as <a>, otherwise <div> */
                return item.link
                    ? `<a class="top-notice ${variant}" href="${esc(item.link)}" target="_blank" rel="noopener">${inner}</a>`
                    : `<div class="top-notice ${variant}">${inner}</div>`;
            };

            /* ---- Build both pills ---- */
            const updateHTML   = buildNotice(S.topNotices.update,   'notice-update');
            const deadlineHTML = buildNotice(S.topNotices.deadline, 'notice-deadline');

            /* ---- Inject or hide ---- */
            if (updateHTML || deadlineHTML) {
                topNoticesEl.innerHTML = updateHTML + deadlineHTML;
            } else {
                topNoticesEl.style.display = 'none';
            }
        }
    }
    /* ============================================================
       SECTION C — CARD TEMPLATE
       ============================================================
       One function that turns a card data object into HTML.
       Used for about, research, tools, community channels. */
    function cardHTML(c) {
        /* Icons may be:
           • "fa-dna"                → adds "fas" prefix automatically
           • "fa-brands fa-github"   → used as-is */
        const iconClass = (c.icon || '').includes(' ')
            ? c.icon
            : `fas ${c.icon || 'fa-circle'}`;

        /* Optional image above the icon */
        const image = c.image
            ? `<img src="${esc(c.image)}" alt="${esc(c.title || '')}" class="card-image" loading="lazy">`
            : '';

        /* Optional link + CTA button */
        const link = c.link
            ? `<a href="${esc(c.link)}" target="_blank" rel="noopener" class="card-link">`
              + `${esc(c.cta || 'Learn More')} <i class="fas fa-arrow-right"></i></a>`
            : '';

        /* Full card markup */
        return `<div class="card" style="--card-accent: ${esc(c.color || 'var(--primary-blue)')}">
            ${image}
            <div class="card-icon"><i class="${esc(iconClass)}"></i></div>
            <h3 class="card-title">${esc(c.title || '')}</h3>
            <p class="card-text">${esc(c.text || '')}</p>
            ${link}
        </div>`;
    }

    /* ============================================================
       SECTION D — GENERIC CARD SECTION RENDERER
       ============================================================
       Fills a section with title, subtitle, and cards.
       Called once per card section (about, research, tools). */
    function renderCardsSection(prefix, data) {
        /* Hide the whole section if there are no cards */
        if (!data || !has(data.cards)) {
            hideSection(prefix);
            return;
        }

        /* Title — accents the last word */
        const tEl = $(prefix + '-title');
        if (tEl) tEl.innerHTML = String(data.title || '')
            .replace(/(\S+)\s*$/, '<span>$1</span>');

        /* Subtitle */
        const sEl = $(prefix + '-subtitle');
        if (sEl) sEl.textContent = data.subtitle || '';

        /* Cards grid */
        const gEl = $(prefix + '-cards');
        if (gEl) gEl.innerHTML = data.cards.map(cardHTML).join('');
    }

    /* Render the three standard card sections */
    renderCardsSection('about',    S.about);
    renderCardsSection('research', S.research);
    renderCardsSection('tools',    S.tools);

    /* ============================================================
       SECTION E — PUBLICATIONS
       ============================================================
       A stacked list. Each item shows title, authors, journal,
       and (if present) a DOI link. */
    if (S.publications && has(S.publications.items)) {
        const tEl = $('publications-title');
        if (tEl) tEl.innerHTML = String(S.publications.title || '')
            .replace(/(\S+)\s*$/, '<span>$1</span>');

        const sEl = $('publications-subtitle');
        if (sEl) sEl.textContent = S.publications.subtitle || '';

        const lEl = $('publications-list');
        if (lEl) {
            lEl.innerHTML = S.publications.items.map(p => `
                <div class="publication-item">
                    <h3 class="pub-title">${esc(p.title || '')}</h3>
                    ${p.authors ? `<p class="pub-authors">${esc(p.authors)}</p>` : ''}
                    ${p.journal ? `<p class="pub-journal">${esc(p.journal)}</p>` : ''}
                    ${p.doi ? `<div class="pub-links"><a href="${esc(p.doi)}" target="_blank" rel="noopener" class="pub-link"><i class="fas fa-external-link-alt"></i> DOI</a></div>` : ''}
                </div>`).join('');
        }
    } else {
        hideSection('publications');
    }

    /* ============================================================
       SECTION F — PROJECTS (with working filter tabs)
       ============================================================ */
    if (S.projects && has(S.projects.cards)) {
        const tEl = $('projects-title');
        if (tEl) tEl.innerHTML = String(S.projects.title || '')
            .replace(/(\S+)\s*$/, '<span>$1</span>');

        const sEl = $('projects-subtitle');
        if (sEl) sEl.textContent = S.projects.subtitle || '';

        /* ----- Filter tabs -----
           First filter is active by default.
           Clicking a tab filters cards by data-category. */
        const tabsEl = $('projects-tabs');
        if (tabsEl && has(S.projects.filters)) {
            tabsEl.innerHTML = S.projects.filters
                .map((f, i) => `<button class="${i === 0 ? 'active' : ''}" data-filter="${esc(f.key)}">${esc(f.label)}</button>`)
                .join('');

            tabsEl.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    tabsEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const key = btn.dataset.filter;
                    document.querySelectorAll('.project-card').forEach(card => {
                        const show = (key === 'all' || card.dataset.category === key);
                        card.style.display = show ? 'flex' : 'none';
                    });
                });
            });
        }

        /* ----- Project cards ----- */
        const gEl = $('projects-cards');
        if (gEl) {
            gEl.innerHTML = S.projects.cards.map(p => `
                <div class="card project-card" data-category="${esc(p.category || 'all')}"
                     style="--card-accent: ${esc(p.color || 'var(--primary-blue)')}">
                    <div class="card-icon"><i class="fas ${esc(p.icon || 'fa-code')}"></i></div>
                    <h3 class="card-title">${esc(p.title || '')}</h3>
                    <p class="card-text">${esc(p.text || '')}</p>
                    <a href="${esc(p.link)}" target="_blank" rel="noopener" class="card-link">
                        View Repository <i class="fas fa-arrow-right"></i>
                    </a>
                </div>`).join('');
        }
    } else {
        hideSection('projects');
    }

    /* ============================================================
       SECTION G — TEAM / FOUNDER
       ============================================================ */
    const team = S.team;
    if (team && (team.name || has(team.members))) {
        /* Section title */
        const tEl = $('team-title');
        if (tEl) tEl.innerHTML = String(team.title || '')
            .replace(/(\S+)\s*$/, '<span>$1</span>');

        /* ----- Founder profile ----- */
        const fEl = $('team-founder');
        if (fEl) {
            const avatar = team.avatar
                || `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name || 'Lab')}&background=7614DC&color=fff&size=200`;

            fEl.innerHTML = `
                <img src="${esc(avatar)}" alt="${esc(team.name || '')}" class="founder-avatar" loading="lazy"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(team.name || 'Lab')}&background=7614DC&color=fff&size=200'">
                <div class="founder-info">
                    <h3>${esc(team.name || '')}</h3>
                    <p class="role">${esc(team.role || '')}</p>
                    <p>${esc(team.bio || '')}</p>
                    <div class="founder-social">
                        ${S.github ? `<a href="${esc(S.github)}" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>` : ''}
                        ${S.email ? `<a href="mailto:${esc(S.email)}" aria-label="Email"><i class="fas fa-envelope"></i></a>` : ''}
                        ${team.orcid ? `<a href="${esc(team.orcid)}" target="_blank" rel="noopener" aria-label="ORCID"><i class="fab fa-orcid"></i></a>` : ''}
                    </div>
                </div>`;
        }

        /* ----- Additional members grid (hidden when empty) ----- */
        const mEl = $('team-members');
        if (mEl && has(team.members)) {
            mEl.innerHTML = team.members.map(m => `
                <a class="member" href="${esc(m.url || '#')}" target="_blank" rel="noopener">
                    <img src="${esc(m.avatar || '')}" alt="${esc(m.name || '')}" loading="lazy"
                         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || '')}&background=7614DC&color=fff&size=90'">
                    <div class="member-name">${esc(m.name || '')}</div>
                    <div class="member-role">${esc(m.role || '')}</div>
                </a>`).join('');
        } else if (mEl) {
            mEl.style.display = 'none';
        }
    } else {
        hideSection('team');
    }

    /* ============================================================
       SECTION H — CONTACT
       ============================================================ */
    if (S.contact && has(S.contact.cards)) {
        const tEl = $('contact-title');
        if (tEl) tEl.innerHTML = String(S.contact.title || '')
            .replace(/(\S+)\s*$/, '<span>$1</span>');

        const sEl = $('contact-subtitle');
        if (sEl) sEl.textContent = S.contact.subtitle || '';

        const gEl = $('contact-grid');
        if (gEl) {
            /* Base info cards — c.text is NOT escaped so <br> works */
            const baseCards = S.contact.cards.map(c => `
                <div class="contact-card" style="--card-accent:${esc(c.color || 'var(--primary-blue)')}">
                    <div class="contact-icon"><i class="fas ${esc(c.icon || 'fa-circle')}"></i></div>
                    <h3 class="contact-title">${esc(c.title || '')}</h3>
                    <p class="contact-text">${c.text || ''}</p>
                </div>`);

            /* Branded social buttons */
            const socialCards = (S.contact.socials || []).map(s => `
                <div class="contact-card" style="--card-accent:${esc(s.color || 'var(--primary-blue)')}">
                    <div class="contact-icon"><i class="${esc(s.icon)}"></i></div>
                    <h3 class="contact-title">${esc(s.label)}</h3>
                    <p class="contact-text">${esc(s.text || '')}</p>
                    <a href="${esc(s.url)}" target="_blank" rel="noopener"
                       class="social-btn" style="background-color:${esc(s.color)}">
                        <i class="${esc(s.icon)}"></i> ${esc(s.cta || 'Visit')}
                    </a>
                </div>`);

            gEl.innerHTML = baseCards.join('') + socialCards.join('');
        }
    } else {
        hideSection('contact');
    }

    /* ============================================================
       SECTION I — FOOTER
       ============================================================ */
    const ftEl = $('footer-tagline');
    if (ftEl && S.footer && S.footer.tagline) {
        ftEl.textContent = S.footer.tagline;
    }

    const fcEl = $('footer-copy');
    if (fcEl) {
        fcEl.textContent = (S.footer && S.footer.copyright)
            || `© ${S.year || ''} ${S.labName || ''}`.trim();
    }

    const flEl = $('footer-links');
    if (flEl) {
        let html = (S.nav || [])
            .map(n => `<a href="${esc(n.href)}">${esc(n.label)}</a>`)
            .join('');
        if (S.partnerLabUrl) {
            html += `<a href="${esc(S.partnerLabUrl)}" target="_blank" rel="noopener">`
                  + `${esc(S.partnerLabText || 'Partner')}</a>`;
        }
        flEl.innerHTML = html;
    }

    /* ============================================================
       SECTION J — MOBILE NAVIGATION TOGGLE
       ============================================================
       Wires up the hamburger menu on small screens. */
    const toggleEl = $('nav-toggle');
    const linksEl = $('nav-links');
    if (toggleEl && linksEl) {
        toggleEl.addEventListener('click', () => {
            const open = linksEl.classList.toggle('open');
            toggleEl.setAttribute('aria-expanded', String(open));
        });

        /* Auto-close when a link is clicked */
        linksEl.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                linksEl.classList.remove('open');
                toggleEl.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ============================================================
       SECTION K — BACK-TO-TOP BUTTON
       ============================================================
       Shows after scrolling 400 px. Smooth-scrolls to top. */
    const backTopEl = $('back-to-top');
    if (backTopEl) {
        window.addEventListener('scroll', () => {
            backTopEl.classList.toggle('visible', window.scrollY > 400);
        });
        backTopEl.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ============================================================
       SECTION L — SECURE EXTERNAL LINKS
       ============================================================
       Automatically adds rel="noopener noreferrer" to every
       external link. Prevents "tabnabbing" security issues. */
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
        const rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
        if (!rel.includes('noopener'))   rel.push('noopener');
        if (!rel.includes('noreferrer')) rel.push('noreferrer');
        a.setAttribute('rel', rel.join(' '));
    });

    /* ============================================================
       Done! Log a message for debugging. */
    console.log('[RSV Lab] Renderer finished.');
})();
