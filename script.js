/* Likith G S — portfolio interactions. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  // ---- Config ---------------------------------------------------------
  var LOADER_MS = 1000;   // loader length (original ran ~4.5s); set to 0 to disable it
  var TYPE_MS = 100;      // per-character typing speed for the hero role
  var ERASE_MS = 45;      // per-character erase speed between roles
  var ROLE_HOLD_MS = 1800; // how long each finished role stays on screen
  var THEME_KEY = 'theme';
  var LOADER_SEEN_KEY = 'loaderSeen';   // loader plays once per browser session

  window.__portfolioBooted = true;      // tells the inline safety net in <head> we're alive

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Loader ---------------------------------------------------------
  function runLoader(done) {
    var loader = document.getElementById('loader');
    var seen = false;
    try { seen = sessionStorage.getItem(LOADER_SEEN_KEY) === '1'; } catch (e) {}
    // no .js class means the safety net already gave up on animations
    if (!loader || LOADER_MS <= 0 || reduceMotion || seen || !root.classList.contains('js')) {
      if (loader) loader.classList.add('done');
      return done();
    }
    try { sessionStorage.setItem(LOADER_SEEN_KEY, '1'); } catch (e) {}
    body.classList.add('is-loading');

    var bar = document.getElementById('loaderBar');
    var start = performance.now();

    function tick(now) {
      var t = Math.min((now - start) / LOADER_MS, 1);
      bar.style.width = (100 * (1 - Math.pow(1 - t, 3))) + '%';   // ease-out fill
      if (t < 1) return requestAnimationFrame(tick);
      setTimeout(function () {
        loader.classList.add('done');
        body.classList.remove('is-loading');
        setTimeout(function () { loader.remove(); }, 700);
        done();
      }, 150);
    }
    requestAnimationFrame(tick);
  }

  // ---- Hero entrance + typing ----------------------------------------
  function playHero() {
    var hero = document.querySelector('.hero');
    if (hero) hero.classList.add('play');

    var el = document.getElementById('typed');
    if (!el) return;
    // the first role ships in the HTML (for crawlers / no-JS); clear it, then type
    // each role in data-roles, erase it, and move on to the next, forever
    var roles = (el.getAttribute('data-roles') || el.textContent).split('|');
    if (reduceMotion || !root.classList.contains('js')) return;
    el.textContent = '';
    var r = 0, i = 0, erasing = false;
    function step() {
      var text = roles[r];
      if (!erasing) {
        el.textContent = text.slice(0, ++i);
        if (i < text.length) return setTimeout(step, TYPE_MS);
        if (roles.length < 2) return;   // a single role types once and stays
        erasing = true;
        return setTimeout(step, ROLE_HOLD_MS);
      }
      el.textContent = text.slice(0, --i);
      if (i > 0) return setTimeout(step, ERASE_MS);
      erasing = false;
      r = (r + 1) % roles.length;
      setTimeout(step, 350);
    }
    setTimeout(step, 600);
  }

  // ---- Card hover glow (follows the pointer) -------------------------
  function initSpotlight() {
    if (!window.matchMedia('(hover: hover)').matches) return;   // skip touch screens
    document.querySelectorAll('.edu-card, .glass-card, .proj-card').forEach(function (card) {
      card.addEventListener('pointermove', function (ev) {
        var box = card.getBoundingClientRect();
        card.style.setProperty('--mx', (ev.clientX - box.left) + 'px');
        card.style.setProperty('--my', (ev.clientY - box.top) + 'px');
      });
    });
  }

  // ---- Scroll progress bar + active nav link -------------------------
  function initScrollUi() {
    var bar = document.getElementById('scrollProgress');
    var queued = false;
    function update() {
      queued = false;
      var max = root.scrollHeight - window.innerHeight;
      if (bar) bar.style.setProperty('--p', max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    }
    window.addEventListener('scroll', function () {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();

    if (!('IntersectionObserver' in window)) return;
    var links = document.querySelectorAll('.nav-links > a[data-scroll], .mobile-menu-inner a[data-scroll]');
    // a section is "current" while it crosses the middle of the viewport;
    // the hero has no nav link, so reaching it clears the highlight
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute('data-scroll') === e.target.id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    document.querySelectorAll('.hero, #about, #experience, #projects, #contact').forEach(function (s) { io.observe(s); });
  }

  // ---- Scroll reveals -------------------------------------------------
  function initReveals() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var n = e.target;
        n.classList.add('in');
        io.unobserve(n);
        // once the entrance finishes, switch to fast hover transitions
        var delay = parseFloat(getComputedStyle(n).getPropertyValue('--d')) || 0;
        setTimeout(function () { n.classList.add('settled'); }, (delay + 0.85) * 1000);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (n) { io.observe(n); });
  }

  // ---- Theme toggle (same localStorage key as the original) ----------
  function initTheme() {
    var btns = document.querySelectorAll('[data-theme-toggle]');
    // desktop and mobile each have a toggle; keep both labels in sync
    function syncLabels() {
      var label = root.classList.contains('dark') ? 'Switch to light mode' : 'Switch to dark mode';
      btns.forEach(function (b) { b.setAttribute('aria-label', label); });
    }
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dark = root.classList.toggle('dark');
        syncLabels();
        try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch (e) {}
      });
    });
    syncLabels();
  }

  // ---- Mobile menu + smooth section scrolling ------------------------
  function initNav() {
    var menuBtn = document.getElementById('menuBtn');
    var menu = document.getElementById('mobileMenu');

    function closeMenu() {
      if (!menu) return;
      menu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
    }
    if (menuBtn && menu) {
      menuBtn.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
      document.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Escape' || !menu.classList.contains('open')) return;
        closeMenu();
        menuBtn.focus();
      });
    }

    document.querySelectorAll('[data-scroll]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var id = a.getAttribute('data-scroll');
        var target = id === 'top' ? document.body : document.getElementById(id);
        if (!target) return;
        ev.preventDefault();
        closeMenu();
        var y = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
        if (history.replaceState) history.replaceState(null, '', id === 'top' ? location.pathname : '#' + id);
      });
    });
  }

  // ---- Boot -----------------------------------------------------------
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  initTheme();
  initNav();
  initSpotlight();
  initScrollUi();
  runLoader(function () {
    playHero();
    initReveals();
  });
})();
