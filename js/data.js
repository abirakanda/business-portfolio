/* ============================================================
   data.js — Portfolio Data Layer (localStorage-based)
   ============================================================ */

const DEFAULT_DATA = {
  profile: {
    name: "Abir Akanda",
    title: "CIS Student & Web Developer",
    bio: "A passionate Computer and Information Systems (CIS) student at Daffodil International University, combining academic excellence with entrepreneurial spirit. As a skilled web developer and export-import business owner with a valid trade license, I bring a unique blend of technical knowledge and real-world business experience to every project I undertake.",
    email: "251-16-004@diu.edu.bd",
    phone: "+880 1403313770",
    location: "Dhaka, Bangladesh",
    avatar: "",
    cvUrl: ""
  },
  education: [
    {
      id: "edu1",
      degree: "B.Sc. in Computer Science & Information Systems (CIS)",
      institution: "Daffodil International University",
      location: "Birulia, Savar, Dhaka",
      duration: "2021 – Present",
      grade: "Running",
      description: "Studying core subjects including programming, data structures, algorithms, databases, networking, web development, and software engineering."
    },
    {
      id: "edu2",
      degree: "Higher Secondary Certificate (HSC)",
      institution: "Daffodil International University",
      location: "Dhaka, Bangladesh",
      duration: "2025 – 2028",
      grade: "GPA: X.XX",
      description: "Science group with focus on mathematics, physics, and chemistry."
    }
  ],
  skills: [
    { id: "sk1", name: "HTML & CSS",   level: 92, category: "Frontend"    },
    { id: "sk2", name: "JavaScript",   level: 82, category: "Frontend"    },
    { id: "sk3", name: "React.js",     level: 72, category: "Frontend"    },
    { id: "sk4", name: "PHP",          level: 65, category: "Backend"     },
    { id: "sk5", name: "MySQL",        level: 70, category: "Database"    },
    { id: "sk6", name: "Python",       level: 60, category: "Programming" },
    { id: "sk7", name: "Node.js",      level: 58, category: "Backend"     },
    { id: "sk8", name: "Git & GitHub", level: 78, category: "Tools"       }
  ],
  technologies: [
    "HTML5","CSS3","JavaScript","React","PHP","MySQL","Python",
    "Node.js","Git","GitHub","VS Code","Figma","Bootstrap","jQuery","WordPress"
  ],
  projects: [
    {
      id: "proj1",
      title: "Personal Portfolio Website",
      category: "Web Development",
      description: "A fully responsive portfolio website with an integrated admin panel, built with pure HTML, CSS, and JavaScript. Features dynamic content management powered by localStorage.",
      image: "",
      tags: ["HTML","CSS","JavaScript"],
      demoUrl: "#",
      codeUrl: "#"
    },
    {
      id: "proj2",
      title: "E-Commerce Platform",
      category: "Web Development",
      description: "A full-stack e-commerce solution with product management, a shopping cart system, user authentication, and payment gateway integration.",
      image: "",
      tags: ["PHP","MySQL","JavaScript"],
      demoUrl: "#",
      codeUrl: "#"
    },
    {
      id: "proj3",
      title: "Business Management System",
      category: "Business",
      description: "An inventory and trade management system designed for export-import operations. Tracks shipments, invoices, and client relationships.",
      image: "",
      tags: ["PHP","MySQL","Bootstrap"],
      demoUrl: "#",
      codeUrl: "#"
    }
  ],
  business: {
    name: "Akanda Global Trade",
    type: "Export & Import",
    license: "Trade License No: XXXXXXXX",
    description: "We specialize in the export and import of premium-quality goods, building strong international trade relationships. Our business combines modern technology with traditional commerce to deliver exceptional value to clients worldwide.",
    services: [
      "Product Export to International Markets",
      "Import of Premium Quality Goods",
      "Trade Consultation & Advisory",
      "Market Research & Analysis",
      "Supply Chain Management",
      "International Business Development"
    ],
    established: "2023",
    countries: "5+"
  },
  experience: [
    {
      id: "exp1",
      title: "Freelance Web Developer",
      company: "Self-Employed",
      duration: "2022 – Present",
      description: "Designing and developing responsive websites and web applications for clients across various industries. Specializing in modern UI/UX and full-stack development."
    },
    {
      id: "exp2",
      title: "Export-Import Business Owner",
      company: "Akanda Global Trade",
      duration: "2026 – Present",
      description: "Managing export-import operations with a valid trade license. Building international business relationships, managing supply chains, and overseeing all trade activities."
    }
  ],
  achievements: [
    { id: "ach1", title: "Trade License Certificate", year: "2023", description: "Successfully obtained an official trade license to operate an export-import business in Bangladesh." },
    { id: "ach2", title: "Web Development Certification", year: "2022", description: "Completed a comprehensive full-stack web development program covering modern technologies and frameworks." },
    { id: "ach3", title: "University Merit Recognition", year: "2023", description: "Received recognition for academic performance in the Computer Science & Information Systems program at DIU." }
  ],
  gallery: [],
  social: {
    facebook:  "",
    linkedin:  "",
    github:    "",
    twitter:   "",
    instagram: "",
    youtube:   ""
  },
  messages: [],
  adminPassword: btoa("Abir00@kotha")
};

