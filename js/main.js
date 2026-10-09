/* ============================================================
   main.js — Portfolio Main Page Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  initPreloader();
  initCursor();
  initScrollProgress();
  initNav();
  initNavDots();

  initTerrain();

  const remoteData = await DB.fetchRemote();
  const data = remoteData || DB.get();

  renderAll(data);
  hidePreloader();
  initShowcase();
  initTypewriter();
  initScrollReveal();
  initCounters();
  initProjectFilter();
  initGalleryLightbox();
  initContactForm();
  initBackToTop();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---- Render all sections ---- */
function renderAll(d) {
  renderHero(d.profile);
  renderAbout(d.profile);
  renderEducation(d.education);
  renderSkills(d.skills, d.technologies);
  renderProjects(d.projects);
  renderShowcase(d.profile, d.projects);
  renderBusiness(d.business);
  renderResume(d.experience, d.achievements, d.profile);
  renderGallery(d.gallery);
  renderContact(d.profile);
  renderFooter(d.profile, d.social);
}

/* ============================================================
   RENDER FUNCTIONS
   ============================================================ */

function renderHero(p) {
  setText('hero-name', p.name);
  setText('hero-desc', `CIS Student at Daffodil International University  •  Web Developer  •  ${p.business ? 'Export-Import Business Owner' : 'Entrepreneur'}`);
  const cvBtn = document.getElementById('cv-download-btn');
  if (cvBtn && p.cvUrl) cvBtn.href = p.cvUrl;
}

function renderAbout(p) {
  setText('about-name', p.name);
  setText('about-bio', p.bio);
  setText('info-name', p.name);
  setText('info-phone', p.phone);
  setText('info-email', p.email);
  setText('info-location', p.location);
  const container = document.getElementById('about-image-container');
  if (container && p.avatar) {
    container.innerHTML = `<img src="${p.avatar}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">`;
  }
  const cvBtn = document.getElementById('cv-btn');
  if (cvBtn && p.cvUrl) cvBtn.href = p.cvUrl;
}

function renderEducation(edu) {
  const tl = document.getElementById('education-timeline');
  if (!tl) return;
  tl.innerHTML = edu.map((e, i) => `
    <div class="timeline-item reveal">
      ${i % 2 === 0 ? '' : '<div class="tl-empty"></div>'}
      ${i % 2 === 0 ? `
        <div class="tl-content">
          <span class="tl-year">${e.duration}</span>
          <div class="tl-degree">${e.degree}</div>
          <div class="tl-institution">${e.institution}</div>
          ${e.location ? `<div class="tl-location">📍 ${e.location}</div>` : ''}
          ${e.grade ? `<div class="tl-grade">🎓 ${e.grade}</div>` : ''}
          <p class="tl-desc">${e.description}</p>
        </div>
        <div class="tl-dot"><div class="tl-dot-inner"></div></div>
        <div class="tl-empty"></div>
      ` : `
        <div class="tl-empty"></div>
        <div class="tl-dot"><div class="tl-dot-inner"></div></div>
        <div class="tl-content">
          <span class="tl-year">${e.duration}</span>
          <div class="tl-degree">${e.degree}</div>
          <div class="tl-institution">${e.institution}</div>
          ${e.location ? `<div class="tl-location">📍 ${e.location}</div>` : ''}
          ${e.grade ? `<div class="tl-grade">🎓 ${e.grade}</div>` : ''}
          <p class="tl-desc">${e.description}</p>
        </div>
      `}
    </div>
  `).join('');
}

function renderSkills(skills, techs) {
  const bars = document.getElementById('skills-bars');
  if (bars) {
    bars.innerHTML = `<div class="skills-title">Technical Proficiency</div>` +
      skills.map(s => `
        <div class="skill-bar-wrap reveal">
          <div class="skill-bar-header">
            <span class="skill-bar-name">${s.name}</span>
            <span class="skill-bar-pct">${s.level}%</span>
          </div>
          <div class="skill-bar-track">
            <div class="skill-bar-fill" data-level="${s.level}" style="width:0%"></div>
          </div>
        </div>
      `).join('');
  }
  const grid = document.getElementById('tech-grid');
  if (grid) {
    grid.innerHTML = techs.map(t => `<span class="tech-tag">${t}</span>`).join('');
  }
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  const filterContainer = document.getElementById('projects-filter');
  if (!grid) return;

  const cats = ['All', ...new Set(projects.map(p => p.category))];
  if (filterContainer) {
    filterContainer.innerHTML = cats.map((c, i) =>
      `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${c === 'All' ? 'all' : c}">${c}</button>`
    ).join('');
  }

  window._allProjects = projects;
  renderProjectCards(projects, grid);
}

