document.addEventListener('DOMContentLoaded', () => {
  /* ─── Global State & Config ────────────────────────────────────────────── */
  const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  document.body.appendChild(cursor);

  // Custom Cursor Variables
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  /* ─── Cursor Follow (Inertia Based) ─────────────────────────────────────── */
  if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    });

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.querySelectorAll('a, button, .team-card, .logo-container').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
      el.addEventListener('mousedown', () => cursor.classList.add('clicking'));
      el.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
    });
  }

  /* ─── Magnetic Interaction (Buttons, Logo, Hamburger) ──────────────────── */
  if (!isMobile) {
    const magneticItems = document.querySelectorAll('.btn, .theme-toggle, .logo-container, .magnetic-wrap, .hamburger');

    magneticItems.forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        item.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;

        const icon = item.querySelector('svg, .theme-icon, span');
        if (icon && icon !== item) {
          icon.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        }
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = '';
        const icon = item.querySelector('svg, .theme-icon, span');
        if (icon && icon !== item) icon.style.transform = '';
      });
    });
  }

  // ─── Dark Mode Toggle (Circular Reveal) ──────────────────────────────────
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = toggleBtn ? toggleBtn.querySelector('.theme-icon') : null;
  const html = document.documentElement;
  const revealDiv = document.createElement('div');
  revealDiv.id = 'theme-reveal-circle';
  document.body.appendChild(revealDiv);

  const savedTheme = localStorage.getItem('ecell-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  if (themeIcon) themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = html.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      const rect = toggleBtn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      revealDiv.style.clipPath = `circle(0% at ${x}px ${y}px)`;
      revealDiv.style.background = newTheme === 'dark' ? 'hsl(0, 0%, 4%)' : 'hsl(45, 12%, 96%)';
      revealDiv.style.opacity = '1';

      requestAnimationFrame(() => {
        revealDiv.style.clipPath = `circle(150% at ${x}px ${y}px)`;
      });

      setTimeout(() => {
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('ecell-theme', newTheme);
        if (themeIcon) themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        setTimeout(() => {
          revealDiv.style.opacity = '0';
          revealDiv.style.clipPath = `circle(0% at ${x}px ${y}px)`;
        }, 300);
      }, 500);
    });
  }

  // ─── Typewriter Effect ─────────────────────────────────────────────────
  const words = ['Build.', 'Launch.', 'Innovate.', 'Succeed.', 'Scale.', 'Disrupt.'];
  const wordEl = document.getElementById('typewriter-word');
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function typeStep() {
    if (!wordEl) return;
    const current = words[wordIndex];
    if (isPaused) {
      isPaused = false;
      isDeleting = true;
      setTimeout(typeStep, 1100);
      return;
    }
    if (!isDeleting) {
      charIndex++;
      wordEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(typeStep, 80);
        return;
      }
      setTimeout(typeStep, 95 + Math.random() * 40);
    } else {
      charIndex--;
      wordEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeStep, 400);
        return;
      }
      setTimeout(typeStep, 50 + Math.random() * 30);
    }
  }
  setTimeout(typeStep, 2200);

  // ─── Header & Scroll Effects ──────────────────────────────────────────
  const header = document.querySelector('header');
  const scrollBar = document.getElementById('scroll-progress-bar');
  const backToTop = document.createElement('div');
  backToTop.id = 'back-to-top';
  backToTop.innerHTML = '↑';
  backToTop.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    header.classList.toggle('scrolled', scrollTop > 50);
    if (scrollBar) scrollBar.style.width = scrollPercent + '%';
    if (scrollTop > 500) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');

    // Subtle Parallax for Bento Cards
    document.querySelectorAll('.bento-card').forEach(card => {
      const depth = 0.05;
      card.style.transform = `translateY(${scrollTop * depth}px)`;
    });
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Reveal Animation on Scroll ───────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Stop observing once visible
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  function initReveal() {
    const revealedItems = document.querySelectorAll('.reveal');
    revealedItems.forEach(el => revealObserver.observe(el));
  }
  
  initReveal();
  // Double check after a short delay for dynamically loaded content/images
  setTimeout(initReveal, 500); 
  window.addEventListener('scroll', () => { 
    // Manual trigger for edge cases
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('visible');
    });
  }, { passive: true });

  // ─── 3D Card Tilt ──────────────────────────────────────────────────────
  if (!isMobile) {
    document.querySelectorAll('.tilt-card, .team-card').forEach(card => {
      const MAX_TILT = 8;
      const MAX_LIFT = -10;
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        card.style.setProperty('--mouseX', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--mouseY', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        card.style.transform = `perspective(1000px) rotateX(${-dy * MAX_TILT}deg) rotateY(${dx * MAX_TILT}deg) translateY(${MAX_LIFT}px)`;
        card.style.boxShadow = `0 35px 90px -20px rgba(0,0,0,0.25), ${-dx * 6}px ${dy * 6}px 45px rgba(232,0,29,0.15)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  // ─── Mobile Menu ───────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        nav.classList.remove('open');
      });
    });
  }

  // ─── Smooth Scroll Links ───────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ─── Stat Counter Animation ─────────────────────────────────────────────
  const counters = document.querySelectorAll('.stat-number');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetText = entry.target.getAttribute('data-target') || entry.target.textContent.replace('+', '');
        const target = parseInt(targetText);
        const duration = 2000;
        let startTime = null;
        const animate = (ts) => {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          entry.target.textContent = Math.floor(progress * target) + (entry.target.getAttribute('data-suffix') || '+');
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObserver.observe(c));
});
