// Turns MediaPipe hand landmarks into a ring pose: where on screen the ring
// sits, which way the finger runs, which side is the back of the hand (where
// the stone faces) and how many screen pixels one millimetre covers there.
// Pure math — no DOM, no three.js — so it can be tested headlessly.

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export type V3 = [number, number, number];

/** Maps normalised landmark coordinates to display pixels (origin top-left). */
export interface FrameMap {
  /** Media size in its own pixels, and the media→display scale. */
  mediaW: number;
  mediaH: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  toPixels(x: number, y: number): [number, number];
}

export interface RingPose {
  /** Ring centre in display pixels, origin top-left. */
  x: number;
  y: number;
  /** Unit vector along the finger (towards the fingertip), view space: x right, y up, z towards camera. */
  axis: V3;
  /** Unit vector from the finger to the back of the hand — where the stone points. */
  up: V3;
  /** Display pixels per millimetre at the finger. */
  pxPerMm: number;
}

// Hand landmark indices (MediaPipe hand model).
const WRIST = 0;
const INDEX_MCP = 5;
const RING_MCP = 13;
const RING_PIP = 14;
const PINKY_MCP = 17;

/** A ring sits about halfway along the base phalanx (checked against a photo of a worn ring). */
const RING_SEAT = 0.5;

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const scale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/**
 * Finger width from hand proportions, measured on 3D lengths so tilt does not
 * shrink them: ring-finger width ≈ 0.41 × its base phalanx and ≈ 0.30 × the
 * index-to-pinky knuckle span. (MediaPipe's metric "world" landmarks collapse
 * the knuckles on real photos, so they are not used for size or direction.)
 */
const WIDTH_PER_PHALANX = 0.41;
const WIDTH_PER_KNUCKLES = 0.3;

const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);

/**
 * @param image normalised image landmarks (21). Their z is relative depth on
 *              the same scale as x, so they give a usable 3D hand.
 * @param rightHand the person's actual hand
 * @param innerDiameterMm the ring's inner diameter; the ring is fitted to the finger
 */
export function ringPose(image: Landmark[], rightHand: boolean, map: FrameMap, innerDiameterMm: number): RingPose | null {
  if (image.length < 21) return null;
  const depth = map.mediaW * map.scale;
  // Display pixels, then view space (x right, y up, z towards camera) — a rotation, not a reflection.
  const P = image.map((l): V3 => {
    const [x, y] = map.toPixels(l.x, l.y);
    return [x, y, l.z * depth];
  });
  const V = P.map(([x, y, z]): V3 => [x, -y, -z]);

  const x = P[RING_MCP][0] + (P[RING_PIP][0] - P[RING_MCP][0]) * RING_SEAT;
  const y = P[RING_MCP][1] + (P[RING_PIP][1] - P[RING_MCP][1]) * RING_SEAT;

  const axis = norm(sub(V[RING_PIP], V[RING_MCP]));

  // For a right hand, (index − wrist) × (pinky − wrist) points out of the palm;
  // the back of the hand is the opposite side. A left hand mirrors this.
  const palmOut = norm(cross(sub(V[INDEX_MCP], V[WRIST]), sub(V[PINKY_MCP], V[WRIST])));
  const back = rightHand ? scale(palmOut, -1) : palmOut;
  const up = norm(sub(back, scale(axis, dot(back, axis))));

  const phalanx = len(sub(V[RING_PIP], V[RING_MCP]));
  const knuckles = len(sub(V[PINKY_MCP], V[INDEX_MCP]));
  const fingerPx = (WIDTH_PER_PHALANX * phalanx + WIDTH_PER_KNUCKLES * knuckles) / 2;
  if (!(fingerPx > 1) || !(innerDiameterMm > 0)) return null;

  return { x, y, axis, up, pxPerMm: fingerPx / innerDiameterMm };
}

/**
 * Frame map for media drawn with CSS object-fit `cover` or `contain` into a
 * box of `boxW × boxH` pixels.
 */
export function fitFrame(mediaW: number, mediaH: number, boxW: number, boxH: number, fit: "cover" | "contain"): FrameMap {
  const s = fit === "cover" ? Math.max(boxW / mediaW, boxH / mediaH) : Math.min(boxW / mediaW, boxH / mediaH);
  const offsetX = (boxW - mediaW * s) / 2;
  const offsetY = (boxH - mediaH * s) / 2;
  return {
    mediaW,
    mediaH,
    scale: s,
    offsetX,
    offsetY,
    toPixels: (nx, ny) => [offsetX + nx * mediaW * s, offsetY + ny * mediaH * s],
  };
}