function renderProjectCards(projects, grid) {
  if (!projects.length) {
    grid.innerHTML = '<p style="color:var(--text3);text-align:center;padding:3rem;grid-column:1/-1">No projects yet. Add some in the admin panel!</p>';
    return;
  }
  grid.innerHTML = projects.map(p => `
    <div class="project-card reveal" id="project-${p.id}" tabindex="-1" data-category="${p.category}">
      <div class="project-img">
        ${p.image
          ? `<img src="${p.image}" alt="${p.title}">`
          : `<div class="project-img-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`
        }
        <div class="project-overlay">
          ${p.demoUrl && p.demoUrl !== '#' ? `<a href="${p.demoUrl}" target="_blank" class="overlay-btn" title="Live Demo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}
          ${p.codeUrl && p.codeUrl !== '#' ? `<a href="${p.codeUrl}" target="_blank" class="overlay-btn" title="View Code"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></a>` : ''}
        </div>
      </div>
      <div class="project-body">
        <div class="project-cat">${p.category}</div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">${(p.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');
  initCardTilt();
}

function renderBusiness(biz) {
  const container = document.getElementById('business-content');
  if (!container) return;
  container.innerHTML = `
    <div class="business-hero reveal">
      <div class="biz-left">
        <div class="business-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          Registered Business
        </div>
        <h3 class="business-name">${biz.name}</h3>
        <div class="business-type">${biz.type}</div>
        <div class="business-license">${biz.license}</div>
        <p class="business-desc">${biz.description}</p>
        <div class="business-stats-row">
          <div class="biz-stat">
            <span class="biz-stat-num">${biz.established}</span>
            <span class="biz-stat-label">Established</span>
          </div>
          <div class="biz-stat">
            <span class="biz-stat-num">${biz.countries}</span>
            <span class="biz-stat-label">Countries</span>
          </div>
        </div>
      </div>
      <div class="biz-right">
        <h4 style="font-size:1.05rem;font-weight:700;margin-bottom:1.25rem;color:var(--text2)">Our Services</h4>
        <div class="services-grid">
          ${biz.services.map(s => `
            <div class="service-card">
              <div class="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div class="service-title">${s}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderResume(exp, ach, profile) {
  const expList = document.getElementById('experience-list');
  const achList = document.getElementById('achievements-list');

  if (expList) {
    expList.innerHTML = exp.map(e => `
      <div class="resume-entry reveal">
        <div class="resume-entry-title">${e.title}</div>
        <div class="resume-entry-company">${e.company}</div>
        <div class="resume-entry-meta">${e.duration}</div>
        <p class="resume-entry-desc">${e.description}</p>
      </div>
    `).join('');
  }

  if (achList) {
    achList.innerHTML = ach.map(a => `
      <div class="resume-entry reveal">
        <div class="resume-entry-title">${a.title}</div>
        <div class="resume-entry-meta">${a.year}</div>
        <p class="resume-entry-desc">${a.description}</p>
      </div>
    `).join('');
  }

  const dlBtn = document.getElementById('download-cv');
  const cvBtn2 = document.getElementById('cv-download-btn');
  if (dlBtn && profile.cvUrl) dlBtn.href = profile.cvUrl;
  if (cvBtn2 && profile.cvUrl) cvBtn2.href = profile.cvUrl;
}

function renderGallery(gallery) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  if (!gallery || !gallery.length) {
    grid.innerHTML = '<div class="gallery-empty"><p>Gallery coming soon. Visit the admin panel to add images!</p></div>';
    return;
  }
  window._gallery = gallery;
  grid.innerHTML = gallery.map((img, i) => `
    <div class="gallery-item" data-index="${i}">
      <img src="${img.src}" alt="${img.title || img.caption || ''}">
      <div class="gallery-overlay">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
      </div>
      ${(img.title || img.caption) ? `
        <div class="gallery-caption">
          ${img.title ? `<strong>${img.title}</strong>` : ''}
          ${img.description ? `<span>${img.description}</span>` : (img.caption && !img.title ? `<span>${img.caption}</span>` : '')}
        </div>` : ''}
    </div>
  `).join('');
  attachGalleryClicks();
}

function renderContact(profile) {
  setText('contact-email', profile.email);
  setText('contact-phone', profile.phone);
  setText('contact-location', profile.location);
}

function renderFooter(profile, social) {
  setText('footer-name', profile.name);
  renderSocialLinks('footer-social', social, true);
}

function renderSocialLinks(containerId, social, footer = false) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const icons = {
    facebook:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>`,
    linkedin:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
    github:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>`,
    twitter:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    youtube:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white"/></svg>`
  };
  const links = Object.entries(social).filter(([k, v]) => v);
  if (!links.length) {
    container.innerHTML = '';
    return;
  }
  if (footer) {
    container.className = 'footer-social';
    container.style.cssText = 'display:flex;gap:.6rem;flex-wrap:wrap';
  }
  container.innerHTML = links.map(([platform, url]) =>
    `<a href="${url}" target="_blank" rel="noopener" class="social-link" title="${platform.charAt(0).toUpperCase() + platform.slice(1)}">${icons[platform] || ''}</a>`
  ).join('');
}

/* ============================================================
   INTERACTIONS & EFFECTS
   ============================================================ */

function initPreloader() {
  // Whichever comes first: content rendered (hidePreloader) or the page fully loaded
  window.addEventListener('load', hidePreloader);
}

function hidePreloader() {
  const loader = document.getElementById('preloader');
  if (loader) loader.classList.add('hidden');
}

function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline) return;
  // Touch devices: no custom cursor (CSS hides the elements too)
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0, outX = 0, outY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
    if (!document.body.classList.contains('cursor-ready')) {
      outX = mouseX; outY = mouseY;
      document.body.classList.add('cursor-ready');
    }
  });
  document.documentElement.addEventListener('mouseleave', () => document.body.classList.remove('cursor-ready'));

  (function animateCursor() {
    outX += (mouseX - outX) * 0.12;
    outY += (mouseY - outY) * 0.12;
    outline.style.left = outX + 'px';
    outline.style.top  = outY + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('active'); outline.classList.add('active'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('active'); outline.classList.remove('active'); });
  });
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    if (isNavLocked()) return;
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}

