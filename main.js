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
      // Linear interpolation (lerp) for smooth following
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover state tracking
    document.querySelectorAll('a, button, .team-card, .logo-container').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
      el.addEventListener('mousedown', () => cursor.classList.add('clicking'));
      el.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
    });
  }

  /* ─── Magnetic Attraction Logic ────────────────────────────────────────── */
  if (!isMobile) {
    const magneticElements = document.querySelectorAll('.btn, .logo-container, .hamburger, .theme-toggle');
    
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distDeltaX = (e.clientX - centerX) * 0.45;
        const distDeltaY = (e.clientY - centerY) * 0.45;

        el.style.transform = `translate3d(${distDeltaX}px, ${distDeltaY}px, 0) scale(1.05)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = `translate3d(0, 0, 0) scale(1)`;
      });
    });
  }

  // ─── Dark Mode Toggle (Circular Reveal) ──────────────────────────────────
  const toggleBtn  = document.getElementById('theme-toggle');
  const themeIcon  = toggleBtn ? toggleBtn.querySelector('.theme-icon') : null;
  const html       = document.documentElement;

  // Create the reveal element
  const revealDiv = document.createElement('div');
  revealDiv.id = 'theme-reveal-circle';
  document.body.appendChild(revealDiv);

  // Apply saved preference immediately
  const savedTheme = localStorage.getItem('ecell-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  if (themeIcon) themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark   = html.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      
      const rect = toggleBtn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Prepare reveal overlay
      revealDiv.style.clipPath = `circle(0% at ${x}px ${y}px)`;
      revealDiv.style.background = newTheme === 'dark' ? 'hsl(0, 0%, 4%)' : 'hsl(45, 12%, 96%)';
      revealDiv.style.opacity = '1';
      
      requestAnimationFrame(() => {
        revealDiv.style.clipPath = `circle(150% at ${x}px ${y}px)`;
      });

      // Halfway through, swap the real theme
      setTimeout(() => {
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('ecell-theme', newTheme);
        if (themeIcon) themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        
        // Retract reveal
        setTimeout(() => {
          revealDiv.style.opacity = '0';
          revealDiv.style.clipPath = `circle(0% at ${x}px ${y}px)`;
        }, 300);
      }, 500);
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

  // ─── 3D Card Tilt & Interactive Light ────────────────────────────────
  const tiltCards = document.querySelectorAll('.tilt-card, .team-member');

  tiltCards.forEach(card => {
    const MAX_TILT = 8;
    const MAX_LIFT = -12;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;

      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      const rotX = -dy * MAX_TILT;
      const rotY =  dx * MAX_TILT;

      const px = ((e.clientX - rect.left) / rect.width)  * 100;
      const py = ((e.clientY - rect.top)  / rect.height) * 100;

      // Update CSS variables for the spotlight effect in style.css
      card.style.setProperty('--mouseX', `${px}%`);
      card.style.setProperty('--mouseY', `${py}%`);

      card.style.transform =
        `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${MAX_LIFT}px)`;
      card.style.boxShadow =
        `0 30px 80px -15px rgba(0,0,0,0.22),
         ${-rotY * 2}px ${rotX * 2}px 40px rgba(232,0,29,0.12)`;

      let glare = card.querySelector('.card-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-glare';
        glare.style.cssText = `
          position:absolute; inset:0; border-radius:inherit;
          pointer-events:none; z-index:1; transition:opacity 0.4s ease;
        `;
        card.appendChild(glare);
      }
      glare.style.background =
        `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.25) 0%, transparent 65%)`;
      glare.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      const glare = card.querySelector('.card-glare');
      if (glare) glare.style.opacity = '0';
    });
  });

  // ─── Magnetic Buttons Interaction ─────────────────────────────────────
  const magneticItems = document.querySelectorAll('.btn, .theme-toggle, .logo-container');

  magneticItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Magnetic pull: move toward cursor by 35% of the distance
      item.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
      
      // If it has an icon, move it slightly more for a layered effect
      const icon = item.querySelector('svg, .theme-icon');
      if (icon) {
        icon.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      }
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      const icon = item.querySelector('svg, .theme-icon');
      if (icon) icon.style.transform = '';
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
