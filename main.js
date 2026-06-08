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
