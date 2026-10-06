import * as THREE from 'three';

// High-fidelity interactive draped luxury fabric physics for Three.js
export function createInteractiveCloth(clothMaterial) {
  const group = new THREE.Group();
  group.name = 'couture_cloth';

  const width = 2.4;
  const height = 2.8;
  const cols = 55;
  const rows = 55;

  const geometry = new THREE.PlaneGeometry(width, height, cols, rows);
  const posAttr = geometry.attributes.position;
  const uvAttr = geometry.attributes.uv;
  const count = posAttr.count;

  // Store rest/original positions and physical velocities
  const originalPos = new Float32Array(count * 3);
  const velocities = new Float32Array(count);
  const displacements = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);

    // Realistic catenary drape hanging from top pins
    const u = (x / width) + 0.5; // 0 to 1
    const v = (y / height) + 0.5; // 0 (bottom) to 1 (top)

    // Initial natural drape folds
    const drapeSag = Math.sin(u * Math.PI) * 0.25 * (1 - v);
    const verticalFolds = Math.sin(u * Math.PI * 6 + y * 1.5) * 0.08 * (1 - v * 0.6);
    const diagonalTension = Math.cos(u * Math.PI * 3 + v * Math.PI * 2) * 0.04;
    const z = drapeSag + verticalFolds + diagonalTension;

    posAttr.setZ(i, z);

    originalPos[i * 3] = x;
    originalPos[i * 3 + 1] = y;
    originalPos[i * 3 + 2] = z;
  }

  geometry.computeVertexNormals();

  const clothMesh = new THREE.Mesh(geometry, clothMaterial);
  clothMesh.castShadow = true;
  clothMesh.receiveShadow = true;
  group.add(clothMesh);

  // Minimalist atelier hanging rail & stand in dark bronze & brass
  const standGroup = new THREE.Group();

  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0x221f1c,
    metalness: 0.85,
    roughness: 0.35,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0x9e875a,
    metalness: 0.9,
    roughness: 0.3,
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0xdcd5c8,
    roughness: 0.92,
    metalness: 0.04,
  });

  // Top horizontal suspension rail
  const railGeo = new THREE.CylinderGeometry(0.024, 0.024, width * 1.15, 24);
  railGeo.rotateZ(Math.PI / 2);
  const rail = new THREE.Mesh(railGeo, brassMat);
  rail.position.set(0, height / 2 + 0.02, 0.02);
  standGroup.add(rail);

  // Rail finials
  for (const side of [-1, 1]) {
    const finialGeo = new THREE.SphereGeometry(0.045, 24, 24);
    const finial = new THREE.Mesh(finialGeo, bronzeMat);
    finial.position.set(side * (width * 0.58), height / 2 + 0.02, 0.02);
    standGroup.add(finial);
  }

  // Travertine base plinth
  const baseGeo = new THREE.CylinderGeometry(1.4, 1.5, 0.14, 48);
  const base = new THREE.Mesh(baseGeo, stoneMat);
  base.position.set(0, -height / 2 - 0.25, 0);
  base.receiveShadow = true;
  standGroup.add(base);

  // Vertical bronze support columns
  for (const side of [-1, 1]) {
    const colGeo = new THREE.CylinderGeometry(0.022, 0.026, height + 0.25, 20);
    const col = new THREE.Mesh(colGeo, bronzeMat);
    col.position.set(side * (width * 0.56), 0, 0);
    col.castShadow = true;
    standGroup.add(col);
  }

  group.add(standGroup);

  // Physics update method called in animation loop
  let waveTimer = 0;
  let mouseImpulseX = 0;
  let mouseImpulseY = 0;

  function applyImpulse(normX, normY, strength = 0.12) {
    mouseImpulseX = normX;
    mouseImpulseY = normY;

    // Apply ripple around the pointer hit area
    const hitU = (normX + 1) * 0.5;
    const hitV = (normY + 1) * 0.5;

    for (let i = 0; i < count; i++) {
      const u = uvAttr.getX(i);
      const v = uvAttr.getY(i);
      const dist = Math.hypot(u - hitU, v - hitV);
      if (dist < 0.35) {
        const factor = (1 - dist / 0.35) * (1 - v * 0.7); // Top is pinned, bottom moves freely
        velocities[i] += strength * factor * (Math.random() * 0.4 + 0.8);
      }
    }
  }

  function update(delta, elapsed, fabricStiffness = 0.92) {
    waveTimer += delta * 1.5;

    for (let i = 0; i < count; i++) {
      const u = uvAttr.getX(i);
      const v = uvAttr.getY(i);

      if (v > 0.98) {
        // Pinned to the top rail
        continue;
      }

      // Natural gentle ambient breathing fold
      const breath = Math.sin(waveTimer * 1.8 + u * 4 + v * 3) * 0.022 * (1 - v);

      // Spring-damper physics for ripple propagation
      const currentDisp = displacements[i];
      const force = -currentDisp * 6.5; // restore to rest
      velocities[i] += force * delta;
      velocities[i] *= fabricStiffness; // damping / stiffness
      displacements[i] += velocities[i];

      const z = originalPos[i * 3 + 2] + displacements[i] + breath;
      posAttr.setZ(i, z);
    }

    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();
  }

  return {
    group,
    clothMesh,
    update,
    applyImpulse,
  };
}
