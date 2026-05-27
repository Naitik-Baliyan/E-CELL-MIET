(function () {
  /* -- 1. Session guard -- */
  if (sessionStorage.getItem('ecell_preloader_done')) return;

  /* -- 2. Inject styles -- */
  const style = document.createElement('style');
  style.textContent = `
    #ecell-preloader *,
    #ecell-preloader *::before,
    #ecell-preloader *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* Hide main content while preloading, but keep the 3D canvas visible */
    body.ecell-preloading > *:not(#ecell-preloader):not(#three-canvas):not(#noise-overlay):not(script):not(style) {
      opacity: 0 !important;
      pointer-events: none !important;
      transition: opacity 1.5s ease;
    }

    #ecell-preloader {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), 
                  visibility 1s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #ecell-preloader.fade-out {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    #ecell-skip-btn {
      position: absolute;
      top: 22px;
      right: 24px;
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.18);
      padding: 7px 18px;
      border-radius: 999px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.04em;
      cursor: pointer;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: background 0.25s, color 0.25s, border-color 0.25s, transform 0.15s;
      z-index: 10001;
    }

    #ecell-skip-btn:hover {
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.35);
      transform: translateY(-1px);
    }

    #ecell-scroll-hint {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,0.4);
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      z-index: 10000;
      pointer-events: none;
      animation: pulseHint 2.5s infinite ease-in-out;
    }

    @keyframes pulseHint {
      0%, 100% { opacity: 0.2; transform: translate(-50%, 0); }
      50% { opacity: 0.8; transform: translate(-50%, -5px); }
    }

    /* 3D Scene */
    #ecell-3d-scene {
      position: absolute;
      inset: 0;
      perspective: 1000px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.3); /* Semi-transparent to reveal background */
    }

    #ecell-3d-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      transform-style: preserve-3d;
      will-change: transform;
    }

    .ecell-card {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 600px;
      height: 800px;
      border-radius: 24px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(255,255,255,0.02);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      display: flex;
      align-items: center;
      justify-content: center;
      will-change: transform, opacity;
      transform-origin: center center;
    }

    .ecell-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 24px;
      pointer-events: none;
      box-shadow: inset 0 0 20px rgba(232, 0, 29, 0.1);
    }

    .ecell-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.75;
      transition: opacity 0.5s;
    }

    /* Final Logo Card */
    .ecell-card.logo-card {
      background: rgba(0, 0, 0, 0.4);
      border-color: rgba(232, 0, 29, 0.3);
      box-shadow: 0 0 100px rgba(232, 0, 29, 0.15);
    }

    .ecell-card.logo-card img {
      width: 60%;
      height: auto;
      object-fit: contain;
      opacity: 1;
      filter: drop-shadow(0 0 20px rgba(255,255,255,0.2));
    }

    /* Editorial Typography */
    .ecell-card-text {
      position: absolute;
      bottom: 40px;
      left: 40px;
      color: #fff;
      font-family: 'Space Grotesk', sans-serif;
      z-index: 10;
      text-align: left;
    }
    .ecell-card-text h2 {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.15em;
      margin: 0 0 6px 0;
      text-transform: uppercase;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }
    .ecell-card-text p {
      font-size: 13px;
      font-weight: 400;
      opacity: 0.6;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0;
    }

    /* Progress Indicator */
    #ecell-progress-container {
      position: absolute;
      right: 40px;
      top: 50%;
      transform: translateY(-50%);
      width: 2px;
      height: 200px;
      background: rgba(255, 255, 255, 0.1);
      z-index: 10000;
      border-radius: 2px;
      pointer-events: none;
    }
    #ecell-progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0%;
      background: #e8001d;
      border-radius: 2px;
      box-shadow: 0 0 15px rgba(232, 0, 29, 0.6);
      will-change: height;
    }

    @media (max-width: 768px) {
      .ecell-card {
        width: 360px;
        height: 540px;
      }
    }
  `;
  document.head.appendChild(style);

  /* -- 3. Build DOM -- */
  const overlay = document.createElement('div');
  overlay.id = 'ecell-preloader';

  const skipBtn = document.createElement('button');
  skipBtn.id = 'ecell-skip-btn';
  skipBtn.textContent = 'Skip';
  overlay.appendChild(skipBtn);

  const hint = document.createElement('div');
  hint.id = 'ecell-scroll-hint';
  hint.textContent = 'Scroll to Enter';
  overlay.appendChild(hint);

  // Progress Bar
  const progContainer = document.createElement('div');
  progContainer.id = 'ecell-progress-container';
  const progBar = document.createElement('div');
  progBar.id = 'ecell-progress-bar';
  progContainer.appendChild(progBar);
  overlay.appendChild(progContainer);

  const scene = document.createElement('div');
  scene.id = 'ecell-3d-scene';
  const container = document.createElement('div');
  container.id = 'ecell-3d-container';
  scene.appendChild(container);
  overlay.appendChild(scene);

  // Gallery images leading up to the logo
  const cardsData = [
    { src: 'assets/events/event-4.jpeg', title: '01 / ENDEAVOR', subtitle: 'The Beginning' },
    { src: 'assets/events/event-10.jpeg', title: '02 / HACKATHON', subtitle: 'Code & Build' },
    { src: 'assets/events/event-3.jpeg', title: '03 / IDEATION', subtitle: 'Shaping Futures' },
    { src: 'assets/events/event-18.jpeg', title: '04 / SUMMIT', subtitle: 'Annual Gathering' },
    { src: 'assets/events/event-1.jpeg', title: '05 / VISION', subtitle: 'Looking Ahead' },
    { src: 'logo.jpg', title: '', subtitle: '' } // Final card
  ];

  const cards = [];
  const zSpacing = 1600; // Distance between cards
  const startZ = -1000;  // Initial offset for the first card
  const maxScroll = cardsData.length * zSpacing;

  cardsData.forEach((data, i) => {
    const card = document.createElement('div');
    card.className = 'ecell-card' + (i === cardsData.length - 1 ? ' logo-card' : '');
    const img = document.createElement('img');
    img.src = data.src;
    card.appendChild(img);

    // Add Typography
    if (data.title) {
      const textWrap = document.createElement('div');
      textWrap.className = 'ecell-card-text';
      const title = document.createElement('h2');
      title.textContent = data.title;
      const subtitle = document.createElement('p');
      subtitle.textContent = data.subtitle;
      textWrap.appendChild(title);
      textWrap.appendChild(subtitle);
      card.appendChild(textWrap);
    }

    container.appendChild(card);

    // Center all cards perfectly in the middle
    const finalX = 0;
    const finalY = 0;

    // Base Z position (gets deeper as index increases)
    const bZ = startZ - (i * zSpacing);

    cards.push({ el: card, offsetX: finalX, offsetY: finalY, baseZ: bZ });
  });

  /* -- 4. Scroll & Interaction Logic -- */
  let scrollProgress = 0;
  let targetProgress = 0;
  let isDismissing = false;

  // Disable body scroll while preloader is active
  const preventScroll = (e) => e.preventDefault();
  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });
  document.body.classList.add('ecell-preloading');
  document.body.style.overflow = 'hidden';

  function dismiss() {
    if (isDismissing) return;
    isDismissing = true;

    sessionStorage.setItem('ecell_preloader_done', '1');
    overlay.classList.add('fade-out');
    document.body.style.overflow = '';
    document.body.classList.remove('ecell-preloading');

    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', handleTouchMove);

    overlay.addEventListener('transitionend', () => {
      overlay.remove();
      style.remove();
    });
  }

  skipBtn.addEventListener('click', dismiss);

  function handleWheel(e) {
    if (isDismissing) return;
    targetProgress += e.deltaY * 2.5; // Sensitivity
    if (targetProgress < 0) targetProgress = 0;
  }

  let touchStartY = 0;
  function handleTouchStart(e) {
    if (isDismissing) return;
    touchStartY = e.touches[0].clientY;
  }
  function handleTouchMove(e) {
    if (isDismissing) return;
    const deltaY = touchStartY - e.touches[0].clientY;
    targetProgress += deltaY * 5;
    if (targetProgress < 0) targetProgress = 0;
    touchStartY = e.touches[0].clientY;
  }

  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('touchstart', handleTouchStart, { passive: false });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });

  // Mouse move for 3D tilt
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    if (isDismissing) return;
    // Map mouse position to -1 to 1
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* -- 5. Render Loop -- */
  function render() {
    if (isDismissing) return;

    // Smooth interpolation for scroll and mouse
    scrollProgress += (targetProgress - scrollProgress) * 0.08;
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Tilt the entire container based on mouse
    container.style.transform = `rotateX(${-mouseY * 8}deg) rotateY(${mouseX * 8}deg)`;

    let allPassed = true;

    cards.forEach((card, i) => {
      // Calculate current Z position of this card
      let currentZ = card.baseZ + scrollProgress;

      // Calculate opacity based on depth
      let opacity = 1;

      // Fade in from deep space
      if (currentZ < -4000) {
        opacity = Math.max(0, 1 - (Math.abs(currentZ) - 4000) / 2000);
      }

      // Fade out when it passes the camera (Z > 300)
      if (currentZ > 300) {
        opacity = Math.max(0, 1 - (currentZ - 300) / 400);
      }

      card.el.style.opacity = opacity;

      // Depth of Field (Blur)
      let blur = 0;
      if (currentZ < -1500) {
        blur = Math.min(15, Math.abs(currentZ + 1500) / 250); // Gets blurrier in distance
      } else if (currentZ > 150) {
        blur = Math.min(25, (currentZ - 150) / 15); // Extreme blur as it passes camera
      }
      card.el.style.filter = `blur(${blur}px)`;

      // Add slight parallax to the X and Y offsets based on Z
      const parallaxFactor = 1 + (currentZ * 0.0005);
      const px = card.offsetX * parallaxFactor;
      const py = card.offsetY * parallaxFactor;

      card.el.style.transform = `translate(-50%, -50%) translate3d(${px}px, ${py}px, ${currentZ}px)`;

      // If the very last card (logo) hasn't passed the camera yet
      if (currentZ < 800) {
        allPassed = false;
      }
    });

    // Update Progress Indicator
    const progressPercent = Math.min(100, Math.max(0, (scrollProgress / maxScroll) * 100));
    progBar.style.height = progressPercent + '%';

    if (allPassed && cards.length > 0) {
      dismiss();
    } else {
      requestAnimationFrame(render);
    }
  }

  requestAnimationFrame(render);
  document.body.insertBefore(overlay, document.body.firstChild);
})();
