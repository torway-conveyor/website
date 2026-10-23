/* ===== TORWAY Conveyor — homepage behaviors ===== */
(function(){
"use strict";
const $  = (s,c)=> (c||document).querySelector(s);
const $$ = (s,c)=> Array.from((c||document).querySelectorAll(s));

/* ---------- i18n ---------- */
const LANGS = ["zh","en","ms","th","id","tl"];
let lang = localStorage.getItem("yf-lang") || (navigator.language||"zh").slice(0,2).toLowerCase();
if(!LANGS.includes(lang)) lang = "zh";

function t(key){ const e = I18N[key]; return e ? (e[lang] || e.en || "") : key; }

function applyI18n(){
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach(el=>{ el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-ph]").forEach(el=>{ el.placeholder = t(el.dataset.i18nPh); });
  $$("#langSwitch button").forEach(b=> b.classList.toggle("active", b.dataset.lang===lang));
  document.title = lang==="zh" ? "托尔威输送机 — 输送机制造商，支持非标定制" : "TORWAY Conveyor — Custom Conveyor Manufacturer";
  buildProdFilters(); renderProducts(true); buildCompFilters(); renderComponents(); renderGallery(true);
}

$$("#langSwitch button").forEach(b=> b.addEventListener("click", ()=>{
  lang = b.dataset.lang; localStorage.setItem("yf-lang", lang); applyI18n();
}));

/* ---------- header nav ---------- */
const nav = $("#nav"), navToggle = $("#navToggle");
navToggle.addEventListener("click", ()=> nav.classList.toggle("open"));
$$("#nav a").forEach(a=> a.addEventListener("click", ()=> nav.classList.remove("open")));

const header = $("#header");
window.addEventListener("scroll", ()=>{
  header.style.boxShadow = window.scrollY > 10 ? "0 4px 20px rgba(11,42,74,.14)" : "0 2px 14px rgba(11,42,74,.08)";
  let cur = "";
  $$("section[id]").forEach(s=>{ if(window.scrollY >= s.offsetTop - 120) cur = s.id; });
  $$("#nav a").forEach(a=> a.classList.toggle("active", a.getAttribute("href")==="#"+cur));
});

/* ---------- hero slider ---------- */
const slides = $$(".hero-slide"), dotsWrap = $("#heroDots");
slides.forEach((_,i)=>{
  const b = document.createElement("button");
  if(i===0) b.classList.add("active");
  b.addEventListener("click", ()=> showSlide(i));
  dotsWrap.appendChild(b);
});
let slideIdx = 0;
function showSlide(i){
  slideIdx = (i+slides.length)%slides.length;
  slides.forEach((s,k)=> s.classList.toggle("active", k===slideIdx));
  $$("#heroDots button").forEach((d,k)=> d.classList.toggle("active", k===slideIdx));
}
setInterval(()=> showSlide(slideIdx+1), 5000);

/* ---------- counters ---------- */
function animateCounters(){
  $$("[data-counter]").forEach(el=>{
    const target = +el.dataset.counter, dur = 1400, t0 = performance.now();
    function step(now){
      const p = Math.min((now-t0)/dur, 1);
      el.textContent = Math.round(target * (p<.5 ? 2*p*p : -1+(4-2*p)*p));
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ---------- products ---------- */
const PRODUCTS = [
  {key:"mini",           dataKey:"prod_mini"},
  {key:"horizontal",     dataKey:"prod_horizontal"},
  {key:"inclined",       dataKey:"prod_inclined"},
  {key:"curve",          dataKey:"prod_curve"},
  {key:"slat-chain",     dataKey:"prod_slat"},
  {key:"roller",         dataKey:"prod_roller"},
  {key:"flexible-chain", dataKey:"prod_flex"},
  {key:"incline-platform",dataKey:"prod_platform"},
  {key:"tunnel-oven",    dataKey:"prod_tunnel"},
];
let prodFilter = "all", prodShown = 6;

function buildProdFilters(){
  const wrap = $("#prodFilters"); wrap.innerHTML = "";
  const mk = (key,label)=>{
    const b = document.createElement("button");
    b.textContent = label;
    b.className = key===prodFilter ? "active" : "";
    b.addEventListener("click", ()=>{ prodFilter=key; prodShown=6; buildProdFilters(); renderProducts(); });
    wrap.appendChild(b);
  };
  mk("all", t("prod_all"));
  PRODUCTS.forEach(p=> mk(p.key, t(p.dataKey)));
}

function renderProducts(){
  const grid = $("#prodGrid"); grid.innerHTML = "";
  const list = prodFilter==="all" ? PRODUCTS : PRODUCTS.filter(p=>p.key===prodFilter);
  const shown = list.slice(0, prodShown);
  shown.forEach(p=>{
    const imgs = SITE_DATA.products[p.key] || [];
    const cover = imgs[0];
    const card = document.createElement("article");
    card.className = "prod-card linked reveal in";
    card.innerHTML =
      `<div class="pc-media">
         ${cover?`<img src="${cover.t}" alt="${t(p.dataKey)}" loading="lazy">`:""}
         <span class="pc-count">${imgs.length} ${t("prod_photo_count")}</span>
       </div>
       <div class="pc-body">
         <h3>${t(p.dataKey)}</h3>
         <p>${t(p.dataKey+"_d")}</p>
         <a class="pc-link" href="products/detail.html?m=${p.key}">${t("prod_view")}</a>
       </div>`;
    card.addEventListener("click", e=>{ if(e.target.tagName!=="A") location.href="products/detail.html?m="+p.key; });
    grid.appendChild(card);
  });
  const btn = $("#prodMore");
  btn.style.display = prodShown >= list.length ? "none" : "";
}
$("#prodMore").addEventListener("click", ()=>{ prodShown += 3; renderProducts(); });

/* ---------- components ---------- */
const COMP_MAP = [
  {key:"belt", label:"comp_belt"},
  {key:"parts",label:"comp_parts"},
];
let compFilter = "all";
function buildCompFilters(){
  const wrap = $("#compFilters"); wrap.innerHTML="";
  const mk = (key,label)=>{
    const b=document.createElement("button");
    b.textContent=label; b.className = key===compFilter?"active":"";
    b.addEventListener("click",()=>{ compFilter=key; buildCompFilters(); renderComponents(); });
    wrap.appendChild(b);
  };
  mk("all", t("prod_all"));
  COMP_MAP.forEach(c=> mk(c.key, t(c.label)));
}
function renderComponents(){
  const grid=$("#compGrid"); grid.innerHTML="";
  let items=[];
  COMP_MAP.forEach(c=>{
    if(compFilter!=="all" && compFilter!==c.key) return;
    (SITE_DATA.components[c.key]||[]).forEach((it,i)=> items.push({cat:t(c.label), img:it.f, group:"comp-"+c.key, idx:i}));
  });
  items.forEach(it=>{
    const fig=document.createElement("figure");
    fig.className="comp-card reveal in";
    fig.innerHTML=`<img src="${it.img}" loading="lazy" alt="${it.cat}"><figcaption>${it.cat}</figcaption>`;
    fig.addEventListener("click",()=> openLightbox(it.group, it.idx));
    grid.appendChild(fig);
  });
}

/* ---------- customer gallery ---------- */
let galShown = 16;
function galleryItems(){
  const out=[];
  Object.keys(GALLERY).forEach(g=>{
    GALLERY[g].forEach((img,i)=> out.push({img, group:g, idx:i}));
  });
  const cols=[[],[],[],[]];
  out.forEach((it,i)=> cols[i%4].push(it));
  return cols[0].map((_,r)=> cols.map(c=>c[r]).filter(Boolean)).flat();
}
function renderGallery(reset){
  if(reset) galShown = 16;
  const wrap=$("#galMasonry"); wrap.innerHTML="";
  const all = galleryItems();
  all.slice(0,galShown).forEach(it=>{
    const d=document.createElement("div");
    d.className="gal-tile";
    d.innerHTML=`<img src="${it.img}" loading="lazy" alt=""><div class="gal-cap">${t("cust_store")}</div>`;
    d.addEventListener("click",()=> openLightbox(it.group, it.idx));
    wrap.appendChild(d);
  });
  $("#galMore").style.display = galShown >= all.length ? "none":"";
}
$("#galMore").addEventListener("click", ()=>{ galShown += 16; renderGallery(); });

/* ---------- lightbox ---------- */
const lb=$("#lightbox"), lbImg=$("#lbImg"), lbCap=$("#lbCaption");
let lbList=[], lbIdx=0;
function lbData(group, idx){
  if(group.startsWith("prod-")){
    const key=group.slice(5);
    return (SITE_DATA.products[key]||[]).map(x=>x.f);
  }
  if(group.startsWith("comp-")){
    const key=group.slice(5);
    return (SITE_DATA.components[key]||[]).map(x=>x.f);
  }
  return GALLERY[group]||[];
}
function openLightbox(group, idx){
  lbList = lbData(group, idx); lbIdx = idx||0;
  if(!lbList.length) return;
  lbImg.src = lbList[lbIdx];
  lbCap.textContent = `${lbIdx+1} / ${lbList.length}`;
  lb.classList.add("open");
  document.body.style.overflow="hidden";
}
function closeLightbox(){ lb.classList.remove("open"); document.body.style.overflow=""; }
function stepLightbox(d){
  if(!lbList.length) return;
  lbIdx = (lbIdx+d+lbList.length)%lbList.length;
  lbImg.src = lbList[lbIdx];
  lbCap.textContent = `${lbIdx+1} / ${lbList.length}`;
}
$("#lbClose").addEventListener("click", closeLightbox);
$("#lbPrev").addEventListener("click", ()=> stepLightbox(-1));
$("#lbNext").addEventListener("click", ()=> stepLightbox(1));
lb.addEventListener("click", e=>{ if(e.target===lb) closeLightbox(); });
document.addEventListener("keydown", e=>{
  if(!lb.classList.contains("open")) return;
  if(e.key==="Escape") closeLightbox();
  if(e.key==="ArrowLeft") stepLightbox(-1);
  if(e.key==="ArrowRight") stepLightbox(1);
});

/* ---------- form ---------- */
const formType=$("#formType");
PRODUCTS.forEach(p=>{
  const o=document.createElement("option");
  o.value=p.key;
  formType.appendChild(o);
});
function refreshFormOptions(){
  $$("#formType option").forEach((o,i)=>{
    if(i===0){ o.textContent=t("form_type_def"); return; }
    o.textContent = t(PRODUCTS[i-1].dataKey);
  });
}
$("#contactForm").addEventListener("submit", e=>{
  e.preventDefault();
  const btn=e.target.querySelector("button");
  btn.textContent=t("form_ok");
  setTimeout(()=>{ e.target.reset(); btn.textContent=t("form_send"); }, 3500);
});

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(entries=>{
  entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add("in"); });
},{threshold:.12});
$$(".reveal").forEach(el=> io.observe(el));

/* ---------- init ---------- */
applyI18n();
refreshFormOptions();
animateCounters();
$$("#langSwitch button").forEach(b=> b.addEventListener("click", ()=> refreshFormOptions()));
})();

