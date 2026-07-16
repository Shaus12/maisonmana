const fs = require('fs');
let data = fs.readFileSync('lib/products.ts', 'utf8');

const productsToFix = [
  { id: '03', goldHe: 'זהב צהוב 14K', goldEn: '14K Yellow Gold' },
  { id: '04', goldHe: 'זהב צהוב 14K', goldEn: '14K Yellow Gold' },
  { id: '08', goldHe: 'רוז גולד 14K', goldEn: '14K Rose Gold' },
  { id: '09', goldHe: 'רוז גולד 14K', goldEn: '14K Rose Gold' },
  { id: '10', goldHe: 'זהב צהוב 14K', goldEn: '14K Yellow Gold' },
  { id: '11', goldHe: 'זהב לבן 14K', goldEn: '14K White Gold' },
  { id: '12', goldHe: 'רוז גולד 14K', goldEn: '14K Rose Gold' },
  { id: '13', goldHe: 'זהב לבן 14K', goldEn: '14K White Gold' },
  { id: '02', goldHe: 'זהב 14K', goldEn: '14K Gold' },
  { id: '05', goldHe: 'זהב 14K', goldEn: '14K Gold' },
  { id: '06', goldHe: 'זהב 14K', goldEn: '14K Gold' },
  { id: '07', goldHe: 'זהב 14K', goldEn: '14K Gold' },
];

for (const p of productsToFix) {
  const blockStart = data.indexOf(`  "ring-product-${p.id}": {`);
  if (blockStart === -1) continue;
  
  let nextBlock = data.indexOf(`\n  "`, blockStart + 10);
  if (nextBlock === -1) nextBlock = data.indexOf(`\n};`, blockStart);
  if (nextBlock === -1) nextBlock = data.length;
  
  let block = data.substring(blockStart, nextBlock);
  
  // Replace options: [goldColorOption, ringSizeOption] with options: [ringSizeOption]
  block = block.replace('options: [goldColorOption, ringSizeOption]', 'options: [ringSizeOption]');
  
  // Replace METAL spec just in case it wasn't replaced properly last time
  block = block.replace(/\{\s*label:\s*METAL,\s*value:\s*lv\([^)]+\)\s*\}/, `{ label: METAL, value: lv("${p.goldHe}", "${p.goldEn}") }`);
  
  data = data.substring(0, blockStart) + block + data.substring(nextBlock);
}

fs.writeFileSync('lib/products.ts', data);
