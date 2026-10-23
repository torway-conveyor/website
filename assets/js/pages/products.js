/* ===== products list page ===== */
(function(){
  let shown=6;
  const grid=$("#prodGridAll");
  function render(reset){
    if(reset) shown=6;
    grid.innerHTML="";
    (window.PAGE_PRODUCTS||[]).slice(0,shown).forEach(p=>{
      const imgs=SITE_DATA.products[p.key]||[];
      const im=imgs[0];
      const card=document.createElement("article");
      card.className="prod-card linked reveal in";
      card.innerHTML=`<div class="pc-media">
          <img src="${im?im.t:''}" loading="lazy" alt="">
          <span class="pc-count">${imgs.length} ${t("prod_photo_count")}</span>
        </div>
        <div class="pc-body"><h3>${t(p.dataKey)}</h3><p>${t(p.dataKey+"_d")}</p>
        <a class="pc-link" href="detail.html?m=${p.key}">${t("prod_view")}</a></div>`;
      card.addEventListener("click",e=>{ if(e.target.tagName!=="A") location.href="detail.html?m="+p.key; });
      grid.appendChild(card);
    });
    const btn=$("#prodMoreAll");
    if(shown>=(window.PAGE_PRODUCTS||[]).length){ btn.style.display="none"; }
    else { btn.style.display=""; btn.textContent=t("load_more"); }
  }
  $("#prodMoreAll").addEventListener("click",()=>{ shown+=3; render(); });
  window.onLangChange=()=>{ applyPageI18n(); render(true); };
  initChrome(); applyPageI18n(); render();
})();
