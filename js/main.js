/* SuirViewDigital — interactions */
(function () {
  'use strict';

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