/* ============================================================
   Gallery — categories & albums layered over the gallery records
   ------------------------------------------------------------
   `gallery` stays an array of photo records ({ src, title, description }
   plus optional additive fields). Grouping lives in `galleryMeta`:
     { version, categories:[{id,name}], albums:[{id,title,categoryId,
       description,location,date,coverId,focus:{x,y},photoIds:[]}],
       review:[photoId] }
   Until galleryMeta is saved from the admin, GALLERY_SEED supplies a
   proposed structure (matched by image URL), so nothing is written just
   to display albums.
   ============================================================ */
const GALLERY_SEED = {
  categories: [
    { id: "travel",          name: "Travel" },
    { id: "events-education", name: "Events & Education" },
    { id: "sports",          name: "Sports" },
    { id: "personal",        name: "Personal Moments" }
  ],
  albums: [
    { id: "headhunt-2026", title: "HeadHunt Postgraduate Fair 2026", categoryId: "events-education",
      location: "Raffles City, Singapore", cover: "https://i.ibb.co/35cByJ43/IMG-20260905-WA0349.jpg", focus: { x: 50, y: 42 },
      srcs: [
        "https://i.ibb.co/PvGwt5wb/IMG-20260905-WA0321.jpg",
        "https://i.ibb.co/35cByJ43/IMG-20260905-WA0349.jpg",
        "https://i.ibb.co/ymh9ZJhP/IMG-20260905-WA0327.jpg",
        "https://i.ibb.co/prR5zz5J/IMG-20260905-WA0337.jpg",
        "https://i.ibb.co/27s8GQgY/IMG-20260905-WA0329.jpg",
        "https://i.ibb.co/hFq91NkW/20260907-013951.jpg"
      ] },
    { id: "singapore", title: "Singapore", categoryId: "travel",
      cover: "https://i.ibb.co/vvqFmyzh/IMG-20260905-WA0291.jpg", focus: { x: 50, y: 55 },
      srcs: [
        "https://i.ibb.co/vvqFmyzh/IMG-20260905-WA0291.jpg",
        "https://i.ibb.co/wh4Bhzsh/IMG-20260905-WA0277.jpg",
        "https://i.ibb.co/Zppfk5jp/20260907-120106.jpg"
      ] },
    { id: "thailand", title: "Thailand", categoryId: "travel",
      cover: "https://i.ibb.co/Sjq9D01/IMG-20250705-WA0192.jpg", focus: { x: 50, y: 50 },
      srcs: [
        "https://i.ibb.co/YBwmH8Jb/IMG-20250704-WA0140.jpg",
        "https://i.ibb.co/mVfRvXZS/20250704-105541.jpg",
        "https://i.ibb.co/Sjq9D01/IMG-20250705-WA0192.jpg",
        "https://i.ibb.co/B5c43RcF/20250704-103822.jpg"
      ] },
    { id: "thailand-second-visit", title: "Thailand — Second Visit", categoryId: "travel",
      cover: "https://i.ibb.co/S4cGD4YT/IMG-20251102-WA0184.jpg", focus: { x: 50, y: 58 },
      srcs: [
        "https://i.ibb.co/S4cGD4YT/IMG-20251102-WA0184.jpg",
        "https://i.ibb.co/20R0F91f/IMG-20251102-WA0124-1.jpg"
      ] },
    { id: "malaysia", title: "Malaysia", categoryId: "travel", location: "Langkawi Island, Malaysia",
      cover: "https://i.ibb.co/G4yd0rLk/IMG-20251105-WA0065.jpg", focus: { x: 50, y: 40 },
      srcs: [
        "https://i.ibb.co/G4yd0rLk/IMG-20251105-WA0065.jpg",
        "https://i.ibb.co/V0bXZzXL/IMG-20251105-WA0058.jpg"
      ] },
    { id: "cis-football", title: "CIS Football Tournament", categoryId: "sports",
      cover: "https://i.ibb.co/0ybdPhr4/FB-IMG-1739511691172.jpg", focus: { x: 50, y: 55 },
      srcs: [
        "https://i.ibb.co/xKBDkFJN/20250213-172144.jpg",
        "https://i.ibb.co/nskhmmQK/20250213-172311.jpg",
        "https://i.ibb.co/0ybdPhr4/FB-IMG-1739511691172.jpg"
      ] },
    { id: "memories", title: "Memories", categoryId: "personal",
      cover: "https://i.ibb.co/HLHsPKYX/20250702-205036.jpg", focus: { x: 50, y: 50 },
      srcs: [ "https://i.ibb.co/HLHsPKYX/20250702-205036.jpg" ] }
  ],
  // Classifications that need the owner's confirmation
  review: [
    "https://i.ibb.co/dssPgwvT/IMG-20250702-WA0081.jpg", // "Arrival To Thailand & Malaysia" — spans two trips, left unassigned
    "https://i.ibb.co/HLHsPKYX/20250702-205036.jpg"      // "Memories" — placed in Personal Moments, please confirm
  ],
  // Pixel dimensions of the existing uploads (used to reserve layout space)
  dims: {
    "https://i.ibb.co/vvqFmyzh/IMG-20260905-WA0291.jpg": [3120, 4160],
    "https://i.ibb.co/PvGwt5wb/IMG-20260905-WA0321.jpg": [3024, 4032],
    "https://i.ibb.co/35cByJ43/IMG-20260905-WA0349.jpg": [3120, 4160],
    "https://i.ibb.co/ymh9ZJhP/IMG-20260905-WA0327.jpg": [3024, 4032],
    "https://i.ibb.co/prR5zz5J/IMG-20260905-WA0337.jpg": [3120, 4160],
    "https://i.ibb.co/wh4Bhzsh/IMG-20260905-WA0277.jpg": [3024, 4032],
    "https://i.ibb.co/Zppfk5jp/20260907-120106.jpg":     [3000, 4000],
    "https://i.ibb.co/hFq91NkW/20260907-013951.jpg":     [650, 873],
    "https://i.ibb.co/27s8GQgY/IMG-20260905-WA0329.jpg": [4032, 3024],
    "https://i.ibb.co/xKBDkFJN/20250213-172144.jpg":     [1848, 4000],
    "https://i.ibb.co/nskhmmQK/20250213-172311.jpg":     [1848, 4000],
    "https://i.ibb.co/0ybdPhr4/FB-IMG-1739511691172.jpg": [720, 960],
    "https://i.ibb.co/dssPgwvT/IMG-20250702-WA0081.jpg": [960, 1280],
    "https://i.ibb.co/YBwmH8Jb/IMG-20250704-WA0140.jpg": [3120, 4160],
    "https://i.ibb.co/mVfRvXZS/20250704-105541.jpg":     [4000, 3000],
    "https://i.ibb.co/Sjq9D01/IMG-20250705-WA0192.jpg":  [3120, 4160],
    "https://i.ibb.co/B5c43RcF/20250704-103822.jpg":     [8160, 6120],
    "https://i.ibb.co/G4yd0rLk/IMG-20251105-WA0065.jpg": [960, 1280],
    "https://i.ibb.co/HLHsPKYX/20250702-205036.jpg":     [3000, 4000],
    "https://i.ibb.co/S4cGD4YT/IMG-20251102-WA0184.jpg": [3024, 4032],
    "https://i.ibb.co/20R0F91f/IMG-20251102-WA0124-1.jpg": [3120, 4160],
    "https://i.ibb.co/V0bXZzXL/IMG-20251105-WA0058.jpg": [960, 1280]
  }
};

