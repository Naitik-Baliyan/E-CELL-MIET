// ─── WAVE CANVAS ANIMATION ───────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('wave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Resize canvas to fill viewport
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Wave configuration — E-Cell brand palette
  // Red, crimson, orange-red, rose — all cohesive with the brand primary #f41f48
  const waves = [
    { color: '#f41f48', amplitude: 160, frequency: 0.006, speed: 0.012, offsetY: 0.52, lines: 30, spread: 3.5 },   // Brand red
    { color: '#ff6030', amplitude: 130, frequency: 0.007, speed: 0.009, offsetY: 0.48, lines: 25, spread: 3.2 },   // Orange-red
    { color: '#c0143c', amplitude: 180, frequency: 0.005, speed: 0.015, offsetY: 0.55, lines: 28, spread: 4.0 },   // Deep crimson
    { color: '#ff2d6b', amplitude: 110, frequency: 0.008, speed: 0.010, offsetY: 0.45, lines: 20, spread: 2.8 },   // Rose-red
  ];

  let tick = 0;

  function drawWave(wave) {
    const { color, amplitude, frequency, speed, offsetY, lines, spread } = wave;

    for (let i = 0; i < lines; i++) {
      const alpha = (1 - i / lines) * 0.55 + 0.05;  // Fade towards edges
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 0.8;

      const yBase = canvas.height * offsetY + (i - lines / 2) * spread;
      const phaseShift = i * 0.12;

      for (let x = 0; x <= canvas.width; x += 2) {
        const y = yBase + Math.sin((x * frequency) + tick * speed + phaseShift) * amplitude
                        + Math.sin((x * frequency * 0.5) + tick * speed * 0.7 + phaseShift) * (amplitude * 0.4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    waves.forEach(drawWave);

    ctx.globalAlpha = 1;
    tick++;
    requestAnimationFrame(animate);
  }

  animate();
})();

// ─── HEADER SCROLL ───────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (!header) return;
  if (window.scrollY > 60) {
    header.style.background = 'rgba(10, 10, 10, 0.98)';
  } else {
    header.style.background = 'var(--bg-glass)';
  }
});

// ─── STATS COUNTER ANIMATION ──────────────────────────────────────────────────
const counters = document.querySelectorAll('.counter');
const animationSpeed = 40; // The higher the number, the slower the animation

const countObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        
        const updateCount = () => {
          const count = +counter.innerText;
          // Calculate increment based on target size to ensure they all finish around the same time
          const inc = target / animationSpeed;

          if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 25);
          } else {
            counter.innerText = target;
          }
        };

        updateCount();
        observer.unobserve(counter); // Only run once
      }
    });
  },
  { threshold: 0.5 } // Trigger when 50% visible
);

counters.forEach(counter => {
  countObserver.observe(counter);
});

// ─── MODAL LOGIC ──────────────────────────────────────────────────────────────
const modalBtns = document.querySelectorAll('.collab-cta');
const modals = document.querySelectorAll('.modal-overlay');
const closeBtns = document.querySelectorAll('.modal-close');

modalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  });
});

closeBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal-overlay');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restore scrolling
    }
  });
});

// Close modal when clicking outside the content
modals.forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
});
