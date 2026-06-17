/**
 * Quick smoke-test for renderPrompt.ts
 * Run: npx tsx lib/atelier/renderPrompt.test.ts
 */

import { buildImagePrompt } from "./renderPrompt";

const tests = [
  {
    label: "Three-stone, heart shape, pink diamond, rose gold, knife-edge",
    sel: {
      jewelryType: "ring",
      setting: "three-stone",
      shape: "heart",
      origin: "lab-grown",
      carat: 2.0,
      color: "pink",
      clarity: "VS1",
      metal: "rose-gold",
      band: "knife-edge",
    },
    summary: "טבעת · 2.00 ct · ורוד VS1 · זהב ורוד 18K · שלוש אבנים · סכין · לב · (מעבדה)",
  },
  {
    label: "Oval ring, hidden halo, white gold, 2ct, VS1, lab-grown",
    sel: {
      jewelryType: "ring",
      setting: "hidden-halo",
      shape: "oval",
      origin: "lab-grown",
      carat: 2.0,
      color: "colorless",
      clarity: "VS1",
      metal: "white-gold",
      band: "classic",
    },
    summary: "טבעת · 2.00 ct · לבן D-F VS1 · זהב לבן 18K · הידן הילה · קלאסי · אובל · (מעבדה)",
  },
  {
    label: "Round solitaire, yellow gold, 1.5ct, lab-grown",
    sel: {
      jewelryType: "ring",
      setting: "solitaire",
      shape: "round",
      origin: "lab-grown",
      carat: 1.5,
      color: "colorless",
      clarity: "VS2",
      metal: "yellow-gold",
      band: "knife-edge",
    },
    summary: "טבעת · 1.50 ct · זהב צהוב",
  },
  {
    label: "Fancy yellow pear ring, rose gold, 3ct, natural",
    sel: {
      jewelryType: "ring",
      setting: "halo",
      shape: "pear",
      origin: "natural",
      carat: 3.0,
      color: "yellow",
      clarity: "VS1",
      metal: "rose-gold",
      band: "pave-band",
    },
    summary: "טבעת · 3.00 ct · ורוד",
  },
];

console.log("\n" + "=".repeat(80));
console.log("MAISON MANA · ATELIER RENDER PROMPT SMOKE TEST");
console.log("=".repeat(80) + "\n");

for (const test of tests) {
  const prompt = buildImagePrompt(test.sel as any, test.summary);
  console.log(`▸ ${test.label}`);
  console.log(`  ${prompt}`);
  console.log(`  LENGTH: ${prompt.length} chars`);
  console.log();
}
