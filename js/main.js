/* ═══════════════════════════════════════
   PORTFOLIO — main.js
   ALL content fetched from GitHub.
   Only token + language pref in localStorage.
═══════════════════════════════════════ */

/* ── GITHUB CONFIG ── */
const GH_KEY  = 'jn_gh';
const LANG_KEY = 'jn_lang';
const loadGH  = () => { try { return JSON.parse(localStorage.getItem(GH_KEY)) || {}; } catch { return {}; } };

let currentLang = localStorage.getItem(LANG_KEY) || 'en';

/* ── UTILS ── */
const esc      = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fmtDate  = s => s ? new Date(s).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) : '';
const readMins = s => Math.max(1,Math.ceil((s||'').split(/\s+/).length/200));
function setText(id,v){const el=document.getElementById(id);if(el)el.textContent=v;}
function setHTML(id,v){const el=document.getElementById(id);if(el)el.innerHTML=v;}
function today(){return new Date().toISOString().slice(0,10);}

/* ── GITHUB URLS ── */
function ghRawBase(branch){
  const {owner,repo}=loadGH(); if(!owner||!repo) return null;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch||'main'}`;
}
function ghApiBase(){
  const {owner,repo}=loadGH(); if(!owner||!repo) return null;
  return `https://api.github.com/repos/${owner}/${repo}`;
}
async function getDefaultBranch(){
  try{
    const gh=loadGH();
    const headers=gh.token?{'Authorization':`token ${gh.token}`}:{};
    const r=await fetch(`${ghApiBase()}`,{headers});
    if(!r.ok) return 'main';
    return (await r.json()).default_branch||'main';
  }catch{return 'main';}
}

/* cache the branch so we don't refetch every call */
let _branch = null;
async function branch(){
  if(!_branch) _branch = await getDefaultBranch();
  return _branch;
}

/* fetch a JSON file from _data/ */
async function fetchData(filename){
  const gh=loadGH(); if(!gh.owner||!gh.repo) return null;
  try{
    const b=await branch();
    const r=await fetch(`https://raw.githubusercontent.com/${gh.owner}/${gh.repo}/${b}/_data/${filename}`,
      gh.token?{headers:{'Authorization':`token ${gh.token}`}}:{});
    if(!r.ok) return null;
    return await r.json();
  }catch{return null;}
}

