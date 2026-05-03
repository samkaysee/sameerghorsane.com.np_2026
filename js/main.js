/* ═══════════════════════════════════════════════════════
   SAMEER GHORSANE — main.js
═══════════════════════════════════════════════════════ */

'use strict';

/* ─── NAV: SCROLL STYLE ─────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── NAV: ACTIVE LINK ON SCROLL ───────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav__link');

function setActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

/* ─── NAV: MOBILE DRAWER ────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const navDrawer  = document.getElementById('navDrawer');
const drawerClose = document.getElementById('drawerClose');
const navOverlay = document.getElementById('navOverlay');

function openDrawer() {
  navDrawer.classList.add('open');
  navOverlay.classList.add('show');
  hamburger.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  navDrawer.classList.remove('open');
  navOverlay.classList.remove('show');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
navOverlay?.addEventListener('click', closeDrawer);

// Close drawer on nav link click
document.querySelectorAll('.nav__drawer-links a').forEach(a =>
  a.addEventListener('click', closeDrawer)
);

/* ─── HERO: TYPEWRITER ──────────────────────────────── */
const tw = document.getElementById('typewriterText');
const twText = 'FP&A | Chartered Accountant (ICAI)';
let twI = 0, twDeleting = false;

function typeWriter() {
  if (!tw) return;
  if (!twDeleting) {
    tw.textContent = twText.slice(0, twI++);
    if (twI > twText.length) {
      twDeleting = true;
      setTimeout(typeWriter, 2000); // pause before deleting
      return;
    }
  } else {
    tw.textContent = twText.slice(0, twI--);
    if (twI < 0) {
      twDeleting = false;
      twI = 0;
      setTimeout(typeWriter, 500); // pause before retyping
      return;
    }
  }
  setTimeout(typeWriter, twDeleting ? 35 : 75);
}
typeWriter();

/* ─── SCROLL ANIMATIONS ─────────────────────────────── */
const animatedEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || '0', 10);
    setTimeout(() => el.classList.add('in-view'), delay);
    observer.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

animatedEls.forEach(el => observer.observe(el));

/* ─── COUNTER ANIMATION ─────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10);
  const prefix   = el.dataset.prefix  || '';
  const suffix   = el.dataset.suffix  || '';
  const duration = 1600;
  const step     = 16;
  const steps    = Math.ceil(duration / step);
  let  current   = 0;

  const timer = setInterval(() => {
    current++;
    const val = Math.round((current / steps) * target);
    el.textContent = prefix + val + suffix;
    if (current >= steps) {
      el.textContent = prefix + target + suffix;
      clearInterval(timer);
    }
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

const achievementsSec = document.querySelector('.achievements');
if (achievementsSec) counterObserver.observe(achievementsSec);

/* ─── BACK TO TOP ───────────────────────────────────── */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── APPS WIDGET — SMART TOP-RIGHT ────────────────── */
const appsWidget    = document.getElementById('appsWidget');
const appsWidgetBtn = document.getElementById('appsWidgetBtn');
const appsPanel     = document.getElementById('appsPanel');
const heroSection   = document.getElementById('hero');
const aboutSection  = document.getElementById('about');

function isWidgetSticky() {
  return appsWidget?.classList.contains('is-fixed');
}

function updateWidgetPosition() {
  if (!heroSection || !appsWidget) return;
  const heroBoundary = heroSection.offsetTop + heroSection.offsetHeight;
  if (window.scrollY >= heroBoundary - 40) {
    appsWidget.classList.add('is-fixed');
  } else {
    appsWidget.classList.remove('is-fixed');
    // Force-close panel if user scrolls back into hero
    appsPanel?.classList.remove('open');
    appsWidgetBtn?.setAttribute('aria-expanded', 'false');
  }
}

// Run on scroll and on load
window.addEventListener('scroll', updateWidgetPosition, { passive: true });
updateWidgetPosition();

if (appsWidgetBtn && appsPanel) {
  appsWidgetBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    // In hero mode: scroll to About instead of opening panel (keeps portrait unblocked)
    if (!isWidgetSticky()) {
      aboutSection?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Sticky mode: normal toggle
    const isOpen = appsPanel.classList.toggle('open');
    appsWidgetBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!appsPanel.contains(e.target) && e.target !== appsWidgetBtn) {
      appsPanel.classList.remove('open');
      appsWidgetBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      appsPanel.classList.remove('open');
      appsWidgetBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ─── FOOTER YEAR ───────────────────────────────────── */
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ─── CV UPLOAD FEEDBACK ────────────────────────────── */
const cvUpload = document.getElementById('cvUpload');
const cvNote   = document.getElementById('cvUploadNote');

cvUpload?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && cvNote) {
    cvNote.textContent = `Selected: ${file.name} — replace the file at assets/cv/sameer-ghorsane-cv.pdf`;
  }
});

/* ─── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    closeDrawer();
  });
});
