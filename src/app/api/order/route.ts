import { NextResponse } from "next/server";
import { runtimeEnv } from "@/lib/env";
import { notifyOrderInBackground } from "@/lib/notify-order";
import { createOrder } from "@/lib/orders";
import { appUrlFrom } from "@/lib/telegram";
import { validateInitData } from "@/lib/validate-init-data";

export const runtime = "nodejs";

type OrderBody = {
  platform?: unknown;
  region?: unknown;
  denomination?: unknown;
  priceRub?: unknown;
  telegramInitData?: unknown;
};

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: OrderBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Некорректный запрос" },
      { status: 400 }
    );
  }

  const platform = asText(body.platform);
  const region = asText(body.region);
  const denomination = asText(body.denomination);
  const priceRub =
    typeof body.priceRub === "number"
      ? body.priceRub
      : Number.parseInt(asText(body.priceRub), 10);
  const telegramInitData = asText(body.telegramInitData);

  if (!platform || !region || !denomination || !Number.isFinite(priceRub) || priceRub <= 0) {
    return NextResponse.json(
      { success: false, error: "Заполните заказ" },
      { status: 400 }
    );
  }

  const token = runtimeEnv("TELEGRAM_BOT_TOKEN");
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Сервер не настроен" },
      { status: 500 }
    );
  }

  const validated = validateInitData(telegramInitData, token);
  if (!validated) {
    return NextResponse.json(
      { success: false, error: "Откройте магазин внутри Telegram" },
      { status: 401 }
    );
  }

  const chatId = validated.user.id;
  const order = createOrder({
    chatId,
    username: validated.user.username,
    platform,
    region,
    denomination,
    priceRub,
  });

  const managerId = Number(runtimeEnv("TELEGRAM_MANAGER_CHAT_ID"));
  notifyOrderInBackground({
    token,
    order,
    username: validated.user.username,
    managerId,
    webAppUrl: appUrlFrom(request),
  });

  return NextResponse.json({
    success: true,
    orderId: order.id,
  });
}
