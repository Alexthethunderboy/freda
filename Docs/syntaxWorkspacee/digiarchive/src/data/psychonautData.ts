export interface Terpene {
  name: string;
  aroma: string;
  effect: string;
  boilingPoint: string;
  color: string;
  description: string;
}

export const terpenes: Terpene[] = [
  {
    name: "Myrcene",
    aroma: "Earthy, Musky",
    effect: "Sedative",
    boilingPoint: "167°C",
    color: "#3B82F6", // Blue
    description: "The 'Couch-lock'. Found in Mangoes, Lemongrass, and Thyme.",
  },
  {
    name: "Limonene",
    aroma: "Citrus, Lemon",
    effect: "Mood Elevation",
    boilingPoint: "176°C",
    color: "#EAB308", // Yellow
    description: "Antifungal. Found in Citrus Rinds, Juniper, and Peppermint.",
  },
  {
    name: "Pinene",
    aroma: "Pine, Forest",
    effect: "Focus",
    boilingPoint: "155°C",
    color: "#22C55E", // Forest Green
    description: "Memory Retention. Bronchodilator. Found in Pine Needles and Rosemary.",
  },
  {
    name: "Linalool",
    aroma: "Floral, Lavender",
    effect: "Anxiety Relief",
    boilingPoint: "198°C",
    color: "#A855F7", // Lavender
    description: "Sleep Aid. Found in Lavender and Coriander.",
  },
];

export interface HistoryPoint {
  year: string;
  event: string;
  context: string;
}

export const historyPoints: HistoryPoint[] = [
  {
    year: "Pre-Colonial",
    event: "Sacred & Industrial use",
    context: "Widespread use of Cannabis in Africa for spiritual and industrial purposes.",
  },
  {
    year: "1966",
    event: "The Indian Hemp Decree",
    context: "The militarization of the plant in Nigeria, criminalizing its use.",
  },
  {
    year: "The Fela Era",
    event: "Kalakuta Republic",
    context: "Cannabis as resistance and spiritual fuel against oppressive systems.",
  },
  {
    year: "The Future",
    event: "Legalization & Freedom",
    context: "Legalization, Taxation, and Freedom of Consciousness.",
  },
];

export const factsTicker: string[] = [
  "FACT: The Endocannabinoid System (ECS) maintains homeostasis.",
  "TIP: Black Peppercorns (Caryophyllene) can reduce THC-induced anxiety.",
  "STATS: Nigeria is a top global consumer despite prohibition.",
  "RESEARCH: Terpenes synergize with cannabinoids in the 'Entourage Effect'.",
  "WISDOM: Indigenous cultures have used these plants for millennia.",
];
