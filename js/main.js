/* ═══════════════════════════════════════
   PORTFOLIO — main.js
   Posts are read from GitHub _posts/{category}/*.md
   Profile is read from localStorage (set via dashboard.html)
═══════════════════════════════════════ */

const GH_KEY      = 'jn_gh';
const PROFILE_KEY = 'jn_profile';
const loadGH      = () => { try { return JSON.parse(localStorage.getItem(GH_KEY)) || {}; } catch { return {}; } };
const loadProfile = () => { try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}; } catch { return {}; } };
const esc      = s  => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fmtDate  = s  => s ? new Date(s).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) : '';
const readMins = s  => Math.max(1, Math.ceil((s||'').split(/\s+/).length / 200));
function setText(id,v){ const el=document.getElementById(id); if(el) el.textContent=v; }
function setHTML(id,v){ const el=document.getElementById(id); if(el) el.innerHTML=v; }

function ghRawBase(branch) {
  const {owner,repo}=loadGH(); if(!owner||!repo) return null;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch||'main'}`;
}
function ghApiBase() {
  const {owner,repo}=loadGH(); if(!owner||!repo) return null;
  return `https://api.github.com/repos/${owner}/${repo}`;
}

async function getDefaultBranch() {
  try {
    const gh=loadGH();
    const headers=gh.token?{'Authorization':`token ${gh.token}`}:{};
    const r=await fetch(`${ghApiBase()}`,{headers});
    if(!r.ok) return 'main';
    const data=await r.json();
    return data.default_branch||'main';
  } catch { return 'main'; }
}

function parseFrontMatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { body: raw };
  const fm = {};
  match[1].split('\n').forEach(line => {
    const col = line.indexOf(':'); if(col===-1) return;
    const key = line.slice(0,col).trim();
    let val = line.slice(col+1).trim().replace(/^["']|["']$/g,'');
    if(val.startsWith('[')){ try{ fm[key]=JSON.parse(val.replace(/'/g,'"')); return; }catch{} }
    fm[key]=val;
  });
  fm.body = match[2].trim();
  return fm;
}

async function fetchPostsForCategory(category) {
  const apiBase=ghApiBase(); if(!apiBase) return [];
  try {
    const gh=loadGH();
    const headers=gh.token?{'Authorization':`token ${gh.token}`}:{};
    const branch=await getDefaultBranch();
    const r=await fetch(`${apiBase}/contents/_posts/${category}`,{headers});
    if(!r.ok) return [];
    const files=await r.json();
    const mdFiles=files.filter(f=>f.name.endsWith('.md'));
    const rawBase=ghRawBase(branch);
    const posts=await Promise.all(mdFiles.map(async f=>{
      try{
        const res=await fetch(`${rawBase}/_posts/${category}/${f.name}`);
        if(!res.ok) return null;
        const text=await res.text();
        const parsed=parseFrontMatter(text);
        return {...parsed,category,filename:f.name,sha:f.sha,path:f.path};
      }catch{return null;}
    }));
    return posts.filter(Boolean);
  }catch{return [];}
}

const CATEGORIES=[
  {key:'stories',label:'Personal Stories'},
  {key:'math',label:'Pure Math'},
  {key:'research',label:'AI Research'},
  {key:'achievements',label:'Achievements'},
  {key:'scholarships',label:'Scholarships'},
  {key:'publications',label:'Publications'},
];
function findCat(key){return CATEGORIES.find(c=>c.key===key)||{label:'Post'};}

function svgGithub(){return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;}
function svgLinkedin(){return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;}
function svgEmail(){return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;}

function renderProfile(){
  const p=loadProfile(); const gh=loadGH();
  setText('hero-name',    p.name    ||'Jennifer Nguyen');
  setText('hero-tagline', p.tagline ||'Computer Science · Mathematics · AI Research');
  setText('hero-bio',     p.bio     ||'I study the mathematics of learning — probability, learning theory, and game theory — and explore how these ideas shape modern AI.');
  setText('footer-name',  p.name    ||'Jennifer Nguyen');
  const navLogo=document.getElementById('nav-logo-txt'); if(navLogo) navLogo.textContent=p.name||'Jennifer Nguyen';
  const photoImg=document.getElementById('hero-photo-img'); const photoInit=document.getElementById('hero-photo-init');
  if(p.photoUrl&&photoImg){photoImg.src=p.photoUrl;photoImg.style.display='block';if(photoInit)photoInit.style.display='none';}
  else if(photoInit){photoInit.textContent=(p.name||'JN').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();}
  const ghUser=p.github||gh.owner;
  const ghEl=document.getElementById('social-github'); if(ghEl&&ghUser){ghEl.href=`https://github.com/${ghUser}`;ghEl.style.display='inline-flex';}
  const liEl=document.getElementById('social-linkedin'); if(liEl&&p.linkedin){liEl.href=`https://linkedin.com/in/${p.linkedin}`;liEl.style.display='inline-flex';}
  const emEl=document.getElementById('social-email'); if(emEl&&p.email){emEl.href=`mailto:${p.email}`;emEl.style.display='inline-flex';}
  // contact links are hardcoded in HTML — skip dynamic render
}

async function renderInnerPage(categoryKey){
  const cat=findCat(categoryKey);
  const list=document.getElementById('page-post-list'); if(!list) return;
  setText('page-label',cat.label); setText('page-title',cat.label);
  const gh=loadGH();
  if(!gh.owner||!gh.repo){
    list.innerHTML=`<p class="empty-page">Connect your GitHub repo in the <a href="../dashboard.html" style="color:var(--accent)">dashboard</a> to see posts.</p>`;
    return;
  }
  list.innerHTML=`<p class="empty-page" style="color:var(--faint)">Loading…</p>`;
  const posts=await fetchPostsForCategory(categoryKey);
  posts.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
  if(!posts.length){
    list.innerHTML=`<p class="empty-page">Nothing here yet — write your first post in the <a href="../dashboard.html" style="color:var(--accent)">dashboard</a>.</p>`;
    return;
  }
  window.__posts=posts;
  list.innerHTML=posts.map((p,i)=>{
    const tags=Array.isArray(p.tags)?p.tags:(p.tags||'').split(',').map(s=>s.trim()).filter(Boolean);
    return `<div class="page-post-item" data-idx="${i}" role="button" tabindex="0">
      <div class="page-post-date">${fmtDate(p.date)}</div>
      <div class="page-post-title">${esc(p.title||'Untitled')}</div>
      ${p.excerpt?`<div class="page-post-excerpt">${esc(p.excerpt)}</div>`:p.body?`<div class="page-post-excerpt">${esc(p.body.slice(0,180))}</div>`:''}
      ${tags.length?`<div class="page-post-tags">${tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`:''}
    </div>`;
  }).join('');
  list.querySelectorAll('.page-post-item').forEach(el=>{
    const open=()=>openModal(parseInt(el.dataset.idx));
    el.addEventListener('click',open);
    el.addEventListener('keydown',e=>e.key==='Enter'&&open());
  });
}

function openModal(idx){
  const posts=window.__posts||[]; const p=posts[idx]; if(!p) return;
  const cat=findCat(p.category);
  const tags=Array.isArray(p.tags)?p.tags:(p.tags||'').split(',').map(s=>s.trim()).filter(Boolean);
  setText('modal-eyebrow',cat.label);
  setText('modal-title',p.title||'Untitled');
  setHTML('modal-meta',`<span>${fmtDate(p.date)}</span><span>${readMins(p.body)} min read</span>`);
  setHTML('modal-body',renderBodyMD(p.body||''));
  setHTML('modal-tags',tags.map(t=>`<span class="tag">${esc(t)}</span>`).join(''));
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(){document.getElementById('modal-overlay').classList.remove('open');document.body.style.overflow='';}

function renderBodyMD(md){
  let html=esc(md)
    .replace(/```[\s\S]*?```/g,m=>`<pre style="background:var(--bg-alt);padding:1rem;border-radius:4px;overflow-x:auto;margin-bottom:1rem;font-size:.82rem;font-family:monospace"><code>${m.slice(3,-3).replace(/^[^\n]*\n/,'')}</code></pre>`)
    .replace(/`([^`]+)`/g,'<code style="font-family:monospace;font-size:.85em;background:var(--bg-alt);padding:.1rem .35rem;border-radius:3px">$1</code>')
    .replace(/^### (.+)$/gm,'<h3 style="font-family:\'Playfair Display\',serif;color:var(--ink);margin:1.2rem 0 .4rem;font-size:1rem">$1</h3>')
    .replace(/^## (.+)$/gm,'<h2 style="font-family:\'Playfair Display\',serif;color:var(--ink);margin:1.4rem 0 .5rem;font-size:1.15rem">$1</h2>')
    .replace(/^# (.+)$/gm,'<h1 style="font-family:\'Playfair Display\',serif;color:var(--ink);margin:1.5rem 0 .6rem;font-size:1.4rem">$1</h1>')
    .replace(/^&gt; (.+)$/gm,'<blockquote style="border-left:3px solid var(--accent);padding-left:1rem;color:var(--muted);font-style:italic;margin-bottom:.9rem">$1</blockquote>')
    .replace(/\*\*([^*]+)\*\*/g,'<strong style="color:var(--ink);font-weight:500">$1</strong>')
    .replace(/\*([^*]+)\*/g,'<em>$1</em>')
    .replace(/^- (.+)$/gm,'<li style="margin-bottom:.3rem">$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline;text-underline-offset:2px">$1</a>')
    .replace(/\n\n+/g,'</p><p>');
  return `<div style="font-size:.92rem;color:var(--muted);line-height:1.9"><p>${html}</p></div>`;
}

/* ── JOURNEY ── */
const JOURNEY_KEY = 'jn_journey';
const DEFAULT_JOURNEY = [
  { id:'j1', period:'2019 – 2022', institution:'Your High School Name', role:'High School Student · Science Track', desc:'Describe your high school experience — the subjects you loved, the teachers who shaped you, and the early spark that pointed you toward mathematics and CS.', tags:'Mathematics, Physics, CS' },
  { id:'j2', period:'2022', institution:'National High School Graduation Exam', role:'THPT National Examination', desc:'Write about your exam results and how this moment opened the door to university.', tags:'Score: XX.XX, Top XX%' },
  { id:'j3', period:'2022 – 2023 · Year 1', institution:'Your University', role:'Bachelor of Computer Science · First Year', desc:'Freshman year — foundations in algorithms, discrete math, and the first taste of probability theory that would define my direction.', tags:'GPA: X.X, Algorithms, Probability' },
  { id:'j4', period:'2023 – 2024 · Year 2', institution:'Your University', role:'Bachelor of Computer Science · Second Year', desc:'Deeper into learning theory and game theory. First research involvement and the beginning of serious mathematical work.', tags:'Learning Theory, Game Theory, Research' },
];

function loadJourney() {
  try { return JSON.parse(localStorage.getItem(JOURNEY_KEY)) || DEFAULT_JOURNEY; } catch { return DEFAULT_JOURNEY; }
}
function saveJourney(j) { localStorage.setItem(JOURNEY_KEY, JSON.stringify(j)); }

function renderJourney() {
  const container = document.getElementById('timeline-container');
  if (!container) return;
  const entries = loadJourney();
  if (!entries.length) { container.innerHTML = '<p style="color:var(--faint);font-style:italic;font-size:.88rem">No journey entries yet — add them in the dashboard.</p>'; return; }
  container.innerHTML = entries.map(e => {
    const tags = (e.tags||'').split(',').map(t=>t.trim()).filter(Boolean);
    return `<div class="tl-entry">
      <div class="tl-dot"></div>
      <div class="tl-card">
        <p class="tl-period">${esc(e.period)}</p>
        <h3 class="tl-institution">${esc(e.institution)}</h3>
        <p class="tl-role">${esc(e.role)}</p>
        <p class="tl-desc">${esc(e.desc)}</p>
        ${tags.length ? `<div class="tl-tags">${tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function initNavScroll(){
  const nav=document.querySelector('.nav'); if(!nav) return;
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40),{passive:true});
}

function initSkillBars(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.querySelectorAll('.skill-bar-fill').forEach(b=>{b.style.width=b.dataset.w||b.style.width;});
        obs.unobserve(e.target);
      }
    });
  },{threshold:.3});
  document.querySelectorAll('.skills-grid').forEach(el=>{
    el.querySelectorAll('.skill-bar-fill').forEach(b=>{b.dataset.w=b.style.width;b.style.width='0%';});
    obs.observe(el);
  });
}

/* ── RECENT POSTS ── */
const CAT_LABELS_MAP = {stories:'Personal Stories',math:'Pure Math',research:'AI Research',achievements:'Achievements',scholarships:'Scholarships',publications:'Publications'};
const CAT_PAGE = {stories:'pages/stories.html',math:'pages/math.html',research:'pages/research.html',achievements:'pages/achievements.html',scholarships:'pages/scholarships.html',publications:'pages/publications.html'};

async function renderRecentPosts() {
  const container = document.getElementById('recent-posts-list');
  if (!container) return;
  const gh = loadGH();
  if (!gh.owner || !gh.repo) {
    container.innerHTML=`<p style="color:var(--faint);font-style:italic;font-size:.88rem">Connect GitHub in the <a href="dashboard.html" style="color:var(--accent)">dashboard</a> to see recent posts.</p>`;
    return;
  }
  try {
    const allCats=['stories','math','research','achievements','scholarships','publications'];
    const allFiles=[];
    const branch=await getDefaultBranch();
    await Promise.all(allCats.map(async cat=>{
      try{
        const headers=gh.token?{'Authorization':`token ${gh.token}`}:{};
        const r=await fetch(`https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/_posts/${cat}`,{headers});
        if(!r.ok) return;
        const files=await r.json();
        files.filter(f=>f.name.endsWith('.md')).forEach(f=>allFiles.push({...f,category:cat}));
      }catch{}
    }));
    allFiles.sort((a,b)=>b.name.localeCompare(a.name));
    const recent=allFiles.slice(0,1);
    if(!recent.length){
      container.innerHTML=`<p style="color:var(--faint);font-style:italic;font-size:.88rem">No posts yet — write your first in the <a href="dashboard.html" style="color:var(--accent)">dashboard</a>.</p>`;
      return;
    }
    const posts=await Promise.all(recent.map(async f=>{
      try{
        const res=await fetch(`${ghRawBase(branch)}/_posts/${f.category}/${f.name}`);
        if(!res.ok) return null;
        return{...parseFrontMatter(await res.text()),category:f.category,filename:f.name};
      }catch{return null;}
    }));
    const valid=posts.filter(Boolean);
    window.__recentPosts=valid;
    container.innerHTML=`
      <div class="recent-list">
        ${valid.map((p,i)=>`
          <div class="recent-item" data-ridx="${i}" role="button" tabindex="0">
            <span class="recent-item-cat">${CAT_LABELS_MAP[p.category]||p.category}</span>
            <div>
              <div class="recent-item-title">${esc(p.title||'Untitled')}</div>
              ${p.excerpt?`<div class="recent-item-excerpt">${esc(p.excerpt)}</div>`:''}
            </div>
            <span class="recent-item-date">${fmtDate(p.date)}</span>
          </div>`).join('')}
      </div>
      <a class="recent-view-all" href="#writing">Browse all writing →</a>`;
    container.querySelectorAll('.recent-item').forEach(el=>{
      const open=()=>{window.__posts=window.__recentPosts;openModal(parseInt(el.dataset.ridx));};
      el.addEventListener('click',open);
      el.addEventListener('keydown',e=>e.key==='Enter'&&open());
    });
  }catch{
    container.innerHTML=`<p style="color:var(--faint);font-size:.85rem">Could not load posts.</p>`;
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  const fy=document.getElementById('footer-year'); if(fy) fy.textContent=new Date().getFullYear();
  initNavScroll(); initSkillBars(); renderProfile(); renderJourney();
  renderRecentPosts();
  document.querySelectorAll('.cat-card').forEach(card=>{
    card.addEventListener('keydown',e=>{if(e.key==='Enter')card.click();});
  });
  document.getElementById('modal-close')?.addEventListener('click',closeModal);
  document.getElementById('modal-overlay')?.addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  if(window.__pageCategory) renderInnerPage(window.__pageCategory);
});