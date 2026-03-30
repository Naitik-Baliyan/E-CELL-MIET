(function () {
  'use strict';

  const overlay = document.getElementById('team-modal-overlay');
  const modal   = document.getElementById('team-modal');
  const closeBtn = document.getElementById('team-modal-close');

  const modalImg      = document.getElementById('modal-img');
  const modalName     = document.getElementById('modal-name');
  const modalRole     = document.getElementById('modal-role');
  const modalBio      = document.getElementById('modal-bio');
  const modalLinkedin = document.getElementById('modal-linkedin');

  if (!overlay || !modal) return;

  function openModal(card) {
    const name     = card.getAttribute('data-name');
    const role     = card.getAttribute('data-role');
    const bio      = card.getAttribute('data-bio');
    const linkedin = card.getAttribute('data-linkedin'); 
    const imgSrc   = card.querySelector('img').src;

    modalImg.src      = imgSrc;
    modalName.textContent = name;
    modalRole.textContent = role;
    modalBio.textContent  = bio;

    // Reset button state
    modalLinkedin.textContent = "Connect on LinkedIn";

    // Set the global href for the link as a backup
    if (linkedin && linkedin !== '#' && linkedin.trim() !== "") {
      modalLinkedin.href = linkedin; 
      modalLinkedin.style.display = 'inline-flex';
      
      // Clean up previous event listeners just in case
      const newBtn = modalLinkedin.cloneNode(true);
      modalLinkedin.parentNode.replaceChild(newBtn, modalLinkedin);
      
      // Re-get the new element after replacement
      const activeBtn = document.getElementById('modal-linkedin');
      activeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          console.log("Redirecting to:", linkedin);
          window.open(linkedin, '_blank');
      });

    } else {
      modalLinkedin.style.display = 'none';
      modalLinkedin.href = '#';
    }

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

  document.querySelectorAll('.team-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') return;
      openModal(card);
    });

    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouseX', x + '%');
      card.style.setProperty('--mouseY', y + '%');
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

})();
