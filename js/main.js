/* OnlyFit — Main JS */

// ─── Download tracking ──────────────────────────────────
function trackDownload(filename) {
  const downloads = JSON.parse(localStorage.getItem('of_downloads') || '{}');
  downloads[filename] = (downloads[filename] || 0) + 1;
  localStorage.setItem('of_downloads', JSON.stringify(downloads));
}

// ─── Navigation ──────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav-overlay');
const mobileClose = document.querySelector('.mobile-nav-close');

if (hamburger) {
  hamburger.addEventListener('click', () => mobileNav?.classList.add('open'));
}
if (mobileClose) {
  mobileClose.addEventListener('click', () => mobileNav?.classList.remove('open'));
}
document.querySelectorAll('.mobile-nav-links a').forEach(a => {
  a.addEventListener('click', () => mobileNav?.classList.remove('open'));
});

// Set active nav link
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href')?.split('/').pop();
  if (href === currentPath) a.classList.add('active');
});

// ─── FAQ Accordion ────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question')?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ─── Filter Chips ─────────────────────────────────────────
document.querySelectorAll('.chip[data-filter]').forEach(chip => {
  chip.addEventListener('click', () => {
    const group = chip.closest('[data-filter-group]');
    if (group) {
      group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    }
    chip.classList.add('active');
    const filter = chip.dataset.filter;
    filterProducts(filter);
  });
});

function filterProducts(filter) {
  const cards = document.querySelectorAll('[data-category]');
  cards.forEach(card => {
    if (!filter || filter === 'all') {
      card.style.display = '';
    } else {
      card.style.display = card.dataset.category === filter ? '' : 'none';
    }
  });
}

// ─── Scroll Animations (Intersection Observer) ────────────
const observeClasses = [
  'observe-fade',
  'observe-scale',
  'observe-left',
  'observe-right',
  'stagger-children'
];

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

observeClasses.forEach(cls => {
  document.querySelectorAll('.' + cls).forEach(el => animObserver.observe(el));
});

// Also add animation classes to key elements automatically
document.addEventListener('DOMContentLoaded', () => {
  // Auto-animate grids
  document.querySelectorAll('.goals-grid').forEach(g => g.classList.add('stagger-children'));
  document.querySelectorAll('.trainers-grid').forEach(g => g.classList.add('stagger-children'));
  document.querySelectorAll('.products-grid').forEach(g => g.classList.add('stagger-children'));
  document.querySelectorAll('.testimonials-grid').forEach(g => g.classList.add('stagger-children'));
  document.querySelectorAll('.services-grid').forEach(g => g.classList.add('stagger-children'));

  // Auto-animate sections
  document.querySelectorAll('.trust-item').forEach(el => el.classList.add('observe-fade'));
  document.querySelectorAll('.stat-item').forEach(el => el.classList.add('observe-scale'));
  document.querySelectorAll('.campaign-headline').forEach(el => el.classList.add('observe-left'));
  document.querySelectorAll('.campaign-sub').forEach(el => el.classList.add('observe-fade'));

  // Re-run observer for newly tagged elements
  observeClasses.forEach(cls => {
    document.querySelectorAll('.' + cls).forEach(el => {
      if (!el.dataset.observed) {
        el.dataset.observed = '1';
        animObserver.observe(el);
      }
    });
  });
});
