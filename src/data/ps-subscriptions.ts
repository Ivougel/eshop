export type PsCatalog = {
  id: string;
  title: string;
};

export type PsDuration = {
  months: number;
  title: string;
};

export type PsOffer = {
  id: string;
  catalogId: string;
  months: number;
  title: string;
  badge: string;
  priceRub: number;
  tone: "gold" | "orange" | "dark" | "blue";
};

export const psCatalogs: PsCatalog[] = [
  { id: "ps-plus", title: "PS Plus" },
  { id: "ea-play", title: "EA Play" },
];

export const psDurations: PsDuration[] = [
  { months: 1, title: "1 месяц" },
  { months: 3, title: "3 месяца" },
  { months: 12, title: "12 месяцев" },
];

export const psOffers: PsOffer[] = [
  { id: "plus-ess-1", catalogId: "ps-plus", months: 1, title: "PS Plus Essential", badge: "ESSENTIAL", priceRub: 1295, tone: "gold" },
  { id: "plus-ext-1", catalogId: "ps-plus", months: 1, title: "PS Plus Extra", badge: "EXTRA", priceRub: 1995, tone: "orange" },
  { id: "plus-dlx-1", catalogId: "ps-plus", months: 1, title: "PS Plus Deluxe", badge: "DELUXE", priceRub: 2295, tone: "dark" },
  { id: "plus-ess-3", catalogId: "ps-plus", months: 3, title: "PS Plus Essential", badge: "ESSENTIAL", priceRub: 3295, tone: "gold" },
  { id: "plus-ext-3", catalogId: "ps-plus", months: 3, title: "PS Plus Extra", badge: "EXTRA", priceRub: 5195, tone: "orange" },
  { id: "plus-dlx-3", catalogId: "ps-plus", months: 3, title: "PS Plus Deluxe", badge: "DELUXE", priceRub: 5995, tone: "dark" },
  { id: "plus-ess-12", catalogId: "ps-plus", months: 12, title: "PS Plus Essential", badge: "ESSENTIAL", priceRub: 8495, tone: "gold" },
  { id: "plus-ext-12", catalogId: "ps-plus", months: 12, title: "PS Plus Extra", badge: "EXTRA", priceRub: 13995, tone: "orange" },
  { id: "plus-dlx-12", catalogId: "ps-plus", months: 12, title: "PS Plus Deluxe", badge: "DELUXE", priceRub: 15995, tone: "dark" },
  { id: "ea-1", catalogId: "ea-play", months: 1, title: "EA Play", badge: "PLAY", priceRub: 795, tone: "orange" },
  { id: "ea-3", catalogId: "ea-play", months: 3, title: "EA Play", badge: "PLAY", priceRub: 1995, tone: "orange" },
  { id: "ea-12", catalogId: "ea-play", months: 12, title: "EA Play", badge: "PLAY", priceRub: 4595, tone: "orange" },
];

export const psPlusFeatures: Record<string, string[]> = {
  ESSENTIAL: [
    "Возможность играть по сети",
    "Бесплатные игры месяца",
    "Эксклюзивные скидки",
    "Облачное хранилище",
  ],
  EXTRA: [
    "Всё, что есть в Essential",
    "Игровой каталог ~400 игр",
    "Отдельный набор от Ubisoft",
    "Облачное хранилище",
  ],
  DELUXE: [
    "Всё, что входит в Essential",
    "Всё, что входит в Extra",
    "Каталог классических хитов Sony",
    "Эксклюзивные демо-версии",
  ],
};

export const eaPlayFeatures = [
  "Каталог лучших игр EA",
  "10 часов пробного доступа к новинкам",
  "Скидка 10% на игры и донат EA",
  "Ежемесячные награды и косметика",
];

export function getPsOffers(catalogId: string, months: number): PsOffer[] {
  return psOffers.filter(
    (offer) => offer.catalogId === catalogId && offer.months === months
  );
}
