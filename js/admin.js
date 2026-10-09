/* ============================================================
   admin.js — Admin Panel Logic
   ============================================================ */

/* ============================================================
   BOOTSTRAP
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (DB.isLoggedIn()) {
    showApp();
  } else {
    showLogin();
  }
  initLoginForm();
  initMobileMenu();
  initSidebarItems();
  initConfirmDialog();
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    DB.logout();
    showLogin();
  });
});

/* ============================================================
   AUTH
   ============================================================ */
function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-app').classList.remove('active');
}

async function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-app').classList.add('active');
  await DB.fetchRemote();
  loadTab('dashboard');
}

function initLoginForm() {
  const form  = document.getElementById('login-form');
  const error = document.getElementById('login-error');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('login-user').value.trim();
    const p = document.getElementById('login-pass').value;
    if (DB.login(u, p)) {
      showApp();
    } else {
      error.classList.add('show');
      error.textContent = 'Invalid username or password.';
      setTimeout(() => error.classList.remove('show'), 3000);
    }
  });
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initSidebarItems() {
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;
      if (!tab) return;
      document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      loadTab(tab);
      // Close mobile sidebar
      document.getElementById('adm-sidebar').classList.remove('open');
    });
  });
}

function initMobileMenu() {
  const btn   = document.getElementById('mobile-menu-btn');
  const close = document.getElementById('sidebar-close');
  const sb    = document.getElementById('adm-sidebar');
  btn?.addEventListener('click',   () => sb.classList.toggle('open'));
  close?.addEventListener('click', () => sb.classList.remove('open'));
}

function setTopbarTitle(title) {
  const el = document.getElementById('topbar-title');
  if (el) el.textContent = title;
}

/* ============================================================
   TAB ROUTER
   ============================================================ */
