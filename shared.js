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

/* ── סמן מותאם — פורט של Mouse Effects/13 + הפיזיקה של Physics Effects/1 ──
   שכבה אחת שמשלבת את שניהם:
   · בסיס (Mouse Effects/13): קנבס במסך מלא עם mix-blend-mode:difference ועליו
     עיגול לבן שרודף את העכבר ב-lerp .25. הערבוב הופך אותו לשחור על רקע בהיר
     וללבן על רקע כהה — לכן הוא נראה נכון בכל מקום באתר.
   · פיזיקה (Physics Effects/1 — sticky cursor): מעל אלמנט לחיץ קטן העיגול
     *נדבק* למרכז שלו, נמתח לאליפסה לכיוון העכבר (scaleX עד 1.3, scaleY עד 0.8)
     ומסתובב ב-atan2 — בדיוק כמו במקור. גדולים (כרטיסי פונט) רק מגדילים את
     העיגול, כי הידבקות למרכז של בלוק ענק נראית שבורה.
   התאמות הכרחיות: המקור משתמש ב-position:absolute + pageX/pageY (עובד רק בדף
   בלי גלילה) — אצלנו fixed + clientX/clientY; והקנבס מצויר לפי devicePixelRatio
   כדי שהעיגול לא ייצא מרוח במסך רטינה. */
(function stickyCursor(){
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (new URLSearchParams(location.search).has('static')) return;

  const cv = document.createElement('canvas');
  cv.id = 'cursorCanvas';
  cv.style.cssText = 'position:fixed;inset:0;z-index:150;pointer-events:none;mix-blend-mode:difference';
  const ctx = cv.getContext('2d');

  let w, h, dpr;
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    cv.style.width = w + 'px'; cv.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const HOVERABLE = 'a,button,input,textarea,select,[contenteditable="true"],.fcard,.ch,.chip,.preset,.fbtn';
  /* עד הגודל הזה הסמן נדבק לאלמנט; מעליו הוא רק גדל */
  const STICK_MAX_W = 300, STICK_MAX_H = 150;
  const R = 9, R_HOVER = 34;

  let mx = innerWidth / 2, my = innerHeight / 2, seen = false;
  let el = null;                                   /* האלמנט שמתחתיו העכבר */
  let x = mx, y = my, r = R;                       /* מצב מצויר (מונפש) */
  let sx = 1, sy = 1, ang = 0;
  let tx = mx, ty = my, tr = R, tsx = 1, tsy = 1, tang = 0;

  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
  const lerp  = (a,b,n) => (1-n)*a + n*b;

  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!seen) { seen = true; x = mx; y = my; tx = mx; ty = my; document.body.appendChild(cv); }
    el = e.target && e.target.closest ? e.target.closest(HOVERABLE) : null;
  }, { passive:true });
  addEventListener('mouseout', e => { if (!e.relatedTarget) el = null; });
  addEventListener('resize', size);
  /* אחרי מעברון עמוד האלמנט הישן כבר לא קיים */
  addEventListener('pt:navigated', () => { el = null; });

  size();

  (function frame(){
    const rect = el && el.isConnected ? el.getBoundingClientRect() : null;
    const sticky = rect && rect.width <= STICK_MAX_W && rect.height <= STICK_MAX_H
                        && rect.width > 0 && rect.height > 0;

    if (sticky) {
      /* המכניקה מהמקור: מרכז האלמנט + 10% מהמרחק אל העכבר */
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = mx - cx, dy = my - cy;
      const absD = Math.max(Math.abs(dx), Math.abs(dy));
      tx  = cx + dx * .1;
      ty  = cy + dy * .1;
      /* לפי הצלע הקצרה: על כפתור רחב עיגול לפי הרוחב היה בולע גם את
         מה שלידו. המתיחה לכיוון העכבר ממילא מכסה את הרוחב. */
      tr  = clamp(Math.min(rect.width, rect.height) / 2 + 12, 15, 40);
      tsx = 1 + .30 * clamp(absD / (rect.height / 2), 0, 1);
      tsy = 1 - .20 * clamp(absD / (rect.width  / 2), 0, 1);
      tang = Math.atan2(dy, dx);
    } else {
      tx = mx; ty = my;
      tr = rect ? R_HOVER : R;
      tsx = 1; tsy = 1;
      /* לא מאפסים זווית — סיבוב חזרה ל-0 נראה כמו תקלה */
    }

    x = lerp(x, tx, .25); y = lerp(y, ty, .25); r = lerp(r, tr, .18);
    sx = lerp(sx, tsx, .22); sy = lerp(sy, tsy, .22);
    /* אינטרפולציה זוויתית בדרך הקצרה, אחרת הסמן מסתחרר */
    let d = ((tang - ang + Math.PI) % (Math.PI*2) + Math.PI*2) % (Math.PI*2) - Math.PI;
    ang += d * .3;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.scale(sx, sy);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
    requestAnimationFrame(frame);
  })();
})();

