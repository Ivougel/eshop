const FACTOR: Record<string, number> = {
  tr: 1,
  in: 0.78,
};

export function priceForRegion(baseRub: number, regionId: string): number {
  const factor = FACTOR[regionId] ?? 1;
  return Math.max(50, Math.round((baseRub * factor) / 5) * 5);
}

export function formatRub(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}
