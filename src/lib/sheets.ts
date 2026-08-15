import { runtimeEnv } from "@/lib/env";

export type SheetOrder = {
  id: number;
  createdAt: string;
  chatId: number;
  username: string;
  platform: string;
  denomination: string;
  region: string;
  priceRub: number;
  status: string;
};

type SheetsResponse = {
  ok?: boolean;
  orders?: SheetOrder[];
};

export function isSheetsConfigured(): boolean {
  return Boolean(runtimeEnv("GOOGLE_SHEETS_WEBHOOK_URL"));
}

export async function appendSheetOrder(order: SheetOrder): Promise<boolean> {
  const result = await callSheets({
    action: "append",
    ...order,
  });
  return Boolean(result?.ok);
}

export async function listSheetOrders(chatId: number): Promise<SheetOrder[]> {
  const result = await callSheets({
    action: "list",
    chatId,
  });
  if (!result?.ok || !Array.isArray(result.orders)) {
    return [];
  }
  return result.orders.filter((item) => Number(item.chatId) === chatId);
}

async function callSheets(
  payload: Record<string, unknown>
): Promise<SheetsResponse | undefined> {
  const url = runtimeEnv("GOOGLE_SHEETS_WEBHOOK_URL");
  if (!url) {
    return undefined;
  }

  const secret = runtimeEnv("GOOGLE_SHEETS_SECRET");
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...payload, secret }),
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const data = (await response.json().catch(() => ({}))) as SheetsResponse;
    if (!response.ok) {
      return undefined;
    }
    return data;
  } catch {
    return undefined;
  }
}
