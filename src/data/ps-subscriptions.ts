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
  { id: "plus-ess-1", catalogId: "ps-plus", months: 1, title: "PS Plus Essential", badge: "ESSENTIAL", priceRub: 990, tone: "gold" },
  { id: "plus-ext-1", catalogId: "ps-plus", months: 1, title: "PS Plus Extra", badge: "EXTRA", priceRub: 1490, tone: "orange" },
  { id: "plus-dlx-1", catalogId: "ps-plus", months: 1, title: "PS Plus Deluxe", badge: "DELUXE", priceRub: 1790, tone: "dark" },
  { id: "plus-ess-3", catalogId: "ps-plus", months: 3, title: "PS Plus Essential", badge: "ESSENTIAL", priceRub: 2690, tone: "gold" },
  { id: "plus-ext-3", catalogId: "ps-plus", months: 3, title: "PS Plus Extra", badge: "EXTRA", priceRub: 3990, tone: "orange" },
  { id: "plus-dlx-3", catalogId: "ps-plus", months: 3, title: "PS Plus Deluxe", badge: "DELUXE", priceRub: 4790, tone: "dark" },
  { id: "plus-ess-12", catalogId: "ps-plus", months: 12, title: "PS Plus Essential", badge: "ESSENTIAL", priceRub: 7990, tone: "gold" },
  { id: "plus-ext-12", catalogId: "ps-plus", months: 12, title: "PS Plus Extra", badge: "EXTRA", priceRub: 11990, tone: "orange" },
  { id: "plus-dlx-12", catalogId: "ps-plus", months: 12, title: "PS Plus Deluxe", badge: "DELUXE", priceRub: 14990, tone: "dark" },
  { id: "ea-1", catalogId: "ea-play", months: 1, title: "EA Play", badge: "PLAY", priceRub: 799, tone: "orange" },
  { id: "ea-pro-1", catalogId: "ea-play", months: 1, title: "EA Play Pro", badge: "PRO", priceRub: 1490, tone: "blue" },
  { id: "ea-3", catalogId: "ea-play", months: 3, title: "EA Play", badge: "PLAY", priceRub: 2190, tone: "orange" },
  { id: "ea-pro-3", catalogId: "ea-play", months: 3, title: "EA Play Pro", badge: "PRO", priceRub: 3990, tone: "blue" },
  { id: "ea-12", catalogId: "ea-play", months: 12, title: "EA Play", badge: "PLAY", priceRub: 6990, tone: "orange" },
  { id: "ea-pro-12", catalogId: "ea-play", months: 12, title: "EA Play Pro", badge: "PRO", priceRub: 11990, tone: "blue" },
];

export function getPsOffers(catalogId: string, months: number): PsOffer[] {
  return psOffers.filter(
    (offer) => offer.catalogId === catalogId && offer.months === months
  );
}
