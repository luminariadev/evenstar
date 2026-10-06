import * as THREE from 'three';

// Generates procedural micro-weave normal/bump maps for fabrics
export function createWeaveTexture(type = 'twill') {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let val = 128;
      const idx = (y * size + x) * 4;

      if (type === 'twill') {
        // Diagonal twill weave (wool & suits)
        const diag = (x + y * 2) % 8;
        val = diag < 4 ? 165 : 95;
        val += (Math.sin(x * 0.8) + Math.cos(y * 0.8)) * 12;
      } else if (type === 'plain') {
        // Plain fine weave (silk & satin)
        const wx = (x % 4 < 2) ? 1 : -1;
        const wy = (y % 4 < 2) ? 1 : -1;
        val = 128 + wx * wy * 24;
      } else if (type === 'linen') {
        // Slubby uneven natural linen weave
        const wx = Math.sin(x * 0.5) * 20;
        const wy = Math.sin(y * 0.3) * 25;
        const noise = (Math.random() - 0.5) * 30;
        val = 128 + wx + wy + noise;
      } else if (type === 'velvet') {
        // Fine pile micro-grain
        const noise = (Math.random() - 0.5) * 45;
        val = 128 + noise;
      }

      val = Math.max(0, Math.min(255, val));
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);
  texture.needsUpdate = true;
  return texture;
}
