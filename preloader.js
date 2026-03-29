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

    #ecell-preloader {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(45px);
      -webkit-backdrop-filter: blur(45px);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), 
                  backdrop-filter 1s cubic-bezier(0.16, 1, 0.3, 1),
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

    #ecell-pre-stage {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #ecell-glow-ring {
      position: absolute;
      border-radius: 50%;
      background: transparent;
      box-shadow: 0 0 0px 0px rgba(255,255,255,0);
      animation: glowPulse 2.5s ease forwards;
      animation-delay: 0.6s;
      pointer-events: none;
    }

    @keyframes glowPulse {
      0%   { box-shadow: 0 0 0px 0px rgba(255,255,255,0); }
      50%  { box-shadow: 0 0 60px 18px rgba(232,0,29,0.15); }
      100% { box-shadow: 0 0 50px 14px rgba(232,0,29,0.10); }
    }

    #ecell-pre-logo {
      display: block;
      border-radius: 12px;
      position: relative;
      z-index: 2;
      clip-path: inset(0 100% 0 0);
      animation: drawReveal 2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      animation-delay: 0.25s;
    }

    @keyframes drawReveal {
      0%   { clip-path: inset(0 100% 0 0); opacity: 0.3; }
      100% { clip-path: inset(0 0% 0 0); opacity: 1; }
    }

    #ecell-brand-text {
      position: absolute;
      bottom: -46px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,0.0);
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      white-space: nowrap;
      animation: brandFadeIn 0.6s ease forwards;
      animation-delay: 1.8s;
    }

    @keyframes brandFadeIn {
      to { color: rgba(255,255,255,0.45); }
    }

    .ecell-particle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.6);
      pointer-events: none;
      animation: particleDrift linear infinite;
    }

    @keyframes particleDrift {
      0%   { transform: translateY(0); opacity: 0; }
      10%  { opacity: 1; }
      100% { transform: translateY(-100px); opacity: 0; }
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

  const stage = document.createElement('div');
  stage.id = 'ecell-pre-stage';

  const glowRing = document.createElement('div');
  glowRing.id = 'ecell-glow-ring';

  const logo = document.createElement('img');
  logo.id = 'ecell-pre-logo';
  logo.src = 'logo.jpg';
  
  const brandText = document.createElement('span');
  brandText.id = 'ecell-brand-text';
  brandText.textContent = 'MIET Entrepreneurship Cell';

  stage.appendChild(glowRing);
  stage.appendChild(logo);
  stage.appendChild(brandText);
  overlay.appendChild(stage);

  /* Particles */
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('span');
    p.className = 'ecell-particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%; bottom: ${Math.random() * 50}%;
      animation-duration: ${Math.random() * 2 + 2}s;
      animation-delay: ${Math.random() * 2}s;
    `;
    overlay.appendChild(p);
  }

  function sizeLogo() {
    logo.style.width = Math.min(window.innerWidth * 0.5, 300) + 'px';
    const rect = logo.getBoundingClientRect();
    const d = Math.max(rect.width, rect.height) * 1.5;
    glowRing.style.width = d + 'px';
    glowRing.style.height = d + 'px';
  }

  logo.onload = sizeLogo;
  window.addEventListener('resize', sizeLogo);

  function dismiss() {
    sessionStorage.setItem('ecell_preloader_done', '1');
    overlay.classList.add('fade-out');
    document.documentElement.classList.remove('ecell-preloading');
    overlay.addEventListener('transitionend', () => {
      overlay.remove();
      style.remove();
    }, { once: true });
  }

  const timer = setTimeout(dismiss, 2900);
  skipBtn.addEventListener('click', () => {
    clearTimeout(timer);
    dismiss();
  });

  document.body.insertBefore(overlay, document.body.firstChild);
})();