const Gallery = {
  // On-the-fly resizer for legacy uploads that have no stored thumbnails.
  // Originals are untouched; images fall back to the original URL on error.
  // Set to '' to always serve the original files.
  proxy: "https://wsrv.nl/",

  // Deterministic id from the image URL (FNV-1a), so legacy records get the
  // same id every time — re-running the migration never creates duplicates.
  idFor(src, n) {
    let h = 0x811c9dc5;
    const s = String(src || "");
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return "p_" + (h >>> 0).toString(36) + (n > 1 ? "_" + n : "");
  },

  newId(prefix) { return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); },

  slug(text) {
    return String(text || "").toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "")
      .trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 40);
  },

  /* Read-only view of the gallery: never mutates `data`. */
  build(data) {
    const seen = {};
    const photos = [];
    (Array.isArray(data.gallery) ? data.gallery : []).forEach((rec, index) => {
      if (!rec || !rec.src) return;
      seen[rec.src] = (seen[rec.src] || 0) + 1;
      const p = Object.assign({}, rec, { index });
      if (!p.id) p.id = this.idFor(rec.src, seen[rec.src]);
      if (!(p.w > 0 && p.h > 0) && GALLERY_SEED.dims[rec.src]) [p.w, p.h] = GALLERY_SEED.dims[rec.src];
      photos.push(p);
    });
    const byId = {};
    photos.forEach(p => { if (!byId[p.id]) byId[p.id] = p; });

    const draft = !this.hasMeta(data);
    const meta = draft ? this.seedMeta(photos) : data.galleryMeta;

    const categories = (Array.isArray(meta.categories) ? meta.categories : [])
      .filter(c => c && c.id).map(c => ({ id: String(c.id), name: c.name || "Untitled" }));
    const catIds = new Set(categories.map(c => c.id));

    const placed = new Set();
    const albums = (Array.isArray(meta.albums) ? meta.albums : []).filter(a => a && a.id).map(a => {
      const photoIds = (Array.isArray(a.photoIds) ? a.photoIds : [])
        .filter(id => byId[id] && !placed.has(id));
      photoIds.forEach(id => placed.add(id));
      const coverId = photoIds.includes(a.coverId) ? a.coverId : photoIds[0] || "";
      const f = a.focus || {};
      return {
        id: String(a.id),
        title: a.title || "Untitled album",
        categoryId: catIds.has(a.categoryId) ? a.categoryId : "",
        description: a.description || "",
        location: a.location || "",
        date: a.date || "",
        coverId,
        focus: { x: clampPct(f.x, 50), y: clampPct(f.y, 50) },
        photoIds
      };
    });

    const unassigned = photos.filter(p => !placed.has(p.id)).map(p => p.id);
    const review = new Set((Array.isArray(meta.review) ? meta.review : []).filter(id => byId[id]));

    return { draft, photos, byId, categories, albums, unassigned, review };
  },

  hasMeta(data) {
    const m = data && data.galleryMeta;
    return !!(m && typeof m === "object" && m.version);
  },

  seedMeta(photos) {
    const bySrc = {};
    photos.forEach(p => { if (!bySrc[p.src]) bySrc[p.src] = p.id; });
    return {
      version: 1,
      categories: GALLERY_SEED.categories.map(c => Object.assign({}, c)),
      albums: GALLERY_SEED.albums.map(a => ({
        id: a.id, title: a.title, categoryId: a.categoryId,
        description: a.description || "", location: a.location || "", date: a.date || "",
        coverId: bySrc[a.cover] || "", focus: Object.assign({}, a.focus),
        photoIds: a.srcs.map(s => bySrc[s]).filter(Boolean)
      })),
      review: GALLERY_SEED.review.map(s => bySrc[s]).filter(Boolean)
    };
  },

  /* Persistent, idempotent migration: adds ids/dimensions to records that lack
     them and materialises galleryMeta. Existing fields are never changed. */
  migrate(data) {
    const view = this.build(data);
    if (!Array.isArray(data.gallery)) data.gallery = [];
    view.photos.forEach(p => {
      const rec = data.gallery[p.index];
      if (!rec.id) rec.id = p.id;
      if (!(rec.w > 0 && rec.h > 0) && p.w && p.h) { rec.w = p.w; rec.h = p.h; }
    });
    data.galleryMeta = {
      version: 1,
      categories: view.categories,
      albums: view.albums,
      review: Array.from(view.review)
    };
    return data;
  },

  /* ---- Display helpers ---- */
  title(p)   { return (p.displayTitle || p.title || p.caption || "").trim(); },
  caption(p) { return (p.displayCaption || p.description || (p.title ? "" : p.caption) || "").trim(); },
  alt(p, albumTitle, n) {
    if (p.alt) return p.alt;
    const parts = [];
    [this.title(p), this.caption(p)].forEach(t => {
      if (t && !parts.some(x => x.toLowerCase() === t.toLowerCase())) parts.push(t);
    });
    return parts.join(" — ") || (albumTitle ? `Photo ${n || ""} from ${albumTitle}`.replace("  ", " ") : "Gallery photo");
  },
  ratio(p) { return p.w > 0 && p.h > 0 ? p.w / p.h : 0.75; },

  sized(p, width) {
    // Prefer the uploader's stored medium size, then the resizer, then the original
    // (ImgBB's `thumb` is a square crop, so it is never used for display)
    if (width <= 480 && p.medium) return p.medium;
    if (!this.proxy || !/^https?:\/\//.test(p.src)) return p.src;
    if (p.w && p.w <= width) return p.src;
    return `${this.proxy}?url=${encodeURIComponent(p.src)}&w=${width}&we&output=webp&q=${width > 1400 ? 85 : 78}`;
  },
  srcset(p, widths) {
    const seen = new Set();
    return widths.map(w => [this.sized(p, w), w]).filter(([u]) => !seen.has(u) && seen.add(u))
      .map(([u, w]) => `${u} ${w}w`).join(", ");
  }
};

