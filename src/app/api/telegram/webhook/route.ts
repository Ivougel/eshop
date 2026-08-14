import { NextResponse } from "next/server";
import { rememberChat } from "@/lib/chats";
import { runtimeEnv } from "@/lib/env";
import { payKeyboard, payUrlFor, refreshOrderLink } from "@/lib/orders";
import { shopUrlWithSession } from "@/lib/session";
import { appUrlFrom, telegramCall } from "@/lib/telegram";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat: { id: number };
    from?: { id?: number; username?: string };
  };
  callback_query?: {
    id: string;
    data?: string;
    message?: {
      message_id: number;
      chat: { id: number };
    };
  };
};

async function sendStartMessage(token: string, chatId: number, webAppUrl: string) {
  await telegramCall(token, "sendMessage", {
    chat_id: chatId,
    text: "Выберите платформу — откроется магазин.",
    reply_markup: {
      inline_keyboard: [[{ text: "Открыть магазин", web_app: { url: webAppUrl } }]],
    },
  });
}

export async function POST(request: Request) {
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
    const userId = update.message?.from?.id ?? chatId;
    const shopUrl = shopUrlWithSession(appUrlFrom(request), userId);
    await telegramCall(token, "setChatMenuButton", {
      chat_id: chatId,
      menu_button: {
        type: "web_app",
        text: "Магазин",
        web_app: { url: shopUrl },
      },
    });
    await sendStartMessage(token, chatId, shopUrl);
  }

  const callback = update.callback_query;
  if (token && callback?.id) {
    const data = callback.data ?? "";
    const orderId = Number(data.replace("refresh:", ""));
    const order = Number.isFinite(orderId) ? refreshOrderLink(orderId) : undefined;
    if (order && callback.message) {
      const payUrl = payUrlFor(appUrlFrom(request), order);
      await telegramCall(token, "editMessageReplyMarkup", {
        chat_id: callback.message.chat.id,
        message_id: callback.message.message_id,
        reply_markup: payKeyboard(payUrl, order.id),
      });
      await telegramCall(token, "answerCallbackQuery", {
        callback_query_id: callback.id,
        text: "Ссылка обновлена",
      });
    } else {
      await telegramCall(token, "answerCallbackQuery", {
        callback_query_id: callback.id,
        text: "Заказ не найден. Оформите его заново в магазине.",
        show_alert: true,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