function loadTab(tab) {
  const content = document.getElementById('adm-content');
  if (!content) return;
  content.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:200px;color:var(--text3)">Loading...</div>';
  setTimeout(() => {
    const tabs = {
      dashboard:  renderDashboard,
      profile:    renderProfileTab,
      education:  renderEducationTab,
      skills:     renderSkillsTab,
      projects:   renderProjectsTab,
      business:   renderBusinessTab,
      experience: renderExperienceTab,
      gallery:    renderGalleryTab,
      messages:   renderMessagesTab,
      social:     renderSocialTab,
      settings:   renderSettingsTab
    };
    if (tabs[tab]) tabs[tab](content);
    updateMsgBadge();
  }, 100);
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard(el) {
  setTopbarTitle('Dashboard');
  const d = DB.get();
  const unread = (d.messages || []).filter(m => !m.read).length;
  el.innerHTML = `
    <div class="dash-stats">
      <div class="dash-stat-card">
        <div class="dash-stat-icon" style="background:rgba(124,58,237,.12)">
          <svg viewBox="0 0 24 24" fill="none" stroke="#E4CB93" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        </div>
        <div>
          <div class="dash-stat-num">${d.education.length}</div>
          <div class="dash-stat-label">Education</div>
        </div>
      </div>
      <div class="dash-stat-card">
        <div class="dash-stat-icon" style="background:rgba(6,182,212,.12)">
          <svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </div>
        <div>
          <div class="dash-stat-num">${d.projects.length}</div>
          <div class="dash-stat-label">Projects</div>
        </div>
      </div>
      <div class="dash-stat-card">
        <div class="dash-stat-icon" style="background:rgba(245,158,11,.12)">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div>
          <div class="dash-stat-num">${(d.messages || []).length}</div>
          <div class="dash-stat-label">Messages${unread ? ` <span class="message-badge">${unread}</span>` : ''}</div>
        </div>
      </div>
      <div class="dash-stat-card">
        <div class="dash-stat-icon" style="background:rgba(34,197,94,.12)">
          <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
        <div>
          <div class="dash-stat-num">${(d.gallery || []).length}</div>
          <div class="dash-stat-label">Gallery Items</div>
        </div>
      </div>
    </div>

    <div class="dash-row">
      <div class="dash-card">
        <div class="dash-card-header">
          <h3>Recent Messages</h3>
          <button class="adm-btn adm-btn-secondary" style="font-size:.75rem" onclick="loadTabEx('messages')">View All</button>
        </div>
        <div class="dash-card-body">
          ${(d.messages || []).length === 0
            ? '<p style="color:var(--text3);font-size:.85rem">No messages yet.</p>'
            : `<div class="msg-preview-list">${(d.messages || []).slice(0, 5).map(m => `
              <div class="msg-preview ${m.read ? '' : 'unread'}">
                <div class="msg-preview-name">${esc(m.name)} ${!m.read ? '<span class="message-badge">New</span>' : ''}</div>
                <div class="msg-preview-subject">${esc(m.subject || 'No subject')}</div>
                <div class="msg-preview-date">${formatDate(m.date)}</div>
              </div>`).join('')}
            </div>`}
        </div>
      </div>
      <div class="dash-card">
        <div class="dash-card-header">
          <h3>Skills Overview</h3>
          <button class="adm-btn adm-btn-secondary" style="font-size:.75rem" onclick="loadTabEx('skills')">Edit</button>
        </div>
        <div class="dash-card-body">
          ${d.skills.slice(0, 6).map(s => `
            <div class="quick-skill">
              <span class="quick-skill-name">${esc(s.name)}</span>
              <div class="quick-skill-bar"><div class="quick-skill-fill" style="width:${s.level}%"></div></div>
              <span class="quick-skill-pct">${s.level}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function loadTabEx(tab) {
  document.querySelector(`.sidebar-item[data-tab="${tab}"]`)?.click();
}

/* ============================================================
   PROFILE
   ============================================================ */
function renderProfileTab(el) {
  setTopbarTitle('Profile');
  const d = DB.get();
  const p = d.profile;
  el.innerHTML = `
    <div class="section-h"><h2>Edit Profile</h2></div>
    <div class="dash-card">
      <div class="dash-card-body">
        <form id="profile-form">
          <div class="img-upload-wrap" style="margin-bottom:1.5rem">
            <div class="img-preview" id="avatar-preview">
              ${p.avatar ? `<img src="${p.avatar}" id="avatar-img">` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>`}
            </div>
            <input type="file" id="avatar-file" class="img-upload-input" accept="image/*">
            <label for="avatar-file" class="img-upload-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              Upload Photo
            </label>
            ${p.avatar ? `<button type="button" class="adm-btn adm-btn-danger" style="margin-left:.5rem;margin-top:.5rem" onclick="removeAvatar()">Remove</button>` : ''}
          </div>
          <div class="adm-form-row">
            <div class="adm-form-group">
              <label>Full Name *</label>
              <input name="name" value="${esc(p.name)}" placeholder="Your Full Name" required>
            </div>
            <div class="adm-form-group">
              <label>Title</label>
              <input name="title" value="${esc(p.title)}" placeholder="e.g. Web Developer & CIS Student">
            </div>
            <div class="adm-form-group">
              <label>Email *</label>
              <input name="email" type="email" value="${esc(p.email)}" required>
            </div>
            <div class="adm-form-group">
              <label>Phone</label>
              <input name="phone" value="${esc(p.phone)}" placeholder="+880 XXXXXXXXXX">
            </div>
            <div class="adm-form-group">
              <label>Location</label>
              <input name="location" value="${esc(p.location)}" placeholder="Dhaka, Bangladesh">
            </div>
            <div class="adm-form-group">
              <label>CV / Resume URL</label>
              <input name="cvUrl" value="${esc(p.cvUrl || '')}" placeholder="https://... or leave blank">
              <small>Link to Google Drive, Dropbox, or any direct file URL</small>
            </div>
            <div class="adm-form-group adm-form-full">
              <label>Bio / About Me</label>
              <textarea name="bio" rows="5" placeholder="Write about yourself...">${esc(p.bio)}</textarea>
            </div>
          </div>
          <div class="adm-form-actions">
            <button type="submit" class="adm-btn adm-btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('avatar-file')?.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    const prev = document.getElementById('avatar-preview');
    prev.innerHTML = `<div style="color:var(--text3);font-size:.85rem;display:flex;align-items:center;justify-content:center;height:100%">Uploading...</div>`;
    const url = await uploadToImgBB(file);
    if (url) {
      prev.innerHTML = `<img id="avatar-img" src="${url}">`;
      prev.dataset.imgdata = url;
    } else {
      prev.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>`;
    }
  });

  document.getElementById('profile-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const fd  = new FormData(e.target);
    const d   = DB.get();
    const prev = document.getElementById('avatar-preview');
    const newAvatar = prev.dataset.imgdata || d.profile.avatar;
    d.profile = {
      ...d.profile,
      name:     fd.get('name'),
      title:    fd.get('title'),
      email:    fd.get('email'),
      phone:    fd.get('phone'),
      location: fd.get('location'),
      bio:      fd.get('bio'),
      cvUrl:    fd.get('cvUrl'),
      avatar:   newAvatar
    };
    DB.save(d);
    toast('Profile saved!');
  });
}

window.removeAvatar = function() {
  const d = DB.get();
  d.profile.avatar = '';
  DB.save(d);
  document.getElementById('avatar-preview').innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>`;
  toast('Avatar removed');
};

/* ============================================================
   EDUCATION
   ============================================================ */
function renderEducationTab(el) {
  setTopbarTitle('Education');
  const d = DB.get();
  el.innerHTML = `
    <div class="section-h">
      <h2>Education</h2>
      <button class="adm-btn adm-btn-primary" onclick="openEduModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Education
      </button>
    </div>
    <div class="adm-card-list" id="edu-list">
      ${d.education.map(e => `
        <div class="adm-card">
          <div class="adm-card-content">
            <div class="adm-card-title">${esc(e.degree)}</div>
            <div class="adm-card-sub">${esc(e.institution)}</div>
            <div class="adm-card-meta">${esc(e.duration)} ${e.grade ? '• ' + esc(e.grade) : ''}</div>
            <div class="adm-card-desc">${esc(e.description)}</div>
          </div>
          <div class="adm-card-actions">
            <button class="adm-btn adm-btn-secondary" onclick="openEduModal('${e.id}')">Edit</button>
            <button class="adm-btn adm-btn-danger"    onclick="deleteEdu('${e.id}')">Delete</button>
          </div>
        </div>
      `).join('') || '<p style="color:var(--text3)">No education entries yet.</p>'}
    </div>
    ${eduModal()}
  `;

  document.getElementById('edu-form')?.addEventListener('submit', e => {
    e.preventDefault();
    try {
      const fd = new FormData(e.target);
      const d  = DB.get();
      const entry = {
        id:          fd.get('id') || 'edu_' + Date.now(),
        degree:      fd.get('degree'),
        institution: fd.get('institution'),
        location:    fd.get('location'),
        duration:    fd.get('duration'),
        grade:       fd.get('grade'),
        description: fd.get('description')
      };
      const idx = d.education.findIndex(x => x.id === entry.id);
      if (idx >= 0) d.education[idx] = entry; else d.education.push(entry);
      DB.save(d);
      closeModal('edu-modal');
      toast('Education saved!');
      renderEducationTab(document.getElementById('adm-content'));
    } catch(err) {
      toast('Save failed: ' + err.message, 'error');
    }
  });
}

function eduModal() {
  return `
    <div class="adm-modal-overlay" id="edu-modal">
      <div class="adm-modal">
        <div class="adm-modal-header">
          <h3 id="edu-modal-title">Add Education</h3>
          <button class="adm-modal-close" onclick="closeModal('edu-modal')">✕</button>
        </div>
        <div class="adm-modal-body">
          <form id="edu-form">
            <input type="hidden" name="id">
            <div class="adm-form-row">
              <div class="adm-form-group adm-form-full">
                <label>Degree / Certification *</label>
                <input name="degree" required placeholder="B.Sc. in Computer Science">
              </div>
              <div class="adm-form-group">
                <label>Institution *</label>
                <input name="institution" required placeholder="Daffodil International University">
              </div>
              <div class="adm-form-group">
                <label>Location</label>
                <input name="location" placeholder="Dhaka, Bangladesh">
              </div>
              <div class="adm-form-group">
                <label>Duration *</label>
                <input name="duration" required placeholder="2021 – Present">
              </div>
              <div class="adm-form-group">
                <label>Grade / CGPA</label>
                <input name="grade" placeholder="CGPA: 3.5 / 4.0">
              </div>
              <div class="adm-form-group adm-form-full">
                <label>Description</label>
                <textarea name="description" rows="3" placeholder="Briefly describe your studies..."></textarea>
              </div>
            </div>
            <div class="adm-form-actions">
              <button type="button" class="adm-btn adm-btn-secondary" onclick="closeModal('edu-modal')">Cancel</button>
              <button type="submit" class="adm-btn adm-btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;
}

window.openEduModal = function(id) {
  openModal('edu-modal');
  const form  = document.getElementById('edu-form');
  const title = document.getElementById('edu-modal-title');
  form.reset();
  if (id) {
    title.textContent = 'Edit Education';
    const entry = DB.get().education.find(e => e.id === id);
    if (entry) fillForm(form, entry);
  } else {
    title.textContent = 'Add Education';
    form.elements['id'].value = '';
  }
};

window.deleteEdu = function(id) {
  confirm('Delete this education entry?', () => {
    const d = DB.get();
    d.education = d.education.filter(e => e.id !== id);
    DB.save(d);
    toast('Deleted');
    renderEducationTab(document.getElementById('adm-content'));
  });
};

/* ============================================================
   SKILLS
   ============================================================ */
function renderSkillsTab(el) {
  setTopbarTitle('Skills & Technologies');
  const d = DB.get();
  el.innerHTML = `
    <div class="section-h">
      <h2>Skills</h2>
      <button class="adm-btn adm-btn-primary" onclick="openSkillModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Skill
      </button>
    </div>
    <div class="adm-card-list" id="skills-list">
      ${d.skills.map(s => `
        <div class="adm-card">
          <div class="adm-card-content">
            <div class="adm-card-title">${esc(s.name)}</div>
            <div class="adm-card-sub">${esc(s.category)}</div>
            <div style="margin-top:.5rem;display:flex;align-items:center;gap:.75rem">
              <div style="flex:1;height:4px;background:var(--border);border-radius:99px;overflow:hidden">
                <div style="width:${s.level}%;height:100%;background:linear-gradient(90deg,var(--primary),var(--teal));border-radius:99px"></div>
              </div>
              <span style="font-size:.82rem;color:var(--primary-l);font-weight:600">${s.level}%</span>
            </div>
          </div>
          <div class="adm-card-actions">
            <button class="adm-btn adm-btn-secondary" onclick="openSkillModal('${s.id}')">Edit</button>
            <button class="adm-btn adm-btn-danger"    onclick="deleteSkill('${s.id}')">Delete</button>
          </div>
        </div>
      `).join('') || '<p style="color:var(--text3)">No skills yet.</p>'}
    </div>

    <div class="section-h" style="margin-top:2rem">
      <h2>Technologies & Tools</h2>
    </div>
    <div class="dash-card">
      <div class="dash-card-body">
        <div id="tech-tags-list" class="tech-tags-admin">
          ${d.technologies.map(t => `
            <div class="tech-tag-adm">
              <span>${esc(t)}</span>
              <button onclick="deleteTech('${esc(t)}')" title="Remove">✕</button>
            </div>
          `).join('')}
        </div>
        <div class="tech-tag-input" style="margin-top:1rem">
          <div class="adm-form-group" style="margin:0;flex:1">
            <input id="new-tech-input" placeholder="Add technology (e.g. Vue.js)" onkeydown="if(event.key==='Enter'){event.preventDefault();addTech()}">
          </div>
          <button class="adm-btn adm-btn-primary" onclick="addTech()">Add</button>
        </div>
      </div>
    </div>

    <div class="adm-modal-overlay" id="skill-modal">
      <div class="adm-modal">
        <div class="adm-modal-header">
          <h3 id="skill-modal-title">Add Skill</h3>
          <button class="adm-modal-close" onclick="closeModal('skill-modal')">✕</button>
        </div>
        <div class="adm-modal-body">
          <form id="skill-form">
            <input type="hidden" name="id">
            <div class="adm-form-row">
              <div class="adm-form-group">
                <label>Skill Name *</label>
                <input name="name" required placeholder="e.g. JavaScript">
              </div>
              <div class="adm-form-group">
                <label>Category</label>
                <input name="category" placeholder="e.g. Frontend">
              </div>
              <div class="adm-form-group adm-form-full">
                <label>Proficiency Level: <span id="skill-level-display">80</span>%</label>
                <div class="range-wrap" style="margin-top:.5rem">
                  <input type="range" name="level" min="1" max="100" value="80"
                    oninput="document.getElementById('skill-level-display').textContent=this.value">
                </div>
              </div>
            </div>
            <div class="adm-form-actions">
              <button type="button" class="adm-btn adm-btn-secondary" onclick="closeModal('skill-modal')">Cancel</button>
              <button type="submit" class="adm-btn adm-btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.getElementById('skill-form')?.addEventListener('submit', e => {
    e.preventDefault();
    try {
      const fd = new FormData(e.target);
      const d  = DB.get();
      const entry = { id: fd.get('id') || 'sk_' + Date.now(), name: fd.get('name'), category: fd.get('category'), level: parseInt(fd.get('level')) };
      const idx = d.skills.findIndex(s => s.id === entry.id);
      if (idx >= 0) d.skills[idx] = entry; else d.skills.push(entry);
      DB.save(d);
      closeModal('skill-modal');
      toast('Skill saved!');
      renderSkillsTab(document.getElementById('adm-content'));
    } catch(err) {
      toast('Save failed: ' + err.message, 'error');
    }
  });
}

