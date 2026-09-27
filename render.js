/* ============================================================
   RSV LAB — RENDER ENGINE (rewritten, defensive)
   ------------------------------------------------------------
   Reads window.SITE and fills every section. Safe if any field
   is missing. Logs a clear error if content.js failed to load.
   ============================================================ */

(function render() {
    "use strict";

    /* ---------- tiny helpers ---------- */
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

    /* ---------- WAIT FOR SITE ----------
       content.js may load slightly after render.js if scripts are
       deferred or async. Poll up to ~1 second before giving up. */
    const S = window.SITE;

    if (!S) {
        console.error(
            '[RSV Lab] window.SITE is undefined. content.js did not load or did not run.\n' +
            'Check DevTools → Network → confirm "content.js" returns 200 (not 404).\n' +
            'Check DevTools → Console → look for red errors above this one.'
        );
        // Show a visible banner so the failure is not silent
        const banner = document.createElement('div');
        banner.textContent = 'Content failed to load — content.js was not found or did not execute.';
        banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#fee2e2;color:#991b1b;padding:14px;text-align:center;font-family:sans-serif;font-size:0.9rem;z-index:9999;';
        document.body.prepend(banner);
        return;
    }

    console.log('[RSV Lab] Renderer started. Content keys:', Object.keys(S).join(', '));

    /* ---------- HEADER ---------- */
    const shortName = (S.shortName || S.labName || 'Lab').trim();
    const parts = shortName.split(/\s+/);
    const logoEl = $('nav-logo');
    if (logoEl) {
        const logoImg = S.logo
            ? `<img src="${esc(S.logo)}" alt="${esc(S.labName || 'Lab')} logo" loading="lazy" onerror="this.style.display='none'">`
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

    /* ---------- HERO ---------- */
    if (S.labName) document.title = `${S.labName} | ${S.tagline || ''}`.trim();

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

    /* ---------- CARD TEMPLATE ---------- */
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

    /* ---------- GENERIC CARD SECTION RENDERER ---------- */
    function renderCardsSection(prefix, sectionData) {
        if (!sectionData || !has(sectionData.cards)) {
            hideSection(prefix);
            return;
        }
        const titleEl = $(prefix + '-title');
        if (titleEl) {
            // Accent the last word
            titleEl.innerHTML = String(sectionData.title || '')
                .replace(/(\S+)\s*$/, '<span>$1</span>');
        }
        const subEl = $(prefix + '-subtitle');
        if (subEl) subEl.textContent = sectionData.subtitle || '';
        const gridEl = $(prefix + '-cards');
        if (gridEl) gridEl.innerHTML = sectionData.cards.map(cardHTML).join('');
    }

    renderCardsSection('about',    S.about);
    renderCardsSection('research', S.research);
    renderCardsSection('tools',    S.tools);

    /* ---------- PUBLICATIONS ---------- */
    if (S.publications && has(S.publications.items)) {
        const titleEl = $('publications-title');
        if (titleEl) titleEl.innerHTML = String(S.publications.title || '')
            .replace(/(\S+)\s*$/, '<span>$1</span>');
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

    /* ---------- TEAM ---------- */
    const team = S.team;
    if (team && (team.name || has(team.members))) {
        const titleEl = $('team-title');
        if (titleEl) titleEl.innerHTML = String(team.title || '')
            .replace(/(\S+)\s*$/, '<span>$1</span>');

        const founderEl = $('team-founder');
        if (founderEl) {
            const avatar = team.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name || 'Lab')}&background=7614DC&color=fff&size=200`;
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

    /* ---------- COMMUNITY ---------- */
    if (S.community) {
        const titleEl = $('community-title');
        if (titleEl) titleEl.innerHTML = String(S.community.title || '')
            .replace(/(\S+)\s*$/, '<span>$1</span>');
        const subEl = $('community-subtitle');
        if (subEl) subEl.textContent = S.community.subtitle || '';

        // Channels reuse the card renderer
        if (has(S.community.channels)) {
            const channelsEl = $('community-channels');
            if (channelsEl) channelsEl.innerHTML = S.community.channels.map(cardHTML).join('');
        } else {
            const channelsEl = $('community-channels');
            if (channelsEl) channelsEl.style.display = 'none';
        }

        // Stats
        if (has(S.community.stats)) {
            const statsEl = $('community-stats');
            if (statsEl) statsEl.innerHTML = S.community.stats.map(s => `
                <div>
                    <div class="stat-value">${esc(s.value)}</div>
                    <div class="stat-label">${esc(s.label)}</div>
                </div>`).join('');
        } else {
            const statsEl = $('community-stats');
            if (statsEl) statsEl.style.display = 'none';
        }

        // Contributors
        if (has(S.community.contributors)) {
            const contribEl = $('community-contributors');
            if (contribEl) contribEl.innerHTML = S.community.contributors.map(p => `
                <a class="contributor" href="${esc(p.url || '#')}" target="_blank" rel="noopener">
                    <img src="${esc(p.avatar || '')}" alt="${esc(p.name || '')}" loading="lazy"
                         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || '')}&background=7614DC&color=fff&size=90'">
                    <div class="contributor-name">${esc(p.name || '')}</div>
                    <div class="contributor-role">${esc(p.role || '')}</div>
                </a>`).join('');
        } else {
            const contribEl = $('community-contributors');
            if (contribEl) contribEl.style.display = 'none';
            const headEl = $('community-contrib-head');
            if (headEl) headEl.style.display = 'none';
        }
    } else {
        hideSection('community');
    }

    /* ---------- COLLABORATION BANNER ---------- */
    if (S.collab && S.partnerLabUrl) {
        const titleEl = $('collab-title');
        if (titleEl) {
            // Accent the partner name (last word or "X Lab")
            titleEl.innerHTML = String(S.collab.title || '')
                .replace(/([\w-]+ Lab|\S+)\s*$/, '<span>$1</span>');
        }
        const textEl = $('collab-text');
        if (textEl) textEl.textContent = S.collab.text || '';
        const btnEl = $('collab-btn');
        if (btnEl) {
            btnEl.href = S.partnerLabUrl;
            btnEl.innerHTML = `<i class="fas fa-external-link-alt"></i> ${esc(S.collab.cta || 'Visit')}`;
        }
    } else {
        const sec = $('collab-section');
        if (sec) sec.style.display = 'none';
    }

    /* ---------- CONTACT ---------- */
    if (S.contact && has(S.contact.cards)) {
        const titleEl = $('contact-title');
        if (titleEl) titleEl.innerHTML = String(S.contact.title || '')
            .replace(/(\S+)\s*$/, '<span>$1</span>');
        const subEl = $('contact-subtitle');
        if (subEl) subEl.textContent = S.contact.subtitle || '';
        const gridEl = $('contact-grid');
        if (gridEl) gridEl.innerHTML = S.contact.cards.map(c => `
            <div class="contact-card" style="--card-accent:${esc(c.color || 'var(--primary-blue)')}">
                <div class="contact-icon"><i class="fas ${esc(c.icon || 'fa-circle')}"></i></div>
                <h3 class="contact-title">${esc(c.title || '')}</h3>
                <p class="contact-text">${esc(c.text || '')}</p>
            </div>`).join('');
    } else {
        hideSection('contact');
    }

    /* ---------- FOOTER ---------- */
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
            html += `<a href="${esc(S.partnerLabUrl)}" target="_blank" rel="noopener">${esc(S.partnerLabText || 'Partner')}</a>`;
        }
        footerLinksEl.innerHTML = html;
    }

    /* ---------- MOBILE NAV TOGGLE ---------- */
    const navToggleEl = $('nav-toggle');
    const navLinksToggleTarget = $('nav-links');
    if (navToggleEl && navLinksToggleTarget) {
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

    console.log('[RSV Lab] Renderer finished.');
})();