function initNav() {
  const nav = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const links = Array.from(menu ? menu.querySelectorAll('.nav-link') : []);

  window.addEventListener('scroll', () => {
    if (isNavLocked()) return; // body is position:fixed while the menu is open
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNav();
  }, { passive: true });

  if (!toggle || !menu) return;

  const mobileMQ = window.matchMedia('(max-width: 768px)');
  const body = document.body;
  let lockedY = 0;
  let inerted = [];

  toggle.setAttribute('aria-controls', menu.id);
  toggle.setAttribute('aria-expanded', 'false');

  const isOpen = () => menu.classList.contains('open');

  function lockScroll() {
    lockedY = window.scrollY;
    body.classList.add('nav-locked');
    // position:fixed is the only reliable scroll lock on iOS Safari
    Object.assign(body.style, { position: 'fixed', top: `-${lockedY}px`, left: '0', right: '0', width: '100%' });
  }

  function unlockScroll() {
    if (!body.classList.contains('nav-locked')) return;
    Object.assign(body.style, { position: '', top: '', left: '', right: '', width: '' });
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto'; // restore instantly, not with smooth scroll
    window.scrollTo(0, lockedY);
    html.style.scrollBehavior = prev;
    body.classList.remove('nav-locked');
  }

  // Keep keyboard/AT focus out of the page behind the open menu
  function setBackgroundInert(on) {
    if (on) {
      inerted = Array.from(body.children).filter(el => el !== nav && !el.inert && el.tagName !== 'SCRIPT');
      inerted.forEach(el => { el.inert = true; });
    } else {
      inerted.forEach(el => { el.inert = false; });
      inerted = [];
    }
  }

  function openMenu(fromKeyboard) {
    menu.classList.add('open');
    nav.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    lockScroll();
    setBackgroundInert(true);
    if (fromKeyboard && links[0]) links[0].focus({ preventScroll: true });
  }

  function closeMenu({ restoreFocus = false } = {}) {
    if (!isOpen() && !body.classList.contains('nav-locked')) return;
    menu.classList.remove('open');
    nav.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    setBackgroundInert(false);
    unlockScroll();
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    if (restoreFocus) toggle.focus({ preventScroll: true });
  }

  // detail === 0 means the click came from the keyboard (Enter/Space)
  toggle.addEventListener('click', e => {
    if (isOpen()) closeMenu({ restoreFocus: true });
    else openMenu(e.detail === 0);
  });

  // Selecting a link closes the menu; the anchor then scrolls from the restored position
  links.forEach(l => l.addEventListener('click', () => closeMenu()));

  // Tap outside closes the menu and is swallowed so it doesn't activate what's underneath
  document.addEventListener('click', e => {
    if (!isOpen() || menu.contains(e.target) || toggle.contains(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  }, true);

  document.addEventListener('keydown', e => {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu({ restoreFocus: true });
    } else if (e.key === 'Tab') {
      // Cycle focus between the toggle and the menu links
      const items = [toggle, ...links];
      const i = items.indexOf(document.activeElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i + 1) % items.length;
      e.preventDefault();
      items[next].focus();
    }
  });

  // Moving to desktop width: drop the mobile menu state and any scroll lock
  const onBreakpoint = () => { if (!mobileMQ.matches) closeMenu(); };
  if (mobileMQ.addEventListener) mobileMQ.addEventListener('change', onBreakpoint);
  else mobileMQ.addListener(onBreakpoint);
}

function isNavLocked() {
  return document.body.classList.contains('nav-locked');
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
  updateNavDots(current);
}

function initNavDots() {
  const sections = ['home','about','education','skills','projects','business','resume','gallery','contact'];
  const nav = document.querySelector('.nav-dots');
  if (!nav) return;
  nav.innerHTML = sections.map(id => `<div class="nav-dot" data-section="${id}" title="${id}"></div>`).join('');
  nav.querySelectorAll('.nav-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function updateNavDots(current) {
  document.querySelectorAll('.nav-dot').forEach(d => {
    d.classList.toggle('active', d.dataset.section === current);
  });
}

/* ---- Hero wireframe landscape ----
   A procedural 2D-canvas terrain: contour rows drawn far → near, each one filling
   the area beneath it so nearer ridges hide what is behind them. Warm light sits on
   the centre horizon, which is placed below the hero text (#hero-horizon). */
function initTerrain() {
  const hero    = document.getElementById('home');
  const canvas  = document.getElementById('terrain-canvas');
  const horizon = document.getElementById('hero-horizon');
  if (!hero || !canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const Z_NEAR = 1.1, Z_FAR = 24, CAM_Y = 1.6, SPEED = 0.2, SPREAD = 1.15;
  let W = 0, H = 0, hY = 0, fx = 0, fy = 0, cols = 0, rows = 0;
  let raf = 0, last = 0, travel = 0, onScreen = true, fill = null, amp = 0.32;
  let bufA = null, bufB = null;

  function height(u, z, zw) {
    const sides = Math.pow(Math.abs(u), 1.7);
    const wave  = Math.sin(u * 3.1 + zw * 0.35) * 0.5
                + Math.sin(u * 7.3 - zw * 0.21 + 1.7) * 0.22
                + Math.sin(zw * 0.6 + u * 1.3) * 0.18;
    const ridge = sides * (1.15 + 0.35 * wave) + (1 - sides) * 0.07 * wave;
    return ridge * amp * z;
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    W = r.width; H = r.height;
    const small = W < 720;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.75);
    cols = small ? 64 : 112;
    rows = small ? 30 : 44;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    hY = horizon ? horizon.offsetTop + Math.min(64, horizon.offsetHeight * 0.2) : H * 0.66;
    // Gentler ridges on tall, narrow screens so they stay clear of the text
    amp = 0.32 * Math.max(0.5, Math.min(1, (W / H) * 1.1));
    fx = W * 0.5;
    fy = Math.max(H - hY, 120) * Z_NEAR / CAM_Y * 1.25;
    fill = ctx.createLinearGradient(0, hY - 40, 0, H);
    fill.addColorStop(0, '#0b0a08');
    fill.addColorStop(0.35, '#070707');
    fill.addColorStop(1, '#050505');
    bufA = new Float32Array((cols + 1) * 2);
    bufB = new Float32Array((cols + 1) * 2);
    draw();
    hero.classList.add('terrain-live');
  }

  function rowGradient(alphaSide, alphaMid, alphaCore) {
    const g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0,    `rgba(150,150,156,${alphaSide})`);
    g.addColorStop(0.3,  `rgba(197,166,101,${alphaMid})`);
    g.addColorStop(0.5,  `rgba(240,212,152,${alphaCore})`);
    g.addColorStop(0.7,  `rgba(197,166,101,${alphaMid})`);
    g.addColorStop(1,    `rgba(150,150,156,${alphaSide})`);
    return g;
  }

  function draw() {
    if (!W) return;
    ctx.clearRect(0, 0, W, H);

    // Light emerging from the centre horizon (an ellipse, wider than tall)
    ctx.save();
    ctx.translate(W / 2, hY);
    ctx.scale(1, 0.42);
    const R = Math.max(W * 0.46, 300);
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    glow.addColorStop(0,    'rgba(244,214,156,.55)');
    glow.addColorStop(0.12, 'rgba(214,180,112,.26)');
    glow.addColorStop(0.42, 'rgba(197,166,101,.07)');
    glow.addColorStop(1,    'rgba(197,166,101,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(-R, -R, R * 2, R * 2);
    ctx.restore();

    // Thin horizon line
    const hl = ctx.createLinearGradient(W * 0.15, 0, W * 0.85, 0);
    hl.addColorStop(0, 'rgba(197,166,101,0)');
    hl.addColorStop(0.5, 'rgba(246,222,170,.7)');
    hl.addColorStop(1, 'rgba(197,166,101,0)');
    ctx.fillStyle = hl;
    ctx.fillRect(W * 0.15, hY - 0.5, W * 0.7, 1);

    const span = Z_FAR - Z_NEAR;
    const step = span / rows;
    const frac = (travel / step) % 1;
    const colStep = cols > 80 ? 7 : 5;
    let prev = null, cur = bufA;

    for (let j = rows; j >= 0; j--) {
      const z    = Z_NEAR + (j + 1 - frac) * step;
      const zw   = z + travel;
      const farT = Math.min(1, (z - Z_NEAR) / span);
      const fadeFar  = Math.max(0, Math.min(1, (1.02 - (z - Z_NEAR) / span) / 0.16));
      const fadeNear = Math.min(1, (z - Z_NEAR) / (step * 1.5) + 0.3);
      const alpha = fadeFar * fadeNear;

      for (let i = 0; i <= cols; i++) {
        const u = (i / cols) * 2 - 1;
        const x = u * SPREAD * z;
        const y = height(u, z, zw);
        cur[i * 2]     = W / 2 + (x * fx) / z;
        cur[i * 2 + 1] = hY + ((CAM_Y - y) * fy) / z;
      }

      // Hide whatever lies behind this ridge
      ctx.beginPath();
      ctx.moveTo(cur[0], cur[1]);
      for (let i = 1; i <= cols; i++) ctx.lineTo(cur[i * 2], cur[i * 2 + 1]);
      ctx.lineTo(cur[cols * 2], H + 2);
      ctx.lineTo(cur[0], H + 2);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();

      if (alpha > 0.01) {
        const base = 0.1 + 0.18 * farT;
        const stroke = rowGradient(base * 0.8, base * 1.5, 0.22 + 0.55 * farT);

        // Longitudinal wires between this row and the one behind it
        if (prev) {
          ctx.beginPath();
          for (let i = 0; i <= cols; i += colStep) {
            ctx.moveTo(prev[i * 2], prev[i * 2 + 1]);
            ctx.lineTo(cur[i * 2], cur[i * 2 + 1]);
          }
          ctx.globalAlpha = alpha * 0.45;
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(cur[0], cur[1]);
        for (let i = 1; i <= cols; i++) ctx.lineTo(cur[i * 2], cur[i * 2 + 1]);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 0.6 + (1 - farT) * 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      prev = cur;
      cur = cur === bufA ? bufB : bufA;
    }
  }

  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    travel += dt * SPEED;
    draw();
    schedule();
  }

  function schedule() {
    if (raf || !onScreen || document.hidden || reduceMQ.matches) return;
    raf = requestAnimationFrame(frame);
  }

  function pause() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
  }

  resize();
  schedule();

  window.addEventListener('resize', resize, { passive: true });
  if ('ResizeObserver' in window) {
    // Hero text renders after data loads, which moves the horizon band
    const ro = new ResizeObserver(() => resize());
    ro.observe(hero);
    if (horizon) ro.observe(horizon);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      onScreen = entries[0].isIntersecting;
      if (onScreen) schedule(); else pause();
    }).observe(hero);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause(); else schedule();
  });
  const onMotionPref = () => { if (reduceMQ.matches) { pause(); draw(); } else schedule(); };
  if (reduceMQ.addEventListener) reduceMQ.addEventListener('change', onMotionPref);
  else if (reduceMQ.addListener) reduceMQ.addListener(onMotionPref);
}

