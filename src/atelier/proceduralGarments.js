import * as THREE from 'three';

// Procedural high-fashion 3D garments and atelier mannequin form
export function createAtelierMannequin() {
  const group = new THREE.Group();
  group.name = 'mannequin';

  // Materials
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x1f1d1a,
    roughness: 0.85,
    metalness: 0.1,
  });

  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0x2e2924,
    metalness: 0.8,
    roughness: 0.35,
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0xd6cebe,
    roughness: 0.9,
    metalness: 0.05,
  });

  // Circular travertine base plinth
  const plinthGeo = new THREE.CylinderGeometry(1.35, 1.45, 0.12, 48);
  const plinth = new THREE.Mesh(plinthGeo, stoneMat);
  plinth.position.y = -2.1;
  plinth.receiveShadow = true;
  group.add(plinth);

  // Plinth brass inset ring
  const ringGeo = new THREE.TorusGeometry(1.28, 0.015, 16, 48);
  ringGeo.rotateX(Math.PI / 2);
  const ring = new THREE.Mesh(ringGeo, bronzeMat);
  ring.position.y = -2.03;
  group.add(ring);

  // Cast bronze vertical stand pole
  const poleGeo = new THREE.CylinderGeometry(0.028, 0.032, 2.8, 24);
  const pole = new THREE.Mesh(poleGeo, bronzeMat);
  pole.position.y = -0.7;
  pole.castShadow = true;
  group.add(pole);

  // Wood neck finial
  const neckCapGeo = new THREE.CylinderGeometry(0.1, 0.14, 0.22, 32);
  const neckCap = new THREE.Mesh(neckCapGeo, woodMat);
  neckCap.position.y = 1.35;
  group.add(neckCap);

  const finialGeo = new THREE.SphereGeometry(0.08, 24, 24);
  const finial = new THREE.Mesh(finialGeo, bronzeMat);
  finial.position.y = 1.5;
  group.add(finial);

  // Minimal torso dress-form inside
  const torsoCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.25, 0),
    new THREE.Vector3(0.24, 1.05, 0),
    new THREE.Vector3(0.21, 0.6, 0),
    new THREE.Vector3(0.18, 0.2, 0),
    new THREE.Vector3(0.25, -0.3, 0),
    new THREE.Vector3(0.2, -0.7, 0),
    new THREE.Vector3(0, -0.72, 0),
  ]);
  const points = torsoCurve.getPoints(24);
  const lathePoints = points.map(p => new THREE.Vector2(Math.abs(p.x), p.y));
  const innerTorsoGeo = new THREE.LatheGeometry(lathePoints, 32);
  const innerTorso = new THREE.Mesh(innerTorsoGeo, woodMat);
  innerTorso.scale.set(0.92, 1, 0.85);
  group.add(innerTorso);

  return group;
}

