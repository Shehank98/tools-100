/* OneKitApp — public site interactions (vanilla, no dependencies) */
(function () {
  'use strict';

  // ── Mobile nav toggle ──
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // ── Cookie consent ──
  var banner = document.querySelector('[data-cookie-banner]');
  if (banner) {
    var KEY = 'onekit_cookie_consent';
    var choice = null;
    try { choice = localStorage.getItem(KEY); } catch (e) {}
    if (!choice) banner.hidden = false;
    function decide(val) {
      try { localStorage.setItem(KEY, val); } catch (e) {}
      banner.hidden = true;
    }
    var acc = banner.querySelector('[data-cookie-accept]');
    var dec = banner.querySelector('[data-cookie-decline]');
    if (acc) acc.addEventListener('click', function () { decide('accepted'); });
    if (dec) dec.addEventListener('click', function () { decide('declined'); });
  }

  // ── Live search (debounced) ──
  document.querySelectorAll('[data-search]').forEach(function (root) {
    var input = root.querySelector('[data-search-input]');
    var out = root.querySelector('[data-search-results]');
    if (!input || !out) return;

    var timer = null;
    var lastQuery = '';
    var activeIndex = -1;

    function hide() { out.classList.remove('show'); out.innerHTML = ''; activeIndex = -1; }

    function render(items, q) {
      if (!items.length) {
        out.innerHTML = '<div class="sr-empty">No tools found for “' + escapeHtml(q) +
          '”. <a href="/submit">Suggest it →</a></div>';
        out.classList.add('show');
        return;
      }
      out.innerHTML = items.map(function (t) {
        return '<a href="/tool/' + encodeURIComponent(t.slug) + '" role="option">' +
          '<span class="sr-ico">' + (t.icon || '🔧') + '</span>' +
          '<span><span class="sr-name">' + escapeHtml(t.name) + '</span><br>' +
          '<span class="sr-cat">' + escapeHtml(t.category || '') + '</span></span></a>';
      }).join('');
      out.classList.add('show');
      activeIndex = -1;
    }

    function fetchResults(q) {
      fetch('/api/search?q=' + encodeURIComponent(q), { headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (input.value.trim() !== q) return; // stale
          render(data.results || [], q);
        })
        .catch(function () { hide(); });
    }

    input.addEventListener('input', function () {
      var q = input.value.trim();
      if (timer) clearTimeout(timer);
      if (q.length < 2) { hide(); return; }
      if (q === lastQuery) return;
      lastQuery = q;
      timer = setTimeout(function () { fetchResults(q); }, 220);
    });

    // Keyboard navigation
    input.addEventListener('keydown', function (e) {
      var opts = Array.prototype.slice.call(out.querySelectorAll('a'));
      if (!opts.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = (activeIndex + 1) % opts.length; }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = (activeIndex - 1 + opts.length) % opts.length; }
      else if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); window.location.href = opts[activeIndex].href; return; }
      else if (e.key === 'Escape') { hide(); return; }
      else return;
      opts.forEach(function (o, i) { o.classList.toggle('active', i === activeIndex); });
    });

    document.addEventListener('click', function (e) {
      if (!root.contains(e.target)) hide();
    });
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
