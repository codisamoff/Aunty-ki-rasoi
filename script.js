/* Aunty Ki Rasoi — QR Menu
 • *Language toggle (Hinglish / Hindi)
 • Instant menu search
 • Footer year
 • Smooth-scroll fallback for anchor links
 • Graceful image fallback for dish thumbnails
 */
(function () {
  'use strict';

  var translations = {
    hinglish: {
      tagline: 'Home Cooked Indian Food',
 viewMenu: 'View Menu',
 catSabzi: 'Sabzi',
 catRoti: 'Roti / Naan',
 catRice: 'Rice',
 catRaita: 'Raita',
 searchPlaceholder: 'Search menu…',
 searchLabel: 'Search menu',
 noResults: 'No matching items found.',
 halfFullNote: 'Half & Full portions available',
 connectWithUs: 'Connect with us',
 instagram: 'Instagram',
 call: 'Call',
 maps: 'Maps'
    },
 hindi: {
   tagline: 'घर का बना भारतीय खाना',
 viewMenu: 'मेन्यू देखें',
 catSabzi: 'सब्ज़ी',
 catRoti: 'रोटी / नान',
 catRice: 'चावल',
 catRaita: 'रायता',
 searchPlaceholder: 'मेन्यू खोजें…',
 searchLabel: 'मेन्यू खोजें',
 noResults: 'कोई मेल खाता आइटम नहीं मिला।',
 halfFullNote: 'हाफ और फुल उपलब्ध',
 connectWithUs: 'हमसे जुड़ें',
 instagram: 'इंस्टाग्राम',
 call: 'कॉल',
 maps: 'मैप्स'
 }
  };

  var currentLang = 'hinglish';

  function applyLanguage(lang) {
    var dict = translations[lang];
    if (!dict) return;

    currentLang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
      });

        document.querySelectorAll('.lang-btn').forEach(function (btn) {
          var isActive = btn.getAttribute('data-lang') === lang;
          btn.classList.toggle('is-active', isActive);
          btn.setAttribute('aria-pressed', String(isActive));
        });

        document.documentElement.lang = lang === 'hindi' ? 'hi' : 'en';

        runSearch();
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = btn.getAttribute('data-lang');
      if (lang && lang !== currentLang) applyLanguage(lang);
    });
  });

  /* Search */
  var searchInput = document.getElementById('menu-search');
  var clearBtn = document.getElementById('clear-search');
  var noResults = document.getElementById('no-results');
  var allRows = Array.prototype.slice.call(document.querySelectorAll('.dish-row'));
  var allSections = Array.prototype.slice.call(document.querySelectorAll('.menu-section'));

  function normalize(str) {
    return (str || '').toLowerCase().trim();
  }

  function runSearch() {
    if (!searchInput) return;

    var query = normalize(searchInput.value);

    if (query === '') {
      allRows.forEach(function (row) { row.hidden = false; });
      allSections.forEach(function (sec) { sec.hidden = false; });
      if (clearBtn) clearBtn.hidden = true;
      if (noResults) noResults.hidden = true;
      return;
    }

    if (clearBtn) clearBtn.hidden = false;

    var anyMatch = false;

    allRows.forEach(function (row) {
      var name = normalize(row.getAttribute('data-name') || row.textContent);
      var match = name.indexOf(query) !== -1;
      row.hidden = !match;
      if (match) anyMatch = true;
    });

      allSections.forEach(function (sec) {
        var visibleRows = sec.querySelectorAll('.dish-row:not([hidden])');
        sec.hidden = visibleRows.length === 0;
      });

      if (noResults) noResults.hidden = anyMatch;
  }

  if (searchInput) searchInput.addEventListener('input', runSearch);

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      searchInput.value = '';
      runSearch();
      searchInput.focus();
    });
  }

  /* Footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Smooth-scroll fallback */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id.length < 2) return;

      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (history.pushState) {
        history.pushState(null, '', id);
      } else {
        window.location.hash = id;
      }
    });
  });

  /* Image fallback (belt and braces — inline onerror already handles it) */
  document.querySelectorAll('.dish-thumb img').forEach(function (img) {
    img.addEventListener('error', function () {
      var parent = img.parentNode;
      if (parent) {
        parent.classList.add('img-missing');
        if (img.parentNode === parent) parent.removeChild(img);
      }
    });
  });

  applyLanguage('hinglish');
})();
