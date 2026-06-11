/* ═══════════════════════════
   STORAGE
═══════════════════════════ */
const POSTS_KEY   = 'jn_posts';
const PROFILE_KEY = 'jn_profile';

const loadPosts   = () => { try { return JSON.parse(localStorage.getItem(POSTS_KEY)) || []; } catch { return []; } };
const savePosts   = p  => localStorage.setItem(POSTS_KEY, JSON.stringify(p));
const loadProfile = () => { try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}; } catch { return {}; } };
const saveProfile = p  => localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
const genId       = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const fmtDate     = s  => s ? new Date(s).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) : '';
const readMins    = s  => Math.max(1, Math.ceil((s||'').split(/\s+/).length / 200));
const esc         = s  => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const today       = () => new Date().toISOString().slice(0,10);

/* ═══════════════════════════
   CATEGORIES
═══════════════════════════ */
const CATEGORIES = [
  { key:'stories',  icon:'✦', label:'Personal Stories', letter:'S', desc:'Reflections, experiences, and the moments that shaped who I am.',                   page:'pages/stories.html'  },
  { key:'math',     icon:'∑', label:'Pure Math',        letter:'M', desc:'Notes, proofs, and musings on probability, learning theory, and game theory.',       page:'pages/math.html'     },
  { key:'research', icon:'◈', label:'AI Research',      letter:'R', desc:'Papers, ideas, and explorations at the intersection of mathematics and AI.',         page:'pages/research.html' },
];

const MILESTONE_CATEGORIES = [
  { key:'achievements',  label:'Achievements',  page:'pages/achievements.html'  },
  { key:'scholarships',  label:'Scholarships',  page:'pages/scholarships.html'  },
  { key:'publications',  label:'Publications',  page:'pages/publications.html'  },
];
function renderProfile() {
  const p = loadProfile();
  setText('hero-name',    p.name     || 'Jennifer Nguyen');
  setText('hero-tagline', p.tagline  || 'Computer Science · Mathematics · AI Research');
  setText('hero-bio',     p.bio      || 'I study the mathematics of learning — probability, learning theory, and game theory — and explore how these ideas shape modern AI. This is where I document the journey.');
  setText('footer-name',  p.name     || 'Jennifer Nguyen');
  setText('nav-logo-txt', p.name     || 'Jennifer Nguyen');

  // hero social links
  const ghEl  = document.getElementById('social-github');
  const liEl  = document.getElementById('social-linkedin');
  const emEl  = document.getElementById('social-email');
  if (ghEl && p.github)   { ghEl.href = `https://github.com/${p.github}`; ghEl.style.display='inline-flex'; }
  if (liEl && p.linkedin) { liEl.href = `https://linkedin.com/in/${p.linkedin}`; liEl.style.display='inline-flex'; }
  if (emEl && p.email)    { emEl.href = `mailto:${p.email}`; emEl.style.display='inline-flex'; }

  // contact section
  renderContactLinks(p);

  // photo
  const photoEl = document.getElementById('hero-photo-img');
  const initEl  = document.getElementById('hero-photo-init');
  if (photoEl && p.photoUrl) {
    photoEl.src = p.photoUrl;
    photoEl.style.display = 'block';
    if (initEl) initEl.style.display = 'none';
  } else if (initEl) {
    initEl.textContent = (p.name||'JN').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    if (photoEl) photoEl.style.display = 'none';
  }
}

function renderContactLinks(p) {
  const wrap = document.getElementById('contact-links');
  if (!wrap) return;
  p = p || loadProfile();
  const rows = [
    p.email    && `<a class="contact-link" href="mailto:${esc(p.email)}">${svgEmail()}<span>${esc(p.email)}</span></a>`,
    p.github   && `<a class="contact-link" href="https://github.com/${esc(p.github)}" target="_blank" rel="noopener">${svgGithub()}<span>github.com/${esc(p.github)}</span></a>`,
    p.linkedin && `<a class="contact-link" href="https://linkedin.com/in/${esc(p.linkedin)}" target="_blank" rel="noopener">${svgLinkedin()}<span>linkedin.com/in/${esc(p.linkedin)}</span></a>`,
  ].filter(Boolean);
  wrap.innerHTML = rows.length ? rows.join('') : '<p style="color:var(--faint);font-size:.85rem;font-style:italic;">Set your contact info in the dashboard.</p>';
}

/* ═══════════════════════════
   CATEGORY CARDS (homepage)
═══════════════════════════ */
function renderCatGrid() {
  const el = document.getElementById('cat-grid');
  if (!el) return;
  const posts = loadPosts();
  el.innerHTML = CATEGORIES.map(c => {
    const count = posts.filter(p => p.category === c.key).length;
    return `
    <div class="cat-card" data-letter="${c.letter}" onclick="location.href='${c.page}'" role="link" tabindex="0" aria-label="Go to ${c.label}">
      <div class="cat-icon">${c.icon}</div>
      <div class="cat-title">${c.label}</div>
      <div class="cat-desc">${c.desc}</div>
      <div class="cat-link">Read more →</div>
      ${count ? `<span class="cat-count">${count} post${count===1?'':'s'}</span>` : ''}
    </div>`;
  }).join('');
  el.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('keydown', e => { if (e.key==='Enter') card.click(); });
  });
}