window.openSkillModal = function(id) {
  openModal('skill-modal');
  const form  = document.getElementById('skill-form');
  const title = document.getElementById('skill-modal-title');
  form.reset();
  if (id) {
    title.textContent = 'Edit Skill';
    const s = DB.get().skills.find(x => x.id === id);
    if (s) { fillForm(form, s); document.getElementById('skill-level-display').textContent = s.level; }
  } else {
    title.textContent = 'Add Skill';
    form.elements['id'].value = '';
  }
};

window.deleteSkill = function(id) {
  confirm('Delete this skill?', () => {
    const d = DB.get();
    d.skills = d.skills.filter(s => s.id !== id);
    DB.save(d);
    toast('Deleted');
    renderSkillsTab(document.getElementById('adm-content'));
  });
};

window.addTech = function() {
  const input = document.getElementById('new-tech-input');
  const val   = input?.value.trim();
  if (!val) return;
  const d = DB.get();
  if (!d.technologies.includes(val)) { d.technologies.push(val); DB.save(d); }
  input.value = '';
  renderSkillsTab(document.getElementById('adm-content'));
};

window.deleteTech = function(name) {
  const d = DB.get();
  d.technologies = d.technologies.filter(t => t !== name);
  DB.save(d);
  renderSkillsTab(document.getElementById('adm-content'));
};

/* ============================================================
   PROJECTS
   ============================================================ */
