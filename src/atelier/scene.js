import * as THREE from 'three';
import gsap from 'gsap';
import { FABRICS, FABRIC_ORDER } from './fabrics.js';
import { createWeaveTexture } from './textures.js';
import { createInteractiveCloth } from './clothSimulation.js';

export const SILHOUETTES = [
  {
    id: 'slip',
    name: 'Bias Slip Dress',
    cat: 'Womenswear',
    code: 'W—SL01',
    time: '18 hrs hand-cut',
    defaultFabric: 'silk',
    image: '/images/w-slip-dress.webp',
    notes: 'Bias-cut drape over hip curve, French bound seams.',
  },
  {
    id: 'overcoat',
    name: 'Double Overcoat',
    cat: 'Menswear / Unisex',
    code: 'M—CT04',
    time: '31 hrs hand-cut',
    defaultFabric: 'cashmere',
    image: '/images/m-overcoat.webp',
    notes: 'Hand-padded canvas chest, horn buttons, deep rear vent.',
  },
  {
    id: 'gown',
    name: 'One-Shoulder Gown',
    cat: 'Evening',
    code: 'W—EV02',
    time: '24 hrs hand-cut',
    defaultFabric: 'velvet',
    image: '/images/w-oxblood-gown.webp',
    notes: 'Sculptural asymmetric shoulder, diagonal waist folds.',
  },
  {
    id: 'blazer',
    name: 'Sculpted Blazer',
    cat: 'Tailoring',
    code: 'U—JK03',
    time: '22 hrs hand-cut',
    defaultFabric: 'flannel',
    image: '/images/w-tailored-suit.webp',
    notes: 'Roped sleevehead, sharp peak lapel, suppressed waist.',
  },
];