function clampPct(v, def) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, Math.round(n))) : def;
}

/* ---- Core DB Object ---- */
const DB = {
  _key: "portfolio_v1_data",

  get() {
    try {
      const raw = localStorage.getItem(this._key);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
      const stored = JSON.parse(raw);
      return this._merge(stored);
    } catch { return JSON.parse(JSON.stringify(DEFAULT_DATA)); }
  },

  _merge(stored) {
    const d = JSON.parse(JSON.stringify(DEFAULT_DATA));
    Object.assign(d, stored);
    d.profile   = Object.assign({}, d.profile,   stored.profile   || {});
    d.business  = Object.assign({}, d.business,  stored.business  || {});
    d.social    = Object.assign({}, d.social,     stored.social    || {});
    return d;
  },

  update(section, value) {
    const d = this.get();
    d[section] = value;
    this.save(d);
  },

  addMessage(msg) {
    const d = this.get();
    msg.id   = "msg_" + Date.now();
    msg.date = new Date().toISOString();
    msg.read = false;
    if (!Array.isArray(d.messages)) d.messages = [];
    d.messages.unshift(msg);
    this.save(d);
  },

  /* ---- Auth ---- */
  isLoggedIn() { return sessionStorage.getItem("adm_token") === "ok"; },

  login(user, pass) {
    const d          = this.get();
    const codePass   = atob(DEFAULT_DATA.adminPassword);
    const storedPass = d.adminPassword ? atob(d.adminPassword) : codePass;
    const passOk     = (pass === codePass || pass === storedPass);
    if (user === "Abirkotha" && passOk) {
      // sync localStorage so code-level password always wins
      if (pass === codePass) { d.adminPassword = DEFAULT_DATA.adminPassword; this.save(d); }
      sessionStorage.setItem("adm_token", "ok");
      return true;
    }
    return false;
  },

  logout() { sessionStorage.removeItem("adm_token"); },

  changePassword(newPass) {
    const d = this.get();
    d.adminPassword = btoa(newPass);
    this.save(d);
  },

  getImgBBKey() { return localStorage.getItem('portfolio_imgbb_key') || ''; },
  setImgBBKey(key) { localStorage.setItem('portfolio_imgbb_key', key.trim()); },

  /* ---- Firebase Realtime Database sync ---- */
  _fbUrl: 'https://abirakanda-6a044-default-rtdb.firebaseio.com/portfolio.json',

  async fetchRemote() {
    try {
      const res = await fetch(this._fbUrl);
      if (!res.ok) return null;
      const remote = await res.json();
      if (!remote) return null;
      const localRaw = localStorage.getItem(this._key);
      if (!localRaw) {
        localStorage.setItem(this._key, JSON.stringify(remote));
        return remote;
      }
      const localTs  = JSON.parse(localRaw)._lastModified || 0;
      const remoteTs = remote._lastModified || 0;
      if (remoteTs > localTs) {
        localStorage.setItem(this._key, JSON.stringify(remote));
        return remote;
      }
      return null;
    } catch {}
    return null;
  },

  async pushRemote(data) {
    try {
      await fetch(this._fbUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch {}
  },

  save(data) {
    data._lastModified = Date.now();
    localStorage.setItem(this._key, JSON.stringify(data));
    this.pushRemote(data);
  }
};
