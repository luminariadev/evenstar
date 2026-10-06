import gsap from 'gsap';

export const SILHOUETTES = [
  {
    id: 'w-slip-dress',
    code: 'W—SL01',
    name: 'Bias Silk Slip Dress',
    gender: 'Women',
    mill: 'Como, Italy',
    weight: '240 GSM',
    cutTime: '18 hrs',
    price: 'IDR 8,400,000',
    description: 'Cut on a true 45° bias from heavy mulberry silk charmeuse. Drapes naturally over curves without clinging or restriction.',
    filterLink: 'women',
    colors: [
      {
        name: 'Champagne Ivory',
        hex: '#ede6d8',
        code: '01',
        image: '/images/w-slip-dress-champagne.webp',
        specNote: 'Mulberry silk charmeuse • 100% Grade 6A silk',
        availability: 'In Stock • Atelier Jakarta',
      },
      {
        name: 'Noir Satin',
        hex: '#141414',
        code: '02',
        image: '/images/w-slip-dress-noir.webp',
        specNote: 'Obsidian silk charmeuse • Hand-dipped yarn',
        availability: 'Made to Order • 14 days',
      },
      {
        name: 'Oxblood Red',
        hex: '#4a151b',
        code: '03',
        image: '/images/w-slip-dress-oxblood.webp',
        specNote: 'Garut natural madder root dyed silk charmeuse',
        availability: 'Limited Edition • 8 pieces',
      },
    ],
    hotspots: [
      { x: 50, y: 32, label: 'Bias Grainline', desc: 'True 45° cut allows pure silk to float over contours rather than sticking.' },
      { x: 38, y: 52, label: 'French Inset Seams', desc: 'Enclosed interior seams hand-finished with pure silk thread to prevent fraying.' },
      { x: 58, y: 76, label: 'Weighted Fluted Hem', desc: 'Micro-beaded silk tape hemmed by hand ensures fluid drape during movement.' },
    ],
  },
  {
    id: 'm-overcoat',
    code: 'M—OC01',
    name: 'Double-Faced Overcoat',
    gender: 'Men',
    mill: 'Biella, Italy',
    weight: '520 GSM',
    cutTime: '36 hrs',
    price: 'IDR 16,800,000',
    description: 'Unlined double-faced virgin wool and Mongolian cashmere. Split at the perimeter and turned inward with invisible blind stitching.',
    filterLink: 'men',
    colors: [
      {
        name: 'Stone Grey',
        hex: '#969490',
        code: '01',
        image: '/images/m-overcoat-grey.webp',
        specNote: 'Natural un-dyed Mongolian cashmere & virgin wool',
        availability: 'In Stock • Plaza Senayan',
      },
      {
        name: 'Camel Vicuña',
        hex: '#9e724c',
        code: '02',
        image: '/images/m-overcoat-camel.webp',
        specNote: 'Baby camelhair & Mongolian cashmere blend',
        availability: 'Made to Order • 21 days',
      },
      {
        name: 'Charcoal Noir',
        hex: '#1c1b1a',
        code: '03',
        image: '/images/m-overcoat-noir.webp',
        specNote: 'Double-faced obsidian wool • Hand blind-stitched',
        availability: 'In Stock • Atelier Jakarta',
      },
    ],
    hotspots: [
      { x: 44, y: 26, label: 'Seamless Raglan', desc: 'Continuous shoulder line cut to layer effortlessly over knitwear without boxiness.' },
      { x: 56, y: 46, label: 'Buffalo Horn Buttons', desc: 'Matte horn buttons hand-turned and carved in Florence, Italy.' },
      { x: 36, y: 68, label: 'Double-Face Edge', desc: 'Split cloth hand-turned inward with 4 stitches per centimetre blind seam.' },
    ],
  },
  {
    id: 'w-tailored-suit',
    code: 'W—TS01',
    name: 'Peak-Lapel Tuxedo',
    gender: 'Women',
    mill: 'Huddersfield, UK',
    weight: '340 GSM',
    cutTime: '42 hrs',
    price: 'IDR 14,200,000',
    description: 'Architectural silhouette cut from Super 160s English wool with floating horsehair canvas and pure silk grosgrain lapels.',
    filterLink: 'women',
    colors: [
      {
        name: 'Midnight Black',
        hex: '#111111',
        code: '01',
        image: '/images/w-tailored-suit-black.webp',
        specNote: 'Super 160s English wool • Pure silk grosgrain lapel',
        availability: 'In Stock • Atelier Jakarta',
      },
      {
        name: 'Ivory Dinner',
        hex: '#eae5dc',
        code: '02',
        image: '/images/w-tailored-suit-ivory.webp',
        specNote: 'Pure ecru dinner wool • Silk faille lapel facing',
        availability: 'Made to Order • 18 days',
      },
      {
        name: 'Forest Noir',
        hex: '#18241c',
        code: '03',
        image: '/images/w-tailored-suit-forest.webp',
        specNote: 'Bottle green worsted wool • Hand silk buttonhole',
        availability: 'Limited Edition • 12 pieces',
      },
    ],
    hotspots: [
      { x: 44, y: 28, label: 'Silk Grosgrain Lapel', desc: 'Heavy ribbed silk woven on historic shuttle looms in Lyon.' },
      { x: 54, y: 45, label: 'Floating Canvas', desc: 'Natural horsehair canvas interlining that permanently molds to the wearer’s posture.' },
      { x: 38, y: 62, label: 'Milanese Buttonhole', desc: 'Over 80 hand-twisted silk stitches per buttonhole, crafted by one master artisan.' },
    ],
  },
  {
    id: 'm-linen-suit',
    code: 'M—LS01',
    name: 'Relaxed Tailored Suit',
    gender: 'Men',
    mill: 'Belfast & Como',
    weight: '310 GSM',
    cutTime: '24 hrs',
    price: 'IDR 12,600,000',
    description: 'Deconstructed shoulder and breathable flax-silk blend. Soft Italian silhouette crafted for tropical evening gatherings.',
    filterLink: 'men',
    colors: [
      {
        name: 'Natural Sand',
        hex: '#c8bcab',
        code: '01',
        image: '/images/m-linen-suit-sand.webp',
        specNote: 'Irish wet-spun flax & Como raw silk blend',
        availability: 'In Stock • Seminyak',
      },
      {
        name: 'Midnight Navy',
        hex: '#171c26',
        code: '02',
        image: '/images/m-linen-suit-navy.webp',
        specNote: 'Navy-dyed flax twill • Breathable open weave',
        availability: 'Made to Order • 16 days',
      },
      {
        name: 'Warm Espresso',
        hex: '#2b211a',
        code: '03',
        image: '/images/m-linen-suit-charcoal.webp',
        specNote: 'Espresso roasted flax blend • Unlined softness',
        availability: 'Made to Order • 16 days',
      },
    ],
    hotspots: [
      { x: 42, y: 25, label: 'Spalla Camicia', desc: 'Shirt-style shoulder sleevehead with zero padding for natural drape.' },
      { x: 50, y: 44, label: 'Hand Pick-Stitch', desc: 'Subtle 2mm hand edge-stitching that prevents the lapel edge from rolling.' },
      { x: 58, y: 68, label: 'Irish Flax & Silk', desc: 'Heritage loom flax blended with 15% raw silk for a crisp yet supple handfeel.' },
    ],
  },
];