export function initAtelierScene(containerEl) {
  const canvas = containerEl.querySelector('[data-atelier-canvas]');
  if (!canvas) return null;

  const stage = containerEl.querySelector('.atelier__stage');

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x12110f, 0.04);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(0, 0.2, 5.2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Fabric Bump Textures
  const bumpTextures = {
    plain: createWeaveTexture('plain'),
    twill: createWeaveTexture('twill'),
    linen: createWeaveTexture('linen'),
    velvet: createWeaveTexture('velvet'),
  };

  // Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.1);
  scene.add(ambientLight);

  // Key Studio Spotlight that subtly follows cursor
  const keySpot = new THREE.SpotLight(0xffeed9, 4.5);
  keySpot.position.set(2.8, 3.8, 3.8);
  keySpot.angle = Math.PI / 4.5;
  keySpot.penumbra = 0.8;
  keySpot.decay = 1.8;
  keySpot.distance = 18;
  keySpot.castShadow = true;
  keySpot.shadow.mapSize.width = 1024;
  keySpot.shadow.mapSize.height = 1024;
  keySpot.shadow.bias = -0.0005;
  scene.add(keySpot);

  // Cool rim / grazing backlight
  const rimLight = new THREE.DirectionalLight(0xaed0f0, 2.2);
  rimLight.position.set(-3.5, 2.5, -2.8);
  scene.add(rimLight);

  // Soft warm bounce
  const bounceLight = new THREE.DirectionalLight(0xe8caa2, 0.8);
  bounceLight.position.set(0, -2, 2.5);
  scene.add(bounceLight);

  // Turntable Container
  const turntable = new THREE.Group();
  scene.add(turntable);

  // Interactive Cloth Physical Material
  let currentFabricKey = SILHOUETTES[0].defaultFabric;
  let currentSilhouetteIndex = 0;

  const clothMaterial = new THREE.MeshPhysicalMaterial({
    side: THREE.DoubleSide,
    roughness: 0.35,
    metalness: 0.05,
    clearcoat: 0.15,
    clearcoatRoughness: 0.25,
  });

  function applyFabric(fabricKey) {
    currentFabricKey = fabricKey;
    const fab = FABRICS[fabricKey];
    if (!fab) return;

    clothMaterial.color.set(fab.color);
    clothMaterial.roughness = fab.roughness;
    clothMaterial.sheen = fab.sheen;
    clothMaterial.sheenRoughness = fab.sheenRoughness;
    clothMaterial.sheenColor = new THREE.Color(fab.sheenColor);

    let texType = 'plain';
    if (fabricKey === 'flannel' || fabricKey === 'cashmere') texType = 'twill';
    else if (fabricKey === 'linen') texType = 'linen';
    else if (fabricKey === 'velvet') texType = 'velvet';

    clothMaterial.bumpMap = bumpTextures[texType];
    clothMaterial.bumpScale = fab.bump * 0.016;
    clothMaterial.needsUpdate = true;
  }

  applyFabric(currentFabricKey);

  // Mount Interactive Cloth
  const cloth = createInteractiveCloth(clothMaterial);
  turntable.add(cloth.group);

  // Pointer drag and ripple mechanics
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;
  let targetRotationY = 0;
  let targetRotationX = 0;
  let currentRotationY = 0;
  let currentRotationX = 0;
  let velocityY = 0;

  function onPointerDown(e) {
    isDragging = true;
    prevX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    prevY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    velocityY = 0;

    // Apply interactive ripple on point of click
    const rect = canvas.getBoundingClientRect();
    const nx = ((prevX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((prevY - rect.top) / rect.height) * 2 - 1);
    cloth.applyImpulse(nx, ny, 0.18);
  }

  function onPointerMove(e) {
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const y = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    const rect = canvas.getBoundingClientRect();
    const nx = ((x - rect.left) / rect.width) * 2 - 1;
    const ny = -(((y - rect.top) / rect.height) * 2 - 1);

    // Spotlight follows cursor smoothly
    keySpot.position.x = 2.8 + nx * 1.5;
    keySpot.position.y = 3.8 + ny * 1.0;

    if (!isDragging) {
      // Light surface ripple on hover
      if (Math.random() < 0.15) {
        cloth.applyImpulse(nx, ny, 0.04);
      }
      return;
    }

    const dx = x - prevX;
    const dy = y - prevY;

    targetRotationY += dx * 0.007;
    targetRotationX += dy * 0.003;
    targetRotationX = Math.max(-0.2, Math.min(0.2, targetRotationX));

    velocityY = dx * 0.007;
    prevX = x;
    prevY = y;

    cloth.applyImpulse(nx, ny, 0.1);
  }

  function onPointerUp() {
    isDragging = false;
  }

  stage.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  stage.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Responsive Canvas Resize
  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  resize();

  // Optimized Animation Loop: Pauses when section is offscreen!
  let isSectionVisible = true;
  let frameId = 0;
  const clock = new THREE.Clock();

  function animate() {
    if (!isSectionVisible) return;
    frameId = requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.getElapsedTime();

    // Idle turntable rotation when not dragging
    if (!isDragging) {
      targetRotationY += 0.0028;
      targetRotationY += velocityY;
      velocityY *= 0.94;
    }

    currentRotationY += (targetRotationY - currentRotationY) * 0.08;
    currentRotationX += (targetRotationX - currentRotationX) * 0.08;

    turntable.rotation.y = currentRotationY;
    turntable.rotation.x = currentRotationX;

    // Update physical cloth ripples and drape waves
    cloth.update(delta, elapsed, 0.93);

    renderer.render(scene, camera);
  }

  // IntersectionObserver to save GPU/CPU when not in view
  const io = new IntersectionObserver(([entry]) => {
    isSectionVisible = entry.isIntersecting;
    if (isSectionVisible) {
      clock.getDelta(); // flush delta spike
      cancelAnimationFrame(frameId);
      animate();
    }
  }, { threshold: 0.02 });

  io.observe(containerEl);
  animate();

  // Bind Atelier Controls
  bindAtelierUI(containerEl, {
    onSelectSilhouette: (idx) => {
      currentSilhouetteIndex = idx;
      const sil = SILHOUETTES[idx];
      applyFabric(sil.defaultFabric);
      updateSpec(containerEl, sil, FABRICS[sil.defaultFabric]);

      // Subtle ripple trigger on cloth when switching
      cloth.applyImpulse(0, 0, 0.22);
      gsap.fromTo(turntable.scale, { y: 0.92 }, { y: 1, duration: 0.5, ease: 'back.out(2)' });
    },
    onSelectFabric: (key) => {
      applyFabric(key);
      updateSpec(containerEl, SILHOUETTES[currentSilhouetteIndex], FABRICS[key]);
      cloth.applyImpulse(0, -0.2, 0.2);
    },
  });

  return {
    destroy: () => {
      cancelAnimationFrame(frameId);
      io.disconnect();
      resizeObserver.disconnect();
      renderer.dispose();
      stage.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
    },
  };
}

function bindAtelierUI(containerEl, { onSelectSilhouette, onSelectFabric }) {
  const piecesContainer = containerEl.querySelector('[data-pieces]');
  const swatchesContainer = containerEl.querySelector('[data-swatches]');
  const indexEl = containerEl.querySelector('[data-piece-index]');
  const fabricNameEl = containerEl.querySelector('[data-fabric-name]');

  // Render silhouette buttons
  if (piecesContainer) {
    piecesContainer.innerHTML = SILHOUETTES.map((sil, i) => `
      <button class="piece-btn ${i === 0 ? 'is-active' : ''}" data-sil-idx="${i}" role="radio" aria-checked="${i === 0}">
        <span class="mono">${sil.cat}</span>
        <strong>${sil.name}</strong>
      </button>
    `).join('');

    piecesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.piece-btn');
      if (!btn) return;
      const idx = parseInt(btn.dataset.silIdx, 10);
      piecesContainer.querySelectorAll('.piece-btn').forEach((b, i) => {
        b.classList.toggle('is-active', i === idx);
        b.setAttribute('aria-checked', i === idx ? 'true' : 'false');
      });
      if (indexEl) indexEl.textContent = `0${idx + 1} / 0${SILHOUETTES.length}`;
      onSelectSilhouette(idx);
    });
  }

  // Render fabric swatches
  if (swatchesContainer) {
    swatchesContainer.innerHTML = FABRIC_ORDER.map((key, i) => {
      const fab = FABRICS[key];
      const grad = `linear-gradient(135deg, ${fab.swatch[0]}, ${fab.swatch[1]})`;
      return `
        <button
          class="swatch ${i === 0 ? 'is-active' : ''}"
          data-fabric-key="${key}"
          role="radio"
          aria-label="${fab.name}"
          aria-checked="${i === 0}"
          style="background: ${grad}"
          title="${fab.name} (${fab.origin})"
        ></button>
      `;
    }).join('');

    swatchesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.swatch');
      if (!btn) return;
      const key = btn.dataset.fabricKey;
      swatchesContainer.querySelectorAll('.swatch').forEach(b => {
        const active = b.dataset.fabricKey === key;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-checked', active ? 'true' : 'false');
      });
      if (fabricNameEl && FABRICS[key]) fabricNameEl.textContent = FABRICS[key].name;
      onSelectFabric(key);
    });
  }

  updateSpec(containerEl, SILHOUETTES[0], FABRICS[SILHOUETTES[0].defaultFabric]);
}

