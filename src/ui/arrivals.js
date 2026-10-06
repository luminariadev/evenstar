import gsap from 'gsap';
import { products, formatIDR } from '../data/products.js';

export function initArrivals(containerEl) {
  const trackEl = containerEl.querySelector('[data-track]');
  const listEl = containerEl.querySelector('[data-track-list]');
  const progressEl = containerEl.querySelector('[data-track-progress]');
  const countEl = containerEl.querySelector('[data-count]');
  const tabsContainer = containerEl.querySelector('.tabs');
  const bagCountEl = document.querySelector('[data-bag-count]');
  const toastEl = document.querySelector('[data-toast]');

  let bagCount = 0;
  let activeFilter = 'all';

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => {
      toastEl.classList.remove('is-on');
    }, 2800);
  }

  // Render product items
  function renderProducts(filter = 'all') {
    activeFilter = filter;
    const filtered = filter === 'all' ? products : products.filter(p => p.gender === filter);

    if (countEl) countEl.textContent = filtered.length.toString().padStart(2, '0');

    listEl.innerHTML = filtered.map(p => `
      <li class="product" data-gender="${p.gender}" data-id="${p.id}">
        <div class="product__media" data-cursor="View">
          <img src="${p.img}" alt="${p.alt}" loading="lazy" />
          <span class="product__tag">[ ${p.tag} ]</span>
          <button class="product__fav" data-fav aria-label="Save to wishlist" title="Save to wishlist">♡</button>
          <div class="product__quick">
            <span class="mono muted">Size</span>
            <div class="product__sizes">
              ${p.sizes.map(s => `<button data-size="${s}" data-product="${p.name}">${s}</button>`).join('')}
            </div>
          </div>
        </div>
        <div class="product__info">
          <strong class="product__name">${p.name}</strong>
          <span class="product__price">${formatIDR(p.price)}</span>
          <span class="product__fabric mono muted">${p.fabric}</span>
        </div>
      </li>
    `).join('');

    // Smooth reset scroll
    trackEl.scrollTo({ left: 0, behavior: 'smooth' });
    updateProgress();

    // Gentle stagger
    gsap.fromTo(
      listEl.children,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out' }
    );
  }

  renderProducts('all');

  // Progress Bar sync
  function updateProgress() {
    if (!progressEl) return;
    const maxScroll = trackEl.scrollWidth - trackEl.clientWidth;
    const ratio = maxScroll > 0 ? trackEl.scrollLeft / maxScroll : 0;
    const scale = Math.max(0.12, Math.min(1, ratio));
    progressEl.style.transform = `scaleX(${scale})`;
  }

  trackEl.addEventListener('scroll', updateProgress, { passive: true });

  // Wheel horizontal scroll on track
  trackEl.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // native horizontal
    if (trackEl.scrollLeft > 0 && trackEl.scrollLeft < (trackEl.scrollWidth - trackEl.clientWidth)) {
      trackEl.scrollLeft += e.deltaY * 0.8;
      updateProgress();
    }
  }, { passive: true });

  // Drag Interaction with Deadzone & Button Shielding
  let isDown = false;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let velX = 0;
  let momentumID = null;

  trackEl.addEventListener('mousedown', (e) => {
    // Prevent dragging when clicking interactive buttons
    if (e.target.closest('button, .product__quick, .product__sizes')) return;

    isDown = true;
    isDragging = false;
    startX = e.pageX - trackEl.offsetLeft;
    scrollLeft = trackEl.scrollLeft;
    velX = 0;
    cancelAnimationFrame(momentumID);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const x = e.pageX - trackEl.offsetLeft;
    const walk = (x - startX);

    // 6px deadzone prevents accidental click cancellation
    if (!isDragging && Math.abs(walk) > 6) {
      isDragging = true;
      trackEl.classList.add('is-dragging');
    }

    if (isDragging) {
      e.preventDefault();
      const prev = trackEl.scrollLeft;
      trackEl.scrollLeft = scrollLeft - walk * 1.25;
      velX = trackEl.scrollLeft - prev;
    }
  });

  window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    setTimeout(() => {
      isDragging = false;
      trackEl.classList.remove('is-dragging');
    }, 40);

    // Smooth inertia
    function inertia() {
      if (Math.abs(velX) > 0.4) {
        trackEl.scrollLeft += velX;
        velX *= 0.93;
        momentumID = requestAnimationFrame(inertia);
      }
    }
    inertia();
  });

  // Category Tabs Filter
  if (tabsContainer) {
    tabsContainer.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (!tab) return;
      tabsContainer.querySelectorAll('.tab').forEach(t => {
        const isActive = t === tab;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      renderProducts(tab.dataset.filter);
    });
  }

  // Cross-page filter links
  document.querySelectorAll('[data-filter-link]').forEach(link => {
    link.addEventListener('click', () => {
      const targetGender = link.getAttribute('data-filter-link');
      if (!targetGender) return;

      const targetTab = tabsContainer?.querySelector(`[data-filter="${targetGender}"]`);
      if (targetTab) {
        tabsContainer.querySelectorAll('.tab').forEach(t => {
          const isActive = t === targetTab;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        renderProducts(targetGender);
      }
    });
  });

  // Quick add to bag & Wishlist click handling (Direct & reliable)
  listEl.addEventListener('click', (e) => {
    // Size button
    const sizeBtn = e.target.closest('[data-size]');
    if (sizeBtn) {
      e.stopPropagation();
      e.preventDefault();
      const size = sizeBtn.dataset.size;
      const product = sizeBtn.dataset.product;
      bagCount++;
      if (bagCountEl) bagCountEl.textContent = String(bagCount);
      showToast(`[ ADDED TO BAG — ${product.toUpperCase()} (SIZE ${size}) ]`);

      gsap.fromTo(sizeBtn, { scale: 0.82 }, { scale: 1, duration: 0.35, ease: 'back.out(2.2)' });
      return;
    }

    // Wishlist heart
    const favBtn = e.target.closest('[data-fav]');
    if (favBtn) {
      e.stopPropagation();
      e.preventDefault();
      const isOn = favBtn.classList.toggle('is-on');
      favBtn.textContent = isOn ? '♥' : '♡';
      showToast(isOn ? '[ SAVED TO WISHLIST ]' : '[ REMOVED FROM WISHLIST ]');
      gsap.fromTo(favBtn, { scale: 1.35 }, { scale: 1, duration: 0.35, ease: 'back.out(2.4)' });
      return;
    }
  });
}
