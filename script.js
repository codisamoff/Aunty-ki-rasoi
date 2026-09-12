/* Aunty Ki Rasoi — QR Menu (QA-fixed build)
 • La*nguage toggle (Hinglish / Hindi) — UI strings only, dish names never translated
 • Instant menu search (name + description)
 • Dish detail modal (accessible, keyboard, focus-managed, image-optional)
 • Image fallback for dish thumbnails and modal image
 • Scrollspy for sticky category nav
 • Subtle reveal-on-scroll animations (reduced-motion aware)
 • Footer year + smooth-scroll fallback
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var prefersReduced = false;
  try {
    prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* older browsers */ }

  /* ------------------------------------------------------------
   * i18n — UI text ONLY. Dish names and prices are NEVER listed here.
   * ------------------------------------------------------------ */
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
 maps: 'Maps',
 half: 'Half',
 full: 'Full',
 close: 'Close'
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
 maps: 'मैप्स',
 half: 'हाफ',
 full: 'फुल',
 close: 'बंद करें'
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

        document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
          var key = el.getAttribute('data-i18n-aria');
          if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
        });

          document.querySelectorAll('.lang-btn').forEach(function (btn) {
            var isActive = btn.getAttribute('data-lang') === lang;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
          });

          document.documentElement.lang = lang === 'hindi' ? 'hi' : 'en';

          refreshModalTranslations();
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = btn.getAttribute('data-lang');
      if (lang && lang !== currentLang) applyLanguage(lang);
    });
  });

  /* ------------------------------------------------------------
   * Search — matches dish name AND description.
   * Per-row searchable text and section references are pre-cached
   * at init so keystrokes don't re-read attributes or re-query
   * the DOM per section.
   * ------------------------------------------------------------ */
  var searchInput = document.getElementById('menu-search');
  var clearBtn = document.getElementById('clear-search');
  var noResults = document.getElementById('no-results');
  var allRows = Array.prototype.slice.call(document.querySelectorAll('.dish-row'));
  var allSections = Array.prototype.slice.call(document.querySelectorAll('.menu-section'));

  var rowSearchText = [];
  var rowSections = [];

  function normalize(str) {
    return (str || '').toLowerCase().trim();
  }

  allRows.forEach(function (row) {
    var name = normalize(row.getAttribute('data-name') || '');
    var desc = normalize(row.getAttribute('data-desc') || '');
    rowSearchText.push(name + ' ' + desc);
    rowSections.push(row.closest('.menu-section'));
  });

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
    var sectionHasVisible = {};

    for (var i = 0; i < allRows.length; i++) {
      var match = rowSearchText[i].indexOf(query) !== -1;
      allRows[i].hidden = !match;
      if (match) {
        anyMatch = true;
        var sec = rowSections[i];
        if (sec) sectionHasVisible[sec.id] = true;
      }
    }

    allSections.forEach(function (sec) {
      sec.hidden = !sectionHasVisible[sec.id];
    });

    if (noResults) noResults.hidden = anyMatch;
  }

  if (searchInput) searchInput.addEventListener('input', runSearch);

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', function () {
      searchInput.value = '';
      runSearch();
      searchInput.focus();
    });
  }

  /* ------------------------------------------------------------
   * Image fallback (thumbnails)
   * ------------------------------------------------------------ */
  function attachImageFallback(img) {
    img.addEventListener('error', function () {
      var wrap = img.parentNode;
      if (wrap && wrap.classList) wrap.classList.add('img-missing');
    });
  }

  document.querySelectorAll('.dish-thumb img').forEach(attachImageFallback);

  /* ------------------------------------------------------------
   * Dish modal
   * ------------------------------------------------------------ */
  var modal = document.getElementById('dish-modal');
  var modalCard = modal ? modal.querySelector('.dish-modal-card') : null;
  var modalCloseBtn = modal ? modal.querySelector('.dish-modal-close') : null;
  var modalImage = document.getElementById('dish-modal-image');
  var modalImageWrap = modalImage ? modalImage.parentNode : null;
  var modalTitle = document.getElementById('dish-modal-title');
  var modalDesc = document.getElementById('dish-modal-desc');
  var modalPrices = document.getElementById('dish-modal-prices');

  var lastFocusedElement = null;
  var savedScrollY = 0;

  /* --- Scroll lock helpers -----------------------------------
   * Locks html + body with overflow:hidden. This preserves scroll
   * position natively on modern browsers and avoids the iOS Safari
   * nested-scroll bugs caused by position:fixed on body.
   * savedScrollY is kept as a safety net for browsers that reset.
   * ------------------------------------------------------------ */
  function lockScroll() {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
  }

  function unlockScroll() {
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    if (window.scrollY !== savedScrollY) {
      window.scrollTo(0, savedScrollY);
    }
  }

  function makePriceItem(label, value, isFull) {
    var el = document.createElement('div');
    el.className = 'price-item' + (isFull ? ' full' : '');
    var labelEl = document.createElement('span');
    labelEl.className = 'label';
    labelEl.textContent = label;
    var valueEl = document.createElement('span');
    valueEl.className = 'value';
    valueEl.textContent = value;
    el.appendChild(labelEl);
    el.appendChild(valueEl);
    return el;
  }

  function buildModalPrices(row) {
    if (!modalPrices || !row) return;
    modalPrices.innerHTML = '';
    var halfEl = row.querySelector('.dish-prices .half');
    var fullEl = row.querySelector('.dish-prices .full');
    var singleEl = row.querySelector('.dish-prices .single');

    if (halfEl && fullEl) {
      var halfLabel = currentLang === 'hindi' ? 'हाफ' : 'Half';
      var fullLabel = currentLang === 'hindi' ? 'फुल' : 'Full';
      var halfVal = halfEl.querySelector('b') ? halfEl.querySelector('b').textContent : '';
      var fullVal = fullEl.querySelector('b') ? fullEl.querySelector('b').textContent : '';
      modalPrices.appendChild(makePriceItem(halfLabel, halfVal, false));
      modalPrices.appendChild(makePriceItem(fullLabel, fullVal, true));
    } else if (singleEl) {
      var singleVal = singleEl.querySelector('b') ? singleEl.querySelector('b').textContent : '';
      var singleLabel = currentLang === 'hindi' ? 'कीमत' : 'Price';
      modalPrices.appendChild(makePriceItem(singleLabel, singleVal, false));
    }
  }

  function buildModalDesc(row) {
    if (!modalDesc || !row) return;
    var descEn = row.getAttribute('data-desc') || '';
    var descHi = row.getAttribute('data-desc-hi') || '';
    var desc = (currentLang === 'hindi' && descHi) ? descHi : descEn;
    if (desc) {
      modalDesc.textContent = desc;
      modalDesc.hidden = false;
    } else {
      modalDesc.textContent = '';
      modalDesc.hidden = true;
    }
  }

  function openModalFromRow(row) {
    if (!modal || !row) return;

    var name = row.getAttribute('data-name') || '';
    var imageSrc = row.getAttribute('data-image') || '';

    if (modalTitle) modalTitle.textContent = name;
    buildModalDesc(row);
    buildModalPrices(row);

    // Image (optional — dishes without a photo show the gold ornament)
    if (modalImageWrap) modalImageWrap.classList.remove('img-missing');
    if (modalImage) {
      modalImage.onerror = null;
      if (imageSrc) {
        modalImage.onerror = function () {
          if (modalImageWrap) modalImageWrap.classList.add('img-missing');
        };
          modalImage.src = imageSrc;
          modalImage.alt = name;
      } else {
        modalImage.removeAttribute('src');
        modalImage.alt = '';
        if (modalImageWrap) modalImageWrap.classList.add('img-missing');
      }
    }

    lastFocusedElement = document.activeElement;

    // Lock background scroll before showing the modal.
    lockScroll();

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');

    // Reset modal card scroll position for each new dish.
    if (modalCard) modalCard.scrollTop = 0;

    if (modalCloseBtn) modalCloseBtn.focus();
  }

  function refreshModalTranslations() {
    if (!modal || modal.hidden) return;
    var openRow = modal._currentRow;
    if (!openRow) return;
    buildModalDesc(openRow);
    buildModalPrices(openRow);
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');

    unlockScroll();

    modal._currentRow = null;
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  }

  // Event delegation for dish triggers
  var menuMain = document.getElementById('menu');
  if (menuMain) {
    menuMain.addEventListener('click', function (e) {
      var trigger = e.target.closest('.dish-trigger');
      if (!trigger) return;
      var row = trigger.closest('.dish-row');
      if (!row || !modal) return;
      modal._currentRow = row;
      openModalFromRow(row);
    });
  }

  // Close handlers
  if (modal) {
    modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

      // Simple focus trap
      modal.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
  }

  /* ------------------------------------------------------------
   * Scrollspy — highlight active category pill while scrolling.
   * Only toggles the active class; horizontal centering only
   * happens on an explicit category tap (scrollNavToActive).
   * ------------------------------------------------------------ */
  var catLinks = Array.prototype.slice.call(document.querySelectorAll('.category-list a'));
  var catSections = catLinks
  .map(function (a) { return document.querySelector(a.getAttribute('href')); })
  .filter(Boolean);

  function setActiveCat(id) {
    catLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
    });
  }

  function scrollNavToActive(id) {
    var activeLink = null;
    for (var i = 0; i < catLinks.length; i++) {
      if (catLinks[i].getAttribute('href') === '#' + id) {
        activeLink = catLinks[i];
        break;
      }
    }
    if (!activeLink) return;
    var nav = activeLink.closest('.category-list');
    if (!nav) return;
    var targetLeft = activeLink.offsetLeft - (nav.clientWidth / 2) + (activeLink.clientWidth / 2);
    nav.scrollTo({
      left: targetLeft,
      behavior: prefersReduced ? 'auto' : 'smooth'
    });
  }

  if ('IntersectionObserver' in window && catSections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveCat(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    catSections.forEach(function (sec) { spy.observe(sec); });
  }

  /* ------------------------------------------------------------
   * Reveal on scroll (skipped entirely for reduced-motion users).
   * Only section-level elements are observed — this keeps the
   * observer workload tiny (~6 targets instead of ~60).
   * ------------------------------------------------------------ */
  if ('IntersectionObserver' in window && !prefersReduced) {
    var revealEls = document.querySelectorAll('.menu-section, .contact-section, .site-footer');
    revealEls.forEach(function (el) { el.classList.add('reveal'); });
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------
   * Footer year
   * ------------------------------------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------
   * Smooth-scroll fallback for anchor links
   * ------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id.length < 2) return;

      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'start'
      });

      if (link.closest('.category-list')) {
        setActiveCat(id.slice(1));
        scrollNavToActive(id.slice(1));
      }

      try {
        if (history.pushState) history.pushState(null, '', id);
        else window.location.hash = id;
      } catch (err) { /* file:// or sandboxed contexts */ }
    });
  });

  /* ------------------------------------------------------------
   * Init
   * ------------------------------------------------------------ */
  applyLanguage('hinglish');
})();
