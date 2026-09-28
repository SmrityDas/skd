/* ============================================================
   RSV LAB — RENDER ENGINE
   ------------------------------------------------------------
   Reads window.SITE from content.js and fills the page.
   Do NOT edit unless changing behaviour.
   • Sections with empty arrays hide themselves.
   • Missing fields are skipped safely.
   • All user content is HTML-escaped.
   ============================================================ */

(function render() {
    "use strict";

    /* ---------- helpers ---------- */
    const $   = id => document.getElementById(id);
    const has = v => Array.isArray(v) ? v.length > 0 : (v !== undefined && v !== null && v !== '');
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));

    const hideSection = id => {
        const el = $(id);
        if (el) {
            const sec = el.closest('section');
            if (sec) sec.style.display = 'none';
        }
    };

    /* ---------- verify content loaded ---------- */
    const S = window.SITE;
    if (!S) {
        console.error('[RSV Lab] window.SITE is undefined. content.js did not load.');
        const banner = document.createElement('div');
        banner.textContent = 'Content failed to load — content.js was not found.';
        banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#fee2e2;color:#991b1b;padding:14px;text-align:center;font-family:sans-serif;font-size:0.9rem;z-index:9999;';
        document.body.prepend(banner);
        return;
    }
    console.log('[RSV Lab] Renderer started. Keys:', Object.keys(S).join(', '));

    /* ============ HEADER ============ */
    const shortName = (S.shortName || S.labName || 'Lab').trim();
    const parts = shortName.split(/\s+/);
    const logoEl = $('nav-logo');
    if (logoEl) {
        const logoImg = S.logo
            ? `<img src="${esc(S.logo)}" alt="" loading="lazy" onerror="this.style.display='none'">`
            : '';
        logoEl.innerHTML = logoImg
            + `<span>${esc(parts[0] || '')}</span>`
            + (parts.length > 1 ? ` <span class="purple">${esc(parts.slice(1).join(' '))}</span>` : '');
    }

    const navLinksEl = $('nav-links');
    if (navLinksEl) {
        let html = (S.nav || [])
            .map(n => `<a href="${esc(n.href)}">${esc(n.label)}</a>`)
            .join('');
        if (S.partnerLabUrl) {
            html += `<a href="${esc(S.partnerLabUrl)}" target="_blank" rel="noopener">`
                  + `<i class="fas fa-flask"></i> ${esc(S.partnerLabText || 'Partner')}</a>`;
        }
        navLinksEl.innerHTML = html;
    }

    const navIconsEl = $('nav-icons');
    if (navIconsEl) {
        navIconsEl.innerHTML = [
            S.github   ? `<a href="${esc(S.github)}"   target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>`   : '',
            S.twitter  ? `<a href="${esc(S.twitter)}"  target="_blank" rel="noopener" aria-label="Twitter"><i class="fab fa-twitter"></i></a>` : '',
            S.youtube  ? `<a href="${esc(S.youtube)}"  target="_blank" rel="noopener" aria-label="YouTube"><i class="fab fa-youtube"></i></a>` : '',
            S.linkedin ? `<a href="${esc(S.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>` : '',
        ].join('');
    }

    /* ============ HERO ============ */
    if (S.labName) {
        document.title = `${S.labName} | ${S.tagline || ''}`.trim();
    }

    const heroTitleEl = $('hero-title');
    if (heroTitleEl) {
        heroTitleEl.innerHTML =
            `${esc(S.taglinePart1 || '')} ` +
            (S.taglinePart2 ? `<span class="purple">${esc(S.taglinePart2)}</span>` : '');
    }
    const heroSubEl = $('hero-subtitle');
    if (heroSubEl) heroSubEl.textContent = S.description || '';

    const heroBadgeEl = $('hero-badge');
    if (heroBadgeEl) {
        const name = S.founderName || '';
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Lab')}&background=FF8C00&color=fff&size=56`;
        heroBadgeEl.innerHTML =
            `<img src="${avatarUrl}" alt="${esc(name)}" loading="lazy">`
          + `${esc(S.heroBadge || (name ? `Founded by ${name}` : ''))}`;
    }

    /* ============ CARD TEMPLATE ============ */
    function cardHTML(c) {
        const iconClass = (c.icon || '').includes(' ')
            ? c.icon
            : `fas ${c.icon || 'fa-circle'}`;
        const image = c.image
            ? `<img src="${esc(c.image)}" alt="${esc(c.title || '')}" class="card-image" loading="lazy">`
            : '';
        const link = c.link
            ? `<a href="${esc(c.link)}" target="_blank" rel="noopener" class="card-link">`
              + `${esc(c.cta || 'Learn More')} <i class="fas fa-arrow-right"></i></a>`
            : '';
        return `<div class="card" style="--card-accent: ${esc(c.color || 'var(--primary-blue)')}">
            ${image}
            <div class="card-icon"><i class="${esc(iconClass)}"></i></div>
            <h3 class="card-title">${esc(c.title || '')}</h3>
            <p class="card-text">${esc(c.text || '')}</p>
            ${link}
        </div>`;
    }

    /* ============ GENERIC CARD SECTION ============ */
    function renderCardsSection(prefix, sectionData) {
        if (!sectionData || !has(sectionData.cards)) {
            hideSection(prefix);
            return;
        }
        const titleEl = $(prefix + '-title');
        if (titleEl) {
            titleEl.innerHTML = String(sectionData.title || '')
                .replace(/(\S+)\s*$/, '<span>$1</span>');
        }
        const subEl = $(prefix + '-subtitle');
        if (subEl) subEl.textContent = sectionData.subtitle || '';
        const gridEl = $(prefix + '-cards');
        if (gridEl) gridEl.innerHTML = sectionData.cards.map(cardHTML).join('');
    }

    renderCardsSection('about', S.about);

    /* ============ PUBLICATIONS ============ */
    if (S.publications && has(S.publications.items)) {
        const titleEl = $('publications-title');
        if (titleEl) {
            titleEl.innerHTML = String(S.publications.title || '')
                .replace(/(\S+)\s*$/, '<span>$1</span>');
        }
        const subEl = $('publications-subtitle');
        if (subEl) subEl.textContent = S.publications.subtitle || '';
        const listEl = $('publications-list');
        if (listEl) {
            listEl.innerHTML = S.publications.items.map(p => `
                <div class="publication-item">
                    <h3 class="pub-title">${esc(p.title || '')}</h3>
                    ${p.authors ? `<p class="pub-authors">${esc(p.authors)}</p>` : ''}
                    ${p.journal ? `<p class="pub-journal">${esc(p.journal)}</p>` : ''}
                    ${p.doi ? `<div class="pub-links"><a href="${esc(p.doi)}" target="_blank" rel="noopener" class="pub-link">DOI</a></div>` : ''}
                </div>`).join('');
        }
    } else {
        hideSection('publications');
    }

    /* ============ PROJECTS ============ */
    if (S.projects && has(S.projects.cards)) {
        const titleEl = $('projects-title');
        if (titleEl) {
            titleEl.innerHTML = String(S.projects.title || '')
                .replace(/(\S+)\s*$/, '<span>$1</span>');
        }
        const subEl = $('projects-subtitle');
        if (subEl) subEl.textContent = S.projects.subtitle || '';

        /* Filter tabs */
        const tabsEl = $('projects-tabs');
        if (tabsEl && has(S.projects.filters)) {
            tabsEl.innerHTML = S.projects.filters.map((f, i) =>
                `<button class="${i === 0 ? 'active' : ''}" data-filter="${esc(f.key)}">${esc(f.label)}</button>`
            ).join('');
            tabsEl.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    tabsEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const key = btn.dataset.filter;
                    document.querySelectorAll('.project-card').forEach(card => {
                        const show = key === 'all' || card.dataset.category === key;
                        card.style.display = show ? 'flex' : 'none';
                    });
                });
            });
        }

        /* Project grid */
        const gridEl = $('projects-cards');
        if (gridEl) {
            gridEl.innerHTML = S.projects.cards.map(p => `
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

    /* ============ TEAM / FOUNDER ============ */
    const team = S.team;
    if (team && (team.name || has(team.members))) {
        const titleEl = $('team-title');
        if (titleEl) {
            titleEl.innerHTML = String(team.title || '')
                .replace(/(\S+)\s*$/, '<span>$1</span>');
        }

        const founderEl = $('team-founder');
        if (founderEl) {
            const avatar = team.avatar
                || `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name || 'Lab')}&background=7614DC&color=fff&size=200`;
            founderEl.innerHTML = `
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

        const memberGridEl = $('team-members');
        if (memberGridEl) {
            if (has(team.members)) {
                memberGridEl.innerHTML = team.members.map(m => `
                    <a class="member" href="${esc(m.url || '#')}" target="_blank" rel="noopener">
                        <img src="${esc(m.avatar || '')}" alt="${esc(m.name || '')}" loading="lazy"
                             onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || '')}&background=7614DC&color=fff&size=90'">
                        <div class="member-name">${esc(m.name || '')}</div>
                        <div class="member-role">${esc(m.role || '')}</div>
                    </a>`).join('');
            } else {
                memberGridEl.style.display = 'none';
            }
        }
    } else {
        hideSection('team');
    }

    /* ============ CONTACT ============ */
    if (S.contact && has(S.contact.cards)) {
        const titleEl = $('contact-title');
        if (titleEl) {
            titleEl.innerHTML = String(S.contact.title || '')
                .replace(/(\S+)\s*$/, '<span>$1</span>');
        }
        const subEl = $('contact-subtitle');
        if (subEl) subEl.textContent = S.contact.subtitle || '';

        const gridEl = $('contact-grid');
        if (gridEl) {
            /* Base cards — HTML in c.text is preserved (allows <br>) */
            const baseCards = S.contact.cards.map(c => `
                <div class="contact-card" style="--card-accent:${esc(c.color || 'var(--primary-blue)')}">
                    <div class="contact-icon"><i class="fas ${esc(c.icon || 'fa-circle')}"></i></div>
                    <h3 class="contact-title">${esc(c.title || '')}</h3>
                    <p class="contact-text">${c.text || ''}</p>
                </div>`);

            /* Social buttons */
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

            gridEl.innerHTML = baseCards.join('') + socialCards.join('');
        }
    } else {
        hideSection('contact');
    }

    /* ============ FOOTER ============ */
    const footerCopyEl = $('footer-copy');
    if (footerCopyEl) {
        footerCopyEl.textContent = (S.footer && S.footer.copyright)
            || `© ${S.year || ''} ${S.labName || ''}`.trim();
    }
    const footerLinksEl = $('footer-links');
    if (footerLinksEl) {
        let html = (S.nav || [])
            .map(n => `<a href="${esc(n.href)}">${esc(n.label)}</a>`)
            .join('');
        if (S.partnerLabUrl) {
            html += `<a href="${esc(S.partnerLabUrl)}" target="_blank" rel="noopener">`
                  + `${esc(S.partnerLabText || 'Partner')}</a>`;
        }
        footerLinksEl.innerHTML = html;
    }

    /* ============ MOBILE NAV TOGGLE ============ */
    const navToggleEl = $('nav-toggle');
    const navLinksToggleTarget = $('nav-links');
    if (navToggleEl && navLinksTarget()) {
        function navLinksTarget() { return navLinksToggleTarget; }
        navToggleEl.addEventListener('click', () => {
            const isOpen = navLinksToggleTarget.classList.toggle('open');
            navToggleEl.setAttribute('aria-expanded', String(isOpen));
        });
        navLinksToggleTarget.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinksToggleTarget.classList.remove('open');
                navToggleEl.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ============ GLOBAL: secure external links ============ */
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
        const rel = (a.getAttribute('rel') || '').split(/\s+/);
        if (!rel.includes('noopener')) rel.push('noopener');
        if (!rel.includes('noreferrer')) rel.push('noreferrer');
        a.setAttribute('rel', rel.filter(Boolean).join(' '));
    });

    console.log('[RSV Lab] Renderer finished.');
})();
