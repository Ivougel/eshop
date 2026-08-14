export type PsnRegion = {
  id: string;
  title: string;
  flagIcon: string;
  code: string;
};

export type PsnOffer = {
  id: string;
  regionId: string;
  amount: number;
  currency: string;
  symbol: string;
  priceRub: number;
};

export const psnRegions: PsnRegion[] = [
  { id: "tr", title: "Турция", flagIcon: "🇹🇷", code: "TR" },
  { id: "in", title: "Индия", flagIcon: "🇮🇳", code: "IN" },
  { id: "us", title: "США", flagIcon: "🇺🇸", code: "US" },
];

export const psnOffers: PsnOffer[] = [
  { id: "psn-tr-250", regionId: "tr", amount: 250, currency: "TRY", symbol: "₺", priceRub: 680 },
  { id: "psn-tr-500", regionId: "tr", amount: 500, currency: "TRY", symbol: "₺", priceRub: 1350 },
  { id: "psn-tr-750", regionId: "tr", amount: 750, currency: "TRY", symbol: "₺", priceRub: 2020 },
  { id: "psn-tr-1000", regionId: "tr", amount: 1000, currency: "TRY", symbol: "₺", priceRub: 2700 },
  { id: "psn-tr-1500", regionId: "tr", amount: 1500, currency: "TRY", symbol: "₺", priceRub: 4050 },
  { id: "psn-tr-2000", regionId: "tr", amount: 2000, currency: "TRY", symbol: "₺", priceRub: 5400 },
  { id: "psn-in-500", regionId: "in", amount: 500, currency: "INR", symbol: "₹", priceRub: 590 },
  { id: "psn-in-1000", regionId: "in", amount: 1000, currency: "INR", symbol: "₹", priceRub: 1090 },
  { id: "psn-in-2000", regionId: "in", amount: 2000, currency: "INR", symbol: "₹", priceRub: 2090 },
  { id: "psn-in-4000", regionId: "in", amount: 4000, currency: "INR", symbol: "₹", priceRub: 4090 },
  { id: "psn-us-10", regionId: "us", amount: 10, currency: "USD", symbol: "$", priceRub: 1190 },
  { id: "psn-us-25", regionId: "us", amount: 25, currency: "USD", symbol: "$", priceRub: 2790 },
  { id: "psn-us-50", regionId: "us", amount: 50, currency: "USD", symbol: "$", priceRub: 5390 },
  { id: "psn-us-100", regionId: "us", amount: 100, currency: "USD", symbol: "$", priceRub: 10490 },
];

export function getPsnOffers(regionId: string): PsnOffer[] {
  return psnOffers.filter((item) => item.regionId === regionId);
}

export function getPsnRegion(id: string): PsnRegion | undefined {
  return psnRegions.find((item) => item.id === id);
}
