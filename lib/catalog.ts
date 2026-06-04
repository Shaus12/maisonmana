export type Category = "rings" | "necklaces" | "earrings";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
  metalOptions: string[];
  shapeOptions?: string[];
  settingOptions?: string[];
  bandOptions?: string[];
}

export const CATALOG: Product[] = [
  // RINGS
  {
    id: "r-01",
    name: "Classic Solitaire Lab Diamond Ring",
    category: "rings",
    price: 3500,
    image: "https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&q=80&w=800",
    description: "A timeless solitaire ring featuring a brilliant lab-grown diamond set on a delicate band.",
    metalOptions: ["yellow-gold", "white-gold", "rose-gold", "platinum"],
    shapeOptions: ["round", "oval", "princess", "emerald", "pear", "marquise", "cushion"],
    settingOptions: ["solitaire", "four-prong"],
    bandOptions: ["classic", "knife-edge"]
  },
  {
    id: "r-02",
    name: "Hidden Halo Pave Engagement Ring",
    category: "rings",
    price: 4200,
    image: "https://images.unsplash.com/photo-1599643478514-4a11029cbb3b?auto=format&fit=crop&q=80&w=800",
    description: "An elegant pave band leading up to a stunning center stone, accented by a hidden halo.",
    metalOptions: ["yellow-gold", "white-gold", "platinum"],
    shapeOptions: ["round", "oval", "cushion"],
    settingOptions: ["hidden-halo"],
    bandOptions: ["pave-band", "scalloped-pave"]
  },
  {
    id: "r-03",
    name: "Three-Stone Diamond Ring",
    category: "rings",
    price: 5500,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800",
    description: "A breathtaking three-stone design symbolizing past, present, and future.",
    metalOptions: ["yellow-gold", "white-gold", "platinum"],
    shapeOptions: ["round", "emerald", "oval"],
    settingOptions: ["three-stone"],
    bandOptions: ["classic"]
  },

  // NECKLACES
  {
    id: "n-01",
    name: "Solitaire Diamond Pendant",
    category: "necklaces",
    price: 1800,
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800",
    description: "A classic and delicate solitaire diamond pendant on a fine gold chain.",
    metalOptions: ["yellow-gold", "white-gold", "rose-gold"],
    shapeOptions: ["round", "pear", "emerald"]
  },
  {
    id: "n-02",
    name: "Tennis Necklace",
    category: "necklaces",
    price: 8500,
    image: "https://images.unsplash.com/photo-1515562141207-7a8efd3839db?auto=format&fit=crop&q=80&w=800",
    description: "A continuous strand of perfectly matched lab-grown diamonds.",
    metalOptions: ["white-gold", "platinum"]
  },

  // EARRINGS
  {
    id: "e-01",
    name: "Diamond Stud Earrings",
    category: "earrings",
    price: 2200,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Essential diamond studs in a classic four-prong setting.",
    metalOptions: ["yellow-gold", "white-gold", "platinum"],
    shapeOptions: ["round", "princess", "emerald"]
  },
  {
    id: "e-02",
    name: "Diamond Hoop Earrings",
    category: "earrings",
    price: 3100,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800",
    description: "Elegant hoops lined with brilliant pave diamonds.",
    metalOptions: ["yellow-gold", "white-gold", "rose-gold"]
  }
];

export function getProductsByCategory(category: Category) {
  return CATALOG.filter(p => p.category === category);
}

export function getProductById(id: string) {
  return CATALOG.find(p => p.id === id);
}
