(function () {
  'use strict';

  const overlay = document.getElementById('team-modal-overlay');
  const modal   = document.getElementById('team-modal');
  const closeBtn = document.getElementById('team-modal-close');
  const prevBtn = document.getElementById('modal-prev');
  const nextBtn = document.getElementById('modal-next');

  const modalImg      = document.getElementById('modal-img');
  const modalName     = document.getElementById('modal-name');
  const modalRole     = document.getElementById('modal-role');
  const modalDept     = document.getElementById('modal-dept');
  const modalBio      = document.getElementById('modal-bio');
  const modalLinkedin = document.getElementById('modal-linkedin');

  let currentCards = [];
  let currentIndex = -1;

  if (!overlay || !modal) return;

  function updateModal(index) {
    if (index < 0 || index >= currentCards.length) return;
    
    currentIndex = index;
    const card = currentCards[currentIndex];
    
    const name     = card.getAttribute('data-name');
    const role     = card.getAttribute('data-role');
    const dept     = card.getAttribute('data-dept') || "Core Team";
    const bio      = card.getAttribute('data-bio');
    const linkedin = card.getAttribute('data-linkedin'); 
    const imgSrc   = card.querySelector('img').src;

    // Transition effect for image
    modalImg.style.opacity = '0';
    setTimeout(() => {
      modalImg.src = imgSrc;
      modalImg.style.opacity = '1';
    }, 150);

    modalName.textContent = name;
    modalRole.textContent = role;
    modalDept.textContent = dept;
    modalBio.textContent  = bio;

    // Set the LinkedIn link
    if (linkedin && linkedin !== '#' && linkedin.trim() !== "") {
      modalLinkedin.style.display = 'inline-flex';
      modalLinkedin.onclick = function(e) {
        e.preventDefault();
        window.open(linkedin, '_blank');
      };
    } else {
      modalLinkedin.style.display = 'none';
      modalLinkedin.onclick = null;
    }
  }

  function openModal(index) {
    updateModal(index);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      modal.classList.add('active');
    });
  }

  function closeModal() {
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(direction) {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = currentCards.length - 1;
    if (newIndex >= currentCards.length) newIndex = 0;
    
    // Smooth transition
    modal.style.transform = `translateX(${direction * -20}px) scale(0.98)`;
    modal.style.opacity = '0.5';
    
    setTimeout(() => {
      updateModal(newIndex);
      modal.style.transform = '';
      modal.style.opacity = '1';
    }, 200);
  }

  // Initialize all cards
  function init() {
    currentCards = Array.from(document.querySelectorAll('.team-card'));
    
    currentCards.forEach((card, index) => {
      card.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') return;
        openModal(index);
      });

      // Mouse tracking for spotlight glow
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouseX', x + '%');
        card.style.setProperty('--mouseY', y + '%');
      });
    });
  }

  // Event Listeners
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

  overlay.addEventListener('click', function (e) { 
    if (e.target === overlay) closeModal(); 
  });

  document.addEventListener('keydown', function (e) { 
    if (e.key === 'Escape') closeModal(); 
    if (modal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    }
  });

  init();

})();
