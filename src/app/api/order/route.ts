import { NextResponse } from "next/server";

const USERNAME_RE = /^[A-Za-z0-9_]{5,32}$/;

type OrderBody = {
  platform?: unknown;
  region?: unknown;
  denomination?: unknown;
  priceRub?: unknown;
  telegramUsername?: unknown;
  telegramUserId?: unknown;
};

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function sendTelegramMessage(
  token: string,
  chatId: string | number,
  text: string
): Promise<boolean> {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    }
  );
  const data: { ok?: boolean } = await response.json();
  return response.ok && Boolean(data.ok);
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
  const telegramUsername = asText(body.telegramUsername).replace(/^@/, "");
  const priceRub =
    typeof body.priceRub === "number"
      ? body.priceRub
      : Number.parseInt(asText(body.priceRub), 10);
  const telegramUserId =
    typeof body.telegramUserId === "number"
      ? body.telegramUserId
      : Number.parseInt(asText(body.telegramUserId), 10);

  if (!platform || !region || !denomination || !Number.isFinite(priceRub)) {
    return NextResponse.json(
      { success: false, error: "Заполните заказ" },
      { status: 400 }
    );
  }

  if (!USERNAME_RE.test(telegramUsername)) {
    return NextResponse.json(
      {
        success: false,
        error: "Telegram username: латиница, цифры и _, от 5 до 32 символов",
      },
      { status: 400 }
    );
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const managerChatId = process.env.TELEGRAM_MANAGER_CHAT_ID;

  if (!token || !managerChatId) {
    return NextResponse.json(
      { success: false, error: "Сервер не настроен" },
      { status: 500 }
    );
  }

  const managerText = `Новый заказ:
Платформа: ${platform}
Регион: ${region}
Номинал: ${denomination}
Сумма: ${priceRub} ₽
Telegram клиента: @${telegramUsername}`;

  const managerSent = await sendTelegramMessage(
    token,
    managerChatId,
    managerText
  );

  if (!managerSent) {
    return NextResponse.json(
      { success: false, error: "Не удалось отправить заказ" },
      { status: 502 }
    );
  }

  if (Number.isFinite(telegramUserId) && telegramUserId > 0) {
    await sendTelegramMessage(
      token,
      telegramUserId,
      "Ваш заказ оформлен. Менеджер свяжется с вами в ближайшее время."
    );
  }

  return NextResponse.json({ success: true });
}
