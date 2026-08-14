export type XboxAccountKind = "new" | "own";

export type XboxPlan = {
  id: string;
  months: number;
  title: string;
  priceRub: number;
};

export const xboxPlans: XboxPlan[] = [
  { id: "xbox-1", months: 1, title: "1 месяц", priceRub: 1390 },
  { id: "xbox-2", months: 2, title: "2 месяца", priceRub: 1450 },
  { id: "xbox-4", months: 4, title: "4 месяца", priceRub: 2960 },
  { id: "xbox-6", months: 6, title: "6 месяцев", priceRub: 4260 },
  { id: "xbox-8", months: 8, title: "8 месяцев", priceRub: 5670 },
  { id: "xbox-10", months: 10, title: "10 месяцев", priceRub: 7520 },
];

export function perMonth(plan: XboxPlan): number {
  return Math.round(plan.priceRub / plan.months);
}
