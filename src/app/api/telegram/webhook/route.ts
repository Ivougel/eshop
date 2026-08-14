import { NextResponse } from "next/server";
import { rememberChat } from "@/lib/chats";
import { runtimeEnv } from "@/lib/env";
import { appUrlFrom } from "@/lib/telegram";
import { sendWelcome } from "@/lib/welcome";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat: { id: number };
    from?: { id?: number; username?: string };
  };
};

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
      const sent = await sendWelcome(token, chatId, appUrlFrom(request));
      if (!sent) {
        return NextResponse.json({ ok: false }, { status: 502 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
