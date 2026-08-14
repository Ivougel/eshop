import {
  getTelegramInitData,
  getTelegramUserId,
} from "@/components/TelegramInit";

export type CreatedOrder = {
  orderId: number;
  payUrl: string;
};

export async function submitOrder(input: {
  platform: string;
  region: string;
  denomination: string;
  priceRub: number;
}): Promise<{ ok: boolean; order?: CreatedOrder; error?: string }> {
  let telegramUserId = getTelegramUserId();
  if (!telegramUserId) {
    for (let attempt = 0; attempt < 12 && !telegramUserId; attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 80));
      telegramUserId = getTelegramUserId();
    }
  }

  try {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        telegramUserId,
        telegramInitData: getTelegramInitData(),
      }),
    });
    const data: {
      success?: boolean;
      error?: string;
      orderId?: number;
      payUrl?: string;
    } = await response.json();
    if (!response.ok || !data.success || !data.orderId || !data.payUrl) {
      return { ok: false, error: data.error ?? "Не удалось оформить заказ" };
    }
    return {
      ok: true,
      order: { orderId: data.orderId, payUrl: data.payUrl },
    };
  } catch {
    return { ok: false, error: "Не удалось оформить заказ" };
  }
}
