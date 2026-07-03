/* SuirViewDigital — interactions */
(function () {
  'use strict';

  // ===== Cal.com "Book a Call" scheduler =====================================
  // To activate: create a Cal.com event type, connect Google Calendar, then set
  // CAL_LINK below to your booking path e.g. 'luke-richard/intro-call'.
  // While it stays as the placeholder, the Book a Call buttons simply scroll to
  // the contact form (their href="#contact" fallback) — nothing breaks.
  var CAL_LINK = 'YOUR_CAL_LINK';        // <-- change this one line to go live
  var CAL_NAMESPACE = 'intro-call';
  if (CAL_LINK && CAL_LINK.indexOf('YOUR_CAL_LINK') === -1) {
    // Official Cal.com embed loader
    (function (C, A, L) {
      var p = function (a, ar) { a.q.push(ar); };
      var d = C.document;
      C.Cal = C.Cal || function () {
        var cal = C.Cal, ar = arguments;
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; }
        if (ar[0] === L) {
          var api = function () { p(api, arguments); };
          var namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); }
          else { p(cal, ar); }
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    Cal('init', CAL_NAMESPACE, { origin: 'https://cal.com' });
    Cal.ns[CAL_NAMESPACE]('ui', { hideEventTypeDetails: false, layout: 'month_view' });

    // Point the Book a Call buttons at the popup scheduler
    document.querySelectorAll('.book-call').forEach(function (btn) {
      btn.setAttribute('data-cal-namespace', CAL_NAMESPACE);
      btn.setAttribute('data-cal-link', CAL_LINK);
      btn.setAttribute('data-cal-config', '{"layout":"month_view"}');
    });
  }

  // Header shadow on scroll
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.hasAttribute('hidden');
      if (open) { menu.removeAttribute('hidden'); }
      else { menu.setAttribute('hidden', ''); }
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.setAttribute('hidden', '');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll reveal — driven by a reliable scroll/load handler (works everywhere,
  // no dependency on IntersectionObserver, which some renderers never fire).
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  reveals.forEach(function (el, i) {
    el.style.transitionDelay = (Math.min(i % 3, 2) * 0.08) + 's'; // gentle stagger
  });

  var ticking = false;
  function checkReveals() {
    ticking = false;
    var trigger = window.innerHeight * 0.92;
    for (var i = reveals.length - 1; i >= 0; i--) {
      var el = reveals[i];
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add('in');
        reveals.splice(i, 1); // stop tracking once revealed
      }
    }
  }
  function onRevealScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(checkReveals); }
  }
  window.addEventListener('scroll', onRevealScroll, { passive: true });
  window.addEventListener('resize', onRevealScroll, { passive: true });
  window.addEventListener('load', checkReveals);
  checkReveals(); // reveal anything already in view on first paint

  // Absolute safety net: never leave content invisible.
  setTimeout(function () {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }, 2500);

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Contact form — submits to Formspree (form action) via fetch.
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (form) {
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();

      if (!name || !email || !message) {
        setStatus('Please fill in your name, email and message.', 'err');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus('Please enter a valid email address.', 'err');
        return;
      }

      // Guard: if the Formspree endpoint hasn't been set yet, don't pretend it sent.
      var action = form.getAttribute('action') || '';
      if (action.indexOf('YOUR_FORM_ID') !== -1 || action.indexOf('formspree.io/f/') === -1) {
        setStatus('Enquiries aren’t connected yet — please call 085 153 8421 or email Lukedigital489@gmail.com.', 'err');
        return;
      }

      setStatus('Sending…', 'ok');
      submitBtn.disabled = true;

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          setStatus('Thanks, ' + name + ' — I’ll be in touch shortly.', 'ok');
          form.reset();
        } else {
          return res.json().then(function (data) {
            var msg = (data && data.errors && data.errors.length)
              ? data.errors.map(function (er) { return er.message; }).join(', ')
              : 'Something went wrong. Please call 085 153 8421 or email Lukedigital489@gmail.com.';
            setStatus(msg, 'err');
          });
        }
      }).catch(function () {
        setStatus('Couldn’t send just now — please call 085 153 8421 or email Lukedigital489@gmail.com.', 'err');
      }).then(function () {
        submitBtn.disabled = false;
      });
    });

    function setStatus(text, type) {
      status.textContent = text;
      status.className = 'form-status ' + type;
    }
  }
})();