/* ── מגנטיות (Physics Effects/1, קומפוננטת <Magnetic>) ──
   אלמנטים קטנים ולחיצים נמשכים 28% לכיוון העכבר וחוזרים בקפיץ.
   רק פריטי ממשק קטנים — לא כרטיסים ולא כפתורי ענק שכבר מרימים את עצמם. */
(function magneticElements(){
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (new URLSearchParams(location.search).has('static')) return;

  const SEL = '.nav-cta,.nav-links a,.nav-user,.logo,.fbtn,.chip,.preset,.btn-buy,.btn-add2,.btn-pay,.cardops button,.logout';
  const PULL = .28;
  let cur = null, tx = 0, ty = 0, cx = 0, cy = 0, running = false;

  const step = () => {
    cx += (tx - cx) * .18;
    cy += (ty - cy) * .18;
    if (cur) cur.style.transform = `translate3d(${cx.toFixed(2)}px,${cy.toFixed(2)}px,0)`;
    if (Math.abs(cx - tx) < .05 && Math.abs(cy - ty) < .05 && tx === 0 && ty === 0) {
      running = false;
      if (cur) { cur.style.transform = ''; cur.classList.remove('mag-on'); cur = null; }
      return;
    }
    requestAnimationFrame(step);
  };
  const kick = () => { if (!running) { running = true; requestAnimationFrame(step); } };

  addEventListener('mousemove', e => {
    const t = e.target && e.target.closest ? e.target.closest(SEL) : null;
    if (t !== cur) {
      if (cur) { tx = ty = 0; kick(); }              /* המקודם חוזר למקומו */
      if (t) { cur = t; cx = cy = tx = ty = 0; t.classList.add('mag-on'); }
    }
    if (!t) { tx = ty = 0; kick(); return; }
    const rc = t.getBoundingClientRect();
    tx = (e.clientX - (rc.left + rc.width  / 2)) * PULL;
    ty = (e.clientY - (rc.top  + rc.height / 2)) * PULL;
    kick();
  }, { passive:true });

  addEventListener('pt:navigated', () => {
    if (cur) { cur.style.transform = ''; cur.classList.remove('mag-on'); }
    cur = null; running = false; tx = ty = cx = cy = 0;
  });
})();

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

  /* בזמן משיכה מגנטית ה-transform מונע ביד (rAF) — מוציאים אותו מרשימת
     המעברים כדי שלא ייגרר אחרי הסמן באיחור. */
  .mag-on{ transition:border-radius .7s cubic-bezier(.3,1.2,.55,1),
                      background-color .25s, color .25s, border-color .25s !important;
           will-change:transform }

  /* ── תשתית מעברוני העמודים ── */
  [data-t="wrapper"]{position:relative}
  [data-t="container"]{background:var(--bg,#fff)}
  `;
  const s = document.createElement('style');
  s.dataset.shared = '1';
  s.textContent = css;
  document.head.appendChild(s);
})();

/* הזרקת @font-face לכל הקטלוג */
(function injectFonts(){
  const css = FONTS.map(f =>
    `@font-face{font-family:'${f.slug}';src:url('fonts/${f.slug}.woff2') format('woff2');font-display:swap;}`
  ).join('\n');
  const s = document.createElement('style');
  s.dataset.shared = '1';
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
  /* בדף הבית הלוגו מגלגל לראש הדף (בלי לטעון מחדש ובלי להריץ שוב את
     הפרילואודר); בשאר הדפים הוא הדרך חזרה הביתה. */
  const isHome = /(^\/?$|index\.html$)/.test(location.pathname);
  el.innerHTML = `
  <nav class="nav">
    <a href="${isHome ? '#top' : 'index.html'}" class="logo" aria-label="${isHome ? 'חזרה לראש הדף' : 'פונטיאדה — לדף הבית'}"><img src="logo-black.svg" alt="פונטיאדה"></a>
    <div class="nav-links">
      <a href="catalog.html" ${active==='catalog' ? 'style="font-weight:900"' : ''}>הקטלוג</a>
      <a href="index.html#free">חינמיים</a>
      <a href="index.html#pricing">מחירים</a>
      <a href="about.html" ${active==='about' ? 'style="font-weight:900"' : ''}>הסיפור</a>
      <a href="license.html" ${active==='license' ? 'style="font-weight:900"' : ''}>הרישיון</a>
    </div>
    <div style="display:flex;gap:10px;align-items:center">
      <a href="login.html" class="nav-user">${u ? '👤 ' + u.name : 'התחברות'}</a>
      <button class="nav-cta" onclick="go('cart.html')">🛒 עגלה (<span data-cart-count>0</span>)</button>
    </div>
  </nav>`;
  Cart.updateBadge();

  if (isHome) {
    el.querySelector('.logo').addEventListener('click', e => {
      e.preventDefault();
      /* Lenis שולט בגלילה כשהוא פעיל — צריך לבקש ממנו, אחרת הוא מחזיר אותנו */
      if (window.lenis) window.lenis.scrollTo(0, { duration: 1 });
      else scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
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

/* ═══════════════════════════════════════════════════════════
   מעברוני עמודים — פורט של Page Transitions/1 (Awwwards Pack)
   המכניקה מהמקור: העמוד היוצא מתכווץ (scale .8), עולה 30vh ודוהה ל-0.4,
   ובאותו זמן העמוד הנכנס נחשף מלמטה למעלה עם clip-path: inset(100%→0%)
   ושניהם על אותו ease מותאם. אצלנו האתר הוא קבצי HTML נפרדים ולא SPA,
   ולכן הראוטר הזה מביא את העמוד הבא ב-fetch, מרכיב אותו בזיכרון, מריץ
   את הסקריפט שלו ורק אז מנפיש — כך שמה שעולה מלמטה הוא כבר העמוד המלא.
   בטיחות: כל כשל (fetch, סקריפט, אין GSAP) נופל לניווט רגיל.
   ═══════════════════════════════════════════════════════════ */

/* Lenis + טיקרים נרשמים דרך העוזרים האלה כדי שאפשר יהיה לפרק אותם
   במעבר עמוד — אחרת כל עמוד משאיר אחריו לולאת rAF שרצה על DOM מת. */
let __ticks = [];
function addTick(fn){ if (window.gsap) { gsap.ticker.add(fn); __ticks.push(fn); } return fn; }
function smoothScroll(){
  if (!window.Lenis || !window.gsap) return null;
  const l = window.lenis = new Lenis({ lerp:.09 });
  if (window.ScrollTrigger) l.on('scroll', ScrollTrigger.update);
  addTick(t => l.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return l;
}

const PageTransition = (function(){
  const OFF = new URLSearchParams(location.search).has('static')
           || matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* עוטפים את תוכן העמוד הנוכחי. רץ לפני הסקריפט של העמוד, ולכן כל
     getElementById שלו עדיין מוצא הכל — רק ההורה השתנה. */
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-t', 'wrapper');
  let current = document.createElement('div');
  current.setAttribute('data-t', 'container');
  wrapper.appendChild(current);
  const kids = Array.from(document.body.childNodes);
  document.body.insertBefore(wrapper, document.body.firstChild);
  kids.forEach(n => { if (!(n.nodeType === 1 && n.tagName === 'SCRIPT')) current.appendChild(n); });

  /* ה-ease המדויק מהמקור. CustomEase הוא תוסף חינמי של GSAP; אם משום מה
     לא נטען — נופלים ל-power3.inOut שקרוב מספיק ולא שובר כלום. */
  let EASE = 'power3.inOut';
  if (window.CustomEase) {
    gsap.registerPlugin(CustomEase);
    EASE = CustomEase.create('pageTransition', 'M0,0 C0.38,0.05 0.48,0.58 0.65,0.82 0.82,1 1,1 1,1');
  }
  let busy = false;

  function teardown(){
    try { window.lenis && window.lenis.destroy(); } catch(e){}
    window.lenis = null;
    __ticks.forEach(fn => { try { gsap.ticker.remove(fn); } catch(e){} });
    __ticks = [];
    if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.globalTimeline.getChildren(true, true, false).forEach(t => t.kill());
  }

  function runScripts(doc){
    doc.querySelectorAll('body script').forEach(sc => {
      if (sc.src) return;                       /* ספריות ה-CDN כבר טעונות */
      /* new Function = scope משלו, אחרת const/let של העמוד הקודם מתנגשים */
      try { (new Function(sc.textContent))(); }
      catch(e){ console.error('[pt] page script failed', e); }
    });
  }

  async function go(url, push = true){
    const target = new URL(url, location.href);
    if (busy) return;
    if (OFF || !window.gsap) { location.href = target.href; return; }
    busy = true;
    let oldStyles = [];
    try {
      const res = await fetch(target.href, { credentials:'same-origin' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');

      /* 1. מרכיבים את הקונטיינר הנכנס, מוסתר מתחת לקו התחתון */
      const next = document.createElement('div');
      next.setAttribute('data-t', 'container');
      Array.from(doc.body.childNodes).forEach(n => {
        if (n.nodeType === 1 && n.tagName === 'SCRIPT') return;
        next.appendChild(document.importNode(n, true));
      });
      wrapper.appendChild(next);
      gsap.set(next, {
        clipPath:'inset(100% 0% 0% 0%)', opacity:1, position:'fixed',
        top:0, left:0, width:'100%', height:'100vh', overflow:'hidden', zIndex:10,
      });

      /* 2. מפרקים את זמן-הריצה של העמוד היוצא לפני שמריצים את הבא */
      teardown();
      window.__spaNav = true;
      document.title = doc.title;
      document.documentElement.classList.remove('static');

      /* ה-CSS של העמוד החדש נכנס לפני הסגנונות המשותפים (שגוברים עליו),
         והישן מוסר רק בסוף — כדי שהעמוד היוצא לא יישאר בלי עיצוב */
      oldStyles = Array.from(document.head.querySelectorAll('style:not([data-shared])'));
      const anchor = document.head.querySelector('style[data-shared]');
      doc.head.querySelectorAll('style').forEach(st =>
        document.head.insertBefore(st.cloneNode(true), anchor));

      /* 3. מריצים את הסקריפט של העמוד החדש כשהישן מנותק מה-DOM, אחרת
         getElementById שלו תופס את האלמנטים של העמוד היוצא */
      const slot = document.createComment('pt');
      wrapper.replaceChild(slot, current);
      if (push) history.pushState({ pt:1 }, '', target.href);
      runScripts(doc);
      wrapper.replaceChild(current, slot);
      dispatchEvent(new Event('pt:navigated'));

      /* 4. האנימציה עצמה — בדיוק כמו defaultTransition במקור.
         חובה: העמוד הנכנס מוסתר כרגע ב-clip-path, ולכן אסור שהאנימציה
         תהיה מה שמגלה אותו. ה-rAF של GSAP קופא בלשונית מוסתרת — אם המשתמש
         עובר לשונית באמצע המעבר, הטיימר למטה מסיים את המעבר בכוח. */
      const leaving = current;
      const oldS = oldStyles;
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(bail);
        gsap.killTweensOf([leaving, next]);
        leaving.remove();
        oldS.forEach(st => st.remove());
        gsap.set(next, { clearProps:'clipPath,position,top,left,width,height,zIndex,opacity,overflow,transform' });
        window.scrollTo(0, 0);
        if (window.lenis) { window.lenis.resize(); window.lenis.scrollTo(0, { immediate:true }); }
        if (target.hash) {
          const el = document.querySelector(target.hash);
          if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior:'smooth' }));
        }
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      };
      const bail = setTimeout(finish, 2000);
      current = next;

      /* המקור מתכווץ סביב מרכז האלמנט — שם כל עמוד הוא בגובה מסך אחד.
         העמודים שלנו ארוכים, ומרכז אלמנט בגובה 6000px נמצא הרחק מחוץ
         למסך; scale סביבו היה מעיף את התצוגה. לכן מקבעים את נקודת
         הכיווץ למרכז ה-viewport שהגולש רואה ברגע הלחיצה. */
      gsap.set(leaving, { transformOrigin:`50% ${window.scrollY + innerHeight / 2}px` });

      gsap.timeline({ defaults:{ duration:.7, ease:EASE, force3D:true }, onComplete:finish })
        .to(leaving, { y:'-30vh', opacity:.4, scale:.8 }, 0)
        .to(next,    { clipPath:'inset(0% 0% 0% 0%)' }, 0);
    } catch(e) {
      console.error('[pt] falling back to a normal load', e);
      location.href = target.href;
      return;
    } finally {
      busy = false;
    }
  }

  /* לכידת קליקים על קישורים פנימיים */
  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || /^(mailto|tel|https?):/i.test(href) && new URL(a.href).origin !== location.origin) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return;
    if (!/\.html$/.test(u.pathname) && !/\/$/.test(u.pathname)) return;
    if (u.pathname === location.pathname && u.search === location.search) return; /* עוגן באותו עמוד */
    e.preventDefault();
    go(u.href);
  });

  addEventListener('popstate', () => {
    if (OFF) { location.reload(); return; }
    go(location.href, false);
  });

  return { go };
})();

/* קיצור גלובלי לשימוש ב-onclick בתוך הדפים */
function go(url){ PageTransition.go(url); }