function allCategories() { return [...CATEGORIES, ...MILESTONE_CATEGORIES]; }

function findCat(key) { return allCategories().find(c => c.key === key) || { label: 'Post' }; }
function renderInnerPage(categoryKey) {
  const cat = findCat(categoryKey);

  setText('page-label', cat.label);
  setText('page-title', cat.label);
  const subEl = document.getElementById('page-subtitle');
  if (subEl) subEl.textContent = cat.desc || '';

  const posts = loadPosts()
    .filter(p => p.category === categoryKey)
    .sort((a,b) => new Date(b.date)-new Date(a.date));

  const list = document.getElementById('page-post-list');
  if (!list) return;

  if (!posts.length) {
    list.innerHTML = `<p class="empty-page">Nothing here yet — write your first post in the dashboard.</p>`;
    return;
  }
  list.innerHTML = posts.map(p => {
    const tags = (p.tags||'').split(',').map(s=>s.trim()).filter(Boolean);
    return `
    <div class="page-post-item" data-id="${p.id}" role="button" tabindex="0">
      <div class="page-post-date">${fmtDate(p.date)}</div>
      <div class="page-post-title">${esc(p.title)}</div>
      ${p.excerpt ? `<div class="page-post-excerpt">${esc(p.excerpt)}</div>` : p.body ? `<div class="page-post-excerpt">${esc(p.body.slice(0,180))}</div>` : ''}
      ${tags.length ? `<div class="page-post-tags">${tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
    </div>`;
  }).join('');

  list.querySelectorAll('.page-post-item').forEach(el => {
    const open = () => openModal(el.dataset.id);
    el.addEventListener('click', open);
    el.addEventListener('keydown', e => e.key==='Enter' && open());
  });

  // update dash button category default
  const catSel = document.getElementById('w-category');
  if (catSel) catSel.value = categoryKey;
}

/* ═══════════════════════════
   MODAL
═══════════════════════════ */
function openModal(id) {
  const p = loadPosts().find(x => x.id === id);
  if (!p) return;
  const cat = findCat(p.category);
  const tags = (p.tags||'').split(',').map(s=>s.trim()).filter(Boolean);

  setText('modal-eyebrow', cat.label);
  setText('modal-title',   p.title);
  setHTML('modal-meta',    `<span>${fmtDate(p.date)}</span><span>${readMins(p.body)} min read</span>`);
  setText('modal-body',    p.body);
  setHTML('modal-tags',    tags.map(t=>`<span class="tag">${esc(t)}</span>`).join(''));

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow='';
}

/* ═══════════════════════════
   DASHBOARD
═══════════════════════════ */
function openDash() {
  document.getElementById('dash-overlay').classList.add('open');
  document.body.style.overflow='hidden';
  switchDash('write');
}
function closeDash() {
  document.getElementById('dash-overlay').classList.remove('open');
  document.body.style.overflow='';
  // re-render if on inner page
  if (window.__pageCategory) renderInnerPage(window.__pageCategory);
  if (typeof renderCatGrid === 'function') renderCatGrid();
}
function switchDash(view) {
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.toggle('active', t.dataset.tab===view));
  document.querySelectorAll('.dash-view').forEach(el => el.classList.toggle('active', el.dataset.view===view));
  if (view==='manage') renderManage();
  if (view==='profile') fillProfile();
}

function initWriteForm() {
  const form = document.getElementById('write-form');
  if (!form) return;
  const dateEl = form.querySelector('[name="date"]');
  if (dateEl && !dateEl.value) dateEl.value = today();
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const post = {
      id:       genId(),
      category: fd.get('category') || 'research',
      title:    (fd.get('title')||'').trim(),
      excerpt:  (fd.get('excerpt')||'').trim(),
      body:     (fd.get('body')||'').trim(),
      tags:     (fd.get('tags')||'').trim(),
      date:     fd.get('date') || today(),
    };
    if (!post.title || !post.body) { toast('Title and content are required.'); return; }
    const posts = loadPosts(); posts.unshift(post); savePosts(posts);
    form.reset(); dateEl && (dateEl.value=today());
    toast('Published ✓');
  });
}

function renderManage() {
  const list = document.getElementById('manage-list');
  if (!list) return;
  const posts = loadPosts().sort((a,b) => new Date(b.date)-new Date(a.date));
  if (!posts.length) { list.innerHTML='<p style="color:var(--faint);font-style:italic;padding:2rem 0;font-size:.85rem;">No posts yet.</p>'; return; }
  list.innerHTML = posts.map(p => {
    const cat = findCat(p.category);
    return `<div class="manage-row">
      <div class="manage-info">
        <div class="manage-title">${esc(p.title)}</div>
        <div class="manage-sub"><span>${cat.label}</span><span>${fmtDate(p.date)}</span></div>
      </div>
      <div class="manage-actions">
        <button class="btn-sm" data-edit="${p.id}">Edit</button>
        <button class="btn-sm del" data-del="${p.id}">Delete</button>
      </div>
    </div>`;
  }).join('');
  list.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Delete this post?')) return;
      savePosts(loadPosts().filter(p=>p.id!==btn.dataset.del));
      renderManage(); toast('Deleted.');
    });
  });
  list.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => { fillEdit(btn.dataset.edit); switchDash('edit'); });
  });
}

function fillEdit(id) {
  const p = loadPosts().find(x=>x.id===id);
  if (!p) return;
  const form = document.getElementById('edit-form');
  if (!form) return;
  form.dataset.id = id;
  ['category','title','excerpt','body','tags','date'].forEach(k => {
    const el = form.querySelector(`[name="${k}"]`);
    if (el) el.value = p[k]||'';
  });
}
function initEditForm() {
  const form = document.getElementById('edit-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = form.dataset.id;
    const fd = new FormData(form);
    const posts = loadPosts();
    const i = posts.findIndex(p=>p.id===id);
    if (i===-1) { toast('Post not found.'); return; }
    posts[i] = { ...posts[i], category:fd.get('category'), title:(fd.get('title')||'').trim(),
      excerpt:(fd.get('excerpt')||'').trim(), body:(fd.get('body')||'').trim(),
      tags:(fd.get('tags')||'').trim(), date:fd.get('date')||today() };
    savePosts(posts); toast('Updated ✓'); switchDash('manage');
  });
}

function fillProfile() {
  const p = loadProfile();
  const form = document.getElementById('profile-form');
  if (!form) return;
  ['name','tagline','bio','email','github','linkedin','photoUrl'].forEach(k => {
    const el = form.querySelector(`[name="${k}"]`);
    if (el) el.value = p[k]||'';
  });
}
function initProfileForm() {
  const form = document.getElementById('profile-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const profile = {};
    for (const [k,v] of fd.entries()) profile[k] = v.trim();
    saveProfile(profile);
    renderProfile();
    toast('Profile saved ✓');
  });
}

/* ═══════════════════════════
   CATEGORY SELECT BUILDER
═══════════════════════════ */
function buildCategorySelects() {
  const all = [
    ...CATEGORIES,
    ...MILESTONE_CATEGORIES,
  ];
  document.querySelectorAll('.cat-select').forEach(sel => {
    sel.innerHTML = all.map(c => `<option value="${c.key}">${c.label}</option>`).join('');
  });
}

/* ═══════════════════════════
   NAV SCROLL
═══════════════════════════ */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY>40), {passive:true});
}

/* ═══════════════════════════
   SVG ICONS
═══════════════════════════ */
function svgGithub() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;
}
function svgLinkedin() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
}
function svgEmail() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
}

/* ═══════════════════════════
   UTILS
═══════════════════════════ */
function setText(id, val) { const el=document.getElementById(id); if(el) el.textContent=val; }
function setHTML(id, val) { const el=document.getElementById(id); if(el) el.innerHTML=val; }
function toast(msg) {
  const el=document.getElementById('toast'); if(!el) return;
  el.textContent=msg; el.classList.add('show');
  clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),2800);
}

/* ═══════════════════════════
   BOOT
═══════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('footer-year') && (document.getElementById('footer-year').textContent=new Date().getFullYear());

  initNavScroll();
  buildCategorySelects();
  renderProfile();
  // keyboard nav for cat-cards
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('keydown', e => { if (e.key === 'Enter') card.click(); });
  });
  if (window.__pageCategory) renderInnerPage(window.__pageCategory);

  // skill bars
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = bar.dataset.w || bar.style.width; });
        skillObs.unobserve(e.target);
      }
    });
  }, {threshold:.3});
  document.querySelectorAll('.skills-grid').forEach(el => {
    el.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.dataset.w = bar.style.width; bar.style.width='0%'; });
    skillObs.observe(el);
  });

  // modal
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-overlay')?.addEventListener('click', e => { if(e.target===e.currentTarget) closeModal(); });

  // dashboard
  document.getElementById('nav-write-btn')?.addEventListener('click', openDash);
  document.getElementById('dash-close-btn')?.addEventListener('click', closeDash);
  document.querySelectorAll('.dash-tab').forEach(btn => btn.addEventListener('click', ()=>switchDash(btn.dataset.tab)));

  // escape
  document.addEventListener('keydown', e => { if(e.key==='Escape'){closeModal();closeDash();} });

  initWriteForm();
  initEditForm();
  initProfileForm();
});