export function initAtelierStudio(containerEl) {
  if (!containerEl) return;

  const piecesEl = containerEl.querySelector('[data-pieces]');
  const swatchesEl = containerEl.querySelector('[data-swatches]');
  const specEl = containerEl.querySelector('[data-spec]');
  const fabricNameEl = containerEl.querySelector('[data-fabric-name]');
  const indexEl = containerEl.querySelector('[data-piece-index]');
  const shopBtn = containerEl.querySelector('[data-atelier-shop]');
  const toggleLoupeBtn = containerEl.querySelector('[data-toggle-loupe]');

  // Stage elements
  const stageEl = containerEl.querySelector('[data-atelier-stage]');
  const mediaEl = containerEl.querySelector('[data-atelier-media]');
  const stageImg = containerEl.querySelector('[data-stage-img]');
  const hotspotsContainer = containerEl.querySelector('[data-hotspots]');
  const loupeEl = containerEl.querySelector('[data-atelier-loupe]');
  const loupeImg = containerEl.querySelector('[data-loupe-img]');

  // Floating card elements
  const cardImg = containerEl.querySelector('[data-card-img]');
  const cardCode = containerEl.querySelector('[data-card-code]');
  const cardName = containerEl.querySelector('[data-card-name]');
  const cardNotes = containerEl.querySelector('[data-card-notes]');

  let currentIndex = 0;
  let currentColorIndex = 0;
  let isLoupeActive = false;
  let isSwitchingImage = false;
  const zoomFactor = 2.4;
  const loupeSize = 170;

  // Preload all colorway images in the background so switching is instantaneous
  SILHOUETTES.forEach((s) => {
    s.colors.forEach((c) => {
      const img = new Image();
      img.src = c.image;
    });
  });

  // Smooth Crossfade Image Switcher
  function switchImage(newSrc) {
    if (!newSrc || !stageImg || stageImg.getAttribute('src') === newSrc) return;
    if (isSwitchingImage) {
      stageImg.src = newSrc;
      if (loupeImg) loupeImg.src = newSrc;
      if (cardImg) cardImg.src = newSrc;
      return;
    }

    isSwitchingImage = true;
    gsap.to(stageImg, {
      opacity: 0.15,
      scale: 0.985,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        stageImg.src = newSrc;
        if (loupeImg) loupeImg.src = newSrc;
        if (cardImg) cardImg.src = newSrc;
        gsap.to(stageImg, {
          opacity: 1,
          scale: 1,
          duration: 0.38,
          ease: 'power2.out',
          onComplete: () => {
            isSwitchingImage = false;
          },
        });
      },
    });
  }

  // Render Silhouettes Selector Buttons
  function renderSilhouettes() {
    if (!piecesEl) return;
    piecesEl.innerHTML = SILHOUETTES.map((s, idx) => `
      <button class="piece-btn ${idx === currentIndex ? 'is-active' : ''}" data-idx="${idx}" type="button" aria-pressed="${idx === currentIndex}">
        <span class="mono">${s.code} • ${s.gender}</span>
        <strong>${s.name}</strong>
      </button>
    `).join('');

    piecesEl.querySelectorAll('.piece-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx === currentIndex) return;
        selectGarment(idx);
      });
    });
  }

  // Render Swatches
  function renderSwatches(garment) {
    if (!swatchesEl) return;
    swatchesEl.innerHTML = garment.colors.map((c, idx) => `
      <button class="swatch ${idx === currentColorIndex ? 'is-active' : ''}" data-color-idx="${idx}" style="background-color: ${c.hex};" title="${c.name}" aria-label="${c.name}"></button>
    `).join('');

    const activeColor = garment.colors[currentColorIndex] || garment.colors[0];
    if (fabricNameEl) {
      fabricNameEl.textContent = activeColor.name;
    }

    swatchesEl.querySelectorAll('.swatch').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cIdx = parseInt(btn.dataset.colorIdx, 10);
        if (cIdx === currentColorIndex) return;
        currentColorIndex = cIdx;
        swatchesEl.querySelectorAll('.swatch').forEach((s, i) => s.classList.toggle('is-active', i === cIdx));
        
        const c = garment.colors[cIdx];
        if (fabricNameEl) {
          fabricNameEl.textContent = c.name;
          gsap.fromTo(fabricNameEl, { opacity: 0.4, x: -4 }, { opacity: 1, x: 0, duration: 0.3 });
        }

        // Live visual switch of the garment photo
        switchImage(c.image);

        // Update specs & floating card
        renderSpecs(garment, c);
        if (cardNotes) {
          cardNotes.textContent = `${c.name} • ${c.availability}`;
        }
      });
    });
  }

  // Render Specs
  function renderSpecs(garment, activeColor) {
    if (!specEl) return;
    const c = activeColor || garment.colors[currentColorIndex] || garment.colors[0];
    specEl.innerHTML = `
      <div><dt class="mono muted-light">Mill</dt><dd>${garment.mill}</dd></div>
      <div><dt class="mono muted-light">Weight</dt><dd>${garment.weight}</dd></div>
      <div><dt class="mono muted-light">Artisan Time</dt><dd>${garment.cutTime}</dd></div>
      <div class="atelier__spec-wide"><dt class="mono muted-light">Cloth Composition</dt><dd class="mono-body">${c.specNote}</dd></div>
      <div><dt class="mono muted-light">Availability</dt><dd class="mono-body">${c.availability}</dd></div>
    `;
  }

  // Render Hotspots
  function renderHotspots(garment) {
    if (!hotspotsContainer) return;
    hotspotsContainer.innerHTML = garment.hotspots.map((h, i) => `
      <div class="hotspot" style="left: ${h.x}%; top: ${h.y}%;" data-hotspot-idx="${i}">
        <button class="hotspot__pin" type="button" aria-label="${h.label}">
          <span class="hotspot__pulse"></span>
          <span class="hotspot__dot"></span>
        </button>
        <div class="hotspot__card">
          <span class="mono muted-light">[ Detail 0${i + 1} ]</span>
          <strong class="hotspot__title">${h.label}</strong>
          <p class="hotspot__desc">${h.desc}</p>
        </div>
      </div>
    `).join('');

    hotspotsContainer.querySelectorAll('.hotspot').forEach((el) => {
      const pin = el.querySelector('.hotspot__pin');
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = el.classList.contains('is-open');
        hotspotsContainer.querySelectorAll('.hotspot').forEach(h => h.classList.remove('is-open'));
        if (!isOpen) el.classList.add('is-open');
      });
    });
  }

  // Select Garment
  function selectGarment(idx) {
    currentIndex = idx;
    currentColorIndex = 0;
    const garment = SILHOUETTES[idx];
    const initialColor = garment.colors[0];

    // Update active button state
    piecesEl?.querySelectorAll('.piece-btn').forEach((b, i) => {
      b.classList.toggle('is-active', i === idx);
      b.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
    });

    if (indexEl) {
      indexEl.textContent = `0${idx + 1} / 0${SILHOUETTES.length}`;
    }

    if (shopBtn) {
      shopBtn.setAttribute('data-filter-link', garment.filterLink);
    }

    // Update floating card
    if (cardImg) cardImg.src = initialColor.image;
    if (cardCode) cardCode.textContent = garment.code;
    if (cardName) cardName.textContent = garment.name;
    if (cardNotes) cardNotes.textContent = `${initialColor.name} • ${initialColor.availability}`;

    // Switch photo smoothly
    switchImage(initialColor.image);

    renderSwatches(garment);
    renderSpecs(garment, initialColor);
    renderHotspots(garment);

    // Subtle card animation
    const cardEl = containerEl.querySelector('[data-atelier-card]');
    if (cardEl) {
      gsap.fromTo(cardEl, { y: 12, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
    }
  }

  // Close hotspots when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hotspot')) {
      hotspotsContainer?.querySelectorAll('.hotspot').forEach(h => h.classList.remove('is-open'));
    }
  });

  // Macro Loupe Inspection Mechanics
  if (mediaEl && loupeEl && loupeImg && stageImg) {
    function updateLoupe(clientX, clientY) {
      const rect = mediaEl.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        hideLoupe();
        return;
      }

      showLoupe();

      // Clamp position inside container
      const loupeX = Math.max(0, Math.min(rect.width - loupeSize, x - loupeSize / 2));
      const loupeY = Math.max(0, Math.min(rect.height - loupeSize, y - loupeSize / 2));

      gsap.set(loupeEl, {
        x: loupeX,
        y: loupeY,
      });

      // Magnify target point
      const bgX = -(x * zoomFactor - loupeSize / 2);
      const bgY = -(y * zoomFactor - loupeSize / 2);

      gsap.set(loupeImg, {
        width: rect.width * zoomFactor,
        height: rect.height * zoomFactor,
        x: bgX,
        y: bgY,
      });
    }

    function showLoupe() {
      if (isLoupeActive) return;
      isLoupeActive = true;
      loupeEl.classList.add('is-active');
      gsap.to(loupeEl, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' });
    }

    function hideLoupe() {
      if (!isLoupeActive) return;
      isLoupeActive = false;
      loupeEl.classList.remove('is-active');
      gsap.to(loupeEl, { opacity: 0, scale: 0.85, duration: 0.2, ease: 'power2.in' });
    }

    mediaEl.addEventListener('mousemove', (e) => {
      updateLoupe(e.clientX, e.clientY);
    });

    mediaEl.addEventListener('mouseleave', () => {
      hideLoupe();
    });

    // Touch support for mobile / tablet
    mediaEl.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updateLoupe(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    mediaEl.addEventListener('touchend', () => {
      setTimeout(hideLoupe, 800);
    });

    // Mobile Toggle button
    if (toggleLoupeBtn) {
      toggleLoupeBtn.addEventListener('click', () => {
        const rect = mediaEl.getBoundingClientRect();
        if (isLoupeActive) {
          hideLoupe();
        } else {
          updateLoupe(rect.left + rect.width / 2, rect.top + rect.height * 0.4);
        }
      });
    }
  }

  // Initial render
  renderSilhouettes();
  selectGarment(0);
}