/* ── FRONT-MATTER PARSER ── */
function parseFrontMatter(raw){
  const match=raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if(!match) return {body:raw};
  const fm={};
  match[1].split('\n').forEach(line=>{
    const col=line.indexOf(':'); if(col===-1) return;
    const key=line.slice(0,col).trim();
    let val=line.slice(col+1).trim().replace(/^["']|["']$/g,'');
    if(val.startsWith('[')){ try{fm[key]=JSON.parse(val.replace(/'/g,'"'));return;}catch{} }
    fm[key]=val;
  });
  fm.body=match[2].trim();
  return fm;
}

/* ── FETCH POSTS ── */
async function fetchPostsForCategory(category){
  const apiBase=ghApiBase(); if(!apiBase) return [];
  try{
    const gh=loadGH();
    const headers=gh.token?{'Authorization':`token ${gh.token}`}:{};
    const b=await branch();
    const r=await fetch(`${apiBase}/contents/_posts/${category}`,{headers});
    if(!r.ok) return [];
    const files=await r.json();
    const mdFiles=files.filter(f=>f.name.endsWith('.md'));
    const rawBase=ghRawBase(b);
    const posts=await Promise.all(mdFiles.map(async f=>{
      try{
        const res=await fetch(`${rawBase}/_posts/${category}/${f.name}`);
        if(!res.ok) return null;
        return{...parseFrontMatter(await res.text()),category,filename:f.name,sha:f.sha,path:f.path};
      }catch{return null;}
    }));
    return posts.filter(Boolean);
  }catch{return [];}
}

/* ── I18N ── */
const TRANSLATIONS={
  en:{
    nav_recent:'Recent',nav_journey:'Journey',nav_milestones:'Milestones',
    nav_skills:'Skills',nav_writing:'Writing',nav_contact:'Contact',nav_write:'+ Write',
    hero_eyebrow:'Personal Site',
    scroll:'Scroll',
    recent_label:'Latest',recent_title:'Recent Posts',
    journey_label:'Chapter by chapter',journey_title:'My Academic Journey',
    milestones_label:'Highlights',milestones_title:'Achievements & Milestones',
    cat_achievements:'Achievements',cat_achievements_desc:'Awards, honours, and recognition earned along the way.',
    cat_scholarships:'Scholarships',cat_scholarships_desc:'Funding, fellowships, and academic support received.',
    cat_publications:'Publications',cat_publications_desc:"Papers, articles, and anything I've had the chance to publish.",
    skills_label:'What I bring',skills_title:'Skills & Competencies',
    writing_label:'Explore',writing_title:'Writing & Work',
    cat_stories:'Personal Stories',cat_stories_desc:'Reflections, experiences, and the moments that shaped who I am.',
    cat_math:'Pure Math',cat_math_desc:'Notes, proofs, and musings on probability, learning theory, and game theory.',
    cat_research:'AI Research',cat_research_desc:'Papers, ideas, and explorations at the intersection of mathematics and AI.',
    contact_label:'Get in touch',contact_title:"Let's Connect",
    contact_intro:"I'm always happy to connect with fellow students, researchers, or anyone curious about mathematics and AI. Whether you have a question about a project or just want to say hello — feel free to reach out.",
    read_more:'Read more →',loading:'Loading…',empty_posts:'Nothing here yet.',
    browse_writing:'Browse all writing →',
    page_subtitle_stories:'Reflections, experiences, and the moments that shaped who I am.',
    page_subtitle_math:'Notes, proofs, and musings on probability, learning theory, and game theory.',
    page_subtitle_research:'Papers, ideas, and explorations at the intersection of mathematics and AI.',
    page_subtitle_achievements:'Awards, honours, and recognition earned along the way.',
    page_subtitle_scholarships:'Funding, fellowships, and academic support received.',
    page_subtitle_publications:"Papers, articles, and anything I've had the chance to publish.",
  },
  vi:{
    nav_recent:'Mới nhất',nav_journey:'Hành trình',nav_milestones:'Cột mốc',
    nav_skills:'Kỹ năng',nav_writing:'Bài viết',nav_contact:'Liên hệ',nav_write:'+ Viết',
    hero_eyebrow:'Trang cá nhân',
    scroll:'Cuộn',
    recent_label:'Gần đây',recent_title:'Bài viết mới nhất',
    journey_label:'Từng chương',journey_title:'Hành trình học thuật',
    milestones_label:'Nổi bật',milestones_title:'Thành tích & Cột mốc',
    cat_achievements:'Thành tích',cat_achievements_desc:'Các giải thưởng và sự ghi nhận trên con đường học tập.',
    cat_scholarships:'Học bổng',cat_scholarships_desc:'Các học bổng và hỗ trợ học thuật đã nhận được.',
    cat_publications:'Công bố khoa học',cat_publications_desc:'Các bài báo và công trình đã được công bố.',
    skills_label:'Năng lực',skills_title:'Kỹ năng & Năng lực',
    writing_label:'Khám phá',writing_title:'Bài viết & Công trình',
    cat_stories:'Câu chuyện cá nhân',cat_stories_desc:'Những suy ngẫm và khoảnh khắc đã định hình con người tôi.',
    cat_math:'Toán học thuần túy',cat_math_desc:'Ghi chú, chứng minh và suy ngẫm về xác suất, lý thuyết học và lý thuyết trò chơi.',
    cat_research:'Nghiên cứu AI',cat_research_desc:'Các bài báo và khám phá tại giao điểm giữa toán học và AI.',
    contact_label:'Liên hệ',contact_title:'Kết nối với tôi',
    contact_intro:'Tôi luôn sẵn lòng kết nối với các bạn sinh viên, nhà nghiên cứu, hay bất kỳ ai tò mò về toán học và AI.',
    read_more:'Xem thêm →',loading:'Đang tải…',empty_posts:'Chưa có bài viết nào.',
    browse_writing:'Xem tất cả bài viết →',
    page_subtitle_stories:'Những suy ngẫm và khoảnh khắc đã định hình con người tôi.',
    page_subtitle_math:'Ghi chú, chứng minh và suy ngẫm về xác suất, lý thuyết học và lý thuyết trò chơi.',
    page_subtitle_research:'Các bài báo và khám phá tại giao điểm giữa toán học và AI.',
    page_subtitle_achievements:'Các giải thưởng và sự ghi nhận trên con đường học tập.',
    page_subtitle_scholarships:'Các học bổng và hỗ trợ học thuật đã nhận được.',
    page_subtitle_publications:'Các bài báo và công trình đã được công bố.',
  }
};

function t(key){return(TRANSLATIONS[currentLang]||TRANSLATIONS.en)[key]||TRANSLATIONS.en[key]||key;}

function applyTranslations(){
  document.documentElement.lang=currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const val=t(el.dataset.i18n); if(val) el.textContent=val;
  });
  const toggle=document.getElementById('lang-toggle');
  if(toggle){
    toggle.textContent=currentLang==='en'?'VI':'EN';
    toggle.classList.toggle('vi',currentLang==='vi');
  }
}

function toggleLang(){
  currentLang=currentLang==='en'?'vi':'en';
  localStorage.setItem(LANG_KEY,currentLang);
  applyTranslations();
  renderJourney();
  renderSkills();
  renderRecentPosts();
  if(window.__pageCategory) renderInnerPage(window.__pageCategory);
}

/* ── PROFILE (from GitHub _data/profile.json) ── */
async function renderProfile(){
  const p=await fetchData('profile.json');
  if(!p) return;

  const name=p.name||'Jennifer Nguyen';
  setText('hero-name',name);
  const tagEl=document.getElementById('hero-tagline');
  if(tagEl) tagEl.textContent=currentLang==='vi'?(p.tagline_vi||p.tagline||''):( p.tagline||'');
  const bioEl=document.getElementById('hero-bio');
  if(bioEl) bioEl.textContent=currentLang==='vi'?(p.bio_vi||p.bio||''):(p.bio||'');
  setText('footer-name',name);
  const navLogo=document.getElementById('nav-logo-txt'); if(navLogo) navLogo.textContent=name;

  // photo
  const photoImg=document.getElementById('hero-photo-img');
  const photoInit=document.getElementById('hero-photo-init');
  if(p.photoUrl&&photoImg){photoImg.src=p.photoUrl;photoImg.style.display='block';if(photoInit)photoInit.style.display='none';}
  else if(photoInit){photoInit.textContent=name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();}
}

/* ── JOURNEY (from GitHub _data/journey.json) ── */
async function renderJourney(){
  const container=document.getElementById('timeline-container'); if(!container) return;
  container.innerHTML=`<p style="color:var(--faint);font-style:italic;font-size:.88rem">${t('loading')}</p>`;
  const all=await fetchData('journey.json');
  if(!all||!all.length){container.innerHTML=`<p style="color:var(--faint);font-style:italic;font-size:.88rem">${t('empty_posts')}</p>`;return;}
  const entries=all.filter(e=>(e.lang||'en')===currentLang||(e.lang||'en')==='both');
  if(!entries.length){container.innerHTML=`<p style="color:var(--faint);font-style:italic;font-size:.88rem">${t('empty_posts')}</p>`;return;}
  container.innerHTML=entries.map(e=>{
    const desc=currentLang==='vi'?(e.desc_vi||e.desc||''):(e.desc||'');
    const role=currentLang==='vi'?(e.role_vi||e.role||''):(e.role||'');
    const tags=(e.tags||'').split(',').map(s=>s.trim()).filter(Boolean);
    return `<div class="tl-entry">
      <div class="tl-dot"></div>
      <div class="tl-card">
        <p class="tl-period">${esc(e.period)}</p>
        <h3 class="tl-institution">${esc(e.institution)}</h3>
        <p class="tl-role">${esc(role)}</p>
        <p class="tl-desc">${esc(desc)}</p>
        ${tags.length?`<div class="tl-tags">${tags.map(tg=>`<span class="tag">${esc(tg)}</span>`).join('')}</div>`:''}
      </div>
    </div>`;
  }).join('');
}

/* ── SKILLS (from GitHub _data/skills.json) ── */
async function renderSkills(){
  const container=document.querySelector('.skills-grid'); if(!container) return;
  const data=await fetchData('skills.json');
  if(!data||!data.length) return;
  container.innerHTML=data.map(group=>{
    const groupName=currentLang==='vi'?(group.group_vi||group.group):group.group;
    return `<div class="skill-group">
      <h3>${esc(groupName)}</h3>
      ${group.items.map(item=>{
        const label=currentLang==='vi'?(item.label_vi||item.label):item.label;
        return `<div class="skill-item">
          <span class="skill-label">${esc(label)} <span class="skill-pct">${item.pct}%</span></span>
          <div class="skill-bar-bg"><div class="skill-bar-fill" style="width:0%" data-w="${item.pct}%"></div></div>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');
  // re-init skill bar animations
  initSkillBars();
}

/* ── CATEGORIES ── */
const CATEGORIES=[
  {key:'stories',label:'Personal Stories'},{key:'math',label:'Pure Math'},
  {key:'research',label:'AI Research'},{key:'achievements',label:'Achievements'},
  {key:'scholarships',label:'Scholarships'},{key:'publications',label:'Publications'},
];
function findCat(key){return CATEGORIES.find(c=>c.key===key)||{label:'Post'};}

/* ── INNER PAGE ── */
async function renderInnerPage(categoryKey){
  const cat=findCat(categoryKey);
  const list=document.getElementById('page-post-list'); if(!list) return;
  setText('page-label',cat.label); setText('page-title',cat.label);
  const subEl=document.getElementById('page-subtitle');
  if(subEl) subEl.textContent=t('page_subtitle_'+categoryKey)||'';
  const gh=loadGH();
  if(!gh.owner||!gh.repo){
    list.innerHTML=`<p class="empty-page">${t('empty_posts')}</p>`; return;
  }
  list.innerHTML=`<p class="empty-page" style="color:var(--faint)">${t('loading')}</p>`;
  const posts=await fetchPostsForCategory(categoryKey);
  const filtered=posts.filter(p=>(p.lang||'en')===currentLang||(p.lang||'en')==='both');
  filtered.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
  if(!filtered.length){list.innerHTML=`<p class="empty-page">${t('empty_posts')}</p>`;return;}
  window.__posts=filtered;
  list.innerHTML=filtered.map((p,i)=>{
    const tags=Array.isArray(p.tags)?p.tags:(p.tags||'').split(',').map(s=>s.trim()).filter(Boolean);
    return `<div class="page-post-item" data-idx="${i}" role="button" tabindex="0">
      <div class="page-post-date">${fmtDate(p.date)}</div>
      <div class="page-post-title">${esc(p.title||'Untitled')}</div>
      ${p.excerpt?`<div class="page-post-excerpt">${esc(p.excerpt)}</div>`:p.body?`<div class="page-post-excerpt">${esc(p.body.slice(0,180))}</div>`:''}
      ${tags.length?`<div class="page-post-tags">${tags.map(tg=>`<span class="tag">${esc(tg)}</span>`).join('')}</div>`:''}
    </div>`;
  }).join('');
  list.querySelectorAll('.page-post-item').forEach(el=>{
    const open=()=>openModal(parseInt(el.dataset.idx));
    el.addEventListener('click',open); el.addEventListener('keydown',e=>e.key==='Enter'&&open());
  });
}

/* ── MODAL ── */
function openModal(idx){
  const posts=window.__posts||[]; const p=posts[idx]; if(!p) return;
  const cat=findCat(p.category);
  const tags=Array.isArray(p.tags)?p.tags:(p.tags||'').split(',').map(s=>s.trim()).filter(Boolean);
  setText('modal-eyebrow',cat.label);
  setText('modal-title',p.title||'Untitled');
  setHTML('modal-meta',`<span>${fmtDate(p.date)}</span><span>${readMins(p.body)} min read</span>`);
  setHTML('modal-body',renderBodyMD(p.body||''));
  setHTML('modal-tags',tags.map(tg=>`<span class="tag">${esc(tg)}</span>`).join(''));
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

/* ── RECENT POSTS ── */
async function renderRecentPosts(){
  const container=document.getElementById('recent-posts-list'); if(!container) return;
  const gh=loadGH();
  if(!gh.owner||!gh.repo){
    container.innerHTML=`<p style="color:var(--faint);font-style:italic;font-size:.88rem">${t('empty_posts')}</p>`;return;
  }
  try{
    const allCats=['stories','math','research','achievements','scholarships','publications'];
    const allFiles=[];
    const b=await branch();
    await Promise.all(allCats.map(async cat=>{
      try{
        const headers=gh.token?{'Authorization':`token ${gh.token}`}:{};
        const r=await fetch(`https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/_posts/${cat}`,{headers});
        if(!r.ok) return;
        const files=await r.json();
        files.filter(f=>f.name.endsWith('.md')).forEach(f=>allFiles.push({...f,category:cat}));
      }catch{}
    }));
    allFiles.sort((a,b_)=>b_.name.localeCompare(a.name));
    const recent=allFiles.slice(0,5);
    if(!recent.length){container.innerHTML=`<p style="color:var(--faint);font-style:italic;font-size:.88rem">${t('empty_posts')}</p>`;return;}
    const posts=await Promise.all(recent.map(async f=>{
      try{
        const res=await fetch(`https://raw.githubusercontent.com/${gh.owner}/${gh.repo}/${b}/_posts/${f.category}/${f.name}`);
        if(!res.ok) return null;
        const p={...parseFrontMatter(await res.text()),category:f.category,filename:f.name};
        if((p.lang||'en')!==currentLang&&(p.lang||'en')!=='both') return null;
        return p;
      }catch{return null;}
    }));
    const valid=posts.filter(Boolean).slice(0,1);
    if(!valid.length){container.innerHTML=`<p style="color:var(--faint);font-style:italic;font-size:.88rem">${t('empty_posts')}</p>`;return;}
    const CAT_LABELS={stories:'Personal Stories',math:'Pure Math',research:'AI Research',achievements:'Achievements',scholarships:'Scholarships',publications:'Publications'};
    window.__recentPosts=valid;
    container.innerHTML=`
      <div class="recent-list">
        ${valid.map((p,i)=>`
          <div class="recent-item" data-ridx="${i}" role="button" tabindex="0">
            <span class="recent-item-cat">${CAT_LABELS[p.category]||p.category}</span>
            <div>
              <div class="recent-item-title">${esc(p.title||'Untitled')}</div>
              ${p.excerpt?`<div class="recent-item-excerpt">${esc(p.excerpt)}</div>`:''}
            </div>
            <span class="recent-item-date">${fmtDate(p.date)}</span>
          </div>`).join('')}
      </div>
      <a class="recent-view-all" href="#writing">${t('browse_writing')}</a>`;
    container.querySelectorAll('.recent-item').forEach(el=>{
      const open=()=>{window.__posts=window.__recentPosts;openModal(parseInt(el.dataset.ridx));};
      el.addEventListener('click',open); el.addEventListener('keydown',e=>e.key==='Enter'&&open());
    });
  }catch{container.innerHTML=`<p style="color:var(--faint);font-size:.85rem">${t('empty_posts')}</p>`;}
}

/* ── SVG ICONS ── */
function svgGithub(){return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;}
function svgLinkedin(){return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;}
function svgEmail(){return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;}

/* ── NAV SCROLL ── */
function initNavScroll(){
  const nav=document.querySelector('.nav'); if(!nav) return;
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40),{passive:true});
}

/* ── SKILL BARS ── */
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
    el.querySelectorAll('.skill-bar-fill').forEach(b=>{b.dataset.w=b.dataset.w||b.style.width;b.style.width='0%';});
    obs.observe(el);
  });
}

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded',async()=>{
  const fy=document.getElementById('footer-year'); if(fy) fy.textContent=new Date().getFullYear();
  currentLang=localStorage.getItem(LANG_KEY)||'en';
  applyTranslations();
  initNavScroll();

  document.getElementById('lang-toggle')?.addEventListener('click',toggleLang);
  document.getElementById('modal-close')?.addEventListener('click',closeModal);
  document.getElementById('modal-overlay')?.addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  document.querySelectorAll('.cat-card').forEach(card=>{
    card.addEventListener('keydown',e=>{if(e.key==='Enter')card.click();});
  });

  // fetch all GitHub data in parallel
  await Promise.all([
    renderProfile(),
    renderJourney(),
    renderSkills(),
    renderRecentPosts(),
  ]);

  initSkillBars();

  if(window.__pageCategory) renderInnerPage(window.__pageCategory);
});