function renderProjectsTab(el) {
  setTopbarTitle('Projects');
  const d = DB.get();
  el.innerHTML = `
    <div class="section-h">
      <h2>Projects</h2>
      <button class="adm-btn adm-btn-primary" onclick="openProjModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Project
      </button>
    </div>
    <div class="adm-card-list">
      ${d.projects.map(p => `
        <div class="adm-card">
          ${p.image ? `<img src="${p.image}" style="width:80px;height:60px;object-fit:cover;border-radius:8px;flex-shrink:0">` : ''}
          <div class="adm-card-content">
            <div class="adm-card-title">${esc(p.title)}</div>
            <div class="adm-card-sub">${esc(p.category)}</div>
            <div class="adm-card-desc">${esc(p.description)}</div>
            <div style="margin-top:.5rem;display:flex;gap:.4rem;flex-wrap:wrap">
              ${p.tags.map(t => `<span style="background:var(--primary-bg);color:var(--primary-l);padding:.15rem .5rem;border-radius:4px;font-size:.72rem">${esc(t)}</span>`).join('')}
            </div>
          </div>
          <div class="adm-card-actions">
            <button class="adm-btn adm-btn-secondary" onclick="openProjModal('${p.id}')">Edit</button>
            <button class="adm-btn adm-btn-danger"    onclick="deleteProj('${p.id}')">Delete</button>
          </div>
        </div>
      `).join('') || '<p style="color:var(--text3)">No projects yet.</p>'}
    </div>

    <div class="adm-modal-overlay" id="proj-modal">
      <div class="adm-modal">
        <div class="adm-modal-header">
          <h3 id="proj-modal-title">Add Project</h3>
          <button class="adm-modal-close" onclick="closeModal('proj-modal')">✕</button>
        </div>
        <div class="adm-modal-body">
          <form id="proj-form">
            <input type="hidden" name="id">
            <div class="adm-form-row">
              <div class="adm-form-group">
                <label>Project Title *</label>
                <input name="title" required placeholder="My Awesome Project">
              </div>
              <div class="adm-form-group">
                <label>Category</label>
                <input name="category" placeholder="Web Development">
              </div>
              <div class="adm-form-group adm-form-full">
                <label>Description</label>
                <textarea name="description" rows="3" placeholder="Describe the project..."></textarea>
              </div>
              <div class="adm-form-group">
                <label>Live Demo URL</label>
                <input name="demoUrl" placeholder="https://...">
              </div>
              <div class="adm-form-group">
                <label>Code / GitHub URL</label>
                <input name="codeUrl" placeholder="https://github.com/...">
              </div>
              <div class="adm-form-group adm-form-full">
                <label>Tags (comma separated)</label>
                <input name="tags" placeholder="HTML, CSS, JavaScript">
              </div>
              <div class="adm-form-group adm-form-full">
                <label>Project Image</label>
                <div class="img-preview" id="proj-img-preview" style="width:100%;height:160px">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <input type="file" id="proj-img-file" class="img-upload-input" accept="image/*">
                <label for="proj-img-file" class="img-upload-label" style="margin-top:.5rem">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                  Upload Image
                </label>
              </div>
            </div>
            <div class="adm-form-actions">
              <button type="button" class="adm-btn adm-btn-secondary" onclick="closeModal('proj-modal')">Cancel</button>
              <button type="submit" class="adm-btn adm-btn-primary">Save Project</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.getElementById('proj-img-file')?.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    const prev = document.getElementById('proj-img-preview');
    prev.innerHTML = `<div style="color:var(--text3);font-size:.85rem;display:flex;align-items:center;justify-content:center;height:100%">Uploading...</div>`;
    const url = await uploadToImgBB(file);
    if (url) {
      prev.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover">`;
      prev.dataset.imgdata = url;
    } else {
      prev.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
    }
  });

  document.getElementById('proj-form')?.addEventListener('submit', e => {
    e.preventDefault();
    try {
      const fd  = new FormData(e.target);
      const d   = DB.get();
      const prev = document.getElementById('proj-img-preview');
      const oldImg = fd.get('id') ? (d.projects.find(p => p.id === fd.get('id')) || {}).image || '' : '';
      const entry = {
        id:          fd.get('id') || 'proj_' + Date.now(),
        title:       fd.get('title'),
        category:    fd.get('category') || 'Other',
        description: fd.get('description'),
        demoUrl:     fd.get('demoUrl') || '#',
        codeUrl:     fd.get('codeUrl') || '#',
        tags:        fd.get('tags').split(',').map(t => t.trim()).filter(Boolean),
        image:       prev.dataset.imgdata || oldImg
      };
      const idx = d.projects.findIndex(p => p.id === entry.id);
      if (idx >= 0) d.projects[idx] = entry; else d.projects.push(entry);
      DB.save(d);
      closeModal('proj-modal');
      toast('Project saved!');
      renderProjectsTab(document.getElementById('adm-content'));
    } catch(err) {
      toast('Save failed: ' + err.message, 'error');
    }
  });
}

window.openProjModal = function(id) {
  openModal('proj-modal');
  const form  = document.getElementById('proj-form');
  const title = document.getElementById('proj-modal-title');
  form.reset();
  const prev = document.getElementById('proj-img-preview');
  prev.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
  prev.dataset.imgdata = '';
  if (id) {
    title.textContent = 'Edit Project';
    const p = DB.get().projects.find(x => x.id === id);
    if (p) {
      fillForm(form, { ...p, tags: p.tags.join(', ') });
      if (p.image) { prev.innerHTML = `<img src="${p.image}" style="width:100%;height:100%;object-fit:cover">`; prev.dataset.imgdata = p.image; }
    }
  } else {
    title.textContent = 'Add Project';
    form.elements['id'].value = '';
  }
};

window.deleteProj = function(id) {
  confirm('Delete this project?', () => {
    const d = DB.get();
    d.projects = d.projects.filter(p => p.id !== id);
    DB.save(d);
    toast('Deleted');
    renderProjectsTab(document.getElementById('adm-content'));
  });
};

/* ============================================================
   BUSINESS
   ============================================================ */
