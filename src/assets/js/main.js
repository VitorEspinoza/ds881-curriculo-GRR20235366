document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navList.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const navLinks = document.querySelectorAll('.nav-link');
  const linkBySectionId = new Map();
  navLinks.forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    linkBySectionId.set(id, link);
  });

  const sections = document.querySelectorAll('main section[id], footer[id]');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkBySectionId.get(entry.target.id);
        if (!link || !entry.isIntersecting) {
          return;
        }
        navLinks.forEach((navLink) => navLink.classList.remove('is-active'));
        link.classList.add('is-active');
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  const themeToggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  const THEME_STORAGE_KEY = 'theme';

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
      themeToggle.textContent = theme === 'dark' ? 'Tema claro' : 'Tema escuro';
    }
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    });
  }
});
