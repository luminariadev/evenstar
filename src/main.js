import './styles/main.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initCursor } from './ui/cursor.js';
import { initMenu } from './ui/menu.js';
import { initArrivals } from './ui/arrivals.js';
import { initAtelierStudio } from './atelier/atelierStudio.js';
import { initScrollAnimations } from './animations/scroll.js';

function runLoader(onComplete) {
  const loader = document.querySelector('.loader');
  const countEl = document.querySelector('[data-loader-count]');
  const barEl = document.querySelector('[data-loader-bar]');
  const markEl = document.querySelector('[data-loader-mark]');

  if (!loader || !countEl) {
    document.body.classList.remove('is-loading');
    if (onComplete) onComplete();
    return;
  }

  const obj = { val: 0 };
  const tl = gsap.timeline();

  tl.to(obj, {
    val: 100,
    duration: 1.4,
    ease: 'power2.inOut',
    onUpdate: () => {
      const formatted = Math.floor(obj.val).toString().padStart(3, '0');
      countEl.textContent = formatted;
      if (barEl) barEl.style.transform = `scaleX(${obj.val / 100})`;
    },
  });

  tl.fromTo(
    markEl,
    { letterSpacing: '0.2em', opacity: 0.7 },
    { letterSpacing: '0.02em', opacity: 1, duration: 1.2, ease: 'power2.out' },
    0
  );

  tl.to(loader, {
    clipPath: 'inset(0% 0% 100% 0%)',
    duration: 0.9,
    ease: 'power3.inOut',
    onStart: () => {
      document.body.classList.remove('is-loading');
    },
    onComplete: () => {
      loader.style.display = 'none';
      ScrollTrigger.refresh();
      if (onComplete) onComplete();
    },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI components that don't depend on scroll layout
  initCursor();
  initMenu(document.querySelector('[data-menu]'));
  initArrivals(document.querySelector('.arrivals'));

  const atelierEl = document.querySelector('[data-atelier]');
  if (atelierEl) {
    initAtelierStudio(atelierEl);
  }

  // Initialize scroll engine and pinning immediately so all measurements
  // and pin-spacers are computed quietly while the loader covers the screen
  const scrollEngine = initScrollAnimations();

  // Run the luxury opening loader
  runLoader();
});
