/**
 * Builds a detailed English image-generation prompt from the Atelier design selections.
 *
 * The prompt is structured for photorealistic macro product photography of
 * real wearable jewelry. It emphasizes physically plausible construction,
 * accurate stone setting, and professional high-end jewelry photography.
 */

interface DesignSelections {
  jewelryType?: string;
  setting?: string;
  shape?: string;
  origin?: string;
  carat?: number;
  color?: string;
  clarity?: string;
  metal?: string;
  band?: string;
  [key: string]: unknown;
}

// ── Vocabulary maps ───────────────────────────────────────────

const JEWELRY_TYPE_LABEL: Record<string, string> = {
  ring:     "ring",
  necklace: "necklace",
  bracelet: "bracelet",
  earring:  "earrings",
};

const SHAPE_LABEL: Record<string, string> = {
  round:    "round brilliant",
  oval:     "oval",
  cushion:  "cushion",
  princess: "princess",
  emerald:  "emerald cut",
  pear:     "pear shaped",
  marquise: "marquise",
  radiant:  "radiant",
  asscher:  "asscher",
  heart:    "heart-shaped",
};

const METAL_LABEL: Record<string, string> = {
  "yellow-gold":  "18k yellow gold",
  "white-gold":   "18k white gold",
  "rose-gold":    "18k rose gold",
  platinum:       "platinum",
};

const BAND_LABEL: Record<string, string> = {
  classic:      "continuous circular slim classic polished band",
  "knife-edge": "continuous circular realistic knife-edge band with crisp but wearable polished edges",
  twisted:      "continuous circular twisted band",
  "pave-band":  "continuous circular pavé-set band",
  "split-shank":"continuous circular split-shank band",
  bypass:       "continuous circular sculptural bypass band",
  milgrain:     "continuous circular milgrain-edge band",
  chevron:      "continuous circular chevron band",
};

const COLOR_LABEL: Record<string, string> = {
  colorless:   "D-F colorless",
  "near-colorless": "G-H near-colorless",
  yellow:      "fancy yellow",
  pink:        "fancy pink",
  blue:        "fancy blue",
  green:       "fancy green",
  champagne:   "fancy champagne",
  black:       "black",
};

// ── Background helper based on jewelry type + metal ──────────
function chooseBackground(jewelryType?: string, metal?: string): string {
  if (metal?.includes("yellow")) return "warm champagne silk";
  if (metal?.includes("rose"))   return "soft blush ceramic surface";
  if (jewelryType === "bracelet") return "dark brushed stone surface";
  return "matte black velvet";
}

// ── Main prompt builder ───────────────────────────────────────
export function buildImagePrompt(
  designSelections: DesignSelections,
  _designSummary: string
): string {
  const {
    jewelryType = "ring",
    setting = "solitaire",
    shape = "round",
    origin = "lab-grown",
    carat = 1.0,
    color = "colorless",
    clarity = "VS1",
    metal = "white-gold",
    band = "classic",
  } = designSelections;

  const typeLabel    = JEWELRY_TYPE_LABEL[jewelryType] ?? "jewelry piece";
  const shapeLabel   = SHAPE_LABEL[shape]   ?? shape;
  const metalLabel   = METAL_LABEL[metal]   ?? metal;
  const colorLabel   = COLOR_LABEL[color]   ?? color;
  const originLabel  = origin === "natural" ? "natural mined diamond" : "lab-grown diamond";
  const caratLabel   = `${carat.toFixed(2)} carats`;
  const clarityLabel = clarity;
  const background   = chooseBackground(jewelryType, metal);

  // 1. Realism Intro
  let prompt = `Photorealistic macro product photograph of a single real wearable ${typeLabel} in ${metalLabel}.`;

  // 2 & 3. Center Stone & Setting Logic
  if (jewelryType === "ring") {
    let settingDesc = "";
    const bandDesc = BAND_LABEL[band] || `continuous circular ${metalLabel} band`;

    const centerStoneDesc = `one ${colorLabel} ${shapeLabel} ${originLabel} center stone, approximately ${caratLabel}, ${clarityLabel} clarity, held by realistic ${metalLabel} prongs`;

    if (setting === "three-stone") {
      settingDesc = `The ring features ${centerStoneDesc}, flanked symmetrically by two smaller round brilliant white diamond side stones, each approximately 35–45% the visual size of the center stone.`;
    } else if (setting === "halo") {
      settingDesc = `The ring features ${centerStoneDesc}, surrounded by a delicate halo of tiny pavé diamonds.`;
    } else if (setting === "hidden-halo") {
      settingDesc = `The ring features ${centerStoneDesc}, with a subtle hidden halo visible only from the side/lower profile.`;
    } else if (setting === "solitaire") {
      settingDesc = `The ring features exactly ${centerStoneDesc}.`;
    } else {
      settingDesc = `The ring features ${centerStoneDesc} in a physically plausible ${setting} setting.`;
    }

    prompt += ` ${settingDesc} The ring has a ${bandDesc}, physically plausible band thickness, realistic metal basket construction under the center stone, accurate jewelry proportions, and refined handcrafted high-jewelry craftsmanship.`;

  } else if (jewelryType === "earring") {
    prompt += ` The earrings feature a ${setting} setting with ${colorLabel} ${shapeLabel} ${originLabel} stones (${caratLabel} total weight), held by realistic prongs with physically plausible construction.`;
  } else if (jewelryType === "necklace") {
    prompt += ` The necklace features a ${colorLabel} ${shapeLabel} ${originLabel} center stone (${caratLabel}) in a physically plausible setting on a delicate continuous chain.`;
  } else {
    prompt += ` The piece features a ${colorLabel} ${shapeLabel} ${originLabel} stone (${caratLabel}) with accurate jewelry proportions and handcrafted high-jewelry craftsmanship.`;
  }

  // 10 & 11. Photography Style & Background
  prompt += ` Professional 100mm macro jewelry photography, sharp focus on the ${typeLabel}, realistic diamond refraction, natural reflections, believable shadows under the ${typeLabel}, warm high-end studio lighting, ${background}, softly blurred background.`;

  // 12. Strong Negative Constraints
  prompt += ` No text, no logo, no watermark, no people, no hands, no extra jewelry, no duplicate center stones, no oversized side stones, no equal-sized three-stone layout unless explicitly selected, no floating stones, no melted metal, no broken band, no impossible geometry, no distorted ${typeLabel} shape, no malformed diamonds, no plastic-looking metal, no cartoon style, no CGI render look, no fantasy object, no cheap catalog look, no blurry image.`;

  return prompt;
}
