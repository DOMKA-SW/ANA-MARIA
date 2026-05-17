/* ============================================================
   DOMKA SOLUTIONS — script.js
   Partículas, scroll reveal, lightbox, carrusel, carta
   ============================================================ */

'use strict';

/* ── 1. Partículas suaves ─────────────────────────────────── */
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: rand(1, 3.5),
      vx: rand(-0.25, 0.25),
      vy: rand(-0.4, -0.1),
      alpha: rand(0.2, 0.7),
      color: Math.random() > 0.5 ? '27,122,81' : '201,169,110'
    };
  }

  for (let i = 0; i < 70; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.0015;
      if (p.alpha <= 0 || p.y < -10) particles[i] = createParticle();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── 2. Scroll reveal ─────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

/* ── 3. Fecha actual ──────────────────────────────────────── */
function setCurrentDate(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const now = new Date();
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  el.textContent = now.toLocaleDateString('es-ES', opts);
}

/* ── 4. Contador desde fecha ──────────────────────────────── */
function initCountdown(targetDateStr, elYears, elDays, elHours) {
  function update() {
    const now   = new Date();
    const birth = new Date(targetDateStr);
    const diffMs = now - birth;
    const totalDays  = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years      = Math.floor(totalDays / 365);
    const remDays    = totalDays % 365;
    const hours      = now.getHours();
    if (elYears) document.querySelector(elYears).textContent = years;
    if (elDays)  document.querySelector(elDays).textContent  = remDays;
    if (elHours) document.querySelector(elHours).textContent = hours;
  }
  update();
  setInterval(update, 60000);
}

/* ── 5. Lightbox simple ───────────────────────────────────── */
function initLightbox() {
  const imgs = document.querySelectorAll('[data-lightbox]');
  if (!imgs.length) return;

  const overlay = document.createElement('div');
  overlay.id = 'lb-overlay';
  overlay.innerHTML = `
    <div id="lb-inner">
      <img id="lb-img" src="" alt="foto">
      <button id="lb-close">✕</button>
    </div>`;
  overlay.style.cssText = `
    display:none; position:fixed; inset:0; background:rgba(0,0,0,0.92);
    z-index:9999; align-items:center; justify-content:center;`;
  document.body.appendChild(overlay);

  const lbImg   = overlay.querySelector('#lb-img');
  const lbInner = overlay.querySelector('#lb-inner');
  lbInner.style.cssText = 'position:relative; max-width:90vw;';
  lbImg.style.cssText   = 'border-radius:16px; max-height:90vh; object-fit:contain;';
  const closeBtn = overlay.querySelector('#lb-close');
  closeBtn.style.cssText = `
    position:absolute; top:-16px; right:-16px;
    background:#1b7a51; color:#fff; border:none; border-radius:50%;
    width:40px; height:40px; font-size:18px; cursor:pointer;`;

  imgs.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      overlay.style.display = 'flex';
    });
  });
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target === closeBtn) overlay.style.display = 'none';
  });
}

/* ── 6. Carrusel ─────────────────────────────────────────── */
function initCarousel(trackSel, prevSel, nextSel) {
  const track = document.querySelector(trackSel);
  const prev  = document.querySelector(prevSel);
  const next  = document.querySelector(nextSel);
  if (!track || !prev || !next) return;

  let idx = 0;
  const slides = track.children;

  function goTo(n) {
    idx = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
  }
  prev.addEventListener('click', () => goTo(idx - 1));
  next.addEventListener('click', () => goTo(idx + 1));
  setInterval(() => goTo(idx + 1), 5000);
}

/* ── 7. Sobre / carta animada ─────────────────────────────── */
function initEnvelope() {
  const btn = document.getElementById('open-envelope');
  const letter = document.getElementById('letter-content');
  if (!btn || !letter) return;
  btn.addEventListener('click', () => {
    letter.classList.toggle('open');
    btn.textContent = letter.classList.contains('open') ? '✉️ Cerrar carta' : '✉️ Abrir carta';
  });
}

/* ── Init all ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initParticles('particle-canvas');
  initReveal();
  setCurrentDate('.js-date');
  initLightbox();
  initEnvelope();
  initCarousel('.carousel-track', '.carousel-prev', '.carousel-next');
});
