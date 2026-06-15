/* Clean Guard — main.js
   Nav toggle · Scroll animations · Form validation
   Exposes window.CleanGuard for per-page form hooks. */

(function () {
  'use strict';

  /* ── Nav toggle (hamburger) ── */
  function initNav() {
    const toggle = document.getElementById('nav-toggle');
    const nav    = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού');
    });

    // Close when a nav link is clicked
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close when clicking outside
    document.addEventListener('click', e => {
      if (
        document.body.classList.contains('nav-open') &&
        !toggle.contains(e.target) &&
        !nav.contains(e.target)
      ) {
        closeNav();
      }
    });

    function closeNav() {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Άνοιγμα μενού');
    }

    // Mark active page link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ── Scroll animations (IntersectionObserver) ── */
  function initScrollAnimations() {
    const targets = document.querySelectorAll('[data-animate]');
    if (!targets.length) return;

    // If reduced motion is preferred, skip animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach(el => el.classList.add('animate-in'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach(el => observer.observe(el));
  }

  /* ── Form validation ── */

  /**
   * Validate a single field. Marks `.has-error` on parent `.form-group`.
   * Returns true if valid.
   */
  function validateField(input) {
    const group = input.closest('.form-group');
    const errorEl = group ? group.querySelector('.form-error') : null;
    let valid = true;
    let message = '';

    if (input.hasAttribute('required') && !input.value.trim()) {
      valid = false;
      message = 'Αυτό το πεδίο είναι υποχρεωτικό.';
    } else if (input.type === 'email' && input.value.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(input.value.trim())) {
        valid = false;
        message = 'Παρακαλώ εισάγετε έγκυρη διεύθυνση email.';
      }
    } else if (input.type === 'tel' && input.value.trim()) {
      const telRe = /^[\d\s\+\-\(\)]{7,}$/;
      if (!telRe.test(input.value.trim())) {
        valid = false;
        message = 'Παρακαλώ εισάγετε έγκυρο αριθμό τηλεφώνου.';
      }
    }

    if (group) group.classList.toggle('has-error', !valid);
    if (errorEl) errorEl.textContent = message;
    if (input.classList) input.classList.toggle('invalid', !valid);

    return valid;
  }

  /**
   * Validate all fields in a form. Returns true if the whole form is valid.
   */
  function validateForm(formEl) {
    const fields = formEl.querySelectorAll('input, textarea, select');
    let allValid = true;
    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });
    return allValid;
  }

  /**
   * Attach live validation + submit guard to a form.
   * Pass a successCallback(formEl) for post-submit handling.
   */
  function initFormValidation(formEl, successCallback) {
    if (!formEl) return;

    // Live validation on blur
    formEl.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) validateField(field);
      });
    });

    formEl.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(formEl)) {
        if (typeof successCallback === 'function') successCallback(formEl);
      } else {
        // Focus first invalid field for accessibility
        const firstInvalid = formEl.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  /* ── Bootstrap ── */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initScrollAnimations();
  });

  /* ── Public API (for per-page use) ── */
  window.CleanGuard = { validateForm, initFormValidation, validateField };
})();
