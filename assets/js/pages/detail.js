/* ===== product detail page ===== */
(function(){
  const params = new URLSearchParams(location.search);
  const key = params.get("m") || "mini";
  const P = (window.PAGE_PRODUCTS||[]).find(p=>p.key===key) || window.PAGE_PRODUCTS[0];
  document.title = t(P.dataKey) + " — TORWAY Conveyor";

  const imgs = SITE_DATA.products[P.key] || [];
  if(imgs.length){ $("#pageHero").style.backgroundImage = "url('" + imgs[0].f + "')"; }

  function fillHero(){
    const h = $("#phTitle"), s = $("#phSub");
    if(h) h.textContent = t(P.dataKey);
    if(s) s.textContent = t(P.dataKey + "_d");
  }

  function buildSpec(){
    const rows = [
      ["spec_frame","spec_frame_v"],
      ["spec_belt","spec_belt_v"],
      ["spec_speed","spec_speed_v"],
      ["spec_length","spec_length_v"],
      ["spec_voltage","spec_voltage_v"],
      ["spec_load","spec_load_" + P.key],
    ];
    $("#specTable").innerHTML = rows.map(r => "<tr><td>" + t(r[0]) + "</td><td>" + t(r[1]) + "</td></tr>").join("")
      + "<tr><td colspan='2' style='font-weight:400;color:var(--muted);font-size:12.5px'>" + t("spec_custom_note") + "</td></tr>";
  }

  const grid = $("#dgGrid");
  let shown = 12;
  function render(reset){
    if(reset) shown = 12;
    grid.innerHTML = "";
    imgs.slice(0, shown).forEach((im, i) => {
      const d = document.createElement("div");
      d.className = "dg-item reveal in";
      d.innerHTML = "<img src='" + im.f + "' loading='lazy' alt=''>";
      d.addEventListener("click", () => _openLb("p", i));
      grid.appendChild(d);
    });
    const btn = $("#dgMore");
    if(shown >= imgs.length){ btn.style.display = "none"; }
    else { btn.style.display = ""; btn.textContent = t("load_more"); }
  }
  $("#dgMore").addEventListener("click", () => { shown += 12; render(); });

  function renderRelated(){
    const rel = $("#relatedGrid"); rel.innerHTML = "";
    (window.PAGE_PRODUCTS||[]).filter(p => p.key !== P.key).slice(0, 3).forEach(p => {
      const im = (SITE_DATA.products[p.key]||[])[0];
      const card = document.createElement("article");
      card.className = "prod-card linked reveal in";
      card.innerHTML = "<div class='pc-media'><img src='" + (im ? im.t : "") + "' loading='lazy' alt=''></div>" +
        "<div class='pc-body'><h3>" + t(p.dataKey) + "</h3><p>" + t(p.dataKey + "_d") + "</p>" +
        "<a class='pc-link' href='detail.html?m=" + p.key + "'>" + t("prod_view") + "</a></div>";
      card.addEventListener("click", e => { if(e.target.tagName !== "A") location.href = "detail.html?m=" + p.key; });
      rel.appendChild(card);
    });
  }

  window.onLangChange = () => { applyPageI18n(); fillHero(); buildSpec(); render(true); renderRelated(); };

  initLightbox(() => imgs.map(x => x.f));
  initChrome();
  applyPageI18n();
  fillHero();
  buildSpec();
  render();
  renderRelated();
})();

