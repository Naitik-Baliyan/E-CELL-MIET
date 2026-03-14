document.addEventListener('DOMContentLoaded', () => {

  // ─── Header Scroll Effect ──────────────────────────────────────────────
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
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
