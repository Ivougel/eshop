import { NextResponse } from "next/server";
import { botUsername } from "@/data/home";
import { runtimeEnv } from "@/lib/env";
import {
  createOrder,
  orderMessageHtml,
  payKeyboard,
  payUrlFor,
} from "@/lib/orders";
import { chatIdByUserId } from "@/lib/chats";
import { appUrlFrom, telegramCall } from "@/lib/telegram";

type OrderBody = {
  platform?: unknown;
  region?: unknown;
  denomination?: unknown;
  priceRub?: unknown;
  telegramUserId?: unknown;
  telegramInitData?: unknown;
};

function userIdFromInitData(initData: string): number | undefined {
  try {
    const raw = initData.trim();
    if (!raw) {
      return undefined;
    }
    const direct = new URLSearchParams(raw);
    let userRaw = direct.get("user");
    if (!userRaw) {
      const nested = direct.get("tgWebAppData");
      if (nested) {
        userRaw = new URLSearchParams(nested).get("user");
      }
    }
    if (!userRaw) {
      return undefined;
    }
    if (userRaw.includes("user=")) {
      return userIdFromInitData(userRaw);
    }
    const user = JSON.parse(userRaw) as { id?: number | string };
    const id = Number(user.id);
    return Number.isFinite(id) && id > 0 ? id : undefined;
  } catch {
    return undefined;
  }
}

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
  const telegramUserId =
    typeof body.telegramUserId === "number"
      ? body.telegramUserId
      : Number.parseInt(asText(body.telegramUserId), 10);
  const parsedId =
    Number.isFinite(telegramUserId) && telegramUserId > 0
      ? telegramUserId
      : userIdFromInitData(asText(body.telegramInitData));
  const chatId = parsedId ? chatIdByUserId(parsedId) : undefined;

  if (!platform || !region || !denomination || !Number.isFinite(priceRub)) {
    return NextResponse.json(
      { success: false, error: "Заполните заказ" },
      { status: 400 }
    );
  }

  const token = runtimeEnv("TELEGRAM_BOT_TOKEN");
  const baseUrl = appUrlFrom(request);

  if (!token || !baseUrl) {
    return NextResponse.json(
      { success: false, error: "Сервер не настроен" },
      { status: 500 }
    );
  }

  if (!chatId) {
    return NextResponse.json(
      { success: false, error: "Откройте магазин внутри Telegram" },
      { status: 400 }
    );
  }

  const order = createOrder(chatId, priceRub);
  const payUrl = payUrlFor(baseUrl, order);
  const delivered = await telegramCall(token, "sendMessage", {
    chat_id: chatId,
    text: orderMessageHtml(order.id, priceRub, botUsername),
    parse_mode: "HTML",
    reply_markup: payKeyboard(payUrl, order.id),
  });

  if (!delivered.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Не удалось отправить заказ. Напишите боту /start и попробуйте снова.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    orderId: order.id,
    payUrl,
  });
}
