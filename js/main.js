/* OnlyFit — main.js */

// ─── Lenis smooth scroll ───────────────────────────────────────
(function initLenis() {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/lenis@1.1.14/dist/lenis.min.js';
  script.onload = function () {
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    window._lenis = lenis;
  };
  document.head.appendChild(script);
})();

// ─── Menu: show on load ────────────────────────────────────────
const menu = document.getElementById('menu');
if (menu) {
  requestAnimationFrame(() => {
    setTimeout(() => menu.classList.add('visible'), 100);
  });
}

// ─── Menu: theme switching based on visible section ────────────
function updateMenuTheme() {
  if (!menu) return;
  const sections = document.querySelectorAll('[data-theme]');
  const menuMidY = 60;
  let current = 'dark';

  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= menuMidY && rect.bottom > menuMidY) {
      current = sec.dataset.theme || 'light';
    }
  });

  // Hero special: always dark when hero is visible
  const hero = document.querySelector('.hero');
  if (hero) {
    const rect = hero.getBoundingClientRect();
    if (rect.top <= 0 && rect.bottom > 0) current = 'dark';
  }

  menu.classList.toggle('dark', current === 'dark');
  menu.classList.toggle('light', current !== 'dark');

  // Mobile overlay bg
  const overlay = document.getElementById('mobileOverlay');
  if (overlay) {
    overlay.style.background = current === 'dark' ? 'var(--c-bg-dark)' : 'var(--c-bg)';
    overlay.style.color = current === 'dark' ? 'var(--c-white)' : 'var(--c-text)';
  }
}

window.addEventListener('scroll', updateMenuTheme, { passive: true });
window.addEventListener('load', updateMenuTheme);

// ─── Burger / mobile overlay ───────────────────────────────────
const burger = document.getElementById('burger');
const mobileOverlay = document.getElementById('mobileOverlay');

if (burger && mobileOverlay) {
  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    mobileOverlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileOverlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on overlay click
  mobileOverlay.addEventListener('click', e => {
    if (e.target === mobileOverlay) {
      menu.classList.remove('open');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ─── Active nav link ───────────────────────────────────────────
(function setActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list-item-link, .mobile-overlay-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop().split('#')[0];
    if (href && href === path) a.style.opacity = '1';
  });
})();

// ─── Intersection Observer animations ─────────────────────────
const animObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

const observeClasses = ['observe-fade', 'observe-scale', 'stagger-children'];

function attachObservers() {
  observeClasses.forEach(cls => {
    document.querySelectorAll(`.${cls}:not([data-obs])`).forEach(el => {
      el.dataset.obs = '1';
      animObs.observe(el);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Auto-tag grids
  document.querySelectorAll('.trainers-grid, .products-grid, .testimonials-grid, .blog-grid, .trust-grid, .goals-grid, .stats-band, .quiz-grid-mini, .materials-grid').forEach(g => {
    if (!g.classList.contains('stagger-children')) g.classList.add('stagger-children');
  });
  attachObservers();
});

// ─── Page transitions (blur on navigate) ──────────────────────
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || link.target === '_blank') return;
  link.addEventListener('click', e => {
    e.preventDefault();
    document.body.style.transition = 'opacity 0.4s, filter 0.35s';
    document.body.style.opacity = '0';
    document.body.style.filter = 'blur(6px)';
    setTimeout(() => { window.location.href = href; }, 380);
  });
});

// Fade in on page load
window.addEventListener('pageshow', () => {
  document.body.style.transition = 'opacity 0.5s, filter 0.4s';
  document.body.style.opacity = '1';
  document.body.style.filter = 'blur(0)';
});

// ─── FAQ Accordion ────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question')?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ─── Filter Chips ─────────────────────────────────────────────
document.querySelectorAll('.chip[data-filter]').forEach(chip => {
  chip.addEventListener('click', () => {
    const group = chip.closest('[data-filter-group]');
    if (group) group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    filterProducts(chip.dataset.filter);
  });
});

function filterProducts(filter) {
  document.querySelectorAll('[data-category]').forEach(card => {
    card.style.display = (!filter || filter === 'all' || card.dataset.category === filter) ? '' : 'none';
  });
}

// ─── Download tracking ────────────────────────────────────────
function trackDownload(filename) {
  const downloads = JSON.parse(localStorage.getItem('of_downloads') || '{}');
  downloads[filename] = (downloads[filename] || 0) + 1;
  localStorage.setItem('of_downloads', JSON.stringify(downloads));
}
