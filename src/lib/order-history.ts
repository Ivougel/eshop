export type HistoryOrder = {
  orderId: number;
  platform: string;
  region: string;
  denomination: string;
  priceRub: number;
  createdAt: string;
};

const KEY = "icity-order-history";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function loadOrderHistory(): HistoryOrder[] {
  if (!canUseStorage()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isHistoryOrder).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export function saveOrderToHistory(order: HistoryOrder): void {
  if (!canUseStorage()) {
    return;
  }
  const next = [
    order,
    ...loadOrderHistory().filter((item) => item.orderId !== order.orderId),
  ];
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function formatHistoryWhen(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
}

export function formatHistorySum(priceRub: number): string {
  return `${priceRub.toLocaleString("ru-RU")} ₽`;
}

function isHistoryOrder(value: unknown): value is HistoryOrder {
  if (!value || typeof value !== "object") {
    return false;
  }
  const item = value as Partial<HistoryOrder>;
  return (
    typeof item.orderId === "number" &&
    typeof item.platform === "string" &&
    typeof item.region === "string" &&
    typeof item.denomination === "string" &&
    typeof item.priceRub === "number" &&
    typeof item.createdAt === "string"
  );
}