// 01. The Bias Slip Dress
export function createSlipDress(clothMaterial) {
  const group = new THREE.Group();
  group.name = 'slip_dress';

  // Body drape profile (Lathe with subtle ripples)
  const segments = 48;
  const radialSegments = 40;
  const geometry = new THREE.BufferGeometry();

  const vertices = [];
  const uvs = [];
  const indices = [];

  // Generate parametric flared silk slip geometry
  for (let j = 0; j <= segments; j++) {
    const t = j / segments; // 0 (top chest) to 1 (hem)
    const y = 1.05 - t * 2.3; // 1.05 to -1.25

    // Silhouette radius by height
    let baseR = 0.28;
    if (t < 0.2) baseR = 0.27 + t * 0.05; // upper bust
    else if (t < 0.5) baseR = 0.28 - (t - 0.2) * 0.3; // waist pinch (0.19)
    else if (t < 0.75) baseR = 0.19 + (t - 0.5) * 0.45; // hips
    else baseR = 0.3025 + Math.pow(t - 0.75, 1.2) * 1.05; // flared floor drape

    for (let i = 0; i <= radialSegments; i++) {
      const u = i / radialSegments;
      const angle = u * Math.PI * 2;

      // Realistic fabric drape flutes and ripples
      const drapeFlute = Math.sin(angle * 5) * 0.035 * Math.pow(t, 1.4);
      const microFold = Math.cos(angle * 9 + t * 4) * 0.012 * t;
      const asymmetry = Math.sin(angle) * 0.02 * (1 - t);

      // Depth is slightly flatter than width (human oval cross section)
      const rx = (baseR + drapeFlute + microFold) * 1.15;
      const rz = (baseR + drapeFlute * 0.6 + asymmetry) * 0.88;

      const px = Math.cos(angle) * rx;
      const pz = Math.sin(angle) * rz;
      const py = y + Math.sin(angle * 4) * 0.025 * Math.pow(t, 2); // flowing hem curve

      vertices.push(px, py, pz);
      uvs.push(u * 2, t * 2);
    }
  }

  for (let j = 0; j < segments; j++) {
    for (let i = 0; i < radialSegments; i++) {
      const a = j * (radialSegments + 1) + i;
      const b = (j + 1) * (radialSegments + 1) + i;
      const c = (j + 1) * (radialSegments + 1) + (i + 1);
      const d = j * (radialSegments + 1) + (i + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const dressMesh = new THREE.Mesh(geometry, clothMaterial);
  dressMesh.castShadow = true;
  dressMesh.receiveShadow = true;
  group.add(dressMesh);

  // Spaghetti straps (left & right)
  const strapMat = clothMaterial.clone();
  for (const side of [-1, 1]) {
    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.12, 1.05, 0.16),
      new THREE.Vector3(side * 0.13, 1.28, 0.03),
      new THREE.Vector3(side * 0.11, 1.06, -0.15),
    ]);
    const strapGeo = new THREE.TubeGeometry(strapCurve, 20, 0.007, 8, false);
    const strapMesh = new THREE.Mesh(strapGeo, strapMat);
    group.add(strapMesh);
  }

  return group;
}

// 02. The Double-Breasted Overcoat
export function createOvercoat(clothMaterial) {
  const group = new THREE.Group();
  group.name = 'overcoat';

  // Structured coat body
  const segments = 44;
  const radialSegments = 36;
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let j = 0; j <= segments; j++) {
    const t = j / segments;
    const y = 1.25 - t * 2.55; // down to -1.3

    // Structured shoulder down to knee
    let rx = 0.44 - t * 0.08;
    let rz = 0.32 - t * 0.03;

    if (t < 0.25) {
      // Broad architectural shoulders
      rx = 0.46 - t * 0.2;
      rz = 0.28;
    } else if (t < 0.6) {
      // Straight tailored drop
      rx = 0.38 + (t - 0.25) * 0.08;
      rz = 0.3 + (t - 0.25) * 0.04;
    } else {
      // Clean A-line bottom
      rx = 0.42 + (t - 0.6) * 0.14;
      rz = 0.33 + (t - 0.6) * 0.08;
    }

    for (let i = 0; i <= radialSegments; i++) {
      const u = i / radialSegments;
      const angle = u * Math.PI * 2;

      // Coat lapel and overlap structure
      const isFront = Math.cos(angle) > 0.4 && Math.sin(angle) > -0.3 && Math.sin(angle) < 0.5;
      const lapelFold = (t < 0.35 && isFront) ? 0.045 : 0;
      const backVent = (t > 0.65 && Math.sin(angle) < -0.85) ? -0.03 : 0;

      const px = Math.sin(angle) * rx;
      const pz = Math.cos(angle) * rz + lapelFold + backVent;
      const py = y;

      vertices.push(px, py, pz);
      uvs.push(u * 2, t * 2);
    }
  }

  for (let j = 0; j < segments; j++) {
    for (let i = 0; i < radialSegments; i++) {
      const a = j * (radialSegments + 1) + i;
      const b = (j + 1) * (radialSegments + 1) + i;
      const c = (j + 1) * (radialSegments + 1) + (i + 1);
      const d = j * (radialSegments + 1) + (i + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const coatMesh = new THREE.Mesh(geometry, clothMaterial);
  coatMesh.castShadow = true;
  coatMesh.receiveShadow = true;
  group.add(coatMesh);

  // Broad notched lapels
  const lapelGeo = new THREE.BoxGeometry(0.18, 0.48, 0.02);
  for (const side of [-1, 1]) {
    const lapel = new THREE.Mesh(lapelGeo, clothMaterial);
    lapel.position.set(side * 0.15, 0.95, 0.28);
    lapel.rotation.set(0.15, side * 0.35, side * -0.2);
    lapel.castShadow = true;
    group.add(lapel);
  }

  // Tailored sleeves
  for (const side of [-1, 1]) {
    const sleeveCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.42, 1.15, 0.02),
      new THREE.Vector3(side * 0.48, 0.65, 0.05),
      new THREE.Vector3(side * 0.43, 0.05, 0.08),
    ]);
    const sleeveGeo = new THREE.TubeGeometry(sleeveCurve, 24, 0.11, 16, false);
    const sleeve = new THREE.Mesh(sleeveGeo, clothMaterial);
    sleeve.castShadow = true;
    group.add(sleeve);
  }

  // Horn buttons (Double-breasted 6-button configuration)
  const buttonMat = new THREE.MeshStandardMaterial({
    color: 0x1a1512,
    roughness: 0.3,
    metalness: 0.1,
  });
  const buttonGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.008, 16);
  buttonGeo.rotateX(Math.PI / 2);

  const buttonRows = [0.72, 0.48, 0.24];
  for (const y of buttonRows) {
    for (const x of [-0.07, 0.07]) {
      const btn = new THREE.Mesh(buttonGeo, buttonMat);
      btn.position.set(x, y, 0.31);
      group.add(btn);
    }
  }

  return group;
}

