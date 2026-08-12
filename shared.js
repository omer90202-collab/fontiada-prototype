/* ═══════════════════════════════════════════════
   פונטיאדה — נתונים ותשתית משותפת לכל דפי האתר
   33 הפונטים הסופיים (פונטים סופיים, 2026-08-06)
   + עגלה, משתמש (localStorage), הדר אחיד וטוסטים
   ═══════════════════════════════════════════════ */

const FONTS = [
  { slug:'aviv',    he:'אביב',   tag:'עגול וידידותי',    tier:39 },
  { slug:'balloon', he:'בלון',   tag:'תצוגה מנופחת',     tier:59 },
  { slug:'choresh', he:'חורש',   tag:'מכחול פראי',       tier:59 },
  { slug:'chotam',  he:'חותם',   tag:'סטנסיל חד',        tier:39 },
  { slug:'cochav',  he:'כוכב',   tag:'תצוגה נוצצת',      tier:39 },
  { slug:'dagan',   he:'דגן',    tag:'נטוי וזורם',       tier:39 },
  { slug:'erez',    he:'ארז',    tag:'יציב וגברי',       tier:39 },
  { slug:'karmel',  he:'כרמל',   tag:'אורגני ורך',       tier:39 },
  { slug:'katzin',  he:'קצין',   tag:'מרובע וסמכותי',    tier:39 },
  { slug:'maor',    he:'מאור',   tag:'נקי ומאיר',        tier:39 },
  { slug:'meged',   he:'מגד',    tag:'קלאסי מתוק',       tier:39 },
  { slug:'nachal',  he:'נחל',    tag:'זורם וגמיש',       tier:39 },
  { slug:'neohar',  he:'נאור',   tag:'בהיר ופתוח',       tier:39 },
  { slug:'neohari', he:'נהוראי', tag:'הדגל שלנו',        tier:59 },
  { slug:'nekuda',  he:'נקודה',  tag:'גיאומטרי מדויק',   tier:39 },
  { slug:'nof',     he:'נוף',    tag:'רחב ופנורמי',      tier:39 },
  { slug:'rahut',   he:'רהוט',   tag:'כתב יד שוטף',      tier:59 },
  { slug:'rakia',   he:'רקיע',   tag:'אוורירי וגבוה',    tier:59 },
  { slug:'rimon',   he:'רימון',  tag:'עסיסי ומלא',       tier:39 },
  { slug:'tsuk',    he:'צוק',    tag:'חצוב וחזק',        tier:39 },
  { slug:'yareach', he:'ירח',    tag:'לילי וחולמני',     tier:59 },
  { slug:'yesod',   he:'יסוד',   tag:'בסיסי ואמין',      tier:39 },
  { slug:'zohar',   he:'זוהר',   tag:'תצוגה זוהרת',      tier:59 },
  { slug:'alon',    he:'אלון',   tag:'יציב וארצי',       tier:39 },
  { slug:'barzel',  he:'ברזל',   tag:'כבד ותעשייתי',     tier:39 },
  { slug:'katav',   he:'כתב',    tag:'כתב יד אישי',      tier:59 },
  { slug:'kedem',   he:'קדם',    tag:'צר במיוחד',        tier:39 },
  { slug:'migdal',  he:'מגדל',   tag:'גבוה וזקוף',       tier:39 },
  { slug:'nogah',   he:'נוגה',   tag:'דידון אלגנטי',     tier:59 },
  { slug:'ofek',    he:'אופק',   tag:'רחב ופתוח',        tier:39 },
  { slug:'sahar',   he:'סהר',    tag:'מעוגל ולילי',      tier:39 },
  { slug:'sapir',   he:'ספיר',   tag:'מלוטש ויוקרתי',    tier:59 },
  { slug:'tavor',   he:'תבור',   tag:'מוצק כמו הר',      tier:39 },
];

