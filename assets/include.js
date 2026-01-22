document.addEventListener('DOMContentLoaded', async () => {
  const nodes = Array.from(document.querySelectorAll('[data-include]'));
  await Promise.all(nodes.map(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      el.outerHTML = await res.text();
    } catch (e) {
      console.error('Include failed for', url, e);
    }
  }));

  const toPath = (href) => {
    try { return new URL(href, window.location.origin).pathname; }
    catch { return href || '/'; }
  };
  const normalize = (path) => {
    if (!path) return '/';
    let p = path.split('?')[0].split('#')[0];
    if (!p.startsWith('/')) p = '/' + p;
    if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
    if (p.toLowerCase() === '/index.html' || p.toLowerCase() === '/index') p = '/';
    return p;
  };
  const current = normalize(window.location.pathname);
  document.querySelectorAll('.nav-links a').forEach(a => {
    const hrefPath = normalize(toPath(a.getAttribute('href')));
    if (current === hrefPath || (current === '/' && (hrefPath === '/' || hrefPath === '/index.html'))) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  const initMobileMenu = () => {
    const btn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    if (!btn || !menu) return;

    btn.__bound && btn.removeEventListener('click', btn.__bound);
    const onToggle = () => {
      menu.classList.toggle('active');
      btn.setAttribute('aria-expanded', menu.classList.contains('active'));
    };
    btn.addEventListener('click', onToggle);
    btn.__bound = onToggle;

    document.__navOutside && document.removeEventListener('click', document.__navOutside);
    const onDocClick = (e) => {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.remove('active');
        btn.setAttribute('aria-expanded','false');
      }
    };
    document.addEventListener('click', onDocClick);
    document.__navOutside = onDocClick;

    if (navbar) {
      window.__navScroll && window.removeEventListener('scroll', window.__navScroll);
      const onScroll = () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
      };
      window.addEventListener('scroll', onScroll);
      window.__navScroll = onScroll;
      onScroll();
    }
  };

  initMobileMenu();
});