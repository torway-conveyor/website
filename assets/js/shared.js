/* ===== shared subpage logic: footer year, reveal, lang restore ===== */
// Language preference is restored by i18n.js automatically in each page's main.js-lite
function initShared(baseDepth){
  document.querySelectorAll(".reveal").forEach(el=>{
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)el.classList.add("in")}),{threshold:.1});
    io.observe(el);
  });
}
initShared();
