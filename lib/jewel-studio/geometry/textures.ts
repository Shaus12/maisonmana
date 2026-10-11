// Procedural normal maps (no image assets) for textured metal finishes.

import * as THREE from "three";

export type SurfaceTexture = "hammered" | "scroll";

const SIZE = 256;
const cache = new Map<SurfaceTexture, THREE.DataTexture>();

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Hammer strikes: the height is the distance to the nearest strike centre (Voronoi dimples). */
function hammeredHeight(): Float32Array {
  const r = rand(7);
  const cells = Array.from({ length: 70 }, () => [r() * SIZE, r() * SIZE] as const);
  const h = new Float32Array(SIZE * SIZE);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let best = Infinity;
      for (const [cx, cy] of cells) {
        // tileable distance
        const dx = Math.min(Math.abs(x - cx), SIZE - Math.abs(x - cx));
        const dy = Math.min(Math.abs(y - cy), SIZE - Math.abs(y - cy));
        best = Math.min(best, dx * dx + dy * dy);
      }
      h[y * SIZE + x] = Math.sqrt(best) / 22;
    }
  }
  return h;
}

/** Engraved scrollwork: repeating spirals cut into the surface. */
function scrollHeight(): Float32Array {
  const h = new Float32Array(SIZE * SIZE);
  const cell = SIZE / 4;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const lx = (x % cell) - cell / 2;
      const ly = (y % cell) - cell / 2;
      const flip = (Math.floor(x / cell) + Math.floor(y / cell)) % 2 ? -1 : 1;
      const radius = Math.hypot(lx, ly);
      const angle = Math.atan2(ly, lx) * flip;
      const spiral = Math.sin(radius * 0.55 - angle * 2);
      const groove = Math.max(0, spiral - 0.55) / 0.45;
      h[y * SIZE + x] = radius < cell * 0.48 ? -groove : 0;
    }
  }
  return h;
}

function heightToNormal(h: Float32Array, strength: number): THREE.DataTexture {
  const data = new Uint8Array(SIZE * SIZE * 4);
  const at = (x: number, y: number) => h[((y + SIZE) % SIZE) * SIZE + ((x + SIZE) % SIZE)];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * SIZE + x) * 4;
      data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      data[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, SIZE, SIZE, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

export function surfaceNormalMap(kind: SurfaceTexture): THREE.DataTexture {
  let texture = cache.get(kind);
  if (!texture) {
    texture = kind === "hammered" ? heightToNormal(hammeredHeight(), 1.4) : heightToNormal(scrollHeight(), 1.1);
    cache.set(kind, texture);
  }
  return texture;
}