function renderBusinessTab(el) {
  setTopbarTitle('Business');
  const d = DB.get();
  const b = d.business;
  el.innerHTML = `
    <div class="section-h"><h2>Business Information</h2></div>
    <div class="dash-card">
      <div class="dash-card-body">
        <form id="biz-form">
          <div class="adm-form-row">
            <div class="adm-form-group">
              <label>Business Name *</label>
              <input name="name" value="${esc(b.name)}" required>
            </div>
            <div class="adm-form-group">
              <label>Business Type</label>
              <input name="type" value="${esc(b.type)}" placeholder="Export & Import">
            </div>
            <div class="adm-form-group">
              <label>Trade License Number</label>
              <input name="license" value="${esc(b.license)}">
            </div>
            <div class="adm-form-group">
              <label>Year Established</label>
              <input name="established" value="${esc(b.established)}">
            </div>
            <div class="adm-form-group">
              <label>Countries Served</label>
              <input name="countries" value="${esc(b.countries)}" placeholder="5+">
            </div>
            <div class="adm-form-group adm-form-full">
              <label>Business Description</label>
              <textarea name="description" rows="4">${esc(b.description)}</textarea>
            </div>
          </div>

          <div style="margin-top:1.25rem">
            <label style="font-size:.8rem;font-weight:600;color:var(--text2);display:block;margin-bottom:.75rem">Services Offered</label>
            <div class="services-admin" id="services-admin">
              ${b.services.map((s, i) => `
                <div class="service-row">
                  <div class="adm-form-group" style="margin:0;flex:1">
                    <input value="${esc(s)}" onchange="updateService(${i}, this.value)">
                  </div>
                  <button type="button" onclick="removeService(${i})" title="Remove">✕</button>
                </div>
              `).join('')}
            </div>
            <button type="button" class="adm-btn adm-btn-secondary" style="margin-top:.5rem" onclick="addService()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Service
            </button>
          </div>

          <div class="adm-form-actions">
            <button type="submit" class="adm-btn adm-btn-primary">Save Business Info</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('biz-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const d  = DB.get();
    const services = Array.from(document.querySelectorAll('.service-row input')).map(i => i.value.trim()).filter(Boolean);
    d.business = { ...d.business, name: fd.get('name'), type: fd.get('type'), license: fd.get('license'), established: fd.get('established'), countries: fd.get('countries'), description: fd.get('description'), services };
    DB.save(d);
    toast('Business info saved!');
  });
}

let _services = [];
window.updateService = function(i, val) { _services[i] = val; };
window.removeService = function(i) {
  const d = DB.get();
  d.business.services.splice(i, 1);
  DB.save(d);
  renderBusinessTab(document.getElementById('adm-content'));
};
window.addService = function() {
  const d = DB.get();
  d.business.services.push('New Service');
  DB.save(d);
  renderBusinessTab(document.getElementById('adm-content'));
};

/* ============================================================
   EXPERIENCE / ACHIEVEMENTS
   ============================================================ */
function renderExperienceTab(el) {
  setTopbarTitle('Experience & Achievements');
  const d = DB.get();
  el.innerHTML = `
    <div class="section-h">
      <h2>Work Experience</h2>
      <button class="adm-btn adm-btn-primary" onclick="openExpModal('exp')">+ Add Experience</button>
    </div>
    <div class="adm-card-list" id="exp-list">
      ${d.experience.map(e => `
        <div class="adm-card">
          <div class="adm-card-content">
            <div class="adm-card-title">${esc(e.title)}</div>
            <div class="adm-card-sub">${esc(e.company)}</div>
            <div class="adm-card-meta">${esc(e.duration)}</div>
            <div class="adm-card-desc">${esc(e.description)}</div>
          </div>
          <div class="adm-card-actions">
            <button class="adm-btn adm-btn-secondary" onclick="openExpModal('exp','${e.id}')">Edit</button>
            <button class="adm-btn adm-btn-danger"    onclick="deleteExpItem('exp','${e.id}')">Delete</button>
          </div>
        </div>
      `).join('') || '<p style="color:var(--text3)">No experience entries.</p>'}
    </div>

    <div class="section-h" style="margin-top:2rem">
      <h2>Achievements</h2>
      <button class="adm-btn adm-btn-primary" onclick="openExpModal('ach')">+ Add Achievement</button>
    </div>
    <div class="adm-card-list" id="ach-list">
      ${d.achievements.map(a => `
        <div class="adm-card">
          <div class="adm-card-content">
            <div class="adm-card-title">${esc(a.title)}</div>
            <div class="adm-card-meta">${esc(a.year)}</div>
            <div class="adm-card-desc">${esc(a.description)}</div>
          </div>
          <div class="adm-card-actions">
            <button class="adm-btn adm-btn-secondary" onclick="openExpModal('ach','${a.id}')">Edit</button>
            <button class="adm-btn adm-btn-danger"    onclick="deleteExpItem('ach','${a.id}')">Delete</button>
          </div>
        </div>
      `).join('') || '<p style="color:var(--text3)">No achievements yet.</p>'}
    </div>

    <div class="adm-modal-overlay" id="exp-modal">
      <div class="adm-modal">
        <div class="adm-modal-header">
          <h3 id="exp-modal-title">Add Entry</h3>
          <button class="adm-modal-close" onclick="closeModal('exp-modal')">✕</button>
        </div>
        <div class="adm-modal-body">
          <form id="exp-form">
            <input type="hidden" name="id">
            <input type="hidden" name="_type" value="exp">
            <div class="adm-form-row">
              <div class="adm-form-group adm-form-full">
                <label id="exp-title-label">Title / Position *</label>
                <input name="title" required>
              </div>
              <div class="adm-form-group" id="exp-company-wrap">
                <label>Company / Organization</label>
                <input name="company" placeholder="Company Name">
              </div>
              <div class="adm-form-group" id="exp-duration-wrap">
                <label id="exp-duration-label">Duration</label>
                <input name="duration" placeholder="2022 – Present">
              </div>
              <div class="adm-form-group adm-form-full">
                <label>Description</label>
                <textarea name="description" rows="3"></textarea>
              </div>
            </div>
            <div class="adm-form-actions">
              <button type="button" class="adm-btn adm-btn-secondary" onclick="closeModal('exp-modal')">Cancel</button>
              <button type="submit" class="adm-btn adm-btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.getElementById('exp-form')?.addEventListener('submit', e => {
    e.preventDefault();
    try {
      const fd   = new FormData(e.target);
      const type = fd.get('_type');
      const isAch = type === 'ach';
      const d    = DB.get();
      const entry = { id: fd.get('id') || type + '_' + Date.now(), title: fd.get('title'), description: fd.get('description') };
      if (isAch) entry.year = fd.get('duration');
      else { entry.company = fd.get('company'); entry.duration = fd.get('duration'); }
      const list = isAch ? d.achievements : d.experience;
      const idx  = list.findIndex(x => x.id === entry.id);
      if (idx >= 0) list[idx] = entry; else list.push(entry);
      if (isAch) d.achievements = list; else d.experience = list;
      DB.save(d);
      closeModal('exp-modal');
      toast('Saved!');
      renderExperienceTab(document.getElementById('adm-content'));
    } catch(err) {
      toast('Save failed: ' + err.message, 'error');
    }
  });
}