function updateSpec(containerEl, silhouette, fabric) {
  const specEl = containerEl.querySelector('[data-spec]');
  const fabricNameEl = containerEl.querySelector('[data-fabric-name]');
  const swatchesContainer = containerEl.querySelector('[data-swatches]');

  if (fabricNameEl) fabricNameEl.textContent = fabric.name;

  if (swatchesContainer) {
    swatchesContainer.querySelectorAll('.swatch').forEach(b => {
      const active = FABRICS[b.dataset.fabricKey]?.name === fabric.name;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  }

  if (specEl) {
    specEl.innerHTML = `
      <div><dt class="mono">Reference</dt><dd>${silhouette.code}</dd></div>
      <div><dt class="mono">Hand-Craft</dt><dd>${silhouette.time}</dd></div>
      <div><dt class="mono">Fabric Origin</dt><dd>${fabric.origin}</dd></div>
      <div><dt class="mono">Weight / Hand</dt><dd>${fabric.weight}</dd></div>
    `;
  }

  // Synchronize Lookbook Card
  const cardImg = containerEl.querySelector('[data-atelier-img]');
  const cardName = containerEl.querySelector('[data-atelier-name]');
  const cardCode = containerEl.querySelector('[data-atelier-code]');
  const cardNotes = containerEl.querySelector('[data-atelier-notes]');

  if (cardImg && silhouette.image) {
    gsap.to(cardImg, {
      opacity: 0.2,
      duration: 0.2,
      onComplete: () => {
        cardImg.src = silhouette.image;
        cardImg.alt = silhouette.name;
        gsap.to(cardImg, { opacity: 1, duration: 0.35 });
      },
    });
  }
  if (cardName) cardName.textContent = silhouette.name;
  if (cardCode) cardCode.textContent = silhouette.code;
  if (cardNotes) cardNotes.textContent = `${silhouette.time} — ${silhouette.notes}`;
}
