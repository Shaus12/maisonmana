// Girdle outlines for every shape, as parametric curves in the XZ plane.
// Convention: x = width, z = length (+z is the pear tip / heart cleft),
// u ∈ [0, 2π) with the 8 "main" directions at u = k·π/4.

import type { GemShape } from "../core/types";

export type Vec2 = [number, number];

export interface Octagon {
  hx: number;
  hz: number;
  cut: number;
}

export interface Outline {
  at(u: number): Vec2;
  /** Unit outward normal at u. */
  normal(u: number): Vec2;
  /** Area centroid — the optical centre the facets converge to. */
  center: Vec2;
  /** Present for step-cut polygons. */
  octagon?: Octagon;
}

const TAU = Math.PI * 2;

function wrap(u: number) {
  return ((u % TAU) + TAU) % TAU;
}

function octagonVertices({ hx, hz, cut }: Octagon): Vec2[] {
  const c = Math.min(cut, hx, hz);
  return [
    [hx, -(hz - c)], [hx, hz - c], [hx - c, hz], [-(hx - c), hz],
    [-hx, hz - c], [-hx, -(hz - c)], [-(hx - c), -hz], [hx - c, -hz],
  ];
}

/** Insets a cut-corner rectangle by d, keeping 45° corners (used for step facets). */
export function insetOctagon(o: Octagon, d: number): Vec2[] {
  const hx = Math.max(0, o.hx - d);
  const hz = Math.max(0, o.hz - d);
  const cut = Math.max(0, Math.min(o.cut - (2 - Math.SQRT2) * d, hx, hz));
  return octagonVertices({ hx, hz, cut });
}

function octagonAt(o: Octagon, u: number): Vec2 {
  const verts = octagonVertices(o);
  const t = (wrap(u) + Math.PI / 8) / (Math.PI / 4);
  const i = Math.floor(t) % 8;
  const f = t - Math.floor(t);
  const a = verts[i];
  const b = verts[(i + 1) % 8];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}

// Raw curves at arbitrary scale; normalised to the target size below.
function rawCurve(shape: GemShape, u: number): Vec2 {
  const c = Math.cos(u);
  const s = Math.sin(u);
  switch (shape) {
    case "cushion": {
      const n = 3.2;
      return [Math.sign(c) * Math.abs(c) ** (2 / n), Math.sign(s) * Math.abs(s) ** (2 / n)];
    }
    case "princess": {
      const m = Math.max(Math.abs(c), Math.abs(s));
      return [c / m, s / m];
    }
    case "pear": {
      const t = u - Math.PI / 2;
      return [-Math.sin(t) * Math.abs(Math.sin(t / 2)), Math.cos(t)];
    }
    case "heart": {
      const t = Math.PI / 2 - u;
      return [
        16 * Math.sin(t) ** 3,
        13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t),
      ];
    }
    default:
      return [c, s];
  }
}

function normalisedCurve(shape: GemShape, width: number, length: number) {
  const samples = 720;
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < samples; i++) {
    const [x, z] = rawCurve(shape, (i / samples) * TAU);
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
  }
  const cx = (minX + maxX) / 2, cz = (minZ + maxZ) / 2;
  const sx = width / (maxX - minX), sz = length / (maxZ - minZ);
  return (u: number): Vec2 => {
    const [x, z] = rawCurve(shape, u);
    return [(x - cx) * sx, (z - cz) * sz];
  };
}

function marquiseCurve(width: number, length: number) {
  const R = (width * width + length * length) / (4 * width);
  const d = R - width / 2;
  return (u: number): Vec2 => {
    const z = (length / 2) * Math.sin(u);
    const x = Math.sign(Math.cos(u)) * Math.max(0, Math.sqrt(R * R - z * z) - d);
    return [x, z];
  };
}

function centroid(at: (u: number) => Vec2): Vec2 {
  const n = 360;
  let area = 0, cx = 0, cz = 0;
  for (let i = 0; i < n; i++) {
    const [x0, z0] = at((i / n) * TAU);
    const [x1, z1] = at(((i + 1) / n) * TAU);
    const cross = x0 * z1 - x1 * z0;
    area += cross;
    cx += (x0 + x1) * cross;
    cz += (z0 + z1) * cross;
  }
  if (Math.abs(area) < 1e-9) return [0, 0];
  return [cx / (3 * area), cz / (3 * area)];
}

export function createOutline(shape: GemShape, width: number, length: number): Outline {
  let at: (u: number) => Vec2;
  let octagon: Octagon | undefined;

  if (shape === "emerald" || shape === "asscher" || shape === "radiant") {
    const cutFraction = shape === "asscher" ? 0.25 : shape === "emerald" ? 0.16 : 0.13;
    octagon = { hx: width / 2, hz: length / 2, cut: width * cutFraction };
    const o = octagon;
    at = (u) => octagonAt(o, u);
  } else if (shape === "marquise") {
    at = marquiseCurve(width, length);
  } else {
    at = normalisedCurve(shape, width, length);
  }

  const center = centroid(at);
  const normal = (u: number): Vec2 => {
    const e = 1e-3;
    const a = at(u - e), b = at(u + e), p = at(u);
    const tx = b[0] - a[0], tz = b[1] - a[1];
    const len = Math.hypot(tx, tz) || 1;
    let nx = tz / len, nz = -tx / len;
    if (nx * (p[0] - center[0]) + nz * (p[1] - center[1]) < 0) { nx = -nx; nz = -nz; }
    return [nx, nz];
  };

  return { at, normal, center, octagon };
}

/** Evenly spaced (in parameter) points around the outline. */
export function outlinePoints(outline: Outline, count: number, offset = 0): Vec2[] {
  return Array.from({ length: count }, (_, i) => {
    const u = (i / count) * TAU;
    const [x, z] = outline.at(u);
    if (!offset) return [x, z];
    const [nx, nz] = outline.normal(u);
    return [x + nx * offset, z + nz * offset];
  });
}
