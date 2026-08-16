import { getTelegramInitData } from "@/components/TelegramInit";
import { saveOrderToHistory } from "@/lib/order-history";

export type CreatedOrder = {
  orderId: number;
};

function hasInitHash(initData: string): boolean {
  return Boolean(initData && new URLSearchParams(initData).get("hash"));
}

export async function submitOrder(input: {
  platform: string;
  region: string;
  denomination: string;
  priceRub: number;
}): Promise<{ ok: boolean; order?: CreatedOrder; error?: string }> {
  window.Telegram?.WebApp?.ready();
  let telegramInitData = getTelegramInitData();
  if (!hasInitHash(telegramInitData)) {
    for (let attempt = 0; attempt < 4 && !hasInitHash(telegramInitData); attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 40));
      telegramInitData = getTelegramInitData() || telegramInitData;
    }
  }

  try {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        telegramInitData,
      }),
    });
    const raw = await response.text();
    let data: {
      success?: boolean;
      error?: string;
      orderId?: number;
    } = {};
    try {
      data = raw ? (JSON.parse(raw) as typeof data) : {};
    } catch {
      return {
        ok: false,
        error: "Не удалось оформить заказ. Откройте магазин внутри Telegram.",
      };
    }
    if (!response.ok || !data.success || !data.orderId) {
      return { ok: false, error: data.error ?? "Не удалось оформить заказ" };
    }
    saveOrderToHistory({
      orderId: data.orderId,
      platform: input.platform,
      region: input.region,
      denomination: input.denomination,
      priceRub: input.priceRub,
      createdAt: new Date().toISOString(),
    });
    return {
      ok: true,
      order: { orderId: data.orderId },
    };
  } catch {
    return { ok: false, error: "Не удалось оформить заказ" };
  }
}
