/* Likith G S — portfolio interactions. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  var THEME_KEY = 'theme';

  window.__portfolioBooted = true;      // tells the inline safety net in <head> we're alive

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (n) { io.observe(n); });
  }

  // ---- Theme toggle (same localStorage key as the original) ----------
  function initTheme() {
    var btns = document.querySelectorAll('[data-theme-toggle]');
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
        // scroll-padding-top in CSS keeps the section clear of the sticky header
        if (id === 'top') window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        if (history.replaceState) history.replaceState(null, '', id === 'top' ? location.pathname : '#' + id);
      });
    });
  }

  // ---- Header border, scroll progress, active nav link ---------------
  function initScrollUi() {
    var header = document.getElementById('siteHeader');
    var bar = document.getElementById('scrollProgress');
    var sections = document.querySelectorAll('main > section');
    var links = document.querySelectorAll('.nav-links a[data-scroll], .mobile-menu-inner a[data-scroll]');
    var current = null;
    var queued = false;

    function update() {
      queued = false;
      var max = root.scrollHeight - window.innerHeight;
      if (bar) bar.style.setProperty('--p', max > 0 ? Math.min(window.scrollY / max, 1) : 0);
      if (header) header.classList.toggle('scrolled', window.scrollY > 8);
      markActive();
    }

    // active nav link: the last section whose top has passed 35% of the viewport
    // (or the last section once the page bottoms out, since Contact is short).
    // The intro and education have no nav link, so reaching them clears it.
    function markActive() {
      var line = window.innerHeight * 0.35, id = null;
      sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) id = s.id; });
      if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) id = sections[sections.length - 1].id;
      if (id === current) return;
      current = id;
      links.forEach(function (a) {
        var on = a.getAttribute('data-scroll') === id;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }

    window.addEventListener('scroll', function () {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // ---- Copy email button ----------------------------------------------
  function initCopyEmail() {
    var btn = document.getElementById('copyEmail');
    if (!btn) return;
    var status = document.getElementById('copyStatus');
    var timer;
    function done(ok) {
      btn.classList.toggle('copied', ok);
      btn.textContent = ok ? 'Copied' : 'Press Ctrl+C';
      if (status) status.textContent = ok ? 'Email address copied to clipboard' : '';
      clearTimeout(timer);
      timer = setTimeout(function () {
        btn.classList.remove('copied');
        btn.textContent = 'Copy';
        if (status) status.textContent = '';
      }, 2000);
    }
    btn.addEventListener('click', function () {
      var email = btn.getAttribute('data-email');
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, function () { done(false); });
        return;
      }
      // fallback for plain http / older browsers
      var tmp = document.createElement('textarea');
      tmp.value = email; tmp.setAttribute('readonly', ''); tmp.style.position = 'fixed'; tmp.style.opacity = '0';
      document.body.appendChild(tmp); tmp.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      tmp.remove();
      done(ok);
    });
  }

  // ---- Boot -----------------------------------------------------------
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  initTheme();
  initNav();
  initScrollUi();
  initCopyEmail();
  initReveals();
  // let the intro fade in on the next frame, so the transition actually runs
  requestAnimationFrame(function () { body.classList.add('ready'); });
})();
