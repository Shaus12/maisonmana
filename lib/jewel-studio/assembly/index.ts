// Entry point: turns a JewelDesign into renderable parts plus framing data.

import * as THREE from "three";
import type { JewelDesign } from "../core/types";
import type { GemBuild } from "../geometry/gem";
import { partsBox, type PieceParts } from "../geometry/parts";
import { buildBracelet } from "./bracelet";
import { buildEarrings } from "./earrings";
import { buildPendant } from "./pendant";
import { buildRing } from "./ring";

export interface PieceBuild {
  parts: PieceParts;
  /** The region the camera should frame (pendants exclude most of the chain). */
  focus: THREE.Sphere;
  /** Lowest point of the piece, for the contact shadow. */
  floorY: number;
  centreGem: GemBuild | null;
}

export function buildPiece(design: JewelDesign): PieceBuild {
  let parts: PieceParts;
  let focusParts: PieceParts | undefined;
  let centreGem: GemBuild | null = null;

  switch (design.type) {
    case "necklace": {
      const p = buildPendant(design);
      parts = p.parts;
      focusParts = p.focus;
      centreGem = p.gem;
      break;
    }
    case "bracelet": {
      const p = buildBracelet(design);
      parts = p.parts;
      break;
    }
    case "earring": {
      const p = buildEarrings(design);
      parts = p.parts;
      centreGem = p.gem;
      break;
    }
    default: {
      const p = buildRing(design);
      parts = p.parts;
      centreGem = p.gem;
    }
  }

  const box = partsBox(parts);
  const focus = (focusParts ? partsBox(focusParts) : box).getBoundingSphere(new THREE.Sphere());
  return { parts, focus, floorY: box.min.y, centreGem };
}
