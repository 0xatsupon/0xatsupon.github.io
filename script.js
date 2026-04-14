/* =============================================================================
   0xatsupon — Portfolio Interactions
   - Scroll-triggered reveal animations (IntersectionObserver)
   - Smooth navigation
   - Mobile menu
   - Parallax orbs
   ============================================================================= */

(function () {
  'use strict';

  /* --- Scroll Reveal --- */
  const REVEAL_THRESHOLD = 0.15;
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: REVEAL_THRESHOLD, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  /* --- Mobile Menu --- */
  const menuBtn = document.querySelector('.nav__menu');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isOpen);
      mobileMenu.setAttribute('aria-hidden', isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Smooth Scroll for Nav Links --- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
      );
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* --- Nav Background on Scroll --- */
  const nav = document.querySelector('.nav');
  const NAV_SCROLL_THRESHOLD = 50;

  function updateNav() {
    if (window.scrollY > NAV_SCROLL_THRESHOLD) {
      nav.style.background = 'rgba(10, 10, 11, 0.85)';
    } else {
      nav.style.background = 'rgba(10, 10, 11, 0.6)';
    }
  }

  /* --- Parallax Orbs --- */
  const orbs = document.querySelectorAll('.orb');
  const PARALLAX_FACTOR = 0.03;

  function updateOrbs() {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = PARALLAX_FACTOR * (i + 1);
      orb.style.setProperty('--parallax-y', `${scrollY * speed}px`);
    });
  }

  /* --- RAF-based Scroll Handler --- */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNav();
        updateOrbs();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Initial State --- */
  updateNav();
})();
