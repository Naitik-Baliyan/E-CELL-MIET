document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Populate badge text from data-category
  galleryItems.forEach(item => {
    const badge = item.querySelector('.gallery-item-badge');
    if (badge) {
      const cat = item.getAttribute('data-category');
      badge.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    }
  });

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 1. Remove active state from other buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // 2. Perform filtering with animations
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          // Show matching items
          item.classList.remove('hidden');
          // Force a reflow to make sure transition plays
          void item.offsetWidth; 
          item.classList.remove('fade-out');
          item.classList.add('fade-in');
        } else {
          // Hide non-matching items
          item.classList.remove('fade-in');
          item.classList.add('fade-out');
          
          // Wait for fade-out animation to complete, then add hidden
          const onTransitionEnd = (e) => {
            if (e.propertyName === 'opacity' && item.classList.contains('fade-out')) {
              item.classList.add('hidden');
              item.removeEventListener('transitionend', onTransitionEnd);
            }
          };
          
          // Fallback timeout in case transition doesn't fire
          setTimeout(() => {
            if (item.classList.contains('fade-out')) {
              item.classList.add('hidden');
            }
          }, 400);

          item.addEventListener('transitionend', onTransitionEnd);
        }
      });
    });
  });
});
