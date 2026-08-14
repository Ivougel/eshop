import {
  closeMiniApp,
  getTelegramInitData,
  getTelegramUserId,
} from "@/components/TelegramInit";

export async function submitOrder(input: {
  platform: string;
  region: string;
  denomination: string;
  priceRub: number;
  telegramUsername: string;
}): Promise<{ ok: boolean; error?: string }> {
  let telegramUserId = getTelegramUserId();
  if (!telegramUserId) {
    for (let attempt = 0; attempt < 12 && !telegramUserId; attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 80));
      telegramUserId = getTelegramUserId();
    }
  }

  const telegramUsername = input.telegramUsername.replace(/^@/, "");

  try {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        telegramUsername,
        telegramUserId,
        telegramInitData: getTelegramInitData(),
      }),
    });
    const data: { success?: boolean; error?: string } = await response.json();
    if (!response.ok || !data.success) {
      return { ok: false, error: data.error ?? "Не удалось оформить заказ" };
    }
    window.setTimeout(() => closeMiniApp(), 2200);
    return { ok: true };
  } catch {
    return { ok: false, error: "Не удалось оформить заказ" };
  }
}
