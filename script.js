/* Likith G S — portfolio interactions. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  // ---- Config ---------------------------------------------------------
  var LOADER_MS = 4500;   // original runs ~4.5s; set to 0 to disable the loader
  var TYPE_MS = 100;      // per-character typing speed for the hero role
  var THEME_KEY = 'theme';

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Loader ---------------------------------------------------------
  function runLoader(done) {
    var loader = document.getElementById('loader');
    if (!loader || LOADER_MS <= 0 || reduceMotion) {
      if (loader) loader.classList.add('done');
      return done();
    }
    body.classList.add('is-loading');

    // twinkling background particles
    var field = document.getElementById('loaderParticles');
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 40; i++) {
      var p = document.createElement('i');
      p.style.left = (Math.random() * 100).toFixed(2) + '%';
      p.style.top = (Math.random() * 100).toFixed(2) + '%';
      p.style.setProperty('--t', (2 + Math.random() * 3).toFixed(2) + 's');
      p.style.setProperty('--dl', (Math.random() * 3).toFixed(2) + 's');
      frag.appendChild(p);
    }
    field.appendChild(frag);

    var bar = document.getElementById('loaderBar');
    var pct = document.getElementById('loaderPct');
    var label = document.getElementById('loaderLabel');
    var start = performance.now();
    var shown = 0;

    function stage(v) {
      if (v < 20) return 'Loading Portfolio';
      if (v < 50) return 'Initializing Experience';
      return 'Almost Ready';
    }

    function tick(now) {
      var t = Math.min((now - start) / LOADER_MS, 1);
      // slightly uneven progress so it feels like real loading
      var target = Math.round(100 * (t < 1 ? t + Math.sin(t * 12) * 0.02 : 1));
      shown = Math.max(shown, Math.min(target, 100));
      bar.style.width = shown + '%';
      pct.textContent = shown + '%';
      label.textContent = stage(shown);
      if (t < 1) return requestAnimationFrame(tick);
      setTimeout(function () {
        loader.classList.add('done');
        body.classList.remove('is-loading');
        setTimeout(function () { loader.remove(); }, 700);
        done();
      }, 250);
    }
    requestAnimationFrame(tick);
  }

  // ---- Hero entrance + typing ----------------------------------------
  function playHero() {
    var hero = document.querySelector('.hero');
    if (hero) hero.classList.add('play');

    var el = document.getElementById('typed');
    if (!el) return;
    var text = el.getAttribute('data-text') || '';
    if (reduceMotion) { el.textContent = text; return; }
    var i = 0;
    setTimeout(function step() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(step, TYPE_MS);
    }, 600);
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
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dark = root.classList.toggle('dark');
        btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
        try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch (e) {}
      });
      btn.setAttribute('aria-label', root.classList.contains('dark') ? 'Switch to light mode' : 'Switch to dark mode');
    });
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
  initTheme();
  initNav();
  runLoader(function () {
    playHero();
    initReveals();
  });
})();
