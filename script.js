/* ============================================================
   CARLOS SANTOS IMÓVEIS — script.js v3
   ============================================================ */

/* 1. LENIS — smooth scroll cinematográfico */
let lenis;
function initLenis() {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}

/* 2. NAVBAR SCROLL */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* 3. SCROLL REVEAL */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children].filter(c =>
              c.classList.contains('reveal') || c.classList.contains('reveal-left') || c.classList.contains('reveal-right'))
          : [];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => observer.observe(el));
}

/* 4. BUILDING PARALLAX */
function initBuildingParallax() {
  const section = document.querySelector('.building-section');
  const img = document.querySelector('.building-img');
  const mask = document.querySelector('.building-reveal-mask');
  if (!section || !img) return;

  window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    const winH = window.innerHeight;
    if (rect.bottom > 0 && rect.top < winH) {
      const progress = (winH - rect.top) / (winH + rect.height);
      img.style.transform = `translateY(${(progress - 0.5) * 120}px)`;
      if (mask) {
        const rev = Math.min(1, Math.max(0, (winH - rect.top) / winH));
        mask.style.transform = `scaleY(${1 - rev})`;
      }
    }
  }, { passive: true });
}

/* 5. CARDS HOVER LIFT (sem tilt 3D — mais limpo no mobile) */
function initCardHover() {
  document.querySelectorAll('.emp-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* 6. PRÉ-PREENCHER CONSTRUTORA NO FORM */
function preencherConstrutora(nome) {
  setTimeout(() => {
    const sel = document.getElementById('f-const');
    if (sel) sel.value = nome;
    const form = document.getElementById('interesse');
    if (form && lenis) lenis.scrollTo(form, { offset: -80, duration: 1.6 });
    else if (form) form.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}
window.preencherConstrutora = preencherConstrutora;

/* 7. MÁSCARA TELEFONE */
function initPhoneMask() {
  const input = document.getElementById('f-tel');
  if (!input) return;
  input.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 7)       v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2)  v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0)  v = `(${v}`;
    this.value = v;
  });
}

/* 8. ENVIAR LEAD → WHATSAPP */
function enviarLead() {
  const nome   = document.getElementById('f-nome')?.value.trim();
  const tel    = document.getElementById('f-tel')?.value.trim();
  const constr = document.getElementById('f-const')?.value || 'Não informado';
  const tipo   = document.getElementById('f-tipo')?.value || 'Indiferente';
  const msg    = document.getElementById('f-msg')?.value.trim();
  const aceite = document.getElementById('f-aceite')?.checked;

  if (!nome) { showFormError('Por favor, informe seu nome.'); return; }
  if (!tel || tel.replace(/\D/g, '').length < 10) { showFormError('Por favor, informe um WhatsApp válido.'); return; }
  if (!aceite) { showFormError('É necessário aceitar o contato para continuar.'); return; }

  /* ── EDIT: número do WhatsApp ── */
  const numeroWA = '5511940820563';

  const mensagem =
    `🏠 *Novo Lead — Portal Carlos Santos*\n\n` +
    `👤 *Nome:* ${nome}\n` +
    `📱 *WhatsApp:* ${tel}\n` +
    `🏗️ *Construtora:* ${constr}\n` +
    `🏡 *Tipo:* ${tipo}` +
    (msg ? `\n💬 *Obs:* ${msg}` : '') +
    `\n\n_Enviado pelo portal Carlos Santos Imóveis_`;

  window.open(`https://wa.me/${numeroWA}?text=${encodeURIComponent(mensagem)}`, '_blank');

  document.getElementById('form-content').style.display = 'none';
  document.getElementById('form-success').classList.add('show');
}
window.enviarLead = enviarLead;

function showFormError(msg) {
  document.querySelectorAll('.form-error-msg').forEach(e => e.remove());
  const el = document.createElement('p');
  el.className = 'form-error-msg';
  el.style.cssText = 'font-size:.64rem;color:#c53030;margin-bottom:12px;padding:10px 14px;background:rgba(197,48,48,.07);border-left:3px solid #c53030;border-radius:0 3px 3px 0;font-weight:500;';
  el.textContent = msg;
  const btn = document.querySelector('.btn-submit');
  if (btn) btn.parentElement.insertBefore(el, btn);
  setTimeout(() => el.remove(), 4000);
}

/* 9. CONTADORES ANIMADOS */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const start = performance.now();
        const duration = 1800;
        function update(now) {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(ease * target) + suffix;
          if (p < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initNavbar();
  initReveal();
  initBuildingParallax();
  initCardHover();
  initPhoneMask();
  initCounters();
});