/* ---- Signature showcase: portfolio book that opens into project preview panels ---- */
const SHOWCASE_MAX = 6;

function renderShowcase(profile, projects) {
  const wrap = document.getElementById('showcase');
  const list = document.getElementById('showcase-panels');
  if (!wrap || !list) return;
  const items = (projects || []).slice(0, SHOWCASE_MAX);
  wrap.hidden = !items.length;
  if (!items.length) { list.innerHTML = ''; return; }

  const name = profile.name || '';
  setText('book-name', name);
  setText('book-spine-name', name);
  setText('book-role', profile.title);
  setText('book-mono', name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase());

  const toc = document.getElementById('book-toc');
  if (toc) toc.innerHTML = items.map(p => `<li>${p.title}</li>`).join('');

  list.innerHTML = items.map((p, i) => {
    const external = p.demoUrl && p.demoUrl !== '#';
    const href = external ? p.demoUrl : `#project-${p.id}`;
    const tags = (p.tags || []).slice(0, 3);
    return `
      <li class="panel" style="--i:${i}">
        <a class="panel-link" href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}>
          <span class="panel-chrome" aria-hidden="true"><i></i><i></i><i></i><span class="panel-url">${p.category || ''}</span></span>
          <span class="panel-media">
            ${p.image
              ? `<img src="${p.image}" alt="" loading="lazy">`
              : `<span class="panel-mock panel-mock-${i % 3}" aria-hidden="true">
                  <span class="mock-nav"><i></i><i></i><i></i></span>
                  <span class="mock-title">${p.title}</span>
                  <span class="mock-lines"><i></i><i></i></span>
                  <span class="mock-tags">${tags.map(t => `<i>${t}</i>`).join('')}</span>
                </span>`}
          </span>
          <span class="panel-meta">
            <span class="panel-cat">${p.category || ''}</span>
            <span class="panel-title">${p.title}</span>
            <span class="panel-cta">${external ? 'Live demo ↗' : 'View project →'}</span>
          </span>
        </a>
      </li>`;
  }).join('');
  layoutShowcase();
}

