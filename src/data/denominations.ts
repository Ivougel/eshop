import { platforms } from "./platforms";
import { regions } from "./regions";

export type Denomination = {
  id: string;
  platformId: string;
  regionId: string;
  amount: number;
  currency: string;
  priceRub: number;
  stockLeft: number;
};

const REGION_OFFERS: Record<
  string,
  { amount: number; currency: string; priceRub: number }[]
> = {
  tr: [
    { amount: 250, currency: "TRY", priceRub: 890 },
    { amount: 500, currency: "TRY", priceRub: 1690 },
    { amount: 750, currency: "TRY", priceRub: 2490 },
    { amount: 1000, currency: "TRY", priceRub: 3190 },
  ],
  in: [
    { amount: 500, currency: "INR", priceRub: 590 },
    { amount: 1000, currency: "INR", priceRub: 1090 },
    { amount: 2000, currency: "INR", priceRub: 2090 },
  ],
  pl: [
    { amount: 50, currency: "PLN", priceRub: 1290 },
    { amount: 100, currency: "PLN", priceRub: 2490 },
    { amount: 200, currency: "PLN", priceRub: 4790 },
  ],
  us: [
    { amount: 10, currency: "USD", priceRub: 1190 },
    { amount: 25, currency: "USD", priceRub: 2790 },
    { amount: 50, currency: "USD", priceRub: 5390 },
  ],
  gb: [
    { amount: 10, currency: "GBP", priceRub: 1390 },
    { amount: 20, currency: "GBP", priceRub: 2690 },
    { amount: 50, currency: "GBP", priceRub: 6490 },
  ],
  kz: [
    { amount: 5000, currency: "KZT", priceRub: 990 },
    { amount: 10000, currency: "KZT", priceRub: 1890 },
    { amount: 20000, currency: "KZT", priceRub: 3590 },
  ],
  de: [
    { amount: 10, currency: "EUR", priceRub: 1290 },
    { amount: 25, currency: "EUR", priceRub: 3090 },
    { amount: 50, currency: "EUR", priceRub: 5990 },
  ],
};

const STOCK_STUBS = [2, 4, 6, 8, 11, 14, 19, 23];

export const denominations: Denomination[] = platforms.flatMap(
  (platform, platformIndex) =>
    regions.flatMap((region, regionIndex) =>
      (REGION_OFFERS[region.id] ?? []).map((offer, offerIndex) => ({
        id: `${platform.id}-${region.id}-${offer.amount}`,
        platformId: platform.id,
        regionId: region.id,
        amount: offer.amount,
        currency: offer.currency,
        priceRub: offer.priceRub + platformIndex * 10,
        stockLeft:
          STOCK_STUBS[(platformIndex + regionIndex + offerIndex) % STOCK_STUBS.length],
      }))
    )
);

export function getDenominations(
  platformId: string,
  regionId: string
): Denomination[] {
  return denominations.filter(
    (item) => item.platformId === platformId && item.regionId === regionId
  );
}

export function getDenominationById(id: string): Denomination | undefined {
  return denominations.find((item) => item.id === id);
}
