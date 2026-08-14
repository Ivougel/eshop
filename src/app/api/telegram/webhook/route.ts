import { NextResponse } from "next/server";
import { startKeyboard, startMessageHtml } from "@/data/bot-start";
import { rememberChat } from "@/lib/chats";
import { runtimeEnv } from "@/lib/env";
import { appUrlFrom, telegramCall } from "@/lib/telegram";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat: { id: number };
    from?: { id?: number; username?: string };
  };
};

async function sendStartMessage(token: string, chatId: number, webAppUrl: string) {
  await telegramCall(token, "sendMessage", {
    chat_id: chatId,
    text: startMessageHtml(),
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: startKeyboard(webAppUrl),
  });
}

export async function POST(request: Request) {
  try {
    let update: TelegramUpdate;

    try {
      update = await request.json();
    } catch {
      return NextResponse.json({ ok: true });
    }

    const token = runtimeEnv("TELEGRAM_BOT_TOKEN");
    const text = update.message?.text ?? "";
    const chatId = update.message?.chat.id;

    if (chatId) {
      rememberChat(
        chatId,
        update.message?.from?.username,
        update.message?.from?.id
      );
    }

    if (token && chatId && text.startsWith("/start")) {
      await sendStartMessage(token, chatId, appUrlFrom(request));
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
