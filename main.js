document.addEventListener('DOMContentLoaded', () => {

  // ─── Dark Mode Toggle ──────────────────────────────────────────────────
  const toggleBtn  = document.getElementById('theme-toggle');
  const themeIcon  = toggleBtn ? toggleBtn.querySelector('.theme-icon') : null;
  const html       = document.documentElement;

  // Apply saved preference immediately (avoids flash on reload)
  const savedTheme = localStorage.getItem('ecell-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  if (themeIcon) themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark   = html.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('ecell-theme', newTheme);

      // Animated icon swap
      if (themeIcon) {
        themeIcon.style.transform = 'rotate(360deg) scale(0.5)';
        setTimeout(() => {
          themeIcon.textContent    = newTheme === 'dark' ? '☀️' : '🌙';
          themeIcon.style.transform = '';
        }, 220);
      }
    });
  }

  // ─── Typewriter Effect ─────────────────────────────────────────────────
  const words    = ['Disrupt.', 'Innovate.', 'Scale.', 'Lead.', 'Dream.', 'Launch.'];
  const wordEl   = document.getElementById('typewriter-word');
  let wordIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let isPaused   = false;

  function typeStep() {
    if (!wordEl) return;
    const current = words[wordIndex];

    if (isPaused) {
      isPaused   = false;
      isDeleting = true;
      setTimeout(typeStep, 1100);   // pause at full word before deleting
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
      setTimeout(typeStep, 90 + Math.random() * 45);  // 90–135ms, feels human
    } else {
      charIndex--;
      wordEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex  = (wordIndex + 1) % words.length;
        setTimeout(typeStep, 320);  // brief gap before next word
        return;
      }
      setTimeout(typeStep, 45 + Math.random() * 25);  // faster on delete
    }
  }

  // Start after hero entrance animation has finished settling
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

    // Header compacting
    header.classList.toggle('scrolled', scrollTop > 50);

    // Progress bar
    if (scrollBar) scrollBar.style.width = scrollPercent + '%';

    // Back to top visibility
    if (scrollTop > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Reveal Animation on Scroll ───────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ─── 3D Card Tilt Effect ───────────────────────────────────────────────
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    const MAX_TILT = 8;    // degrees
    const MAX_LIFT = -12;  // px rise

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;

      const dx = (e.clientX - cx) / (rect.width  / 2);  // -1 → +1
      const dy = (e.clientY - cy) / (rect.height / 2);  // -1 → +1

      const rotX = -dy * MAX_TILT;
      const rotY =  dx * MAX_TILT;

      // Calculate glare position
      const glareX = ((e.clientX - rect.left) / rect.width)  * 100;
      const glareY = ((e.clientY - rect.top)  / rect.height) * 100;

      card.style.transform =
        `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${MAX_LIFT}px)`;
      card.style.boxShadow =
        `0 30px 70px -15px rgba(0,0,0,0.18),
         ${-rotY * 1.5}px ${rotX}px 30px rgba(232,0,29,0.10)`;

      // Glare overlay
      let glare = card.querySelector('.card-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-glare';
        glare.style.cssText = `
          position:absolute; inset:0; border-radius:inherit;
          pointer-events:none; z-index:1; transition:opacity 0.3s ease;
        `;
        card.style.position = 'relative';
        card.appendChild(glare);
      }
      glare.style.background =
        `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22) 0%, transparent 60%)`;
      glare.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform =
        'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.boxShadow = '';
      const glare = card.querySelector('.card-glare');
      if (glare) glare.style.opacity = '0';
    });
  });

  // ─── Mobile Menu ───────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('main-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      nav.classList.toggle('open');
    });

    // Close nav on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        nav.classList.remove('open');
      });
    });
  }

  // ─── Smooth Scroll ─────────────────────────────────────────────────────
  const mainContent = document.querySelector('main');
  if (mainContent) mainContent.id = 'main-content';

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── Stat Counter Animation ─────────────────────────────────────────────
  const counters = document.querySelectorAll('.stat-number');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target   = parseInt(entry.target.getAttribute('data-target'));
        const duration = 2200;
        let startTime  = null;

        const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

        const animate = (ts) => {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          const eased    = easeOutExpo(progress);
          entry.target.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(animate);
          else entry.target.textContent = target;
        };

        requestAnimationFrame(animate);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  counters.forEach(c => countObserver.observe(c));

  // ─── Active Nav Link on Scroll ─────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('nav a[href^="#"]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));
});