// 03. The One-Shoulder Evening Column
export function createColumnGown(clothMaterial) {
  const group = new THREE.Group();
  group.name = 'column_gown';

  const segments = 52;
  const radialSegments = 36;
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let j = 0; j <= segments; j++) {
    const t = j / segments;
    const y = 1.15 - t * 2.45; // down to -1.3

    // Dramatic column silhouette: fitted bodice, slim waist, long column
    let r = 0.24;
    if (t < 0.2) r = 0.25;
    else if (t < 0.45) r = 0.18 + (t - 0.2) * 0.08; // waist
    else if (t < 0.7) r = 0.22 + (t - 0.45) * 0.15; // hip
    else r = 0.26 + Math.pow(t - 0.7, 1.4) * 0.45; // subtle train flare

    for (let i = 0; i <= radialSegments; i++) {
      const u = i / radialSegments;
      const angle = u * Math.PI * 2;

      // Diagonal asymmetric folds from right shoulder to left hip
      const diagonalFold = Math.sin(angle * 2 + t * 6) * 0.03 * Math.exp(-t * 2);
      const fluting = Math.sin(angle * 7) * 0.02 * Math.pow(t, 2);

      const px = Math.sin(angle) * (r + diagonalFold) * 1.1;
      const pz = Math.cos(angle) * (r * 0.88 + diagonalFold);
      // Asymmetric neckline cut: right shoulder is high, left shoulder is dropped
      const asymTop = (t < 0.15) ? (Math.sin(angle) > 0 ? 0.12 * Math.sin(angle) : -0.15 * Math.sin(angle)) : 0;
      const py = y + asymTop;

      vertices.push(px, py, pz);
      uvs.push(u * 2, t * 2);
    }
  }

  for (let j = 0; j < segments; j++) {
    for (let i = 0; i < radialSegments; i++) {
      const a = j * (radialSegments + 1) + i;
      const b = (j + 1) * (radialSegments + 1) + i;
      const c = (j + 1) * (radialSegments + 1) + (i + 1);
      const d = j * (radialSegments + 1) + (i + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const gownMesh = new THREE.Mesh(geometry, clothMaterial);
  gownMesh.castShadow = true;
  gownMesh.receiveShadow = true;
  group.add(gownMesh);

  // Sculptural single strap wrapping over right shoulder
  const strapCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.08, 1.05, 0.22),
    new THREE.Vector3(0.2, 1.3, 0.04),
    new THREE.Vector3(0.12, 1.08, -0.2),
  ]);
  const strapGeo = new THREE.TubeGeometry(strapCurve, 20, 0.035, 12, false);
  const strap = new THREE.Mesh(strapGeo, clothMaterial);
  strap.castShadow = true;
  group.add(strap);

  return group;
}

