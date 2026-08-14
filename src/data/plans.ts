export type PlanOffer = {
  id: string;
  platformId: string;
  title: string;
  priceRub: number;
};

export const planOffers: PlanOffer[] = [
  {
    id: "xbox-ult-1",
    platformId: "xbox",
    title: "Game Pass Ultimate, 1 месяц",
    priceRub: 1490,
  },
  {
    id: "xbox-ult-3",
    platformId: "xbox",
    title: "Game Pass Ultimate, 3 месяца",
    priceRub: 3990,
  },
  {
    id: "xbox-ult-12",
    platformId: "xbox",
    title: "Game Pass Ultimate, 12 месяцев",
    priceRub: 11990,
  },
  {
    id: "gpt-plus",
    platformId: "ai",
    title: "ChatGPT Plus, 1 месяц",
    priceRub: 2490,
  },
  {
    id: "claude-pro",
    platformId: "ai",
    title: "Claude Pro, 1 месяц",
    priceRub: 2490,
  },
];

export function getPlanOffers(platformId: string): PlanOffer[] {
  return planOffers.filter((item) => item.platformId === platformId);
}
