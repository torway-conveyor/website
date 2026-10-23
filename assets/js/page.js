/* ===== subpage common runtime: lang, lightbox, helpers ===== */
const LANGS = ["zh","en","ms","th","id","tl"];
let PAGE_LANG = localStorage.getItem("yf-lang") || (navigator.language||"zh").slice(0,2).toLowerCase();
if(!LANGS.includes(PAGE_LANG)) PAGE_LANG = "zh";

/* Rewrite SITE_DATA relative paths when page is in a subdirectory */
(function fixDataPaths(){
  if (location.pathname.indexOf("/products/") !== -1 && typeof SITE_DATA !== "undefined") {
    const prefix = "../";
    const fix = p => (typeof p === "string" && p.indexOf("img/") === 0) ? prefix + p : p;
    Object.keys(SITE_DATA.products || {}).forEach(k => {
      SITE_DATA.products[k] = SITE_DATA.products[k].map(x => ({t: fix(x.t), f: fix(x.f)}));
    });
    Object.keys(SITE_DATA.components || {}).forEach(k => {
      SITE_DATA.components[k] = SITE_DATA.components[k].map(x => ({f: fix(x.f), sub: x.sub}));
    });
    (SITE_DATA.customers || []).forEach(s => { s.images = s.images.map(fix); });
    SITE_DATA.heroes = (SITE_DATA.heroes || []).map(fix);
  }
})();

function t(key){ const e = I18N[key]; return e ? (e[PAGE_LANG] || e.en || "") : key; }

function applyPageI18n(){
  document.documentElement.lang = PAGE_LANG;
  $$("[data-i18n]").forEach(el=>{ el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-ph]").forEach(el=>{ el.placeholder = t(el.dataset.i18nPh); });
  $$("#langSwitch button").forEach(b=> b.classList.toggle("active", b.dataset.lang===PAGE_LANG));
  $$("#nav a").forEach(a=> a.classList.toggle("active", a.getAttribute("href")==="#"));
  $$("#formType option").forEach((o,i)=>{
    if(i===0){ o.textContent=t("form_type_def"); return; }
    const p=window.PAGE_PRODUCTS && window.PAGE_PRODUCTS[i-1];
    if(p) o.textContent = t(p.dataKey);
  });
}
function $(s,c){ return (c||document).querySelector(s); }
function $$(s,c){ return Array.from((c||document).querySelectorAll(s)); }

/* lightbox */
function initLightbox(listGetter){
  const lb=$("#lightbox"), lbImg=$("#lbImg"), lbCap=$("#lbCaption");
  let list=[], idx=0;
  window._openLb = function(group, i){
    list = listGetter(group); idx = i||0;
    if(!list.length) return;
    lbImg.src = list[idx];
    lbCap.textContent = (idx+1)+" / "+list.length;
    lb.classList.add("open"); document.body.style.overflow="hidden";
  };
  function step(d){ if(!list.length)return; idx=(idx+d+list.length)%list.length; lbImg.src=list[idx]; lbCap.textContent=(idx+1)+" / "+list.length; }
  $("#lbClose").addEventListener("click",()=>{ lb.classList.remove("open"); document.body.style.overflow=""; });
  $("#lbPrev").addEventListener("click",()=>step(-1));
  $("#lbNext").addEventListener("click",()=>step(1));
  lb.addEventListener("click",e=>{ if(e.target===lb){ lb.classList.remove("open"); document.body.style.overflow=""; } });
  document.addEventListener("keydown",e=>{
    if(!lb.classList.contains("open"))return;
    if(e.key==="Escape"){ lb.classList.remove("open"); document.body.style.overflow=""; }
    if(e.key==="ArrowLeft") step(-1);
    if(e.key==="ArrowRight") step(1);
  });
}

/* lang buttons + nav toggle (shared) */
function initChrome(){
  $$("#langSwitch button").forEach(b=> b.addEventListener("click", ()=>{
    PAGE_LANG=b.dataset.lang; localStorage.setItem("yf-lang",PAGE_LANG); applyPageI18n();
    if(window.onLangChange) window.onLangChange();
  }));
  const nav=$("#nav"), tog=$("#navToggle");
  if(tog) tog.addEventListener("click",()=> nav.classList.toggle("open"));
  $$("#nav a").forEach(a=> a.addEventListener("click",()=> nav.classList.remove("open")));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("in")}),{threshold:.1});
  $$(".reveal").forEach(el=>io.observe(el));
}


