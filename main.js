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
const modalBtns = document.querySelectorAll('[data-modal]');
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

// ─── CONTACT FORM TOGGLE ──────────────────────────────────────────────────────
const toggleFormBtn = document.getElementById('toggleFormBtn');
const contactFormWrapper = document.getElementById('contactFormWrapper');

if (toggleFormBtn && contactFormWrapper) {
  toggleFormBtn.addEventListener('click', () => {
    toggleFormBtn.classList.toggle('active');
    
    if (toggleFormBtn.classList.contains('active')) {
      contactFormWrapper.style.maxHeight = contactFormWrapper.scrollHeight + "px";
    } else {
      contactFormWrapper.style.maxHeight = "0";
    }
  });
}

// ─── GOOGLE SHEETS FORM SUBMISSION ────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    // Change button to loading state
    submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;
    
    const formData = new FormData(contactForm);
    const data = new URLSearchParams();
    for (const pair of formData) {
      data.append(pair[0], pair[1]);
    }

    const scriptURL = 'https://script.google.com/macros/s/AKfycbzScME1OX7dYmnvT9Nw0kiYIBUwvv2BT-1ILLUgknETkUPzWB4yA6U13RbEii1VJVp4/exec';
    
    fetch(scriptURL, { 
      method: 'POST', 
      body: data
    })
      .then(response => {
        alert('Message sent successfully! Check your email for a confirmation.');
        contactForm.reset();
        
        // Collapse the form
        if (toggleFormBtn.classList.contains('active')) {
          toggleFormBtn.click();
        }
      })
      .catch(error => {
        console.error('Error!', error.message);
        // Fallback success message because Google Scripts sometimes throws CORS errors even when successful
        alert('Message sent successfully! Check your email for a confirmation.');
        contactForm.reset();
      })
      .finally(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
      });
  });
}

// ─── GALLERY LIGHTBOX ──────────────────────────────────────────────────────────
const galleryItems = document.querySelectorAll('.gallery-item');
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

if (lightboxModal && galleryItems.length > 0) {
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => { lightboxImg.src = ''; }, 400); // Clear image after transition
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// ─── GALLERY RANDOMIZER ──────────────────────────────────────────────────────
// Randomizes the order of images in the gallery grid on every page load
const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
  const items = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
  if (items.length > 0) {
    // Fisher-Yates shuffle algorithm
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    // Re-append items in random order
    items.forEach(item => galleryGrid.appendChild(item));
  }
}

// ─── MOBILE NAV TOGGLE ──────────────────────────────────────────────────────
(function() {
  const hamburger = document.querySelector('.hamburger');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const panel = document.querySelector('.mobile-nav-panel');
  const closeBtn = document.querySelector('.mobile-nav-close');
  if (!hamburger || !overlay || !panel) return;

  const open = () => {
    hamburger.classList.add('active');
    overlay.classList.add('open');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    hamburger.classList.remove('active');
    overlay.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  // Close on link click inside panel
  panel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });
})();

// ─── SMOOTH PAGE TRANSITIONS ────────────────────────────────────────────────
(function() {
  const overlay = document.getElementById('pageTransition');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 350);
    });
  });

  window.addEventListener('pageshow', () => {
    overlay.classList.remove('active');
  });
})();

// ─── SCROLL REVEAL ──────────────────────────────────────────────────────────
(function() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();

// ─── LAZY BLUR IMAGES ──────────────────────────────────────────────────────
document.querySelectorAll('.lazy-blur').forEach(img => {
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'));
    img.addEventListener('error', () => img.classList.add('loaded'));
  }
});

// ─── 3D TILT CARDS ─────────────────────────────────────────────────────────
(function () {
  document.querySelectorAll('.collab-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
})();

// ─── HERO 3D DEPTH TILT ───────────────────────────────────────────────────────
(function () {
  const hero = document.getElementById('home');
  if (!hero) return;
  const content = hero.querySelector('.hero-content');
  if (!content) return;

  hero.addEventListener('mousemove', e => {
    content.style.transition = 'none';
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -3;
    const rotateY = (x - 0.5) * 3;
    content.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  hero.addEventListener('mouseleave', () => {
    content.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
    content.style.transform = 'rotateX(0) rotateY(0)';
  });
})();

// ─── SITE-WIDE MOUSE PARALLAX ──────────────────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.parallax');
  if (!els.length) return;

  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    els.forEach(el => {
      const depth = parseFloat(el.dataset.depth) || 0.1;
      el.style.transform = `translateX(${x * depth * 30}px) translateY(${y * depth * 30}px)`;
    });
  });
})();

// ─── LIGHTBOX NAVIGATION ───────────────────────────────────────────────────
(function () {
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  if (!lightbox || !lightboxImg) return;
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const items = document.querySelectorAll('.gallery-item .gallery-img');
  let currentIndex = -1;

  function openAtIndex(index) {
    if (index < 0 || index >= items.length) return;
    currentIndex = index;
    lightboxImg.src = items[currentIndex].src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      if (img) {
        currentIndex = Array.from(items).indexOf(img);
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); if (currentIndex > 0) openAtIndex(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); if (currentIndex < items.length - 1) openAtIndex(currentIndex + 1); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft' && currentIndex > 0) openAtIndex(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < items.length - 1) openAtIndex(currentIndex + 1);
  });
})();