window.openExpModal = function(type, id) {
  openModal('exp-modal');
  const form = document.getElementById('exp-form');
  form.reset();
  form.elements['_type'].value = type;
  const isAch = type === 'ach';
  document.getElementById('exp-modal-title').textContent = id ? (isAch ? 'Edit Achievement' : 'Edit Experience') : (isAch ? 'Add Achievement' : 'Add Experience');
  document.getElementById('exp-title-label').textContent = isAch ? 'Achievement Title *' : 'Job Title / Position *';
  document.getElementById('exp-company-wrap').style.display = isAch ? 'none' : '';
  document.getElementById('exp-duration-label').textContent = isAch ? 'Year' : 'Duration';
  if (id) {
    const d = DB.get();
    const entry = (isAch ? d.achievements : d.experience).find(x => x.id === id);
    if (entry) fillForm(form, { ...entry, duration: entry.duration || entry.year });
  } else {
    form.elements['id'].value = '';
  }
};

window.deleteExpItem = function(type, id) {
  confirm('Delete this entry?', () => {
    const d = DB.get();
    if (type === 'ach') d.achievements = d.achievements.filter(x => x.id !== id);
    else d.experience = d.experience.filter(x => x.id !== id);
    DB.save(d);
    toast('Deleted');
    renderExperienceTab(document.getElementById('adm-content'));
  });
};

/* ============================================================
   GALLERY
   ============================================================ */
function renderGalleryTab(el) {
  setTopbarTitle('Gallery');
  const d = DB.get();
  el.innerHTML = `
    <div class="section-h"><h2>Gallery</h2></div>
    <div class="dash-card">
      <div class="dash-card-body">
        <div class="gallery-upload-area" id="upload-area">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
          <p><strong>Click to upload</strong> or drag & drop images</p>
          <p style="font-size:.78rem;margin-top:.3rem">PNG, JPG, WEBP supported</p>
          <input type="file" id="gallery-upload" accept="image/*" multiple style="display:none">
        </div>
      </div>
    </div>
    <div class="gallery-admin-grid" id="gallery-admin-grid">
      ${(d.gallery || []).map((img, i) => `
        <div class="gallery-admin-item">
          <img src="${img.src}" alt="${esc(img.title || img.caption || '')}">
          <div class="gallery-admin-overlay">
            <div class="gallery-admin-caption">${esc(img.title || img.caption || 'No title')}</div>
            ${img.description ? `<div class="gallery-admin-caption" style="font-size:.68rem;opacity:.8">${esc(img.description)}</div>` : ''}
            <div style="display:flex;gap:.4rem;margin-top:.4rem">
              <button class="adm-btn" style="font-size:.72rem;padding:.25rem .5rem" onclick="editGalleryItem(${i})">Edit</button>
              <button class="adm-btn adm-btn-danger" style="font-size:.72rem;padding:.25rem .5rem" onclick="deleteGalleryItem(${i})">Delete</button>
            </div>
          </div>
          ${img.title ? `<div class="gallery-admin-title">${esc(img.title)}</div>` : ''}
        </div>
      `).join('') || ''}
    </div>
    ${!d.gallery?.length ? '<p style="color:var(--text3);text-align:center;margin-top:1rem">No images yet. Upload some above.</p>' : ''}
  `;

  const area  = document.getElementById('upload-area');
  const input = document.getElementById('gallery-upload');
  area.addEventListener('click',  () => input.click());
  area.addEventListener('dragover',  e => { e.preventDefault(); area.classList.add('drag-over'); });
  area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
  area.addEventListener('drop', e => { e.preventDefault(); area.classList.remove('drag-over'); handleGalleryFiles(e.dataTransfer.files); });
  input.addEventListener('change', e => handleGalleryFiles(e.target.files));
}

