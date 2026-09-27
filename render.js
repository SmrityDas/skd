/* ============================================================
   RSV LAB — UNIVERSAL RENDER ENGINE
   ------------------------------------------------------------
   Reads window.SITE from content.js and fills the page.
   Do NOT edit unless changing behaviour.
   • Sections with empty arrays hide themselves.
   • Missing fields are skipped safely.
   • All user content is HTML-escaped.
   ============================================================ */

(function render() {
    const $   = id => document.getElementById(id);
    const S   = window.SITE || {};
    const has = v => Array.isArray(v) ? v.length > 0 : !!v;
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));

    /* Fail loudly if content.js never loaded, instead of silently
       rendering an empty page with only fallback text. */
    if (!window.SITE) {
        console.error('[RSV Lab] content.js did not load (window.SITE is undefined). Check DevTools → Network tab for a 404 or blocked request on content.js.');
        const banner = document.createElement('div');
        banner.textContent = 'Content failed to load — content.js was not found or did not run. Check your deployment (see README "Troubleshooting").';
        banner.style.cssText = 'background:#fee2e2;color:#991b1b;padding:14px 20px;text-align:center;font-family:sans-serif;font-size:0.9rem;border-bottom:1px solid #fecaca;';
        document.body.prepend(banner);
    }

    /* Hide a section by ID */
    const hideSection = id => {
        const el = $(id);
        if (el) el.closest('section')?.classList.add('hidden');
    };

    /* ---------- HEADER ---------- */
    const parts = (S.shortName || S.labName || 'Lab').split(' ');
    const logo = $('nav-logo');
    if (logo) {
        logo.innerHTML = (S.logo ? `<img src="${esc(S.logo)}" alt="${esc(S.labName || 'Lab')} logo" loading="lazy">` : '')
            + `<span>${esc(parts[0])}</span> <span class="purple">${esc(parts.slice(1).join(' '))}</span>`;
    }

    const navLinks = $('nav-links');
    if (navLinks) {
        navLinks.innerHTML = (S.nav || [])
            .map(n => `<a href="${esc(n.href)}">${esc(n.label)}</a>`).join('')
            + (S.partnerLabUrl
                ? `<a href="${esc(S.partnerLabUrl)}" target="_blank" rel="noopener"><i class="fas fa-flask"></i> ${esc(S.partnerLabText || 'Partner')}</a>`
                : '');
    }

    const navIcons = $('nav-icons');
    if (navIcons) {
        navIcons.innerHTML = [
            S.github   ? `<a href="${esc(S.github)}"   target="_blank" rel="noopener" title="GitHub"   aria-label="GitHub"><i class="fab fa-github"></i></a>`   : '',
            S.twitter  ? `<a href="${esc(S.twitter)}"  target="_blank" rel="noopener" title="Twitter"  aria-label="Twitter"><i class="fab fa-twitter"></i></a>` : '',
            S.youtube  ? `<a href="${esc(S.youtube)}"  target="_blank" rel="noopener" title="YouTube"  aria-label="YouTube"><i class="fab fa-youtube"></i></a>` : '',
            S.linkedin ? `<a href="${esc(S.linkedin)}" target="_blank" rel="noopener" title="LinkedIn" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>` : '',
        ].join('');
    }

    /* ---------- HERO ---------- */
    document.title = `${S.labName || 'Lab'} | ${S.tagline || ''}`.trim();

    const heroTitle = $('hero-title');
    if (heroTitle) {
        heroTitle.innerHTML = `${esc(S.taglinePart1 || '')} <span class="purple">${esc(S.taglinePart2 || '')}</span>`;
    }
    const heroSub = $('hero-subtitle');
    if (heroSub) heroSub.textContent = S.description || '';

    const heroBadge = $('hero-badge');
    if (heroBadge) {
        heroBadge.innerHTML = `
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(S.founderName || 'Lab')}&background=FF8C00&color=fff&size=28"
                 alt="${esc(S.founderName || '')}" loading="lazy">
            ${esc(S.heroBadge || `Founded by ${S.founderName || ''}`)}`;
    }

    /* ---------- CARD HELPER ---------- */
    function cardHTML(c) {
        const iconClass = (c.icon || '').includes(' ') ? c.icon : `fas ${c.icon || 'fa-circle'}`;
        return `<div class="card" style="--card-accent: ${esc(c.color || 'var(--primary-blue)')}">
            ${c.image ? `<img src="${esc(c.image)}" alt="${esc(c.title || '')}" class="card-image" loading="lazy">` : ''}
            <div class="card-icon"><i class="${esc(iconClass)}"></i></div>
            <h3 class="card-title">${esc(c.title)}</h3>
            <p class="card-text">${esc(c.text)}</p>
            ${c.link ? `<a href="${esc(c.link)}" target="_blank" rel="noopener" class="card-link">${esc(c.cta || 'Learn More')} <i class="fas fa-arrow-right"></i></a>` : ''}
        </div>`;
    }

    /* ---------- CARD SECTIONS ---------- */
    function renderCards(prefix, key) {
        const s = S[key];
        if (!s || !has(s.cards)) { hideSection(prefix); return; }
        const title = $(prefix + '-title');
        if (title) title.innerHTML = String(s.title || '').replace(/(\w+)$/, '<span>$1</span>');
        const subtitle = $(prefix + '-subtitle');
        if (subtitle) subtitle.textContent = s.subtitle || '';
        const grid = $(prefix + '-cards');
        if (grid) grid.innerHTML = s.cards.map(cardHTML).join('');
    }
    renderCards('about',    'about');
    renderCards('research', 'research');
    renderCards('tools',    'tools');

    /* ---------- PUBLICATIONS ---------- */
    if (has(S.publications?.items)) {
        const pubTitle = $('publications-title');
        if (pubTitle) pubTitle.innerHTML = String(S.publications.title || '').replace(/(\w+)$/, '<span>$1</span>');
        const pubSub = $('publications-subtitle');
        if (pubSub) pubSub.textContent = S.publications.subtitle || '';

        const pubList = $('publications-list');
        if (pubList) {
            pubList.innerHTML = S.publications.items.map(p => `
                <div class="publication-item">
                    <h3 class="pub-title">${esc(p.title)}</h3>
                    ${p.authors ? `<p class="pub-authors">${esc(p.authors)}</p>` : ''}
                    ${p.journal ? `<p class="pub-journal">${esc(p.journal)}</p>` : ''}
                    ${p.doi ? `<div class="pub-links"><a href="${esc(p.doi)}" target="_blank" rel="noopener" class="pub-link">DOI</a></div>` : ''}
                </div>`).join('');
        }
    } else {
        hideSection('publications');
    }

    /* ---------- TEAM ---------- */
    if (S.team && (S.team.name || has(S.team.members))) {
        const teamTitle = $('team-title');
        if (teamTitle) teamTitle.innerHTML = String(S.team.title || '').replace(/(\w+)$/, '<span>$1</span>');

        const founderBox = $('team-founder');
        if (founderBox) {
            founderBox.innerHTML = `
                <img src="${esc(S.team.avatar)}" alt="${esc(S.team.name)}" class="founder-avatar" loading="lazy"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(S.team.name || '')}&background=7614DC&color=fff&size=200'">
                <div class="founder-info">
                    <h3>${esc(S.team.name)}</h3>
                    <p class="role">${esc(S.team.role)}</p>
                    <p>${esc(S.team.bio)}</p>
                    <div class="founder-social">
                        ${S.github ? `<a href="${esc(S.github)}" target="_blank" rel="noopener" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
                        ${S.email ? `<a href="mailto:${esc(S.email)}" title="Email"><i class="fas fa-envelope"></i></a>` : ''}
                        ${S.team.orcid ? `<a href="${esc(S.team.orcid)}" target="_blank" rel="noopener" title="ORCID"><i class="fab fa-orcid"></i></a>` : ''}
                    </div>
                </div>`;
        }

        const memberGrid = $('team-members');
        if (memberGrid) {
            if (has(S.team.members)) {
                memberGrid.innerHTML = S.team.members.map(m => `
                    <a class="member" href="${esc(m.url || '#')}" target="_blank" rel="noopener">
                        <img src="${esc(m.avatar)}" alt="${esc(m.name)}" loading="lazy"
                             onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || '')}&background=7614DC&color=fff&size=90'">
                        <div class="member-name">${esc(m.name)}</div>
                        <div class="member-role">${esc(m.role)}</div>
                    </a>`).join('');
            } else {
                memberGrid.classList.add('hidden');
            }
        }
    } else {
        hideSection('team');
    }

    /* ---------- COMMUNITY ---------- */
    if (S.community) {
        const cTitle = $('community-title');
        if (cTitle) cTitle.innerHTML = String(S.community.title || '').replace(/(\w+)$/, '<span>$1</span>');
        const cSub = $('community-subtitle');
        if (cSub) cSub.textContent = S.community.subtitle || '';

        const channels = $('community-channels');
        if (channels) {
            if (has(S.community.channels)) {
                channels.innerHTML = S.community.channels.map(cardHTML).join('');
            } else {
                channels.classList.add('hidden');
            }
        }

        const stats = $('community-stats');
        if (stats) {
            if (has(S.community.stats)) {
                stats.innerHTML = S.community.stats.map(s => `
                    <div>
                        <div class="stat-value">${esc(s.value)}</div>
                        <div class="stat-label">${esc(s.label)}</div>
                    </div>`).join('');
            } else {
                stats.classList.add('hidden');
            }
        }

        const contribGrid = $('community-contributors');
        if (contribGrid) {
            if (has(S.community.contributors)) {
                contribGrid.innerHTML = S.community.contributors.map(p => `
                    <a class="contributor" href="${esc(p.url || '#')}" target="_blank" rel="noopener">
                        <img src="${esc(p.avatar)}" alt="${esc(p.name)}" loading="lazy"
                             onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || '')}&background=7614DC&color=fff&size=90'">
                        <div class="contributor-name">${esc(p.name)}</div>
                        <div class="contributor-role">${esc(p.role)}</div>
                    </a>`).join('');
            } else {
                contribGrid.classList.add('hidden');
                $('community-contrib-head')?.classList.add('hidden');
            }
        }
    } else {
        hideSection('community');
    }

    /* ---------- COLLAB ---------- */
    if (S.collab && S.partnerLabUrl) {
        const colTitle = $('collab-title');
        if (colTitle) colTitle.innerHTML = String(S.collab.title || '')
            .replace(/([\w-]+ Lab|[\w]+)$/, '<span>$1</span>');
        const colText = $('collab-text');
        if (colText) colText.textContent = S.collab.text || '';
        const colBtn = $('collab-btn');
        if (colBtn) {
            colBtn.href = S.partnerLabUrl;
            colBtn.innerHTML = `<i class="fas fa-external-link-alt"></i> ${esc(S.collab.cta || 'Visit')}`;
        }
    } else {
        $('collab-section')?.classList.add('hidden');
    }

    /* ---------- CONTACT ---------- */
    if (S.contact && has(S.contact.cards)) {
        const cTitle = $('contact-title');
        if (cTitle) cTitle.innerHTML = String(S.contact.title || '').replace(/(\w+)$/, '<span>$1</span>');
        const cSub = $('contact-subtitle');
        if (cSub) cSub.textContent = S.contact.subtitle || '';
        const grid = $('contact-grid');
        if (grid) {
            grid.innerHTML = S.contact.cards.map(c => `
                <div class="contact-card" style="--card-accent:${esc(c.color || 'var(--primary-blue)')}">
                    <div class="contact-icon"><i class="fas ${esc(c.icon || 'fa-circle')}"></i></div>
                    <h3 class="contact-title">${esc(c.title)}</h3>
                    <p class="contact-text">${esc(c.text)}</p>
                </div>`).join('');
        }
    } else {
        hideSection('contact');
    }

    /* ---------- FOOTER ---------- */
    const footerCopy = $('footer-copy');
    if (footerCopy) {
        footerCopy.textContent = S.footer?.copyright || `© ${S.year || ''} ${S.labName || ''}`.trim();
    }
    const footerLinks = $('footer-links');
    if (footerLinks) {
        footerLinks.innerHTML = (S.nav || [])
            .map(n => `<a href="${esc(n.href)}">${esc(n.label)}</a>`).join('')
            + (S.partnerLabUrl
                ? `<a href="${esc(S.partnerLabUrl)}" target="_blank" rel="noopener">${esc(S.partnerLabText || 'Partner')}</a>`
                : '');
    }

    /* ---------- MOBILE NAV TOGGLE ---------- */
    const navToggle = $('nav-toggle');
    const links = $('nav-links');
    if (navToggle && links) {
        navToggle.addEventListener('click', () => {
            const isOpen = links.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                links.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
})();