// Positions are in a 1180px-wide design space; the stage scales it to fit (with a little side margin)
function layoutShowcase() {
  const stage = document.getElementById('showcase-stage');
  const scene = document.getElementById('showcase-scene');
  if (!stage || !scene) return;
  const panels = Array.from(scene.querySelectorAll('.panel'));
  const n = panels.length;
  const twoRows = n > 3;
  const perRow = twoRows ? Math.ceil(n / 2) : n;

  panels.forEach((el, i) => {
    const row  = twoRows && i >= perRow ? 1 : 0;
    const col  = row ? i - perRow : i;
    const cols = row ? n - perRow : perRow;
    const mid  = (cols - 1) / 2;
    const x = 200 + (col - mid) * 225 + (twoRows ? (row ? 50 : -50) : 0);
    const y = twoRows ? (row ? 120 : -120) + (col - mid) * 20 : (col - mid) * 92;
    const z = col * 90 + row * 60;
    el.style.setProperty('--tx', `${x}px`);
    el.style.setProperty('--ty', `${y}px`);
    el.style.setProperty('--tz', `${z}px`);
    el.style.setProperty('--d', `${380 + i * 90}ms`);
  });

  stage.style.setProperty('--s', Math.min(1, stage.clientWidth / 1260).toFixed(3));
}

