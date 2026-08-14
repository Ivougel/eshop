export type RobloxOffer = {
  id: string;
  amount: number;
  priceRub: number;
  inStock: boolean;
};

export const robloxOffers: RobloxOffer[] = [
  { id: "rbx-80", amount: 80, priceRub: 335, inStock: true },
  { id: "rbx-100", amount: 100, priceRub: 415, inStock: true },
  { id: "rbx-200", amount: 200, priceRub: 790, inStock: false },
  { id: "rbx-400", amount: 400, priceRub: 1550, inStock: true },
  { id: "rbx-800", amount: 800, priceRub: 3050, inStock: true },
  { id: "rbx-1700", amount: 1700, priceRub: 4290, inStock: true },
  { id: "rbx-4500", amount: 4500, priceRub: 5655, inStock: true },
];

export const robloxGuide = [
  "Откройте roblox.com/redeem (или Настройки → Gift Cards)",
  "Войдите в свой аккаунт Roblox",
  "Введите код и нажмите Redeem",
  "Robux мгновенно зачислятся на баланс",
];
