/* ============================================================
   main.js — Portfolio Main Page Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  initPreloader();
  initCursor();
  initScrollProgress();
  initNav();
  initNavDots();

  const remoteData = await DB.fetchRemote();
  const data = remoteData || DB.get();

  renderAll(data);
  initParticles();
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
    <div class="project-card reveal" data-category="${p.category}">
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
        <div class="project-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
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
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('preloader');
      if (loader) loader.classList.add('hidden');
    }, 600);
  });
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

/* ---- Particles ---- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT = 70;
  particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
    r: Math.random() * 2 + 1,
    o: Math.random() * .5 + .1
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${p.o})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(124,58,237,${.15 * (1 - dist / 130)})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
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
