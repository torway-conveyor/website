/* ===== components page ===== */
(function(){
  const MAP=[{key:"belt",label:"comp_belt"},{key:"parts",label:"comp_parts"}];
  let filter="all", shown=20;
  function items(){
    const out=[];
    MAP.forEach(c=>{
      if(filter!=="all" && filter!==c.key) return;
      (SITE_DATA.components[c.key]||[]).forEach((it,i)=> out.push({cat:t(c.label), img:it.f, group:"comp-"+c.key, idx:i}));
    });
    return out;
  }
  function render(reset){
    if(reset) shown=20;
    const grid=$("#compGridPage"); grid.innerHTML="";
    const all=items();
    all.slice(0,shown).forEach(it=>{
      const fig=document.createElement("figure");
      fig.className="comp-card reveal in";
      fig.innerHTML=`<img src="${it.img}" loading="lazy" alt=""><figcaption>${it.cat}</figcaption>`;
      fig.addEventListener("click",()=> _openLb(it.group, it.idx));
      grid.appendChild(fig);
    });
    const btn=$("#compMorePage");
    if(shown>=all.length){ btn.style.display="none"; }
    else { btn.style.display=""; btn.textContent=t("load_more"); }
  }
  function buildFilters(){
    const wrap=$("#compFilterBar"); wrap.innerHTML="";
    const mk=(k,label)=>{
      const b=document.createElement("button");
      b.textContent=label; b.className=k===filter?"active":"";
      b.addEventListener("click",()=>{ filter=k; shown=20; buildFilters(); render(); });
      wrap.appendChild(b);
    };
    mk("all",t("prod_all"));
    MAP.forEach(c=> mk(c.key, t(c.label)));
  }
  $("#compMorePage").addEventListener("click", () => { shown += 20; render(); });
  window.onLangChange=()=>{ applyPageI18n(); buildFilters(); render(true); };
  initLightbox(group=>{
    const key=group.slice(5);
    return (SITE_DATA.components[key]||[]).map(x=>x.f);
  });
  initChrome(); applyPageI18n(); buildFilters(); render();
})();

