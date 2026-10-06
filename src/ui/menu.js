import gsap from 'gsap';

let closeMenuFn = () => {};

export function closeMenu(immediate = false) {
  closeMenuFn(immediate);
}

export function initMenu(menuEl) {
  if (!menuEl) return;

  const toggleBtn = document.querySelector('[data-menu-toggle]');
  const bg = menuEl.querySelector('.menu__bg');
  const inner = menuEl.querySelector('.menu__inner');
  const links = menuEl.querySelectorAll('[data-menu-link]');
  const previewImg = menuEl.querySelector('[data-menu-preview]');
  const previewFig = menuEl.querySelector('.menu__preview');
  const foot = menuEl.querySelector('.menu__foot');
  let isOpen = false;

  // Ensure menu starts completely hidden and unrendered
  menuEl.classList.remove('is-open');
  gsap.set(menuEl, { display: 'none', visibility: 'hidden' });
  if (bg) gsap.set(bg, { clipPath: 'inset(0% 0% 100% 0%)' });
  if (inner) gsap.set(inner, { opacity: 0 });
  if (previewFig) gsap.set(previewFig, { clipPath: 'inset(0% 0% 100% 0%)' });
  if (links.length) gsap.set(links, { y: 35, opacity: 0 });
  if (foot) gsap.set(foot, { opacity: 0, y: 15 });

  function open() {
    if (isOpen) return;
    isOpen = true;
    document.body.classList.add('menu-open');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    menuEl.classList.add('is-open');

    // Make visible in DOM
    gsap.set(menuEl, { display: 'block', visibility: 'visible' });
    gsap.killTweensOf([menuEl, bg, inner, links, previewFig, foot]);

    const tl = gsap.timeline();
    tl.to(bg, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.6,
      ease: 'power3.inOut',
    })
    .to(inner, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out',
    }, '-=0.35')
    .to(
      links,
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out' },
      '-=0.25'
    )
    .to(
      previewFig,
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power2.out' },
      '-=0.4'
    )
    .to(
      foot,
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.3'
    );
  }

  function close(immediate = false) {
    if (!isOpen && !menuEl.classList.contains('is-open')) return;
    isOpen = false;
    document.body.classList.remove('menu-open');
    toggleBtn?.setAttribute('aria-expanded', 'false');

    gsap.killTweensOf([menuEl, bg, inner, links, previewFig, foot]);

    if (immediate) {
      menuEl.classList.remove('is-open');
      gsap.set(menuEl, { display: 'none', visibility: 'hidden' });
      if (bg) gsap.set(bg, { clipPath: 'inset(0% 0% 100% 0%)' });
      if (inner) gsap.set(inner, { opacity: 0 });
      if (previewFig) gsap.set(previewFig, { clipPath: 'inset(0% 0% 100% 0%)' });
      if (links.length) gsap.set(links, { y: 35, opacity: 0 });
      if (foot) gsap.set(foot, { opacity: 0, y: 15 });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        menuEl.classList.remove('is-open');
        gsap.set(menuEl, { display: 'none', visibility: 'hidden' });
        if (bg) gsap.set(bg, { clipPath: 'inset(0% 0% 100% 0%)' });
        if (inner) gsap.set(inner, { opacity: 0 });
        if (previewFig) gsap.set(previewFig, { clipPath: 'inset(0% 0% 100% 0%)' });
        if (links.length) gsap.set(links, { y: 35, opacity: 0 });
        if (foot) gsap.set(foot, { opacity: 0, y: 15 });
      }
    });

    tl.to([links, foot], {
      opacity: 0,
      y: 20,
      duration: 0.2,
      ease: 'power2.in',
    })
    .to(previewFig, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.25,
      ease: 'power2.in',
    }, 0)
    .to(inner, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    }, 0)
    .to(bg, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.4,
      ease: 'power3.inOut',
    }, '-=0.1');
  }

  closeMenuFn = close;

  toggleBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (isOpen) close(false);
    else open();
  });

  bg?.addEventListener('click', () => {
    if (isOpen) close(false);
  });

  // Hover image preview swap
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const src = link.dataset.img;
      if (src && previewImg && previewImg.src !== src) {
        gsap.to(previewImg, {
          opacity: 0.2,
          duration: 0.15,
          onComplete: () => {
            previewImg.src = src;
            gsap.to(previewImg, { opacity: 1, duration: 0.3 });
          },
        });
      }
    });

    // Close when clicked
    link.addEventListener('click', () => {
      close(true);
    });
  });

  // ESC to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close(false);
  });
}
