/* BR0.0% site JS (vanilla, frontend-only) */

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year in footer
  document.addEventListener('DOMContentLoaded', () => {
    const year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());

    // Newsletter (simple validation + toast-like note)
    const form = $('#newsletterForm');
    const email = $('#newsletterEmail');
    const note = $('#newsletterNote');

    if (form && email) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = (email.value || '').trim();
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        email.classList.toggle('input-error', !ok);
        if (note) {
          note.textContent = ok
            ? "You're in. We'll email you the next drop."
            : "Please enter a valid email address.";
          note.style.color = ok ? 'rgba(52,211,153,.95)' : '#fb7185';
        }
        if (ok) email.value = '';
      });
    }

    // Contact form validation (Contact page only)
    const cform = $('#contactForm');
    if (cform) {
      const status = $('#contactStatus');
      const fields = {
        name: $('#cName'),
        email: $('#cEmail'),
        message: $('#cMessage')
      };

      const setError = (el, msg) => {
        if (!el) return;
        el.classList.add('input-error');
        let err = el.parentElement.querySelector('.error-text');
        if (!err) {
          err = document.createElement('div');
          err.className = 'error-text';
          el.parentElement.appendChild(err);
        }
        err.textContent = msg;
      };

      const clearError = (el) => {
        if (!el) return;
        el.classList.remove('input-error');
        const err = el.parentElement.querySelector('.error-text');
        if (err) err.remove();
      };

      $$('.contact-form input, .contact-form textarea').forEach((el) => {
        el.addEventListener('input', () => clearError(el));
      });

      cform.addEventListener('submit', (e) => {
        e.preventDefault();
        let ok = true;

        const nameVal = (fields.name?.value || '').trim();
        const emailVal = (fields.email?.value || '').trim();
        const msgVal = (fields.message?.value || '').trim();

        if (nameVal.length < 2) {
          ok = false;
          setError(fields.name, 'Please enter your name.');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          ok = false;
          setError(fields.email, 'Please enter a valid email.');
        }

        if (msgVal.length < 10) {
          ok = false;
          setError(fields.message, 'Message should be at least 10 characters.');
        }

        if (!ok) {
          if (status) {
            status.textContent = 'Check the form — a few details are missing.';
            status.className = 'error-text';
          }
          return;
        }

        if (status) {
          status.textContent = "Message sent (demo). We'll get back to you soon.";
          status.className = 'success';
        }

        cform.reset();
      });
    }

    // Light scroll-reveal for BR sections
    const revealTargets = $$('.flavour-card, .story-block, .community-card, .shop-card');
    if (revealTargets.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealTargets.forEach((el) => io.observe(el));
    }
  });
})();
