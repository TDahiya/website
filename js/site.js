/* ============================================================================
   site.js — shared chrome for every page.

   Each page ships its own <nav> as real <a href> links, so navigation works
   with JavaScript off. This file injects the icon sprite and footer (too big
   to repeat seven times), then wires theme, starfield, reveal and the
   command palette.
   ============================================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------- ICON SPRITE */
  var SPRITE =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<symbol id="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">' +
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></symbol>' +
    '<symbol id="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></symbol>' +
    '<symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">' +
      '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></symbol>' +
    '<symbol id="i-github" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0C17.5 4.6 18.5 5 18.5 5c.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></symbol>' +
    '<symbol id="i-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></symbol>' +
    '<symbol id="i-doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></symbol>' +
    '<symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M7 17L17 7M9 7h8v8"/></symbol>' +
    '<symbol id="i-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M15 5l-7 7 7 7"/></symbol>' +
    '<symbol id="m-kaia" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 34a20 20 0 1 1 40 0v12a6 6 0 0 1-6 6h-8"/><rect x="6" y="30" width="10" height="16" rx="4"/>' +
      '<rect x="48" y="30" width="10" height="16" rx="4"/><path d="M24 30v8M32 25v18M40 30v8"/></symbol>' +
    '<symbol id="m-rag" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="14" cy="18" r="6"/><circle cx="14" cy="46" r="6"/><circle cx="50" cy="32" r="7"/>' +
      '<path d="M20 18h10l8 10M20 46h10l8-10"/><path d="M50 10v8M50 46v8"/></symbol>' +
    '<symbol id="m-fire" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M32 6l22 9v16c0 14-9 23-22 27C19 54 10 45 10 31V15z"/><path d="M22 31h20M26 23h12M26 39h12"/></symbol>' +
    '<symbol id="m-isce" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="32" cy="32" r="22"/><path d="M32 10v44M10 32h44"/><path d="M18 18c8 6 20 6 28 0M18 46c8-6 20-6 28 0"/></symbol>' +
    '<symbol id="m-agent" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="32" cy="14" r="7"/><circle cx="14" cy="48" r="7"/><circle cx="50" cy="48" r="7"/>' +
      '<path d="M27 20L19 42M37 20l8 22M21 48h22"/></symbol>' +
    '<symbol id="m-health" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M6 34h12l5-13 8 26 6-16 5 8h16"/><path d="M32 54C20 46 8 40 8 27a12 12 0 0 1 24-5 12 12 0 0 1 24 5c0 4-1 7-3 10"/></symbol>' +
    '</svg>';
  document.body.insertAdjacentHTML('afterbegin', SPRITE);

  /* --------------------------------------------------------------- FOOTER */
  var FOOTER =
    '<footer>' +
      '<div><div style="font-weight:600;margin-bottom:var(--sp-h)">Tanishq Dahiya</div>' +
      '<div class="foot-note">Dublin, Ireland · Stamp 1G, eligible to work full-time</div></div>' +
      '<div class="foot-links">' +
        '<button class="copy-mail" type="button" data-mail="tanishqd423@gmail.com"><span>tanishqd423@gmail.com</span></button>' +
        '<a href="https://www.linkedin.com/in/tdahiya2845/" target="_blank" rel="noopener">LinkedIn</a>' +
        '<a href="https://github.com/TDahiya" target="_blank" rel="noopener">GitHub</a>' +
        '<a href="https://kaia-ai.duckdns.org/try" target="_blank" rel="noopener">Kaia</a>' +
      '</div>' +
    '</footer>';
  var main = document.querySelector('.page');
  if (main) main.insertAdjacentHTML('beforeend', FOOTER);

  /* ---------------------------------------------------------------- THEME */
  function paintThemeIcons() {
    var href = root.getAttribute('data-theme') === 'light' ? '#i-sun' : '#i-moon';
    document.querySelectorAll('#theme-toggle use').forEach(function (u) { u.setAttribute('href', href); });
  }
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
      paintThemeIcons();
      drawStars();
    });
  }
  paintThemeIcons();

  /* ------------------------------------------------------------ STARFIELD
     Drawn once per size change rather than animated: it is a backdrop, and a
     rAF loop for it would burn battery for no one's benefit.                */
  var canvas = document.getElementById('stars');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

  function drawStars() {
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = window.innerWidth, h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var light = root.getAttribute('data-theme') === 'light';
    var rgb = light ? '10,12,16' : '255,255,255';
    var count = Math.min(Math.round((w * h) / 9000), 220);

    // Deterministic, so the sky does not reshuffle on every resize.
    var seed = 20260101;
    function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }

    for (var i = 0; i < count; i++) {
      var x = rnd() * w, y = rnd() * h;
      var r = rnd() * 1.1 + 0.25;
      var a = (rnd() * 0.5 + 0.12) * (light ? 0.5 : 1);
      a *= 1 - (y / h) * 0.55;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(' + rgb + ',' + a.toFixed(3) + ')';
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawStars, 180);
  });
  drawStars();

  /* ----------------------------------------------------------- ACTIVE NAV */
  // A project page (kaia.html, rag.html...) has no nav link of its own, and
  // its HTML already marks "Work" as current. Only override that when the
  // current file actually IS one of the nav destinations.
  var here = location.pathname.split('/').pop() || 'index.html';
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var owned = links.some(function (a) { return a.getAttribute('href') === here; });
  if (owned) {
    links.forEach(function (a) {
      a.setAttribute('aria-current', a.getAttribute('href') === here ? 'true' : 'false');
    });
  }

  /* ------------------------------------------------------------- GRID GLOW */
  if (!reduced) {
    var glow = document.querySelector('.grid-glow');
    if (glow) {
      window.addEventListener('pointermove', function (e) {
        glow.style.setProperty('--mx', e.clientX + 'px');
        glow.style.setProperty('--my', e.clientY + 'px');
      }, { passive: true });
    }
  }

  /* ----------------------------------------------------------- COPY EMAIL */
  document.querySelectorAll('.copy-mail').forEach(function (b) {
    var label = b.querySelector('span');
    var original = label.textContent;
    b.addEventListener('click', function () {
      var done = function () {
        label.textContent = 'copied';
        b.dataset.copied = 'true';
        setTimeout(function () { label.textContent = original; b.dataset.copied = 'false'; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(b.dataset.mail).then(done, function () {
          window.location.href = 'mailto:' + b.dataset.mail;
        });
      } else {
        window.location.href = 'mailto:' + b.dataset.mail;
      }
    });
  });

  /* ---------------------------------------------------------------- REVEAL */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.dataset.seen = 'true'; io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.dataset.seen = 'true'; });
  }

  /* --------------------------------------------------------------- PALETTE
     Now a site map: every entry is a real page, so it works across pages.   */
  var ENTRIES = [
    { href: 'kaia.html', title: 'Kaia — production AI assistant', sub: 'Live · voice, phone, tools', job: 'live',
      keys: 'live production assistant voice phone call deployed latency sandbox pandas kaia demo try running now what is live' },
    { href: 'rag.html', title: 'Hybrid RAG over EU & Irish law', sub: 'Retrieval · BM25 + FAISS + RRF', job: 'measured',
      keys: 'rag retrieval search bm25 faiss rrf fusion legal law eu irish hallucination faithfulness abstention recall eval' },
    { href: 'firewall.html', title: 'Prompt Firewall', sub: 'Security · injection detection', job: 'measured',
      keys: 'prompt injection firewall security guardrails classifier regex homoglyph base64 block safety filter' },
    { href: 'isce.html', title: 'LLM safety research (ISCE)', sub: 'MSc practicum · DCU', job: 'research',
      keys: 'research thesis practicum msc safety consistency adversarial paraphrase mitre attack g-eval judge benchmark iir dcu' },
    { href: 'work.html', title: 'All work', sub: 'Six projects', job: '',
      keys: 'work projects portfolio everything all built made shipped index of work' },
    { href: 'stack.html', title: 'Technical stack', sub: 'Tools, and how far each was taken', job: '',
      keys: 'stack skills tools tech python fastapi pytorch docker sql languages frameworks what do you know' },
    { href: 'stack.html#experience', title: 'Experience & education', sub: 'Where I have been', job: '',
      keys: 'background experience education work history cv resume job dcu delhi broz circle k degree masters log' },
    { href: 'Tanishq_Dahiya_AI_Engineer.pdf', title: 'Download the CV', sub: 'One page, PDF', job: '',
      keys: 'cv resume pdf download hire contact' },
    { href: 'index.html', title: 'Home', sub: 'Start over', job: '',
      keys: 'top start home beginning hello intro index' }
  ];

  var backdrop = document.getElementById('palette-backdrop');
  var palette  = document.getElementById('palette');
  var input    = document.getElementById('palette-input');
  var list     = document.getElementById('palette-list');
  if (!palette) return;

  var lastFocus = null, cursor = 0, shown = [];

  function score(entry, q) {
    if (!q) return 1;
    var hay = (entry.title + ' ' + entry.sub + ' ' + entry.keys).toLowerCase();
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    var hits = 0;
    words.forEach(function (w) { if (hay.indexOf(w) !== -1) hits++; });
    return hits === 0 ? 0 : hits / words.length;
  }

  function render() {
    var q = input.value.trim();
    shown = ENTRIES
      .map(function (e) { return { e: e, s: score(e, q) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .map(function (x) { return x.e; });

    list.innerHTML = '';
    if (!shown.length) {
      var p = document.createElement('p');
      p.className = 'palette-empty';
      p.textContent = 'Nothing here matches that. Kaia is better at open questions, and she is linked on the home page.';
      list.appendChild(p);
      return;
    }
    if (cursor >= shown.length) cursor = 0;

    shown.forEach(function (e, i) {
      var a = document.createElement('a');
      a.className = 'palette-item';
      a.href = e.href;
      if (e.job) a.dataset.job = e.job;
      if (i === cursor) a.dataset.active = 'true';
      a.innerHTML =
        '<span class="pi-key"></span>' +
        '<span class="pi-text"><span class="pi-title"></span><br><span class="pi-sub"></span></span>' +
        '<span class="pi-go">↵</span>';
      a.querySelector('.pi-title').textContent = e.title;
      a.querySelector('.pi-sub').textContent = e.sub;
      a.addEventListener('mousemove', function () {
        cursor = i;
        list.querySelectorAll('.palette-item').forEach(function (n, j) {
          n.dataset.active = j === i ? 'true' : 'false';
        });
      });
      list.appendChild(a);
    });
  }

  function openPalette() {
    lastFocus = document.activeElement;
    backdrop.dataset.open = 'true';
    palette.dataset.open = 'true';
    input.value = ''; cursor = 0;
    render(); input.focus();
  }
  function closePalette() {
    backdrop.dataset.open = 'false';
    palette.dataset.open = 'false';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  var opener = document.getElementById('open-palette');
  if (opener) opener.addEventListener('click', openPalette);
  backdrop.addEventListener('click', closePalette);
  input.addEventListener('input', function () { cursor = 0; render(); });

  document.addEventListener('keydown', function (e) {
    var open = palette.dataset.open === 'true';
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault(); open ? closePalette() : openPalette(); return;
    }
    if (!open && e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      e.preventDefault(); openPalette(); return;
    }
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); cursor = (cursor + 1) % Math.max(shown.length, 1); render(); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); cursor = (cursor - 1 + shown.length) % Math.max(shown.length, 1); render(); }
    else if (e.key === 'Enter' && shown.length) { e.preventDefault(); window.location.href = shown[cursor].href; }
    else if (e.key === 'Tab') { e.preventDefault(); input.focus(); }
  });
})();
