import { NextResponse } from "next/server";
import { rememberChat } from "@/lib/chats";
import { runtimeEnv } from "@/lib/env";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat: { id: number };
    from?: { id?: number; username?: string };
  };
};

function appUrl(request: Request): string {
  const fromEnv = runtimeEnv("TELEGRAM_WEBAPP_URL").replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }

  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  return host ? `${proto}://${host}` : "";
}

async function sendStartMessage(chatId: number, webAppUrl: string) {
  const token = runtimeEnv("TELEGRAM_BOT_TOKEN");
  if (!token || !webAppUrl) {
    return;
  }

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: "Выберите платформу — откроется магазин.",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Открыть магазин",
              web_app: { url: webAppUrl },
            },
          ],
        ],
      },
    }),
  });
}

export async function POST(request: Request) {
  let update: TelegramUpdate;

  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const text = update.message?.text ?? "";
  const chatId = update.message?.chat.id;

  if (chatId) {
    rememberChat(chatId, update.message?.from?.username);
  }

  if (chatId && text.startsWith("/start")) {
    await sendStartMessage(chatId, appUrl(request));
  }

  return NextResponse.json({ ok: true });
}