function initShowcase() {
  const wrap   = document.getElementById('showcase');
  const toggle = document.getElementById('showcase-toggle');
  const list   = document.getElementById('showcase-panels');
  if (!wrap || !toggle || !list) return;
  const label  = toggle.querySelector('.showcase-toggle-label');

  let settleTimer = 0;
  const setOpen = open => {
    wrap.classList.toggle('is-open', open);
    // Once the staggered entrance has played, drop the delays so hover feels immediate
    clearTimeout(settleTimer);
    wrap.classList.remove('is-settled');
    if (open) settleTimer = setTimeout(() => wrap.classList.add('is-settled'), 1600);
    if (label) label.textContent = open ? 'Close portfolio' : 'Open portfolio';
  };
  toggle.addEventListener('click', () => setOpen(!wrap.classList.contains('is-open')));

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    setOpen(true);
  } else {
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      setTimeout(() => setOpen(true), 250);
    }, { threshold: 0.35 });
    io.observe(wrap);
  }

  // Panel → its full card in the grid below (clearing a filter that would hide it)
  list.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#project-"]');
    if (!a) return;
    const card = document.getElementById(a.getAttribute('href').slice(1));
    if (!card) return;
    if (card.style.display === 'none') {
      const all = document.querySelector('.filter-btn[data-filter="all"]');
      if (all) all.click();
    }
    card.classList.add('visible');
    setTimeout(() => card.focus({ preventScroll: true }), 700);
  });

  window.addEventListener('resize', layoutShowcase, { passive: true });
}