function promptGalleryInfo(filename, existingTitle = '', existingDesc = '') {
  return new Promise(resolve => {
    const modal = document.createElement('div');
    modal.className = 'adm-modal-overlay open';
    modal.style.cssText = 'z-index:9999';
    modal.innerHTML = `
      <div class="adm-modal">
        <div class="adm-modal-header">
          <h3>Image Details</h3>
          <button class="adm-modal-close" id="ginfo-close">✕</button>
        </div>
        <div class="adm-modal-body">
          <p style="color:var(--text3);font-size:.82rem;margin-bottom:1rem;word-break:break-all">${esc(filename)}</p>
          <div class="form-group">
            <label>Title</label>
            <input type="text" id="ginfo-title" value="${esc(existingTitle)}" placeholder="যেমন: ব্যবসার মিটিং, প্রজেক্ট শো...">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea id="ginfo-desc" rows="3" placeholder="Image সম্পর্কে বিস্তারিত লিখুন (optional)">${esc(existingDesc)}</textarea>
          </div>
        </div>
        <div style="display:flex;gap:.75rem;justify-content:flex-end;padding:1rem 1.5rem;border-top:1px solid var(--border)">
          <button class="adm-btn" id="ginfo-skip">Skip</button>
          <button class="adm-btn adm-btn-primary" id="ginfo-save">Save</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    const cleanup = result => { modal.remove(); resolve(result); };
    document.getElementById('ginfo-save').addEventListener('click', () => {
      cleanup({
        title: document.getElementById('ginfo-title').value.trim(),
        description: document.getElementById('ginfo-desc').value.trim()
      });
    });
    document.getElementById('ginfo-skip').addEventListener('click', () => cleanup({ title: existingTitle, description: existingDesc }));
    document.getElementById('ginfo-close').addEventListener('click', () => cleanup({ title: existingTitle, description: existingDesc }));
  });
}

async function handleGalleryFiles(files) {
  const filesArr = Array.from(files);
  const d = DB.get();
  let uploaded = 0;
  toast(`${filesArr.length}টি image upload হচ্ছে...`, 'info');
  for (const file of filesArr) {
    const url = await uploadToImgBB(file);
    if (url) {
      const { title, description } = await promptGalleryInfo(file.name);
      d.gallery.push({ src: url, title, description });
      uploaded++;
    }
  }
  if (uploaded > 0) {
    DB.save(d);
    toast(`${uploaded}টি image uploaded!`);
    renderGalleryTab(document.getElementById('adm-content'));
  }
}

window.editGalleryItem = async function(index) {
  const d = DB.get();
  const img = d.gallery[index];
  const { title, description } = await promptGalleryInfo(img.src.split('/').pop(), img.title || img.caption || '', img.description || '');
  d.gallery[index] = { ...img, title, description };
  DB.save(d);
  toast('Updated!');
  renderGalleryTab(document.getElementById('adm-content'));
};

window.deleteGalleryItem = function(index) {
  confirm('Delete this image?', () => {
    const d = DB.get();
    d.gallery.splice(index, 1);
    DB.save(d);
    toast('Deleted');
    renderGalleryTab(document.getElementById('adm-content'));
  });
};

/* ============================================================
   MESSAGES
   ============================================================ */
function renderMessagesTab(el) {
  setTopbarTitle('Messages');
  const d = DB.get();
  const msgs = d.messages || [];
  el.innerHTML = `
    <div class="section-h">
      <h2>Inbox <span style="font-size:.85rem;color:var(--text3);font-weight:400">(${msgs.length} total)</span></h2>
      ${msgs.length ? `<button class="adm-btn adm-btn-danger" onclick="clearMessages()">Clear All</button>` : ''}
    </div>
    <div class="messages-list" id="messages-list">
      ${msgs.length === 0
        ? '<div style="text-align:center;padding:3rem;color:var(--text3)"><svg style="width:48px;height:48px;margin:0 auto 1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><p>No messages yet.</p></div>'
        : msgs.map((m, i) => `
          <div class="message-item ${m.read ? '' : 'unread'}" onclick="viewMessage(${i})">
            <div class="message-header">
              <div class="message-from">${esc(m.name)} ${!m.read ? '<span class="message-badge">New</span>' : ''}</div>
              <div class="message-date">${formatDate(m.date)}</div>
            </div>
            <div class="message-subject">${esc(m.subject || 'No subject')}</div>
            <div class="message-preview">${esc(m.message)}</div>
          </div>
        `).join('')}
    </div>
    <div id="msg-detail-area"></div>
  `;
}

window.viewMessage = function(index) {
  const d   = DB.get();
  const msg = d.messages[index];
  if (!msg) return;
  msg.read = true;
  DB.save(d);
  updateMsgBadge();
  document.querySelectorAll('.message-item')[index]?.classList.remove('unread');
  document.querySelector(`.message-item:nth-child(${index + 1}) .message-badge`)?.remove();
  const area = document.getElementById('msg-detail-area');
  area.innerHTML = `
    <div class="message-detail">
      <div class="message-detail-header">
        <h3 style="font-size:1.05rem;font-weight:700">${esc(msg.subject || 'Message')}</h3>
        <div class="message-detail-meta">
          <span><strong>From:</strong> ${esc(msg.name)}</span>
          <span><strong>Email:</strong> <a href="mailto:${esc(msg.email)}" style="color:var(--primary-l)">${esc(msg.email)}</a></span>
          <span><strong>Date:</strong> ${formatDate(msg.date)}</span>
        </div>
      </div>
      <div class="message-detail-body">${esc(msg.message)}</div>
      <div style="margin-top:1rem;display:flex;gap:.5rem">
        <a href="mailto:${esc(msg.email)}?subject=Re: ${esc(msg.subject || '')}" class="adm-btn adm-btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Reply via Email
        </a>
        <button class="adm-btn adm-btn-danger" onclick="deleteMessage(${index})">Delete</button>
      </div>
    </div>
  `;
  area.scrollIntoView({ behavior: 'smooth' });
};

window.deleteMessage = function(index) {
  confirm('Delete this message?', () => {
    const d = DB.get();
    d.messages.splice(index, 1);
    DB.save(d);
    toast('Message deleted');
    renderMessagesTab(document.getElementById('adm-content'));
  });
};

window.clearMessages = function() {
  confirm('Clear ALL messages? This cannot be undone.', () => {
    const d = DB.get();
    d.messages = [];
    DB.save(d);
    toast('All messages cleared');
    renderMessagesTab(document.getElementById('adm-content'));
  });
};

function updateMsgBadge() {
  const d      = DB.get();
  const unread = (d.messages || []).filter(m => !m.read).length;
  const badge  = document.querySelector('.sidebar-badge');
  if (badge) badge.textContent = unread || '';
  if (badge) badge.style.display = unread ? '' : 'none';
}

/* ============================================================
   SOCIAL
   ============================================================ */
function renderSocialTab(el) {
  setTopbarTitle('Social Media');
  const d = DB.get();
  const s = d.social;
  el.innerHTML = `
    <div class="section-h"><h2>Social Media Links</h2></div>
    <div class="dash-card">
      <div class="dash-card-body">
        <form id="social-form">
          <div class="adm-form-row">
            ${[
              { key: 'facebook',  icon: '📘', label: 'Facebook',  ph: 'https://facebook.com/yourpage' },
              { key: 'linkedin',  icon: '💼', label: 'LinkedIn',  ph: 'https://linkedin.com/in/yourprofile' },
              { key: 'github',    icon: '🐱', label: 'GitHub',    ph: 'https://github.com/yourusername' },
              { key: 'twitter',   icon: '🐦', label: 'Twitter / X', ph: 'https://twitter.com/yourhandle' },
              { key: 'instagram', icon: '📷', label: 'Instagram', ph: 'https://instagram.com/yourhandle' },
              { key: 'youtube',   icon: '▶️', label: 'YouTube',   ph: 'https://youtube.com/@yourchannel' }
            ].map(item => `
              <div class="adm-form-group">
                <label>${item.icon} ${item.label}</label>
                <input name="${item.key}" value="${esc(s[item.key] || '')}" placeholder="${item.ph}" type="url">
              </div>
            `).join('')}
          </div>
          <div class="adm-form-actions">
            <button type="submit" class="adm-btn adm-btn-primary">Save Social Links</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.getElementById('social-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const d  = DB.get();
    d.social = { facebook: fd.get('facebook'), linkedin: fd.get('linkedin'), github: fd.get('github'), twitter: fd.get('twitter'), instagram: fd.get('instagram'), youtube: fd.get('youtube') };
    DB.save(d);
    toast('Social links saved!');
  });
}

/* ============================================================
   SETTINGS
   ============================================================ */
function renderSettingsTab(el) {
  setTopbarTitle('Settings');
  el.innerHTML = `
    <div class="section-h"><h2>Account Settings</h2></div>
    <div class="dash-card" style="max-width:500px">
      <div class="dash-card-header"><h3>Change Admin Password</h3></div>
      <div class="dash-card-body">
        <form id="pwd-form">
          <div class="adm-form-group">
            <label>Current Password</label>
            <input type="password" name="current" required placeholder="Enter current password">
          </div>
          <div class="adm-form-group">
            <label>New Password</label>
            <input type="password" name="newpwd" required placeholder="Enter new password" minlength="6">
          </div>
          <div class="adm-form-group">
            <label>Confirm New Password</label>
            <input type="password" name="confirm" required placeholder="Repeat new password">
          </div>
          <div class="adm-form-actions">
            <button type="submit" class="adm-btn adm-btn-primary">Update Password</button>
          </div>
        </form>
        <div id="pwd-msg" style="margin-top:.75rem;font-size:.85rem"></div>
      </div>
    </div>

    <div class="dash-card" style="max-width:500px;margin-top:1.5rem">
      <div class="dash-card-header"><h3>Image Hosting — ImgBB</h3></div>
      <div class="dash-card-body">
        <p style="font-size:.82rem;color:var(--text3);margin-bottom:1rem;line-height:1.6">
          Profile photo, gallery ও project-এর images যেন সবাই দেখতে পারে সেজন্য <strong style="color:var(--primary-l)">ImgBB</strong> ব্যবহার করা হয়।<br>
          Free API key নিন: <a href="https://api.imgbb.com/" target="_blank" rel="noopener" style="color:var(--primary-l);text-decoration:underline">api.imgbb.com</a>
          → Sign up → API → Copy key
        </p>
        <form id="imgbb-form">
          <div class="adm-form-group">
            <label>ImgBB API Key</label>
            <input type="text" name="imgbbKey" value="${esc(DB.getImgBBKey())}" placeholder="এখানে আপনার API key paste করুন">
          </div>
          <div class="adm-form-actions">
            <button type="submit" class="adm-btn adm-btn-primary">Save API Key</button>
          </div>
        </form>
        ${DB.getImgBBKey() ? '<p style="font-size:.8rem;color:var(--success);margin-top:.5rem">✓ API key সেট আছে — image upload কাজ করবে</p>' : '<p style="font-size:.8rem;color:var(--danger);margin-top:.5rem">⚠ API key নেই — image upload কাজ করবে না</p>'}
      </div>
    </div>

    <div class="dash-card" style="max-width:500px;margin-top:1.5rem">
      <div class="dash-card-header"><h3>Data Management</h3></div>
      <div class="dash-card-body" style="display:flex;gap:1rem;flex-wrap:wrap">
        <button class="adm-btn adm-btn-secondary" onclick="exportData()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Export Data
        </button>
        <label class="adm-btn adm-btn-secondary" style="cursor:pointer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
          Import Data
          <input type="file" accept=".json" style="display:none" onchange="importData(this)">
        </label>
        <button class="adm-btn adm-btn-danger" onclick="resetData()">
          Reset to Default
        </button>
      </div>
    </div>
  `;

  document.getElementById('pwd-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const fd      = new FormData(e.target);
    const current = fd.get('current');
    const newpwd  = fd.get('newpwd');
    const confirm = fd.get('confirm');
    const msg     = document.getElementById('pwd-msg');
    const _d = DB.get();
    const _code   = atob(DEFAULT_DATA.adminPassword);
    const _stored = _d.adminPassword ? atob(_d.adminPassword) : _code;
    if (current !== _code && current !== _stored) {
      msg.style.color = 'var(--danger)'; msg.textContent = 'Current password is incorrect.'; return;
    }
    if (newpwd !== confirm) {
      msg.style.color = 'var(--danger)'; msg.textContent = 'New passwords do not match.'; return;
    }
    DB.changePassword(newpwd);
    msg.style.color = 'var(--success)'; msg.textContent = 'Password changed successfully!';
    e.target.reset();
  });

  document.getElementById('imgbb-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const key = new FormData(e.target).get('imgbbKey').trim();
    if (!key) { toast('API key দিন!', 'error'); return; }
    DB.setImgBBKey(key);
    toast('ImgBB API key saved!');
    renderSettingsTab(document.getElementById('adm-content'));
  });
}

