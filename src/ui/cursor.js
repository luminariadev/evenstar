import gsap from 'gsap';

let syncCursorFn = () => {};

export function syncCursorState() {
  syncCursorFn();
}

export function initCursor() {
  const cursorEl = document.querySelector('.cursor');
  if (!cursorEl) return;

  // Don't initialize on touch devices
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  const dot = cursorEl.querySelector('.cursor__dot');
  const ring = cursorEl.querySelector('.cursor__ring');
  const label = cursorEl.querySelector('[data-cursor-label]');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let hasMoved = false;
  let isHovered = false;
  let currentTarget = null;

  // Initial placement offscreen & hidden
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

  function applyTarget(target) {
    if (target === currentTarget) return;
    currentTarget = target;

    if (!target) {
      if (isHovered) {
        gsap.to(ring, {
          scale: 0,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(dot, {
          scale: 1,
          opacity: 1,
          duration: 0.2,
          overwrite: 'auto',
        });
        if (label) label.textContent = '';
        isHovered = false;
      }
      return;
    }

    const customText = target.getAttribute('data-cursor') || target.closest('[data-cursor]')?.getAttribute('data-cursor');

    if (customText) {
      if (label) label.textContent = customText;
      gsap.to(ring, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(dot, {
        scale: 0,
        opacity: 0,
        duration: 0.18,
        overwrite: 'auto',
      });
      isHovered = true;
    } else if (target.matches('a, button, [role="button"], .tab, .piece-btn, .swatch, input, select')) {
      if (label) label.textContent = '';
      gsap.to(ring, {
        scale: 0.45,
        opacity: 0.75,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(dot, {
        scale: 0.3,
        opacity: 0.5,
        duration: 0.2,
        overwrite: 'auto',
      });
      isHovered = true;
    } else {
      applyTarget(null);
    }
  }

  function checkElementUnderPointer() {
    if (!hasMoved) return;
    if (mouseX < 0 || mouseY < 0 || mouseX > window.innerWidth || mouseY > window.innerHeight) {
      applyTarget(null);
      return;
    }
    const el = document.elementFromPoint(mouseX, mouseY);
    if (!el) {
      applyTarget(null);
      return;
    }
    const target = el.closest('[data-cursor], a, button, [role="button"], .product, .tab, .piece-btn, .swatch, input, select');
    applyTarget(target);
  }

  syncCursorFn = checkElementUnderPointer;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!hasMoved) {
      hasMoved = true;
      ringX = mouseX;
      ringY = mouseY;
      gsap.set(dot, { x: mouseX, y: mouseY, opacity: 1 });
      gsap.set(ring, { x: mouseX, y: mouseY });
    } else {
      gsap.set(dot, { x: mouseX, y: mouseY });
    }
    checkElementUnderPointer();
  });

  // Smooth lerp loop for the ring
  function render() {
    if (hasMoved) {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      gsap.set(ring, { x: ringX, y: ringY });
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Sync cursor immediately on native scroll, wheel, and resize
  window.addEventListener('scroll', checkElementUnderPointer, { passive: true });
  window.addEventListener('wheel', checkElementUnderPointer, { passive: true });
  window.addEventListener('resize', checkElementUnderPointer, { passive: true });

  // Mouse leave / enter window
  document.addEventListener('mouseleave', () => {
    applyTarget(null);
    gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
  });

  document.addEventListener('mouseenter', () => {
    if (hasMoved) {
      gsap.to(dot, { opacity: 1, duration: 0.2 });
      checkElementUnderPointer();
    }
  });

  window.addEventListener('blur', () => {
    applyTarget(null);
    gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
  });

  // Pointer down squish effect
  window.addEventListener('mousedown', () => {
    if (isHovered) {
      gsap.to(ring, { scale: 0.88, duration: 0.15, overwrite: 'auto' });
    }
  });

  window.addEventListener('mouseup', () => {
    checkElementUnderPointer();
  });
}