/* ---- Typewriter ---- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = [
    'Web Developer', 'CIS Student', 'Business Owner',
    'UI/UX Enthusiast', 'Problem Solver', 'Freelancer'
  ];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
      setTimeout(type, 80);
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 300); return; }
      setTimeout(type, 45);
    }
  }
  setTimeout(type, 800);
}

/* ---- Scroll Reveal ---- */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        if (e.target.classList.contains('skill-bar-fill')) {
          e.target.style.width = e.target.dataset.level + '%';
        }
      }
    });
  }, { threshold: .15, rootMargin: '0px 0px -50px 0px' });

  const animate = () => {
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.skill-bar-fill').forEach(el => {
      observer.observe(el);
    });
  };
  animate();
  setTimeout(animate, 800);
}

/* ---- Counters ---- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 40);
      obs.unobserve(el);
    });
  }, { threshold: .5 });
  counters.forEach(c => obs.observe(c));
}

/* ---- Project Filter ---- */
function initProjectFilter() {
  document.addEventListener('click', e => {
    if (!e.target.classList.contains('filter-btn')) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    const filter = e.target.dataset.filter;
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
      card.style.opacity = show ? '1' : '0';
    });
  });
}

/* ---- Card Tilt ---- */
function initCardTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - .5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - .5) * -10;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---- Gallery Lightbox ---- */
function initGalleryLightbox() {
  const lb     = document.getElementById('lightbox');
  const img    = document.getElementById('lightbox-img');
  const cap    = document.getElementById('lightbox-caption');
  const close  = document.getElementById('lightbox-close');
  const prev   = document.getElementById('lightbox-prev');
  const next   = document.getElementById('lightbox-next');
  if (!lb) return;

  let current = 0;

  function open(i) {
    const gallery = window._gallery || [];
    if (!gallery.length) return;
    current = i;
    img.src = gallery[i].src;
    const titleEl = document.getElementById('lightbox-title');
    if (titleEl) titleEl.textContent = gallery[i].title || gallery[i].caption || '';
    cap.textContent = gallery[i].description || (gallery[i].title ? '' : gallery[i].caption || '');
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  close.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  prev.addEventListener('click', () => {
    const gallery = window._gallery || [];
    open((current - 1 + gallery.length) % gallery.length);
  });
  next.addEventListener('click', () => {
    const gallery = window._gallery || [];
    open((current + 1) % gallery.length);
  });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') prev.click();
    if (e.key === 'ArrowRight') next.click();
  });

  window._openLightbox = open;
}

function attachGalleryClicks() {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.index, 10);
      if (window._openLightbox) window._openLightbox(idx);
    });
  });
}

/* ---- Contact Form ---- */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('msg-name').value.trim();
    const email   = document.getElementById('msg-email').value.trim();
    const subject = document.getElementById('msg-subject').value.trim();
    const message = document.getElementById('msg-message').value.trim();

    if (!name || !email || !message) {
      showFormStatus('Please fill in all required fields.', 'error');
      return;
    }

    DB.addMessage({ name, email, subject, message });
    form.reset();
    showFormStatus('Message sent! I will get back to you soon.', 'success');
    showToast('Message sent successfully!', 'success');
  });

  function showFormStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.className   = 'form-status ' + type;
    setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
  }
}

/* ---- Back to Top ---- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (isNavLocked()) return;
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---- Toast ---- */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.className = 'toast', 3500);
}

/* ---- Helpers ---- */
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val || '';
}
