export type AppleRegion = {
  id: string;
  title: string;
  flagIcon: string;
  code: string;
};

export type AppleOffer = {
  id: string;
  regionId: string;
  amount: number;
  symbol: string;
  priceRub: number;
};

export const appleRegions: AppleRegion[] = [
  { id: "us", title: "США", flagIcon: "🇺🇸", code: "US" },
  { id: "tr", title: "Турция", flagIcon: "🇹🇷", code: "TR" },
  { id: "in", title: "Индия", flagIcon: "🇮🇳", code: "IN" },
];

export const appleOffers: AppleOffer[] = [
  { id: "apple-us-10", regionId: "us", amount: 10, symbol: "$", priceRub: 1095 },
  { id: "apple-us-15", regionId: "us", amount: 15, symbol: "$", priceRub: 1640 },
  { id: "apple-us-25", regionId: "us", amount: 25, symbol: "$", priceRub: 2740 },
  { id: "apple-us-50", regionId: "us", amount: 50, symbol: "$", priceRub: 5475 },
  { id: "apple-us-100", regionId: "us", amount: 100, symbol: "$", priceRub: 10950 },
  { id: "apple-tr-50", regionId: "tr", amount: 50, symbol: "₺", priceRub: 135 },
  { id: "apple-tr-100", regionId: "tr", amount: 100, symbol: "₺", priceRub: 270 },
  { id: "apple-tr-250", regionId: "tr", amount: 250, symbol: "₺", priceRub: 680 },
  { id: "apple-tr-500", regionId: "tr", amount: 500, symbol: "₺", priceRub: 1350 },
  { id: "apple-tr-1000", regionId: "tr", amount: 1000, symbol: "₺", priceRub: 2700 },
  { id: "apple-in-100", regionId: "in", amount: 100, symbol: "₹", priceRub: 120 },
  { id: "apple-in-500", regionId: "in", amount: 500, symbol: "₹", priceRub: 590 },
  { id: "apple-in-1000", regionId: "in", amount: 1000, symbol: "₹", priceRub: 1090 },
  { id: "apple-in-2000", regionId: "in", amount: 2000, symbol: "₹", priceRub: 2090 },
];

export function getAppleOffers(regionId: string): AppleOffer[] {
  return appleOffers.filter((item) => item.regionId === regionId);
}

export function getAppleRegion(id: string): AppleRegion | undefined {
  return appleRegions.find((item) => item.id === id);
}

export const appleGuide = [
  "Откройте App Store (или appstore.com/redeem)",
  "Войдите в Apple ID того же региона, что и карта",
  "Профиль → «Использовать подарочную карту или код»",
  "Введите код — баланс пополнится",
];
