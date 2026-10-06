import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { syncCursorState } from '../ui/cursor.js';
import { closeMenu } from '../ui/menu.js';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // 1. Initialize Lenis Smooth Scrolling with high-performance settings
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);
  lenis.on('scroll', syncCursorState);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Navigation Hide / Show on Scroll (Synced with Lenis to prevent micro-jitter)
  const nav = document.querySelector('[data-nav]');
  let lastScroll = 0;

  lenis.on('scroll', ({ scroll }) => {
    if (scroll > 100 && scroll > lastScroll && !document.body.classList.contains('menu-open')) {
      nav?.classList.add('is-hidden');
    } else {
      nav?.classList.remove('is-hidden');
    }
    lastScroll = scroll;
  });

  // 3. Hero Expanding Center Frame Animation (Responsive via gsap.matchMedia)
  const hero = document.querySelector('[data-hero]');
  const heroFull = document.querySelector('[data-hero-full]');
  const heroSlot = document.querySelector('[data-hero-slot]');
  const heroSides = document.querySelectorAll('[data-hero-side]');
  const heroIntro = document.querySelector('[data-hero-intro]');
  const heroMark = document.querySelector('[data-hero-mark]');
  const heroFullCap = document.querySelector('[data-hero-fullcap]');

  if (hero && heroFull && heroSlot) {
    function computeSlotClip(isMobile) {
      // Force layout flush so bounds reflect the new breakpoint styles immediately
      void hero.offsetHeight;

      const heroRect = hero.getBoundingClientRect();
      const slotRect = heroSlot.getBoundingClientRect();

      // Safe fallback values if rects are unmeasured (e.g. before layout paint)
      const defaultDesktop = 'inset(22% 25% 10% 51%)';
      const defaultMobile = 'inset(22% 5% 42% 5%)';

      if (!heroRect.height || !heroRect.width || !slotRect.height || !slotRect.width) {
        return isMobile ? defaultMobile : defaultDesktop;
      }

      let topPct = ((slotRect.top - heroRect.top) / heroRect.height) * 100;
      let bottomPct = 100 - (((slotRect.top - heroRect.top) + slotRect.height) / heroRect.height) * 100;
      let leftPct = ((slotRect.left - heroRect.left) / heroRect.width) * 100;
      let rightPct = 100 - (((slotRect.left - heroRect.left) + slotRect.width) / heroRect.width) * 100;

      // Bound percentages safely
      topPct = Math.max(0, Math.min(90, topPct));
      bottomPct = Math.max(0, Math.min(90, bottomPct));
      leftPct = Math.max(0, Math.min(90, leftPct));
      rightPct = Math.max(0, Math.min(90, rightPct));

      if (topPct + bottomPct >= 98 || leftPct + rightPct >= 98) {
        return isMobile ? defaultMobile : defaultDesktop;
      }

      // On desktop, the slot is in column 3, so leftPct >= 25% and rightPct >= 15%
      // If rightPct < 15% on desktop, it means the layout was measured before desktop reflow!
      if (!isMobile && (rightPct < 15 || leftPct < 25)) {
        return defaultDesktop;
      }

      return `inset(${topPct.toFixed(2)}% ${rightPct.toFixed(2)}% ${bottomPct.toFixed(2)}% ${leftPct.toFixed(2)}%)`;
    }

    const heroMm = gsap.matchMedia();

    heroMm.add({
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)',
    }, (context) => {
      const { isMobile } = context.conditions;

      gsap.set(heroFull, {
        clipPath: computeSlotClip(isMobile),
        opacity: 0,
      });

      if (!isMobile && heroSides.length) {
        gsap.set(heroSides, { y: 0, opacity: 1 });
      }

      if (heroIntro) {
        gsap.set(heroIntro, { y: 0, opacity: 1 });
      }

      if (heroMark) {
        gsap.set(heroMark, { scale: 1, opacity: 1, y: 0 });
      }

      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: isMobile ? '+=100%' : '+=120%',
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      heroTl
        .fromTo(
          heroFull,
          { clipPath: () => computeSlotClip(isMobile), opacity: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, ease: 'power2.inOut' },
          0
        );

      if (!isMobile && heroSides.length) {
        heroTl.fromTo(
          heroSides,
          { y: 0, opacity: 1 },
          {
            y: 90,
            opacity: 0,
            stagger: 0.03,
            ease: 'power1.in',
          },
          0
        );
      }

      if (heroIntro) {
        heroTl.fromTo(
          heroIntro,
          { y: 0, opacity: 1 },
          {
            y: isMobile ? 30 : 60,
            opacity: 0,
            ease: 'power1.in',
          },
          0
        );
      }

      if (heroMark) {
        heroTl.fromTo(
          heroMark,
          { scale: 1, opacity: 1, y: 0 },
          {
            scale: 1.05,
            opacity: 0.12,
            y: isMobile ? -15 : -30,
            ease: 'power1.out',
          },
          0
        );
      }

      const heroImg = heroFull.querySelector('img');
      if (heroImg) {
        heroTl.to(heroImg, {
          scale: 1.05,
          ease: 'none',
        }, 0);
      }

      heroTl
        .to(heroFull, {
          '--shade': 0.65,
          ease: 'power1.out',
        }, 0.25)
        .fromTo(
          heroFullCap,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
          },
          0.45
        );
    });
  }

  // 4. Manifesto Text Reveal Animation
  const manifestoText = document.querySelector('[data-manifesto]');
  if (manifestoText) {
    const leadEl = manifestoText.querySelector('.manifesto__lead');
    let leadHtml = '';
    let bodyText = '';

    if (leadEl) {
      const leadWords = leadEl.textContent.trim().split(/\s+/);
      leadHtml = `<span class="manifesto__lead-wrap">${leadWords.map(w => `<span class="word word--lead">${w}</span>`).join(' ')}</span>`;
      leadEl.remove();
      bodyText = manifestoText.textContent.trim();
    } else {
      bodyText = manifestoText.textContent.trim();
    }

    const bodyTokens = bodyText.split(/\s+/);
    const bodySpans = [];

    for (let i = 0; i < bodyTokens.length; i++) {
      const token = bodyTokens[i];
      if (token === '—' || token === '&mdash;') {
        if (bodySpans.length > 0) {
          bodySpans[bodySpans.length - 1] = bodySpans[bodySpans.length - 1].replace(
            /<\/span>$/,
            '&nbsp;&mdash;</span>'
          );
        } else {
          bodySpans.push(`<span class="word">&mdash;</span>`);
        }
      } else {
        bodySpans.push(`<span class="word">${token}</span>`);
      }
    }

    manifestoText.innerHTML = leadHtml
      ? `${leadHtml} ${bodySpans.join(' ')}`
      : bodySpans.join(' ');

    gsap.fromTo(
      manifestoText.querySelectorAll('.word'),
      { opacity: 0.18, y: 6 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.02,
        scrollTrigger: {
          trigger: manifestoText,
          start: 'top 82%',
          end: 'bottom 48%',
          scrub: 0.5,
        },
      }
    );
  }

  // 5. Section Display Titles Reveal
  document.querySelectorAll('[data-reveal-title]').forEach((title) => {
    gsap.from(title, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
      },
    });
  });

  // 6. Campaign Pinned Section (Responsive via gsap.matchMedia)
  const campaign = document.querySelector('[data-campaign]');
  const campFrame = document.querySelector('[data-campaign-frame]');
  const campImg = document.querySelector('[data-campaign-img]');
  const campL = document.querySelector('[data-campaign-l]');
  const campR = document.querySelector('[data-campaign-r]');
  const campCap = document.querySelector('[data-campaign-cap]');

  if (campaign && campFrame) {
    const campMm = gsap.matchMedia();

    campMm.add({
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)',
    }, (context) => {
      const { isMobile } = context.conditions;

      const campTl = gsap.timeline({
        scrollTrigger: {
          trigger: campaign,
          start: 'top top',
          end: isMobile ? '+=105%' : '+=130%',
          pin: true,
          scrub: 0.5,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      if (isMobile) {
        campTl
          .fromTo(
            campFrame,
            { clipPath: 'inset(24% 6% 22% 6%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out' },
            0
          )
          .fromTo(
            campImg,
            { scale: 1.15 },
            { scale: 1.0, ease: 'power1.out' },
            0
          )
          .fromTo(
            campL,
            { y: 0, opacity: 1 },
            { y: '-8vh', opacity: 0.15, ease: 'power1.out' },
            0
          )
          .fromTo(
            campR,
            { y: 0, opacity: 1 },
            { y: '-5vh', opacity: 0.12, ease: 'power1.out' },
            0
          )
          .fromTo(
            campFrame,
            { '--shade': 0 },
            { '--shade': 0.9, ease: 'power1.out' },
            0.2
          )
          .fromTo(
            campCap,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, ease: 'power2.out' },
            0.35
          );
      } else {
        campTl
          .fromTo(
            campFrame,
            { clipPath: 'inset(16% 24% 16% 24%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out' },
            0
          )
          .fromTo(
            campImg,
            { scale: 1.15 },
            { scale: 1.0, ease: 'power1.out' },
            0
          )
          .fromTo(
            campL,
            { x: 0, opacity: 1 },
            { x: '-18vw', opacity: 0.22, ease: 'power1.out' },
            0
          )
          .fromTo(
            campR,
            { x: 0, opacity: 1 },
            { x: '18vw', opacity: 0.22, ease: 'power1.out' },
            0
          )
          .fromTo(
            campFrame,
            { '--shade': 0 },
            { '--shade': 0.78, ease: 'power1.out' },
            0.2
          )
          .fromTo(
            campCap,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, ease: 'power2.out' },
            0.4
          );
      }
    });
  }

  // 7. Index Hover Floating Image (Rock-solid hide on scroll & unhover)
  const indexSection = document.querySelector('[data-index]');
  const floatEl = document.querySelector('[data-index-float]');
  const floatImg = floatEl?.querySelector('img');
  const indexLinks = document.querySelectorAll('.index__list a');

  if (indexSection && floatEl && floatImg) {
    let mouseX = -500;
    let mouseY = -500;
    let floatX = -500;
    let floatY = -500;
    let isFloatVisible = false;

    // Reset initial style
    gsap.set(floatEl, { opacity: 0, scale: 0.8, x: -500, y: -500 });

    function hideFloat() {
      if (!isFloatVisible) return;
      isFloatVisible = false;
      gsap.to(floatEl, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    function checkIndexHoverUnderPoint() {
      if (!isFloatVisible) return;
      const el = document.elementFromPoint(mouseX, mouseY);
      if (!el || !el.closest('.index__list a')) {
        hideFloat();
      }
    }

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    gsap.ticker.add(() => {
      if (isFloatVisible) {
        floatX += (mouseX - floatX) * 0.16;
        floatY += (mouseY - floatY) * 0.16;
        gsap.set(floatEl, { x: floatX + 24, y: floatY - 70 });
      }
    });

    indexLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        const src = link.dataset.indexImg;
        if (src) {
          floatImg.src = src;
          isFloatVisible = true;
          gsap.to(floatEl, {
            opacity: 1,
            scale: 1,
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      });
      link.addEventListener('mouseleave', () => {
        hideFloat();
      });
    });

    // Auto-hide float immediately on scroll, wheel, leave, blur
    window.addEventListener('scroll', checkIndexHoverUnderPoint, { passive: true });
    window.addEventListener('wheel', checkIndexHoverUnderPoint, { passive: true });
    lenis.on('scroll', checkIndexHoverUnderPoint);

    indexSection.addEventListener('mouseleave', hideFloat);
    document.addEventListener('mouseleave', hideFloat);
    window.addEventListener('blur', hideFloat);
  }

  // 8. Craft Parallax and Steps
  const parallaxImg = document.querySelector('[data-parallax]');
  if (parallaxImg) {
    gsap.to(parallaxImg, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: '#craft',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  document.querySelectorAll('.craft__steps li').forEach((step) => {
    gsap.from(step, {
      opacity: 0,
      y: 35,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: step,
        start: 'top 88%',
      },
    });
  });

  // 9. Marquee Continuous Loop
  const marqueeTrack = document.querySelector('[data-marquee]');
  if (marqueeTrack) {
    gsap.to(marqueeTrack, {
      xPercent: -50,
      repeat: -1,
      duration: 24,
      ease: 'linear',
    });
  }

  // 10. Footer Reveal & Back to Top
  const footerMark = document.querySelector('[data-footer-mark]');
  if (footerMark) {
    gsap.from(footerMark, {
      y: 60,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footerMark,
        start: 'top 95%',
      },
    });
  }

  // Unified smooth scroll for internal anchor links (with menu auto-close)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      closeMenu(true);

      if (href === '#top') {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.3, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        return;
      }

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        lenis.scrollTo(targetEl, { offset: -30, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      }
    });
  });

  document.querySelector('[data-to-top]')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeMenu(true);
    lenis.scrollTo(0, { duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  });

  // Newsletter form submission
  const form = document.querySelector('[data-newsletter]');
  const formMsg = document.querySelector('[data-newsletter-msg]');
  if (form && formMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value) {
        formMsg.textContent = '[ You have been added to the private list. Welcome to Evenstar. ]';
        input.value = '';
        gsap.from(formMsg, { opacity: 0, y: 6, duration: 0.4 });
      }
    });
  }

  // Handle viewport resize cleanly for all pinned ScrollTriggers (e.g. Inspect Mode toggle)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
  }, { passive: true });

  // Refresh ScrollTrigger after DOM has settled
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 400);

  return { lenis };
}