/* בלוקים רוויים (כיוון ג׳) — צבעים עמוקים שלבן קריא עליהם */
const CARD_COLORS = ['#e8320f','#1439c4','#0c7a43','#5b21b6','#0e7490','#d6186e','#b4441c','#8a6d00'];
const cardColor = i => CARD_COLORS[i % CARD_COLORS.length];
const fontBySlug = s => FONTS.find(f => f.slug === s);

/* ── עיגול פינות מונפש בריחוף על כל אלמנט לחיץ (רפרנס: blazetype.eu) ──
   הפינות מתעגלות בהדרגה עם ease קפיצי קל — לא קפיצה מיידית.
   מוזרק מכאן כדי לחול על כל דפי האתר; ה-<style> מתווסף אחרי ה-CSS של
   הדף ולכן גובר עליו בקסקדה. */
(function injectHoverRounding(){
  const css = `
  /* קו תחתון מונפש על קישורי התפריט — בכל הדפים */
  .nav-links a{position:relative}
  .nav-links a::after{content:'';position:absolute;right:0;bottom:-4px;height:2px;width:0;background:var(--accent,#e8320f);transition:width .25s}
  .nav-links a:hover::after{width:100%}

  /* בלוקים גדולים לחיצים — כרטיסים ופוסטרים העומדים בפני עצמם.
     חשוב: לא תאי גריד צמודים (.grid .fcard) — עיגול תא צמוד חושף את
     רקע קווי-ההפרדה ונראה כמו תא שזז ממקומו. */
  .fcard:not(.grid .fcard), .sim-card, .poster{
    transition: border-radius .84s cubic-bezier(.3,1.2,.55,1),
                transform .3s ease, box-shadow .3s ease, background-color .25s;
  }
  .fcard:hover:not(.grid .fcard), .sim-card:hover, .poster:hover{ border-radius:30px }

  /* כפתורים וצ'יפים — עיגול פרופורציונלי לגודלם (לא גלולה דרמטית) */
  .nav-cta, .btn-big, .btn-buy, .btn-add2, .btn-pay, .btn, .chip, .fbtn,
  .preset, .addbtn, .tabs button, .free-form button, .dl-card .dl,
  .p-item .dls a, .logout, .poster__link, .sticky-buy button{
    transition: border-radius .7s cubic-bezier(.3,1.2,.55,1),
                background-color .25s, color .25s, border-color .25s,
                transform .25s ease, box-shadow .25s ease;
  }
  .nav-cta:hover, .btn-big:hover, .btn-buy:hover, .btn-add2:hover,
  .btn-pay:hover:not(:disabled), .btn:hover, .chip:hover, .fbtn:hover,
  .preset:hover, .addbtn:hover, .tabs button:hover, .free-form button:hover,
  .dl-card .dl:hover, .p-item .dls a:hover, .logout:hover,
  .poster__link:hover, .sticky-buy button:hover{ border-radius:12px }
  `;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

/* הזרקת @font-face לכל הקטלוג */
(function injectFonts(){
  const css = FONTS.map(f =>
    `@font-face{font-family:'${f.slug}';src:url('fonts/${f.slug}.woff2') format('woff2');font-display:swap;}`
  ).join('\n');
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

/* ── עגלה (localStorage) ── */
const Cart = {
  get(){ try { return JSON.parse(localStorage.getItem('fontiada_cart')) || []; } catch(e){ return []; } },
  save(items){ localStorage.setItem('fontiada_cart', JSON.stringify(items)); Cart.updateBadge(); },
  add(slug){
    const items = Cart.get();
    if (items.includes(slug)) { toast('הפונט כבר בעגלה שלכם 😉'); return false; }
    items.push(slug); Cart.save(items);
    const f = fontBySlug(slug);
    toast(f ? `${f.he} נוסף לעגלה ✓` : 'נוסף לעגלה ✓');
    return true;
  },
  remove(slug){ Cart.save(Cart.get().filter(s => s !== slug)); },
  clear(){ Cart.save([]); },
  count(){ return Cart.get().length; },
  /* תמחור: 5 פונטים (עד 2 פרימיום) = ₪149 · אחרת סכימה רגילה */
  pricing(){
    const items = Cart.get().map(fontBySlug).filter(Boolean);
    const regular = items.reduce((a,f) => a + f.tier, 0);
    const premiums = items.filter(f => f.tier === 59).length;
    if (items.length === 5 && premiums <= 2 && 149 < regular)
      return { total:149, bundle:'בחרו-5', saved: regular - 149 };
    return { total: regular, bundle:null, saved:0 };
  },
  updateBadge(){
    document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = Cart.count());
  },
};

/* ── משתמש (דמו — localStorage) ── */
const User = {
  get(){ try { return JSON.parse(localStorage.getItem('fontiada_user')); } catch(e){ return null; } },
  set(u){ localStorage.setItem('fontiada_user', JSON.stringify(u)); },
  logout(){ localStorage.removeItem('fontiada_user'); },
  purchases(){ try { return JSON.parse(localStorage.getItem('fontiada_purchases')) || []; } catch(e){ return []; } },
  addPurchase(slugs, total){
    const p = User.purchases();
    p.push({ slugs, total, date: new Date().toLocaleDateString('he-IL') });
    localStorage.setItem('fontiada_purchases', JSON.stringify(p));
  },
};

/* ── טוסט ── */
function toast(msg){
  let t = document.getElementById('pt-toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'pt-toast';
    t.style.cssText = 'position:fixed;bottom:28px;inset-inline:0;margin-inline:auto;width:max-content;max-width:86vw;background:#16130f;color:#f6f1e7;padding:14px 26px;border-radius:99px;font-size:15px;font-weight:700;z-index:200;opacity:0;transform:translateY(16px);transition:.35s;pointer-events:none;box-shadow:0 12px 40px rgba(0,0,0,.25)';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => { t.style.opacity = 1; t.style.transform = 'translateY(0)'; });
  clearTimeout(t._h);
  t._h = setTimeout(() => { t.style.opacity = 0; t.style.transform = 'translateY(16px)'; }, 2600);
}

/* ── הדר אחיד: מוזרק לכל דף עם <div id="site-header"></div> ── */
function renderHeader(active){
  const el = document.getElementById('site-header');
  if (!el) return;
  const u = User.get();
  el.innerHTML = `
  <nav class="nav">
    <a href="index.html" class="logo" aria-label="פונטיאדה"><img src="logo-black.svg" alt="פונטיאדה"></a>
    <div class="nav-links">
      <a href="catalog.html" ${active==='catalog' ? 'style="font-weight:900"' : ''}>הקטלוג</a>
      <a href="index.html#free">חינמיים</a>
      <a href="index.html#pricing">מחירים</a>
      <a href="about.html" ${active==='about' ? 'style="font-weight:900"' : ''}>הסיפור</a>
      <a href="license.html" ${active==='license' ? 'style="font-weight:900"' : ''}>הרישיון</a>
    </div>
    <div style="display:flex;gap:10px;align-items:center">
      <a href="login.html" class="nav-user">${u ? '👤 ' + u.name : 'התחברות'}</a>
      <button class="nav-cta" onclick="location.href='cart.html'">🛒 עגלה (<span data-cart-count>0</span>)</button>
    </div>
  </nav>`;
  Cart.updateBadge();
}

/* ── פוטר אחיד: מוזרק לכל דף עם <div id="site-footer"></div> ── */
function renderFooter(){
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
  <footer class="site-footer">
    <span>פונטיאדה © 2026 · בית נגיש לפונטים</span>
    <div class="flinks">
      <a href="catalog.html">הקטלוג</a>
      <a href="about.html">הסיפור</a>
      <a href="license.html">הרישיון ומדיניות רכישה</a>
    </div>
    <span>כל המחירים כוללים מע״מ</span>
  </footer>`;
}
