/* ==========================================================================
   Jennifer Diffley — portfolio behavior
   No dependencies. Progressive enhancement only.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     Theme toggle (persisted)
     ------------------------------------------------------------------------ */
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');

  function syncToggleLabel() {
    if (!themeToggle) return;
    var isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  syncToggleLabel();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('jd-theme', next); } catch (e) {}
      syncToggleLabel();
    });
  }

  /* ------------------------------------------------------------------------
     Mobile nav
     ------------------------------------------------------------------------ */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     Sticky nav hairline
     ------------------------------------------------------------------------ */
  var siteNav = document.getElementById('siteNav');
  if (siteNav) {
    var onScroll = function () {
      siteNav.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------------ */
  var reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || prefersReduced) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    Array.prototype.forEach.call(reveals, function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------------
     Animated stat counters
     ------------------------------------------------------------------------ */
  var stats = document.querySelectorAll('.stat-number');

  function renderStat(el, value) {
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    el.textContent = prefix + value + suffix;
  }

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    if (prefersReduced) {
      renderStat(el, target);
      return;
    }

    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // easeOutExpo — fast, then settles
      var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      renderStat(el, Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(stats, function (el) {
      renderStat(el, parseInt(el.getAttribute('data-target'), 10));
    });
  } else {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        statObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    Array.prototype.forEach.call(stats, function (el) { statObserver.observe(el); });
  }

  /* ------------------------------------------------------------------------
     Active nav link
     ------------------------------------------------------------------------ */
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');

  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        Array.prototype.forEach.call(navAnchors, function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Array.prototype.forEach.call(sections, function (s) { sectionObserver.observe(s); });
  }

  /* ------------------------------------------------------------------------
     Contact form
     Sends via Formspree when data-endpoint is set; otherwise falls back to
     opening the visitor's email client with the message pre-filled.
     ------------------------------------------------------------------------ */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  function setStatus(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.className = 'form-status' + (kind ? ' is-' + kind : '');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var subject = form.elements.subject.value.trim();
      var message = form.elements.message.value.trim();

      if (!name || !email || !message) {
        setStatus('Please fill in your name, email, and message.', 'err');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus('That email address doesn\'t look right.', 'err');
        return;
      }
      if (form.elements._gotcha.value) return; // bot

      var endpoint = form.getAttribute('data-endpoint');

      // No backend configured yet — hand off to the visitor's mail client.
      if (!endpoint) {
        var body = 'From: ' + name + ' (' + email + ')\n\n' + message;
        window.location.href =
          'mailto:jenniferdiffley@gmail.com' +
          '?subject=' + encodeURIComponent(subject || 'Portfolio enquiry from ' + name) +
          '&body=' + encodeURIComponent(body);
        setStatus('Opening your email app…');
        return;
      }

      var button = form.querySelector('button[type="submit"]');
      var originalLabel = button ? button.textContent : '';
      if (button) { button.disabled = true; button.textContent = 'Sending…'; }
      setStatus('');

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, subject: subject, message: message })
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          setStatus('Thanks — your message is on its way.', 'ok');
        })
        .catch(function () {
          setStatus('Something went wrong. Please email jenniferdiffley@gmail.com directly.', 'err');
        })
        .then(function () {
          if (button) { button.disabled = false; button.textContent = originalLabel; }
        });
    });
  }

  /* ------------------------------------------------------------------------
     Forced downloads (résumé)
     The `download` attribute alone isn't dependable: Safari ignored it for
     years, and any browser set to "open PDFs in browser" previews the file
     instead. So we build a Blob and click a synthetic link, which forces a
     real download.

     Two ways to get the bytes, tried in order:
       1. fetch() — works over http(s)
       2. a lazily-loaded base64 copy (assets/resume-data.js, generated by
          tools/build.mjs) — works over file:// too, where fetch is blocked
          by CORS. Only requested if step 1 fails, so it costs nothing on a
          normal page load.
     ------------------------------------------------------------------------ */
  function saveBlob(blob, filename) {
    // IE/old Edge
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
      return;
    }
    var objectUrl = URL.createObjectURL(blob);
    var temp = document.createElement('a');
    temp.href = objectUrl;
    temp.download = filename;
    temp.rel = 'noopener';
    temp.style.display = 'none';
    document.body.appendChild(temp);
    temp.click();
    document.body.removeChild(temp);
    setTimeout(function () { URL.revokeObjectURL(objectUrl); }, 10000);
  }

  function base64ToBlob(b64, type) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: type || 'application/octet-stream' });
  }

  function saveFromEmbedded(url, filename, giveUp) {
    function useIt() {
      var data = window.__JD_RESUME__;
      if (!data || !data.b64) return giveUp();
      try {
        saveBlob(base64ToBlob(data.b64, data.type), filename || data.filename);
      } catch (err) {
        giveUp();
      }
    }

    if (window.__JD_RESUME__) return useIt();

    // assets/Jennifer-…-Resume.pdf → assets/resume-data.js
    var script = document.createElement('script');
    script.src = url.replace(/[^/]+$/, 'resume-data.js');
    script.onload = useIt;
    script.onerror = giveUp;
    document.head.appendChild(script);
  }

  Array.prototype.forEach.call(document.querySelectorAll('a[data-download]'), function (link) {
    link.addEventListener('click', function (e) {
      if (!window.URL || !window.URL.createObjectURL || !window.Blob) return;

      var url = link.getAttribute('href');
      var filename = link.getAttribute('download') || url.split('/').pop();
      e.preventDefault();

      var openNormally = function () { window.location.href = url; };
      var tryEmbedded = function () { saveFromEmbedded(url, filename, openNormally); };

      if (!window.fetch || location.protocol === 'file:') {
        tryEmbedded();
        return;
      }

      fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.blob();
        })
        .then(function (blob) { saveBlob(blob, filename); })
        .catch(tryEmbedded);
    });
  });

  /* ------------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------------ */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