// 04. The Sculpted Tailored Blazer
export function createSculptedBlazer(clothMaterial) {
  const group = new THREE.Group();
  group.name = 'sculpted_blazer';

  const segments = 36;
  const radialSegments = 32;
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let j = 0; j <= segments; j++) {
    const t = j / segments;
    const y = 1.2 - t * 1.6; // down to -0.4 (jacket length)

    let rx = 0.42;
    let rz = 0.26;

    if (t < 0.25) {
      rx = 0.43 - t * 0.2; // crisp padded shoulders
      rz = 0.25;
    } else if (t < 0.6) {
      rx = 0.3 + (t - 0.25) * 0.02; // pinched waist
      rz = 0.22;
    } else {
      rx = 0.32 + Math.pow(t - 0.6, 1.1) * 0.25; // flare peplum at hips
      rz = 0.25 + (t - 0.6) * 0.08;
    }

    for (let i = 0; i <= radialSegments; i++) {
      const u = i / radialSegments;
      const angle = u * Math.PI * 2;

      // Front open split
      const isFrontCenter = Math.cos(angle) > 0.85 && t > 0.4;
      const cut = isFrontCenter ? 0.05 : 0;

      const px = Math.sin(angle) * (rx - cut);
      const pz = Math.cos(angle) * rz;
      const py = y;

      vertices.push(px, py, pz);
      uvs.push(u * 2, t * 2);
    }
  }

  for (let j = 0; j < segments; j++) {
    for (let i = 0; i < radialSegments; i++) {
      const a = j * (radialSegments + 1) + i;
      const b = (j + 1) * (radialSegments + 1) + i;
      const c = (j + 1) * (radialSegments + 1) + (i + 1);
      const d = j * (radialSegments + 1) + (i + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const blazerMesh = new THREE.Mesh(geometry, clothMaterial);
  blazerMesh.castShadow = true;
  blazerMesh.receiveShadow = true;
  group.add(blazerMesh);

  // Peak lapels
  const lapelGeo = new THREE.BoxGeometry(0.14, 0.4, 0.016);
  for (const side of [-1, 1]) {
    const lapel = new THREE.Mesh(lapelGeo, clothMaterial);
    lapel.position.set(side * 0.12, 0.9, 0.24);
    lapel.rotation.set(0.18, side * 0.3, side * -0.22);
    lapel.castShadow = true;
    group.add(lapel);
  }

  // Set-in sleeves
  for (const side of [-1, 1]) {
    const sleeveCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.38, 1.1, 0.02),
      new THREE.Vector3(side * 0.44, 0.65, 0.05),
      new THREE.Vector3(side * 0.41, 0.15, 0.06),
    ]);
    const sleeveGeo = new THREE.TubeGeometry(sleeveCurve, 20, 0.095, 16, false);
    const sleeve = new THREE.Mesh(sleeveGeo, clothMaterial);
    sleeve.castShadow = true;
    group.add(sleeve);
  }

  // Single horn closure button
  const buttonMat = new THREE.MeshStandardMaterial({ color: 0x181512, roughness: 0.25, metalness: 0.1 });
  const btnGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.007, 16);
  btnGeo.rotateX(Math.PI / 2);
  const btn = new THREE.Mesh(btnGeo, buttonMat);
  btn.position.set(0, 0.52, 0.245);
  group.add(btn);

  return group;
}
