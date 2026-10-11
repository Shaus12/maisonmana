// Ring assembly: shank around the finger (XY plane, finger axis Z) with the
// head seated on top. Elongated stones sit north–south along the finger.

import * as THREE from "three";
import { DEFAULT_RING_SIZE, ringInnerRadius } from "../core/dimensions";
import type { GemShape, JewelDesign } from "../core/types";
import { buildGem, type GemBuild } from "../geometry/gem";
import { buildBezel, buildClawHead, buildHalo, buildHiddenHalo, headBaseY, headFootprint, prongRadius } from "../geometry/head";
import { mergeParts, placeMatrix, transformParts, type PieceParts } from "../geometry/parts";
import { buildShank } from "../geometry/shank";

const SIDE_MATCHING: ReadonlySet<GemShape> = new Set<GemShape>(["round", "oval", "cushion", "princess", "emerald", "radiant", "asscher"]);

/** Lift so the head's lowest point sinks `embed` mm into the shank top. */
function seatMatrix(gem: GemBuild, bottomLocalY: number, rTop: number, theta = 0, embed = 0.6) {
  const n = new THREE.Vector3(Math.sin(theta), Math.cos(theta), 0);
  const lift = rTop - embed - bottomLocalY;
  return placeMatrix(n.clone().multiplyScalar(lift), n);
}

function headParts(gem: GemBuild, head: string): { parts: PieceParts; bottom: number; embed: number } {
  if (head === "bezel") {
    return { parts: buildBezel(gem), bottom: gem.culetY - 0.61, embed: 0.3 };
  }
  const claws = buildClawHead(gem);
  const extra = head === "halo" ? buildHalo(gem) : head === "hidden-halo" ? buildHiddenHalo(gem) : null;
  return { parts: extra ? mergeParts(claws, extra) : claws, bottom: headBaseY(gem), embed: 0.6 };
}

export function buildRing(design: JewelDesign) {
  const head = design.head ?? "solitaire";
  const gem = buildGem(design.shape, design.carat);
  const ri = ringInnerRadius(design.ringSize ?? DEFAULT_RING_SIZE);
  const width = Math.min(2.6, Math.max(1.8, 1.75 + design.carat * 0.15));
  const thickness = 1.7;
  const rTop = ri + thickness;

  const centre = headParts(gem, head);
  const centreM = seatMatrix(gem, centre.bottom, rTop, 0, centre.embed);
  const pieces: PieceParts[] = [transformParts(centre.parts, centreM)];
  const gems = [{ gem, matrix: centreM }];

  let clearance = (headFootprint(gem, head === "halo") * Math.min(1, gem.dims.width / Math.max(gem.dims.width, gem.dims.length)) + 0.35) / rTop;

  if (head === "three-stone") {
    const sideShape: GemShape = SIDE_MATCHING.has(design.shape) ? design.shape : "round";
    const side = buildGem(sideShape, Math.max(0.12, design.carat * 0.33));
    const arc = gem.dims.width / 2 + side.dims.width / 2 + prongRadius(gem) + 0.25;
    const theta = arc / rTop;
    for (const sign of [1, -1]) {
      const m = seatMatrix(side, headBaseY(side), rTop, sign * theta, 0.45);
      pieces.push(transformParts(buildClawHead(side), m));
      gems.push({ gem: side, matrix: m });
    }
    clearance = theta + (side.dims.width / 2 + prongRadius(side) + 0.3) / rTop;
  }

  pieces.push(buildShank({
    style: design.band ?? "classic",
    innerRadius: ri,
    width,
    thickness,
    headClearance: clearance,
    addPave: head === "pave",
  }));

  const parts = mergeParts(...pieces);
  parts.gems.push(...gems);
  return { parts, gem };
}
