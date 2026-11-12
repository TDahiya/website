/* ============================================================================
   site.js — navigator spine, command palette, theme, reveal, grid glow.
   No dependencies.
   ============================================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));

  /* ------------------------------------------------------------------ THEME */
  function iconFor(theme) { return theme === 'light' ? '#i-sun' : '#i-moon'; }

  function paintThemeIcons() {
    var t = root.getAttribute('data-theme');
    document.querySelectorAll('#theme-toggle use, #theme-toggle-m use').forEach(function (u) {
      u.setAttribute('href', iconFor(t));
    });
  }

  function toggleTheme() {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    paintThemeIcons();
  }

  ['theme-toggle', 'theme-toggle-m'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', toggleTheme);
  });
  paintThemeIcons();

  /* ------------------------------------------------------------------ SPINE */
  var spine = document.getElementById('spine');
  var nodes = [];

  sections.forEach(function (sec) {
    var b = document.createElement('button');
    b.className = 'node';
    b.type = 'button';
    b.dataset.label = sec.dataset.nav;
    b.setAttribute('aria-label', 'Go to ' + sec.dataset.nav);
    b.addEventListener('click', function () { jumpTo(sec.id); });
    spine.appendChild(b);
    nodes.push(b);
  });

  function setActive(id) {
    sections.forEach(function (sec, i) {
      nodes[i].setAttribute('aria-current', sec.id === id ? 'true' : 'false');
    });
  }

  function jumpTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Move keyboard focus too, or the jump is visual only.
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });

    // Say where you landed. Only on cards — ringing a whole section is noise.
    if (el.classList.contains('card') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.removeAttribute('data-arrived');
      void el.offsetWidth;
      el.setAttribute('data-arrived', '');
      setTimeout(function () { el.removeAttribute('data-arrived'); }, 1500);
    }
  }

  /* Stat tiles jump to whichever project produced the number. */
  document.querySelectorAll('[data-jump]').forEach(function (b) {
    b.addEventListener('click', function () { jumpTo(b.dataset.jump); });
  });

  /* Footer email copies rather than hijacking the page into a mail client. */
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

  /* Active section = the last one whose top has passed a third of the viewport. */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var line = window.innerHeight * 0.33;
      var current = sections[0];
      sections.forEach(function (sec) {
        if (sec.getBoundingClientRect().top <= line) current = sec;
      });
      setActive(current.id);

      var bar = document.getElementById('progress');
      if (bar) {
        var h = document.body.scrollHeight - window.innerHeight;
        bar.style.setProperty('--p', (h > 0 ? (window.scrollY / h) * 100 : 0) + '%');
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------- GRID GLOW */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var glow = document.querySelector('.grid-glow');
    window.addEventListener('pointermove', function (e) {
      glow.style.setProperty('--mx', e.clientX + 'px');
      glow.style.setProperty('--my', e.clientY + 'px');
    }, { passive: true });
  }

  /* ----------------------------------------------------------------- REVEAL */
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

  /* ---------------------------------------------------------------- PALETTE
     Section jumps plus intent phrasings, so "what is live" finds Kaia. The
     keywords are what make it feel like it understood rather than matched.   */
  var ENTRIES = [
    { id: 'kaia',       title: 'Kaia — production AI assistant', sub: 'Live · voice, phone, tools', job: 'live',
      keys: 'live production assistant voice phone call deployed latency sandbox pandas kaia demo try running now what is live' },
    { id: 'rag',        title: 'Hybrid RAG over EU & Irish law', sub: 'Retrieval · BM25 + FAISS + RRF', job: 'measured',
      keys: 'rag retrieval search bm25 faiss rrf fusion legal law eu irish hallucination faithfulness abstention recall eval' },
    { id: 'firewall',   title: 'Prompt Firewall', sub: 'Security · injection detection', job: 'measured',
      keys: 'prompt injection firewall security guardrails classifier regex homoglyph base64 block safety filter' },
    { id: 'isce',       title: 'LLM safety research (ISCE)', sub: 'MSc practicum · DCU', job: 'research',
      keys: 'research thesis practicum msc safety consistency adversarial paraphrase mitre attack g-eval judge benchmark iir dcu' },
    { id: 'also',       title: 'Earlier projects', sub: 'Agents, vision, ML, dbt', job: '',
      keys: 'also earlier other projects agents langgraph image detection ensemble health risk dbt snowflake analytics' },
    { id: 'stack',      title: 'Toolkit', sub: 'What I actually reach for', job: '',
      keys: 'stack skills tools tech python fastapi pytorch docker sql languages frameworks what do you know' },
    { id: 'background', title: 'Experience & education', sub: 'Where I have been', job: '',
      keys: 'background experience education work history cv resume job dcu delhi broz circle k degree masters' },
    { id: 'top',        title: 'Back to the top', sub: 'Start over', job: '',
      keys: 'top start home beginning hello intro' }
  ];

  var backdrop = document.getElementById('palette-backdrop');
  var palette  = document.getElementById('palette');
  var input    = document.getElementById('palette-input');
  var list     = document.getElementById('palette-list');
  var lastFocus = null;
  var cursor = 0;
  var shown = [];

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
      p.textContent = 'Nothing here matches that. Kaia herself is better at open questions — she is linked at the top.';
      list.appendChild(p);
      return;
    }
    if (cursor >= shown.length) cursor = 0;

    shown.forEach(function (e, i) {
      var b = document.createElement('button');
      b.className = 'palette-item';
      b.type = 'button';
      if (e.job) b.dataset.job = e.job;
      if (i === cursor) b.dataset.active = 'true';
      b.innerHTML =
        '<span class="pi-key"></span>' +
        '<span class="pi-text"><span class="pi-title"></span><br><span class="pi-sub"></span></span>' +
        '<span class="pi-go">↵</span>';
      b.querySelector('.pi-title').textContent = e.title;
      b.querySelector('.pi-sub').textContent = e.sub;
      b.addEventListener('click', function () { closePalette(); jumpTo(e.id); });
      b.addEventListener('mousemove', function () {
        cursor = i;
        list.querySelectorAll('.palette-item').forEach(function (n, j) {
          n.dataset.active = j === i ? 'true' : 'false';
        });
      });
      list.appendChild(b);
    });
  }

  function openPalette() {
    lastFocus = document.activeElement;
    backdrop.dataset.open = 'true';
    palette.dataset.open = 'true';
    input.value = '';
    cursor = 0;
    render();
    input.focus();
  }

  function closePalette() {
    backdrop.dataset.open = 'false';
    palette.dataset.open = 'false';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  ['open-palette', 'open-palette-m'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', openPalette);
  });
  backdrop.addEventListener('click', closePalette);
  input.addEventListener('input', function () { cursor = 0; render(); });

  document.addEventListener('keydown', function (e) {
    var open = palette.dataset.open === 'true';

    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open ? closePalette() : openPalette();
      return;
    }
    // Bare "/" opens it, unless the visitor is typing somewhere.
    if (!open && e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      e.preventDefault();
      openPalette();
      return;
    }
    if (!open) return;

    if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); cursor = (cursor + 1) % Math.max(shown.length, 1); render(); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); cursor = (cursor - 1 + shown.length) % Math.max(shown.length, 1); render(); }
    else if (e.key === 'Enter' && shown.length) { e.preventDefault(); var t = shown[cursor]; closePalette(); jumpTo(t.id); }
    else if (e.key === 'Tab') {
      // Keep focus inside the dialog while it is open.
      e.preventDefault();
      input.focus();
    }
  });
})();
