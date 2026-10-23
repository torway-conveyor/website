/* ===== customers page ===== */
(function(){
  let store="all", shown=24;
  function allItems(){
    const out=[];
    SITE_DATA.customers.forEach((s,si)=>{
      if(store!=="all" && store!==s.dir) return;
      s.images.forEach((img,ii)=> out.push({img, group:"s-"+s.dir, idx:ii, name:s.name}));
    });
    return out;
  }
  function render(reset){
    if(reset) shown=24;
    const grid=$("#custGridPage"); grid.innerHTML="";
    const all=allItems();
    all.slice(0,shown).forEach(it=>{
      const d=document.createElement("div");
      d.className="cg-item reveal in";
      d.innerHTML=`<img src="${it.img}" loading="lazy" alt="">`;
      d.addEventListener("click",()=> _openLb(it.group, it.idx));
      grid.appendChild(d);
    });
    const btn=$("#custMorePage");
    if(shown>=all.length){ btn.style.display="none"; btn.textContent=""; }
    else { btn.style.display=""; btn.textContent=t("load_more"); }
  }
  function buildBar(){
    const bar=$("#storeBar"); bar.innerHTML="";
    const mk=(k,label)=>{
      const b=document.createElement("button");
      b.textContent=label; b.className=k===store?"active":"";
      b.addEventListener("click",()=>{ store=k; shown=24; buildBar(); render(); });
      bar.appendChild(b);
    };
    mk("all", t("cust_store_all")+" ("+SITE_DATA.customers.length+")");
    SITE_DATA.customers.forEach(s=> mk(s.dir, s.name));
  }
  $("#custMorePage").addEventListener("click", () => { shown += 24; render(); });
  window.onLangChange=()=>{ applyPageI18n(); render(true); };
  initLightbox(group=>{
    const dir=group.slice(2);
    const s=SITE_DATA.customers.find(x=>x.dir===dir);
    return s ? s.images : [];
  });
  initChrome(); applyPageI18n(); buildBar(); render();
})();