window.exportData = function() {
  const d    = DB.get();
  const json = JSON.stringify(d, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'portfolio_backup.json'; a.click();
  URL.revokeObjectURL(url);
  toast('Data exported!');
};

window.importData = function(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      DB.save(data);
      toast('Data imported! Refreshing...', 'info');
      setTimeout(() => location.reload(), 1000);
    } catch { toast('Invalid backup file!', 'error'); }
  };
  reader.readAsText(file);
};

window.resetData = function() {
  confirm('Reset ALL data to defaults? This cannot be undone!', () => {
    localStorage.removeItem('portfolio_v1_data');
    toast('Data reset! Refreshing...', 'info');
    setTimeout(() => location.reload(), 1000);
  });
};

/* ============================================================
   IMAGE HOSTING (ImgBB)
   ============================================================ */
async function uploadToImgBB(file) {
  const apiKey = DB.getImgBBKey();
  if (!apiKey) {
    toast('ImgBB API key নেই! Settings > Image Hosting-এ key দিন।', 'error');
    return null;
  }
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', apiKey);
  try {
    const res  = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: formData });
    const json = await res.json();
    if (json.success) return json.data.url;
    toast('Upload failed: ' + (json.error?.message || 'Unknown error'), 'error');
    return null;
  } catch {
    toast('Upload failed. Internet connection বা API key চেক করুন।', 'error');
    return null;
  }
}

/* ============================================================
   HELPERS
   ============================================================ */
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('adm-modal-overlay')) {
    closeModal(e.target.id);
  }
});

function fillForm(form, data) {
  Object.entries(data).forEach(([key, val]) => {
    const el = form.elements[key];
    if (el) el.value = val ?? '';
  });
}

function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

function toast(msg, type = 'success') {
  let t = document.getElementById('adm-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'adm-toast';
    t.className = 'adm-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = `adm-toast show ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = 'adm-toast', 3000);
}

/* ---- Confirm Dialog ---- */
function initConfirmDialog() {
  const overlay = document.createElement('div');
  overlay.className = 'confirm-overlay';
  overlay.id = 'confirm-overlay';
  overlay.innerHTML = `
    <div class="confirm-box">
      <div class="confirm-icon">⚠️</div>
      <div class="confirm-title" id="confirm-title">Are you sure?</div>
      <div class="confirm-text" id="confirm-text">This action cannot be undone.</div>
      <div class="confirm-actions">
        <button class="adm-btn adm-btn-secondary" id="confirm-cancel">Cancel</button>
        <button class="adm-btn adm-btn-danger"    id="confirm-ok">Delete</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('confirm-cancel')?.addEventListener('click', () => overlay.classList.remove('open'));
}

function confirm(text, onOk) {
  const overlay = document.getElementById('confirm-overlay');
  if (!overlay) { if (window.confirm(text)) onOk(); return; }
  document.getElementById('confirm-text').textContent = text;
  overlay.classList.add('open');
  const okBtn = document.getElementById('confirm-ok');
  const newOk = okBtn.cloneNode(true);
  okBtn.replaceWith(newOk);
  newOk.addEventListener('click', () => { overlay.classList.remove('open'); onOk(); }, { once: true });
}
